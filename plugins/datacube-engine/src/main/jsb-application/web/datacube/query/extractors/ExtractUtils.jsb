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
            (поля источника подзапроса и поля источника родителя подзапроса).
            Возыращает массив полей:
            - ($field:name} - обычное поле источника
            - {$field:name, $sourceContext:sc} - если источник $join
            - {$field:name, $context:parent} - если простое поле родительского запроса
            - {$field:name, $context:parent, $sourceContext:sc} - если поле родительского запроса с  источником $join
            */
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

        /** Возвращает срезы (внешние именованные запросы), используемые в запросе
        */
        extractInternalSlices: function(rootQuery, includeSubSlices){
            var slices = {};
            Visitors.visitProxy(rootQuery, {
                getUndefinedView: function(name) {
                    var slice = QueryUtils.getQuerySlice(name);
                    slices[name] = {
                        sliceId: slice ? slice.getId() : null,
                        operator: (function(){
                            for(var i = this.path.length - 1; i >= 0; i--) {
                                switch(this.path[i]) {
                                    case '$union':
                                    case '$join':
                                    case '$recursive':
                                    case '$from':
                                        return this.path[i];
                                }
                            }
                        }).call(this),
                    }
                    return includeSubSlices ? slice.getQuery() : {};
                },
            });
            return slices;
        },

        /** Извлекает из запроса среза измерения, которые он публекует, и идентификаторы срезов, в которых они определены.
            includeImplicit - включает неявно публикуемые измерения от встроенных срезов
        */
        extractDimensions: function(sliceOrQuery, defaultCube, includeImplicit){
            var sliceDimensions = {};
            var query = sliceOrQuery.getQuery ? sliceOrQuery.getQuery() : sliceOrQuery;
            var dimensions = defaultCube.getDimensions();
            for(var field in query.$select) {
                if(dimensions[field]) {
                    if (!sliceDimensions[field]) {
                        sliceDimensions[field] = {};
                    }
                    var id = sliceOrQuery.getQuery ? sliceOrQuery.getId() : null;
                    sliceDimensions[field][id] = {
                        sliceId: id,
                        cubeId: sliceOrQuery.getQuery ? sliceOrQuery.getCube().getId() : null,
                    };
                }
            }

            if (includeImplicit) {
                Visitors.visitProxy(query, {
                    getUndefinedView: function(name) {
                        var slice = QueryUtils.getQuerySlice(name);
                        var subDimensions = $this.extractDimensions(slice, slice.getCube(), includeImplicit);
                        JSB.merge(true, sliceDimensions, subDimensions);
                        return {};
                    },
                });
            }
            return sliceDimensions;
        },

        /** Возвращает параметры, использованные в запросе и внутренних запросах, включая срезы (их тоже обходит рекурсивно)
        */
        extractInternalSlices: function(rootQuery, includeSubSlices){
            var usedParams = {};
            var params = {};
            Visitors.visitProxy(rootQuery, {
                getUndefinedView: function(name) {
                    if (includeSubSlices) {
                        var slice = QueryUtils.getQuerySlice(name);
                        return slice.getQuery();
                    } else {
                        return {};
                    }
                },
                query: {
                    after: function(query){
                        JSB.merge(true, params, query.$params);
                    }
                },
                param: {
                    before: function(param) {
                        if(!usedParams[param]) usedParams[param] = {used:0};
                        usedParams[param] += 1;
                    }
                }
            });
            JSB.merge(true, usedParams, params);
            return usedParams;
        },

        /** Возвращает объект с параметрами, объявленными и доступными для использования в текущем запросе
            (мотает от текущего запроса наверх по цепочке вызова, самая верхняя декларация считается главной)
        */
        extractAllowedParams: function(rootQuery, current/**query/context*/) {
            var allowedParams = {};
            Visitors.visitProxy(rootQuery, {
                getUndefinedView: function(name) {
                    return {};
                },
                query: {
                    before: function(query){
                        if (query == current || query.$context == current) {
                            this.skip = true;
                            this.beak = true;

                            var params = {};
                            for(var i = this.queryPath.length - 1; i >= 0; i--) {
                                JSB.merge(true, allowedParams, this.queryPath[i].$params);
                            }
                        }
                    },
                },
            });
            return allowedParams;
        },
    }
}