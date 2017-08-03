{
	$name: 'JSB.DataCube.Model.Widget',
	$parent: 'JSB.Workspace.Entry',
	
	dashboard: null,
	name: null,
	wType: null,
	values: null,
	
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

	
	$client: {},
	
	$server: {
		$require: ['JSB.DataCube.Providers.DataProviderRepository',
		           'JSB.DataCube.Query.QueryEngine',
		           'JSB.Workspace.WorkspaceController'],
		
        $bootstrap: function(){
        	WorkspaceController.registerExplorerNode('datacube', this, 0.5, 'JSB.DataCube.WidgetNode');
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
				this.property('values', values);
			} else {
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
			this.property('values', values);
			this.setName(name);
			this.getDashboard().store();
			this.doSync();
			return true;
		},
		
		getDataSchemeSource: function(ds){
			if(!ds || !ds.source){
				throw new Error('Invalid datascheme passed');
			}
			return this.workspace.entry(ds.source);
		},
		
		combineDataScheme: function(source){
			var iterator = null;
			if(JSB.isInstanceOf(source, 'JSB.DataCube.Model.Slice')){
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