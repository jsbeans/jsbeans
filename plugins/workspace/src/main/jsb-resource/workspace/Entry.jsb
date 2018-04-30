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
	
	getEntryProps: function(){
		return this._props;
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
		$require: ['JSB.System.Kernel'],
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
		
		$constructor: function(id, workspace){
			this.id = id;
            this._workspace = (workspace == this ? null : workspace);
			if(!this.getWorkspace()){
				throw new Error('Failed to create entry: "' + this.getJsb().$name + '" due to missing workspace argument');
			}

			$base();
			this._owner = Kernel.user();
			this.getWorkspace()._attachEntry(this);
			this.loadEntry();
			this._checkChildren();
			this.getWorkspace()._ensureEntryDesc(this, true);
		},
		
		getOwner: function(){
			return this._owner;
		},
		
		getEntryDoc: function(){
			return this._eDoc;
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
				
				// load children
				var mtx = 'JSB.Workspace.Entry.children.' + this.getId();
				JSB.getLocker().lock(mtx);
				this._children = {};
				if(this._eDoc._children && this._eDoc._children.length > 0){
					this._childCount = this._eDoc._children.length;
					for(var i = 0; i < this._eDoc._children.length; i++){
						var chId = this._eDoc._children[i];
						this._children[chId] = true;
					}
				}
				JSB.getLocker().unlock(mtx);
				
				// load artifacts
				mtx = 'JSB.Workspace.Entry.artifacts.' + this.getId();
				JSB.getLocker().lock(mtx);
				this._artifacts = this._eDoc._artifacts || {};
				this._artifactCount = Object.keys(this._eDoc._artifacts).length;
				JSB.getLocker().unlock(mtx);
				
				this._stored = true;
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
			
			// serialize children
			var mtx = 'JSB.Workspace.Entry.children.' + this.getId();
			JSB.getLocker().lock(mtx);
			doc._children = [];
			for(var chId in this._children){
				doc._children.push(chId);
			}
			this._childCount = doc._children.length;
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

		existsArtifact: function(name) {
			if(!JSB.isString(name)){
				throw new Error('Invalid artifact name');
			}

		    return !!this._artifacts[name];
        },

		loadArtifact: function(name) {
			if(!JSB.isString(name)){
				throw new Error('Invalid artifact name');
			}

			if(!this.existsArtifact(name)){
				throw new Error('Missing artifact "'+name+'" in entry: ' + this.getId());
			}
		    return this._artifactStore.read(this, name);
		},

		storeArtifact: function(name, a) {
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
			    this._artifactStore.write(this, name, a);
			    if(bNeedStoreEntry){
			    	this._markStored(false);
			    }
			} finally {
				JSB.getLocker().unlock(mtxName);
			}
		},

		removeArtifact: function(name) {
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
			    this._artifactStore.remove(this, name);
				this._markStored(false);
			} finally {
				JSB.getLocker().unlock(mtxName);
			}
		}
	}
}