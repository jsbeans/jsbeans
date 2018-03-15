{
	$name: 'JSB.Workspace.Workspace',
	$parent: 'JSB.Workspace.Entry',
	
	$fixedId: true,
	$sync: {
		updateCheckInterval: 0
	},
	
	_entryCount: 0,
	
	$server: {
		$require: ['JSB.Workspace.WorkspaceController'],
		$disableRpcInstance: true,
		
		config: null,
		wDesc: null,
		_entries: {},
		_changedEntries: {},
		
		$constructor: function(id, cfg, wDesc){
            this.config = cfg;
            this.wDesc = wDesc;
            
            // create entry store
            var entryStoreCfg = this.config.entryStore;
            if(!entryStoreCfg || !entryStoreCfg.jsb){
				throw new Error('Invalid entry store configuration for workspace id: ' + id);
			}
			var entryStoreJSB = JSB.get(entryStoreCfg.jsb);
			if(!entryStoreJSB){
				throw new Error('Unable to create entry store due to missing bean: ' + entryStoreCfg.jsb);
			}
			this._entryStore = new (entryStoreJSB.getClass())(entryStoreCfg);
			
			// create artifact store
            var artifactStoreCfg = this.config.artifactStore;
            if(!artifactStoreCfg || !artifactStoreCfg.jsb){
				throw new Error('Invalid artifact store configuration for workspace id: ' + id);
			}
			var artifactStoreJSB = JSB.get(artifactStoreCfg.jsb);
			if(!artifactStoreJSB){
				throw new Error('Unable to create entry store due to missing bean: ' + artifactStoreCfg.jsb);
			}
			this._artifactStore = new (artifactStoreJSB.getClass())(artifactStoreCfg);
			
            $base(id, this);
		},
		
		getWorkspaceType: function(){
			return this.property('_wt');
		},
		
		loadEntry: function(){
			$base();
			
			// fill entry indices
			var jsbArr = this.getEntryDoc()._jsbs;
			var eIdx = this.getEntryDoc()._entries;
			
			var eMtxName = 'JSB.Workspace.Workspace.entries.' + this.getId();
			JSB.getLocker().lock(eMtxName);
			try {
				for(var eId in eIdx){
					var seDesc = eIdx[eId];
					var eDesc = {
						eId: eId,
						eType: jsbArr[seDesc._j],
						eName: seDesc._n,
						eOpts: JSB.isDefined(seDesc._e) ? seDesc._e : null,
						aOpts: JSB.isDefined(seDesc._a) ? seDesc._a : null
					};
					this._entries[eId] = eDesc;
				}
				this._entryCount = Object.keys(this._entries).length;
			} finally {
				JSB.getLocker().unlock(eMtxName);
			}
		},
		
		_markEntryStored: function(entry, bStored){
			if(entry == this){
				return;
			}
			var chMtxName = 'JSB.Workspace.Workspace.changedEntries.' + this.getId();
			if(!bStored){
				if(this._entries[entry.getId()]){
					JSB.getLocker().lock(chMtxName);
					this._changedEntries[entry.getId()] = true;
					JSB.getLocker().unlock(chMtxName);
				}
			} else {
				if(this._changedEntries[entry.getId()]){
					JSB.getLocker().lock(chMtxName);
					delete this._changedEntries[entry.getId()];
					JSB.getLocker().unlock(chMtxName);
				}
				
				// check storeOpts changed
				var eDesc = this._ensureEntryDesc(entry);
				if(!JSB.isEqual(entry._entryStoreOpts, eDesc.eOpts)){
					eDesc.eOpts = entry._entryStoreOpts;
					this._markStored(false);
				}
				if(!JSB.isEqual(entry._artifactStoreOpts, eDesc.aOpts)){
					eDesc.aOpts = entry._artifactStoreOpts;
					this._markStored(false);
				}
			}
		},
		
		_changeEntryName: function(entry){
			if(entry == this){
				return;
			}
			var eDesc = this._ensureEntryDesc(entry);
			eDesc.eName = entry.getName();
			this._markStored(false);
		},
		
		_ensureEntryDesc: function(entry){
			var eDesc = this._entries[entry.getId()];
			if(!eDesc){
				var eMtxName = 'JSB.Workspace.Workspace.entries.' + this.getId();
				JSB.getLocker().lock(eMtxName);
				try {
					eDesc = this._entries[entry.getId()];
					if(!eDesc){
						// its a just created entry
						entry._entryStore.reserve(entry);
						eDesc = this._entries[entry.getId()] = {
							eId: entry.getId(),
							eType: entry.getJsb().$name,
							eName: entry.getName(),
							eInst: null,
							eOpts: entry._entryStoreOpts,
							aOpts: entry._artifactStoreOpts
						};
						this.addChildEntry(entry);
						entry._markStored(false);
						this._markStored(false);
					
						this._entryCount = Object.keys(this._entries).length;
					}
				} finally {
					JSB.getLocker().unlock(eMtxName);
				}
			}
			eDesc.eInst = entry;
			return eDesc;
		},
		
		_attachEntry: function(entry){
			if(entry == this){
				return;	// not need attach workspace to itself 
			}
			entry._entryStore = this._entryStore;
			entry._artifactStore = this._artifactStore;
			
			var eDesc = this._ensureEntryDesc(entry);
			
			entry._entryStoreOpts = eDesc.eOpts;
			entry._artifactStoreOpts = eDesc.aOpts;
		},
		
		_detachEntry: function(entry){
			if(entry == this){
				return;	// not need detach workspace from itself 
			}
			if(!this._entries[entry.getId()]){
				return;
			}
			this.removeChildEntry(entry);
			
			var eMtxName = 'JSB.Workspace.Workspace.entries.' + this.getId();
			JSB.getLocker().lock(eMtxName);
			delete this._entries[entry.getId()];
			JSB.getLocker().unlock(eMtxName);
			
			if(this._changedEntries[entry.getId()]){
				var chMtxName = 'JSB.Workspace.Workspace.changedEntries.' + this.getId();
				JSB.getLocker().lock(chMtxName);
				delete this._changedEntries[entry.getId()];
				this._entryCount = Object.keys(this._entries).length;
				JSB.getLocker().unlock(chMtxName);
			}
			
			this._markStored(false);
		},
		
		store: function(){
			var mtxName = 'JSB.Workspace.Workspace.store.' + this.getId();
			JSB.getLocker().lock(mtxName);
			try {
				// store changed entries
				if(Object.keys(this._changedEntries).length > 0){
					var chMtxName = 'JSB.Workspace.Workspace.changedEntries.' + this.getId();
					
					JSB.getLocker().lock(chMtxName);
					var changedEntries = JSB.clone(this._changedEntries);
					JSB.getLocker().unlock(chMtxName);
					
					for(var eId in changedEntries){
						this.entry(eId).storeEntry();
					}
				}
				
				if(!this._stored){
					// serialize entry indices
					var eIdx = {};
					var jsbDict = {};
					var jsbArr = [];
					var eMtxName = 'JSB.Workspace.Workspace.entries.' + this.getId();
					JSB.getLocker().lock(eMtxName);
					for(var eId in this._entries){
						var jsbIdx = jsbDict[this._entries[eId].eType];
						if(!JSB.isDefined(jsbIdx)){
							jsbIdx = jsbDict[this._entries[eId].eType] = jsbArr.length;
							jsbArr.push(this._entries[eId].eType);
						}
						eIdx[eId] = {
							_j: jsbIdx,
							_n: this._entries[eId].eName
						}
						if(!JSB.isNull(this._entries[eId].eOpts)){
							eIdx[eId]._e = this._entries[eId].eOpts;
						}
						if(!JSB.isNull(this._entries[eId].aOpts)){
							eIdx[eId]._a = this._entries[eId].aOpts;
						}
					}
					JSB.getLocker().unlock(eMtxName);
					this.getEntryDoc()._jsbs = jsbArr;
					this.getEntryDoc()._entries = eIdx;
					
					// store entry file
					this.storeEntry();
				}
			} finally {
				JSB.getLocker().unlock(mtxName);
			}
		},
		
		entries: function(){
		    var ids = Object.keys(this._entries);
		    var cursor = 0;
            return {
                next: function() {
                	if(cursor >= ids.length){
                		return;
                	}
                	var curId = ids[cursor++];
                	if(curId){
                		return $this.entry(curId);
                	}
                },
                hasNext: function(){
                	return ids && ids.length > 0 && cursor < ids.length;
                },
                count: function(){
                	return ids && ids.length || 0;
                }
            };
		},
		
		getEntries: function(){
			var eMap = {};
			for(var eId in this._entries){
				eMap[eId] = this.entry(eId);
			}
			return eMap;
		},
		
		existsEntry: function(id){
			return !!this._entries[id];
		},
		
		removeEntry: function(id){
			if(this.existsEntry(id)){
				this.entry(id).remove();
				return true;
			}
			return false;
		},

		entry: function(id){
			if(this.getId() == id){
				return this;
			}
			var eDesc = this._entries[id];
			if(!eDesc){
				throw new Error('Failed to find workspace entry with id: ' + id);
			}
			if(eDesc.eInst){
				return eDesc.eInst;
			}
			var eJsb = JSB.get(eDesc.eType);
			if(!eJsb){
				throw new Error('Failed to create workspace entry with id: "' + id + '" due to missing it\'s bean: ' + eDesc.eType);
			}
			var eInst = new (eJsb.getClass())(id, this);
			eDesc.eInst = eInst;
			
			return eInst;
		},

		remove: function(){
			// remove artifacts
			var aMap = this.getArtifacts();
			for(var aName in aMap){
				this.removeArtifact(aName);
			}
			
			// remove entry
			this._entryStore.remove(this);
			
			WorkspaceController.removeWorkspace(this.getId());
		},
		
		uploadFile: function(fileDesc){
			debugger;
			var category = fileDesc.category;
			var fileName = fileDesc.name;
			var fileData = fileDesc.content;
			var entryType = WorkspaceController.queryFileUploadEntryType(this.getWorkspaceType(), fileName, fileData);
			var entryJsb = $jsb.get(entryType);
			if(!entryJsb){
				throw new Error('Unable to find entry bean: ' + entryType);
			}
			var EntryCls = entryJsb.getClass();
			var entry = new EntryCls($jsb.generateUid(), this, {
				fileName: fileName,
				fileData: fileData
			});
			entry.category(category);
			this.store();
			return {
				type: 'entry',
				entry: entry,
				name: entry.getName()
			};
		}
	}
}