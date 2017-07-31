{
	$name: 'JSB.DataCube.Query.QueryEngine',

	$server: {
		$require: [
		    'JSB.DataCube.Query.Iterators.DataProviderIterator',
		    'JSB.DataCube.Query.Iterators.InnerJoinIterator',
		    'JSB.DataCube.Query.Iterators.FinalizeIterator',
		    'JSB.DataCube.Providers.SqlTableDataProvider',
		    'JSB.DataCube.Query.QuerySyntax'
        ],

	    selftTest: function(cube){
	        [
	            // select all fields
                this.query(
                    { $select: {} }
                ),
                // select id field
                this.query({
                    $select: {
                        Subject: 'Cубъект',
                        "Тип ПКЗ": "Тип ПКЗ"

                    },
                    $filter: {
                        $and: [
                            { Cубъект: {$eq: '${subj1}'} },
                            { Cубъект: {$eq: '${subj2}'} },
                        ]
                    }
                }, {
                    subj1: 'Открытое акционерное общество "Монолит"',
                    subj2: 'Федеральное казенное предприятие "Авангард"'
                }),
                this.query({
                    $select: {
                        Subject: 'Cубъект',
                        Values: { $array: {$toInt: {$toDouble: 'Значение'}}},
                        minValue: { $min: {$toDouble: 'Значение'} },
                        maxValue: { $max: {$toDouble: 'Значение'}},
                    },
                    $filter: {
                        $and: [
                            { Cубъект: {$eq: '${subj1}'} },
                            { Cубъект: {$eq: '${subj2}'} },
                        ]
                    },
                    $groupBy: ['Cубъект'],
                    $sort: [{'maxValue': -1}] // -1 = DESC, 1 = ASC
                }, {
                    subj1: 'Открытое акционерное общество "Монолит"',
                    subj2: 'Федеральное казенное предприятие "Авангард"'
                }),
                this.query({
                    "$groupBy": [
                        "Код отрасли"
                    ],
                    "$select": {
                        "gcountAll": {
                            "$gcount": 1
                        },
                        "count": {
                            "$count": "Код отрасли"
                        },
                        "gmax": {
                            "$gmax": {
                                "$toInt": "Код отрасли"
                            }
                        },
                        "gcountOtr": {
                            "$gcount": {
                                "$distinct": "Код отрасли"
                            }
                        }
                    }
                }),
//                //
//                this.query({
//                    // produce values with new names from fields or aggregate functions
//                    // <field_value> : <cube_field_or_function>
//                    $select: {
//                        type: 'user_type',
//                        usersCount: { $sum: 1 },
//                        totalLogins: { $sum: 'user_logins' },
//                        avgLogins: { $avg: 'user_logins' },
//                        maxLogins: { $max: 'user_logins' },
//                        minLogins: { $min: 'user_logins' },
//                        mainRoles: { $array: 'mainRole' },
//                        roles: { $flatArray: 'roles' }
//
//                    },
//                    // filter rows by new or cube fields
//                    // note: aggregated fields not supported yet
//                    $filter: {
//                        user_enabled: { $eq : '${param1}' },
//                        $or: [
//                            { user_enabled: { $eq : '${param1}' } },
//                            { mainRole: { $ne : null } } // not null
//                        ]
//                    },
//
//                    // note: distinct not supported
//                    // $distinct: true,
//
//                    $groupBy: ['user_type'],
//
//                    // sorting by new or old fields
//                    $sort: ['usersCount', 'totalLogins'],
//
//                    // postprocessing with function
//                    $finalize: function(value) {
//                        if (value.minLogins > 0) {
//                            value.newFiled = 'created value';
//                            return value;
//                        }
//                        // without return: filter value
//                    }
//                }, {
//                    param1: true
//                })
            ].forEach(function(it){
debugger;
                for (var val = it.next(), i=0; !JSB.isNull(val) && i < 5; val = it.next(), i++) {
                    Log.debug(JSON.stringify(val,0,2));
                }
                it.close();
            });

	    },

		$constructor: function(cube){
		    this.cube = cube;
		    this.paramTypes = {};
		},

		query: function(dcQuery, params, dataProvider){
			this.cube.load();
		    dcQuery = this.prepareQuery(dcQuery, dataProvider);
//debugger;
		    Log.debug('QueryEngine.query: ' + JSON.stringify(dcQuery, 0, 2) + '\n' + JSON.stringify(params) );
		    var it = this.produceIterator(dcQuery, params||{}, dataProvider);
		    return it;
		},

		prepareQuery: function(dcQuery, dataProvider) {
		    dcQuery = JSB.merge(true, {}, dcQuery);
		    // fill all cube fields (or linked with dataProvider) for default $select={}
		    if (Object.keys(dcQuery.$select).length == 0) {
		        if (dataProvider) {
		            var fields = dataProvider.extractFields();
		            for(var field in fields) if (fields.hasOwnProperty(field)){
		                var name = field.replace(new RegExp('"','g'),'');
		                 dcQuery.$select[name] = field;
		            }
		        } else {
                    for (var f in this.cube.fields) if (this.cube.fields.hasOwnProperty(f)) {
                        var binding = this.cube.fields[f].binding;
                        for(var b in binding) {
                            if (!dataProvider || binding[b].provider == dataProvider) {
                                var name = f.replace(new RegExp('"','g'),'');
                                dcQuery.$select[name] = f;
                                break;
                            }
                        }
                    }
                }
            }

            // generate $groupBy if not defined
            if (!dcQuery.$groupBy) {
                var aggregateFunctions = QuerySyntax.schemaAggregateOperators;
                function findField(exp, aggregated){
                    if (JSB.isString(exp)) {
                        return {
                            field: exp,
                            aggregated: aggregated || false
                        };
                    }
                    if (JSB.isPlainObject(exp)) {
                        var op = Object.keys(exp)[0];
                        if (aggregateFunctions[op]) {
                            return findField(exp[op], true);
                        }
                        return findField(exp[op], aggregated);
                    }
                    return {
                        field: null,
                        aggregated: aggregated || false
                    };
                }

                var aggregatedFields = [];
                var groupFields = [];
                var unknownAggregate = false;
                for (var alias in dcQuery.$select) {
                    var field = findField(dcQuery.$select[alias], false);
                    if (field.aggregated && field.field){
                        if (aggregatedFields.indexOf() == -1)
                            aggregatedFields.push(field.field);
                    } else if (field.field) {
                        if (groupFields.indexOf() == -1)
                            groupFields.push(field.field);
                    } else {
                        unknownAggregate = true;
                    }
                }
                if (groupFields.length == 0 && unknownAggregate) {
                    throw new Error("Define $groupBy");
                }
                // if not group by all fields
                if (Object.keys(dcQuery.$select).length != aggregatedFields.length
                    && Object.keys(dcQuery.$select).length != groupFields.length) {
                    dcQuery.$groupBy = groupFields;
                }
            }
            return dcQuery;
		},

		extractFields: function(dcQuery) {
		    var cubeFields = [];
		    var outputFields = [];
		    function collect(q) {
		        if (JSB.isString(q)) {
		            cubeFields.push(q);
		        } else if (JSB.isPlainObject(q)) {
		            for (var f in q) if (q.hasOwnProperty(f)) {
		                if (!f.match(/^\$/)) {
		                    outputFields.push(f);
		                }
		                collect(q[f]);
		            }
		        }
		    }
            collect(dcQuery.$select);
            return {
		        cubeFields: cubeFields,
		        outputFields : outputFields
		    };
		},

		isDataProviderLinkedWithCubeFields: function(provider, cubeFields, useJoinFields) {
		    var count = 0;
		    var joinCount = 0;
		    for (var i in cubeFields) {
		        var field = cubeFields[i];

		        if (this.cube.fields[field]) {
		            var binding = this.cube.fields[field].binding;

		            // iterate binding providers
		            for(var b in binding) {
		                if (provider == binding[b].provider) {
		                    if (binding.length == 1 || useJoinFields) {
		                        count++;
		                    } else {
		                        joinCount++;
		                    }
		                }
		            }
		        }
		    }
		    return count || joinCount > 1 && joinCount;
		},

		setParamType: function(paramName, paramType){
            this.paramTypes[paramName] = paramType;
		},

		getParamType: function(paramName, provider){
		    // TODO: return this.paramTypes[paramName] || this.cube.getParamType(paramName, provider);
		    return this.paramTypes[paramName];
		},

		produceIterator: function(dcQuery, params, dataProvider) {
            // collect only iterator of used in query providers
            var usedCubeFields = this.extractFields(dcQuery).cubeFields;
            var dataProviders = this.cube.getOrderedDataProviders();
            var providerIterators = [];

            if (!dataProvider) {
                for (var i = 0; i < dataProviders.length; i++) {
                    var provider = dataProviders[i];
                    if ($this.isDataProviderLinkedWithCubeFields(provider, usedCubeFields, providerIterators.length == 0)) {
                        if (i > 0) {
                            var prev = providerIterators[providerIterators.length - 1].getDataProviders()[0];
                            if (provider instanceof SqlTableDataProvider
                                && prev.getJsb().$name == provider.getJsb().$name
                                && prev.getStore().getName() == provider.getStore().getName()) {
                                // merge provider
                                providerIterators[providerIterators.length - 1] = new DataProviderIterator(
                                    providerIterators[providerIterators.length - 1].getDataProviders().concat(provider), this);
                                continue;
                            }
                        }
                        providerIterators.push(new DataProviderIterator(provider, this));
                    }
                }
            } else {
                providerIterators.push(new DataProviderIterator(dataProvider, this));
            }

            if (providerIterators.length == 0) {
                // empty iterator
                return {
                    next: function(){},
                    close: function(){}
                };
            }

            var joinIterator = providerIterators.length == 1
                    ? providerIterators[0]
                    : new InnerJoinIterator(providerIterators, this);

		    if (dcQuery.$finalize) {
		        return new FinalizeIterator(joinIterator, this).iterate(dcQuery, params);
		    }

		    var it = joinIterator.iterate(dcQuery, params);

		    return {
		        next: function(){
		            var next = it.next();
		            if (next) {
		                Log.debug(JSON.stringify(next));
		            }
		            return next;
		        },
		        close: function(){
		            it.close();
		        }
		    };
		},
	}
}