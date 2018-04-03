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
	                $this._clientDataVersion = this.dataVersion;

	                callback(result);
	            });
	        } else {
	            callback(this._styles);
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

			if(dashboard){  // create new
				this.dashboard = dashboard;
				this.property('dashboard', this.dashboard.getId());
				this.setName(name);
				this.wType = wType;
				this.property('wType', wType);

				if(!values){
				    var valueSelector = new ValueSelector({
				        bootstrap: 'Datacube.Unimap.Bootstrap'
				    });

				    this.values = valueSelector.createDefaultValues(this.extractWidgetScheme());

				    valueSelector.destroy();
				}

				this.property('values', this.values);
				this.property('schemeVersion', 1.0);
			} else {    // load from entry
				var bNeedSave = false;
				if(this.property('dashboard')){
					this.dashboard = this.getWorkspace().entry(this.property('dashboard'));
				}

				if(this.property('wType')){
					this.wType = this.property('wType');
				}

                if(this.property('values')){
                    this.values = this.property('values');
                }

				if(this.property('sourcesIds')){
				    this.sourcesIds = this.property('sourcesIds');
				}

				if(this.property('sourceMap')){
					this.sourceMap = this.property('sourceMap');
					this.updateSources();
				} else {
					this.updateInteroperationMap();
					bNeedSave = true;
				}
				
				if(bNeedSave){
					this.getWorkspace().store();
				}
			}
		},

		combineDataScheme: function(source){
			var iterator = null;
			if(JSB.isInstanceOf(source, 'DataCube.Model.Slice')){
				iterator = source.executeQuery();
			} else {
				// TODO
				var dpInfo = DataProviderRepository.queryDataProviderInfo(source);
				var ProviderClass = JSB.get(dpInfo.pType).getClass();
				var provider = new ProviderClass(JSB.generateUid(), source, null);
				provider.extractFields();

				var buffer = provider.find();
				iterator = {
					buffer: buffer,
					total: buffer.length,
					pos: 0,
					next: function(){
						if(this.pos >= this.total){
							return null;
						}
						return this.buffer[this.pos++];
					},
					close: function(){
						this.buffer = [];
						this.total = 0;
						this.pos = 0;
					}
				}
			}
			if(!iterator){
				return null;
			}
			function processElement(val, path){
				if(JSB.isNull(val)){
					return {};
				} else if(JSB.isObject(val)){
					var rDesc = {type: 'object', record: {}};
					for(var f in val){
						var cVal = val[f];
						var curPath = path;
						if(curPath){
							curPath = curPath + '.' + f;
						} else {
							curPath = f;
						}
						var r = processElement(cVal, curPath);
						rDesc.record[f] = JSB.merge(true, rDesc.record[f] || {}, r);
						rDesc.record[f].field = f;
						if(path){
							rDesc.record[f].path = path;
						}
					}
					return rDesc;
				} else if(JSB.isArray(val)){
					var rDesc = {type:'array', arrayType: {}};
					for(var i = 0; i < val.length; i++){
						var r = processElement(val[i], path);
						if(r && Object.keys(r).length > 0){
							rDesc.arrayType = r;
						}
					}
					return rDesc;
				} else if(JSB.isString(val)){
					return {type: 'string'};
				} else if(JSB.isFloat(val)){
					return {type: 'float'};
				} else if(JSB.isInteger(val)){
					return {type: 'integer'};
				} else if(JSB.isBoolean(val)){
					return {type: 'boolean'};
				} else if(JSB.isDate(val)){
					return {type: 'date'};
				}
			}
			var recordTypes = {};
			for(var j = 0; j < 100; j++){
				var el = iterator.next();
				if(!el){
					break;
				}
				var r = processElement(el);
				JSB.merge(true, recordTypes, r);
			}
			iterator.close();
			return {
				type: 'array',
				source: source.getId(),
				arrayType: recordTypes
			}
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

		setName: function(name){
		    this.getDashboard().load();
			$base(name);
			this.getDashboard().store();
			this.doSync();
		},
		
		storeValues: function(opts){    //name, values, linkedFields, sourcesIds
			this.getDashboard().load();
			this.values = opts.values;
			this.sourcesIds = opts.sourcesIds;
			this.property('values', opts.values);
			this.property('sourcesIds', opts.sourcesIds);
			this.property('schemeVersion', 1.0);

			this.setName(opts.name);
			
			// update interoperation maps in all widgets of current dashboard
			var widgets = this.getDashboard().getWrappers();
			for(var wId in widgets){
				widgets[wId].updateInteroperationMap();
				//widgets[wId].doSync();
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