{
	$name: 'DataCube.Query.Translators.Translator',

	$server: {
		$require: [
        ],

		$constructor: function(providerOrProviders, cubeOrQueryEngine){
		    this.providers = JSB.isArray(providerOrProviders) ? providerOrProviders : [providerOrProviders];
		    if (!JSB.isBean(cubeOrQueryEngine)) {
		        throw new Error('Cube or QueryEngine is not defined');
		    }
		    if (cubeOrQueryEngine.getJsb().$name == 'DataCube.Model.Cube') {
                this.cube = cubeOrQueryEngine;
                this.queryEngine = cubeOrQueryEngine.queryEngine;
            } else {
                this.queryEngine = cubeOrQueryEngine;
            }
		},

		translatedQueryIterator: function(dcQuery, params){
		    if (this.iterator) {
		        // close previous iterator
		        this.iterator.close();
		    }

            // extract sub-query for current providers
            // TODO: починить вернуть !!!! - отключено временно !!!!
            var subQuery = dcQuery;//this.extractSelfSubQuery(dcQuery, params);

            // store dcQuery and params
		    if (this.dcQuery) {
		        throw new Error('SQLTranslator does not support reuse, create new instance');
		    }
		    this.dcQuery = subQuery;
		    this.params = params;

            // translate query to dataprovider format
		    var translatedQuery = this.translateQuery();

		    // create iterator
		    if (this.dcQuery.$analyze) {
		        return this.analyzeQuery(translatedQuery);
		    } else {
		        this.iterator = this.executeQuery(translatedQuery);
                return {
                    next: function(){
                        return $this.translateResult($this.iterator.next());
                    },
                    close:function(){
                        $this.iterator.close();
                    }
                };
		    }
		},

		extractSelfSubQuery: function(dcQuery, params){
		
            function isLinkedWithSelfProviders(exp, byKeyField, byValueField){
                var provs = $this._extractUsedProviders(dcQuery, exp, byKeyField, byValueField, true);
                if (provs.length == 0) {
                    // abstract aggregators (sum:1, count:1) - find groupBy provider
                    if (dcQuery.$groupBy && dcQuery.$groupBy[0]) {
                        var provider = $this._extractUsedProviders(dcQuery, dcQuery.$groupBy[0], byKeyField, byValueField, true)[0];
                        if ($this.providers.indexOf(provider) != -1) {
                            return true;
                        }
                    }
                } else {
                    for (var i in provs) {
                        if($this.providers.indexOf(provs[i]) != -1) {
                            // use only current provider fields
                            return true;
                        }
                    }
                }
            }

		    function filterSubQuery(exp, byKeyField, byValueField){
		        var newExpr = {};
                for (var alias in exp) if (exp.hasOwnProperty(alias)) {
                    var used = isLinkedWithSelfProviders(exp[alias], byKeyField, byValueField);
                    if (used) {
                        newExpr[alias] = JSB.merge(true, {}, exp[alias]);
                    }
                }
                return newExpr;
		    }

//		    function filterFields(groupBy) {
//		        var newGroupBy = [];
//                for (var i in groupBy) {
//                    var used = isLinkedWithSelfProviders(groupBy[i], false, true);
//                    if (used) {
//                        newGroupBy.push(groupBy[i]);
//                    }
//                }
//                return newGroupBy;
//		    }

		    function filterFields(sort, allowAlias) {
		        var newSort = [];
                for (var i in sort) {
                    var used = isLinkedWithSelfProviders(sort[i], false, true);
                    if (!used && dcQuery.$select[sort[i]]) {
                        // alias
                        if (!allowAlias) {
                            throw new Error('GroupBy not support aliases');
                        }
                        used = isLinkedWithSelfProviders(dcQuery.$select[sort[i]], false, true);
                    }
                    if (used) {
                        newSort.push(sort[i]);
                    }
                }
                return newSort;
		    }

		    if (!this.cube) {
		        // provider query
		        return JSB.merge(true, {}, dcQuery, {$finalize: null});
		    }
debugger;
            return {
                $select: filterSubQuery(dcQuery.$select, false, true),
                $filter: filterSubQuery(dcQuery.$filter, true, false),
                $groupBy: filterFields(dcQuery.$groupBy, true),
                $sort: filterFields(dcQuery.$sort, true),
                $distinct: dcQuery.$distinct,
                // TODO ???? need $postFilter?
                // skip $finalize
            };
        },

		close: function() {
		    this.iterator.close();
		},

		translateQuery: function(dcQuery, params){
		    throw new 'Not implemented';
		},

		executeQuery: function(translatedQuery){
            throw new 'Not implemented';
        },
        analyzeQuery: function(translatedQuery){
            throw new 'Not implemented';
        },

		translateResult: function(result) {
		    // implement
		    return result;
		},




        _getCubeFieldProviders: function(field, onlySelf) {
            if (!this.cube) {
                throw new Error('Cube is not defined');
            }
            // return providers of cube field or current provider for join fields
            var providers = [];
            var managedFields = this.cube.getManagedFields();
            if (!managedFields[field]) {
                throw new Error('Cube has no field ' + field);
            }
            var binding = managedFields[field].binding;
            for (var b in binding) {
                if (onlySelf && this.providers.indexOf(binding[b].provider) != -1) {
                    return [binding[b].provider];
                }
                providers.push(binding[b].provider);
            }
            return providers;
        },

        _extractUsedProviders: function(dcQuery, exp, byKeyField, byValueField, onlySelf){
             function putValues(array, values){
                for (var i in values) {
                    var exists = false;
                    for (var j in array) {
                        if (array[j] == values[i]) {
                            exists = true;
                        }
                    }
                    if (!exists) array.push(values[i]);
                }
             }
            // input exp - expression with cube fields
            // result - array with providers connected with current expression
            var providers = [];
            var managedFields = this.cube.getManagedFields();
            if (JSB.isPlainObject(exp)) {
                for(var p in exp) if (exp.hasOwnProperty(p)) {
                    if (!p.match(/^\$/) && byKeyField) {
                        if (this.cube && !managedFields[p]) {
                            // may be alias or provider field
                            putValues(providers,
                                this._extractUsedProviders(dcQuery, dcQuery.$select[p], false, true));
                        } else {
                            providers = providers.concat(this._getCubeFieldProviders(p, onlySelf));
                        }
                    } else {
                        putValues(providers,
                            this._extractUsedProviders(dcQuery, exp[p], byKeyField, byValueField));
                    }
                }
            } else if (JSB.isArray(exp)) {
                for(var i in exp) {
                    putValues(providers,
                        this._extractUsedProviders(dcQuery, exp[i], byKeyField, byValueField));
                }
            } else if (JSB.isString(exp)) {
                if (!exp.match(/^\$/) && byValueField) {
                    if (this.cube && !managedFields[exp]) {
                        // may be provider
                        for(var pp in this.providers) {
                            if (this.providers[pp].extractFields()[exp]) {
                                return [this.providers[pp]];
                            }
                        }
                        // may be alias
                        if (!byValueField) providers = putValues(providers,
                                this._extractUsedProviders(dcQuery, dcQuery.$select[exp], false, true));
                    } else {
                        putValues(providers,
                            this._getCubeFieldProviders(exp, onlySelf));
                    }
                }
            }
            return providers;
        },
//         _getView: function(fields, directProvider){
//            function FieldView(field) {
//                if (fields.indexOf(field) == -1) throw new Error('Failed field for this view');
//
//                this.descriptor = {providers:{}};
//
//                var managedFields = $this.cube.getManagedFields();
//                var desc = managedFields[field];
//                var binding = desc.binding;
//                for (var b : binding) {
//                    if ($this.providers.indexOf(binding[b].provider) == -1) continue;
//
//                    var providerField = binding[b].field;
//                    this.descriptor.cubeField = field;
//                    this.descriptor.providerField = providerField;
//
//                    this.descriptor.providers[binding[b].provider.id] = binding[b].provider;
//                    this.descriptor.shared = (this.descriptor.shared === false) || false;
//                    this.descriptor.joined = (this.descriptor.joined === true) || binding[b].provider.getMode() == 'join';
//                }
//                this.descriptor.joinOn = this.descriptor.shared && this.descriptor.joined;
//            }
//            function View() {
//                var fieldViews = {};
//                this.fieldView = function fieldView(field) {
//                    return fieldViews[field] || fieldViews[field] = new FieldView(field);
//                };
//                this.forEachFieldView = function forEachFieldView(callback){
//                    for (var i in fields) {
//                        var field = fields[i];
//                        var fieldView = this.fieldView(field)
//                        callback.call(fieldView.descriptor, fieldView);
//                    }
//                };
//                this.forEachProvider = function (callback){
//                    var providers = {};
//                    this.forEachFieldView(function(fieldView){
//                        for (var id in this.providers) {
//                            this.providers[id]
//                        }
//                    });
//                };
//            }
//            return new View();
//         },

//        _getCubeView: function(dcQuery, directProvider){
//            function ProviderView (provider, joinOnFields) {
//                this.provider = provider;
//
//                function findProviderFieldBind (queryField){
//                    var cubeFields = $this.cube.managedFields();
//                    var binding = cubeFields[queryField].binding;
//                    for (var b in binding) {
//                        if (binding[b].provider == provider) {
//                            return binding[b];
//                        }
//                    }
//                };
//
//                /** for each used provider fields include join on*/
//                this.forEachFields = function(callback /**call(fieldDesc)*/){
//                    var providerFields = provider.extractFields();
//                    var fields = {};
//                    QueryUtils.walkQueryFields(dcQuery, false, function (queryField, context, query) {
//                        if (fields[queryField]) return;
//
//                        // TODO учесть алиасы с совпадающими названиями
//                        var providerField =
//                                directProvider == provider
//                                ? queryField
//                                : findProviderFieldBind(queryField);
//
//                        if ((!providerField || !providerFields[providerField]) && !isAlias) {
//                            throw new Error('Failed provider field ' + providerField);
//                        }
//                        var fieldDesc = fields[queryField] = {};
//                        fieldDesc.isResultField = dcQuery.hasOwnProperty(queryField) && dcQuery[queryField] != queryField;
//                        fieldDesc.queryField = queryField;
//                        fieldDesc.providerField = providerField;
//                        fieldDesc.provider = providerField && provider;
//                        callback.call(fieldDesc);
//                    });
//                    for (var field : joinOnFields) {
//                        if (!fields[joinOnFields.providerField]) {
//                            var fieldDesc = fields[joinOnFields.providerField] = {};
//                            fieldDesc.providerField = joinOnFields.providerField;
//                            fieldDesc.provider = joinOnFields.provider;
//                            callback.call(fieldDesc);
//                        }
//                    }
//                };
//            }
//
//            function JoinOnView (leftView, rightProviderView){
//                this.leftView = leftView;
//                this.rightProviderView = rightProviderView;
//
//                this.forEachFields = function(callback){
//
//                };
//            }
//
//            function UnionsView (providerViews) {
//                this.providerViews = providerViews;
//
//                this.forEachFields = function(callback){
//                    for(var pv in providerViews) {
//                        var providerView = providerViews[pv];
//                        providerView.forEachFields(function (){
//                            var fieldDesc = this;
//                            // TODO
//                            callback.call(fieldDesc);
//                        });
//                    }
//                };
//            }
//
//            return new (function CubeView(query) {
//                this.query = query;
//                this.view = null;//TODO
//
//            })(dcQuery);
//        },

		close: function() {
		    throw new Error('Not implemented');
		}
	}
}