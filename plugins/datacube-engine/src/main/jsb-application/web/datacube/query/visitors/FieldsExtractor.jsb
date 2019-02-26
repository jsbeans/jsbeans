{
	$name: 'DataCube.Query.Visitors.FieldsExtractor',
	$parent: 'DataCube.Query.Visitors.ProxyVisitor',

	$server: {
		$require: [
		    'DataCube.Query.QuerySyntax',
		    'DataCube.Query.QueryUtils',
		    'DataCube.Model.Slice',
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

                        var fields = $this.queryUsedInputFields.get(targetQuery);
                        if (!fields) {
                            var fields = {};
                            $this.queryUsedInputFields.put(targetQuery, fields);
                        }
                        if(!fields[context + '/' + field]) {
                            fields[context + '/' + field] = {$field: field, $context: context, $sourceContext: sourceContext};
                        }
                        /// used output fields
                        if (JSB.isObject(targetQuery.$from)) {
                            putOutputField(targetQuery.$from);
                        } else if (JSB.isString(targetQuery.$from)) {
                            var sourceQuery = this.getQuery(targetQuery.$from);
                            putOutputField(sourceQuery);
                        } else if (targetQuery.$join) {
                            // TODO !!! ведь в $join указывается контекст источника  !!!
                            var leftQuery = JSB.isString(targetQuery.$join.$left)   ? this.getQuery(targetQuery.$join.$left) : targetQuery.$join.$left;
                            var rightQuery = JSB.isString(targetQuery.$join.$right) ? this.getQuery(targetQuery.$join.$right) : targetQuery.$join.$right;
                            putOutputField(leftQuery);
                            putOutputField(rightQuery);
                        }
                        // TODO ...
                    },
                }
            });
        },

        parse: function(){
            $this.visit($this.rootQuery);
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

        /* Возвращает поля, вообще используемых в указанном запросе
           (все поля, используемые в запросе - поля источника и поля внешних родительских запросов)
        */
        getUsedFields: function(query) {
            return $this.queryUsedFields.get(query);
        },
    }
}