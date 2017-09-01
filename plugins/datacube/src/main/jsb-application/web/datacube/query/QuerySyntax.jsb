{
	$name: 'DataCube.Query.QuerySyntax',
	$singleton: true,

	$server: {
		$require: [],

		$constructor: function(){
            function installSuper(obj, super) {
                if (!Object.setPrototypeOf) {
                    obj.__proto__ = super;
                } else {
                    Object.setPrototypeOf(obj, super);
                }

                return super;
            };

            function installExpression(expr) {
                $this.schemeExpressions = $this.schemeExpressions || {};
                $this.schemeExpressions[expr.name] = expr;
            }

            /** Abstract expression value
            */
            this.Expression = function Expression(desc) {
                JSB.merge(true, this, desc);
                if (!this.name) throw new Error('Undefined expression name');
                if (!this.type) throw new Error(this.name + ': ' + 'Undefined expression type for');

                installExpression(this);
            };

            /** Group of expressions
            */
            this.Group = function Group(desc) {
                desc.type = 'group';
                if (!desc.values) throw new Error(desc.name + ': ' + 'Undefined expressions of group');
                var super = installSuper(this, new $this.EObject(desc));
            };

            /** String expression value
            */
            this.EString = function EString(desc) {EString
                desc.type = 'string';
                var super = installSuper(this, new $this.Expression(desc));
            };

            /** Abstract object expression value
            */
            this.EArray = function EArray(desc) {
                desc.type = 'array';
                if (!desc.values || Object.keys(desc.values).length < 1) throw new Error(desc.name + ': ' + 'Undefined values ');
                var super = installSuper(this, new $this.Expression(desc));
            };

            this.EConst = function EConst(desc) {
                var super = installSuper(this, new $this.Expression(desc));
            };
            this.EConstNumber = function EConstNumber(desc) {
                desc.type = 'number';
                var super = installSuper(this, new $this.EConst(desc));
            };
            this.EConstBoolean = function EConstBoolean(desc) {
                desc.type = 'boolean';
                var super = installSuper(this, new $this.EConst(desc));
            };
            this.EConstString = function EConstString(desc) {
                desc.type = 'string';
                var super = installSuper(this, new $this.EConst(desc));
            };

            /** Abstract object expression value
            */
            this.EObject = function EObject(desc) {
                desc.type = 'object';
                var super = installSuper(this, new $this.Expression(desc));
            };

            /** Single key object expression value
            */
            this.SingleObject = function SingleObject(desc) {
                if (!desc.values) throw new Error(desc.name + ': ' + 'Undefined object expression values ');
                var super = installSuper(this, new $this.EObject(desc));
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
                var super = installSuper(this, new $this.EObject(desc));
            };


		    new this.ComplexObject({
		        name: '$query',
		        values: {
		            '$filter': '$filter',
		            '$groupBy': '$groupBy',
		            '$select': '$select',
		            '$distinct': '$distinctAll',
		            '$postFilter': '$postFilter',
		            '$sort': '$sort',
		            '$finalize': '$finalize'
                },
		        optional: ['$filter', '$groupBy', '$distinct', '$postFilter', '$sort', '$finalize'],
		    });

		    new this.ComplexObject({
		        name: '$select',
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
                    '$array', '$flatArray',
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
		        minOperands: 2,
		        maxOperands: -1,
		        values: ['$expression', '$query', '$field', '$const', '$param'],
		    });
		    new this.EArray({
		        name: '$sub',
		        minOperands: 2,
		        maxOperands: -1,
		        values: ['$expression', '$query', '$field', '$const', '$param'],
		    });
		    new this.EArray({
		        name: '$mul',
		        minOperands: 2,
		        maxOperands: -1,
		        values: ['$expression', '$query', '$field', '$const', '$param'],
		    });
		    new this.EArray({
		        name: '$div',
		        minOperands: 2,
		        maxOperands: -1,
		        values: ['$expression', '$query', '$field', '$const', '$param'],
		    });
		    new this.EArray({
		        name: '$divz',
		        minOperands: 2,
		        maxOperands: 2,
		        values: ['$expression', '$query', '$field', '$const', '$param'],
		    });
		    new this.EArray({
		        name: '$mod',
		        minOperands: 2,
		        maxOperands: -1,
		        values: ['$expression', '$query', '$field', '$const', '$param'],
		    });

		    new this.EArray({
		        name: '$greatest',
		        minOperands: 2,
		        maxOperands: -1,
		        values: ['$expression', '$query', '$field', '$const', '$param'],
		    });
		    new this.EArray({
		        name: '$least',
		        minOperands: 2,
		        maxOperands: -1,
		        values: ['$expression', '$query', '$field', '$const', '$param'],
		    });

		    new this.ComplexObject({
		        name: '$splitString',
		        values: {
		            '$field': '$valueDefinition',
		            '$separator': '$constString'
                }
		    });
		    new this.ComplexObject({
                name: '$substring',
                values: {
                    '$field': '$valueDefinition',
                    '$length': '$constInt'
                }
            });

		    new this.SingleObject({
		        name: '$toInt',
		        values: ['$expression', '$query', '$field', '$const', '$param'],
		    });
		    new this.SingleObject({
		        name: '$toDouble',
		        values: ['$expression', '$query', '$field', '$const', '$param'],
		    });
		    new this.SingleObject({
		        name: '$toBoolean',
		        values: ['$expression', '$query', '$field', '$const', '$param'],
		    });
		    new this.SingleObject({
		        name: '$toDate',
		        values: ['$expression', '$query', '$field', '$const', '$param'],
		    });
		    new this.SingleObject({
		        name: '$dateYear',
		        values: ['$expression', '$query', '$field', '$const', '$param'],
		    });
		    new this.SingleObject({
		        name: '$dateMonth',
		        values: ['$expression', '$query', '$field', '$const', '$param'],
		    });
		    new this.SingleObject({
		        name: '$dateTotalSeconds',
		        values: ['$expression', '$query', '$field', '$const', '$param'],
		    });
		    new this.SingleObject({
		        name: '$dateIntervalOrder',
		        values: ['$expression', '$query', '$field', '$const', '$param'],
		    });
		    new this.SingleObject({
		        name: '$dateYear',
		        values: ['$expression', '$query', '$field', '$const', '$param'],
		    });
		    new this.SingleObject({
		        name: '$distinct',
		        values: ['$expression', '$field'],
		    });
		    new this.SingleObject({
		        name: '$sum',
		        aggregate: true,
		        values: ['$expression', '$query', '$field', '$const', '$param', 1],
		    });
		    new this.SingleObject({
		        name: '$count',
		        aggregate: true,
		        values: ['$expression', '$query', '$field', '$const', '$param', 1],
		    });
		    new this.SingleObject({
		        name: '$min',
		        aggregate: true,
		        values: ['$expression', '$query', '$field', '$const', '$param'],
		    });
		    new this.SingleObject({
		        name: '$max',
		        aggregate: true,
		        values: ['$expression', '$query', '$field', '$const', '$param'],
		    });
		    new this.SingleObject({
		        name: '$avg',
		        aggregate: true,
		        values: ['$expression', '$query', '$field', '$const', '$param'],
		    });
		    new this.SingleObject({
		        name: '$array',
		        aggregate: true,
		        values: ['$expression', '$query', '$field', '$const', '$param'],
		    });
		    new this.SingleObject({
		        name: '$flatArray',
		        aggregate: true,
		        values: ['$expression', '$query', '$field', '$const', '$param'],
		    });
		    new this.SingleObject({
		        name: '$gsum',
		        aggregate: true,
		        global: true,
		        values: ['$expression', '$query', '$field', '$const', '$param', 1],
		    });
		    new this.SingleObject({
		        name: '$gcount',
		        aggregate: true,
		        global: true,
		        values: ['$expression', '$query', '$field', '$const', '$param', 1],
		    });
		    new this.SingleObject({
		        name: '$gmin',
		        aggregate: true,
		        global: true,
		        values: ['$expression', '$query', '$field', '$const', '$param'],
		    });
		    new this.SingleObject({
		        name: '$gmax',
		        aggregate: true,
		        global: true,
		        values: ['$expression', '$query', '$field', '$const', '$param'],
		    });
		    new this.SingleObject({
		        name: '$grmaxsum',
		        aggregate: true,
		        global: true,
		        values: ['$expression', '$query', '$field', '$const', '$param', 1],
		    });
		    new this.SingleObject({
		        name: '$grmaxcount',
		        aggregate: true,
		        global: true,
		        values: ['$expression', '$query', '$field', '$const', '$param', 1],
		    });
		    new this.SingleObject({
		        name: '$grmaxavg',
		        aggregate: true,
		        global: true,
		        values: ['$expression', '$query', '$field', '$const', '$param'],
		    });


		    new this.EArray({
		        name: '$groupBy',
		        minOperands: 1,
		        maxOperands: -1,
		        values: ['$expression', '$field'],
		    });

		    new this.ComplexObject({
		        name: '$filter',
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
		        }
		    });

		    new this.ComplexObject({
		        name: '$postFilter',
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
		        values: ['$expression', '$query', '$field', '$const', '$param'],
		    });
		    new this.SingleObject({
		        name: '$ne',
		        values: ['$expression', '$query', '$field', '$const', '$param'],
		    });
		    new this.SingleObject({
		        name: '$gt',
		        values: ['$expression', '$query', '$field', '$const', '$param'],
		    });
		    new this.SingleObject({
		        name: '$gte',
		        values: ['$expression', '$query', '$field', '$const', '$param'],
		    });
		    new this.SingleObject({
		        name: '$lt',
		        values: ['$expression', '$query', '$field', '$const', '$param'],
		    });
		    new this.SingleObject({
		        name: '$lte',
		        values: ['$expression', '$query', '$field', '$const', '$param'],
		    });
		    new this.SingleObject({
		        name: '$like',
		        values: ['$expression', '$query', '$field', '$const', '$param'],
		    });
		    new this.SingleObject({
		        name: '$ilike',
		        values: ['$expression', '$query', '$field', '$const', '$param'],
		    });
		    new this.SingleObject({
		        name: '$in',
		        values: ['$expression', '$query', '$field', '$const', '$param'],
		    });
		    new this.SingleObject({
		        name: '$nin',
		        values: ['$expression', '$query', '$field', '$const', '$param'],
		    });

		    // expressionCondition
		    new this.EArray({
		        name: '$eqExpr',
		        minOperands: 2,
		        maxOperands: 2,
		        values: ['$expression', '$query', '$field', '$const', '$param'],
		    });
		    new this.EArray({
		        name: '$neExpr',
		        minOperands: 2,
		        maxOperands: 2,
		        values: ['$expression', '$query', '$field', '$const', '$param'],
		    });
		    new this.EArray({
		        name: '$gtExpr',
		        minOperands: 2,
		        maxOperands: 2,
		        values: ['$expression', '$query', '$field', '$const', '$param'],
		    });
		    new this.EArray({
		        name: '$gteExpr',
		        minOperands: 2,
		        maxOperands: 2,
		        values: ['$expression', '$query', '$field', '$const', '$param'],
		    });
		    new this.EArray({
		        name: '$ltExpr',
		        minOperands: 2,
		        maxOperands: 2,
		        values: ['$expression', '$query', '$field', '$const', '$param'],
		    });
		    new this.EArray({
		        name: '$lteExpr',
		        minOperands: 2,
		        maxOperands: 2,
		        values: ['$expression', '$query', '$field', '$const', '$param'],
		    });
		    new this.EArray({
		        name: '$likeExpr',
		        minOperands: 2,
		        maxOperands: 2,
		        values: ['$expression', '$query', '$field', '$const', '$param'],
		    });
		    new this.EArray({
		        name: '$ilikeExpr',
		        minOperands: 2,
		        maxOperands: 2,
		        values: ['$expression', '$query', '$field', '$const', '$param'],
		    });
		    new this.EArray({
		        name: '$inExpr',
		        minOperands: 2,
		        maxOperands: 2,
		        values: ['$expression', '$query', '$field', '$const', '$param'],
		    });
		    new this.EArray({
		        name: '$ninExpr',
		        minOperands: 2,
		        maxOperands: 2,
		        values: ['$expression', '$query', '$field', '$const', '$param'],
		    });
		    new this.SingleObject({
		        name: '$not',
		        values: ['$expression', '$query', '$field', '$const', '$param'],
		    });

		    new this.EArray({
		        name: '$sort',
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
		        values: ['$finalizeFunction', '$finalizeObject'] // TODO
		    });

		    new this.EConstBoolean({
		        name: '$distinctAll',
		        value: true,
		    });


		    new this.Group({
		        name: '$field',
		        values: ['$fieldExpr', '$fieldName'],
		    });
		    new this.SingleObject({
		        name: '$fieldExpr',
		        values: {
		            '$field': '$fieldName',
		            '$context': '$contextName'
		        },
		        optional: ['$context']
		    });

		    new this.SingleObject({
		        name: '$const',
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


            Log.debug('****************** SCHEME BEGIN ******************');
            Log.debug(JSON.stringify($this.schemeExpressions, 0, 4));
            Log.debug('****************** SCHEME END ******************');
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
}