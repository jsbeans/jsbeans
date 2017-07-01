{
	$name: 'JSB.DataCube.Query.QueryEngine',

	$server: {
		$require: [
		    'JSB.DataCube.Query.Iterators.DataProviderIterator',
		    'JSB.DataCube.Query.Iterators.JoinIterator',
		    'JSB.DataCube.Query.Iterators.FinalizeIterator',
        ],

	    cube : {},

	    selftTest: function(){
	        [
	            // select all fields
                new QueryEngine(cube).query(
                    { $select: {} }
                ),
                // select id field
                new QueryEngine(cube).query(
                    { $select: {
                        id: 'id',
                    } }
                ),
                //
                new QueryEngine(cube).query({
                    // produce values with new names from fields or aggregate functions
                    // <field_value> : <cube_field_or_function>
                    $select: {
                        type: 'user_type',
                        usersCount: { $sum: 1 },
                        totalLogins: { $sum: 'user_logins' },
                        avgLogins: { $avg: 'user_logins' },
                        maxLogins: { $max: 'user_logins' },
                        minLogins: { $min: 'user_logins' },
                        mainRoles: { $array: 'mainRole' },
                        roles: { $flatArray: 'roles' }

                    },
                    // filter rows by new or cube fields
                    // note: aggregated fields not supported yet
                    $filter: {
                        user_enabled: { $eq : '${param1}' },
                        $or: [
                            { user_enabled: { $eq : '${param1}' } },
                            { mainRole: { $ne : null } } // not null
                        ]
                    },

                    // note: distinct not supported
                    // $distinct: true,

                    $groupBy: ['user_type'],

                    // sorting by new or old fields
                    $sort: ['usersCount', 'totalLogins'],

                    // postprocessing with function
                    $finalize: function(value) {
                        if (value.minLogins > 0) {
                            value.newFiled = 'created value';
                            return value;
                        }
                        // without return: filter value
                    }
                }, {
                    param1: true
                })
            ].forEach(function(it){
                for (var val = it.next(); !JSB.isNull(val); val = it.next()) {
                    Log.debug(JSON.stringify(val,0,2));
                }
                a.close();
            });

	    },

		$constructor: function(cube){
			this.dataProviders = cube.dataProviders;
		},

		query: function(dcQuery, params){
		    return produceIterator(dcQuery, params);
		},

		extractFields: function(dcQuery) {
		    var cubeFields = [];
		    var outputFields = [];
		    function collect(q) {
		        if (JSB.isString(q)) {
		            cubeFields.push(q);
		        } else if (JSB.isPlainObject(q)) {
		            for (var f in q) if (q.hasOwnFields(f)) {
		                if (f.match(/^\$/)) {
		                    outputFields.push(f);
		                }
		                collect(q[f]);
		            }
		        }
		    }
		    collect(dcQuery);
		    return {
		        cubeFields: cubeFields,
		        outputFields : outputFields
		    };
		},

		dataProviderHasCubeFields: function(provider, cubeFields) {
		    var count = 0;
		    for (var i in cubeFields) {
		        var field = cubeFields[i];

		        if (this.cube.fields[field]) {
		            var cubeField = this.cube.fields[field];
		            // iterate binding providers
		            for(var b in cubeField.binding) {
		                if (cubeField.binding[b].field
		                        && provider == cubeField.binding[b].provider) {
		                    count++;
		                }
		            }
		        }
		    }
		    return count;
		},

		produceIterator: function(dcQuery, params, configurators) {
		    // 1) дерево итераторов формируется исходя исключительно из
		    // конфигурации куба, входящих в него DataProviders и их соединений/joins

		    // 2) join добавляет соответствующие поля в $select часть, чтобы
		    // по ним потом можно было соединить записи из разных провайдеров данных;

            var cubeFields = this.extractFields(dcQuery).cubeFields;
            var providerIterators = [];
            for (var i in this.cube.dataProviders) {
                if ($this.dataProviderHasCubeFields(provider, cubeFields)) {
                    providerIterators.push(new DataProviderIterator(provider, this.cube));
                }
            }

            var joinIterator = providerIterators.length == 1
                    ? providerIterators[0]
                    : new JoinIterator(providerIterators, this.cube);

		    if (dcQuery.$finalize) {
		        return new FinalizeIterator(joinIterator).iterate(dcQuery);
		    }

		    return join.iterate(dcQuery);
		},

//		toDataProviderFields: function(dcQuery) {
//		    function mapField(cubeField) {
//		        if (this.cube.fields[cubeField]) {
//                    var desc = this.cube.fields[cubeField];
//                    // iterate binding providers
//                    for(var b in desc.binding) {
//                        if (desc.binding[b].field
//                                && provider == desc.binding[b].provider) {
//                            count++;
//                        }
//                    }
//                }
//		    }
//
//            if (dcQuery.$filter) {
//                query.where = doWhere(dcQuery.$filter);
//            }
//            if (dcQuery.$select) {
//                query.columns = doColumns(dcQuery.$select);
//            }
//            if (dcQuery.$groupBy) {
//                query.groupBy = doGroupBy(dcQuery.$groupBy);
//            }
//            if (dcQuery.$sort) {
//                query.sort = doSort(dcQuery.$sort);
//            }
//            return query;
//		}
	}
}