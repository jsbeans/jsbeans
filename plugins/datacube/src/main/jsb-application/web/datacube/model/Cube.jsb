{
	$name: 'JSB.DataCube.Model.Cube',
	$parent: 'JSB.Workspace.Entry',
	
	sourceCount: 0,
	fieldCount: 0,
	sliceCount: 0,
	
	getSourceCount: function(){
		return this.sourceCount;
	},
	
	getFieldCount: function(){
		return this.fieldCount;
	},

	getSliceCount: function(){
		return this.sliceCount;
	},

	$server: {
		$require: ['JSB.Workspace.WorkspaceController',
		           'JSB.DataCube.Providers.DataProviderRepository',
		           'JSB.DataCube.Model.Slice'],
		
		$bootstrap: function(){
			WorkspaceController.registerExplorerNode('datacube', this, 0.5, 'JSB.DataCube.CubeNode');
		},
		
		loaded: false,
		dataProviders: {},
		dataProviderEntries: {},
		dataProviderFields: {},
		dataProviderPositions: {},
		fields: {},
		fieldOrder: [],
		slices: {},
		slicePositions: {},
		nodePosition: null,

		$constructor: function(id, workspace, opts){
			$base(id, workspace);
			if(opts){
			} else {
				
			}
		},
		
		load: function(){
			if(!this.loaded){
				if(this.workspace.existsArtifact(this.getLocalId() + '.cube')){
					var snapshot = this.workspace.readArtifactAsJson(this.getLocalId() + '.cube');
					
					this.nodePosition = snapshot.position;
					
					// construct data providers
					for(var i = 0; i < snapshot.providers.length; i++){
						var pDesc = snapshot.providers[i];
						if(!this.workspace.existsEntry(pDesc.entry)){
							JSB.getLogger().warn('Unable to construct data provider "'+pDesc.jsb+'" due to missing source entry: ' + pDesc.entry);
							continue;
						}
						var pEntry = this.workspace.entry(pDesc.entry);
						var pJsb = JSB.get(pDesc.jsb);
						if(!pJsb){
							JSB.getLogger().error('Unable to construct data provider "'+pDesc.jsb+'" due to missing its bean');
							continue;
						}
						var ProviderClass = pJsb.getClass();
						var providerDesc = DataProviderRepository.queryDataProviderInfo(pEntry);
						var provider = new ProviderClass(pDesc.id, pEntry, this, providerDesc.opts);
						this.dataProviders[pDesc.id] = provider;
						this.dataProviderEntries[pDesc.id] = pEntry;
						this.dataProviderFields[pDesc.id] = pDesc.fields;
						this.dataProviderPositions[pDesc.id] = pDesc.position;
					}
					
					// construct fields
					for(var i = 0; i < snapshot.fields.length; i++){
						var fDesc = snapshot.fields[i];
						this.fields[fDesc.field] = {
							field: fDesc.field,
							type: fDesc.type,
							link: fDesc.link,
							order: fDesc.order,
							binding: []
						};
						for(var j = 0; j < fDesc.binding.length; j++){
							var bDesc = fDesc.binding[j];
							this.fields[fDesc.field].binding.push({
								provider: this.dataProviders[bDesc.provider],
								field: bDesc.field,
								type: bDesc.type
							});
						}
					}
					
					// construct slices
					for(var i = 0; i < snapshot.slices.length; i++){
						var sDesc = snapshot.slices[i];
						this.slicePositions[sDesc.id] = sDesc.position;
						var slice = new Slice(sDesc.id, this, sDesc.name);
						slice.setQuery(sDesc.query);
						this.slices[sDesc.id] = slice;
					}
					
				}
				this.loaded = true;
			}
			
			// construct response for drawing
			var desc = {
				cubePosition: this.nodePosition,
				providers: [],
				fields: this.fields,
				slices: []
			};
			for(var pId in this.dataProviders){
				desc.providers.push({
					provider: this.dataProviders[pId],
					position: this.dataProviderPositions[pId]
				});
			}
			for(var sId in this.slices){
				desc.slices.push({
					slice: this.slices[sId],
					position: this.slicePositions[sId]
				});
			}
			
			return desc;
		},
		
		store: function(){
			var mtxName = 'store_' + this.getId();
			JSB.getLocker().lock(mtxName);
			// construct snapshot
			var snapshot = {
				providers: [],
				fields: [],
				slices: [],
				position: this.nodePosition
			};
			
			// prepare providers
			for(var pId in this.dataProviders){
				var provider = this.dataProviders[pId];
				var pDesc = {
					id: pId,
					jsb: provider.getJsb().$name,
					entry: this.dataProviderEntries[pId].getLocalId(),
					fields: this.dataProviderFields[pId],
					position: this.dataProviderPositions[pId]
				};
				snapshot.providers.push(pDesc);
			}
			
			// prepare fields
			for(var fName in this.fields){
				var fDesc = {
					field: fName,
					type: this.fields[fName].type,
					link: this.fields[fName].link,
					order: this.fields[fName].order,
					binding: []
				};
				for(var i = 0; i < this.fields[fName].binding.length; i++){
					var b = this.fields[fName].binding[i];
					fDesc.binding.push({
						provider: b.provider.getId(),
						field: b.field,
						type: b.type
					});
				}
				snapshot.fields.push(fDesc);
			}
			
			// prepare slices
			for(var sId in this.slices){
				var sDesc = {
					id: this.slices[sId].getId(),
					name: this.slices[sId].getName(),
					query: this.slices[sId].getQuery(),
					position: this.slicePositions[sId]
				}
				snapshot.slices.push(sDesc);
			}
			
			this.workspace.writeArtifactAsJson(this.getLocalId() + '.cube', snapshot);
			JSB.getLocker().unlock(mtxName);
		},
		
		updateCubeNodePosition: function(pt){
			this.nodePosition = pt;
			this.store();
		},
		
		addDataProvider: function(providerEntry){
			var providerDesc = DataProviderRepository.queryDataProviderInfo(providerEntry);
			var providerJsb = JSB.get(providerDesc.pType);
			if(!providerJsb){
				throw new Error('Unable to find provider bean: ' + providerDesc.pType);
			}
			var ProviderCls = providerJsb.getClass();
			var pId = this.getId() + '|dp_' + JSB.generateUid();
			var provider = new ProviderCls(pId, providerEntry, this, providerDesc.opts);
			this.dataProviders[pId] = provider;
			this.dataProviderEntries[pId] = providerEntry;
			this.sourceCount = Object.keys(this.dataProviders).length;
			this.store();
			this.doSync();
			return provider;
		},
		
		getProviderById: function(pId){
			if(!this.dataProviders[pId]){
				throw new Error('Unable to find data provider by id: ' + pId);
			}
			return this.dataProviders[pId];
		},
		
		extractDataProviderFields: function(pId){
			var provider = this.getProviderById(pId);
			if(this.dataProviderFields[provider.getId()]){
				return this.dataProviderFields[provider.getId()];
			}
			var dpFields = provider.extractFields();
			this.dataProviderFields[provider.getId()] = dpFields;
			this.store();
			this.doSync();
			return dpFields;
		},
		
		updateDataProviderNodePosition: function(pId, pt){
			var provider = this.getProviderById(pId);
			this.dataProviderPositions[provider.getId()] = pt;
			this.store();
		},
		
		addField: function(pId, pField, pType){
			var provider = this.getProviderById(pId);
			var nameCandidate = pField;
			if(this.fields[nameCandidate]){
				// lookup appropriate name
				for(var cnt = 2; ; cnt++){
					nameCandidate = pField + cnt;
					if(!this.fields[nameCandidate]){
						break;
					}
				}
			}
			var order = Object.keys(this.fields).length;
			this.fields[nameCandidate] = {
				field: nameCandidate,
				type: pType,
				binding: [],
				link: false,
				order: order
			};
			this.fields[nameCandidate].binding.push({
				provider: provider,
				field: pField,
				type: pType
			});
			this.fieldCount = Object.keys(this.fields).length;
			this.store();
			this.doSync();
			return this.fields[nameCandidate];
		},
		
		linkField: function(field, pId, pField, pType){
			if(!this.fields[field]){
				throw new Error('Field not existed: ' + field);
			}
			var provider = this.getProviderById(pId);
			// check if binding already existed
			for(var i = 0; i < this.fields[field].binding.length; i++){
				if(this.fields[field].binding[i].field == pField && this.fields[field].binding[i].provider == provider){
					return this.fields[field];
				}
			}
			
			this.fields[field].binding.push({
				provider: provider,
				field: pField,
				type: pType
			});
			this.fields[field].link = this.fields[field].binding.length > 0;
			this.store();
			this.doSync();
			return this.fields[field];
		},

		renameField: function(oldName, newName){
			if(!this.fields[oldName]){
				throw new Error('Field not existed: ' + oldName);
			}
			if(oldName == newName){
				return this.fields[oldName];	
			}
			var n = newName.trim();
			if(n.length == 0){
				return false;
			}
			if(/\s/.test(n)){
				return false;
			}
			if(/$\d/.test(n)){
				return false;
			}
			if(this.fields[n]){
				return false;
			}
			this.fields[n] = this.fields[oldName];
			delete this.fields[oldName];
			this.fields[n].field = n;
			this.store();
			this.doSync();
			return this.fields[n];
		},
		
		removeField: function(field){
			if(!this.fields[field]){
				return false;
			}
			var order = this.fields[field].order;
			delete this.fields[field];
			
			// fix ordering
			for(var fName in this.fields){
				if(this.fields[fName].order >= order){
					this.fields[fName].order--;
				}
			}
			
			this.fieldCount = Object.keys(this.fields).length;
			this.store();
			this.doSync();
			return true;
		},
		
		addSlice: function(){
			// generate slice name map
			var snMap = {};
			for(var sId in this.slices){
				snMap[this.slices[sId].getName()] = true;
			}
			var sName = null;
			for(var cnt = 1; ; cnt++){
				sName = 'Срез ' + cnt;
				if(!snMap[sName]){
					break;
				}
			}
			var sId = this.getId() + '|slice_' + JSB.generateUid();
			var slice = new Slice(sId, this, sName);
			this.slices[sId] = slice;
			this.sliceCount = Object.keys(this.slices).length;
			this.store();
			this.doSync();
			return slice;
		},
		
		getSliceById: function(sId){
			if(!this.slices[sId]){
				throw new Error('Unable to find slice with id: ' + sId);
			}
			return this.slices[sId];
		},
		
		renameSlice: function(sId, newName){
			var slice = this.getSliceById(sId);
			if(slice.getName() == newName){
				return slice;
			}
			for(var ssId in this.slices){
				if(this.slices[ssId].getName() == newName){
					return false;
				}
			}
			slice.name = newName;
			return slice;
		},
		
		updateSliceSettings: function(sId, desc){
			var slice = this.getSliceById(sId);
			this.renameSlice(sId, desc.name);
			if(desc.query){
				slice.setQuery(desc.query);
			}
			this.store();
			this.doSync();
		},
		
		updateSliceNodePosition: function(sId, pt){
			var slice = this.getSliceById(sId);
			this.slicePositions[slice.getId()] = pt;
			this.store();
		},

	}
}