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
		    $this.query = query;
		    $this.providers = providers;
		    $this.cube = cube;
		    $this.directProvider = !cube ? providers[0] : null;
		},

		destroy: function(){
		    $base();
		},

		build: function() {
		    var view = $this.cube
                    ? $this._buildCubeView(name)
                    : $this._buildDataProviderView(name, $this.directProvider);
            return view;
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
            // if empty
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

            // build join views (note: providers already ordered)
            for(var p in $this.providers[p]){
                if (($this.providers[p].getMode()||'union') == 'join') {
                    var providerView = $this._buildDataProviderView(name, $this.providers[p]);

                    if (!leftView) {
                        leftView = providerView;
                    } else {
                        var joinView = new JoinView(name, leftView);
                        joinView.setRightView(providerView);
                        leftView = joinView;
                    }
                }
            }

            cubeView.setView(leftView);
            return cubeView;
        },

		_buildDataProviderView: function(name, dataProvider) {
		    var view = new DataProviderView(name, dataProvider);
		    var managedFields = $this.directProvider == dataProvider
		            ? dataProvider.extractFields()
		            : $this.cube.getManagedFields();
            for(var field in managedFields) {
                var binding = managedFields[field].binding;
                for(var b in binding) if (binding[b].provider == dataProvider){
		            view.setField(field, {
		                type: managedFields[field].type,
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