JSB({
	name:'Antiplag.Model.Document',
	parent: 'Antiplag.Project',
	require: [],
	
	common: {
		sync: {
			updateCheckInterval: 0
		},
		
		workspace: null,
		updateCounter: 0,
	},

	client: {
		
		constructor: function(opts){
			this.base(opts);
		},

		destroy: function(){
			// TODO: clear entries
			console.log('Cleaning document: ' + this.getId());
			
			this.getSuperClass('Antiplag.Project').destroy.call(this);
		},
		
		onAfterSync: function(syncInfo){
			if(syncInfo.isChanged('updateCounter')){
				this.publish('documentUpdate');
			}
		}
		
	},
	
	server: {
		disableRpcInstance: true,
		
		constructor: function(ontoId, onto, w){
			this.base();
			this.setId(ontoId);
			this.workspace = w;
			
			this.axiomProfiler = new JSB.Profiler();
		},
		
		destroy: function(){
			// TODO: clear entries
			Log.debug('Cleaning document: ' + this.getId());
			
			this.getSuperClass('Antiplag.Project').destroy.call(this);
		},
		
		
		locked: function(callback){
			var locker = JSB().getLocker();
			var mtxName = 'documentModify_' + this.getId();
			locker.lock(mtxName);
			var result = null;
			try {
				result = callback.call(this);
			} finally {
				locker.unlock(mtxName);
			}
			return result;
		}
		

	}
});