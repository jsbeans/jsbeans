{
	$name: 'DataCube.Query.QueryEngine',

	$server: {
		$require: [
		    'DataCube.Query.Iterators.DataProviderIterator',
		    'DataCube.Query.Iterators.InnerJoinIterator',
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

		    // fill all cube fields (or linked with dataProvider) for default $select={}
		    QueryUtils.generateDefaultSelect(dcQuery, dataProvider || this.cube);

            // embed $globalFilter to $filter/$postFilter of root and sub queries
            QueryUtils.propagateGlobalFilter(dcQuery, dataProvider || this.cube);

            // generate $groupBy if not defined
            QueryUtils.generateDefaultGroupBy(dcQuery);

            // move top fields that used in other
            QueryUtils.upperGeneralFields(dcQuery);

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
		        } else if (JSB.isArray(q)) {
                    for (var i in q) {
                        collect(q[i]);
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
            // collect only iterator of used in query providers
            var usedCubeFields = this.extractFields(dcQuery).cubeFields;
            var dataProviders = this.cube.getOrderedDataProviders();
            var providerIterators = [];

            if (!dataProvider) {
                for (var i = 0; i < dataProviders.length; i++) {
                    var provider = dataProviders[i];
                    // TODO: поддержать случай, когда между двумя используемыми в запросе полями есть перевязочные таблицы с полями, которые не используется
                    if ($this.isDataProviderLinkedWithCubeFields(provider, usedCubeFields, providerIterators.length == 0)) {
                        if (providerIterators.length > 0) {
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
		                //Log.debug(JSON.stringify(next));
		            }
		            return next;
		        },
		        close: function(){
		            Log.debug('Iterator closed');
		            it.close();
		        }
		    };
		},
	}
}