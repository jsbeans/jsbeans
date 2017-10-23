{
	$name: 'DataCube.Query.QueryEngine',

	$server: {
		$require: [
		    'DataCube.Query.Iterators.DataProviderIterator',
		    'DataCube.Query.Iterators.LeftJoinIterator',
		    'DataCube.Query.Iterators.FinalizeIterator',
		    'DataCube.Providers.SqlTableDataProvider',
		    'DataCube.Query.QuerySyntax',
		    'DataCube.Query.QueryUtils'
        ],

		$constructor: function(cube){
		    this.cube = cube;
		    this.paramTypes = {};
		},

		query: function(dcQuery, params, dataProvider){
			this.cube.load();
		    dcQuery = this.prepareQuery(dcQuery, dataProvider);
		    Log.debug('QueryEngine.preparedQuery: \n' + JSON.stringify(dcQuery, 0, 2) + '\n' + JSON.stringify(params) );
		    var it = this.produceIterator(dcQuery, params||{}, dataProvider);
		    return it;
		},

		prepareQuery: function(dcQuery, dataProvider) {
		    // clone query
		    dcQuery = JSB.merge(true, {}, dcQuery);

		    // unwrap macros to complex expressions
		    QuerySyntax.unwrapMacros(dcQuery);

//		    // fill all cube fields (or linked with dataProvider) for default $select={}
//		    QueryUtils.generateDefaultSelect(dcQuery, dataProvider || this.cube);

            // embed $globalFilter to $filter/$postFilter of root and sub queries
            QueryUtils.propagateGlobalFilter(dcQuery, dataProvider || this.cube);

            // generate $groupBy if not defined
            QueryUtils.generateDefaultGroupBy(dcQuery);

            // move top fields that used in other
            QueryUtils.upperGeneralFields(dcQuery);

            return dcQuery;
		},

//		extractFields: function(dcQuery) {
//		    var cubeFields = [];
//		    var outputFields = [];
//		    function collect(q) {
//		        if (JSB.isString(q)) {
//		            cubeFields.push(q);
//		        } else if (JSB.isPlainObject(q)) {
//		            for (var f in q) if (q.hasOwnProperty(f)) {
//		                if (!f.match(/^\$/)) {
//		                    outputFields.push(f);
//		                }
//		                collect(q[f]);
//		            }
//		        } else if (JSB.isArray(q)) {
//                    for (var i in q) {
//                        collect(q[i]);
//                    }
//                }
//		    }
//            collect(dcQuery.$select);
//            return {
//		        cubeFields: cubeFields,
//		        outputFields : outputFields
//		    };
//		},

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
//debugger;
            if (dataProvider) {
                providerIterators.push(new DataProviderIterator(dataProvider, this));
            } else {
                var dataProviders = this.cube.getOrderedDataProviders();
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

            var providersIterator = providerIterators.length == 1
                    ? providerIterators[0]
                    : new LeftJoinIterator(providerIterators, this);

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

		sqlStoreDataProviderKey: function (provider) {
		    // store key or unique
            return provider instanceof SqlTableDataProvider
                ? provider.getJsb().$name + '/' + provider.getStore().getName()
                : provider.name;
        },

		groupProviders: function(dcQuery, getProviderGroupKey){
		    /**
		        1) собрать все провайдеры, связанные с запросом
		        2) удалить избыточные провайдеры, т.е. для которых все используемые в запросе
		           поля являются "объединенными" и присутствуют в другом провайдере
		        3) объединить однотипные провайдеры в группы
		    */

		    // collect used providers by name and all used cube fields
		    var providers = {}; // name: {provider, cubeFields}
		    QueryUtils.walkCubeFields(
		        dcQuery, /**includeSubQueries=*/true, this.cube,
		        function (field, context, query, binding){
                    for (var i in binding) {
                        var name = binding[i].provider.name;
                        var prov = providers[name] = providers[name] || {
                            provider: binding[i].provider,
                            cubeFields: {}
                        };
                        var hasOtherBinding = binding.length > 1;
                        prov.cubeFields[field] = hasOtherBinding;
                    }
                }
            );

            // filter redundant providers
            QueryUtils.removeRedundantBindingProviders(providers);

		    // group SqlTableDataProvider
		    /** TODO note: сейчас реализовано с учетом только "плоского" UNION (объединения с общими полями):
		        после добавления настроек JOIN при объединении в группы необходимо упорядочить
		        и учитывать пути слияний таблиц (т.е. сначала надо упорядочить и если по середи
		        оказывается "чужой" провайдер, то группу нужно разорвать для внешнего слияния через JoinIterator)
		     */
		    var groupsMap = {/**key:[provider]*/}; //
		    for (var name in providers) if (providers.hasOwnProperty(name)) {
		        var prov = providers[name];
		        var key = getProviderGroupKey(prov.provider);
                groupsMap[key] = groupsMap[key] || [];
                groupsMap[key].push(prov.provider);
		    }
		    var groups = []; // [[]]
		    for (var k in groupsMap) if (groupsMap.hasOwnProperty(k)) {
		        groups.push(groupsMap[k]);
		    }
		    return groups;
		},
	}
}