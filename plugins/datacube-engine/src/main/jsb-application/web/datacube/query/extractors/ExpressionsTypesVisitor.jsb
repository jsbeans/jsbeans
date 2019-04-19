{
	$name: 'DataCube.Query.Extractors.ExpressionsTypesVisitor',
	$parent: 'DataCube.Query.Visitors.Visitor',

	$server: {
		$require: [
		    'DataCube.Query.QueryUtils',
		    'Datacube.Types.DataTypes',
		    'java:java.util.HashMap',
        ],

        $constructor: function(query, options){
            $this.query = query;
            $base(options);
            $this.queryFieldTypeMap = new HashMap();
            $this.expressionTypeMap = new HashMap();
        },

		destroy: function(){
		    $this.queryFieldTypeMap = null;
		    $this.expressionTypeMap = null;
		    $base();
		},

        copyType: function(type) {
            return {
                type: type.type,
                nativeType: type.nativeType,
            };
        },

        typeName: function(type) {
            return JSB.isString(type) || !type ? type : type.name;
        },

        extract: function(){
            $this.visit($this.query);
        },

        getUndefinedView: function(name) {
            /// extract extrenal queries types (slice`s fields)
            var slice = QueryUtils.getQuerySlice(name);
            QueryUtils.throwError(slice, 'Slice or named view is undefined: {}', name);
            var query = slice.getQuery();
            if (!$this.queryFieldTypeMap.containsKey(query)) {
                var fieldTypes = {};
                var fields = slice.extractFields();
                for(var field in fields) {
                    fieldTypes[field] = {
                        type: $this.typeName(fields[field].type),
                        nativeType: fields[field].nativeType,
                    };
                }
                $this.queryFieldTypeMap.put(query, fieldTypes);
            }
            return query; // TODO may be return {} ?
        },

        visitQuery: function(query) {
            if ($this.queryFieldTypeMap.containsKey(query)) {
                this.skip = true;
            }
            $base(query);
            if (this.getNestedParentQueries().length > 0) {
                var type = $this.queryFieldTypeMap.get(query)[Object.keys(query.$select)[0]];
                if (!type) throw new Error('Nested query field type is undefined');
                this.type = this.copyType(type);
            } else {
                this.type = null;
            }
        },

        visitFilter: function($filter) {
            this.type = null;
            $base($filter);
        },

        visitPostFilter: function($postFilter) {
            this.type = null;
            $base($postFilter);
        },

        visitGlobalFilter: function($globalFilter) {
            this.type = null;
            $base($globalFilter);
        },

        visitGroupBy: function($groupBy) {
            this.type = null;
            $base($groupBy);
        },

        visitSort: function($sort) {
            this.type = null;
            $base($sort);
        },

        visitOutputField:function(alias, exp) {
            var query = this.getQuery();
            if (!$this.queryFieldTypeMap.containsKey(query)) {
                $this.queryFieldTypeMap.put(query, {});
            }
            this.type = null;

            $base(alias, exp);

            var query = this.getQuery();
            $this.queryFieldTypeMap.get(query)[alias] = this.copyType(this.type);
            this.type = null;
        },

        visitParam: function(name) {
            $base(name);
            var param = this.getParam(name);
            this.type = {
                type:       param.$type,
                nativeType: param.$nativeType,
            };
        },

        visitField: function(field, context, sourceContext) {
            $base(field, context, sourceContext);

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
                if(!fields[field]) {
                    var type = $this.queryFieldTypeMap.get(query)[field];
                    QueryUtils.throwError(type, 'Cube field "{}" is not defined', field);
                    this.type = this.copyType(type);
                } else {
                    this.type = {
                        type: this.typeName(fields[field].type),
                        nativeType: fields[field].nativeType,
                    };
                }
                return;
            } else if (query.$provider) {
                var provider = QueryUtils.getQueryDataProvider(query.$provider);
                var fields = provider.extractFields();
                if(!fields[field]) {
                    var type = $this.queryFieldTypeMap.get(query)[field];
                    QueryUtils.throwError(type, 'Provider field "{}" is not defined', field);
                    this.type = this.copyType(type);
                } else {
                    this.type = {
                        type: this.typeName(fields[field].type),
                        //nativeType: fields[field].nativeType, // TODO it is not vendor (for postgre DOUBLE->DOUBLE PRECISION)
                    };
                }
                return;
            } else {
                throw new Error('Unexpected field source');
            }
            this.type = this.copyType($this.queryFieldTypeMap.get(sourceQuery)[field]);
        },

        visitExpression: function(exp) {
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

            $base(exp);

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

            if (exp.$type || exp.$nativeType) {
                setType.call(this, exp.$type, exp.$nativeType);
            }

            $this.expressionTypeMap.put(exp, JSB.clone(this.type));
        },
    }
}