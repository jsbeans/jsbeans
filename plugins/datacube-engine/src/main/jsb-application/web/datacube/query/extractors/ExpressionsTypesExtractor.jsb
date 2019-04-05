{
	$name: 'DataCube.Query.Extractors.ExpressionsTypesExtractor',
	$singleton: true,

	$server: {
		$require: [
		    'DataCube.Query.QueryUtils',
		    'Datacube.Types.DataTypes',
		    'DataCube.Query.Visitors.Visitors',
		    'java:java.util.HashMap',
        ],

        extractedTypes: function(rootQuery, callback){
            function typeName(type) {
                return JSB.isString(type) ? type : type.name;
            }

            var queryFieldTypeMap = new HashMap();
            var expressionTypeMap = callback ? new HashMap() : null;

            Visitors.visitProxy(rootQuery, {
                getUndefinedView: function(name) {
                    /// extract extrenal queries types (slice`s fields)
                    var slice = QueryUtils.getQuerySlice(name);
                    QueryUtils.throwError(slice, 'Slice or named view is undefined: {}', name);
                    var query = slice.getQuery();
                    if (!queryFieldTypeMap.get(query)) {
                        var fieldTypes = {};
                        queryFieldTypeMap.put(query, fieldTypes);
                        var fields = slice.extractFields();
                        for(var field in fields) {
                            fieldTypes[field] = {
                                type: typeName(fields[field].type),
                                nativeType: fields[field].nativeType,
                            };
                        }
                    }
                    return query;
                },
                query: {
                    before: function(query){
                        if (queryFieldTypeMap.get(query)) {
                            this.skip = true;
                        } else {
                            if(callback) {
                                callback.call(callback);
                            }
                        }
                    },
                    after: function(query){
                        if (this.getNestedParentQueries().length > 0) {
                            var type = queryFieldTypeMap.get(query)[Object.keys(query.$select)[0]];
                            if (!type) throw new Error('Nested query field type is undefined');
                            this.type = JSB.clone(type);
                        } else {
                            this.type = null;
                        }
                    },
                },
                filter: {
                    before: function(){
                        this.type = null;
                    },
                },
                postFilter: {
                    before: function(){
                        this.type = null;
                    },
                },
                globalFilter: {
                    before: function(){
                        /// skip global filter expressions
                        this.skip = null;
                    },
                },
                groupBy: {
                    before: function(){
                        this.type = null;
                    },
                },
                sort: {
                    before: function(){
                        this.type = null;
                    },
                },

                outputField:{
                    before: function(alias, exp) {
                        var query = this.getQuery();
                        if (!queryFieldTypeMap.get(query)) {
                            queryFieldTypeMap.put(query, {});
                        }
                        this.type = null;
                    },
                    after: function(alias, exp) {
                        var query = this.getQuery();
                        queryFieldTypeMap.get(query)[alias] = JSB.clone(this.type);
                        this.type = null;
                    },
                },
                param: {
                    after: function(name) {
                        var param = this.getParam(name);
                        this.type = {
                            type:       param.$type,
                            nativeType: param.$nativeType,
                        };
                    },
                },
                field: {
                    after: function(field, context, sourceContext){
                        var query = this.getQuery(context);
                        if (query.$from) {
                            var sourceQuery = this.getQuery(query.$from);
                        } else if (query.$join) {
                            var sourceQuery = this.getQuery(query.$join.$left);
                            if (!sourceQuery.$select[field]) {
                                var sourceQuery = this.getQuery(query.$join.$right);
                            }
                            if (!sourceQuery.$select[field]) {
                                var sourceQuery = query;
                            }
                            if (!sourceQuery.$select[field]) {
                                throw new Error('Field is undefined: ' + field);
                            }
                        } else if (query.$recursive) {
                            var sourceQuery = this.getQuery(query.$recursive.$start);
                        } else if (query.$union) {
                            for(var i = 0; i < query.$union.length; i++) {
                                var sourceQuery = this.getQuery(query.$union[i]);
                                if(sourceQuery.$select[field]) {
                                    break;
                                }
                            }
                        } else if (query.$cube) {
                            var cube = QueryUtils.getQueryCube(query.$cube);
                            var fields = cube.extractFields();
                            this.type = {
                                type: typeName(fields[field].type),
                                nativeType: fields[field].nativeType,
                            };
                            return;
                        } else if (query.$provider) {
                            var provider = QueryUtils.getQueryDataProvider(query.$provider);
                            var fields = provider.extractFields();
                            this.type = {
                                type: typeName(fields[field].type),
                                nativeType: fields[field].nativeType,
                            };
                            return;
                        } else {
                            throw new Error('Unexpected field source');
                        }
                        this.type = JSB.clone(queryFieldTypeMap.get(sourceQuery)[field]);
                    },
                },
                expression: {
                    before: function(exp){
                        /// skip no-value expressions
                        switch(this.getExpressionKey(-3)) {
                            case '$recursiveSelect':
                                if (this.getExpressionKey(-1) !== '$aggregateExpr') {
                                    this.skip = true;
                                }
                                break;
                            case '$if':
                                if (this.getExpressionKey(-1) !== '$then') {
                                    this.skip = true;
                                }
                                break;
                            case '$regexpReplace':
                            case '$substring':
                            case '$splitString':
                            case '$dateIntervalOrder':
                                if (this.getExpressionKey(-1) !== '$value') {
                                    this.skip = true;
                                }
                                break;
                        }
                    },
                    after: function(exp) {
                        function setType(type, nativeType) {
                            if (!this.type) this.type = {};
                            this.type.type = type;
                            if (nativeType) {
                                this.type.nativeType = nativeType;
                                if (!this.type.type) {
                                    this.type.type = DataTypes.fromAny(nativeType);
                                }
                            } else {
                                delete this.type.nativeType;
                            }
                        }

                        if (exp.$count || exp.$gcount || exp.$grmaxcount) {
                            setType.call(this, DataTypes.integer.name);
                        }

                        if (exp.$toString)    { setType.call(this, DataTypes.string.name); }
                        if (exp.$toInt)       { setType.call(this, DataTypes.integer.name); }
                        if (exp.$toDouble)    { setType.call(this, DataTypes.double.name); }
                        if (exp.$toBoolean)   { setType.call(this, DataTypes.boolean.name); }
                        if (exp.$toDate)      { setType.call(this, DataTypes.date.name); }
                        if (exp.$toTimestamp) { setType.call(this, DataTypes.timestamp.name); }
                        if (exp.$dateYear || exp.$dateYearDay || exp.$dateMonth || exp.$dateMonthDay || exp.$dateWeekDay
                            || exp.$dateTotalSeconds || exp.$dateIntervalOrder
                            || exp.$timeHour || exp.$timeMinute || exp.$timeSecond
                            ) { setType.call(this, DataTypes.integer.name); }
                        if (exp.hasOwnProperty('$const')) {
                            if (JSB.isString(exp.$const))  { setType.call(this, DataTypes.string.name); }
                            if (JSB.isInteger(exp.$const)) { setType.call(this, DataTypes.integer.name); }
                            if (JSB.isFloat(exp.$const))   { setType.call(this, DataTypes.double.name); }
                            if (JSB.isBoolean(exp.$const)) { setType.call(this, DataTypes.boolean.name); }
                            if (JSB.isDate(exp.$const))    { setType.call(this, DataTypes.date.name); }
                        }

                        if (exp.type || exp.$nativeType) {
                            setType.call(this, exp.$type, exp.$nativeType);
                        }

                        if (callback) {
                            expressionTypeMap.put(exp, JSB.clone(this.type));
                        }
                    },
                }
            });

            if (callback) {
                callback(queryFieldTypeMap, expressionTypeMap);
            }
            return queryFieldTypeMap;
        },
    }
}