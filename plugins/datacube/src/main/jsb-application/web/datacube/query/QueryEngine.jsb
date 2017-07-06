{
	$name: 'JSB.DataCube.Query.QueryEngine',

	$server: {
		$require: [
		    'JSB.DataCube.Query.Iterators.DataProviderIterator',
		    'JSB.DataCube.Query.Iterators.JoinIterator',
		    'JSB.DataCube.Query.Iterators.FinalizeIterator',
        ],

	    selftTest: function(cube){
	        [
	            // select all fields
                this.query(
                    { $select: {} }
                ),
                // select id field
//                this.query({
//                    $select: {
//                        Subject: 'Cубъект',
//                    },
//                    $filter: {
//                        $and: [
//                            { Subject: {$eq: '${subj1}'} },
//                            { Cубъект: {$eq: '${subj2}'} },
//                        ]
//                    }
//                }, {
//                    subj1: 'Открытое акционерное общество "Монолит"',
//                    subj2: 'Федеральное казенное предприятие "Авангард"'
//                }),
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
		},

		query: function(dcQuery, params, dataProvider){
		    dcQuery = this.prepareQuery(dcQuery);
		    return this.produceIterator(dcQuery, params||{}, dataProvider);
		},

		prepareQuery: function(dcQuery) {
		    if (Object.keys(dcQuery.$select).length == 0) {
                for (var f in this.cube.fields) if (this.cube.fields.hasOwnProperty(f)) {
                    dcQuery.$select[f] = f;
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

		isDataProviderLinkedWithCubeFields: function(provider, cubeFields, excludeJoinFields) {
//debugger;
		    var count = 0;
		    for (var i in cubeFields) {
		        var field = cubeFields[i];

		        if (this.cube.fields[field]) {
		            var cubeField = this.cube.fields[field];
		            // iterate binding providers
		            for(var b in cubeField.binding) {
		                if (provider == cubeField.binding[b].provider) {
		                    //var dpField = cubeField.binding[b].field;
		                    if (!excludeJoinFields) count++;
		                }
		            }
		        }
		    }
		    return count;
		},

		setParamType: function(paramName, paramType){
		    // TODO:
		},

		getParamType: function(paramName, provider){
		    // TODO:
		},

		produceIterator: function(dcQuery, params, dataProvider) {
            // collect only iterator of used in query providers
            var usedCubeFields = this.extractFields(dcQuery).cubeFields;
            var dataProviders = this.cube.getOrderedDataProviders();
            var providerIterators = [];
            if (!dataProvider) {
                for (var i in dataProviders) {
                    var provider = dataProviders[i];
                    if ($this.isDataProviderLinkedWithCubeFields(provider, usedCubeFields, i > 0)) {
                        providerIterators.push(new DataProviderIterator(provider, this));
                    }
                }
            } else {
                providerIterators.push(new DataProviderIterator(dataProvider, this));
            }

            var joinIterator = providerIterators.length == 1
                    ? providerIterators[0]
                    : new JoinIterator(providerIterators, this);

		    if (dcQuery.$finalize) {
		        return new FinalizeIterator(joinIterator, this).iterate(dcQuery);
		    }

		    return joinIterator.iterate(dcQuery);
		},
	}
}