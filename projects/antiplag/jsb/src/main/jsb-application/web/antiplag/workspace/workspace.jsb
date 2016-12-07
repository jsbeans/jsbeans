JSB({
	name:'Antiplag.Workspace',
	parent: 'JSB.Widgets.Actor',
	require: ['Antiplag.Model.Document'],
	fixedId: true,
	
	common: {
		sync: true,
		
		wName: null,
		
		getName: function(){
			return this.wName;
		}
	},
	
	client: {
		constructor: function(opts){
			$base(opts);
		},
		
		rename: function(newName, callback){
			var self = this;
			this.server().renameWorkspace(newName, function(res){
				if(res){
					self.wName = newName;
				}
				if(callback){
					callback.call(self, res);
				}
			})
		}
	},
	
	server: {
		disableRpcInstance: true,

		documents: {},
		workspace: null,
		currentDocument: null,
		
		constructor: function(w){
			$base();
			var wId = ''+w.id();
			this.workspace = w;
			this.setId(wId);
			
			try {
				this.workspace.load();
				this.wName = this.workspace.get('wName');
				if(!this.wName || this.wName.length == 0){
					this.wName = 'Мои документы';
					this.workspace.set('wName', this.wName);
					this.workspace.store();
				}
			} catch(e){
				// workspace has not been stored yet
			}
		},
		
		getSystemWorkspace: function(){
			return this.workspace;
		},
		
		setCurrentDocument: function(document){
			this.currentDocument = document;
		},

		getCurrentDocument: function(){
			return this.currentDocument;
		},

		getDocumentsReactor: function(){
		    return this.workspace.reactor(Packages.ru.avicomp.antiplag.DocumentsReactor.getType());
		},
		
		createDocumentFromContent: function(name, category, content, fileName){
			var self = this;
			var locker = JSB().getLocker();
			locker.lock('createDocumentFromContent');
			var document = this.getDocumentsReactor().entry(JSB().generateUid());
			try {
				document.category(category);
				if(fileName){
					document.set('file', fileName);
				}
				document.uri('' + document.id() + '/' + name);
				document.title(name);
				if(fileName){
					document.type(Packages.ru.avicomp.antiplag.DocumentType.valueForFile(fileName));
				} else {
					document.type(Packages.ru.avicomp.antiplag.DocumentType.valueForFile('.txt'));
					document.set('author', Kernel.user());
				}
				var bytes = Packages.javax.xml.bind.DatatypeConverter.parseBase64Binary(content);
				this.getDocumentsReactor().loadArtifactFromBytes(document, bytes);
				this.getDocumentsReactor().extractTexts(document, false);
				
				this.getDocumentsReactor().store(document);
			} catch(e){
				Log.error(true, e);
				this.getDocumentsReactor().remove(document);
				throw e;
			} finally{
				locker.unlock('createDocumentFromContent');
			}

			var self = this;
			JSB().defer(function(){
//				self.getDocumentsReactor().update();
//				self.updateDocuments();
				self.workspace.store();
			}, 300, 'createDocumentFromContent' + this.getId());
			
			return document;
		},
		
		locked: function(callback){
			var locker = JSB().getLocker();
			var mtxName = 'workspaceModify_' + this.getId();
			locker.lock(mtxName);
			var result = null;
			try {
				result = callback.call(this);
			} finally {
				locker.unlock(mtxName);
			}
			return result;
		},
/*		
		createNewDocument: function(name, category, iri, desc){
			var locker = JSB().getLocker();
			locker.lock('createDocumentFromContent');
			var document = this.getDocumentsReactor().entry(JSB().generateUid());
			try {
				document.category(category);
				document.uri(iri);
				document.title(name);
				document.description(desc);
//				document.documentModel().load();
				this.workspace.store();
			} catch(e){
				this.workspace.entries().remove(document.id());
				Log.error(true, e);
				throw e;
			} finally {
				locker.unlock('createDocumentFromContent');
			}
			return document;
		},
*/		

		ensureDocument: function(id){
			var self = this;
			if(!this.documents[id]){
				JSB().getLocker().lock('ensureDocument');
				try {
					if(!this.documents[id]){
						var document = this.getDocumentsReactor().entry(id);
/*						
						if(document.isChanged()) {
						    this.workspace.store();
						}
*/						
						// simple document
						this.documents[id] = new Antiplag.Model.Document(id, document, this);
					}
				} finally {
					JSB().getLocker().unlock('ensureDocument');
				}
			}
			
			return this.documents[id];
		},
		
		exportDocument: function(id, format){
			var document = this.workspace.documents().get(id);
			var model = null;
			if(document.getProperty('spin')){
				model = document.spinModel();
			} else {
				model = document.documentModel();
			}
			return model.export(format);
		},
		
		removeDocument: function(id){
			// remove document model object
			if(this.documents[id]){
				this.documents[id].destroy();
				delete this.documents[id];
			}
			
			// remove from workspace
			var doc = this.getDocumentsReactor().entry(id);
			this.getDocumentsReactor().remove(doc);
			
			this.workspace.store();
			
			return true;
		},
		
		removeCategory: function(category){
			var self = this;
			// remove documents from this category
			var idsToRemove = [];
			this.getDocumentsReactor().entries().forEach(new java.util.function.Consumer() {
                accept: function(document){
                	var cat = document.category();
                	if(cat && cat.indexOf(category) == 0){
                		idsToRemove.push(document.id());
                		
    				}
                }
            });
			for(var i = 0; i < idsToRemove.length; i++){
				self.removeDocument(idsToRemove[i]);
			}
			
			//remove categories
			var categories = utils.javaToJson(this.workspace.get('categories'));
			
			// check categories for new category already existed
			for(var i = categories.length - 1; i >= 0; i-- ){
				if(categories[i].indexOf(category) == 0){
					categories.splice(i, 1);
				}
			}
			this.workspace.set('categories', utils.jsonToJava(categories));
			
			this.workspace.store();
			
			return true;
		},
		
		addCategory: function(category){
			var categories = utils.javaToJson(this.workspace.get('categories'));
			if(!categories){
				categories = [];
				this.workspace.set('categories', utils.jsonToJava(categories));
			}
			for(var i in categories){
				var cat = categories[i];
				if(cat == category){
					return null;
				}
			}
			categories.push(category);
			this.workspace.set('categories', utils.jsonToJava(categories));
			
			var partName = category;
			if(category.lastIndexOf('/') >= 0){
				partName = category.substr(category.lastIndexOf('/') + 1);
			}
			
			this.workspace.store();
			
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
			var categories = utils.javaToJson(this.workspace.get('categories'));
			
			// check categories for new category already existed
			for(var i in categories){
				if(categories[i].indexOf(newCategory) == 0){
					return false;
				}
			}
			
			// rename categories
			for(var i in categories){
				if(categories[i].indexOf(oldCategory) == 0){
					categories[i] = categories[i].replace(oldCategory, newCategory);
				}
			}
			
			this.workspace.set('categories', utils.jsonToJava(categories));
			
			// rename projects
			this.getDocumentsReactor().entries().forEach(new java.util.function.Consumer() {
                accept: function(document){
                	var cat = document.category();
                	if(cat && cat.indexOf(oldCategory) == 0){
    					cat = cat.replace(oldCategory, newCategory);
    				}
                	document.category(cat);
                }
            });
			
			this.workspace.store();
			
			return true;
		},
		
		renameWorkspace: function(newName){
			var t = newName.trim();
			if(t.length < 3 || t.length > 32){
				return false;
			}
			if(!/^[\-_\.\s\wа-я]+$/i.test(t)){
				return false;
			}
			
			try {
				this.workspace.set('wName', t);
				this.wName = t;
				this.workspace.store();
			} catch(e){
				Log.error(true, e);
				return false;
			}
			
			return true;
		},

		moveItems: function(target, sources){
			for(var i in sources){
				var source = sources[i];
				if(source.type == 'document'){
					var document = this.getDocumentsReactor().entry(source.id);
					document.category(target.path);
				} else if(source.type == 'node'){
					var tPath = target.path;
					if(tPath.length > 0){
						tPath += '/';
					}
					var newNodePath = tPath + source.name;
					this.renameCategory(source.path, newNodePath);
				}
			}
			
			this.workspace.store();
			
			return true;
		}
	}
});