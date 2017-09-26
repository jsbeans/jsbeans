{
	$name: 'DataCube.Model.Cube',
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
		           'DataCube.Providers.DataProviderRepository',
		           'DataCube.Model.Slice',
		           'DataCube.Query.QueryEngine',
		           'DataCube.MaterializationEngine',
		           'JSB.Crypt.MD5'],
		
		$bootstrap: function(){
			WorkspaceController.registerExplorerNode('datacube', this, 0.5, 'DataCube.CubeNode');
		},
		
		loaded: false,
		dataProviders: {},
		dataProviderEntries: {},
		dataProviderFields: {},
		dataProviderPositions: {},
		fieldOrder: [],
		fields: {},
		slices: {},
		slicePositions: {},
		materialization: {},
		materializing: false,
		nodePosition: null,

		$constructor: function(id, workspace, opts){
			$base(id, workspace);
			if(this.property('sources')){
				this.sourceCount = this.property('sources');
			}
			if(this.property('fields')){
				this.fieldCount = this.property('fields');
			}
			if(this.property('slices')){
				this.sliceCount = this.property('slices');
			}
		},
		
		destroy: function(){
			if(this.workspace.existsArtifact(this.getLocalId() + '.cube')){
				this.workspace.removeArtifact(this.getLocalId() + '.cube');
			}
			$base();
		},
		
		load: function(bRespond){
			if(!this.loaded){
			    this.queryEngine = new QueryEngine(this);

				if(this.workspace.existsArtifact(this.getLocalId() + '.cube')){
					var snapshot = this.workspace.readArtifactAsJson(this.getLocalId() + '.cube');
					
					this.nodePosition = snapshot.position;
					
					// construct data providers
					for(var i = 0; i < snapshot.providers.length; i++){
						var pDesc = snapshot.providers[i];
						var pEntry = null;
						if(!this.workspace.existsEntry(pDesc.entry)){
							JSB.getLogger().warn('Unable to construct data provider "'+pDesc.jsb+'" due to missing source entry: ' + pDesc.entry);
							continue;
						} else {
							pEntry = this.workspace.entry(pDesc.entry);
						}
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
					
					// construct materialization
					if(snapshot.materialization && Object.keys(snapshot.materialization).length > 0){
						try {
							var materialization = {
								table: snapshot.materialization.table,
								lastUpdate: snapshot.materialization.lastUpdate,
								dataProviderEntry: this.workspace.entry(snapshot.materialization.provider.entry),
								fields: {},
								indexes: snapshot.materialization.indexes || {}
							};
							if(!materialization.dataProviderEntry){
								throw new Error('Missing materialized source for cube: ' + $this.getName());
							}
							var pJsb = JSB.get(snapshot.materialization.provider.jsb);
							if(!pJsb){
								throw new Error('Unable to construct data provider "'+snapshot.materialization.provider.jsb+'" due to missing its bean');
							}
							var ProviderClass = pJsb.getClass();
							var providerDesc = DataProviderRepository.queryDataProviderInfo(materialization.dataProviderEntry);
							materialization.dataProvider = new ProviderClass(snapshot.materialization.provider.id, materialization.dataProviderEntry, this, providerDesc.opts);
							for(var i = 0; i < snapshot.materialization.fields.length; i++){
								var fDesc = snapshot.materialization.fields[i];
								materialization.fields[fDesc.field] = {
									field: fDesc.field,
									type: fDesc.type,
									binding: []
								}
								for(var j = 0; j < fDesc.binding.length; j++){
									materialization.fields[fDesc.field].binding.push({
										provider: materialization.dataProvider,
										field: fDesc.binding[j].field,
										type: fDesc.binding[j].type
									});
								}
							}
							
							this.materialization = materialization;
						} catch(e){
							JSB.getLogger().error(e);
						}
					}
					
					// construct slices
					for(var i = 0; i < snapshot.slices.length; i++){
						var sDesc = snapshot.slices[i];
						var slice = this.workspace.entry(sDesc.id);
						if(!JSB.isInstanceOf(slice, 'DataCube.Model.Slice')){
							continue;
						}
						slice.setQuery(sDesc.query);
						slice.setQueryParams(sDesc.queryParams);
						this.slices[sDesc.id] = slice;
						this.slicePositions[sDesc.id] = sDesc.position;
					}
					
				}
				this.loaded = true;
				this.doSync();
			}
			
			if(!bRespond){
				return;
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
			
			// prepare materialization
			if(this.materialization && Object.keys(this.materialization).length > 0){
				snapshot.materialization = {
					table: this.materialization.table,
					lastUpdate: this.materialization.lastUpdate,
					provider: {
						id: this.materialization.dataProvider.getId(),
						jsb: this.materialization.dataProvider.getJsb().$name,
						entry: this.materialization.dataProviderEntry.getLocalId()
					},
					fields: [],
					indexes: this.materialization.indexes || {}
				};
				for(var fName in this.materialization.fields){
					var fDesc = {
						field: fName,
						type: this.materialization.fields[fName].type,
						binding: []
					};
					for(var i = 0; i < this.materialization.fields[fName].binding.length; i++){
						var bDesc = this.materialization.fields[fName].binding[i];
						fDesc.binding.push({
							field: bDesc.field,
							type: bDesc.type
						});
					}
					snapshot.materialization.fields.push(fDesc);
				}
			}
			
			// prepare slices
			for(var sId in this.slices){
				var sDesc = {
					id: sId,
					name: this.slices[sId].getName(),
					query: this.slices[sId].getQuery(),
					queryParams: this.slices[sId].getQueryParams(),
					position: this.slicePositions[sId]
				}
				snapshot.slices.push(sDesc);
			}
			
			this.workspace.writeArtifactAsJson(this.getLocalId() + '.cube', snapshot);
			
			this.fieldCount = Object.keys(this.fields).length;
			this.sourceCount = Object.keys(this.dataProviders).length;
			this.sliceCount = Object.keys(this.slices).length;
			
			this.property('sources', this.sourceCount);
			this.property('fields', this.fieldCount);
			this.property('slices', this.sliceCount);
			this.workspace.store();
			
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
			var pId = this.getLocalId() + '|dp_' + JSB.generateUid();
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

		getOrderedDataProviders: function(){
			if(this.materialization && this.materialization.dataProvider){
				return [this.materialization.dataProvider];
			}
		    function compareProviders(leftProvider, rightProvider){
		        for(var f in $this.fields){
                    var binding = $this.fields[f].binding;
                    if (binding.length > 1) {
                        var leftPosition = binding.length;
                        for(var b = 0; b < binding.length; b++) {
                            if (binding[b].provider == leftProvider) {
                                leftPosition = b;
                            }
                        }
                        var rightPosition = binding.length;
                        for(var b = 0; b < binding.length; b++) {
                            if (binding[b].provider == rightProvider) {
                                rightPosition = b;
                            }
                        }
                        if (leftPosition != binding.length && rightPosition != binding.length) {
                            return leftPosition - rightPosition;
                        }
                    }
                }
                return 0;
		    }

		    var providers = [];
		    for(var id in this.dataProviders) {
		        providers.push(this.dataProviders[id]);
		    }
		    providers.sort(compareProviders);
		    return providers;
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
		
		prepareFieldName: function(name){
			name = name.trim();
			if(name.length == 0){
				return name;
			}
			if(name[0] == '\"' || name[0] == '\''){
				name = name.substr(1, name.length - 1);
			}
			if(name[name.length - 1] == '\"' || name[name.length - 1] == '\''){
				name = name.substr(0, name.length - 1);
			}

			return name;
		},
		
		
		refreshDataProviderFields: function(pId){
			var provider = this.getProviderById(pId);
			var dpNewFields = provider.extractFields();
			var dpFields = this.dataProviderFields[provider.getId()];
			var bNeedStore = false;
			if(dpFields && Object.keys(dpFields).length > 0){
				 // perform update existed fields
				for(var fName in dpNewFields){
					var fType = dpNewFields[fName];
					var pfName = this.prepareFieldName(fName);
					if(dpFields[pfName]){
						// rename data provider field
						bNeedStore = true;
						this.renameDataProviderField(provider, pfName, fName, fType);
					}
				}
			}
			this.dataProviderFields[provider.getId()] = dpNewFields;
			if(this.removeUnexistedFields(provider)){
				bNeedStore = true;
			}
			
			var providerBindingMap = {};
			for(var fName in this.fields){
				var fDesc = this.fields[fName];
				var bindingArr = fDesc.binding;
				for(var i = 0; i < bindingArr.length; i++){
					var bDesc = bindingArr[i];
					if(bDesc.provider != provider){
						continue;
					}
					if(!providerBindingMap[bDesc.field]){
						providerBindingMap[bDesc.field] = [];
					}
					providerBindingMap[bDesc.field].push({
						field: fName,
						type: fDesc.type,
						link: fDesc.link,
						order: fDesc.order
					});
				}
			}
			
			if(bNeedStore){
				this.store();
				this.doSync();
			}
			
			return {fields: dpNewFields, binding: providerBindingMap};
		},
		
		renameDataProviderField: function(provider, oldName, newName, type){
			// iterate over all fields in cube
			for(var fName in this.fields){
				var fDesc = this.fields[fName];
				var bindingArr = fDesc.binding;
				for(var i = 0; i < bindingArr.length; i++){
					var bDesc = bindingArr[i];
					if(bDesc.provider != provider){
						continue;
					}
					if(bDesc.field == oldName){
						bDesc.field = newName;
						bDesc.type = type;
					}
				}
			}
		},
		
		removeUnexistedFields: function(provider){
			var bNeedStore = false;
			var dpFields = this.dataProviderFields[provider.getId()];
			var fieldsToRemove = [];
			for(var fName in this.fields){
				var fDesc = this.fields[fName];
				var bindingArr = fDesc.binding;
				for(var i = bindingArr.length - 1; i >= 0 ; i--){
					var bDesc = bindingArr[i];
					if(bDesc.provider != provider){
						continue;
					}
					
					if(!dpFields[bDesc.field]){
						bindingArr.splice(i, 1);
					}
				}
				if(bindingArr.length == 0){
					fieldsToRemove.push(fName);
					bNeedStore = true;
				}
			}
			for(var i = 0; i < fieldsToRemove.length; i++){
				if(this.fields[fieldsToRemove[i]]){
					delete this.fields[fieldsToRemove[i]];
				}
			}
			
			return bNeedStore;
		},
		
		updateDataProviderNodePosition: function(pId, pt){
			var provider = this.getProviderById(pId);
			this.dataProviderPositions[provider.getId()] = pt;
			this.store();
		},
		
		addField: function(pId, pField, pType){
			var provider = this.getProviderById(pId);
			var nameCandidate = this.prepareFieldName(pField);
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
			this.removeMaterialization();
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
			if(/$\d/.test(n)){
				return false;
			}
			if(this.fields[n]){
				return false;
			}
			
			// update fields
			this.fields[n] = this.fields[oldName];
			delete this.fields[oldName];
			this.fields[n].field = n;
			
			// update materialization
			if(this.materialization && this.materialization.fields && this.materialization.fields[oldName]){
				this.materialization.fields[n] = this.materialization.fields[oldName];
				delete this.materialization.fields[oldName];
				this.materialization.fields[n].field = n;
			}
			
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
			
			// remove materialization
			this.removeMaterialization();
			
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
			var sId = JSB.generateUid();
			var slice = new Slice(sId, this.workspace, this, sName);
			this.slices[sId] = slice;
			this.sliceCount = Object.keys(this.slices).length;
			this.addChildEntry(slice);
			this.store();
			this.doSync();
			return slice;
		},
		
		removeSlice: function(sId){
			var slice = this.slices[sId];
			if(!slice){
				return;
			}
			delete this.slices[sId];
			this.removeChildEntry(sId);
			slice.remove();
			this.sliceCount = Object.keys(this.slices).length;
			this.store();
			this.doSync();
		},
		
		getSliceById: function(sId){
			if(!this.slices[sId]){
				throw new Error('Unable to find slice with id: ' + sId);
			}
			return this.slices[sId];
		},
		
		getSlices: function(){
			this.load();
			return this.slices;
		},
		
		getFields: function(){
			this.load();
			return this.fields;
		},
		
		getManagedFields: function(){
			this.load();
			if(this.materialization && this.materialization.fields){
				return this.materialization.fields;
			}
			return this.getFields();
		},
		
		isMaterializing: function(){
			return this.materializing;
		},
		
		isMaterialized: function(){
			return (this.materialization && Object.keys(this.materialization).length > 0 ? true: false);
		},
		
		getMaterializationInfo: function(){
			return {
				materialization: this.materialization,
				materializing: this.materializing
			};
		},
		
		startMaterialization: function(database){
			if(!database){
				// chose database from currently existed materialization
				if(this.materialization && this.materialization.dataProviderEntry){
					database = this.materialization.dataProviderEntry.getParent();
				} else {
					return;
				}
			}
			this.materializing = true;
			this.materializer = MaterializationEngine.createMaterializer(database);
			
			// run materialization on deferred manner
			JSB.defer(function(){
				function checkStop(){
					if($this.stopMaterializing){
						$this.materializing = false;
						$this.stopMaterializing = false;
						$this.publish('DataCube.Model.Cube.status', {status: null, success: true}, {session: true});
						return true;
					}
					return false;
				}
				
				var materializationDesc = {
					table: null,
					indexes: {}
				};
				
				function destroyCurrentMaterialization(){
					if(materializationDesc.table){
						$this.materializer.removeTable(materializationDesc.table);
					}
					if(materializationDesc.dataProvider){
						materializationDesc.dataProvider.destroy();
					}
				}
				
				JSB.getLocker().lock('materialization_' + $this.getId());
				
				
				try {
					$this.publish('DataCube.Model.Cube.status', {status: 'Подготовка к материализации', success: true}, {session: true});
					var suggestedName = 'cube_' + $this.getLocalId();
					var fields = {};
					for(var fName in $this.fields){
						fields[$this.fields[fName].field] = $this.fields[fName].type;
					}
					
					
					// create table
					var tableDesc = $this.materializer.createTable(suggestedName, fields);
					materializationDesc.table = tableDesc.table;
					
					// transmit data
					var iterator = $this.queryEngine.query({$select: {}}, {});
					var batch = [];
					var lastStatusTimestamp = 0;
					for(var i = 0; ; i++){
						var el = null;
						try {
							el = iterator.next();
						}catch(e){
							el = null;
						}
						if(!el){
							break;
						}
						
						if(!JSB.isObject(el)){
							continue;
						}

						// translate data into new fields
						var nEl = {};
						for(var f in el){
							if(!fields[f]){
								continue;
							}
							nEl[tableDesc.fieldMap[f]] = el[f];
						}
						
						batch.push(nEl);
						
						if(batch.length >= 100){
							$this.materializer.insert(materializationDesc.table, batch);
							batch = [];
							
							var curTimestamp = Date.now();
							if(curTimestamp - lastStatusTimestamp > 3000){
								lastStatusTimestamp = curTimestamp;
								if(checkStop()){
									destroyCurrentMaterialization();
									return;
								}
								$this.publish('DataCube.Model.Cube.status', {status: 'Сохранено записей: ' + (i + 1), success: true}, {session: true});
							}

						}
					}
					
					if(batch.length > 0){
						$this.materializer.insert(materializationDesc.table, batch);
					}
					
					if(checkStop()){
						destroyCurrentMaterialization();
						return;
					}
					
					// rename table if required
					if(materializationDesc.table != suggestedName){
						$this.materializer.removeTable(suggestedName);
						$this.materializer.renameTable(materializationDesc.table, suggestedName);
						materializationDesc.table = suggestedName;
					}
					
					// prepare materialization object
					$this.publish('DataCube.Model.Cube.status', {status: 'Обновление схемы базы материализации', success: true}, {session: true});
					database.extractScheme();
					var chEntries = database.getChildren();
					var source = null;
					for(var chId in chEntries){
						var tableSource = chEntries[chId];
						var tDesc = tableSource.getDescriptor();
						if(tDesc.name == materializationDesc.table){
							source = tableSource;
							break;
						}
					}
					
					if(!source){
						throw new Error('Internal error: unable to find materialization table');
					}
					$this.publish('DataCube.Model.Cube.status', {status: 'Завершение материализации', success: true}, {session: true});
					var providerDesc = DataProviderRepository.queryDataProviderInfo(source);
					var providerJsb = JSB.get(providerDesc.pType);
					if(!providerJsb){
						throw new Error('Unable to find provider bean: ' + providerDesc.pType);
					}
					var ProviderCls = providerJsb.getClass();
					var pId = $this.getLocalId() + '|dp_' + JSB.generateUid();
					materializationDesc.dataProvider = new ProviderCls(pId, source, $this, providerDesc.opts);
					materializationDesc.dataProviderEntry = source;
					materializationDesc.fields = {};
					var providerFields = materializationDesc.dataProvider.extractFields();
					for(var fName in $this.fields){
						var fDesc = materializationDesc.fields[fName] = {
							field: fName,
							type: $this.fields[fName].type,
							binding: []
						};
						var pName = tableDesc.fieldMap[fName];
						if(providerFields[pName]){
							fDesc.binding = [{
								provider: materializationDesc.dataProvider,
								field: pName,
								type: providerFields[pName]
							}];
							continue;
						} else {
							throw new Error('Internal error: failed to find field: "' + fName + '" in materialized table');
						}
					}
					$this.updateIndexes(materializationDesc);
					materializationDesc.lastUpdate = Date.now();
					var oldMaterialization = $this.materialization;
					$this.materialization = materializationDesc;
					
					if(oldMaterialization && oldMaterialization.dataProvider){
						oldMaterialization.dataProvider.destroy();
					}
					$this.materializing = false;
					$this.publish('DataCube.Model.Cube.status', {status: null, success: true}, {session: true});
					
				} catch(e){
					if(materializationDesc.table){
						try {
							$this.materializer.removeTable(materializationDesc.table);	
						}catch(e){}
					}
					$this.materializing = false;
					$this.publish('DataCube.Model.Cube.status', {status: e.message, success: false}, {session: true});
					throw e;
				} finally {
					$this.materializer.destroy();
					$this.materializer = null;
					JSB.getLocker().unlock('materialization_' + $this.getId());
				}
				
				$this.store();
				$this.doSync();
			});
			
		},
		
		stopMaterialization: function(){
			$this.stopMaterializing = true;
		},
		
		removeMaterialization: function(){
			var bLocked = false;
			if(!this.materialization || Object.keys(this.materialization).length == 0){
				return;
			}
			$this.publish('DataCube.Model.Cube.status', {status: 'Удаление материализации', success: true}, {session: true});
			JSB.getLocker().lock('materialization_' + $this.getId());
			var materialization = $this.materialization;
			$this.materialization = {};
			var materializer = null;
			try {
				if(materialization && materialization.dataProvider){
					materialization.dataProvider.destroy();
				}
				
				if(materialization && materialization.dataProviderEntry){
					var sourceEntry = materialization.dataProviderEntry;
					
					// remove table
					if(materialization.table){
						var database = sourceEntry.getParent();
						materializer = MaterializationEngine.createMaterializer(database);
						materializer.removeTable(materialization.table);
					}
					sourceEntry.remove();
				} 
				
			} finally {
				if(materializer){
					materializer.destroy();
				}
				$this.publish('DataCube.Model.Cube.status', {status: null, success: true}, {session: true});
				JSB.getLocker().unlock('materialization_' + $this.getId());	
				$this.store();
				$this.doSync();
			}
		},
		
		updateIndexes: function(materialization){
			var bLocked = false;
			var bCreatedMaterializer = false;
			var bChanged = false;
			
			if(!materialization){
				JSB.getLocker().lock('materialization_' + $this.getId());
				bLocked = true;
				materialization = this.materialization;
				$this.materializing = true;
			}
			
			var matFields = materialization.fields;

			function extractIndexesForSlice(slice){
				var q = slice.getQuery();
				
				function parseObject(obj){
					var indexMap = {};
					if(!JSB.isObject(obj)){
						return null;
					}
					
					for(var fObj in obj){
						if(fObj == '$groupBy'){
							// parse groupBy
							var groupByObj = obj[fObj];
							if(!JSB.isArray(groupByObj)){
								groupByObj = [groupByObj];
							}
							var fStr = '';
							var indexDesc = {};
							for(var i = 0; i < groupByObj.length; i++){
								var f = groupByObj[i];
								if(!matFields[f]){
									continue;
								}
								if(fStr.length > 0){
									fStr += '|';
								}
								fStr += f;
								indexDesc[f] = true;
							}
							var idxName = 'idx_' + MD5.md5(fStr);
							indexMap[idxName] = indexDesc;
						} else if(fObj == '$filter') {
							// parse filter
							if(!JSB.isObject(obj[fObj])){
								continue;
							}
							var fStr = '';
							var indexDesc = {};
							for(var f in obj[fObj]){
								if(!matFields[f]){
									continue;
								}
								if(fStr.length > 0){
									fStr += '|';
								}
								fStr += f;
								indexDesc[f] = true;
							}
							var idxName = 'idx_' + MD5.md5(fStr);
							indexMap[idxName] = indexDesc;
						} else if(JSB.isObject(obj[fObj]) && Object.keys(obj[fObj]).length > 0){
							var sMap = parseObject(obj[fObj]);
							if(sMap && Object.keys(sMap).length > 0){
								JSB.merge(indexMap, sMap);
							}
						} else if(JSB.isArray(obj[fObj])){
							for(var i = 0; i < obj[fObj].length; i++){
								var sMap = parseObject(obj[fObj][i]);
								if(sMap && Object.keys(sMap).length > 0){
									JSB.merge(indexMap, sMap);
								}
							}
						}
					}

					return indexMap;
				}
				
				return parseObject(q);
			}
			
			try {
				var materializer = this.materializer;
				if(!materializer){
					var database = materialization.dataProviderEntry.getParent();
					materializer = MaterializationEngine.createMaterializer(database);
					bCreatedMaterializer = true;
				}

				$this.publish('DataCube.Model.Cube.status', {status: 'Обновление индексов материализации', success: true}, {session: true});
				// iterate over slices
				var cubeIdxMap = {};
				for(var sId in this.slices){
					var slice = this.slices[sId];
					var indexes = extractIndexesForSlice(slice);
					if(indexes && Object.keys(indexes).length > 0){
						JSB.merge(cubeIdxMap, indexes);
					}
				}
				// adding new indexes
				var indexCount = Object.keys(cubeIdxMap).length;
				var curIndexPos = 0;
				var lastPcnt = -1;
				for(var idxName in cubeIdxMap){
					if(materialization.indexes && materialization.indexes[idxName]){
						continue;
					}
					// translate index fields
					var idxDesc = {};
					for(var fName in cubeIdxMap[idxName]){
						if(materialization.fields[fName] && materialization.fields[fName].binding && materialization.fields[fName].binding.length > 0){
							var pField = materialization.fields[fName].binding[0].field;
							idxDesc[pField] = cubeIdxMap[idxName][fName];
						}
					}
					
					if(Object.keys(idxDesc).length > 0){
						try {
							materializer.createIndex(materialization.table, idxName, idxDesc);
							if(!materialization.indexes){
								materialization.indexes = {};
							}
							materialization.indexes[idxName] = cubeIdxMap[idxName];
							bChanged = true;
						} catch(e){
							JSB.getLogger().warn('Failed to create index ' + idxName + ' for ' + JSON.stringify(idxDesc));
						}
					}
					curIndexPos++;
					var pcnt = Math.floor(curIndexPos * 100 / indexCount);
					if(lastPcnt != pcnt){
						$this.publish('DataCube.Model.Cube.status', {status: 'Создание новых индексов: ' + pcnt + '%', success: true}, {session: true});
						lastPcnt = pcnt;
					}
					
				}
				
				// remove missing indexes
				$this.publish('DataCube.Model.Cube.status', {status: 'Удаление старых индексов', success: true}, {session: true});
				var idxToRemove = [];
				if(materialization.indexes){
					for(var idxName in materialization.indexes){
						if(!cubeIdxMap[idxName]){
							idxToRemove.push(idxName);
						}
					}
				}
				for(var i = 0; i < idxToRemove.length; i++){
					var idxName = idxToRemove[i];
					try {
						materializer.removeIndex(materialization.table, idxName);
						delete materialization.indexes[idxName];
						bChanged = true;
					}catch(e){
						JSB.getLogger().warn('Failed to remove index ' + idxName + ' with ' + JSON.stringify(materialization.indexes[idxName]));
					}
				}
			} finally {
				if(bCreatedMaterializer){
					materializer.destroy();
				}
				if(bLocked){
					$this.materializing = false;
					JSB.getLocker().unlock('materialization_' + $this.getId());
					if(bChanged){
						$this.store();
						$this.doSync();
					}
					$this.publish('DataCube.Model.Cube.status', {status: null, success: true}, {session: true});
				}
			}
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
			slice.setName(newName);
			return slice;
		},
		
		updateSliceSettings: function(sId, desc){
			var slice = this.getSliceById(sId);
			this.renameSlice(sId, desc.name);
			if(desc.query){
				slice.setQuery(desc.query);
			}
			if(desc.queryParams){
			    slice.setQueryParams(desc.queryParams);
			}
			this.store();
			this.doSync();
		},
		
		updateSliceNodePosition: function(sId, pt){
			var slice = this.getSliceById(sId);
			this.slicePositions[sId] = pt;
			this.store();
		},

		parametrizeQuery: function(query){
			var newQuery = JSB.clone(query);
			var params = {};
			var filterOps = {
				'$eq': true,
				'$lt': true,
				'$lte': true,
				'$gt': true, 
				'$gte': true,
				'$ne': true,
				'$like': true,
				'$ilike': true,
				'$in': true,
				'$nin': true
			};
			
			if(newQuery && Object.keys(newQuery).length > 0){
	        	// translate $filter
	        	if(newQuery.$filter || newQuery.$postFilter){
	        		var c = {i: 1};
	        		function getNextParam(){
	        			return 'p' + (c.i++);
	        		}
	        		function prepareFilter(scope){
	        			for(var f in scope){
	        				if(filterOps[f]){
	        					var pName = getNextParam();
	        					params[pName] = scope[f];
	        					scope[f] = '${'+pName+'}';
	        				} else if(f == '$and' || f == '$or'){
	        					var arr = scope[f];
	        					for(var i = 0; i < arr.length; i++){
	        						prepareFilter(arr[i]);
	        					}
	        				} else {
	        					prepareFilter(scope[f]);
	        				}
	        			}
	        		}
	        		if(newQuery.$filter){
	        			prepareFilter(newQuery.$filter);
	        		}
	        		if(newQuery.$postFilter){
	        			prepareFilter(newQuery.$postFilter);
	        		}
	        	}
            }
			
			return {
				query: newQuery,
				params: params
			}
		},
		
		executeQuery: function(query, params, provider){
			this.load();
			return this.queryEngine.query(query, params, provider);
		}
	}
}