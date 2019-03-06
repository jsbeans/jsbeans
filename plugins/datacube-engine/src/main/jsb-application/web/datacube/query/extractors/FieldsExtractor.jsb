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
                        var targetQuery = this.getQuery(context);

                        function putInputField(map, query) {
                            var fields = map.get(query);
                            if (!fields) {
                                var fields = {};
                                map.put(query, fields);
                            }
                            if(!fields[context + '/' + field]) {
                                fields[context + '/' + field] = {$field: field, $context: context, $sourceContext:sourceContext};
                            }
                        }

                        function putOutputField(sourceQuery) {
                            if (sourceQuery.$select[field]) {
                                var sourceFields = $this.queryUsedOutputFields.get(sourceQuery);
                                if (!sourceFields) {
                                    var sourceFields = {};
                                    $this.queryUsedOutputFields.put(sourceQuery, sourceFields);
                                }
                                if (!sourceFields[field]) {
                                    sourceFields[field] = field;
                                }
                            }
                        }

                        /// used fields
                        putInputField($this.queryUsedFields, this.getQuery());

                        /// used input fields
                        putInputField($this.queryUsedInputFields, targetQuery);

                        /// used output fields
                        if (targetQuery.$from && JSB.isObject(targetQuery.$from)) {
                            putOutputField(targetQuery.$from);
                        } else if (targetQuery.$from && JSB.isString(targetQuery.$from)) {
                            var sourceQuery = this.getView(targetQuery.$from);
                            putOutputField(sourceQuery);
                        } else if (targetQuery.$join) {
                            var leftQuery = JSB.isString(targetQuery.$join.$left)   ? this.getView(targetQuery.$join.$left) : targetQuery.$join.$left;
                            var rightQuery = JSB.isString(targetQuery.$join.$right) ? this.getView(targetQuery.$join.$right) : targetQuery.$join.$right;
                            putOutputField(leftQuery);
                            putOutputField(rightQuery);
                        } else if (targetQuery.$recursive) {
                            if(targetQuery.$context == context) {
                                putOutputField(targetQuery);
                            }
                            putOutputField(targetQuery.$recursive.$start);
                            putOutputField(targetQuery.$recursive.$joinedNext);
                        } else if (targetQuery.$union) {
                            for(var i = 0; i < targetQuery.$union.length; i++) {
                                var q = JSB.isString(targetQuery.$union[i]) ? this.getView(targetQuery.$union[i]) : targetQuery.$union[i];
                                putOutputField(q);
                            }
                        }
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
                usedFields[alias] = alias;
            }
        },

        /** Обходит все запросы в произвольном порядке, включая подзапросы и запросы-источники
        */
        forEachQuery: function(callback){
            for(var it = $this.queryUsedInputFields.entrySet().iterator(); it.hasNext();) {
                var entry = it.next();
                var query = entry.getKey();
                callback(query);
            }
        },

        /* Возвращает входные поля, используемых в указанном запросе
           (поля источника запроса, включая поля используемые в дочерних подзапросах)
        */
        getUsedInputFields: function(query) {
            return $this.queryUsedInputFields.get(query);
        },

        /* Возвращает используемые выходные поля запроса
        */
        getUsedOutputFields: function(query) {
            return $this.queryUsedOutputFields.get(query);
        },

        /* Возвращает поля, вообще используемых в указанном запросе
           (все поля, используемые в запросе - поля источника и поля внешних родительских запросов)
        */
        getUsedFields: function(query) {
            return $this.queryUsedFields.get(query);
        },
    }
}