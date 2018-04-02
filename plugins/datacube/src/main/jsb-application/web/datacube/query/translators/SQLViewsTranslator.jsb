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
                return 'field "' + this.field + '" (context "' + this.queryContext + '", SQL column "' + this.origName + '")';
            }

            function findInfo(origName) {
                for(var context in $this.contextQueryViews) {
                    var queryView = $this.contextQueryViews[context];
                    var sourceView = queryView.getSourceView();
                    if (sourceView) {
                        var sourceFields = sourceView.listFields();
                        for(var f = 0; f < sourceFields.length; f++) {
                            var sourceField = sourceView.getField(sourceFields[f]);
                            if (sourceField && origName == sourceField.context + '.' + sourceField.providerField) {
                                return buildInfo.call({
                                    origName: origName,
                                    field: sourceFields[f],
                                    queryContext: queryView.getContext()
                                });
                            }
                        }

                    }
                }
                return null;
            }


            var reg = /column\s*\"(.*[^\"].*)\"/g
            var message = error.message.replace(reg, function(s, name) {
                var info = findInfo(name);
                return info ? info : name;
            });

            message = message.replace(/\sPosition:\s*(\d*)/, function(s, pos){
                return "SQL position: " + pos + ' (for get SQL use analyze)';
            });

		    return new Error(message);
		},

        _translateWith: function(query){
            var sql = '';
            if ($this.dcQuery.$id && $this.dcQuery.$id == query.$id) {
                var views = $this._orderedIsolatedViews(query);
                for(var i in views) {
                    var view = views[i];
                    if (!$this.withContextViews[view.getContext()]) {
                        if (sql.length != 0) sql += ',\n';
                        sql += $this._quotedName(view.getContext());
                        sql += ' AS ';
                        sql += $this._translateAnyView(view);
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

        _translateQueryView: function(view) {
            if ($this.withContextViews[view.getContext()]) {
                return $this._quotedName($this.withContextViews[view.getContext()]);
            }
//debugger;
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
            sql += 'SELECT ' + columns + from + where + group + having + order + offset + limit + '';
            return query.$context != $this.dcQuery.$context ? '('+sql+')': sql;
        },

        _translateSourceView: function(sourceView, context) {
            var sql  = sourceView instanceof QueryView
                    ? '' + $this._translateAnyView(sourceView) + ' AS ' + context
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