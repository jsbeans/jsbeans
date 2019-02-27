{
	$name: 'JSB.Workspace.Workspace',
	$parent: 'JSB.Workspace.Entry',
	
	$fixedId: true,
	$sync: {
		updateCheckInterval: 0
	},
	
	_entryCount: 0,
	_wt: null,
	
	getWorkspaceType: function(){
		return this._wt;
	},
	
	$client: {
		blockWithException: function(e){
			this.publish('JSB.Workspace.Workspace.blocked', e);
		},
	},
	
	$server: {
		$require: ['JSB.Workspace.WorkspaceController'],
		$disableRpcInstance: true,
		
		config: null,
		wDesc: null,
		storeQueued: false,
		_blocked: false,
		_blockedException: null,
		_entries: {},
		_changedEntries: {},
		_hasRead: false,
		
		$constructor: function(id, cfg, wDesc){
            this.config = cfg;
            this.wDesc = wDesc;
            this._owner = wDesc.wOwner;
            
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
            
            // auto create entries
            var autoCreateEntries = $this.config.autoCreate;
            for(var eId in autoCreateEntries){
            	if($this.existsEntry(eId)){
            		continue;
            	}
            	var eDesc = autoCreateEntries[eId];
            	var eMtxName = 'JSB.Workspace.Workspace.eInst.' + eId;
    			JSB.getLocker().lock(eMtxName);
    			try {
    				var eJsb = JSB.get(eDesc.jsb);
    				if(!eJsb){
    					throw new Error('Failed to create workspace entry with id: "' + eId + '" due to missing it\'s bean: ' + eDesc.jsb);
    				}
    				var eClass = eJsb.getClass();
    				var args = eDesc.args;
    				if(!args || args.length == 0){
    					new eClass(eId, $this);	
    				} else if(args.length == 1){
    					new eClass(eId, $this, args[0]);	
    				} else if(args.length == 2){
    					new eClass(eId, $this, args[0], args[1]);	
    				} else if(args.length == 3){
    					new eClass(eId, $this, args[0], args[1], args[2]);	
    				} else if(args.length == 4){
    					new eClass(eId, $this, args[0], args[1], args[2], args[3]);	
    				}
    				
    			} finally {
    				JSB.getLocker().unlock(eMtxName);
    			}
            }
		},
		
		blockWithException: function(e){
			this._blocked = true;
			this._blockedException = e;
			this.client().blockWithException(e);
		},
		
		unblock: function(){
			this._blocked = false;
			this._blockedException = null;
		},
		
		checkBlocked: function(){
			if(this._blocked && this._blockedException){
				throw this._blockedException;
			}
		},
		
		setWorkspaceType: function(t){
			this.checkBlocked();
			if(this._wt == t){
				return;
			}
			this._wt = t;
			this._markStored(false);
		},
		
		loadEntry: function(){
			this.checkBlocked();
			$base();
			
			// fill entry indices
			var doc = this.getEntryDoc();
			var jsbArr = doc._jsbs;
			var eIdx = doc._entries;
			this._wt = doc._wt;
			
			var eMtxName = 'JSB.Workspace.Workspace.entries.' + this.getId();
			JSB.getLocker().lock(eMtxName);
			try {
				for(var eId in eIdx){
					var seDesc = eIdx[eId];
					var eType = null;
					if(jsbArr && JSB.isNumber(seDesc._j)){
						eType = jsbArr[seDesc._j];
					} else {
						eType = seDesc._j;
					}
					var eDesc = {
						eId: eId,
						eType: eType,
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
		
		_markEntryStored: function(entry){
			if(!entry || entry == this){
				return;
			}
			var bStored = entry._stored;
			var chMtxName = 'JSB.Workspace.Workspace.changedEntries.' + this.getId();
			if(!bStored){
				if(this._entries[entry.getId()] && !this._changedEntries[entry.getId()]){
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
		
		_updateEntryName: function(entry){
			if(entry == this){
				return;
			}
			var eDesc = this._ensureEntryDesc(entry);
			var n = entry.getName();
			if(n && eDesc.eName != n){
				eDesc.eName = n;
				this._markStored(false);
			}
		},
		
		_ensureEntryDesc: function(entry, writeEntry){
			if(entry == this){
				return;	// not need ensure itself 
			}
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
						this._markEntryStored(entry);
						
						this.addChildEntry(entry);
						//entry._markStored(false);
						this._markStored(false);
					
						this._entryCount = Object.keys(this._entries).length;
					}
				} finally {
					JSB.getLocker().unlock(eMtxName);
				}
			}
			if(writeEntry){
				this._updateEntryName(entry);
				eDesc.eInst = entry;
			}
			return eDesc;
		},
		
		_attachEntry: function(entry){
			if(entry == this){
				return;	// not need attach workspace to itself 
			}
			this.checkBlocked();
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
			this.checkBlocked();
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
			if(this.storeQueued){
				return;
			}
			this.checkBlocked();
			this.storeQueued = true;
			JSB.defer(function(){
				var mtxName = 'JSB.Workspace.Workspace.store';
				$this.lock(mtxName);
				$this.storeQueued = false;
				try {
					// store changed entries
					if(Object.keys($this._changedEntries).length > 0){
						var chMtxName = 'JSB.Workspace.Workspace.changedEntries.' + $this.getId();
						
						JSB.getLocker().lock(chMtxName);
						var changedEntries = JSB.clone($this._changedEntries);
						JSB.getLocker().unlock(chMtxName);
						
						for(var eId in changedEntries){
							var e = $this.entry(eId);
							e.lock('_stored');
							try {
								e.storeEntry();
							} catch(ex){
								JSB.getLogger().error(ex);
							} finally {
								e.unlock('_stored');
							}
							
						}
					}
					
					if(!$this._stored){
						// serialize entry indices
						var eIdx = {};
						var jsbDict = {};
						//var jsbArr = [];
						$this.lock('_stored');
						try {
							var eMtxName = 'JSB.Workspace.Workspace.entries.' + $this.getId();
							JSB.getLocker().lock(eMtxName);
							try {
								for(var eId in $this._entries){
/*									
									var jsbIdx = jsbDict[$this._entries[eId].eType];
									if(!JSB.isDefined(jsbIdx)){
										jsbIdx = jsbDict[$this._entries[eId].eType] = jsbArr.length;
										jsbArr.push($this._entries[eId].eType);
									}
*/									
									eIdx[eId] = {
										_j: $this._entries[eId].eType,
										_n: $this._entries[eId].eName
									}
									if(!JSB.isNull($this._entries[eId].eOpts)){
										eIdx[eId]._e = $this._entries[eId].eOpts;
									}
									if(!JSB.isNull($this._entries[eId].aOpts)){
										eIdx[eId]._a = $this._entries[eId].aOpts;
									}
								}
							} finally {
								JSB.getLocker().unlock(eMtxName);	
							}
							
							var doc = $this.getEntryDoc();
							//doc._jsbs = jsbArr;
							if(doc._jsbs){
								delete doc._jsbs;
							}
							doc._entries = eIdx;
							doc._wt = $this._wt;
							
							// store entry file
							$this.storeEntry();
						} finally {
							$this.unlock('_stored');
						}
					}
					
				} finally {
					$this.unlock(mtxName);
				}

			}, 1000, 'JSB.Workspace.Workspace.store.' + $this.getId());
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
		
		hasReadSection: function(){
			return this._hasRead;
		},
		
		existsEntry: function(id){
			return !!this._entries[id];
		},
		
		removeEntry: function(id){
			this.checkBlocked();
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
			var eMtxName = 'JSB.Workspace.Workspace.eInst.' + id;
			JSB.getLocker().lock(eMtxName);
			try {
				if(eDesc.eInst){
					return eDesc.eInst; 
				}
				var eJsb = JSB.get(eDesc.eType);
				if(!eJsb){
					throw new Error('Failed to create workspace entry with id: "' + id + '" due to missing it\'s bean: ' + eDesc.eType);
				}
				var eInst = new (eJsb.getClass())(id, this);
				eDesc.eInst = eInst;
			} finally {
				JSB.getLocker().unlock(eMtxName);
			}
			return eDesc.eInst;
		},

		remove: function(){
			this.checkBlocked();
			JSB.cancelDefer('JSB.Workspace.Workspace.store.' + $this.getId());
			// remove artifacts
			var aMap = this.getArtifacts();
			for(var aName in aMap){
				this.removeArtifact(aName);
			}
			
			// remove entry
			this._entryStore.remove(this);
			
			WorkspaceController.removeWorkspace(this.getId());
			this.destroy();
		},
		
		search: function(pat){
			var foundEntries = [];
			
			function resolveEntryDesc(eDesc){
				if(!eDesc){
					return;
				}
				var eJsb = JSB.get(eDesc.eType);
				if(!eJsb){
					return;
				}
				if(eJsb.isSubclassOf('JSB.Workspace.EntryLink')){
					var linkEntry = $this.entry(eDesc.eId);
					var targetWId = linkEntry.property('_wId');
					var targetEId = linkEntry.property('_eId');
					var targetWs = WorkspaceController.getWorkspace(targetWId);
					var targetEDesc = targetWs._entries[targetEId];
					return resolveEntryDesc(targetEDesc);
				}
				
				return eDesc;
			}
			
			if(JSB.isFunction(pat)){
				for(var eId in this._entries){
					var eDesc = resolveEntryDesc(this._entries[eId]);
					if(!eDesc){
						continue;
					}
					
					if(pat.call(this, eDesc)){
						foundEntries.push(this._entries[eId]);
					}
				}
			} else if(JSB.isString(pat)){
				pat = pat.replace(/\./g, '\\.').replace(/\*/g,'.*');
				var rx = new RegExp(pat, 'i');
				for(var eId in this._entries){
					var eDesc = resolveEntryDesc(this._entries[eId]);
					if(rx.test(eDesc.eName) || rx.test(eId)){
						foundEntries.push(this._entries[eId]);
					}
				}
			} else {
				throw new Error('Invalid argument passed');
			}
			
			var cursor = 0;
			return {
				next: function(){
					if(cursor < foundEntries.length){
						var e = foundEntries[cursor++];
						return $this.entry(e.eId);
					}
				},
				hasNext: function(){
					return cursor < foundEntries.length;
				},
				count: function(){
					return foundEntries.length;
				}
			};
		},
		
		uploadFile: function(fileDesc){
			this.checkBlocked();
			try {
				var pId = fileDesc.parent;
				var fileName = fileDesc.name;
				var fileData = fileDesc.content;
				var entryType = WorkspaceController.queryFileUploadEntryType(this.getWorkspaceType(), fileName, fileData);
				var entryJsb = JSB.get(entryType);
				if(!entryJsb){
					throw new Error('Unable to find entry bean: ' + entryType);
				}
				var EntryCls = entryJsb.getClass();
				var entry = new EntryCls(JSB.generateUid(), this, {
					fileName: fileName,
					fileData: fileData
				});
				if(pId){
					this.entry(pId).addChildEntry(entry);
				}
				this.store();
				return {
					entry: entry,
					name: entry.getName()
				};
			} catch(e){
				JSB.getLogger().error(e);
				return {
					error: e.message
				};
			}
		}
	}
}