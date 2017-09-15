{
	$name: 'DataCube.Model.Widget',
	$parent: 'JSB.Workspace.Entry',
	
	dashboard: null,
	name: null,
	wType: null,
	values: null,
	sourceMap: null,
	sources: {},
	
	getName: function(){
		return this.name;
	},
	
	getDashboard: function(){
		return this.dashboard;
	},
	
	getWidgetType: function(){
		return this.wType;
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
		           'JSB.Workspace.WorkspaceController'],
		
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
				this.sourceMap = this.generateInteroperationMap(values);
				this.property('values', values);
				this.property('sourceMap', this.sourceMap);
				for(var sId in this.sourceMap){
					this.sources[sId] = this.workspace.entry(sId);
				}
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
				if(this.property('sourceMap')){
					this.sourceMap = this.property('sourceMap');
				} else {
					this.sourceMap = this.generateInteroperationMap(this.values);
					this.property('sourceMap', this.sourceMap);
					bNeedSave = true;
				}
				for(var sId in this.sourceMap){
					this.sources[sId] = this.workspace.entry(sId);
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
			this.setName(name);
			this.getDashboard().store();
			this.doSync();
			return true;
		},
		
		storeValues: function(name, values){
			this.values = values;
			this.sourceMap = this.generateInteroperationMap(values);
			this.sources = {};
			for(var sId in this.sourceMap){
				this.sources[sId] = this.workspace.entry(sId);
			}
			this.property('values', values);
			this.property('sourceMap', this.sourceMap);
			this.setName(name);
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

		generateSchemeMap: function(values){
		    // todo * scheme refactoring
		},
		
		generateInteroperationMap: function(values){
			var sourceMap = {};
			
			function traverseValues(src, callback){
				if(!src || !src.used){
					return;
				}
				var sCont = {bStop : false};
				callback.call($this, src, function(){
					sCont.bStop = true;
				});
				
				if(sCont.bStop){
					return;
				}
				if(src.type == 'group'){
					for(var i = 0; i < src.groups.length; i++){
						var gDesc = src.groups[i];
						for(var j = 0; j < gDesc.items.length; j++){
							traverseValues(gDesc.items[j], callback);
						}
					}
				} else if(src.type == 'select'){
					var iDesc = src.items[src.chosenIdx];
					traverseValues(iDesc, callback);
				} else if(src.type == 'widget'){
					var wDesc = src.values;
					traverseValues(wDesc, callback);
				}
			}
			
			traverseValues(values, function(entry, stop){
				if(entry.type == 'widget'){
					stop();
					return;
				}
				if(entry.binding && entry.binding.source){
					var source = $this.workspace.entry(entry.binding.source);
					sourceMap[entry.binding.source] = []
					if(JSB.isInstanceOf(source, 'DataCube.Model.Slice')){
						var cube = source.getCube();
						cube.load();
						var sliceMap = cube.getSlices();
						for(var sId in sliceMap){
							sourceMap[entry.binding.source].push(sId);
						}
					} else {
						sourceMap[entry.binding.source].push(entry.binding.source);
					}
					
				}
			});
			
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
			function processElement(val){
				if(JSB.isNull(val)){
					return {type: 'null'};
				} else if(JSB.isObject(val)){
					var rDesc = {type: 'object', record: {}};
					for(var f in val){
						var cVal = val[f];
						var r = processElement(cVal);
						if(r.type != 'null' || !rDesc.record[f]){
							rDesc.record[f] = JSB.merge(true, rDesc.record[f] || {}, r);
						}
						rDesc.record[f].field = f;
					}
					return rDesc;
				} else if(JSB.isArray(val)){
					var rDesc = {type:'array', arrayType: {type:'null'}};
					for(var i = 0; i < val.length; i++){
						var r = processElement(val[i]);
						if(r && r.type != 'null'){
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