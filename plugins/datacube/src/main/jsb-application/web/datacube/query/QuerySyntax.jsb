{
	$name: 'JSB.DataCube.Query.QuerySyntax',
	$singleton: true,

	$server: {
		$require: [],

		$constructor: function(){
		},

        schemaRoot:{
            $query: {
                root: true,
                type: 'object',
                multiValues: true,
                values: [ '$filter', '$select', '$sort', '$finalize'],
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
                    values: ['$mergeFields']
                }
            ],
        },

        schemaCollections: {
            $$aggregateOperator: [
                '$sum', '$count','$min', '$max', '$avg',
                '$array', '$flatArray', '$gsum', '$gcount', '$gmin', '$gmax'
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
            $mergeFields: {
                type: 'array',
                values: ['$field']
            },
            $normalize: {
                type: 'object',
                property: '$alias',
                values: ['$thresholdFields']
            },
            $thresholdFields: {
                type: 'array',
                values: ['$alias']
            }
        },

        schemaLeafs: {
            $field: {
                left: true,
                type: 'string',
            },
            $alias: {
                left: true,
                type: 'string',
            },
            $1: {
                left: true,
                type: 'number',
                const: 1,
            },
            $param: {
                left: true,
                type: 'string',
                param: true,
            },
		},

		getSchema: function (){
		    return JSB.merge({},
                this.schemaRoot, this.schemaQuery, this.schemaCollections,
                this.schemaAggregateOperators, this.schemaFunctionOperators,
                this.schemaMultiOperators, this.schemaConditionOperators,
                this.schemaLeafs
            );
        }
	}
}