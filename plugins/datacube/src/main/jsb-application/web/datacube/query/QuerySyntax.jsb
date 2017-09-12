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
	            '$distinct': '$distinctAll',
	            '$postFilter': '$postFilter',
	            '$sort': '$sort',
	            '$finalize': '$finalize'
            },
	        optional: ['$context', '$filter', '$groupBy', '$distinct', '$postFilter', '$sort', '$finalize'],
	    });

	    new this.ComplexObject({
	        name: '$select',
	        desc: 'Select output fields definition',
	        customKey: '#outputFieldName',
	        values: {
	            '#outputFieldName': '$valueDefinition'
	        },
	    });

	    new this.Group({
	    	name: '$valueDefinition',
	        values: ['$expression', '$query', '$field', '$const', '$param'],
	    });

	    new this.Group({
	        name: '$expression',
	        values: [
	            '$macro',
                '$add', '$sub', '$mul', '$div', '$divz', '$mod',
                '$greatest', '$least',
                '$splitString', '$substring', '$trim',
                '$toInt', '$toDouble', '$toBoolean', '$toDate',
                '$dateYear', '$dateMonth', '$dateTotalSeconds', '$dateIntervalOrder',
                '$distinct',
                '$sum', '$count','$min', '$max', '$avg',
                '$array', '$flatArray', '$expandArray',
                '$gsum', '$gcount', '$gmin', '$gmax',
                '$grmaxsum', '$grmaxcount', '$grmaxavg'
            ]
	    });

	    new this.Group({
	        name: '$macro',
	        macro: true,
	        values: []
	    });

	    new this.EArray({
	        name: '$add',
	        desc: 'Addition of values (+)',
	        minOperands: 2,
	        maxOperands: -1,
	        values: ['$expression', '$query', '$field', '$const', '$param'],
	    });
	    new this.EArray({
	        name: '$sub',
	        desc: 'Subtraction of values (-)',
	        minOperands: 2,
	        maxOperands: -1,
	        values: ['$expression', '$query', '$field', '$const', '$param'],
	    });
	    new this.EArray({
	        name: '$mul',
	        desc: 'Multiplication of values (*)',
	        minOperands: 2,
	        maxOperands: -1,
	        values: ['$expression', '$query', '$field', '$const', '$param'],
	    });
	    new this.EArray({
	        name: '$div',
	        desc: 'Division of values (/)',
	        minOperands: 2,
	        maxOperands: -1,
	        values: ['$expression', '$query', '$field', '$const', '$param'],
	    });
	    new this.EArray({
	        name: '$divz',
	        desc: 'Division of values with support zero in the denominator (/)',
	        minOperands: 2,
	        maxOperands: 2,
	        values: ['$expression', '$query', '$field', '$const', '$param'],
	    });
	    new this.EArray({
	        name: '$mod',
	        desc: 'Division by module of values (%)',
	        minOperands: 2,
	        maxOperands: -1,
	        values: ['$expression', '$query', '$field', '$const', '$param'],
	    });

	    new this.EArray({
	        name: '$greatest',
	        desc: 'Select greatest value from several',
	        minOperands: 2,
	        maxOperands: -1,
	        values: ['$expression', '$query', '$field', '$const', '$param'],
	    });
	    new this.EArray({
	        name: '$least',
	        desc: 'Select least value from several',
	        minOperands: 2,
	        maxOperands: -1,
	        values: ['$expression', '$query', '$field', '$const', '$param'],
	    });

	    new this.ComplexObject({
	        name: '$splitString',
	        desc: 'Split string to array',
	        values: {
	            '$field': '$valueDefinition',
	            '$separator': '$constString'
            }
	    });
	    new this.ComplexObject({
            name: '$substring',
	        desc: 'Extract substring',
            values: {
                '$field': '$valueDefinition',
                '$length': '$constInt'
            }
        });

	    new this.SingleObject({
	        name: '$toInt',
	        desc: 'Cast to int',
	        values: ['$expression', '$query', '$field', '$const', '$param'],
	    });
	    new this.SingleObject({
	        name: '$toDouble',
	        desc: 'Cast to double',
	        values: ['$expression', '$query', '$field', '$const', '$param'],
	    });
	    new this.SingleObject({
	        name: '$toBoolean',
	        desc: 'Cast to boolean',
	        values: ['$expression', '$query', '$field', '$const', '$param'],
	    });
	    new this.SingleObject({
	        name: '$toDate',
	        desc: 'Cast to date',
	        values: ['$expression', '$query', '$field', '$const', '$param'],
	    });
	    new this.SingleObject({
	        name: '$dateYear',
	        desc: 'Extract year from date/timestamp',
	        values: ['$expression', '$query', '$field', '$const', '$param'],
	    });
	    new this.SingleObject({
	        name: '$dateMonth',
	        desc: 'Extract month from date/timestamp',
	        values: ['$expression', '$query', '$field', '$const', '$param'],
	    });
	    new this.SingleObject({
	        name: '$dateTotalSeconds',
	        desc: 'Extract total seconds (since 1970-01-01) from date/timestamp',
	        values: ['$expression', '$query', '$field', '$const', '$param'],
	    });
	    new this.SingleObject({
	        name: '$dateIntervalOrder',
	        desc: 'Split date/timestamp to intervals and return order number',
	        values: ['$expression', '$query', '$field', '$const', '$param'],
	    });
	    new this.SingleObject({
	        name: '$distinct',
	        desc: 'Eliminate duplicate values',
	        values: ['$expression', '$field'],
	    });
	    new this.SingleObject({
	        name: '$sum',
	        desc: 'Aggregate sum of valued',
	        aggregate: true,
	        values: ['$expression', '$query', '$field', '$const', '$param', 1],
	    });
	    new this.SingleObject({
	        name: '$count',
	        desc: 'Aggregate count of values',
	        aggregate: true,
	        values: ['$expression', '$query', '$field', '$const', '$param', 1],
	    });
	    new this.SingleObject({
	        name: '$min',
	        desc: 'Aggregate and get min value',
	        aggregate: true,
	        values: ['$expression', '$query', '$field', '$const', '$param'],
	    });
	    new this.SingleObject({
	        name: '$max',
	        desc: 'Aggregate and get max value',
	        aggregate: true,
	        values: ['$expression', '$query', '$field', '$const', '$param'],
	    });
	    new this.SingleObject({
	        name: '$avg',
	        desc: 'Aggregate and get avg value',
	        aggregate: true,
	        values: ['$expression', '$query', '$field', '$const', '$param'],
	    });
	    new this.SingleObject({
	        name: '$array',
	        desc: 'Aggregate values to array',
	        aggregate: true,
	        values: ['$expression', '$query', '$field', '$const', '$param'],
	    });
	    new this.SingleObject({
	        name: '$flatArray',
	        desc: 'Aggregate values and arrays to flat array',
	        aggregate: true,
	        values: ['$expression', '$query', '$field', '$const', '$param'],
	    });
	    new this.SingleObject({
	        name: '$expandArray',
	        desc: 'Expand array values as rows',
	        values: ['$expression', '$query', '$field', '$const', '$param'],
	    });
	    new this.SingleObject({
	        name: '$gsum',
	        desc: 'Global aggregate sum of values',
	        aggregate: true,
	        global: true,
	        values: ['$expression', '$query', '$field', '$const', '$param', 1],
	    });
	    new this.SingleObject({
	        name: '$gcount',
	        desc: 'Global aggregate count of values',
	        aggregate: true,
	        global: true,
	        values: ['$expression', '$query', '$field', '$const', '$param', 1],
	    });
	    new this.SingleObject({
	        name: '$gmin',
	        desc: 'Global aggregate and get min value',
	        aggregate: true,
	        global: true,
	        values: ['$expression', '$query', '$field', '$const', '$param'],
	    });
	    new this.SingleObject({
	        name: '$gmax',
	        desc: 'Global aggregate and get max value',
	        aggregate: true,
	        global: true,
	        values: ['$expression', '$query', '$field', '$const', '$param'],
	    });
	    new this.SingleObject({
	        name: '$grmaxsum',
	        desc: 'Aggregate sum of values in groups and get max aggregated value',
	        aggregate: true,
	        global: true,
	        values: ['$expression', '$query', '$field', '$const', '$param', 1],
	    });
	    new this.SingleObject({
	        name: '$grmaxcount',
	        desc: 'Aggregate count of values in groups and get max aggregated value',
	        aggregate: true,
	        global: true,
	        values: ['$expression', '$query', '$field', '$const', '$param', 1],
	    });
	    new this.SingleObject({
	        name: '$grmaxavg',
	        desc: 'Aggregate avg of values in groups and get max aggregated value',
	        aggregate: true,
	        global: true,
	        values: ['$expression', '$query', '$field', '$const', '$param'],
	    });


	    new this.EArray({
	        name: '$groupBy',
	        desc: 'Group by values definition',
	        minOperands: 1,
	        maxOperands: -1,
	        values: ['$expression', '$field'],
	    });

	    new this.ComplexObject({
	        name: '$filter',
	        desc: 'Filter input data conditions definition',
	        customKey: '#fieldName',
	        values: {
	            '#fieldName': '$valueCondition',

	            '$or': '$or',
	            '$and': '$and',
	            '$not': '$notExpr',

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

	            '$or': '$or',
	            '$and': '$and',
	            '$not': '$notExpr',

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

	    new this.SingleObject({
	        name: '$eq',
	        desc: 'Equals condition (=)',
	        values: ['$expression', '$query', '$field', '$const', '$param'],
	    });
	    new this.SingleObject({
	        name: '$ne',
	        desc: 'Not qquals condition (!=)',
	        values: ['$expression', '$query', '$field', '$const', '$param'],
	    });
	    new this.SingleObject({
	        name: '$gt',
	        desc: 'Greater then condition (>)',
	        values: ['$expression', '$query', '$field', '$const', '$param'],
	    });
	    new this.SingleObject({
	        name: '$gte',
	        desc: 'Greater then or equals condition (>=)',
	        values: ['$expression', '$query', '$field', '$const', '$param'],
	    });
	    new this.SingleObject({
	        name: '$lt',
	        desc: 'Less then condition (<)',
	        values: ['$expression', '$query', '$field', '$const', '$param'],
	    });
	    new this.SingleObject({
	        name: '$lte',
	        desc: 'Less then or equals condition (<=)',
	        values: ['$expression', '$query', '$field', '$const', '$param'],
	    });
	    new this.SingleObject({
	        name: '$like',
	        desc: 'Match strings by patterns (LIKE)',
	        values: ['$expression', '$query', '$field', '$const', '$param'],
	    });
	    new this.SingleObject({
	        name: '$ilike',
	        desc: 'Match strings by patterns ignore case (ILIKE)',
	        values: ['$expression', '$query', '$field', '$const', '$param'],
	    });
	    new this.SingleObject({
	        name: '$in',
	        desc: 'Match if value in array',
	        values: ['$expression', '$query', '$field', '$const', '$param'],
	    });
	    new this.SingleObject({
	        name: '$nin',
	        desc: 'Match if value not in array',
	        values: ['$expression', '$query', '$field', '$const', '$param'],
	    });

	    // expressionCondition
	    new this.EArray({
	        name: '$eqExpr',
	        desc: 'Equals condition on two expressions (=)',
	        minOperands: 2,
	        maxOperands: 2,
	        values: ['$expression', '$query', '$field', '$const', '$param'],
	    });
	    new this.EArray({
	        desc: 'Not equals condition on two expressions (!=)',
	        name: '$neExpr',
	        minOperands: 2,
	        maxOperands: 2,
	        values: ['$expression', '$query', '$field', '$const', '$param'],
	    });
	    new this.EArray({
	        name: '$gtExpr',
	        desc: 'Greater then condition on two expressions (>)',
	        minOperands: 2,
	        maxOperands: 2,
	        values: ['$expression', '$query', '$field', '$const', '$param'],
	    });
	    new this.EArray({
	        name: '$gteExpr',
	        desc: 'Greater then or equals condition on two expressions (>=)',
	        minOperands: 2,
	        maxOperands: 2,
	        values: ['$expression', '$query', '$field', '$const', '$param'],
	    });
	    new this.EArray({
	        name: '$ltExpr',
	        desc: 'Less then condition on two expressions (<)',
	        minOperands: 2,
	        maxOperands: 2,
	        values: ['$expression', '$query', '$field', '$const', '$param'],
	    });
	    new this.EArray({
	        name: '$lteExpr',
	        desc: 'Less then or equals condition on two expressions (<=)',
	        minOperands: 2,
	        maxOperands: 2,
	        values: ['$expression', '$query', '$field', '$const', '$param'],
	    });
	    new this.EArray({
	        name: '$likeExpr',
	        desc: 'Match strings by patterns on two expressions (LIKE)',
	        minOperands: 2,
	        maxOperands: 2,
	        values: ['$expression', '$query', '$field', '$const', '$param'],
	    });
	    new this.EArray({
	        name: '$ilikeExpr',
	        desc: 'Match strings by patterns ignore case on two expressions (ILIKE)',
	        minOperands: 2,
	        maxOperands: 2,
	        values: ['$expression', '$query', '$field', '$const', '$param'],
	    });
	    new this.EArray({
	        name: '$inExpr',
	        desc: 'Match if value in array on two expressions',
	        minOperands: 2,
	        maxOperands: 2,
	        values: ['$expression', '$query', '$field', '$const', '$param'],
	    });
	    new this.EArray({
	        name: '$ninExpr',
	        desc: 'Match if value not in array on two expressions',
	        minOperands: 2,
	        maxOperands: 2,
	        values: ['$expression', '$query', '$field', '$const', '$param'],
	    });
	    new this.SingleObject({
	        name: '$not',
	        desc: 'Inverse condition (NOT)',
	        values: ['$expression', '$query', '$field', '$const', '$param'],
	    });

	    new this.EArray({
	        name: '$sort',
	        desc: 'Sort by definition',
	        minOperands: 1,
	        maxOperands: -1,
	        values: ['$sortDefinition'],
	    });
	    new this.ComplexObject({
	        name: '$sortDefinition',
	        customKey: '#anyFieldName',
	        values: {
	            '#anyFieldName': '$sortType'
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

	    new this.Group({
	        name: '$finalize',
	        desc: 'Finalize transformation',
	        values: ['$finalizeFunction', '$finalizeFields'] // TODO
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
	    
	    new this.SingleObject({
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
	        values: {
	            '$const': '$constValue'
	        }
	    });
	    new this.Group({
	        name: '$constValue',
	        values: ['$constNumber', '$contBoolean', '$constString'],
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
            name: '$contBoolean'
        });
	    new this.EConstString({
            name: '$constString'
        });

	    new this.EConstString({
	        name: '$param'
	    });


        JSB.getLogger().debug('****************** SCHEME BEGIN ******************');
        JSB.getLogger().debug(JSON.stringify($this.schemeExpressions, 0, 4));
        JSB.getLogger().debug('****************** SCHEME END ******************');
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
    },

    unwrapMacros: function(dcQuery) {
        function validateMacro(exp, macro){
            var structure = macro.structure;
            for (var f in structure) if(structure.hasOwnProperty(f)) {
                if (typeof exp[f] === 'undefined') {
                    throw new Error('Field ' + f + ' is not defined in ' + macro.name);
                }
                if (typeof exp[f] !== typeof structure[f]) {
                    throw new Error('Field ' + f + ' must has type ' + structure[f]);
                }
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