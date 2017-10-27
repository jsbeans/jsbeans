{
	$name: 'JSB.Workspace.Entry',
	$fixedId: true,
	
	$sync: {
		updateCheckInterval: 0
	},
	
	localId: null,
	workspace: null,
	name: null,
	children: {},
	parent: null,
	
	getLocalId: function(){
		return this.localId;
	},
	
	getName: function(){
		return this.name;
	},
	
	getParentId: function(){
		return this.parent;
	},
	
	getWorkspace: function(){
		return this.workspace;
	},
	
	$client: {
		onAfterSync: function(){
			$this.publish('Workspace.Entry.updated');
		}
	},

	$server: {
		$disableRpcInstance: true,
		
		$constructor: function(id, workspace){
		    this.localId = id;
			this.id = workspace.entryInstanceId(id);
			$base();
            this.workspace = workspace;
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
		    if (!$jsb.isDefined(value)) {
		        return this.workspace.getEntryProperty(this, path);
		    } else {
		        this.workspace.setEntryProperty(this, path, value);
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

		title: function(title){
			if(title){
				this.name = title;
			}
		    return this.property('title', title);
		},

		description: function(description){
		    return this.property('description', description);
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