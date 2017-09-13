{
	$name: 'DataCube.Query.QueryEngine',

	$server: {
		$require: [
		    'DataCube.Query.Iterators.DataProviderIterator',
		    'DataCube.Query.Iterators.InnerJoinIterator',
		    'DataCube.Query.Iterators.FinalizeIterator',
		    'DataCube.Providers.SqlTableDataProvider',
		    'DataCube.Query.QuerySyntax'
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
		    if (Object.keys(dcQuery.$select).length == 0) {
		        if (dataProvider) {
		            var fields = dataProvider.extractFields();
		            for(var field in fields) if (fields.hasOwnProperty(field)){
		                var name = field.replace(new RegExp('"','g'),'');
		                 dcQuery.$select[name] = field;
		            }
		        } else {
		        	var managedFields = this.cube.getManagedFields();
                    for (var f in managedFields) if (managedFields.hasOwnProperty(f)) {
                        var binding = managedFields[f].binding;
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
                // TODO: support multi fields in select (n-operators)
                var aggregateFunctions = QuerySyntax.schemaAggregateOperators;
                function findField(exp, aggregated){
                    if (JSB.isString(exp)) {
                        return {
                            field: exp,
                            aggregated: aggregated || false
                        };
                    }
                    if (JSB.isPlainObject(exp)) {
                        if (Object.keys(exp).length == 1) {
                            var op = Object.keys(exp)[0];
                            if (aggregateFunctions[op]) {
                                return findField(exp[op], true);
                            } else {
                                return findField(exp[op], aggregated);
                            }
                        } else {
                            if (exp.$field && (!exp.$context || exp.$context == dcQuery.$context)) {
                                return findField(exp.$field, aggregated);
                            }
                        }
                    }
                    if (JSB.isArray(exp)) {
                        for (var i in exp) {
                            var f = findField(exp[i], aggregated);
                            if (f.field) return f;
                        }
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
                        if (aggregatedFields.indexOf(field.field) == -1)
                            aggregatedFields.push(field.field);
                    } else if (field.field) {
                        if (groupFields.indexOf(field.field) == -1)
                            groupFields.push(field.field);
                    } else {
                        unknownAggregate = true;
                    }
                }

//                // add filter fields to groupBy
//                for (var alias in dcQuery.$filter){
//                    var field = findField(dcQuery.$select[alias], false);
//                    if (field.field && groupFields.indexOf(field.field) == -1) {
//                        groupFields.push(field.field);
//                    }
//                }

                if (groupFields.length == 0 && unknownAggregate) {
                    throw new Error("Define $groupBy");
                }
                // if not group by all fields
                if (Object.keys(dcQuery.$select).length != aggregatedFields.length
                    && Object.keys(dcQuery.$select).length != groupFields.length) {
                    dcQuery.$groupBy = groupFields;
                }
            }

            this._topGeneralFields(dcQuery);

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

		_topGeneralFields: function(dcQuery){
		    function copyWithTopField(fieldName, obj) {
		        var res = {};
		        res[fieldName] = obj[fieldName];
		        for (var f in obj) if (obj.hasOwnProperty(f) && f != fieldName) {
		            res[f] = obj[f];
		        }
		        return res;
		    }

		    function isFieldLinkedWith(field, exp) {
                if (JSB.isPlainObject(exp)) {
                    if (exp['$field']
                            && exp['$context'] == dcQuery.$context
                            && exp['$field'] == field) {
                        return true;
                    } else {
                        for(var p in exp) if (exp.hasOwnProperty(p)) {
                            if (isFieldLinkedWith(field, exp[p])) {
                                return true;
                            }
                        }
                    }
                } else if (JSB.isArray(exp)) {
                    for(var i in exp) {
                        if (isFieldLinkedWith(field, exp[i])) {
                            return true;
                        }
                    }
                } else if (JSB.isString(exp) && exp == field) {
                    // not true - defined without context (see top where isPlainObject)
                    return false;
                }
                return false;
		    }

            var select = dcQuery.$select;
		    var topFields = {};
		    for (var field in select) if (select.hasOwnProperty(field)) {

                var list = false;
                for (var nextField in select) {
                    if (nextField == field) {
                        list = true;
                    } else if (list && select.hasOwnProperty(nextField)) {
                        if (isFieldLinkedWith(field, select[nextField])) {
                            topFields[field] = Object.keys(topFields).length;
                        }
                    }
                }
		    }

            for (var field in topFields) if (topFields.hasOwnProperty(field)) {
		        select = copyWithTopField(field, select);
		    }
		    dcQuery.$select = select;
		}
	}
}