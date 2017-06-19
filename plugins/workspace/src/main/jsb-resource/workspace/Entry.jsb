{
	$name: 'JSB.Workspace.Entry',
	$fixedId: true,
	
	$sync: {
		updateCheckInterval: 0
	},
	
	localId: null,
	
	getLocalId: function(){
		return this.localId;
	},

	$server: {
		$constructor: function(id, workspace){
		    this.localId = id;
			this.id = workspace.entryInstanceId(id);
			$base();
            this.workspace = workspace;
            if (!this.property('id')) this.property('id', this.localId);
            if (!this.property('fullId')) this.property('fullId', this.id);
		},

		remove: function(){
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
		    return this.property('category', cat);
		},

		title: function(title){
		    return this.property('title', title);
		},

		description: function(description){
		    return this.property('description', description);
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