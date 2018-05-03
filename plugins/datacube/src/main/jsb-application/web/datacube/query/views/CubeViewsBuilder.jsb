{
	$name: 'DataCube.Query.Views.CubeViewsBuilder',

	$server: {
		$require: [
		    'DataCube.Query.Views.CubeView',
		    'DataCube.Query.Views.JoinView',
		    'DataCube.Query.Views.UnionsView',
		    'DataCube.Query.Views.DataProviderView',
		    'DataCube.Query.Views.NothingView',
        ],

		$constructor: function(cube, providers){
		    $this.providers = providers;
		    $this.cube = cube;
		    $this.directProvider = !cube ? providers[0] : null;
		},

		destroy: function(){
		    $base();
		},

		build: function(name, usedFields) {
		    var view = $this.cube
                    ? $this._buildCubeView(name, usedFields)
                    : $this._buildDataProviderView(name, $this.directProvider, usedFields);
            return view;
		},

        _buildCubeView: function(name, usedFields) {
            var cubeView = new CubeView(name, $this.cube, $this.providers);
            cubeView.usedFields = usedFields;

            var unionsCount = 0;
            var joinsCount = 0;
            for(var p in $this.providers){
                if (($this.providers[p].getMode()||'union') == 'union') {
                    unionsCount++;
                } else {
                    joinsCount++;
                }
            }
            // if empty
            if(unionsCount == 0 && joinsCount == 0) {
                cubeView.setView(new NothingView(name));
                return cubeView;
            }

            var leftView;
            // build unions view
            for(var p in $this.providers) {
                if (($this.providers[p].getMode()||'union') == 'union') {
                    var providerView = $this._buildDataProviderView("union_"+p+'_'+name, $this.providers[p], usedFields);
                    if (!leftView) {
                        if (unionsCount > 1) {
                            leftView = new UnionsView("unions_"+name);
                            leftView.usedFields = usedFields;
                            leftView.addView(providerView);
                        } else {
                            leftView = providerView;
                        }
                    } else {
                        leftView.addView(providerView);
                    }
                }
            }

            // build join views (note: providers already ordered)
            for(var p in $this.providers){
                if (($this.providers[p].getMode()||'union') == 'join') {
                    var providerView = $this._buildDataProviderView("join_"+p+'_'+name, $this.providers[p], usedFields);

                    if (!leftView) {
                        leftView = providerView;
                    } else {
                        var joinView = new JoinView(name, leftView);
                        joinView.usedFields = usedFields;
                        joinView.setRightView(providerView);
                        leftView = joinView;
                    }
                }
            }

            cubeView.setView(leftView);
            return cubeView;
        },

		_buildDataProviderView: function(name, dataProvider, usedFields) {
		    var view = new DataProviderView(name, dataProvider);
		    view.usedFields = usedFields;
		    var managedFields = $this.directProvider == dataProvider
		            ? dataProvider.extractFields()
		            : $this.cube.getManagedFields();
            for(var field in managedFields) {
                var binding = managedFields[field].binding;
                for(var b in binding) if (binding[b].provider == dataProvider){
		            view.setField(field, {
		                type: managedFields[field].type,
		                nativeType: managedFields[field].nativeType || managedFields[field].type,
		                field: field,
		                providerField: $this.directProvider == dataProvider ? field : binding[b].field,
		            });
                    break;
                }
            }

		    return view;
		},
	}
}