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
	_props: {},
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
	
	$client: {
		onAfterSync: function(syncInfo){
			$this.publish('JSB.Workspace.Entry.updated', syncInfo);
		}
	},

	$server: {
		$require: ['JSB.System.Kernel'],
		$disableRpcInstance: true,
		
		_eDoc: {},
		
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
		},
		
		getOwner: function(){
			return this._owner;
		},
		
		getEntryDoc: function(){
			return this._eDoc;
		},
		
		getEntryProps: function(){
			return this._props;
		},
		
		_markStored: function(bStored){
			this._stored = bStored;
			this.getWorkspace()._markEntryStored(this, bStored);
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
						this._children[this._eDoc._children[i]] = true;
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
			
			this.doSync();
			this._entryStore.write(this);
			this._markStored(true);
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
		
		setName: function(title){
			if(this._name == title){
				return;
			}
			this._name = title;
			this._markStored(false);
			this.getWorkspace()._changeEntryName(this);
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
			
            this.publish('JSB.Workspace.Entry.removeChild', entry, {session: true});
			return entry;
		},
		
		addChildEntry: function(entry){
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
			} else {
				entry.getWorkspace().removeChildEntry(entry);
			}
			
			var mtx = 'JSB.Workspace.Entry.children.' + this.getId();
			JSB.getLocker().lock(mtx);
			this._children[entry.getId()] = true;
			entry._parent = (this.getWorkspace() == this ? null: this.getId());
			this._childCount = Object.keys(this._children).length;
			JSB.getLocker().unlock(mtx);
			entry._markStored(false);
			this._markStored(false);
			
			this.publish('JSB.Workspace.Entry.addChild', entry, {session: true});
			
			return entry;
		},
		
		children: function(){
			var chArr = Object.keys(this._children);
			var cursor = 0;
			return {
				next: function(){
					if(cursor < chArr.length){
						return $this.getWorkspace().entry(chArr[cursor++]);
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
				children[eId] = this.getWorkspace().entry(eId);
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
			    } else if(JSB.isObject(a) || JSB.isArray(a) || JSB.isNumber(a) || JSB.isBoolean(a)){
			    	bNeedStoreEntry = artifacts[name] != 'value';
			    	artifacts[name] = 'value';
			    } else if(JSB.isArrayBuffer(a)){
			    	bNeedStoreEntry = artifacts[name] != 'binary';
			    	artifacts[name] = 'binary';
			    } else {
			    	throw new Error('Invalid artifact type');
			    }
			    if(bNeedStoreEntry){
			    	this._markStored(false);
			    }
			    this._artifactCount = Object.keys(artifacts).length;
			    this._artifactStore.write(this, name, a);
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
				this._markStored(false);
			    this._artifactStore.remove(this, name);
			} finally {
				JSB.getLocker().unlock(mtxName);
			}
		},

	}
}