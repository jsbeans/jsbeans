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

		    'DataCube.Query.Views.QueryView',
		    'DataCube.Query.Views.CubeView',
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
		        printIsolatedQueriesInWith: Config.get('datacube.query.translateExtractedIsolatedViews'),
		    }
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
            if (sql.startsWith('"')) {
                sql = '(SELECT * FROM ' + sql + ')';
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
            var sql = '';
            var recursiveTreeCount = 0;
            var views = $this._orderedIsolatedViews(query);
            for(var i in views) {
                var view = views[i];
                if (!$this.withContextViews[view.getContext()]) {
                    if (sql.length != 0) sql += ',\n';
                    if (query.$recursiveTree) {
                        QueryUtils.throwError(++recursiveTreeCount < 1, 'Query $views supports only single query with $recursiveTree operator');
                        sql += 'RECURSIVE ';
                    }
                    sql += $this._quotedName(view.getContext());
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
                sql = $this._quotedName(viewField.context) +
                    '.' + $this._quotedName(viewField.providerField || viewField.field);
            }
            if(!sql) throw new Error('Internal error: Unknown field');
            sql += ' AS ' + $this._quotedName(viewField.field);
            return sql;
        },

        _translateField: function(field, context, useAlias) {
//if (field.indexOf("Среднесписочная численность без совместителей и работников несписочного состава, всего") != -1) debugger;
//Log.debug((function(){
//              try{"".aa()}catch(e){return e.stack.indexOf('_translateOrder') != -1;}
//          })() + '\t' + useAlias + '\t' + context + '.' + field);

            var queryView = $this._findQueryView(context);
            var contextField = queryView.lookupField(field, useAlias);

            if (!contextField) {
                // unknown field: print as-is
                return $this._quotedName(field);
            }
            return $this._translateViewField(contextField);
        },

		_translateViewField: function(viewField) {
            if (viewField.alias && viewField.context) {
                return $this._printTableName(viewField.context) +
                    '.' + $this._quotedName(viewField.alias);

            } else if (viewField.providerField && viewField.context) {
                return $this._printTableName(viewField.context) +
                    '.' + $this._quotedName(viewField.providerField);

            } else if (viewField.providerField  && viewField.provider) {
                return $this._printTableName(viewField.provider.getTableFullName()) +
                    '.' + $this._quotedName(viewField.providerField);

            } else if (viewField.field && viewField.context) {
                return $this._quotedName(viewField.context) +
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
                sql = $this._printTableName(view.getProvider().getTableFullName());
                sql += ' AS ' + $this._quotedName(view.getContext());
            } else if(view instanceof SqlView) {
                sql = view.getSql();
            } else if(view instanceof NothingView) {
                sql = '';
            } else {
                throw new Error('Internal error: unknown view type ' + view.getJsb ? view.getJsb.$name : typeof view);
            }
            return sql;
        },

        _translateWithQueryView: function(view) {
            return $this._translateQueryView(view);
        },

        _translateQueryViewAsRecursive: function(view) {

            function translateRecursive(upOrDown, recursiveContext) {
                var sql = '';

                // start query (embed $startFilter)
                if (originalQuery.$recursiveTree.$startFilter == null) {
                    throw new Error('$startFilter is not defined in ' +  view.name);
                }
                if (!view.query.$filter) view.query.$filter = {};
                if (!view.query.$filter.$and) view.query.$filter.$and = [];
                view.query.$filter.$and.push(originalQuery.$recursiveTree.$startFilter);

                sql += $this._translateQueryView(view);
                sql += ' UNION ALL ';

                // recursive query with join
                view.query.$filter = originalQuery.$filter;
                sql += $this._translateQueryView(view);
                sql += ' JOIN ' + $this._quotedName(recursiveContext);
                function createField(e, context){
                    if(!(typeof e == 'string' || JSB.isObject(typeof e) && typeof e.$field == 'string')) {
                        throw new Error('Operator $recursiveTree supports only fields');
                    }
                    return typeof e == 'string'
                         ? {$field: e, $context: context}
                         : {$field: e.$field, $context: context};
                }
                function translateField(f) {
                    var field = JSB.clone(view.lookupField(f.$field));
                    if (f.$context == recursiveContext) {
                        field.context = recursiveContext;
                        for(var alias in originalQuery.$select) {
                            if (originalQuery.$select[alias] == f.$field) {
                                field.field = alias;
                                field.alias = alias;
                                return $this._translateViewField(field);
                            }
                        }
                        throw new Error('Cannot find field "' + f.$field + '" in ' + originalQuery.$context);
                    }
                    return $this._translateViewField(field);

                }
                $this.contextQueryViews[recursiveContext] = view;
                if (upOrDown) {
                    sql += ' ON '
                        + translateField(createField(originalQuery.$recursiveTree.$idField))
                        + ' = '
                        + translateField(createField(originalQuery.$recursiveTree.$parentIdField, recursiveContext));
                } else {
                    sql += ' ON '
                        + translateField(createField(originalQuery.$recursiveTree.$idField, recursiveContext))
                        + ' = '
                        + translateField(createField(originalQuery.$recursiveTree.$parentIdField));
                }
                delete $this.contextQueryViews[recursiveContext];
                return sql;
            }
debugger
            // reuse query view as template for translate sub views
            var originalQuery = view.query;

            view.query = JSB.clone(view.query);
            delete view.query.$recursiveTree;

            var sql = '(';

            if (originalQuery.recursiveTree.$recursiveTreeDirection == 1) {
                var recursiveContext = 'UP:' + view.name;
                sql += '(WITH RECURSIVE ' +  $this._quotedName(recursiveContext) + ' AS (';
                sql += translateRecursive(true, recursiveContext);
                sql += ')';
                sql += ' SELECT * FROM ' + $this._quotedName(recursiveContext) + ')';
            }

            if (originalQuery.recursiveTree.$recursiveTreeDirection == 0) {
                sql += ' UNION ALL ';
            }

            if (originalQuery.recursiveTree.$recursiveTreeDirection == 1) {
                var recursiveContext = 'DOWN:' + view.name;
                sql += '(WITH RECURSIVE ' +  $this._quotedName(recursiveContext) + ' AS (';
                sql += translateRecursive(false, recursiveContext);
                sql += ')';
                sql += ' SELECT * FROM ' + $this._quotedName(recursiveContext) + ')';
            }

            sql += ')';

            if (originalQuery.$distinct) {
                sql = '(SELECT DISTINCT * FROM ' + sql + 'AS ' + $this._quotedName(originalQuery.$context) + ')';
            }

            // repair
            view.query = originalQuery;

            return sql;
        },

        _translateQueryView: function(view) {
            if ($this.withContextViews[view.getContext()]) {
                return $this._quotedName($this.withContextViews[view.getContext()]);
            }

            if (view.query.$recursiveTree) {
                return $this._translateQueryViewAsRecursive(view);
            }

            var query = view.getQuery();

            var sql = $this._translateWith(query);

            var from  = $this._translateSourceView(view.getSourceView(), view.getContext());
            var columns = $this._translateSelectColumns(view);

            var where = $this._translateWhere(query, $this._extractWhereOrHavingFilter(query, true));
            var group = $this._translateGroup(query);
            var having = $this._translateWhere(query, $this._extractWhereOrHavingFilter(query, false));
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
            var sql  = sourceView instanceof QueryView
                    ? '' + $this._translateAnyView(sourceView) + ' AS ' + $this._quotedName(context)
                    : $this._translateAnyView(sourceView);
            return sql;
        },

        _translateSelectColumns: function(view){
            var sqlColumns = '';
            var fields = view.listFields();
            for (var i in fields) {
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
                viewSql += $this._translateAnyView(view);
                viewSql += ')';

                if (sqlUnions.length > 0) sqlUnions  += ' UNION ALL ';
                sqlUnions += viewSql;
            }
            sqlUnions = '(' + sqlUnions + ') AS ' + $this._quotedName(unionsView.getContext());
            return sqlUnions;
        },

        _translateJoinView: function(view) {
            var sql = $this._translateAnyView(view.getLeftView());
            sql += ' LEFT JOIN ';
            sql += $this._translateAnyView(view.getRightView());
            sql += ' ON ';
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

            if ($this.config.printIsolatedQueriesInWith){
                QueryUtils.walkSubQueries(dcQuery, function(query){
                    if (query.$context != dcQuery.$context) {
                        var view = $this._findQueryView(query.$context);
                        if (view.isIsolated() && views.indexOf(view) == -1) {
                            views.push(view);
                        }
                    }
                });
            }
            return views;
        },

		close: function() {
		    $base();
		},
	},
}