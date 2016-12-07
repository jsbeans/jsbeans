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
			$base(opts);
		},

		destroy: function(){
			// TODO: clear entries
			console.log('Cleaning document: ' + this.getId());
			$base();
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
			$base();
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
			$base();
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
			
			// prepare document
			var newPlainText = '';
			var pArr = plaintext.split('\n');
			for(var i = pArr.length - 1; i >= 0 ; i--){
				if(!pArr[i] || pArr[i].length === 0){
					pArr.splice(i, 1);
				}
			}
			for(var i = 0; i < pArr.length; i++){
				if(pArr[i] && pArr[i].length > 0){
					newPlainText += pArr[i];
				}
				if(i < pArr.length - 1){
					if((pArr[i + 1].length > 0 && pArr[i + 1][0] == pArr[i + 1][0].toUpperCase() && pArr[i][pArr[i].length - 1] != ',')
						/*||(pArr[i].length > 0 && (pArr[i][pArr[i].length - 1] == '.' || pArr[i][pArr[i].length - 1] == ';' || pArr[i][pArr[i].length - 1] == ':' || pArr[i][pArr[i].length - 1] == '?' || pArr[i][pArr[i].length - 1] == '!'))*/){
						newPlainText += '\n';
					} else {
						if(!/\s/.test(pArr[i][pArr[i].length - 1]) && !/\s/.test(pArr[i + 1][0])){
							newPlainText += ' ';
						}
					}
				}
			}
			
			
			return newPlainText;
		},
		
		saveText: function(txt){
			this.workspace.getDocumentsReactor().loadArtifactFromText(this.document, txt);
			this.workspace.getDocumentsReactor().extractTexts(this.document, true);
			this.workspace.getDocumentsReactor().store(this.document);
		}
		

	}
});