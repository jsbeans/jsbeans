{
	$name: 'JSB.Workspace.Entry',
	$fixedId: true,
	
	$sync: {
		updateCheckInterval: 0
	},
	
	_workspace: null,
	_eDoc: {
		_id: null,
		_name: '',
		_parent: null,
		_children: {},
		_owner: null,
		_jsb: '',
	},
	
	getName: function(){
		return this._eDoc._name;
	},
	
	getParentId: function(){
		return this._eDoc._parent;
	},
	
	getChildrenIds: function(){
		return Object.keys(this._eDoc._children);
	},
	
	getWorkspace: function(){
		return this._workspace;
	},
	
	getOwner: function(){
		return this._eDoc._owner;
	},
	
	$client: {
		onAfterSync: function(){
			$this.publish('Workspace.Entry.updated');
		}
	},

	$server: {
		$require: ['JSB.System.Kernel'],
		$disableRpcInstance: true,
		
		_entryStore: null,
		_artifactStore: null,
		_stored: false,

		
		$constructor: function(id, workspace){
			this.id = id;
            this._workspace = workspace;
			$base();
			this._eDoc._id = id;
			this._eDoc._jsb = this.getJsb().$name;
			this._eDoc._owner = Kernel.user() || Config.get('kernel.security.admin.user');
/*			
            if(!this.property('id')) this.property('id', this.localId);
            if(!this.property('fullId')) this.property('fullId', this.id);
            if(!this.property('eType')) this.property('eType', this.getJsb().$name);
            
            if(this.property('children')){
            	this.children = this.property('children');
            }
            if(this.property('parent')){
            	this.parent = this.property('parent');
            }
            this.name = this.title();
*/            
		},
		
		getEntryDoc: function(){
			return this._eDoc;
		},
		
		loadEntry: function(){
			this._eDoc = this._entryStore.read(this.getId());
			this._stored = true;
		},
		
		storeEntry: function(){
			if(this._stored){
				return;
			}
			this._entryStore.write(this);
			this._stored = true;
		},

		remove: function(){
			// dissociate from parent
			if(this.parent){
				this.workspace.entry(this.parent).removeChildEntry(this);
			}
			// remove children
			if(this.children){
				for(var cId in this.children){
					var cEntry = this.workspace.entry(cId);
					cEntry.parent = null;
					cEntry.remove();
				}
			}
			
		    this.workspace.setEntryProperty(this, '', null, true);
			this.destroy();
		},

		property: function(path, value) {
			if(!path || !JSB.isString(path) || path.length == 0){
				throw new Error('Invalid property path: ' + JSON.stringify(path));
			}
			var parts = path.split(/\.|\/|\\/);
		    if (!JSB.isDefined(value)) {
		    	var curDoc = this._eDoc;
		    	for(var i = 0; i < parts.length; i++){
		    		curDoc = curDoc[parts[i]];
		    		if(!JSB.isDefined(curDoc)){
		    			return;
		    		}
		    	}
		        return curDoc;
		    } else {
		    	var curDoc = this._eDoc;
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
			    	this._stored = false;
		    	} finally {
		    		JSB.getLocker().unlock(mtxName);
		    	}
		    }
		},

		update: function(){
		},

		category: function(cat){
			var children = this.getChildren();
			if(JSB.isDefined(cat) && children && Object.keys(children).length > 0){
				for(var cId in children){
					var cEntry = children[cId];
					var entryCat = this.getLocalId();
					if(cat){
						entryCat = cat + '/' + this.getLocalId();
					}
					cEntry.category(entryCat);
				}
			}
		    return this.property('category', cat);
		},
		
		setName: function(title){
			if(this.getName() == title){
				return;
			}
			this.property('_name', title);
		},
		
		removeChildEntry: function(eid){
			if(JSB.isInstanceOf(eid, 'JSB.Workspace.Entry')){
				eid = eid.getLocalId();
			} else if(!JSB.isString(eid)){
				throw new Error('Invalid entry passed for remove');
			}
			if(!this.children[eid]){
				return;
			}
			delete this.children[eid];
			this.property('children', this.children);
			var cEntry = this.workspace.entry(eid);
			cEntry.parent = null;
			cEntry.property('parent', cEntry.parent);
            this.publish('Workspace.Entry.remove', cEntry, {session: true});
			return cEntry;
		},
		
		addChildEntry: function(entry){
			if(entry.workspace != this.workspace){
				throw new Error('Failed to add child entry from other workspace');
			}
			this.children[entry.getLocalId()] = true;
			entry.parent = this.getLocalId();
			this.property('children', this.children);
			entry.property('parent', entry.parent);
			var cat = this.getLocalId();
			if(this.category()){
				cat = this.category() + '/' + cat;
			}
			entry.category(cat);
			this.publish('Workspace.Entry.add', entry, {session: true});
		},
		
		getChildren: function(){
			if(!this.children){
				return {};
			}
			var children = {};
			for(var eId in this.children){
				children[eId] = this.workspace.entry(eId);
			}
			return children;
		},
		
		getParent: function(){
			if(this.parent){
				return this.workspace.entry(this.parent);
			}
			return null;
		},

		_locked: function(id, func) {
            var locker = JSB().getLocker();
            var mtxName = 'Entry:' + this.id + ':' + id;
            try {
                locker.lock(mtxName);
                return func.call(this);
            } finally {
                locker.unlock(mtxName);
            }
		},
	}
}