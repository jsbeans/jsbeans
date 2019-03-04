{
	$name: 'DataCube.Query.Extractors.TypeExtractor',
	$singleton:true,

	$server: {
		$require: [
		    'DataCube.Query.Visitors.ProxyVisitor',
		    'DataCube.Query.Visitors.Visitors',
		    'DataCube.Query.QueryUtils',
		    'Datacube.Types.DataTypes',
		    'java:java.util.HashMap',
        ],

        extractQueryOutputFieldsTypes: function(rootQuery, query){
            var types = $this.extractOutputFieldsTypes(rootQuery);
            return types.get(query||rootQuery);
        },

        extractOutputFieldsTypes: function(rootQuery){
            function typeName(type) {
                return JSB.isString(type) ? type : type.name;
            }
            var types = new HashMap();/**query:{outputField:{$type,$nativeType}}*/
            Visitors.visitProxy(rootQuery, {
                getUndefinedView: function(name) {
                    var slice = QueryUtils.getQuerySlice(name);
                    QueryUtils.throwError(slice, 'Slice or named view is undefined: {}', name);
                    var query = slice.getQuery();
                    if (!types.get(query)) {
                        var fieldTypes = {};
                        types.put(query, fieldTypes);
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
                        if (types.get(query)) {
                            this.skip = true;
                        }
                    },
                },
                outputField:{
                    before: function(alias, exp) {
                        var query = this.getQuery();
                        if (!types.get(query)) {
                            types.put(query, {});
                        }
                        types.get(query)[alias] = {};
                        this.type = {};
                    },
                    after: function(alias, exp) {
                        var query = this.getQuery();
                        types.get(query)[alias] = this.type;
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
                                throw new Error('Field is undefined {}' + field);
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
                        this.type = JSB.clone(types.get(sourceQuery)[field]);
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
                        if (exp.$toString)    {this.type.$type = DataTypes.string.name;    delete this.type.nativeType;}
                        if (exp.$toInt)       {this.type.$type = DataTypes.integer.name;   delete this.type.nativeType;}
                        if (exp.$toDouble)    {this.type.$type = DataTypes.double.name;    delete this.type.nativeType;}
                        if (exp.$toBoolean)   {this.type.$type = DataTypes.boolean.name;   delete this.type.nativeType;}
                        if (exp.$toDate)      {this.type.$type = DataTypes.date.name;      delete this.type.nativeType;}
                        if (exp.$toTimestamp) {this.type.$type = DataTypes.timestamp.name; delete this.type.nativeType;}
                        if (exp.$dateYear || exp.$dateYearDay || exp.$dateMonth || exp.$dateMonthDay || exp.$dateWeekDay
                            || exp.$dateTotalSeconds || exp.$dateIntervalOrder
                            || exp.$timeHour || exp.$timeMinute || exp.$timeSecond
                            ) {this.type.type = DataTypes.integer.name; delete this.type.nativeType;}
                        if (exp.hasOwnProperty('$const')) {
                            if (JSB.isString(exp.$const))  {this.type.type = DataTypes.string.name;  delete this.type.nativeType;}
                            if (JSB.isInteger(exp.$const)) {this.type.type = DataTypes.integer.name; delete this.type.nativeType;}
                            if (JSB.isFloat(exp.$const))   {this.type.type = DataTypes.double.name;  delete this.type.nativeType;}
                            if (JSB.isBoolean(exp.$const)) {this.type.type = DataTypes.boolean.name; delete this.type.nativeType;}
                            if (JSB.isDate(exp.$const))    {this.type.type = DataTypes.date.name;    delete this.type.nativeType;}
                        }
                        if (exp.$nativeType) this.type.nativeType = exp.$nativeType;
                        if (exp.type) this.type.type = exp.$type;
                    },
                }
            });
            return types;
        },
    }
}