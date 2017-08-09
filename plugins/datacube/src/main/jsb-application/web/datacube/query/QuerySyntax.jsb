{
	$name: 'DataCube.Query.QuerySyntax',
	$singleton: true,

	$server: {
		$require: [],

		$constructor: function(){
//		    EObj({
//		        id: '$query',
//		        type: 'object',
//		        keys: ['$filter', '$select', '$sort', '$finalize', '$distinct'],
//		        multi: M.Any
//		    });
//
//		    EMObj({
//		        id: '$select',
//		        type: 'object',
//		        keys: ['$$name'],
//		        multi: M.Any,
//		        value: '$$defineField'
//		    });
//
//		    ENamedObj({
//		        id: '$$defineField',
//		        type: 'object',
//
//		        '$$expression',
//		        M.Single
//		    });
//
//		    EObj('$$expression', [
//                '$sum', '$count','$min', '$max', '$avg',
//                '$array', '$flatArray', '$gsum', '$gcount', '$gmin', '$gmax',
//                '$grmaxsum', '$grmaxcount', '$grmaxavg',
//                '$toInt', '$toDouble', '$toBoolean', '$distinct',
//                '$add', '$sub', '$mul', '$div', '$mod',
//                '$const', '$field', '$$name', '$$param'], M.Single);
//            EFuncAgg('$sum', );
		},

		macros: {},

        schemaRoot:{
            $query: {
                root: true,
                type: 'object',
                multiValues: true,
                values: [ '$filter', '$select', '$sort', '$finalize', '$distinct'],
            },
        },

		schemaQuery: {
            $filter: {
                type: 'object',
                property: '$field',
                values: [ '$$conditionOperators', '$$multiOperators' ]
            },

            $select: {
                type: 'object',
                property: '$alias',
                values: [ '$field', '$$functionOperators', '$$aggregateOperators', ]
            },

            $sort: {
		        type: 'array',
                values: ['$field', '$alias']
            },

            $finalize: [
                {
                    type: 'function',
                    returnType: 'object',
                    arguments: ['object']
                },
                {
                    type: 'object',
                    property: '$alias',
                    values: ['$replace']
                },
                {
                    type: 'object',
                    property: '$alias',
                    values: ['$groupFields']
                },
//                {
//                    type: 'object',
//                    property: '$alias',
//                    values: ['$mergeFields']
//                }
            ],
        },

        schemaCollections: {
            $$aggregateOperator: [
                '$sum', '$count','$min', '$max', '$avg',
                '$array', '$flatArray', '$gsum', '$gcount', '$gmin', '$gmax',
                '$grmaxsum', '$grmaxcount', '$grmaxavg'
            ],
            $$functionOperators: [ '$toInt', '$toDouble', '$toBoolean', '$distinct' ],
            $$multiOperators: [ '$and', '$or' ],
            $$conditionOperators: [
                '$eq','$ne', '$gt', '$gtr', '$lt', '$lte',
                '$like', '$ilike', '$in', '$nin'
            ],
        },

        schemaAggregateOperators: {
            $sum: {
                type: 'object',
                values: ['$1', '$field', '$$functionOperators' ]
            },
            $count: {
                type: 'object',
                values: ['$1', '$field', '$$functionOperators' ]
            },
            $min: {
                type: 'object',
                values: ['$field', '$$functionOperators' ]
            },
            $max: {
                type: 'object',
                values: ['$field', '$$functionOperators' ]
            },
            $avg: {
                type: 'object',
                values: ['$field', '$$functionOperators' ]
            },
            $array: {
                type: 'object',
                values: ['$field', '$$functionOperators' ]
            },
            $flatArray: {
                type: 'object',
                values: ['$field', '$$functionOperators' ]
            },
            $gsum: {
                type: 'object',
                values: ['$1', '$field', '$$functionOperators' ]
            },
            $gcount: {
                type: 'object',
                values: ['$1', '$field', '$$functionOperators' ]
            },
            $gmin: {
                 type: 'object',
                 values: ['$field', '$$functionOperators' ]
            },
            $gmax: {
                 type: 'object',
                 values: ['$field', '$$functionOperators' ]
            },
            $grmaxsum: {
                type: 'object',
                values: ['$field', '$$functionOperators' ]
            },
            $grmaxcount: {
                type: 'object',
                values: ['$field', '$$functionOperators' ]
            },
            $grmaxavg: {
                type: 'object',
                values: ['$field', '$$functionOperators' ]
            },
        },

        schemaFunctionOperators: {
            $toInt: {
                type: 'object',
                values: ['$field', '$$functionOperators' ]
            },
            $toDouble: {
                type: 'object',
                values: ['$field', '$$functionOperators' ]
            },
            $toBoolean: {
                type: 'object',
                values: ['$field', '$$functionOperators' ]
            },
            $splitString: {
                type: 'object',
                values: ['$splitParams'] // TODO
            },
            $distinct: {
                type: 'object',
                values: ['$field']
            },
        },

        schemaMultiOperators: {
            $and: {
                type: 'array',
                values: [ '$$conditionOperators', '$$multiOperators' ]
            },
            $or: {
                type: 'array',
                values: [ '$$conditionOperators', '$$multiOperators' ]
            },
         },

        schemaConditionOperators: {
            $eq: {
                type: 'object',
                values: [ '$param' ]
            },
            $ne: {
                type: 'object',
                values: [ '$param' ]
            },
            $gt: {
                type: 'object',
                values: [ '$param' ]
            },
            $gtr: {
                type: 'object',
                values: [ '$param' ]
            },
            $lt: {
                type: 'object',
                values: [ '$param' ]
            },
            $lte: {
                type: 'object',
                values: [ '$param' ]
            },
            $like: {
                type: 'object',
                values: [ '$param' ]
            },
            $ilike: {
                type: 'object',
                values: [ '$param' ]
            },
            $in: {
                type: 'object',
                values: [ '$param' ]
            },
            $nin: {
                type: 'object',
                values: [ '$param' ]
            },
        },

        schemaFinalizeOperators: {
//            $mergeFields: {
//                type: 'array',
//                values: ['$field']
//            },
            $replace: {
                type: 'object',
                property: '$pattern',
                values: ['$value']
            },
            $groupFields: {
                type: 'array',
                values: ['$alias']
            }
//            $normalize: {
//                type: 'object',
//                property: '$alias',
//                values: ['$thresholdFields']
//            },
//            $thresholdFields: {
//                type: 'array',
//                values: ['$alias']
//            }
        },

        schemaLeafs: {
            $field: {
                leaf: true,
                type: 'string',
            },
            $alias: {
                leaf: true,
                type: 'string',
            },
            $1: {
                leaf: true,
                type: 'number',
                const: 1,
            },
            $param: {
                leaf: true,
                type: 'string',
                param: true,
            },
            $value: {
                leaf: true,
                type: null,
                value: true,
            },
            $pattern: {
                leaf: true,
                type: 'string',
                description: 'String value or regex pattern, ex: "Asd", "/asd/i" ',
                value: true,
            },
		},

		getSchema: function (){
		    return JSB.merge({},
                this.schemaRoot, this.schemaQuery, this.schemaCollections,
                this.schemaAggregateOperators, this.schemaFunctionOperators,
                this.schemaMultiOperators, this.schemaConditionOperators,
                this.schemaLeafs
            );
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