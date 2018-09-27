{
	$name: 'DataCube.Query.Translators.SQLViewsTranslator2',
	$parent: 'DataCube.Query.Translators.SQLViewsTranslator',

	$server: {
		vendor: 'PostgreSQL',
		
		$require: [
		    'JSB.System.Config',

		    'DataCube.Query.Translators.TranslatorRegistry',
		    'DataCube.Providers.SqlTableDataProvider',
		    'DataCube.Query.QueryUtils',
		    'DataCube.Query.QuerySyntax',,
            'JSB.Store.Sql.JDBC',

            'DataCube.Query.Views.QueryViewsBuilder',

		    'DataCube.Query.Views.QueryView',
		    'DataCube.Query.Views.CubeView',
		    'DataCube.Query.Views.MultiView',
		    'DataCube.Query.Views.JoinView',
		    'DataCube.Query.Views.UnionsView',
		    'DataCube.Query.Views.DataProviderView',
		    'DataCube.Query.Views.SqlView',
		    'DataCube.Query.Views.NothingView',
        ],
        
        $bootstrap: function(){
        	TranslatorRegistry.register(this);
        },

		$constructor: function(providerOrProviders, cube){
		    $base(providerOrProviders, cube);
		    $this.config = {
		    }
		},

		translateQuery: function() {
		    // translate query
		    var sql = $this.translateQueryExpression($this.dcQuery, true);
		    QueryUtils.logDebug('\n[qid="{}"] Translated SQL Query (2): \n{}', $this.dcQuery.$id, sql);
            return sql;
		},

		translateQueryExpression: function(query, asRoot) {

            var sqlSource = '';
            if (typeof query === 'string') {
                sqlSource += $this._quotedName($this._translateContext(query));
                sqlSource +=  ' AS ' + $this._quotedName($this._translateContext(query));
            } else if (query.$provider) {
                sqlSource += $this._translateQueryProvider(query, asRoot);
                sqlSource += '';
            } else if (query.$from) {
                sqlSource += $this.translateQueryExpression(query.$from);
                sqlSource += '';
            } else if (query.$join) {
                sqlSource += $this._translateJoin(query);
                sqlSource += '';
            } else if (query.$union) {
                sqlSource += $this._translateUnion(query);
                sqlSource += '';
            } else {
                QueryUtils.throwError(0, 'Invalid source in query "{}"', query.$context);
            }

            var sql = '';

            if (asRoot || QueryUtils.queryHasBody(query)) {
                var selectSql = '';
                for(var alias in query.$select) {
                    var exp = query.$select[alias];
                    if (selectSql.length > 0) selectSql += ', ';
                    selectSql += $this._translateExpression(exp, query);
                    selectSql += ' AS ' + $this._quotedName(alias);
                }
                sql += '('
                sql += $this._translatePart('WITH\n', function(){
                    return $this._translateWith(query);
                }, '\n');
                sql += 'SELECT ' + (query.$distinct ? 'DISTINCT ' : '') + selectSql + ' FROM ';
                sql += sqlSource;

                sql += $this._translatePart(' WHERE ', function(){
                    return $this._translateWhere(query, $this._extractWhereOrHavingFilter(query, true));
                });
                sql += $this._translatePart(' GROUP BY ', function(){
                    return $this._translateGroup(query);
                });
                sql += $this._translatePart(' HAVING ', function(){
                    return $this._translateWhere(query, $this._extractWhereOrHavingFilter(query, false));
                });
                sql += $this._translatePart(' ORDER BY ', function(){
                    return $this._translateOrder(query);
                });
                sql += ')'
                if (!asRoot) {
                    sql += ' AS ' + $this._quotedName($this._translateContext(query.$context));
                }
            } else {
                sql += sqlSource;
            }

            return sql;
		},

//		_getProvider: function(id) {
//		    var provider = $this.cube.getProviderById(id);
//		    QueryUtils.throwError(provider, 'Data provider with id "{}" is undefined', id);
//		    return provider;
//		},

        _translatePart: function(prefix, valueCallback, suffix) {
            var value = valueCallback();
            return value ? (prefix||'') + value + (suffix||'') : '';
        },

        _translateWith: function(query) {
            var sql = '';

            for(var name in query.$views) {
                var viewQuery = query.$views[name];
                if (sql.length != 0) sql += ',\n';

                /// first translate query only then context name

                var sqlView = $this.translateQueryExpression(viewQuery, true);

                sql += $this._quotedName($this._translateContext(name));
                sql += ' AS ';
                sql += sqlView;
            }

            return sql;
        },

		_translateQueryProvider: function(query, asRoot){
		    var sql = '';
            /// поля датапровайдеров/таблиц без запроса отображаются напрямую
            sql += $this._printTableName(QueryUtils.getQueryDataProvider(query.$provider, $this.cube).getTableFullName());
            sql +=  ' AS ' + $this._quotedName($this._translateContext(query.$context));
            return sql;
		},

        _extractWhereOrHavingFilter: function(query, whereOrHaving /*where is true, having is false*/) {
            function isHaving(filteredField, filteredExpr){
                // is aggregated alias
                if (query.$select[filteredField]) {
                    var e = query.$select[filteredField];
                    if(QueryUtils.isAggregatedExpression(e)) {
                        // if source field
                        if (query.$from) {
                            var sourceQuery = JSB.isObject(query.$from) ? query.$from : $this.contextQueries[query.$from];
                            if (sourceQuery.$select[filteredField]) {
                                return false;
                            }
                        }
                        return true;
                    }
                }
                // is not simple cube field
                if (filteredExpr == filteredField || filteredExpr.$field == filteredField) {
                    return false;
                }
                // is in groupBy expression
                for(var i in query.$groupBy) {
                    var groupByExpr = query.$groupBy[i];
                    if (JSB.isEqual(groupByExpr, filteredExpr)) {
                        return true;
                    }
                }
                return false;
            }

            var filter = QueryUtils.filterFilterByFields(query.$filter || {}, query, function(filteredField, filteredExpr){
                return whereOrHaving
                        ? !isHaving.call(null, filteredField, filteredExpr)
                        : isHaving.call(null, filteredField, filteredExpr);
            });
            return filter ? filter : {};
        },

		_translateJoin: function(query) {
		    var sql = '';

		    sql += $this.translateQueryExpression(query.$join.$left);
		    sql += ' ' + query.$join.$joinType.toUpperCase() + ' JOIN ';
		    sql += $this.translateQueryExpression(query.$join.$right);
            sql += $this._translatePart(' ON ', function(){
                return $this._translateWhere(query, query.$join.$filter);
            });

		    return sql;
		},

		_translateUnion: function(query) {
		    function getQuery(ctx){
		        return $this.contextQueries[ctx];
		    }

		    var sql = '';

		    for(var i = 0; i < query.$union.length; i++) {
		        var subQuery = query.$union[i];
		        var fixedSubQuery = JSB.clone(subQuery);
		        for(var alias in query.$select) {
		            if (!fixedSubQuery.$select[alias]) {
		                fixedSubQuery.$select[alias] = {
		                    $const: null,
		                    $type: QueryUtils.extractType(query.$select[alias], query, $this.cube, getQuery),
                        };
		            }
		        }
                if (sql.length > 0) sql += ' UNION ALL ';
		        sql += $this.translateQueryExpression(fixedSubQuery, true);
		    }

		    sql = '(' + sql + ') AS ' + $this._quotedName($this._translateContext(query.$context));
		    return sql;
		},

        _translateRecursiveSelect: function (exp, dcQuery) {
            throw 'TODO';
        },

        _translateField: function(field, context, useAlias, callerContext) {
            var sql = $this._translateFieldInternal(field, context, useAlias, callerContext);
            var query = $this.contextQueries[context];
//            QueryUtils.logDebug(
//                    '\t field={}\tcontext={}\tcaller={}\talias={}\tsource={}\tsql={}',
//                    field, context, callerContext, useAlias,
//                    query.$from ? '$from' : query.$join ? '$join' : query.$union ? '$union' : query.$provider ? '$provider' : '',
//                    sql
//            );
//if (sql =='"Q0"."Вид мероприятия импортозамещения"') {
//    debugger;
//    $this._translateFieldInternal(field, context, useAlias, callerContext);
//}
            return sql;
        },

        _translateFieldInternal: function(field, context, useAlias, callerContext) {
            var query = $this.contextQueries[context];
            QueryUtils.throwError(query, 'Query context is undefined: {}', context);

            if (query.$from) {

                var sourceQuery = JSB.isObject(query.$from) ? query.$from : $this.contextQueries[query.$from];
                QueryUtils.throwError(sourceQuery, 'Source query is undefined with context: {}', query.$from.$context||query.$from);

                /// is source field
                if (sourceQuery.$select[field]) {
                    if (!sourceQuery.$from && !QueryUtils.queryHasBody(sourceQuery)) {
                        return $this._translateExpression(sourceQuery.$select[field], sourceQuery);
                    }
                    return $this._quotedName($this._translateContext(sourceQuery.$context)) + '.' + $this._quotedName(field);
                }

            } else if (query.$join) {

                /// is source field
                if (query.$join.$left.$select[field]) {
                    return $this._translateExpression(query.$join.$left.$select[field], query.$join.$left);
                }
                if (query.$join.$right.$select[field]) {
                    return $this._translateExpression(query.$join.$right.$select[field], query.$join.$right);
                }

            } else if (query.$union) {
                return $this._quotedName($this._translateContext(context)) + '.' + $this._quotedName(field);
            } else if (query.$provider) {

                var provider = QueryUtils.getQueryDataProvider(query.$provider, $this.cube);

                /// is source field (of provider)
                var providerField = provider.extractFields()[field];
                if (providerField) {
                    return $this._quotedName($this._translateContext(context)) + '.' + $this._quotedName(field);
                }

            } else {
                QueryUtils.throwError(false, 'Undefined source of query with context: {}', context);
            }

            if (context != callerContext) {
                var callerQuery = $this.contextQueries[callerContext];
                QueryUtils.throwError(callerQuery, 'Caller query context is undefined: {}', callerContext);
                // is join filter (link to $left or $right query)
                if (callerQuery.$join && (query == callerQuery.$join.$left || query == callerQuery.$join.$right)) {
                    return $this._translateExpression(query.$select[field], query);
                }
            }

            if (useAlias) {
                return $this._quotedName(field);
            }

            /// is export alias
            QueryUtils.throwError(context == callerContext, 'Field context not equals query context for field {}.{} (caller {})', context, field, callerContext);
            return $this._quotedName(field);
        },

		translateError: function(error) {
		    // TODO: translateError
		    return error;
		},

		close: function() {
		    $base();
		},
	},
}