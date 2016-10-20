JSB({
	name:'Antiplag.Model.Document',
	parent: 'Antiplag.Model.Project',
	require: [],
	
	common: {
		sync: {
			updateCheckInterval: 0
		},
		
		workspace: null,
		info: {},
		
		updateCounter: 0,
		
		getTitle: function(){
			return this.info.title;
		},
		
		getType: function(){
			return this.info.type;
		}
	},

	client: {
		
		constructor: function(opts){
			this.base(opts);
		},

		destroy: function(){
			// TODO: clear entries
			console.log('Cleaning document: ' + this.getId());
			
			this.getSuperClass('Antiplag.Model.Project').destroy.call(this);
		},
		
		onAfterSync: function(syncInfo){
			if(syncInfo.isChanged('updateCounter')){
				this.publish('documentUpdate');
			}
		}
		
	},
	
	server: {
		disableRpcInstance: true,
		document: null,
		
		constructor: function(id, doc, w){
			this.base();
			this.setId(id);
			this.workspace = w;
			this.document = doc;
			
			// load attributes
            this.info.uri = ''+this.document.uri();
            this.info.file = this.info.uri.substr(this.info.uri.lastIndexOf('/') + 1);
            
            var attributesJavaMap = this.document.plaintextAttributes();
            var attributes = utils.javaToJson(attributesJavaMap);
            
            this.info.type = this.document.type();
            this.info.title = this.document.title() || attributes.Title || attributes.title || this.info.file;
            this.info.author = attributes.Author || attributes.Creator;
		},
		
		destroy: function(){
			// TODO: clear entries
			Log.debug('Cleaning document: ' + this.getId());
			
			this.getSuperClass('Antiplag.Model.Project').destroy.call(this);
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
		},
		
		getPlainText: function(){
			var documentsReactor = Antiplag.WorkspaceManager.getDocumentsReactor(this.workspace.workspace);
			var plaintext = '' + documentsReactor.readPlaintextAsString(this.document);
			
			return plaintext;
		},
		
		saveText: function(txt){
			this.workspace.getDocumentsReactor().loadArtifactFromText(this.document, txt);
			this.workspace.getDocumentsReactor().extractTexts(this.document, true);
			this.workspace.getDocumentsReactor().store(this.document);
		}
		

	}
});