{
	$name: 'DataCube.Query.Views.CubeViewsBuilder',

	$server: {
		$require: [
		    'DataCube.Query.QueryUtils',

		    'DataCube.Query.Views.NothingView',
		    'DataCube.Query.Views.QueryView',
		    'DataCube.Query.Views.JoinsView',
		    'DataCube.Query.Views.UnionsView',
		    'DataCube.Query.Views.SqlView',
		    'DataCube.Query.Views.DataProviderView',
        ],

		$constructor: function(cube, providers){
		    $this.query = query;
		    $this.providers = providers;
		    $this.cube = cube;
		    $this.singleProvider = providers.length == 1 && providers[0] || null;
		},

		build: function() {
		    $this.cube
                    ? $this._buildCubeView(name)
                    : $this._buildDataProviderView(name, $this.singleProvider);
		},


		_buildCubeView: function(name) {
            var cubeView = new CubeView(name);

            var unionsCount = 0;
            var joinsCount = 0;
            for(var p in $this.providers[p]){
                if (($this.providers[p].getMode()||'union') == 'union') {
                    unionsCount++;
                } else {
                    joinsCount++;
                }
            }
            if(unionsCount == 0 && joinsCount == 0) {
                cubeView.setView(new NothingView(name));
                return cubeView;
            }

            // build unions view
            if (unionsCount > 1) {
                leftView = new UnionsView(name);
            }
            for(var p in $this.providers[p]) {
                if (($this.providers[p].getMode()||'union') == 'union') {
                    var providerView = $this._buildDataProviderView(name, $this.providers[p]);
                    if (leftView) {
                        leftView.addView(providerView);
                    } else {
                        leftView = providerView;
                    }
                }
            }
            // build join views
            if (leftView && joinsCount = 0) {
            } else if (leftView && joinsCount > 0) {
                leftView = new JoinView(name, leftView);
            }

            for(var p in $this.providers[p]){
                if (($this.providers[p].getMode()||'union') == 'join') {
                    var providerView = $this._buildDataProviderView(name, $this.providers[p]);
                    if(!leftView) {
                        leftView = providerView;
                    } else if(JSB.isInstanceOf(leftView, 'DataCube.Query.Views.JoinView')) {
                        var joinView = new JoinView(name, providerView);
                        leftView.setRightView(joinView);
                        leftView = joinView;
                    } else {
                        leftView = new JoinView(name, leftView);
                    }
                }
            }

            cubeView.setView(leftView);
            return cubeView;
        },

		_buildDataProviderView: function(name, dataProvider) {
		    var view = new DataProviderView(name, dataProvider);
            for(var cubeField in managedFields) {
                var binding = managedFields[cubeField].binding;
                for(var b in binding) if (binding[b].provider == dataProvider){
		            view.setField(cubeField, {
		                type: managedFields[cubeField].type,
		                field: cubeField,
		                providerField: binding[b].field,
		            });
                    break;
                }
            }

		    return view;
		},
	}
}