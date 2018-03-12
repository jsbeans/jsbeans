{
	$name: 'JSB.Workspace.Workspace',
	$parent: 'JSB.Workspace.Entry',
	$require: ['JSB.Workspace.Entry'],
	
	$fixedId: true,
	$sync: {
		updateCheckInterval: 0
	},
	
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
			var jsbArr = this.property('_jsbs');
			var eIdx = this.property('_entries');
			
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
		},
		
		_markEntryStored: function(entry, bStored){
			if(entry == this){
				return;
			}
			var chMtxName = 'JSB.Workspace.Workspace.changedEntries.' + this.getId();
			if(!bStored){
				JSB.getLocker().lock(chMtxName);
				this._changedEntries[entry.getId()] = true;
				JSB.getLocker().unlock(chMtxName);
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
						entry._entryStore.reserve(entry);
						eDesc = this._entries[entry.getId()] = {
							eId: entry.getId(),
							eType: entry.getJsb().$name,
							eName: entry.getName(),
							eInst: null,
							eOpts: entry._entryStoreOpts,
							aOpts: entry._artifactStoreOpts
						};
						entry._markStored(false);
						this._markStored(false);
					}
				} finally {
					JSB.getLocker().unlock(eMtxName);
				}
			}
			eDesc.eInst = entry;
			return eDesc;
		},
		
		attachEntry: function(entry){
			if(entry == this){
				return;	// not need attach workspace to itself 
			}
			entry._entryStore = this._entryStore;
			entry._artifactStore = this._artifactStore;
			
			var eDesc = this._ensureEntryDesc(entry);
			
			entry._entryStoreOpts = eDesc.eOpts;
			entry._artifactStoreOpts = eDesc.aOpts;
		},
		
		
/*		
		update: function(){
            var entries = this.entries();
            var entry;
            while (entry = entries.next()) {
                entry.update();
            }
		},
*/
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
					this.property('_jsbs', jsbArr);
					this.property('_entries', eIdx);
					
					// store entry file
					this.storeEntry();
				}
			} finally {
				JSB.getLocker().unlock(mtxName);
			}
		},
		

		clean: function(){
		    var self = this;
            var entries = this.entries();
            var entry;
            while (entry = entries.next()) {
                entry.remove();
            }

		    this._locked('body', function(){
                self.backupArtifact();
                if (self.existsArtifact()) {
                    self.removeArtifact();
                }
                self.body = self._emptyBody();
            });
		},

		remove: function(){
		    this.clean();
		    this.destroy();
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

/*
		entryInstanceId: function(id) {
		    return this.id + '-' + id;
		},
*/
		artifactPath: function(path){
		    var path = this.workspaceManager.artifactsStore.subPath(this.localId, path);
		    return this.workspaceManager.artifactPath(path);
		},

		existsArtifact: function(name) {
		    return this.workspaceManager.artifactsStore.exists(this.artifactPath(name));
        },

		readArtifactAsText: function(name) {
		    return this.workspaceManager.artifactsStore.readAsText(this.artifactPath(name));
		},

		readArtifactAsBinary: function(name) {
		    return this.workspaceManager.artifactsStore.readAsBinary(this.artifactPath(name));
		},

		readArtifactAsJson: function(name) {
		    return this.workspaceManager.artifactsStore.readAsJson(this.artifactPath(name));
		},

		writeArtifactAsText: function(name, text) {
		    this.workspaceManager.artifactsStore.writeAsText(this.artifactPath(name), text);
		},

		writeArtifactAsJson: function(name, json) {
		    this.workspaceManager.artifactsStore.writeAsJson(this.artifactPath(name), json);
		},

		writeArtifactAsBinary: function(name, bytes) {
		    this.workspaceManager.artifactsStore.writeAsBinary(this.artifactPath(name), bytes);
		},

		removeArtifact: function(name) {
		    return this.workspaceManager.artifactsStore.remove(this.artifactPath(name));
		},

		backupArtifact: function(name){
		    if (name) {
		        // TODO: backup artifact
		    } else {
		        // TODO: backup all artifacts
		    }
		},
/*
        entriesPath: function(path){
            if (typeof path === 'undefined') {
                return 'entries';
            } else {
                return 'entries.' + path;
            }
        },

        entryPropertyPath: function(entry, path){
            if (path) {
                return this.entriesPath(entry.localId) + '.' + path;
            } else {
                return this.entriesPath(entry.localId);
            }
        },

		bodyChanged: function() {
		    // TODO
		},

		checkInitialized: function(){
		    if (!this.body) throw new Error('Workspace is not initialized: ' + this.id);
		},

        _emptyBody: function(){
            return {
                id: this.localId,
                fullId: this.id,
                entries: {},
            };
        },
*/

		_locked: function(id, func) {
            var locker = JSB().getLocker();
            var mtxName = 'Workspace:' + this.id + ':' + id;
            try {
                locker.lock(mtxName);
                return func.call(this);
            } finally {
                locker.unlock(mtxName);
            }
		},
		
		removeCategory: function(category){
			// remove projects from this category
            for (var entry, it = this.entries(); entry = it.next();) {
				var cat = entry.category();
				if(cat && cat.indexOf(category) == 0){
					this.removeEntry(entry.localId);
				}
            }
			
			//remove categories
			var categories = this.property('categories');
			
			// check categories for new category already existed
			for(var i = categories.length - 1; i >= 0; i-- ){
				if(categories[i].indexOf(category) == 0){
					categories.splice(i, 1);
				}
			}
			
			this.store();
			
			return true;
		},
		
		addCategory: function(category){
			var categories = this.property('categories');
			if(!categories){
				categories = [];
				this.property('categories', categories);
			}
			for(var i in categories){
				var cat = categories[i];
				if(cat == category){
					return null;
				}
			}
			categories.push(category);
			var partName = category;
			if(category.lastIndexOf('/') >= 0){
				partName = category.substr(category.lastIndexOf('/') + 1);
			}
			
			this.store();
			
			return {
				type: 'node',
				children: {},
				name: partName
			};
		},
		
		renameCategory: function(oldCategory, newCategory){
			if(newCategory == oldCategory){
				return true;
			}
			
			// rename categories
			var categories = this.property('categories');
			
			// check categories for new category already existed
			for(var i in categories){
				if(categories[i].indexOf(newCategory) == 0){
					return false;
				}
			}

			// check projects for new category already existed
            for (var onto, it = this.entries(); onto = it.next();) {
				var cat = onto.category();
                if(cat && cat.indexOf(newCategory) == 0){
                    return false;
                }
            }

			// rename categories
			for(var i in categories){
				if(categories[i].indexOf(oldCategory) == 0){
					categories[i] = categories[i].replace(oldCategory, newCategory);
				}
			}
			
			// rename projects
            for (var onto, it = this.entries(); onto = it.next();) {
				var cat = onto.category();
				if(cat && cat.indexOf(oldCategory) == 0){
					cat = cat.replace(oldCategory, newCategory);
				}
				onto.category(cat);
            }
			
			this.store();
			
			return true;
		},
		
		moveItems: function(target, sources){
			for(var i in sources){
				var source = sources[i];
				if(source.type == 'node'){
					var tPath = target.path;
					if(tPath.length > 0){
						tPath += '/';
					}
					var newNodePath = tPath + source.name;
					this.renameCategory(source.path, newNodePath);
				} else if(source.type == 'entry' && source.entry) {
					source.entry.category(target.path);
				} else {
					throw new Error('Unknown node type');
				}
			}
			
			this.store();
			
			return true;
		},
		
		uploadFile: function(fileDesc){
			var category = fileDesc.category;
			var fileName = fileDesc.name;
			var fileData = fileDesc.content;
			var entryType = WorkspaceController.queryFileUploadEntryType(this.workspaceManager.wmKey, fileName, fileData);
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