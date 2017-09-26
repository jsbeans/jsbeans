{
	$name: 'DataCube.Query.QuerySyntax',
	$singleton: true,

	$require: [],

	$constructor: function(){
        function installSuper(obj, _super) {
            if (!Object.setPrototypeOf) {
                obj.__proto__ = _super;
            } else {
                Object.setPrototypeOf(obj, _super);
            }

            return _super;
        };

        function installExpression(expr) {
            $this.schemeExpressions = $this.schemeExpressions || {};
            $this.schemeExpressions[expr.name] = expr;
        }

        /** Abstract expression value
        */
        this.Expression = function Expression(desc) {
       		desc.expressionType = desc.expressionType || 'Expression';
            JSB.merge(true, this, desc);
            if (!this.name) throw new Error('Undefined expression name');
            if (!this.type) throw new Error(this.name + ': ' + 'Undefined expression type for');

            installExpression(this);
        };

        /** Group of expressions
        */
        this.Group = function Group(desc) {
            desc.type = 'group';
            desc.expressionType = desc.expressionType || 'Group';
            if (!desc.values) throw new Error(desc.name + ': ' + 'Undefined expressions of group');
            var _super = installSuper(this, new $this.EObject(desc));
        };

        /** String expression value
        */
        this.EString = function EString(desc) {
            desc.type = 'string';
            desc.expressionType = desc.expressionType || 'EString';
            var _super = installSuper(this, new $this.Expression(desc));
        };

        /** Abstract object expression value
        */
        this.EArray = function EArray(desc) {
            desc.type = 'array';
            desc.expressionType = desc.expressionType || 'EArray';
            if (!desc.values || Object.keys(desc.values).length < 1) throw new Error(desc.name + ': ' + 'Undefined values ');
            var _super = installSuper(this, new $this.Expression(desc));
        };

        this.EConst = function EConst(desc) {
        	desc.expressionType = desc.expressionType || 'EConst';
            var _super = installSuper(this, new $this.Expression(desc));
        };
        this.EConstNumber = function EConstNumber(desc) {
            desc.type = 'number';
            desc.expressionType = desc.expressionType || 'EConstNumber';
            var _super = installSuper(this, new $this.EConst(desc));
        };
        this.EConstBoolean = function EConstBoolean(desc) {
            desc.type = 'boolean';
            desc.expressionType = desc.expressionType || 'EConstBoolean';
            var _super = installSuper(this, new $this.EConst(desc));
        };
        this.EConstString = function EConstString(desc) {
            desc.type = 'string';
            desc.expressionType = desc.expressionType || 'EConstString';
            var _super = installSuper(this, new $this.EConst(desc));
        };

        /** Abstract object expression value
        */
        this.EObject = function EObject(desc) {
            desc.type = 'object';
            desc.expressionType = desc.expressionType || 'EObject';
            var _super = installSuper(this, new $this.Expression(desc));
        };

        /** Single key object expression value
        */
        this.SingleObject = function SingleObject(desc) {
            if (!desc.values) throw new Error(desc.name + ': ' + 'Undefined object expression values ');
            desc.expressionType = desc.expressionType || 'SingleObject';
            var _super = installSuper(this, new $this.EObject(desc));
        };

        /** Multi keys object expression value - has optional or mandatory N keys
        */
        this.ComplexObject = function ComplexObject(desc) {
            if (JSB.isArray(desc.values)) {
                var arr = desc.values;
                desc.values = {};
                for (var i in arr) {
                    desc.values[arr[i]] = arr[i];
                }
            }
            if (!desc.values) throw new Error(desc.name + ': ' + 'Undefined object expression values');
            desc.expressionType = desc.expressionType || 'ComplexObject';
            var _super = installSuper(this, new $this.EObject(desc));
        };


	    new this.ComplexObject({
	        name: '$query',
	        desc: 'Query expression',
	        values: {
	            '$context': '$contextName',
	            '$filter': '$filter',
	            '$groupBy': '$groupBy',
	            '$select': '$select',
	            '$from':'$from',
	            '$distinct': '$distinctAll',
	            '$postFilter': '$postFilter',
	            '$sort': '$sort',
	            '$limit': '$limit',
	            '$finalize': '$finalize',
	            '$sql': '$sql'
            },
	        optional: ['$context', '$filter', '$groupBy', '$from', '$distinct', '$postFilter', '$sort', '$finalize', '$sql','$limit']
	    });

	    new this.ComplexObject({
	        name: '$select',
	        desc: 'Select output fields definition',
	        displayName: 'Столбцы',
	        customKey: '#outputFieldName',
	        values: {
	            '#outputFieldName': '$valueDefinition'
	        },
	    });

	    new this.Group({
	    	name: '$from',
	        values: ['$query'],
	    });

	    new this.Group({
	    	name: '$valueDefinition',
	        values: ['$expression', '$query', '$field', '$const', '$param'],
	    });

	    new this.Group({
	        name: '$expression',
	        values: [
                '$add', '$sub', '$mul', '$div', '$divz', '$mod',
                '$greatest', '$least',
                '$splitString', '$substring', '$trim',
                '$toInt', '$toDouble', '$toBoolean', '$toDate',
                '$dateYear', '$dateMonth', '$dateTotalSeconds', '$dateIntervalOrder',
                '$distinct',
                '$sum', '$count','$min', '$max', '$avg',
                '$array', '$flatArray', '$expandArray',
                '$gsum', '$gcount', '$gmin', '$gmax',
                '$grmaxsum', '$grmaxcount', '$grmaxavg',
                '$case',
	            '$macros'
            ]
	    });

	    new this.Group({
	        name: '$macros',
	        macro: true,
	        values: []
	    });

	    new this.EArray({
	        name: '$fieldsArray',
	        minOperands: 1,
	        maxOperands: -1,
	        values: ['$field'],
	    });
	    new this.SingleObject({
	        name: '$add',
	        displayName: '+',
	        category: 'Математические операторы',
	        desc: 'Addition of values (+)',
	        values: ['$addValues'],
	    });
	    new this.EArray({
	        name: '$addValues',
	        minOperands: 2,
	        maxOperands: -1,
	        values: ['$expression', '$query', '$field', '$const', '$param'],
	    });
	    new this.SingleObject({
	        name: '$sub',
	        displayName: '-',
	        category: 'Математические операторы',
	        desc: 'Subtraction of values (-)',
	        values: ['$subValues'],
	    });
	    new this.EArray({
	        name: '$subValues',
	        minOperands: 2,
	        maxOperands: -1,
	        values: ['$expression', '$query', '$field', '$const', '$param'],
	    });
	    new this.SingleObject({
	        name: '$mul',
	        displayName: '*',
	        category: 'Математические операторы',
	        desc: 'Multiplication of values (*)',
	        values: ['$mulValues'],
	    });
	    new this.EArray({
	        name: '$mulValues',
	        minOperands: 2,
	        maxOperands: -1,
	        values: ['$expression', '$query', '$field', '$const', '$param'],
	    });
	    new this.SingleObject({
	        name: '$div',
	        displayName: '/',
	        category: 'Математические операторы',
	        desc: 'Division of values (/)',
	        values: ['$divValues'],
	    });
	    new this.EArray({
	        name: '$divValues',
	        minOperands: 2,
	        maxOperands: -1,
	        values: ['$expression', '$query', '$field', '$const', '$param'],
	    });
	    new this.SingleObject({
	        name: '$divz',
	        displayName: '/',
	        category: 'Математические операторы',
	        desc: 'Division of values with support zero in the denominator (/)',
	        values: ['$divzValues'],
	    });
	    new this.EArray({
	        name: '$divzValues',
	        minOperands: 2,
	        maxOperands: 2,
	        values: ['$expression', '$query', '$field', '$const', '$param'],
	    });
	    new this.SingleObject({
	        name: '$mod',
	        displayName: '%',
	        category: 'Математические операторы',
	        desc: 'Division by module of values (%)',
	        values: ['$modValues'],
	    });
	    new this.EArray({
	        name: '$modValues',
	        minOperands: 2,
	        maxOperands: -1,
	        values: ['$expression', '$query', '$field', '$const', '$param'],
	    });

	    // $greatest
	    new this.SingleObject({
	        name: '$greatest',
	        category: 'Функции',
	        desc: 'Select greatest value from several',
	        values: ['$greatestValues'],
	    });
	    new this.EArray({
	        name: '$greatestValues',
	        minOperands: 2,
	        maxOperands: -1,
	        values: ['$expression', '$query', '$field', '$const', '$param'],
	    });

	    // $least
	    new this.SingleObject({
	        name: '$least',
	        category: 'Функции',
	        desc: 'Select least value from several',
	        values: ['$leastValues'],
	    });
	    new this.EArray({
	        name: '$leastValues',
	        minOperands: 2,
	        maxOperands: -1,
	        values: ['$expression', '$query', '$field', '$const', '$param'],
	    });

	    new this.ComplexObject({
	        name: '$splitString',
	        category: 'Функции',
	        desc: 'Split string to array',
	        values: {
	            '$field': '$valueDefinition',
	            '$separator': '$constString'
            }
	    });
	    
	    new this.ComplexObject({
            name: '$substring',
	        category: 'Функции',
	        desc: 'Extract substring',
            values: {
                '$field': '$valueDefinition',
                '$length': '$constNumber'
            }
        });
	    new this.ComplexObject({
            name: '$if',
	        desc: 'If then else',
            values: {
                '$cond': '$filter',
                '$then': '$valueDefinition',
                '$else': '$valueDefinition'
            }
        });


	    new this.SingleObject({
	        name: '$toInt',
	        category: 'Конвертация типов',
	        desc: 'Cast to int',
	        values: ['$const', '$expression', '$query', '$field', '$param'],
	    });
	    new this.SingleObject({
	        name: '$toDouble',
	        category: 'Конвертация типов',
	        desc: 'Cast to double',
	        values: ['$const', '$expression', '$query', '$field', '$param'],
	    });
	    new this.SingleObject({
	        name: '$toBoolean',
	        category: 'Конвертация типов',
	        desc: 'Cast to boolean',
	        values: ['$const', '$expression', '$query', '$field', '$param'],
	    });
	    new this.SingleObject({
	        name: '$toDate',
	        category: 'Конвертация типов',
	        desc: 'Cast to date',
	        values: ['$const', '$expression', '$query', '$field', '$param'],
	    });
	    new this.SingleObject({
	        name: '$dateYear',
	        category: 'Функции',
	        desc: 'Extract year from date/timestamp',
	        values: ['$const', '$expression', '$query', '$field', '$param'],
	    });
	    new this.SingleObject({
	        name: '$dateMonth',
	        category: 'Функции',
	        desc: 'Extract month from date/timestamp',
	        values: ['$const', '$expression', '$query', '$field', '$param'],
	    });
	    new this.SingleObject({
	        name: '$dateTotalSeconds',
	        category: 'Функции',
	        desc: 'Extract total seconds (since 1970-01-01) from date/timestamp',
	        values: ['$const', '$expression', '$query', '$field', '$param'],
	    });
	    new this.SingleObject({
	        name: '$dateIntervalOrder',
	        category: 'Функции',
	        desc: 'Split date/timestamp to intervals and return order number',
	        values: ['$const', '$expression', '$query', '$field', '$param'],
	    });
	    new this.SingleObject({
	        name: '$distinct',
	        category: 'Функции',
	        desc: 'Eliminate duplicate values',
	        values: ['$field', '$expression'],
	    });
	    new this.SingleObject({
	        name: '$sum',
	        category: 'Операторы агрегации',
	        desc: 'Aggregate sum of valued',
	        aggregate: true,
	        values: ['$const', '$expression', '$query', '$field', '$param', 1],
	    });
	    new this.SingleObject({
	        name: '$count',
	        category: 'Операторы агрегации',
	        desc: 'Aggregate count of values',
	        aggregate: true,
	        values: ['$const', '$expression', '$query', '$field', '$param', 1],
	    });
	    new this.SingleObject({
	        name: '$min',
	        category: 'Операторы агрегации',
	        desc: 'Aggregate and get min value',
	        aggregate: true,
	        values: ['$const', '$expression', '$query', '$field', '$param'],
	    });
	    new this.SingleObject({
	        name: '$max',
	        category: 'Операторы агрегации',
	        desc: 'Aggregate and get max value',
	        aggregate: true,
	        values: ['$const', '$expression', '$query', '$field', '$param'],
	    });
	    new this.SingleObject({
	        name: '$avg',
	        category: 'Операторы агрегации',
	        desc: 'Aggregate and get avg value',
	        aggregate: true,
	        values: ['$const', '$expression', '$query', '$field', '$param'],
	    });
	    new this.SingleObject({
	        name: '$array',
	        category: 'Операторы агрегации',
	        desc: 'Aggregate values to array',
	        aggregate: true,
	        values: ['$const', '$expression', '$query', '$field', '$param'],
	    });
	    new this.SingleObject({
	        name: '$flatArray',
	        category: 'Операторы агрегации',
	        desc: 'Aggregate values and arrays to flat array',
	        aggregate: true,
	        values: ['$const', '$expression', '$query', '$field', '$param'],
	    });
	    new this.SingleObject({
	        name: '$expandArray',
	        category: 'Операторы агрегации',
	        desc: 'Expand array values as rows',
	        values: ['$const', '$expression', '$query', '$field', '$param'],
	    });
	    new this.SingleObject({
	        name: '$gsum',
	        category: 'Операторы агрегации',
	        desc: 'Global aggregate sum of values',
	        aggregate: true,
	        global: true,
	        values: ['$const', '$expression', '$query', '$field', '$param', 1],
	    });
	    new this.SingleObject({
	        name: '$gcount',
	        category: 'Операторы агрегации',
	        desc: 'Global aggregate count of values',
	        aggregate: true,
	        global: true,
	        values: ['$const', '$expression', '$query', '$field', '$param', 1],
	    });
	    new this.SingleObject({
	        name: '$gmin',
	        category: 'Операторы агрегации',
	        desc: 'Global aggregate and get min value',
	        aggregate: true,
	        global: true,
	        values: ['$const', '$expression', '$query', '$field', '$param'],
	    });
	    new this.SingleObject({
	        name: '$gmax',
	        category: 'Операторы агрегации',
	        desc: 'Global aggregate and get max value',
	        aggregate: true,
	        global: true,
	        values: ['$const', '$expression', '$query', '$field', '$param'],
	    });
	    new this.SingleObject({
	        name: '$grmaxsum',
	        category: 'Операторы агрегации',
	        desc: 'Aggregate sum of values in groups and get max aggregated value',
	        aggregate: true,
	        global: true,
	        values: ['$const', '$expression', '$query', '$field', '$param', 1],
	    });
	    new this.SingleObject({
	        name: '$grmaxcount',
	        category: 'Операторы агрегации',
	        desc: 'Aggregate count of values in groups and get max aggregated value',
	        aggregate: true,
	        global: true,
	        values: ['$const', '$expression', '$query', '$field', '$param', 1],
	    });
	    new this.SingleObject({
	        name: '$grmaxavg',
	        category: 'Операторы агрегации',
	        desc: 'Aggregate avg of values in groups and get max aggregated value',
	        aggregate: true,
	        global: true,
	        values: ['$const', '$expression', '$query', '$field', '$param'],
	    });


	    new this.EArray({
	        name: '$groupBy',
	        displayName: 'Группировка',
	        desc: 'Group by values definition',
	        minOperands: 1,
	        maxOperands: -1,
	        values: ['$expression', '$field'],
	    });

	    new this.ComplexObject({
	        name: '$filter',
	        displayName: 'Фильтр',
	        desc: 'Filter input data conditions definition',
	        customKey: '#fieldName',
	        values: {
	            '#fieldName': '$valueCondition',

	            '$or': '$or',
	            '$and': '$and',
	            '$not': '$filter',

	            '$eq': '$eqExpr',
	            '$ne': '$neExpr',
	            '$gt': '$gtExpr',
	            '$gte': '$gteExpr',
	            '$lt': '$ltExpr',
	            '$lte': '$lteExpr',
	            '$like': '$likeExpr',
	            '$ilike': '$ilikeExpr',
	            '$in': '$inExpr',
	            '$nin': '$ninExpr',
	        },
	        optional: ['#fieldName', '$and', '$or', '$not', '$eq', '$ne', '$gte', '$gt', '$lte', '$lt', '$ilike', '$like', '$in', '$nin']
	    });


	    new this.ComplexObject({
	        name: '$postFilter',
	        desc: 'Filter output data conditions definition',
	        customKey: '#outputFieldName',
	        values: {
	            '#outputFieldName': '$valueCondition',

	            '$or': '$orPostFilter',
	            '$and': '$andPostFilter',
	            '$not': '$postFilter',

	            '$eq': '$eqExpr',
	            '$ne': '$neExpr',
	            '$gt': '$gtExpr',
	            '$gte': '$gteExpr',
	            '$lt': '$ltExpr',
	            '$lte': '$lteExpr',
	            '$like': '$likeExpr',
	            '$ilike': '$ilikeExpr',
	            '$in': '$inExpr',
	            '$nin': '$ninExpr',
	        }
	    });

	    // valueCondition
        new this.Group({
	        name: '$valueCondition',
	        values: [ '$eq','$ne', '$gt', '$gte', '$lt', '$lte',
                '$like', '$ilike', '$in', '$nin' ],
	    });

	    new this.EArray({
	        name: '$or',
	        category: 'Логические операторы',
	        displayName: 'или',
	        desc: '',
	        minOperands: 1,
	        maxOperands: -1,
	        values: ['$filter'],
	    });

	    new this.EArray({
	        name: '$and',
	        category: 'Логические операторы',
	        displayName: 'и',
	        desc: '',
	        minOperands: 1,
	        maxOperands: -1,
	        values: ['$filter'],
	    });

	    new this.EArray({
	        name: '$orPostFilter',
	        minOperands: 1,
	        maxOperands: -1,
	        values: ['$postFilter'],
	    });

	    new this.EArray({
	        name: '$andPostFilter',
	        minOperands: 1,
	        maxOperands: -1,
	        values: ['$postFilter'],
	    });

	    new this.SingleObject({
	        name: '$eq',
	        category: 'Операторы сравнения',
	        displayName: '=',
	        desc: 'Equals condition (=)',
	        values: ['$const', '$expression', '$query', '$field', '$param'],
	    });
	    new this.SingleObject({
	        name: '$ne',
	        category: 'Операторы сравнения',
	        displayName: '&ne;',
	        desc: 'Not equals condition (!=)',
	        values: ['$const', '$expression', '$query', '$field', '$param'],
	    });
	    new this.SingleObject({
	        name: '$gt',
	        category: 'Операторы сравнения',
	        displayName: '&gt;',
	        desc: 'Greater then condition (>)',
	        values: ['$const', '$expression', '$query', '$field', '$param'],
	    });
	    new this.SingleObject({
	        name: '$gte',
	        category: 'Операторы сравнения',
	        displayName: '&ge;',
	        desc: 'Greater then or equals condition (>=)',
	        values: ['$const', '$expression', '$query', '$field', '$param'],
	    });
	    new this.SingleObject({
	        name: '$lt',
	        category: 'Операторы сравнения',
	        displayName: '&lt;',
	        desc: 'Less then condition (<)',
	        values: ['$const', '$expression', '$query', '$field', '$param'],
	    });
	    new this.SingleObject({
	        name: '$lte',
	        category: 'Операторы сравнения',
	        displayName: '&le;',
	        desc: 'Less then or equals condition (<=)',
	        values: ['$const', '$expression', '$query', '$field', '$param'],
	    });
	    new this.SingleObject({
	        name: '$like',
	        category: 'Операторы сравнения',
	        displayName: '&asymp;',
	        desc: 'Match strings by patterns (LIKE)',
	        values: ['$const', '$expression', '$query', '$field', '$param'],
	    });
	    new this.SingleObject({
	        name: '$ilike',
	        category: 'Операторы сравнения',
	        displayName: '&sim;',
	        desc: 'Match strings by patterns ignore case (ILIKE)',
	        values: ['$const', '$expression', '$query', '$field', '$param'],
	    });
	    new this.SingleObject({
	        name: '$in',
	        category: 'Операторы множеств',
	        displayName: '&isin;',
	        desc: 'Match if value in array',
	        values: ['$const', '$expression', '$query', '$field', '$param'],
	    });
	    new this.SingleObject({
	        name: '$nin',
	        category: 'Операторы множеств',
	        displayName: '&notin;',
	        desc: 'Match if value not in array',
	        values: ['$const', '$expression', '$query', '$field', '$param'],
	    });

	    // expressionCondition
	    new this.EArray({
	        name: '$eqExpr',
	        desc: 'Equals condition on two expressions (=)',
	        minOperands: 2,
	        maxOperands: 2,
	        values: ['$const', '$expression', '$query', '$field', '$param'],
	    });
	    new this.EArray({
	        desc: 'Not equals condition on two expressions (!=)',
	        name: '$neExpr',
	        minOperands: 2,
	        maxOperands: 2,
	        values: ['$const', '$expression', '$query', '$field', '$param'],
	    });
	    new this.EArray({
	        name: '$gtExpr',
	        desc: 'Greater then condition on two expressions (>)',
	        minOperands: 2,
	        maxOperands: 2,
	        values: ['$const', '$expression', '$query', '$field', '$param'],
	    });
	    new this.EArray({
	        name: '$gteExpr',
	        desc: 'Greater then or equals condition on two expressions (>=)',
	        minOperands: 2,
	        maxOperands: 2,
	        values: ['$const', '$expression', '$query', '$field', '$param'],
	    });
	    new this.EArray({
	        name: '$ltExpr',
	        desc: 'Less then condition on two expressions (<)',
	        minOperands: 2,
	        maxOperands: 2,
	        values: ['$const', '$expression', '$query', '$field', '$param'],
	    });
	    new this.EArray({
	        name: '$lteExpr',
	        desc: 'Less then or equals condition on two expressions (<=)',
	        minOperands: 2,
	        maxOperands: 2,
	        values: ['$const', '$expression', '$query', '$field', '$param'],
	    });
	    new this.EArray({
	        name: '$likeExpr',
	        desc: 'Match strings by patterns on two expressions (LIKE)',
	        minOperands: 2,
	        maxOperands: 2,
	        values: ['$const', '$expression', '$query', '$field', '$param'],
	    });
	    new this.EArray({
	        name: '$ilikeExpr',
	        desc: 'Match strings by patterns ignore case on two expressions (ILIKE)',
	        minOperands: 2,
	        maxOperands: 2,
	        values: ['$const', '$expression', '$query', '$field', '$param'],
	    });
	    new this.EArray({
	        name: '$inExpr',
	        desc: 'Match if value in array on two expressions',
	        minOperands: 2,
	        maxOperands: 2,
	        values: ['$const', '$expression', '$query', '$field', '$param'],
	    });
	    new this.EArray({
	        name: '$ninExpr',
	        desc: 'Match if value not in array on two expressions',
	        minOperands: 2,
	        maxOperands: 2,
	        values: ['$const', '$expression', '$query', '$field', '$param'],
	    });
	    new this.SingleObject({
	        name: '$not',
	        category: 'Логические операторы',
	        displayName: 'не',
	        desc: 'Inverse condition (NOT)',
	        values: ['$const', '$expression', '$query', '$field', '$param'],
	    });

	    new this.EArray({
	        name: '$sort',
	        displayName: 'Сортировка',
	        desc: 'Sort by definition',
	        minOperands: 1,
	        maxOperands: -1,
	        values: ['$sortDefinition'],
	    });
	    
	    new this.Group({
	        name: '$sortDefinition',
	        values: ['$sortField', '$sortExpression']
	    });
	    
	    new this.ComplexObject({
	        name: '$sortField',
	        customKey: '#anyFieldName',
	        minOperands: 1,
	        maxOperands: 1,
	        values: {
	            '#anyFieldName': '$sortType'
	        },
	    });
	    
	    new this.ComplexObject({
	        name: '$sortExpression',
	        values: {
	            '$expr': '$valueDefinition',
	            '$type': '$sortType',
	        },
	    });
	    
	    new this.Group({
	        name: '$sortType',
	        values: ['$sortTypeAsc', '$sortTypeDesc']
	    });
	    
	    new this.EConstNumber({
	        name: '$sortTypeAsc',
	        value: 1,
	    });
	    
	    new this.EConstNumber({
	        name: '$sortTypeDesc',
	        value: -1,
	    });

	    new this.EConstNumber({
	        name: '$limit',
	    });

	    new this.Group({
	        name: '$finalize',
	        desc: 'Finalize transformation',
	        values: ['$finalizeFunction', '$finalizeFields']
	    });
	    
	    new this.ComplexObject({
            name: '$finalizeFields',
            customKey: '#field',
			values: {
			    '#field': '$finalizeExpression'
			}
        });
	    
	    new this.ComplexObject({
	        name: '$finalizeExpression',
	        values: {
	            '$replace': '$finalizeReplace'
//	            '$group': '$finalizeGroup'
	        },
	    });
	    
	    new this.ComplexObject({
            name: '$finalizeReplace',
	        desc: 'Replace values map (key - string "value" or regexp "/R/i")',
	        customKey: '#value',
	        values: {
	            '#value': '$replaceWithValue'
	        },
        });
	    
	    new this.Group({
	        name: '$replaceWithValue',
	        values: ['$constString', '$constNumber', '$constBoolean'],
	    });

	    new this.EConstBoolean({
	        name: '$distinctAll',
	        desc: 'Eliminate duplicate rows',
	        value: true,
	    });


	    new this.Group({
	        name: '$field',
	        values: ['$fieldExpr', '$fieldName'],
	    });
	    
	    new this.ComplexObject({
	        name: '$fieldExpr',
	        desc: 'Field namr',
	        values: {
	            '$field': '$fieldName',
	            '$context': '$contextName'
	        },
	        optional: ['$context']
	    });

	    new this.SingleObject({
	        name: '$const',
	        desc: 'Constant value',
	        values: ['$constValue']
	    });
	    
	    new this.Group({
	        name: '$constValue',
	        values: ['$constNumber', '$constBoolean', '$constString'],
	    });
	    
	    

	    new this.EConstString({
	        name: '$fieldName'
	    });
	    
	    new this.EConstString({
	        name: '$contextName'
	    });

	    new this.EConstNumber({
            name: '$constNumber'
        });
	    
	    new this.EConstBoolean({
            name: '$constBoolean'
        });
	    
	    new this.EConstString({
            name: '$constString'
        });

	    new this.EConstString({
	        name: '$param'
	    });
	    
	    new this.EConstString({
	        name: '$sql'
	    });

	},

	macros: {},

    schemaAggregateOperators: {
        $sum: {},
        $count: {},
        $min: {},
        $max: {},
        $avg: {},
        $array: {},
        $flatArray: {},
        $gsum: {},
        $gcount: {},
        $gmin: {},
        $gmax: {},
        $grmaxsum: {},
        $grmaxcount: {},
        $grmaxavg: {},
    },

	getSchema: function (){
	    return this.schemeExpressions;
    },

    registerMacros: function(name, structure, objectGenerator) {
        this.macros[name] = {
            name: name,
            structure: structure,
            objectGenerator: objectGenerator
        };

        $this.getSchema().$macros.values.push(name);
        new this.ComplexObject({
	        name: name,
	        values: (function(){
	            var values = {};
	            var valueName;
	            for (var f in structure) if (structure.hasOwnProperty(f)) {
	                if (!structure[f].name) {
	                    throw new Error('Field value descriptor name is not defined for macro ' + name);
	                }
	                values[f] = structure[f].name;
	            }
	            return values;
	        })()
        });
        JSB.getLogger().debug('Registered DataCube query macro ' + name);
    },

    unwrapMacros: function(dcQuery) {
        function validateMacro(exp, macro){
            var structure = macro.structure;
            for (var f in structure) if(structure.hasOwnProperty(f)) {
                if (typeof exp[f] === 'undefined') {
                    throw new Error('Field ' + f + ' is not defined in ' + macro.name);
                }
//                if (typeof exp[f] !== typeof structure[f]) {
//                    throw new Error('Field ' + f + ' must has type ' + structure[f]);
//                }
            }
        }

        function unwrapExpression(exp, setFunc) {
            if (JSB.isPlainObject(exp)) {
                var key = Object.keys(exp)[0];
                for (var name in $this.macros) {
                    if (name == key) {
                        validateMacro(exp[key], $this.macros[name].structure);
                        //dcQuery.$select[alias] = $this.macros[name].objectGenerator.call(null, exp[key], dcQuery);
                        setFunc($this.macros[name].objectGenerator.call(null, exp[key], dcQuery));
                        return;
                    }
                }
                for (var f in exp) if(exp.hasOwnProperty(f)) {
                    unwrapExpression(exp[f], function(newExp){
                       exp[f] = newExp;
                   });
                }
            } else if (JSB.isArray(exp)) {
                for (var i in exp) {
                    unwrapExpression(exp[i], function(newExp){
                        exp[i] = newExp;
                    });
                }
            }
        }

        for (var alias in dcQuery.$select) if(dcQuery.$select.hasOwnProperty(alias)) {
            unwrapExpression(dcQuery.$select[alias], function(newExp){
                dcQuery.$select[alias] = newExp;
            });
        }
    }
}