{
	$name: 'DataCube.Query.Extractors.ExtractUtils',
	$singleton:true,

	$server: {
		$require: [
		    'DataCube.Query.Visitors.Visitors',
		    'DataCube.Query.QueryUtils',
		    'Datacube.Types.DataTypes',
		    'java:java.util.HashMap',
        ],

//        test: function(rootQuery) {
//            Visitors.visitProxy(rootQuery, {
//                getUndefinedView: function(name) {
//                    return {};
//                },
//                query: {
//                    before: function(query){
//                        var fields = $this.extractAllowedFields(rootQuery, query.$context);
//                        Log.debug(JSON.stringify(fields,0,2));
//                    }
//                }
//            });
//        },

        /** Выводит перечень полей, доступных в текущем контексте для использования
            (поля источника подзапроса и поля источника родителя подзапроса) */
        extractAllowedFields: function(rootQuery, current/**query/context*/){
            var allowedFields = [];
            var sliceQueries = [];
            /// find query by context
            Visitors.visitProxy(rootQuery, {
                getUndefinedView: function(name) {
                    var slice = QueryUtils.getQuerySlice(name);
                    QueryUtils.throwError(slice, 'Slice or named view is undefined: {}', name);
                    sliceQueries.push(slice.getQuery());
                    return slice.getQuery();
                },
                query: {
                    before: function(query){
                        if (sliceQueries.indexOf(query) !== -1) {
                            this.skip = true;
                            return;
                        }
                        if (query == current || query.$context == current) {
                            this.skip = true;
                            this.beak = true;
                            var self = this;
                            var sourceFields = $this.extractSourceFields(query, function(q){return self.getQuery(q);});
                            for(var f in sourceFields) {
                                allowedFields.push(sourceFields[f]);
                            }

                            var parents = this.getNestedParentQueries();
                            for(var p = 0; p < parents.length; p++) {
                                var parent = parents[p];
                                var sourceFields = $this.extractSourceFields(parent, function(q){return self.getQuery(q);});
                                for(var f in sourceFields) {
                                    allowedFields.push(JSB.merge({$context:parent.$context},sourceFields[f]));
                                }
                            }
                        }
                    },
                },
            });

            return allowedFields;
        },

        /**Формирует поля источника для текущего контекста  {$field}/{$field,$sourceContext}*/
        extractSourceFields: function(query, getQuery) {
            var sourceFields = {};
            function collectFields(source, sourceContext) {
                for(var alias in source.$select) {
                    var f = {$field: alias};
                    if (sourceContext) {
                        f.$sourceContext = sourceContext;
                    }
                    sourceFields[sourceContext+'/'+alias] = f;
                }
            }

            if (query.$from) {
                var sourceQuery = getQuery(query.$from);
                collectFields(sourceQuery);
            } else if (query.$join) {
                var sourceQuery = getQuery(query.$join.$left);
                collectFields(sourceQuery, JSB.isString(query.$join.$left) ? query.$join.$left : query.$join.$left.$context);
                var sourceQuery = getQuery(query.$join.$right);
                collectFields(sourceQuery, JSB.isString(query.$join.$right) ? query.$join.$right : query.$join.$right.$context);
            } else if (query.$recursive) {
                var sourceQuery = getQuery(query.$recursive.$start);
                collectFields(sourceQuery);
            } else if (query.$union) {
                for(var i = 0; i < query.$union.length; i++) {
                    var sourceQuery = getQuery(query.$union[i]);
                    collectFields(sourceQuery);
                }
            } else if (query.$cube) {
                var cube = QueryUtils.getQueryCube(query.$cube);
                var fields = cube.extractFields();
                for(var field in fields) {
                    sourceFields[field] = {$field:field};
                }
            } else if (query.$provider) {
                var provider = QueryUtils.getQueryDataProvider(query.$provider);
                var fields = provider.extractFields();
                for(var field in fields) {
                    sourceFields[field] = {$field:field};
                }
            } else {
                throw new Error('Unexpected field source');
            }
            return sourceFields;
        },
    }
}