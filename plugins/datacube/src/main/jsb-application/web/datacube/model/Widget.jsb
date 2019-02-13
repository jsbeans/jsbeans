{
	$name: 'DataCube.Model.Widget',
	$parent: 'JSB.Workspace.Entry',
	
	$require: ['Unimap.Selector'],

	dataVersion: 0,
	dashboard: null,
	wType: null,
	unused: false,
	
	getDashboard: function(){
		return this.dashboard;
	},
	
	getWidgetType: function(){
		return this.wType;
	},
	
	isUnused: function(){
		return this.unused;
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
    
    createContext: function(settings, scheme){
		return new Selector({
			values: settings,
			scheme: scheme,
			createDefaultValues: true,
			updateValues: true
		});
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
        },
        
		_values: null,
		_scheme: null,
		_context: null,
		
		loadContext: function(c){
			if(this._context){
				if(c){
					c.call($this, this._context);
				}
				return;
			}
			this.loadValues(function(values, fail){
				if(fail){
					if(c){
						c.call($this, null, fail);
					}
					return;
				}
				$this.loadScheme(function(scheme, fail){
					$this._context = $this.createContext(values, scheme);
					if(c){
						$this._context.ensureInitialized(function(){
							c.call($this, $this._context);	
						});
					}
				});
			});
		},
		
		loadValues: function(callback){
			if($this._values){
				callback.call($this, JSB.clone($this._values));
			} else {
				this.server().getValues(function(values, fail){
					if(fail){
						callback.call($this, null, fail);
						return;
					}
					$this._values = values;
					callback.call($this, JSB.clone(values));
				});
			}
		},
		
		loadScheme: function(callback){
			if($this._scheme){
				callback.call($this, $this._scheme);
			} else {
				this.server().getScheme(function(scheme, fail){
					if(fail){
						callback.call($this, null, fail);
						return;
					}
					$this._scheme = scheme;
					callback.call($this, $this._scheme);
				});
			}
		},
		
		_updateClient: function(values){
			if(!$this._values || !JSB.isEqual($this._values, values)){
				$this._values = values;
				
				if($this._context){
					// renew context
					$this._context = $this.createContext(values, $this._scheme);
				}
				
			}
		}
    },

	$server: {
        sources: {},
        sourcesIds: null,
        values: null,
        _context: null,

		$require: ['DataCube.Query.Query',
		           'JSB.Workspace.WorkspaceController'],
		
        $bootstrap: function(){
        	WorkspaceController.registerExplorerNode(null, this, {
        		priority:0.5, 
        		nodeType:'DataCube.WidgetNode',
        		create: false,
				move: false,
				remove: true,
				rename: true,
				share: false
        	});
        },

		$constructor: function(id, workspace, dashboard, name, wType, values){
			$base(id, workspace);

            var valueSelector = new Selector();

			if(dashboard){  // create new
				this.dashboard = dashboard;
				this.property('dashboard', this.dashboard.getId());
				this.setName(name);
				this.wType = wType;
				this.property('wType', wType);

				this.values = values;
				if(!this.values){
				    this.values = valueSelector.createDefaultValues(this.extractWidgetScheme());
				}

				this.property('values', this.values);
			} else {    // load from entry
				var bNeedSave = false,
				    dashboard = this.property('dashboard'),
				    wType = this.property('wType'),
				    values = this.property('values'),
				    sourcesIds = this.property('sourcesIds'),
				    unused = this.property('unused');

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
				
				if(unused){
					this.unused = true;
				}

				this.updateSources();
				
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
		
		getContext: function(){
			if(!this._context){
				this._context = this.createContext(this.getValues(), this.extractWidgetScheme());
			}
			
			return this._context;
		},

		getDataSchemeSource: function(ds){
			if(!ds || !ds.source){
				throw new Error('Invalid datascheme passed');
			}
			return this.getWorkspace().entry(ds.source);
		},
		
		getData: function(){
		    return {
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
		
		getScheme: function(){
			return this.extractWidgetScheme();
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
			this._context = null;

			if(opts && opts.name){
				this.setName(opts.name, true);
			}
/*
			this.getDashboard().load(); // todo: update only after change source
			// update interoperation maps in all widgets of current dashboard
			var widgets = this.getDashboard().getWrappers();
			this.getDashboard().store();
*/			
			this.dataVersion++;
			
			this.updateSources();
			
			JSB.defer(function(){
				$this.client()._updateClient($this.property('values'));
			}, 100, '_updateClient_' + this.getId());
			
			return {sources: this.sources};
		},
		
		updateSources: function(){
			this.sources = {};
			if(this.sourcesIds){
				for(var i = 0; i < this.sourcesIds.length; i++){
					try {
						this.sources[this.sourcesIds[i]] = this.getWorkspace().entry(this.sourcesIds[i]);
					} catch(e){}
				}
			}
		}
	}
}