{
	$name: 'DataCube.Query.Extractors.FieldsExtractor',
	$parent: 'DataCube.Query.Visitors.ProxyVisitor',

	$server: {
		$require: [
		    'DataCube.Query.QuerySyntax',
		    'DataCube.Query.QueryUtils',
		    'java:java.util.HashMap',
        ],

        /** Сканирует запрос целиком и формирует списки используемых полей для всех подзапросов
        */

        $constructor: function(rootQuery){
            $this.rootQuery = rootQuery;
            $this.queryUsedInputFields = new HashMap();
            $this.queryUsedFields = new HashMap();
            $this.queryUsedOutputFields = new HashMap();

            $base({
                field: {
                    before: function(field, context, sourceContext){
                        var currentQuery = this.getQuery();
                        var targetQuery = this.getQuery(context);

                        var isOutputCandidate = false;
                        if (currentQuery == targetQuery && currentQuery.$select[field]) {
                            for(var i = this.path.length - 2; i >=0; i--) {
                                if (this.path[i] == '$sort' || this.path[i] == '$groupBy'){
                                    isOutputCandidate = true;
                                }
                                if (this.path[i] == currentQuery) {
                                    break;
                                }
                            }
                        }

                        function putOutput(query) {
                            if (query.$select[field]) {
                                var sourceFields = $this.queryUsedOutputFields.get(query);
                                if (!sourceFields) {
                                    var sourceFields = {};
                                    $this.queryUsedOutputFields.put(query, sourceFields);
                                }
//                                if (sourceFields[field])
//                                QueryUtils.logDebug('used field: {} / {}', query.$context, field);
                                sourceFields[field] = (sourceFields[field]||0) + 1;
                                return true;
                            }
                        }

                        function putAlias() {
                            if(isOutputCandidate) {
                                return putOutput(currentQuery);
                            }
                        }


                        if (targetQuery.$from) {
                            var sourceQuery = this.getQuery(targetQuery.$from);
                            putOutput(sourceQuery)
                                || putAlias();
                        } else if (targetQuery.$join) {
                            if (!sourceContext) {
                                var left = this.getQuery(targetQuery.$join.$left);
                                var right = this.getQuery(targetQuery.$join.$right);
                                if (left.$select[field]) {
                                    var sourceQuery = this.getQuery(left);
                                    putOutput(sourceQuery);
                                } else if (right.$select[field]) {
                                    var sourceQuery = this.getQuery(right);
                                    putOutput(sourceQuery);
                                } else if (isOutputCandidate) {
                                    putAlias();
                                } else {
                                    throw new Error('Field "' + field + '" $sourceContext is undefined in $join query "' + context + '"');
                                }
                            } else {
                                var sourceQuery = this.getQuery(sourceContext);
                                putOutput(sourceQuery);
                            }
                        } else if (targetQuery.$recursive) {
                            if(targetQuery.$context == context) {
                                putOutput(targetQuery);
                            }
                            putOutput(targetQuery.$recursive.$start)
                                || putOutput(targetQuery.$recursive.$joinedNext)
                                || putAlias();
                        } else if (targetQuery.$union) {
                            var exist = false;
                            for(var i = 0; i < targetQuery.$union.length; i++) {
                                var q = this.getQuery(targetQuery.$union[i]);
                                exist = putOutput(q) || exist;
                            }
                            if(!exist) putAlias();
                        }

//                        function putInputField(map, query) {
//                            var fields = map.get(query);
//                            if (!fields) {
//                                var fields = {};
//                                map.put(query, fields);
//                            }
//                            if(!fields[context + '/' + field]) {
//                                fields[context + '/' + field] = {$field: field, $context: context, $sourceContext:sourceContext};
//                            }
//                        }
//
//                        function putOutputField(sourceQuery) {
//                            if (sourceQuery.$select[field]) {
//                                var sourceFields = $this.queryUsedOutputFields.get(sourceQuery);
//                                if (!sourceFields) {
//                                    var sourceFields = {};
//                                    $this.queryUsedOutputFields.put(sourceQuery, sourceFields);
//                                }
//                                if (!sourceFields[field]) {
//                                    sourceFields[field] = field;
//                                }
//                                return true;
//                            }
//                        }
//
//                        function putAlias(){
//                            if(isOutputCandidate) {
//                                return putOutputField(currentQuery);
//                            }
//                        }
//
//                        /// used fields
//                        putInputField($this.queryUsedFields, this.getQuery());
//
//                        /// used input fields
//                        putInputField($this.queryUsedInputFields, targetQuery);
//
//                        /// used output fields
//                        if (targetQuery.$from && JSB.isObject(targetQuery.$from)) {
//                            putOutputField(targetQuery.$from)
//                                || putAlias();
//                        } else if (targetQuery.$from && JSB.isString(targetQuery.$from)) {
//                            var sourceQuery = this.getView(targetQuery.$from);
//                            putOutputField(sourceQuery)
//                                || putAlias();
//                        } else if (targetQuery.$join) {
//                            var leftQuery = this.getQuery(targetQuery.$join.$left);
//                            var rightQuery = this.getQuery(targetQuery.$join.$right);
//                            putOutputField(leftQuery)
//                                || putOutputField(rightQuery)
//                                || putAlias();
//                        } else if (targetQuery.$recursive) {
//                            if(targetQuery.$context == context) {
//                                putOutputField(targetQuery);
//                            }
//                            putOutputField(targetQuery.$recursive.$start);
//                            putOutputField(targetQuery.$recursive.$joinedNext);
//                            putAlias();
//                        } else if (targetQuery.$union) {
//                            for(var i = 0; i < targetQuery.$union.length; i++) {
//                                var q = JSB.isString(targetQuery.$union[i]) ? this.getView(targetQuery.$union[i]) : targetQuery.$union[i];
//                                putOutputField(q);
//                            }
//                            putAlias();
//                        }
                    },
                }
            });
        },

        extract: function(){
            $this.visit($this.rootQuery);
            /// add all final output fields
            var usedFields = $this.queryUsedOutputFields.get($this.rootQuery);
            if (!usedFields) {
                usedFields = {};
                $this.queryUsedOutputFields.put($this.rootQuery, usedFields);
            }
            for(var alias in $this.rootQuery.$select) {
                usedFields[alias] = 1;
            }
        },

//        /* Возвращает входные поля, используемых в указанном запросе
//           (поля источника запроса, включая поля используемые в дочерних подзапросах)
//        */
//        getUsedInputFields: function(query) {
//            return $this.queryUsedInputFields.get(query);
//        },
//
        /* Возвращает используемые выходные поля запроса
        */
        getUsedOutputFields: function(query) {
            return $this.queryUsedOutputFields.get(query);
        },
//
//        /* Возвращает поля, вообще используемых в указанном запросе
//           (все поля, используемые в запросе - поля источника и поля внешних родительских запросов)
//        */
//        getUsedFields: function(query) {
//            return $this.queryUsedFields.get(query);
//        },
    }
}