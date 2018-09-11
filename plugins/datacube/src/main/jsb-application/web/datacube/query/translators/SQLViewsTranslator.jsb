{
	$name: 'DataCube.Query.Translators.SQLViewsTranslator',
	$parent: 'DataCube.Query.Translators.SQLTranslator',

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

        withContextViews: {},
        
        $bootstrap: function(){
        	TranslatorRegistry.register(this);
        },

		$constructor: function(providerOrProviders, cubeOrQueryEngine){
		    $base(providerOrProviders, cubeOrQueryEngine);
		    $this.config = {
//		        printIsolatedQueriesInWith: Config.get('datacube.query.translateExtractedIsolatedViews'),
//		        excludeProviderWrappers: Config.get('datacube.query.excludeProviderWrappers'),
		    }
//debugger
		},

		translateQuery: function() {
		    $this._verifyFields();

		    // build QueryView and nested views
		    $this.buildViews();
		    $this._buildUsedFields();

		    // translate query
		    var sql = $this.translateQueryExpression($this.dcQuery);
		    QueryUtils.logDebug('\n[qid='+$this.dcQuery.$id+'] Translated SQL Query (2): \n' + sql);
            return sql;
		},

		translateQueryExpression: function(query) {
            var queryView = $this._findQueryView(query.$context);
            var sql = $this._translateAnyView(queryView);
            if (queryView instanceof DataProviderView && sql.indexOf('SELECT') == -1) {
//debugger;
                //sql = '(SELECT * FROM ' + sql + ')';
                var selectSql = '';
                var fields = queryView.listFields();
                for(var i=0; i < fields.length; i++) {
                    var name = fields[i];
                    if (!queryView.usedFields || queryView.usedFields.length == 0 || queryView.usedFields[name]) {
                        var field = queryView.getField(name);
                        if (selectSql.length > 0) selectSql += ', ';
                        selectSql += $this._quotedName(field.providerField);
                        selectSql += ' AS ' + $this._quotedName(name);
                    }
                }
                sql = '(SELECT ' + selectSql + ' FROM ' + sql + ')';
            }
            return sql;
		},

		translateError: function(error) {
            function buildInfo(){
                if (this.providerField) {
                    try {
                        var cubeField = $this.cubeFields[this.field];
                        for(var b = 0; b < cubeField.binding.length; b++) {
                            var bind = cubeField.binding[b];
                            if (bind.provider.id == this.providerId) {
                                var provider = bind.provider;
                                var field = provider.extractFields({comment:true})[this.providerField];
                                if (field) {
                                    if (field.comment && field.comment.name && this.providerField != field.comment.name) {
                                        return 'cube field "'+this.field+'" (provider "'+provider.name+'", name "'+field.comment.name+'", column "'+this.origName+'")';
                                    } else {
                                        return 'cube field "'+this.field+'" (provider "'+provider.name+'", column "'+this.origName+'")';
                                    }
                                } else {
                                    // not existed in provider
                                    return 'cube field "'+this.field+'" (provider "'+provider.name+'", column "'+this.origName+'")';
                                }
                            }
                        }
                    }catch(e) {
                        Log.error(e);
                        return 'field "' + this.field + '" (context "' + this.queryContext + '", SQL column "' + this.origName + '")';
                    }
                } else {
                    return 'field "' + this.field + '" (context "' + this.queryContext + '", SQL column "' + this.origName + '")';
                }
            }

            function findInfo(origName) {
                for(var context in $this.contextQueryViews) {
                    var queryView = $this.contextQueryViews[context];
                    var sourceView = queryView.getSourceView();
                    if (sourceView) {
                        var sourceFields = sourceView.listFields();
                        for(var f = 0; f < sourceFields.length; f++) {
                            var sourceField = sourceView.getField(sourceFields[f]);
                            var sourceOriginalField = sourceView.getOriginalField(sourceFields[f]) || sourceField;

                            if (sourceField && origName == sourceField.context + '.' + sourceField.providerField
                                    || sourceOriginalField && origName == sourceOriginalField.context + '.' + sourceOriginalField.providerField) {

                                return buildInfo.call({
                                    origName: origName,
                                    field: sourceFields[f],
                                    queryContext: queryView.getContext(),
                                    providerId: sourceOriginalField.providerId,
                                    providerField: sourceOriginalField.providerField,
                                });
                            }
                        }

                    }
                }
                return null;
            }


            var reg = /column\s*\"?(.*?[^\"].*?)\"?\s/g;
            var message = error.message.replace(reg, function(s, name) {
                var info = findInfo(name);
                return info ? info : name;
            });

            message = message.replace(/\sPosition:\s*(\d*)/, function(s, pos){
                return "SQL position: " + pos + ' (for get SQL use analyze)';
            });

		    return new Error(message);
		},

		_buildUsedFields: function(){
            // check if query without source or build cube
            var usedFields = {/**usages*/};
            if(!$this.cube) {
                QueryUtils.walkDataProviderFields($this.dcQuery, /**includeSubQueries=*/true, $this.providers[0],
                    function(field, context, query){
                        if (!usedFields[field]) {
                            usedFields[field] = 0;
                        }
                        usedFields[field]++;
                    }
                );
            } else {
                QueryUtils.walkCubeFields($this.dcQuery, /**includeSubQueries=*/true, $this.cube,
                    function(field, context, query, binding){
                        if (!usedFields[field]) {
                            usedFields[field] = 0;
                        }
                        usedFields[field]++;
                    }
                );
            }
            $this.usedFields = usedFields;
		},

        _translateWith: function(query){
            if (query.$context != $this.dcQuery) {
                return '';
            }
            var sql = '';
            if ($this.dcQuery.$id && $this.dcQuery.$id == query.$id) {
                var views = $this._orderedIsolatedViews(query);
                for(var i in views) {
                    var view = views[i];
                    if (!$this.withContextViews[view.getContext()]) {
                        if (sql.length != 0) sql += ',\n';
                        sql += $this._quotedName($this._translateContext(view.getContext()));
                        sql += ' AS ';
                        sql += $this._translateWithQueryView(view);
                        sql += '';
                        $this.withContextViews[view.getContext()] = view.getContext();
                    }
                }
                if (sql.length > 0) {
                    sql = 'WITH\n' + sql;
                    sql += '\n';
                }
            }
            return sql ;
        },

        _findQueryView: function(context){
            var queryView = $this.contextQueryViews[context];
            if (!queryView) {
                throw new Error('Internal error: Cannot find View for query ' + context);
            }
            return queryView;
        },

        _declareViewField: function(viewField, query) {
//if (viewField.field.indexOf('comment') != -1) debugger;
            var sql;
            if (viewField.provider) {
                sql = $this._printTableName(viewField.provider.getTableFullName()) +
                    '.' + $this._quotedName(viewField.providerField);
            } else if (viewField.expr) {
                sql = $this._translateExpression(viewField.expr, query)
            } else if (viewField.context && viewField.field) {
                sql = $this._quotedName($this._translateContext(viewField.context)) +
                    '.' + $this._quotedName(viewField.providerField || viewField.field);
            }
            if(!sql) throw new Error('Internal error: Unknown field');
            sql += ' AS ' + $this._quotedName(viewField.field);
            return sql;
        },

        _translateField: function(name, context, useAlias, callerContext) {

//if (name.indexOf("ID_термина") != -1) debugger;
//if (context == 'RightWrapper:DataProvider[1#1]:d5f2c471d705fe580f141f9a62ecdc78|dp_8ef6b67011879d53cf0d55744b7bd9a7') debugger;
//if (context == 'RightWrapper:DataProvider[1#1]:d5f2c471d705fe580f141f9a62ecdc78|dp_8ef6b67011879d53cf0d55744b7bd9a7') debugger;

            // TODO адресация полей по контексту может быть:
            // а) сверху - когда запрос используется в качестве источника, подставляется выходное поле
            // callerContext/$from/$context=context
            // б) снизу - когда адресация идет из вложенного запроса в рамках текущего
            //    положения курсора источника, подставляется поле источника


            var view = $this._findQueryView(context);

            // if call as source - use query result fields
            if (callerContext != context) {
                var callerView = $this._findQueryView(callerContext);
                if (callerView instanceof QueryView && callerView.getSourceView().name == view.name){
                    var desc = view.getField(name);
                    return $this._translateViewField(desc);
                } else if (callerView instanceof JoinView) {
                    if (callerView.rightView.name == view.name || callerView.leftView.name == view.name) {
//                        var desc = view.getField(name);
//                        return $this._translateViewField(desc);
                        return $this._translateField(name, context, false, context);
                    }
                }
            }

            // if self field - use alias as-is
            if (useAlias) {
                var desc = view.getField(name);
                if (desc && desc.context && desc.context == callerContext) {
                    desc = JSB.clone(desc);
                    delete desc.context;
                    return $this._translateViewField(desc);
                }
            }

            // if source field
            if (view instanceof QueryView) {
                desc = view.sourceView.getField(name);
                if (desc) {
//                    // try optimize provider wrapper
//                    if (desc && desc.context) {
//                        var sourceView = $this._findQueryView(desc.context);
//                        if ($this.config.excludeProviderWrappers && sourceView instanceof QueryView && sourceView.isProviderWrapper()) {
//                            return $this._translateField(name, desc.context, false, callerContext);
//                        }
//                    }
                    return $this._translateViewField(desc);
                }
            }

            // if query field
            var desc = view.getField(name);
            if (!desc) {
                // unknown field: print as-is
                return $this._quotedName(name);
            }
            return $this._translateViewField(desc);
        },

		_translateViewField: function(viewField) {
            if (viewField.alias && viewField.context) {
                return $this._quotedName($this._translateContext(viewField.context)) +
                    '.' + $this._quotedName(viewField.alias);

            } else if (viewField.providerField && viewField.context) {
                return $this._quotedName($this._translateContext(viewField.context)) +
                    '.' + $this._quotedName(viewField.providerField);

            } else if (viewField.providerField  && viewField.provider) {
                return $this._printTableName(viewField.provider.getTableFullName()) +
                    '.' + $this._quotedName(viewField.providerField);

            } else if (viewField.field && viewField.context) {
                return $this._quotedName($this._translateContext(viewField.context)) +
                    '.' + $this._quotedName(viewField.field);

            } else if (viewField.field) {
                return $this._quotedName(viewField.field);
            }
            throw new Error('Internal error: Unknown field descriptor type');
		},

        _translateFrom: function(query) {
            var sourceView = $this._findQueryView(query.$context).getSourceView();
            var sql = $this._translateAnyView(sourceView);
            return sql;
        },

        _translateAnyView: function(view) {
            var sql;
            if(view instanceof QueryView) {
                sql = $this._translateQueryView(view);
            } else if(view instanceof CubeView) {
                sql = $this._translateAnyView(view.getView());
            } else if(view instanceof UnionsView) {
                sql = $this._translateUnionsView(view);
            } else if(view instanceof JoinView) {
                sql = $this._translateJoinView(view);
            } else if(view instanceof DataProviderView) {
                /// if as-is return table name or generate subquery

                if (!view.query
                        || !view.query.$filter
                        && !view.query.$groupBy
                        && !view.query.$sort
                        && !view.query.$limit
                        && !view.query.$offset
                    ) {
                    sql = $this._printTableName(view.getProvider().getTableFullName());
                } else {
                    sql = $this._translateQueryView(view);
                }
            } else if(view instanceof SqlView) {
                sql = view.getSql();
            } else if(view instanceof NothingView) {
                sql = '';
            } else {
                throw new Error('Internal error: unknown view type ' + view.getJsb ? view.getJsb.$name : typeof view);
            }
            return sql;
        },

//        _translateDataProviderViewAsQuery: function(view) {
//debugger;
//
//            var query = view.getQuery();
//
//            var sql = $this._translateWith(query);
//
//            var from  = $this._printTableName(view.getProvider().getTableFullName());
//            var columns = $this._translateSelectColumns(view);
//
//            var where = $this._translateWhere(query, $this._extractWhereOrHavingFilter(query, true));
//            var group = $this._translateGroup(query);
//            var having = $this._translateWhere(query, $this._extractWhereOrHavingFilter(query, false));
//            var order = $this._translateOrder(query);
//
//            var offset = query.$offset ? ' OFFSET ' + query.$offset: '';
//            var limit = query.$limit ? ' LIMIT ' + query.$limit: '';
//
//            from = from ? ' FROM ' + from : ' ';
//            where = where ? ' WHERE ' + where : ' ';
//            group = group ? ' GROUP BY ' + group : ' ';
//            having = having ? ' HAVING ' + having : ' ';
//            order = order ? ' ORDER BY ' + order : ' ';
//            sql += 'SELECT ' + columns + from + where + group + having + order + offset + limit + '';
//            return query.$context != $this.dcQuery.$context ? '('+sql+')': sql;
//        },

        _translateWithQueryView: function(view) {
            return $this._translateQueryView(view);
        },

        _translateRecursiveSelect: function (exp, dcQuery) {

            function translateRecursive(){
                var startQuery = {
                    $context: 'start:' + dcQuery.$context,
                    $select: {
                        id: exp.$idField.$field||exp.$idField,
                        parentId: exp.$parentIdField.$field||exp.$parentIdField,
                        value: exp.$aggregateExpr[aggFunc],
                    },
                    $filter: {
                        $eq: [
                            exp.$idField.$field||exp.$idField,
                            {$field:exp.$idField.$field||exp.$idField, $context: dcQuery.$context}
                        ]
                    }
                };
                var recursiveQuery = {
                    $context: 'recursive:' + dcQuery.$context,
                    $select: {
                        id: exp.$idField.$field||exp.$idField,
                        parentId: exp.$parentIdField.$field||exp.$parentIdField,
                        value: exp.$aggregateExpr[aggFunc],
                    }
                };
                if (dcQuery.$from) {
                    startQuery.$from = dcQuery.$from;
                    startQuery.$views = $this.dcQuery.$views;
                    recursiveQuery.$from = dcQuery.$from;
                    recursiveQuery.$views = $this.dcQuery.$views;
                }
                try {
                    var builder1 = new QueryViewsBuilder(startQuery, $this.cube, $this.providers);
                    var startView = builder1.build();

                    var builder2 = new QueryViewsBuilder(recursiveQuery, $this.cube, $this.providers);
                    var recursiveView = builder2.build();

                    JSB.merge($this.contextQueryViews, builder1.getContextQueryViews());
                    JSB.merge($this.contextQueryViews, builder2.getContextQueryViews());

                } finally {
                    builder1 && builder1.destroy();
                    builder2 && builder2.destroy();
                }

                var sql = '';
                sql += $this._translateAnyView(startView);
                sql += ' UNION ALL ';
                sql += $this._translateAnyView(recursiveView);
                if(sql.endsWith(')')) {
                    // HACK: paste join on before ')'
                    sql = sql.substring(0, sql.length-1);
                    sql += ' JOIN ' + $this._quotedName(treeContext);
                    sql += ' ON ' + $this._translateField(exp.$parentIdField.$field||exp.$parentIdField, recursiveView.name, false, recursiveView.name)
                        + ' = '
                        + $this._quotedName(treeContext) + '.id';
                    sql += ')';
                } else {
                    throw new Error('Internal error: Invalid query format, unexpected end');
                }
                return sql;
            }

            var aggFunc = Object.keys(exp.$aggregateExpr)[0];
            if (!QuerySyntax.schemaAggregateOperators[aggFunc]) {
                throw new Error('Operator $recursiveSelect supports only aggregate function in $aggregateExpr');
            }

            var view = $this._findQueryView(dcQuery.$context);
            if (!view) {
                throw new Error('Query view not found: ' + dcQuery.$context);
            }

            if (!(JSB.isString(exp.$idField) || exp.$idField.$field)
                && !(JSB.isString(exp.$parentIdField) || exp.$parentIdField.$field)
                ) {
                throw new Error('Operator $recursiveSelect supports only fields in $idField and $parentIdField');
            }

            var treeContext = 'tree:' + dcQuery.$context;
            var sql = '';
            sql += 'WITH RECURSIVE ' +  $this._quotedName(treeContext) + ' AS (';
            sql += translateRecursive();
            sql += ')';
            sql += ' SELECT ' + $this._translateExpression((function(){
                var val = {};
                val[aggFunc] = "value";
                return val;
            })(), dcQuery);
            sql += ' FROM ' + $this._quotedName(treeContext);

            return '(' + sql + ')';
        },

//        _translateQueryViewAsRecursive: function(view) {
//
//            function translateRecursive(upOrDown, recursiveContext) {
//                var sql = '';
//
//                // start query (embed $startFilter)
//                if (originalQuery.$recursiveTree.$startFilter == null) {
//                    throw new Error('$startFilter is not defined in ' +  view.name);
//                }
//                if (!view.query.$filter) view.query.$filter = {};
//                if (!view.query.$filter.$and) view.query.$filter.$and = [];
//                view.query.$filter.$and.push(originalQuery.$recursiveTree.$startFilter);
//
//                sql += $this._translateQueryView(view);
//                sql += ' UNION ALL ';
//
//                // recursive query with join
//                view.query.$filter = originalQuery.$filter;
//                sql += $this._translateQueryView(view);
//                sql += ' JOIN ' + $this._quotedName(recursiveContext);
//                function createField(e, context){
//                    if(!(typeof e == 'string' || JSB.isObject(typeof e) && typeof e.$field == 'string')) {
//                        throw new Error('Operator $recursiveTree supports only fields');
//                    }
//                    return typeof e == 'string'
//                         ? {$field: e, $context: context}
//                         : {$field: e.$field, $context: context};
//                }
//                function translateField(f) {
//                    var field = JSB.clone(view.lookupField(f.$field));
//                    if (f.$context == recursiveContext) {
//                        field.context = recursiveContext;
//                        for(var alias in originalQuery.$select) {
//                            if (originalQuery.$select[alias] == f.$field) {
//                                field.field = alias;
//                                field.alias = alias;
//                                return $this._translateViewField(field);
//                            }
//                        }
//                        throw new Error('Cannot find field "' + f.$field + '" in ' + originalQuery.$context);
//                    }
//                    return $this._translateViewField(field);
//
//                }
//                $this.contextQueryViews[recursiveContext] = view;
//                if (upOrDown) {
//                    sql += ' ON '
//                        + translateField(createField(originalQuery.$recursiveTree.$idField))
//                        + ' = '
//                        + translateField(createField(originalQuery.$recursiveTree.$parentIdField, recursiveContext));
//                } else {
//                    sql += ' ON '
//                        + translateField(createField(originalQuery.$recursiveTree.$idField, recursiveContext))
//                        + ' = '
//                        + translateField(createField(originalQuery.$recursiveTree.$parentIdField));
//                }
//                delete $this.contextQueryViews[recursiveContext];
//                return sql;
//            }
////debugger
//            // reuse query view as template for translate sub views
//            var originalQuery = view.query;
//
//            view.query = JSB.clone(view.query);
//            delete view.query.$recursiveTree;
//
//            var sql = '(';
//
//            if (originalQuery.$recursiveTree.$direction != -1) {
//                var recursiveContext = 'UP:' + view.name;
//                sql += '(WITH RECURSIVE ' +  $this._quotedName(recursiveContext) + ' AS (';
//                sql += translateRecursive(true, recursiveContext);
//                sql += ')';
//                sql += ' SELECT * FROM ' + $this._quotedName(recursiveContext) + ')';
//            }
//
//            if (originalQuery.$recursiveTree.$direction != 1 && originalQuery.$recursiveTree.$direction != -1) {
//                sql += ' UNION ALL ';
//            }
//
//            if (originalQuery.$recursiveTree.$direction != 1) {
//                var recursiveContext = 'DOWN:' + view.name;
//                sql += '(WITH RECURSIVE ' +  $this._quotedName(recursiveContext) + ' AS (';
//                sql += translateRecursive(false, recursiveContext);
//                sql += ')';
//                sql += ' SELECT * FROM ' + $this._quotedName(recursiveContext) + ')';
//            }
//
//            sql += ')';
//
//            if (originalQuery.$distinct) {
//                sql = '(SELECT DISTINCT * FROM ' + sql + 'AS ' + $this._quotedName(originalQuery.$context) + ')';
//            }
//
//            // repair
//            view.query = originalQuery;
//
//            return sql;
//        },

        _translateQueryView: function(view) {
            if ($this.withContextViews[view.getContext()]) {
                return $this._quotedName($this._translateContext($this.withContextViews[view.getContext()]));
            }

            var query = view.getQuery();

            var sql = $this._translateWith(query);
            if (view instanceof DataProviderView) {
                var from  = $this._printTableName(view.getProvider().getTableFullName()) +
                        ' AS ' + $this._quotedName($this._translateContext(view.getContext()));
            } else if (view instanceof QueryView){
                var from  = $this._translateSourceView(view.getSourceView(), view.getSourceView().getContext());
            }
            var columns = $this._translateSelectColumns(view);
            var where = $this._translateWhere(query, $this._extractWhereOrHavingFilter(view, true));
            var group = $this._translateGroup(query);
            var having = $this._translateWhere(query, $this._extractWhereOrHavingFilter(view, false));
            var order = $this._translateOrder(query);

            var offset = query.$offset ? ' OFFSET ' + query.$offset: '';
            var limit = query.$limit ? ' LIMIT ' + query.$limit: '';

            from = from ? ' FROM ' + from : ' ';
            where = where ? ' WHERE ' + where : ' ';
            group = group ? ' GROUP BY ' + group : ' ';
            having = having ? ' HAVING ' + having : ' ';
            order = order ? ' ORDER BY ' + order : ' ';
            var distinct = query.$distinct ? 'DISTINCT ' : '';
            sql += 'SELECT ' + distinct + columns + from + where + group + having + order + offset + limit + '';
            return query.$context != $this.dcQuery.$context ? '('+sql+')': sql;
        },

        _translateSourceView: function(sourceView, context) {
//debugger;
            if (sourceView instanceof JoinView) {
                return $this._translateAnyView(sourceView);
            }
            return $this._translateAnyView(sourceView) +
                ' AS ' + $this._quotedName($this._translateContext(context));
        },

        _extractWhereOrHavingFilter: function(view, whereOrHaving /*where is true, having is false*/) {
            function isHaving(filteredField, filteredExpr){
                // is aggregated alias
                if (query.$select[filteredField]) {
                    var e = query.$select[filteredField];
                    if(QueryUtils.isAggregatedExpression(e)) {
                        // if source field
                        if(view.getSourceView().getField(filteredField)) {
                            return false;
                        } else {
                            return true;
                        }
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

            var query = view.getQuery();
            var filter = QueryUtils.filterFilterByFields(query.$filter || {}, function(filteredField, filteredExpr){
                return whereOrHaving
                        ? !isHaving.call(null, filteredField, filteredExpr)
                        : isHaving.call(null, filteredField, filteredExpr);
            });
            return filter ? filter : {};
        },

        _translateSelectColumns: function(view){
            var sqlColumns = '';
            var fields = view.listFields();
            for (var i = 0; i < fields.length; i++) {
                if (sqlColumns.length > 0) sqlColumns += ', ';
                var field = fields[i];
                sqlColumns += $this._declareViewField(view.getField(field), view.getQuery());
            }
            if (sqlColumns.length == 0) sqlColumns += 'NULL';
            return sqlColumns;
        },

        _translateUnionsView: function(unionsView) {
            var unionsFields = unionsView.listFields();
            var views = unionsView.listViews();
            var sqlUnions = ''
            for(var v in views) {
                var view = views[v];
                var fieldsSql = '';
                for (var f in unionsFields) {
                    if (!$this.usedFields[unionsFields[f]]) {
                        /// skip unused field
                        continue;
                    }

                    var field = unionsFields[f];
                    var viewField = view.getField(field);
                    if (fieldsSql.length > 0) fieldsSql += ', ';
                    if (!viewField) {
                        var fieldType = $this.cubeFields[field].nativeType || $this.cubeFields[field].type;
                        var jdbcType = JDBC.translateType(fieldType, $this.vendor);
                        if (/^bit$/i.test(jdbcType)) {
                            jdbcType = 'BOOLEAN';
                        }
                        fieldsSql += 'NULL::' + jdbcType;
                        fieldsSql += ' AS ' + $this._quotedName(field);
                    } else {
                        fieldsSql += $this._declareViewField(viewField);
                    }
                }

                var viewSql = '(SELECT ' + fieldsSql + ' FROM ';
                viewSql += $this._translateSourceView(view, view.name);
                viewSql += ')';

                if (sqlUnions.length > 0) sqlUnions  += ' UNION ALL ';
                sqlUnions += viewSql;
            }
            sqlUnions = '(' + sqlUnions + ') AS ' + $this._quotedName($this._translateContext(unionsView.getContext()));
            return sqlUnions;
        },

        _translateJoinView: function(view) {
            var sql = '';
            sql += $this._translateSourceView(view.getLeftView(), view.getLeftView().name);
            sql += ' ' + view.joinType.toUpperCase() + ' JOIN ';
//            if ($this.config.excludeProviderWrappers && view.getRightView() instanceof QueryView && view.getRightView().isProviderWrapper()) {
//                var rightView = view.getRightView().getSourceView();
//                sql += $this._translateSourceView(rightView, rightView.name);
//            } else {
            sql += $this._translateSourceView(view.getRightView(), view.getRightView().name);
//            }

            sql += ' ON ';

            if (view.query) {
                sql += $this._translateWhere(view.query, view.filter);
            } else {
                var joinFields = view.listJoinFields();
                var count = 0;
                for (var i in joinFields) {
                    var field = joinFields[i];
                    var leftField = view.getLeftView().getField(field);
                    var rightField = view.getRightView().getField(field);
                    if (leftField && rightField) {
                        if(count++ > 0) {
                            sql += ' AND ';
                        }
                        sql += $this._translateViewField(leftField, view.getLeftView());
                        sql += ' = ';
                        sql += $this._translateViewField(rightField, view.getRightView());
                    }
                }
                if(count == 0) {
                    throw new Error('Join without binding: ' + view.getLeftView().name + ', ' + view.getRightView().name);
                }
            }
            return sql;
        },

        _orderedIsolatedViews: function(dcQuery){
            var views = [];
            for (var name in dcQuery.$views) {
                var view = $this._findQueryView(dcQuery.$views[name].$context);
                if (!view.isIsolated()) {
                    throw new Error('Query ' + view.getContext() + ' is not isolated: use fields of other contexts');
                }
                views.push(view);
            }

//            if ($this.config.printIsolatedQueriesInWith){
//                QueryUtils.walkSubQueries(dcQuery, function(query){
//                    if (query.$context != dcQuery.$context) {
//                        var view = $this._findQueryView(query.$context);
//                        if (view.isIsolated() && views.indexOf(view) == -1) {
//                            views.push(view);
//                        }
//                    }
//                });
//            }
            return views;
        },

		close: function() {
		    $base();
		},
	},
}