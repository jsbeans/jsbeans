{
	$name: 'DataCube.Query.QueryEngine',
	$session: false,
	$server: {
		$require: [
		    'DataCube.Query.Transforms.QueryTransformer',
		    'DataCube.Query.Iterators.DataProviderIterator',
		    'DataCube.Query.Iterators.LeftJoinIterator',
		    'DataCube.Query.Iterators.UnionIterator',
		    'DataCube.Query.Iterators.FinalizeIterator',
		    'DataCube.Providers.SqlTableDataProvider',
		    'DataCube.Query.QuerySyntax',
		    'DataCube.Query.QueryUtils',
        ],

		$constructor: function(cube){
		    this.cube = cube;
		    this.paramTypes = {};
		},

		query: function(dcQuery, params, dataProvider){
			this.cube.load();
			dcQuery.$id = dcQuery.$id || JSB.generateUid();

		    Log.debug('\n[qid='+dcQuery.$id+'] Original DataCube Query: \n' + JSON.stringify(dcQuery) + '\n' + JSON.stringify(params));
		    dcQuery = this.prepareQuery(dcQuery, dataProvider);
		    QueryUtils.logDebug('\n[qid='+dcQuery.$id+'] Prepared DataCube Query: ' + JSON.stringify(dcQuery, 0, 2) + '\n' + JSON.stringify(params));

		    var it = this.produceIterator(dcQuery, params||{}, dataProvider);
		    return it;
		},

		prepareQuery: function(dcQuery, dataProvider) {
		    dcQuery = JSB.merge(true, {}, dcQuery);
		    dcQuery = QueryTransformer.transform(dcQuery, dataProvider || this.cube);
            return dcQuery;
		},

		isDataProviderLinkedWithCubeFields: function(provider, cubeFields, useJoinFields) {
		    var count = 0;
		    var joinCount = 0;
		    for (var i in cubeFields) {
		        var field = cubeFields[i];
		        var managedFields = this.cube.getManagedFields();
		        if(managedFields[field]) {
		            var binding = managedFields[field].binding;

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
//		    return {
//		        next: function(){},
//		        close: function(){}
//		    }; // TODO DEBUG remove
            var providerIterators = [];
            if (dataProvider) {
                providerIterators.push(new DataProviderIterator(dataProvider, this));
            } else {
//                var dataProviders = this.cube.getOrderedDataProviders();
                var groups = this.groupProviders(dcQuery, this.sqlStoreDataProviderKey);
                for(var i in groups) {
                    var providers = groups[i];
                    providerIterators.push(new DataProviderIterator(providers, this));
                }
            }

            if (providerIterators.length == 0) {
                // empty iterator
                return {
                    next: function(){},
                    close: function(){}
                };
            }

            var providersIterator = this._unionAndJoinIterators(providerIterators);

		    if (dcQuery.$finalize) {
		        return new FinalizeIterator(providersIterator, this).iterate(dcQuery, params);
		    }

		    var it = providersIterator.iterate(dcQuery, params);
		    return {
		        next: function(){
		            var next = it.next();
//		            if (next) {
//		                Log.debug(JSON.stringify(next));
//		            }
		            return next;
		        },
		        close: function(){
//		            Log.debug('Iterator closed');
		            it.close();
		        }
		    };
		},

		_unionAndJoinIterators: function(providerIterators) {
		    if (providerIterators.length == 1) {
		        return providerIterators[0];
		    }
		    var unionIterators = [];
		    var joinIterators = [];
		    for (var i in providerIterators) {
		        var providerIterator = providerIterators[i];
		        var providers = providerIterator.getDataProviders();
		        var isUnion = true;
		        for (var p in providers) {
		            if ((providers[p].getMode()||'union') != 'union') {
		                isUnion = false;
		            }
		        }
		        if (isUnion) {
		            unionIterators.push(providerIterator);
		        } else {
		            joinIterators.push(providerIterator);
		        }
		    }

            if (unionIterators.length > 0) {
                var unionIterator = unionIterators.length > 1
                        ? new UnionIterator(unionIterators, this)
                        : unionIterators[0];

                if (joinIterators.length == 0) {
                    return unionIterator;
                }
                joinIterators = [unionIterator].concat(joinIterators);
            }

		    return new LeftJoinIterator(joinIterators, this);
		},

		sqlStoreDataProviderKey: function (provider) {
		    // store key or unique
            return provider instanceof SqlTableDataProvider
                ? provider.getJsb().$name + '/' + provider.getStore().getName()
                : provider.id;
        },

		groupProviders: function(dcQuery, getProviderGroupKey){
		    /**
		        1) собрать все провайдеры, связанные с запросом
		        2) удалить избыточные провайдеры, т.е. для которых все используемые в запросе
		           поля являются "объединенными" и присутствуют в другом провайдере
		        3) объединить однотипные провайдеры в группы
		    */

            var orderedProviders = this.cube.getOrderedDataProviders();

		    // collect used providers by name and all used cube fields
		    var providers = {}; // id: {provider, cubeFields}
		    QueryUtils.walkCubeFields(
		        dcQuery, /**includeSubQueries=*/true, this.cube,
		        function (field, context, query, binding){
                    for (var i in binding) {
                        var id = binding[i].provider.id;
                        var prov = providers[id] = providers[id] || {
                            provider: binding[i].provider,
                            cubeFields: {}
                        };
                        var hasOtherBinding = binding.length > 1;
                        prov.cubeFields[field] = hasOtherBinding;
                    }
                }
            );
            // TODO: add join path providers (now all providers must have field in query)

            // filter redundant providers
            QueryUtils.removeRedundantBindingProviders(providers, this.cube);

		    var groupsMap = {/**key:[provider]*/}; //
//		    for (var id in providers) if (providers.hasOwnProperty(id)) {
//		        var prov = providers[id];
//		        var key = getProviderGroupKey(prov.provider);
//                groupsMap[key] = groupsMap[key] || [];
//                groupsMap[key].push(prov.provider);
//		    }
            for(var i in orderedProviders) {
                var provider = orderedProviders[i];
                if (providers.hasOwnProperty(provider.id)) {
                    var key = getProviderGroupKey(provider);
                    groupsMap[key] = groupsMap[key] || [];
                    groupsMap[key].push(provider);
                }
            }
		    var groups = []; // [[]]
		    for (var k in groupsMap) if (groupsMap.hasOwnProperty(k)) {
		        groups.push(groupsMap[k]);
		    }
		    return groups;
		},
	}
}