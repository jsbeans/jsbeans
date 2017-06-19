{
	$name: 'JSB.Workspace.Workspace',
	$require: ['JSB.Workspace.Entry'],
	
	$fixedId: true,
	$sync: {
		updateCheckInterval: 0
	},
	
	wName: null,
	localId: null,
	
	getName: function(){
		return this.wName;
	},
	
	getLocalId: function(){
		return this.localId;
	},

	$server: {
		$disableRpcInstance: true,
		
	    MAIN_ARTIFACT: 'workspace.json',

		$constructor: function(localId, workspaceManager){
			this.localId = localId;
			this.id = workspaceManager.workspaceInstanceId(localId);
            this.workspaceManager = workspaceManager;
            $base();

            if (this.workspaceManager.options.entryJsb) {
                this.Entry = this.workspaceManager.options.entryJsb;
                Log.debug('ontoed.workspace.Workspace: replace default entry type ' + this.Entry.name);
            }
            this.load();
            
            this.wName = this.property('wName');
			if(!this.wName || this.wName.length == 0){
				this.wName = 'Мои проекты';
				this.property('wName', this.wName);
				this.store();
			}
		},
		
		setName: function(name){
			if(this.wName == name){
				return;
			}
			this.wName = name;
			this.property('wName', this.wName);
			this.store();
		},


		load: function(){
		    var self = this;
		    this._locked('body', function(){
		        if (self.existsArtifact(self.MAIN_ARTIFACT)) {
		            self.body = self.readArtifactAsJson(self.MAIN_ARTIFACT);
		        } else {
		            self.body = self._emptyBody();
		        }
		        self.bodyChanged();
		    });
		},

		update: function(){
            var entries = this.entries();
            var entry;
            while (entry = entries.next()) {
                entry.update();
            }
		},

		store: function(){
		    if (!this.body) {
		        throw new Error('Uninitialized workspace: ' + this.id);
		    }
		    var self = this;
		    this._locked('body', function(){
		        if (self.existsArtifact(self.MAIN_ARTIFACT)) {
		            self.backupArtifact(self.MAIN_ARTIFACT);
		        }
                self.writeArtifactAsJson(self.MAIN_ARTIFACT, self.body);
		    });
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
		        var i = 0;
		        return {
		            next: function() {
		                while(i < localIds.length && !self.body.entries[localIds[i]]) {
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
			var insId = this.entryInstanceId(id);
			var entry = JSB().getInstance(insId);
			return !!entry;
		},
		
		removeEntry: function(id){
			if(this.existsEntry(id)){
				this.entry(id).remove();
			}
		},

		entry: function(id){
		    var insId = this.entryInstanceId(id);
		    var entry = JSB().getInstance(insId);
		    if (!entry) {
		        var self = this;
		        entry = this._locked(insId, function(){
                    var entry = JSB().getInstance(insId);
                    if (!entry) {
                        entry = new self.Entry(id, self);
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

		property: function(path, value) {
		    if (typeof value === 'undefined') {
		        return this._getProperty(path);
		    } else {
		        this._setProperty(path, value);
		    }
		},

        getEntryProperty: function (entry, path) {
            var self = this;
            return this._locked(entry.id, function(){
                return self._getProperty(self.entryPropertyPath(entry, path));
            });
        },

        setEntryProperty: function (entry, path, value, remove) {
            var self = this;
            this._locked(entry.id, function(){
                self._setProperty(self.entryPropertyPath(entry, path), value, remove);
            });
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

        _getProperty: function (path) {
            this.checkInitialized();
            var obj = this.body;
            if (obj == null) return null;
            path = this._splitPath(path);
            for (var i = 0; i < path.length; i++) {
                if(typeof obj[path[i]] === 'object' || i === path.length - 1) {
                    obj = obj[path[i]];
                } else {
                    return;
                }
            }
            return obj;
        },

        _setProperty: function (path, value, remove) {
            this.checkInitialized();
            var obj = this.body;
            path = this._splitPath(path);
            for (var i = 0; i < path.length-1; i++) {
                if(typeof obj[path[i]] === 'object') {
                    obj = obj[path[i]];
                } else {
                    obj = obj[path[i]] = {};
                }
            }
            var oldValue = obj[path[path.length-1]];
            if (remove) {
                delete obj[path[path.length-1]];
                this.bodyChanged();
            } else if (oldValue !== value) {
                obj[path[path.length-1]] = value;
                this.bodyChanged();
            }
        },

		_splitPath: function(path){
		    return path && path.split(/\.|\//);
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
				} else {
					var onto = this.entry(source.id);
					onto.category(target.path);
				}
			}
			
			this.store();
			
			return true;
		},
	}
}