{
	$name: 'DataCube.Query.Transforms.PatchDirectFieldsAliases',
	$parent: 'DataCube.Query.Transforms.Transformer',
	$session: false,
	$server: {
		$require: [
		    'DataCube.Query.QueryUtils',
		    'DataCube.Query.Transforms.QueryTransformer',
		    'DataCube.Query.Visitors.Visitors',
		    'java:java.util.HashMap',

        ],

		transform: function(rootQuery, cube){
		    var queryAliasesMap = new HashMap();
            Visitors.visitProxy(rootQuery, {
                getUndefinedView: function(name){
//                    var slice = QueryUtils.getQuerySlice(name, cube);
//                    QueryUtils.throwError(slice, 'Query slice or named view is undefined: ' + name);
                    return {};
                },
                field: {
                    before: function(field, context, sourceContext) {
                        if (sourceContext) {
                            return;
                        }

                        var currentQuery = this.getQuery();
                        var query = this.getQuery(context);
                        if (currentQuery != query) {
                            return;
                        }

                        var directAliases = queryAliasesMap.get(query);
                        if (!directAliases) {
                            queryAliasesMap.put(query, directAliases = {});
                            for(var alias in query.$select) {
                                var e = query.$select[alias];
                                if (e.$field && (!e.$context || e.$context == query.$context) || JSB.isString(e)) {
                                    if (alias != e && alias != e.$field) {
                                        directAliases[alias] = JSB.isString(e) ? {$field: e} : JSB.clone(e);
                                    }
                                }
                            }
                        }
                        if (directAliases[field] && (!context || context == query.$context)) {
                            for(var i = this.path.length - 2; i >=0; i--) {
                                if (this.path[i] == '$postFilter' || this.path[i] == '$globalFilter'){
                                    return;
                                }
                                if (this.path[i] == currentQuery) {
                                    break;
                                }
                            }
                            var exp = this.getCurrent();
                            QueryUtils.jsonReplaceBody(exp, directAliases[field]);
                        }
                    }
                }
            });
		    return rootQuery;
		},

//        /** Производит замену
//        */
//		transform: function(rootQuery, cube){
//
//		    QueryUtils.walkQueries(rootQuery, {}, null, function (query){
//                var directAliases = {};
//                for(var alias in query.$select) {
//                    var e = query.$select[alias];
//                    if (e.$field && (!e.$context || e.$context == query.$context) || JSB.isString(e)) {
//                        if (alias != e && alias != e.$field) {
//                            directAliases[alias] = JSB.isString(e) ? {$field: e} : JSB.clone(e);
//                        }
//
//                    }
//                }
//
//                QueryUtils.walkFields(query, function fieldsCallback(field, context, q, path){
//                    if (path.indexOf('$postFilter') == -1 || path.indexOf('$globalFilter') == -1) {
//                        if (directAliases[field] && (!context || context == query.$context)) {
//                            return directAliases[field];
//                        }
//                    }
//                });
//
////                var sourceFields = QueryUtils.extractSourceFields(query, cube, rootQuery);
////                var outputFields = QueryUtils.extractOutputFields(query);
////                QueryUtils.walkInputFieldsCandidates(query, cube, {rootQuery:rootQuery}, function (field, context, q, isExp) {
////                    if (outputFields[field]/**isAlias*/ && directAliases[field] && directAliases[field] != field) {
////                        var newField = {$field:directAliases[field]};
////                        if (context != query.$context) {
////                            newField.$context = context;
////                        }
////                        return newField; // replace
////                    }
////
////                    QueryUtils.throwError(sourceFields[field] || outputFields[field] || !isExp, 'Field "{}" is not defined in source or query', field);
////                });
//            });
//		    return rootQuery;
//		},
	}
}