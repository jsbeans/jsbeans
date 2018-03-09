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
		
		$constructor: function(id, cfg){
            $base(id, null);
            
            this.config = cfg;
            
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
		},
		
		load: function(){
			this.loadEntry();
			
			// scan workspace entries
			var ids = this._entryStore.getEntryIds();
/*			
		    var self = this;
		    this._locked('body', function(){
		        if (self.existsArtifact(self.MAIN_ARTIFACT)) {
		            self.body = self.readArtifactAsJson(self.MAIN_ARTIFACT);
		        } else {
		            self.body = self._emptyBody();
		        }
		        self.bodyChanged();
		    });
*/		    
		},

		update: function(){
            var entries = this.entries();
            var entry;
            while (entry = entries.next()) {
                entry.update();
            }
		},

		store: function(){
			this.storeEntry();
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

		entryIds: function(){
		    var self = this;
		    this.checkInitialized();

		    return this._locked('body', function(){
		        var localIds = Object.keys(self.body.entries);
		        //JSB.getLogger().info('count: ' + localIds.length + '; entries: ' + JSON.stringify(localIds));
		        var i = 0;
		        return {
		            next: function() {
		            	//JSB.getLogger().info('pos: ' + i + '; entry: ' + localIds[i]);
		                while(i < localIds.length && (!localIds[i] || !self.body.entries[localIds[i]] || Object.keys(self.body.entries[localIds[i]]).length == 0 || !self.body.entries[localIds[i]].eType)) {
		                    i++;
		                }

		                if (i < localIds.length) {
		                    return localIds[i++];
		                }
		            }
		        };
		    });
		},

		entries: function(){
		    var localIds = this.entryIds();
		    var self = this;
            return {
                next: function() {
                    var localId = localIds.next();
                    if (typeof localId !== 'undefined') {
                        return self.entry(localId);
                    }
                },
                nextFiltered: function(filter){
                    var next = this.next();
                    do {
                        if (typeof next !== 'undefined') {
                            if (filter.call(this, next)){
                                return next;
                            }
                        }
                    } while(next = this.next());
                }
            };
		},
		
		existsEntry: function(id){
			return !!this.entry(id);
		},
		
		removeEntry: function(id){
			if(this.existsEntry(id)){
				this.entry(id).remove();
				return true;
			}
			return false;
		},

		entry: function(id, eType){
		    var insId = this.entryInstanceId(id);
		    var entry = JSB().getInstance(insId);
		    if (!entry) {
		        var self = this;
		        entry = this._locked(insId, function(){
                    var entry = JSB().getInstance(insId);
                    if (!entry) {
                    	if(!eType){
                    		eType = $this._getProperty($this.entriesPath(id) + '.eType');
                    	}
                    	if($jsb.isString(eType)){
                    		eJsb = $jsb.get(eType);
                    		if(!eJsb){
                    			throw new Error('Failed to find entry type: ' + eType);
                    		}
                    		eType = eJsb.getClass();
                    	} else if(eType instanceof JSB){
                    		eType = eType.getClass();
                    	} else if(!eType) {
                    		return null;
                    	}
                        entry = new eType(id, self);
                    }
                    return entry;
		        });
		    }
		    return entry;
		},

		entryByValue: function(path, value) {
		    function filter(entry) {
                if (entry.property(path) == value) {
                    return true;
                }
		    }
            for (var entry, it = this.entries(); entry = it.nextFiltered(filter);){
                if (entry) return entry;
		    }
		},

		entryInstanceId: function(id) {
		    return this.id + '-' + id;
		},

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