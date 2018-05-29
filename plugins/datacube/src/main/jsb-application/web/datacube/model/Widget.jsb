{
	$name: 'DataCube.Model.Widget',
	$parent: 'JSB.Workspace.Entry',

	dataVersion: 0,
	dashboard: null,
	wType: null,
	
	getDashboard: function(){
		return this.dashboard;
	},
	
	getWidgetType: function(){
		return this.wType;
	},

    extractWidgetScheme: function(){
        var scheme = {},
            curWidgetJsb = JSB.get(this.wType),
            schemesArray = [];

        while(curWidgetJsb){
            if(!curWidgetJsb.isSubclassOf('DataCube.Widgets.Widget')){
                break;
            }
            var wScheme = curWidgetJsb.getDescriptor().$scheme;
            if(wScheme && Object.keys(wScheme).length > 0){
                schemesArray.push(wScheme);
            }
            curWidgetJsb = curWidgetJsb.getParent();
        }

        for(var i = schemesArray.length - 1; i > -1; i--){
            JSB.merge(true, scheme, schemesArray[i]);
        }

        return scheme;
    },

    $client: {
        _clientDataVersion: -1,
        _data: null,

        getData: function(callback){
	        if(this._clientDataVersion !== this.dataVersion){
	            this.server().getData(function(result, fail){
	                if(fail){ return; }

	                $this._data = result;
	                $this._clientDataVersion = $this.dataVersion;

	                callback(result);
	            });
	        } else {
	            callback(this._data);
	        }
        }
    },

	$server: {
        sourceMap: null,
        sources: {},
        sourcesIds: null,
        values: null,

		$require: ['DataCube.Providers.DataProviderRepository',
		           'DataCube.Query.QueryEngine',
		           'JSB.Workspace.WorkspaceController',
		           'Unimap.ValueSelector'],
		
        $bootstrap: function(){
        	WorkspaceController.registerExplorerNode(null, this, {
        		priority:0.5, 
        		nodeType:'DataCube.WidgetNode',
        		create: false,
				move: false,
				remove: false
        	});
        },

		$constructor: function(id, workspace, dashboard, name, wType, values){
			$base(id, workspace);

            var valueSelector = new ValueSelector({
                bootstrap: 'Datacube.Unimap.Bootstrap'
            });

			if(dashboard){  // create new
				this.dashboard = dashboard;
				this.property('dashboard', this.dashboard.getId());
				this.setName(name);
				this.wType = wType;
				this.property('wType', wType);

				if(!values){
				    this.values = valueSelector.createDefaultValues(this.extractWidgetScheme());
				}

				this.property('values', this.values);
			} else {    // load from entry
				var bNeedSave = false,
				    dashboard = this.property('dashboard'),
				    wType = this.property('wType'),
				    values = this.property('values'),
				    sourcesIds = this.property('sourcesIds'),
				    sourceMap = this.property('sourceMap');

				if(dashboard){
					this.dashboard = this.getWorkspace().entry(dashboard);
				}

				if(wType){
					this.wType = wType;
				}

                if(values){
                    this.values = values;
                }

				if(sourcesIds){
				    this.sourcesIds = sourcesIds;
				}

				if(sourceMap){
					this.sourceMap = sourceMap;
					this.updateSources();
				} else {
					this.updateInteroperationMap();
					bNeedSave = true;
				}

				var wasUpdated = valueSelector.updateValues(this.extractWidgetScheme(), this.values);
				if(wasUpdated){
				    this.property('values', this.values);

				    bNeedSave = wasUpdated || bNeedSave;
				}

				if(bNeedSave){
					this.getWorkspace().store();
				}
			}

			valueSelector.destroy();
		},

		getDataSchemeSource: function(ds){
			if(!ds || !ds.source){
				throw new Error('Invalid datascheme passed');
			}
			return this.getWorkspace().entry(ds.source);
		},

		getData: function(){
		    return {
                sourceMap: this.sourceMap,
                sources: this.sources,
                sourcesIds: this.sourcesIds,
		        values: this.values
		    }
		},

		getSourcesIds: function(){
		    return this.sourcesIds;
		},

		getValues: function(){
		    return this.values;
		},

		setName: function(name, notSave){
			if($base(name) && !notSave){
			    this.getWorkspace().store();
			}
		},
		
		storeValues: function(opts){    //name, values, linkedFields, sourcesIds
			this.values = opts.values;
			this.sourcesIds = opts.sourcesIds;
			this.property('values', opts.values);
			this.property('sourcesIds', opts.sourcesIds);

			this.setName(opts.name, true);

			this.getDashboard().load(); // todo: update only after change source
			// update interoperation maps in all widgets of current dashboard
			var widgets = this.getDashboard().getWrappers();
			for(var wId in widgets){
				widgets[wId].updateInteroperationMap();
			}

			this.dataVersion++;
			
			this.getDashboard().store();

			return {sources: this.sources, sourceMap: this.sourceMap};
		},

		updateInteroperationMap: function(){
		    if(!this.sourcesIds){
		        return;
		    }

			var sourceMap = {};

			for(var i = 0; i < this.sourcesIds.length; i++){
			    var source = this.getWorkspace().entry(this.sourcesIds[i]);
                sourceMap[this.sourcesIds[i]] = [];

                if(JSB.isInstanceOf(source, 'DataCube.Model.Slice')){
                    var cube = source.getCube();
                    cube.load();
                    var sliceMap = cube.getSlices();
                    for(var sId in sliceMap){
                        sourceMap[this.sourcesIds[i]].push(sId);
                    }
                } else {
                    sourceMap[this.sourcesIds[i]].push(this.sourcesIds[i]);
                }
			}

			this.sourceMap = sourceMap;
			this.property('sourceMap', this.sourceMap);
			this.updateSources();
			return sourceMap;
		},

		updateSources: function(){
			this.sources = {};
			for(var sId in this.sourceMap){
				this.sources[sId] = this.getWorkspace().entry(sId);
			}
		}
	}
}