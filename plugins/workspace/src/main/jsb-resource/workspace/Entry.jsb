{
	$name: 'JSB.Workspace.Entry',
	$fixedId: true,
	
	$sync: {
		updateCheckInterval: 0
	},
	
	_workspace: null,
	_name: null,
	_parent: null,
	_owner: null,
	_childCount: 0,
	_artifactCount: 0,
	_shareCount: 0,

	getFullId: function(){
	    return this.getWorkspace().getId() + '/' + this.getId();
	},
	
	getName: function(){
		return this._name;
	},
	
	getParentId: function(){
		return this._parent;
	},
	
	getWorkspace: function(){
		return this._workspace || this;
	},
	
	getChildCount: function(){
		return this._childCount;
	},
	
	getArtifactCount: function(){
		return this._artifactCount;
	},
	
	getShareCount: function(){
		return this._shareCount;
	},
	
	getEntryProps: function(){
		return this._props;
	},
	
	getOwner: function(){
		return this._owner;
	},

	isLink: function(){
		return false;
	},
	
	$client: {
		destroy: function(){
			$this.publish('JSB.Workspace.Entry.destroyed');
			$base();
		},
		
		onAfterSync: function(syncInfo){
			$this.publish('JSB.Workspace.Entry.updated', syncInfo);
		}
	},

	$server: {
		$require: ['JSB.System.Kernel', 'JSB.Workspace.WorkspaceController'],
		$disableRpcInstance: true,
		
		_eDoc: {},
		_props: {},
		
		_entryStore: null,
		_artifactStore: null,
		_stored: false,
		_entryStoreOpts: null,
		_artifactStoreOpts: null,
		
		_children: {},
		_artifacts: {},
		_shares: {},
		
		$constructor: function(id, workspace){
			this.id = id;
            this._workspace = (workspace == this ? null : workspace);
			if(!this.getWorkspace()){
				throw new Error('Failed to create entry: "' + this.getJsb().$name + '" due to missing workspace argument');
			}

			$base();
			if(!this._owner){
				this._owner = Kernel.user();
			}
			this.getWorkspace()._attachEntry(this);
			this.loadEntry();
			this._checkChildren();
			this.getWorkspace()._ensureEntryDesc(this, true);
		},
		
		getEntryDoc: function(){
			return this._eDoc;
		},
		
		resolveEntryTemplate: function(str){
			if(!str || str.length == 0){
				return str;
			}
			var newStr = str;
			while(true){
				var m = newStr.match(/\$\{([^\}]+)\}/i);
				if(!m || m.length < 2){
					break;
				}
				var alias = m[1];
				var val = alias;
				switch(alias){
				case 'path':
					val = this.getArtifactDir();
					break;
				case 'name':
					val = this.getName();
					break;
				default:
					val = '';
//					throw new Error('Invalid template alias: ' + alias);
					break;
				}
				newStr = newStr.replace(m[0], val);
			}
			return newStr;
		},

		_markStored: function(bStored){
			if(this._stored == bStored){
				return;
			}
			if(!bStored){
				this.lock('_stored');
			}
			this._stored = bStored;
			this.getWorkspace()._markEntryStored(this);
			if(!bStored){
				this.unlock('_stored');
				this.getWorkspace().store();
			}
		},
		
		_checkChildren: function(){
			var ws = this.getWorkspace();
			var mtx = 'JSB.Workspace.Entry.children.' + this.getId();
			JSB.getLocker().lock(mtx);
			try {
				var chDelArr = [];
				for(var chId in this._children){
					if(!ws.existsEntry(chId)){
						chDelArr.push(chId);
					}
				}
				for(var i = 0; i < chDelArr.length; i++){
					delete this._children[chDelArr[i]];
				}
			} finally {
				JSB.getLocker().unlock(mtx);
			}
		},
		
		
		getEntryStore: function(){
			return this._entryStore;
		},
		
		getArtifactStore: function(){
			return this._artifactStore;
		},
		
		loadEntry: function(){
			var doc = this._entryStore.read(this);
			if(doc){
				this._eDoc = doc;
				
				// load common attrs
				this._props = this._eDoc._props || {};
				this._name = this._eDoc._name;
				this._parent =  this._eDoc._parent || null;
				this._owner = this._eDoc._owner || null;
				
				// load shares
				this._shares = this._eDoc._shares || {};
				this._shareCount = Object.keys(this._shares).length;
				
				// load children
				var mtx = 'JSB.Workspace.Entry.children.' + this.getId();
				JSB.getLocker().lock(mtx);
				this._children = {};
				
				if(this._eDoc._children && JSB.isArray(this._eDoc._children) && this._eDoc._children.length > 0){
					for(var i = 0; i < this._eDoc._children.length; i++){
						var chId = this._eDoc._children[i];
						this._children[chId] = true;
					}
				} else if(this._eDoc._children && JSB.isObject(this._eDoc._children)){
					for(var chId in this._eDoc._children){
						this._children[chId] = true;
					}
					
				}
				this._childCount = Object.keys(this._children).length;
				JSB.getLocker().unlock(mtx);
				
				// load artifacts
				mtx = 'JSB.Workspace.Entry.artifacts.' + this.getId();
				JSB.getLocker().lock(mtx);
				this._artifacts = this._eDoc._artifacts || {};
				this._artifactCount = Object.keys(this._eDoc._artifacts).length;
				JSB.getLocker().unlock(mtx);
				
				this._stored = true;
			} else {
				$this.publish('JSB.Workspace.Entry.created');
			}
		},
		
		storeEntry: function(){
			if(this._stored){
				return;
			}
			var doc = this.getEntryDoc();
			
			// common attrs
			doc._props = this._props;
			doc._name = this._name;
			doc._parent = this._parent;
			doc._owner = this._owner;
			doc._shares = this._shares;
			
			// serialize children
			var mtx = 'JSB.Workspace.Entry.children.' + this.getId();
			JSB.getLocker().lock(mtx);
			doc._children = {};
			for(var chId in this._children){
				doc._children[chId] = 1;
			}
			this._childCount = Object.keys(doc._children).length;
			JSB.getLocker().unlock(mtx);
			
			// serialize artifacts
			mtx = 'JSB.Workspace.Entry.artifacts.' + this.getId();
			JSB.getLocker().lock(mtx);
			doc._artifacts = this._artifacts;
			this._artifactCount = Object.keys(this._artifacts).length;
			JSB.getLocker().unlock(mtx);
			
			this._entryStore.write(this);
			this._markStored(true);
			
			JSB.defer(function(){
				$this.doSync();	
			}, 0);
			
			$this.publish('JSB.Workspace.Entry.updated');
		},

		remove: function(){
			// remove children
			var chMap = this.getChildren();
			for(var chId in chMap){
				var eCh = chMap[chId];
				this.removeChildEntry(eCh);
				eCh.remove();
			}

			// dissociate from parent
			var p = this.getParent();
			if(p){
				p.removeChildEntry(this);
			} else {
				this.getWorkspace().removeChildEntry(this);
			}
			
			// remove artifacts
			var aMap = this.getArtifacts();
			for(var aName in aMap){
				this.removeArtifact(aName);
			}
			
			// remove entry
			this._entryStore.remove(this);
			
			// detach from workspace
			this.getWorkspace()._detachEntry(this);
			this.getWorkspace().store();
			
			$this.publish('JSB.Workspace.Entry.removed');
			
			this.destroy();
		},

		property: function(path, value) {
			if(!path || !JSB.isString(path) || path.length == 0){
				throw new Error('Invalid property path: ' + JSON.stringify(path));
			}
			var parts = path.split(/\.|\/|\\/);
		    if (!JSB.isDefined(value)) {
		    	var curDoc = this.getEntryProps();
		    	for(var i = 0; i < parts.length; i++){
		    		curDoc = curDoc[parts[i]];
		    		if(!JSB.isDefined(curDoc)){
		    			return;
		    		}
		    	}
		        return curDoc;
		    } else {
		    	var curDoc = this.getEntryProps();
		    	var mtxName = 'JSB.Workspace.Entry.property.' + this.getId();
		    	JSB.getLocker().lock(mtxName);
		    	try {
			    	for(var i = 0; i < parts.length - 1; i++){
			    		if(!curDoc[parts[i]]){
			    			curDoc[parts[i]] = {};
			    		} else if(!JSB.isObject(curDoc[parts[i]])){
			    			throw new Error('Invalid property path: ' + path);
			    		}
			    		
			    		curDoc = curDoc[parts[i]];
			    	}
			    	curDoc[parts[parts.length - 1]] = value;
			    	this._markStored(false);
		    	} finally {
		    		JSB.getLocker().unlock(mtxName);
		    	}
		    }
		},
		
		removeProperty: function(path){
			if(!path || !JSB.isString(path) || path.length == 0){
				throw new Error('Invalid property path: ' + JSON.stringify(path));
			}
			var parts = path.split(/\.|\/|\\/);
			var curDoc = this.getEntryProps();
	    	var mtxName = 'JSB.Workspace.Entry.property.' + this.getId();
	    	JSB.getLocker().lock(mtxName);
	    	try {
				for(var i = 0; i < parts.length - 1; i++){
		    		curDoc = curDoc[parts[i]];
		    		if(!JSB.isDefined(curDoc)){
		    			return;
		    		}
		    	}
				if(JSB.isDefined(curDoc[parts[parts.length - 1]])){
					delete curDoc[parts[parts.length - 1]];
					this._markStored(false);
				}
	    	} finally {
	    		JSB.getLocker().unlock(mtxName);
	    	}
		},
		
		hasProperty: function(path){
			return JSB.isDefined(this.property(path));
		},
		
		setName: function(title){
			if(this._name == title){
				return false;
			}
			this._name = title;
			this.getWorkspace()._updateEntryName(this);
			this._markStored(false);
			return true;
		},
		
		hasChildEntry: function(entry){
			if(JSB.isString(entry)){
				entry = this.getWorkspace().entry(entry);
			}
			
			if(!entry){
				throw new Error('No child entry specified');
			}
			if(entry == this){
				if(this.getWorkspace() == this){
					return;
				}
				throw new Error('Failed to remove child entry from itself');
			}
			
			if(this._children[entry.getId()]){
				return true;
			}
			
			return false;
		},
		
		removeChildEntry: function(entry){
			if(JSB.isString(entry)){
				entry = this.getWorkspace().entry(entry);
			}
			
			if(!entry){
				throw new Error('No child entry specified');
			}
			if(entry == this){
				if(this.getWorkspace() == this){
					return;
				}
				throw new Error('Failed to remove child entry from itself');
			}
			
			if(!this._children[entry.getId()]){
				return;
			}
			var mtx = 'JSB.Workspace.Entry.children.' + this.getId();
			JSB.getLocker().lock(mtx);
			delete this._children[entry.getId()];
			entry._parent = null;
			this._childCount = Object.keys(this._children).length;
			JSB.getLocker().unlock(mtx);
			
			if(this.getWorkspace() != this){
				this.getWorkspace().addChildEntry(entry);
			}
			
			entry._markStored(false);
			this._markStored(false);
			
			$this.publish('JSB.Workspace.Entry.removeChild', entry);
			entry.publish('JSB.Workspace.Entry.setParent', null);

			return entry;
		},
		
		addChildEntry: function(entry, opts){
			if(JSB.isString(entry)){
				entry = this.getWorkspace().entry(entry);
			}
			if(!entry){
				throw new Error('No child entry specified');
			}
			if(entry == this){
				throw new Error('Failed to add child entry to itself');
			}
			if(!JSB.isInstanceOf(entry, 'JSB.Workspace.Entry')){
				throw new Error('Invalid child entry specified');
			}
			
			if(this._children[entry.getId()]){
				return;	// already exists
			}
			
			var p = entry.getParent();
			
			if(p){
				p.removeChildEntry(entry);
			}
			entry.getWorkspace().removeChildEntry(entry);
			
			var mtx = 'JSB.Workspace.Entry.children.' + this.getId();
			JSB.getLocker().lock(mtx);
			this._children[entry.getId()] = true;
			entry._parent = (this.getWorkspace() == this ? null: this.getId());
			this._childCount = Object.keys(this._children).length;
			JSB.getLocker().unlock(mtx);
			entry._markStored(false);
			this._markStored(false);
			
			$this.publish('JSB.Workspace.Entry.addChild', entry);
			entry.publish('JSB.Workspace.Entry.setParent', $this);
			
			return entry;
		},
		
		children: function(){
			var chArr = Object.keys(this._children);
			var cursor = 0;
			return {
				next: function(){
					if(cursor < chArr.length){
						var ch = null;
						while(true){
							if($this.getWorkspace().existsEntry(chArr[cursor])){
								ch = $this.getWorkspace().entry(chArr[cursor]);
							} else {
								JSB.getLogger().error('Error: Entry "'+$this.getId()+'" has missing child "' + chArr[cursor] + '"');
							}
							cursor++;
							if(ch){
								break;
							}
						}
						return ch;
					}
				},
				hasNext: function(){
					return cursor < chArr.length;
				},
				count: function(){
					return chArr.length;
				}
			};
		},
		
		getChildren: function(){
			if(!this._children || Object.keys(this._children).length == 0){
				return {};
			}
			var children = {};
			for(var eId in this._children){
				if(this.getWorkspace().existsEntry(eId)){
					children[eId] = this.getWorkspace().entry(eId);
				} else {
					JSB.getLogger().error('Error: Entry "'+this.getId()+'" has missing child "' + eId + '"');
				}
			}
			return children;
		},
		
		getParent: function(){
			if(this._parent){
				return this.getWorkspace().entry(this._parent);
			}
		},
		
		getArtifacts: function(){
			return JSB.clone(this._artifacts);
		},
		
		artifacts: function(){
			var aIds = Object.keys(this._artifacts);
			var cursor = 0;
			return {
				next: function(){
					if(cursor < aIds.length){
						return aIds[cursor++];
					}
				},
				
				hasNext: function(){
					return cursor < aIds.length;
				},
				
				count: function(){
					return aIds.length;
				}
			};
		},
		
		getArtifactSize: function(name, opts){
			if(!this.existsArtifact(name)){
				throw new Error('Missing artifact "'+name+'" in entry: ' + this.getId());
			}
			return this._artifactStore.size(this, name, opts);
		},
		
		getArtifactDir: function(){
			return this._artifactStore.getArtifactDir(this);
		},

		existsArtifact: function(name) {
			if(!JSB.isString(name)){
				throw new Error('Invalid artifact name');
			}

		    return !!this._artifacts[name];
        },

		loadArtifact: function(name, opts) {
			if(!JSB.isString(name)){
				throw new Error('Invalid artifact name');
			}

			if(!this.existsArtifact(name)){
				throw new Error('Missing artifact "'+name+'" in entry: ' + this.getId());
			}
		    return this._artifactStore.read(this, name, opts);
		},

		storeArtifact: function(name, a, opts) {
			if(!JSB.isString(name)){
				throw new Error('Invalid artifact name');
			}
			if(!JSB.isDefined(a)){
				throw new Error('Missing artifact argument for: ' + name);
			}
			var mtxName = 'JSB.Workspace.Entry.artifacts.' + this.getId();
			JSB.getLocker().lock(mtxName);
			var bNeedStoreEntry = false;
			var artifacts = this._artifacts;
			try {
			    if(JSB.isString(a)){
			    	bNeedStoreEntry = artifacts[name] != 'string';
			    	artifacts[name] = 'string';
			    } else if(JSB.isArrayBuffer(a) || JSB.isInstanceOf(a, 'JSB.IO.Stream')){
			    	bNeedStoreEntry = artifacts[name] != 'binary';
			    	artifacts[name] = 'binary';
			    } else if(JSB.isObject(a) || JSB.isArray(a) || JSB.isNumber(a) || JSB.isBoolean(a)){
			    	bNeedStoreEntry = artifacts[name] != 'value';
			    	artifacts[name] = 'value';
			    } else {
			    	throw new Error('Invalid artifact type');
			    }
			    this._artifactCount = Object.keys(artifacts).length;
			} finally {
				JSB.getLocker().unlock(mtxName);
			}
		    if(bNeedStoreEntry){
		    	this._markStored(false);
		    }
		    this._artifactStore.write(this, name, a, opts);
		    $this.publish('JSB.Workspace.Entry.storeArtifact', name);
		},

		removeArtifact: function(name, opts) {
			if(!JSB.isString(name)){
				throw new Error('Invalid artifact name');
			}
		    if(!this.existsArtifact(name)){
		    	return;
		    }
		    
		    var mtxName = 'JSB.Workspace.Entry.artifacts.' + this.getId();
			JSB.getLocker().lock(mtxName);
			try {
				delete this._artifacts[name];
				this._artifactCount = Object.keys(this._artifacts).length;
			    this._artifactStore.remove(this, name, opts);
				this._markStored(false);
				$this.publish('JSB.Workspace.Entry.removeArtifact', name);
			} finally {
				JSB.getLocker().unlock(mtxName);
			}
		},
		
		renameArtifact: function(name, newName, opts){
			if(!JSB.isString(name)){
				throw new Error('Invalid artifact name');
			}
		    if(!this.existsArtifact(name)){
		    	return;
		    }
		    var mtxName = 'JSB.Workspace.Entry.artifacts.' + this.getId();
			JSB.getLocker().lock(mtxName);
			try {
			    this._artifactStore.rename(this, name, newName, opts);
			    this._artifacts[newName] = this._artifacts[name];
				delete this._artifacts[name];
				this._markStored(false);
			} finally {
				JSB.getLocker().unlock(mtxName);
			}
		},

		getShareInfo: function(){
		    try {
		        return $this.getShareInfoInternal();
            }catch (e) {
                Log.error(e);
            }
		},
		
		getShareInfoInternal: function(){
			var users = WorkspaceController.getUsers();
			var wArr = WorkspaceController.getWorkspacesInfo(Kernel.user());
			
			var shareMap = {}, wMap = {}, userMap = {};
			
			// proceed existed shares
			for(var shareId in $this._shares){
				var existedShare = $this._shares[shareId];
				if(Kernel.user() != existedShare.user && Kernel.user() != $this.getOwner()){
					continue;	// prevent user share to foreign user
				}
				var ws = WorkspaceController.getWorkspace(existedShare.wId);
				if(Kernel.user() == existedShare.user && ws.getWorkspaceType() == 'shared'){
					continue;	// prevent local share into shared workspace
				}
				
				if(Kernel.user() == $this.getOwner() && Kernel.user() != existedShare.user && ws.getWorkspaceType() != 'shared'){
					continue;	// prevent owner to see reshares
				}
					
				wMap[existedShare.wId] = true;
				userMap[existedShare.user] = true;
				
				shareMap[shareId] = {
					id: shareId,
					user: existedShare.user,
					local: Kernel.user() == existedShare.user,
					wId: existedShare.wId,
					access: existedShare.access,
					wName: ws.getName()
				};
			}
			
			// proceed workspaces
			for(var i = 0; i < wArr.length; i++){
				var wDesc = wArr[i];
				if(wDesc.wId == this.getWorkspace().getId() || wDesc.wType == 'shared'){
					continue;
				}
				if(wMap[wDesc.wId]){
					continue;
				}
				var w = WorkspaceController.getWorkspace(wDesc.wId);
				var shareId = JSB.generateUid();
				shareMap[shareId] = {
					id: shareId,
					user: Kernel.user(),
					local: true,
					wId: wDesc.wId,
					wName: w.getName(),
					access: 0
				};
			}

			if(Kernel.user() == $this.getOwner()){
				// proceed users
				for(var i = 0; i < users.length; i++){
					if(Kernel.user() == users[i]){
						continue;	// skip current user
					}
					if(userMap[users[i]]){
						continue;
					}
					var shareId = JSB.generateUid();
					shareMap[shareId] = {
						id: shareId,
						user: users[i],
						local: false,
						wId: null,
						wName: null,
						access: 0
					};
				}
			}
			
			
			return {
				shares: shareMap,
				maxAccess: $this.getAccessForUser()
			};
		},
		
		changeShares: function(newShareMap){
			this.lock('JSB.Workspace.Entry.shares');
			var bNeedStore = false;
			try {
				for(var shareId in newShareMap){
					var newShare = newShareMap[shareId];
					
					// check allowed access
					var maxAccess = $this.getAccessForUser();
					if(newShare.access > maxAccess){
						newShare.access = maxAccess;
					}

					if(($this._shares[shareId] && $this._shares[shareId].access == newShare.access) || (!$this._shares[shareId] && newShare.access == 0)){
						continue;
					}
					bNeedStore = true;
					if(!$this._shares[shareId]){
						// create new share
						var ws = null;
						if(newShare.wId){
							ws = WorkspaceController.getWorkspace(newShare.wId);
						} else {
							// obtain shared workspace
							var wsInfoArr = WorkspaceController.getWorkspacesInfo(newShare.user);
							for(var i = 0; i < wsInfoArr.length; i++){
								var wsInfo = wsInfoArr[i];
								if(wsInfo.wType == 'shared'){
									ws = WorkspaceController.getWorkspace(wsInfo.wId);
									break;
								}
							}
							if(!ws){
								// create shared workspace for target user
								ws = WorkspaceController.createWorkspace('shared', {
									owner: newShare.user
								});
							}
						}
						
						
						// create new link entry
						var EntryLink = JSB.get('JSB.Workspace.EntryLink').getClass();
						var el = new EntryLink(shareId, ws, {
							entry: $this,
							access: newShare.access
						});
						
						$this._shares[shareId] = {
							user: ws.getOwner(),
							wId: ws.getId(),
							access: newShare.access,
							lId: el.getId()
						};
						
						$this._shareCount = Object.keys($this._shares).length;
						
						ws._markStored(false);
						
					} else {
						// change existing share
						var ws = WorkspaceController.getWorkspace($this._shares[shareId].wId);
						var el = null;
						if(ws.existsEntry($this._shares[shareId].lId)){
							el = ws.entry($this._shares[shareId].lId);
						}
						var reShares = {};
						if(!newShare.local){
							// combine descendant reshares of target user
							function _combineReshares(entry){
								for(var reshareId in entry._shares){
									if(entry._shares && entry._shares[reshareId].user == newShare.user && reshareId != shareId){
										var reshareWs = WorkspaceController.getWorkspace(entry._shares[reshareId].wId);
										if(reshareWs.getWorkspaceType() == 'shared'){
											continue;
										}
										if(!reShares[reshareId]){
											reShares[reshareId] = {
												entry: entry,
												share: reshareId
											};
										}
									}
									
									// iterate children
									var children = entry.getChildren();
									for(var chId in children){
										_combineReshares(children[chId]);
									}
								}
							}
							_combineReshares($this);
						}

						if(newShare.access == 0){
							// remove link
							if(el){
								el.remove();
							}
							delete $this._shares[shareId];
							$this._shareCount = Object.keys($this._shares).length;
							
							if(!newShare.local){
								// avoid reshares
								for(var reshareId in reShares){
									var reshareEntry = reShares[reshareId].entry;
									var reshareWs = WorkspaceController.getWorkspace(reshareEntry._shares[reshareId].wId);
									if(reshareWs.existsEntry(reshareEntry._shares[reshareId].lId)){
										var reshareEl = reshareWs.entry(reshareEntry._shares[reshareId].lId);
										reshareEl.remove();
									}
									delete reshareEntry._shares[reshareId];
									reshareEntry._shareCount = Object.keys(reshareEntry._shares).length;
									reshareEntry._markStored(false);
								}
								
								// remove shared workspace if it's empty
								if(ws.getWorkspaceType() == 'shared' && ws.getChildCount() == 0){
									WorkspaceController.removeWorkspace(ws);
								}
							}
						} else {
							// change access
							$this._shares[shareId].access = newShare.access;
							if(el){
								el.setAccess(newShare.access);
							} else {
								var EntryLink = JSB.get('JSB.Workspace.EntryLink').getClass();
								el = new EntryLink(shareId, ws, {
									entry: $this,
									access: newShare.access
								});
							}
							if(!newShare.local){
								// change reshare access
								for(var reshareId in reShares){
									var reshareEntry = reShares[reshareId].entry;
									if(reshareEntry._shares[reshareId].access > newShare.access){
										reshareEntry._shares[reshareId].access = newShare.access;
										var reshareWs = WorkspaceController.getWorkspace(reshareEntry._shares[reshareId].wId);
										if(reshareWs.existsEntry(reshareEntry._shares[reshareId].lId)){
											var reshareEl = reshareWs.entry(reshareEntry._shares[reshareId].lId);
											reshareEl.setAccess(newShare.access);
										}
										reshareEntry._markStored(false);
									}
								}
							}
						}
					}
				}
				if(bNeedStore){
					this._markStored(false);
				}
			} finally {
				this.unlock('JSB.Workspace.Entry.shares');
			}
		},
		
		getAccessForUser: function(user){
			var bAdmin = false;
			if(!user){
				user = Kernel.user();
				bAdmin = Kernel.isAdmin();
			}
			if($this.getOwner() == user || bAdmin){
				return 2;	// read/write access
			}
//			return 1;	// temp
			var curEntry = $this;
			while(curEntry){
				// iterate over shares
				if(curEntry._shares){
					for(var shareId in curEntry._shares){
						if(curEntry._shares[shareId].user == user){
							var ws = WorkspaceController.getWorkspace(curEntry._shares[shareId].wId);
							if(ws.getWorkspaceType() != 'shared'){
								continue;
							}
							return curEntry._shares[shareId].access;
						}
					}
				}
				curEntry = curEntry.getParent();
			}
			
			return 0;
		},
		
		requireAccess: function(access){
//			return;	// TEMP
			if($this.getAccessForUser() < access){
				throw new Error('Access denied');
			}
		}
	}
}