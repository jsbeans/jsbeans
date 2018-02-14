{
	$name: 'DataCube.Model.Widget',
	$parent: 'JSB.Workspace.Entry',
	
	dashboard: null,
	name: null,
	wType: null,
	values: null,
	sourceMap: null,
	sources: {},
	linkedFields: {},
	
	getName: function(){
		return this.name;
	},
	
	getDashboard: function(){
		return this.dashboard;
	},
	
	getWidgetType: function(){
		return this.wType;
	},

	getLinkedFields: function(){
	    return this.linkedFields;
	},

	getSourcesIds: function(){
	    return this.sourcesIds;
	},
	
	getValues: function(){
		return this.values;
	},
	
	getSourceMap: function(){
		return this.sourceMap;
	},
	
	getSources: function(){
		return this.sources;
	},
	
	$client: {},
	
	$server: {
		$require: ['DataCube.Providers.DataProviderRepository',
		           'DataCube.Query.QueryEngine',
		           'JSB.Workspace.WorkspaceController',
		           'Datacube.ValueConverter'],
		
        $bootstrap: function(){
        	WorkspaceController.registerExplorerNode('datacube', this, 0.5, 'DataCube.WidgetNode');
        },

		$constructor: function(id, workspace, dashboard, name, wType, values){
			$base(id, workspace);

			if(dashboard){
				this.dashboard = dashboard;
				this.name = name;
				this.property('dashboard', this.dashboard.getLocalId());
				this.title(this.name);
				this.wType = wType;
				this.property('wType', wType);
				this.values = values;

				//this.updateInteroperationMap();

				this.property('values', values);
				this.property('schemeVersion', 1.0);
			} else {
				var bNeedSave = false;
				if(this.property('dashboard')){
					this.dashboard = this.workspace.entry(this.property('dashboard'));
				}

				this.name = this.title();

				if(this.property('wType')){
					this.wType = this.property('wType');
				}

                if(this.property('values')){
                    this.values = this.property('values');
                }

				if(this.property('schemeVersion')){
				    this.schemeVersion = this.property('schemeVersion');

                    if(this.property('linkedFields')){
                        this.linkedFields = this.property('linkedFields');
                    }
				} else {
				    var convertVal = ValueConverter.convert(this.wType, this.values);
				    this.values = convertVal.values;
				    this.property('values', this.values);
				    this.linkedFields = convertVal.linkedFields;
				    this.property('linkedFields', this.linkedFields);
				    this.property('schemeVersion', 1.0);
				    bNeedSave = true;
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
					this.workspace.store();
				}
			}
		},

		setName: function(name){
			this.name = name;
			this.title(this.name);
		},
		
		rename: function(name){
			this.getDashboard().load();
			this.setName(name);
			this.getDashboard().store();
			this.doSync();
			return true;
		},
		
		storeValues: function(opts){    //name, values, linkedFields, sourcesIds
			this.getDashboard().load();
			this.values = opts.values;
			this.sourcesIds = opts.sourcesIds;
			this.linkedFields = opts.linkedFields;
			this.property('values', opts.values);
			this.property('linkedFields', opts.linkedFields);
			this.property('sourcesIds', opts.sourcesIds);
			this.property('schemeVersion', 1.0);
			this.setName(opts.name);
			
			// update interoperation maps in all widgets of current dashboard
			var widgets = this.getDashboard().getWrappers();
			for(var wId in widgets){
				widgets[wId].updateInteroperationMap();
				widgets[wId].doSync();
			}
			
			this.getDashboard().store();
			this.doSync();
			return {sources: this.sources, sourceMap: this.sourceMap};
		},
		
		getDataSchemeSource: function(ds){
			if(!ds || !ds.source){
				throw new Error('Invalid datascheme passed');
			}
			return this.workspace.entry(ds.source);
		},
		
		updateSources: function(){
			this.sources = {};
			for(var sId in this.sourceMap){
				this.sources[sId] = this.workspace.entry(sId);
			}
		},
		
		updateInteroperationMap: function(){
		    if(!this.sourcesIds){
		        return;
		    }

			var sourceMap = {};

			for(var i = 0; i < this.sourcesIds.length; i++){
			    var source = this.workspace.entry(this.sourcesIds[i]);
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
/*				var qe = new QueryEngine(null);
				iterator = qe.query({$select:{}}, {}, provider);
*/
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
				source: source.getLocalId(),
				arrayType: recordTypes
			}
		}
	}
}