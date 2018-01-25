{
	$name: 'DataCube.Query.Views.QueryViewsBuilder_old',

	$server: {
		$require: [
		    'DataCube.Query.QueryUtils',

            'DataCube.Query.Views.CubeViewsBuilder'
		    'DataCube.Query.Views.NothingView',
		    'DataCube.Query.Views.QueryView',
		    'DataCube.Query.Views.SqlView',
        ],

		$constructor: function(query, cube, providers){
		    $this.query = query;
		    $this.cubeViewsBuilder = new CubeViewsBuilder(cube, providers);

		    // для каждого запроса/констекста формируется:
		    $this.contextSourceViews = {};  // - вьюха источника любого типа
		    $this.contextViews = {};  // - вьюха текущего запроса/контекста (типа QueryView)
		},

		destroy: function(){
		    $this.cubeViewsBuilder.destroy();
		    $base();
		},

		build: function() {
		    // build pre-defined $views
		    for(var name in dcQuery.$views) {
		        $this._buildQueryViews(name, dcQuery.$views[name]);
		    }
		    // build query views
            $this._buildQueryViews(dcQuery.$context, dcQuery);
		},

        _buildQueryViews: function(name, query) {
            // from leaf to root
            QueryUtils.walkSubQueries(query, function(subQuery, isFromQuery, isValueQuery){
                $this._buildContextView(name, subQuery, query);
            });
		},

		_buildContextView: function(name, query) {
		    var sourceView = $this._buildContextSourceViews(name, query);
		    var resultView = $this._buildContextViews(name, query, sourceView);
		    if (!sourceView || !resultView) throw new Error('Internal error: result or source view for query is not defined');
		},

		_buildContextSourceViews: function(name, query) {
            var sourceView = null;
            if (query.$sql) {
                // is sql source
                sourceView = $this._buildContextView(name, query.$sql);
            } else if(JSB.isString(query.$from)){
                // is $views source
                sourceView = $this._buildContextView(name, query.$views[query.$from]);
            } else if(query.$from && query.$from.$select) {
                // is $from QueryView (query on query)
                var fromView = $this.contextViews[query.$from.$context];
                if (!fromView) {
                    throw new Error('Children $from view is undefined for context ' + query.$from.$context);
                }
                sourceView = fromView;
            } else {
                // check if query without source or build cube`s views
                var usedFields = {/**usages*/};
                QueryUtils.walkQueryFields(query, /**includeSubQueries=*/false,
                    function(field, context, curQuery){
                        if (!usedFields[field]) {
                            usedFields[field] = 0;
                        }
                        usedFields[field]++;
                    }
                );

                if (Object.keys(usedFields).length == 0) {
                    // is NothingView
                    sourceView = new NothingView(name);
                } else {
                    // is Cube/DataProvider source
                    sourceView = $this.cube
                            ? $this._buildCubeView(name, query, usedFields)
                            : $this.__buildDataProviderView(name, query, usedFields, $this.singleProvider);
                }
            }

            return $this.contextSourceViews[query.$context] = sourceView;
		},

		_buildContextViews: function(name, query, sourceView) {
		    var view = new QueryView(name, query, sourceView);
		    for(var alias in query.$select) {
                view.setField(alias, {
                    type: QueryUtils.extractType(
                            query.$select[alias], query,
                            $this.cube || $this.singleProvider),
                    expr: query.$select[alias],
                });
            }
            return $this.contextViews[query.$context] = view;
		},

		_buildCubeView: function(name, query, usedFields) {
		    var unionsView = new UnionsView(name);
		    var joinView = new JoinView(name, unionsView);

            // collect fields, providers and build UnionsView
            var fields = {};
            var providers = {};
            var joinedProviders = [];
            var forJoinProviders = [];
            var managedFields = $this.cube.getManagedFields();
            QueryUtils.walkCubeFields(
                query, /**includeSubQueries=*/false, $this.cube,
                function (cubeField, context, fieldQuery, binding) {
                    // пропустить поля из других запросов
                    if (fieldQuery == query) {
                        fields[cubeField] = {};
                        var foundProvider = false;
                        for (var i in binding) {
                            if ($this.providers.indexOf(binding[i].provider) != -1) {
                                foundProvider = true;
                                var id = binding[i].provider.id;
                                if (!providers[id]) {
                                    providers[id] = {
                                        provider: binding[i].provider,
                                        view: new DataProviderView(name, binding[i].provider),
                                        isJoinedProvider: (binding[i].provider.getMode()||'union') == 'join',
                                        cubeFields: {/**hasOtherBinding*/},
                                        providerFields: {/**providerField: cubeField*/}
                                    };
                                    if ((binding[i].provider.getMode()||'union') == 'union') {
                                        unionsView.addView(providers[id].view);
                                        joinedProviders.add(binding[i].provider);
                                    }
                                }
                                var hasOtherBinding = binding.length > 1;
                                providers[id].cubeFields[cubeField] = hasOtherBinding;
                                providers[id].providerFields[binding[i].field] = cubeField;

                                // register provider view`s field
                                providers[id].view.setField(cubeField, {
                                    type: managedFields[cubeField].type,
                                    field: cubeField,
                                    nativeName: binding[i].field,
                                });
                            }
                        }
                        if (!foundProvider) throw Error('Illegal iterator provider ' + binding[i].provider.name + ' for field ' + cubeField);
                    }
                }
            );
            // build join views tree
            for(var p in $this.providers) {
                if ($this.providers[p].getMode() == 'join') {
                    joinView.setRightView(providers[$this.providers[p].id].view);
                    joinView = new JoinView(name, joinView);
                }
            }
            joinView = joinView.leftView;

//            // add joinOn fields
//            for(var cubeField in managedFields){
//                var binding = managedFields[cubeField].binding;
//                if (binding.length > 1) {
//                    var hasJoin = false;
//                    for(var r = 0; r < binding.length; r++) {
//                        if ($this.providers.indexOf(binding[r].provider) != -1
//                                && binding[r].provider.getMode() == 'join') {
//                            hasJoin = true;
//                            break;
//                        }
//                    }
//                    if (hasJoin) {
//                        for(var r = 0; r < binding.length; r++) {
//                            if ($this.providers.indexOf(binding[r].provider) != -1) {
//                                fields[cubeField] = {};
//
//                                var hasOtherBinding = binding.length > 1;
//                                providers[binding[r].provider.id].cubeFields[cubeField] = hasOtherBinding;
//                                providers[binding[r].provider.id].providerFields[binding[r].field] = cubeField;
//
//                                // register provider view`s field
//                                providers[binding[r].provider.id].view.setField(field, {
//                                    type: managedFields[cubeField].type,
//                                    field: cubeField,
//                                    nativeName: binding[r].field,
//                                });
//                            }
//                        }
//                    }
//                }
//            }
//            // set fields[name].isJoined
//            for(var cubeField in fields) if(fields.hasOwnProperty(cubeField)) {
//                var isJoined = true;
//                var managedField = managedFields[cubeField];
//                var binding = managedField.binding;
//                for (var i in binding) {
//                    if ($this.providers.indexOf(binding[i].provider) != -1) {
//                        if (binding[i].provider.getMode() != 'join') {
//                            isJoined = false;
//                        }
//                    }
//                }
//                fields[cubeField].isJoined = isJoined;
//            }
//
//            // add joinOn
//            for(var i = 0; i < forJoinProviders.length; i++){
//                var rightProvider = forJoinProviders[i];
//
//                var leftView =
//                if ()
//            }
//            for(var i = 0; i < $this.providers.length; i++) {
//                for(var j = i + 1; j < $this.providers.length; j++) {
//
//                }
//            }

            // TODO joinsView.addJoinOn(leftView, rightView, fieldsMap);

            return new CubeView(name, joinView);



//            //      collect providers and fields
//            var providers = {/**providerId: {provider, providerFields:{providerField: cubeField}, cubeFields: {hasOtherBinding}}*/};
//            var allFields = {/**cubeField: isJoined*/}; /**isJoined=true when field from only joined provider*/
//            QueryUtils.walkCubeFields(
//                query, /**includeSubQueries=*/false, $this.cube,
//                function (cubeField, context, fieldQuery, binding) {
//                    // пропустить поля из других запросов
//                    if (fieldQuery == query) {
//                        allFields[cubeField] = false;
//                        var foundProvider = false;
//                        for (var i in binding) {
//                            if ($this.providers.indexOf(binding[i].provider) != -1) {
//                                foundProvider = true;
//                                var id = binding[i].provider.id;
//                                var prov = providers[id] = providers[id] || {
//                                    provider: binding[i].provider,
//                                    isJoinedProvider: (binding[i].provider.getMode()||'union') == 'join',
//                                    cubeFields: {/**hasOtherBinding*/},
//                                    providerFields: {/**providerField: cubeField*/}
//                                };
//                                var hasOtherBinding = binding.length > 1;
//                                prov.cubeFields[cubeField] = hasOtherBinding;
//                                prov.providerFields[binding[i].field] = cubeField;
//                            }
//                        }
//                        if (!foundProvider) throw Error('Illegal iterator provider ' + binding[i].provider.name + ' for field ' + cubeField);
//                    }
//                }
//            );
//
//            //      if single provider - simple SELECT from provider`s table
//            if (Object.keys(providers).length == 1) {
//                var cubeFields = $this.getManagedFields();
//                return $this.__buildSingleDataProviderView(
//                    name, usedDataProviderFields,
//                    providers[Object.keys(providers)[0]].provider,
//                    function getName(field, dataProvider){
//                        var binding = cubeFields[field].binding;
//                        for (var b in binding) {
//                            if (binding[b].provider == dataProvider) {
//                                return binding[b].field;
//                            }
//                        }
//                        throw new Error('Invalid data provider binding for field ' + field);
//                    }
//                );
//            }
//
//            //      if some providers - build UNION view and JOIN ON tables
//
//            // and add joinOn (join keys) fields to allFields, providers.(providerFields, cubeFields)
//            $this.__addJoinOnFields(allFields, providers);
//
//            // set isJoined for allFields
//            $this.__setIsJoinedFields(allFields);
//
//            // TODO ...
//            var managedFields = {};
//            var unionsView = {};
//            var joinsView = {};
//
//            return new CubeView(name, unionsView, joinsView, managedFields);
		},

		__buildDataProviderView: function(name, query, usedFields, dataProvider) {
		    var view = new DataProviderView(name, dataProvider);

		    var providerFields = dataProvider.extractFields();
		    for (var field in usedFields) {
		        if (providerFields.hasOwnProperty(field)) {
		            view.setField(field, {
		                type: providerFields[field].type,
		                field: field,
		            });
		        }
		    }
		    return view;
		},

		__addJoinOnFields: function(allFields, providers) {
            var managedFields = $this.cube.getManagedFields();
            for(var cubeField in managedFields){
                var binding = managedFields[cubeField].binding;
                if (binding.length > 1) {
                    // TODO: оставить только поля, участвующие в JOIN
                    var hasJoin = false;
                    for(var r = 0; r < binding.length; r++) {
                        if ($this.providers.indexOf(binding[r].provider) != -1
                                && binding[r].provider.getMode() == 'join') {
                            hasJoin = true;
                            break;
                        }
                    }
                    if (hasJoin) {
                        for(var r = 0; r < binding.length; r++) {
                            if ($this.providers.indexOf(binding[r].provider) != -1) {
                                allFields[cubeField] = false;
                                var hasOtherBinding = binding.length > 1;
                                providers[binding[r].provider.id].cubeFields[cubeField] = hasOtherBinding;
                                providers[binding[r].provider.id].providerFields[binding[r].field] = cubeField;
                            }
                        }
                    }
                }
            }
        },

		__setIsJoinedFields: function(allFields) {
            var managedFields = $this.cube.getManagedFields();
            for(var cubeField in allFields) if(allFields.hasOwnProperty(cubeField)) {
                var isJoined = true;
                var managedField = managedFields[cubeField];
                var binding = managedField.binding;
                for (var i in binding) {
                    if ($this.providers.indexOf(binding[i].provider) != -1) {
                        if (binding[i].provider.getMode() != 'join') {
                            isJoined = false;
                        }
                    }
                }
                allFields[cubeField] = isJoined;
            }
        },
	}
}