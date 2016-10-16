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
			this.base(opts);
		},
		
		rename: function(newName, callback){
			var self = this;
			this.server.renameWorkspace(newName, function(res){
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
			this.base();
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
		
		createDocumentFromContent: function(name, category, content){
			var locker = JSB().getLocker();
			locker.lock('createDocumentFromContent');
			var document = this.getDocumentsReactor().entry(JSB().generateUid());
			document.category(category);
			document.setProperty('file', name);
			try {
				document.store();
				this.workspace.store();
			} catch(e){
				this.workspace.entries().remove(document.id());
				Log.error(true, e);
				throw e;
			} finally{
				locker.unlock('createDocumentFromContent');
			}

			var self = this;
			JSB().defer(function(){
//				self.getDocumentsReactor().update();
				self.updateDocuments();
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
		
		createNewDocument: function(name, category, iri, desc){
			var locker = JSB().getLocker();
			locker.lock('createDocumentFromContent');
			var document = this.workspace.getDocumentsReactor().entry(JSB().generateUid());
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
		
		createNewSpinDocument: function(name, category, iri, desc){
			var locker = JSB().getLocker();
			locker.lock('createNewSpinDocument');
			var document = this.workspace.getDocumentsReactor().entry(JSB().generateUid());
			try {
				document.category(category);
				document.uri(iri);
				document.title(name);
				document.description(desc);
				
				document.set('spin', {
					enabled: true
				});
				document.documentModel().load();
				this.workspace.store();
			} catch(e){
				this.workspace.getDocumentsReactor().remove(document.id());
				Log.error(true, e);
				throw e;
			} finally {
				locker.unlock('createNewSpinDocument');
			}
			return document;
		},
		
		updateOntologies: function(){
			for(var id in this.documents){
				this.documents[id].updateModel();
			}
		},
		
		ensureDocument: function(id){
			var self = this;
			if(!this.documents[id]){
				JSB().getLocker().lock('ensureDocument');
				try {
					if(!this.documents[id]){
						var document = this.workspace.getDocumentsReactor().entry(id);
						if(document.isChanged()) {
						    this.workspace.store();
						}
						if(document.get('spin')){
							this.documents[id] = new Antiplag.Model.SpinDocument(id, document, this);
						} else {
							// simple document
							this.documents[id] = new Antiplag.Model.Document(id, document, this);
						}
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
			this.workspace.documents().remove(id);
			
			this.workspace.store();
			
			return true;
		},
		
		removeCategory: function(category){
			// remove documents from this category
			var documents = this.workspace.documents();
			var ontoIds = documents.ids();
			for(var i in ontoIds){
				var id = ontoIds[i];
				var onto = documents.get(id);
				var cat = onto.category();
				if(cat && cat.indexOf(category) == 0){
					this.removeDocument(id);
				}
			}
			
			//remove categories
			var categories = this.workspace.getProperty('categories');
			
			// check categories for new category already existed
			for(var i = categories.length - 1; i >= 0; i-- ){
				if(categories[i].indexOf(category) == 0){
					categories.splice(i, 1);
				}
			}
			
			this.workspace.store();
			
			return true;
		},
		
		addCategory: function(category){
			var categories = this.workspace.getProperty('categories');
			if(!categories){
				categories = [];
				this.workspace.setProperty('categories', categories);
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
			var categories = this.workspace.getProperty('categories');
			
			// check categories for new category already existed
			for(var i in categories){
				if(categories[i].indexOf(newCategory) == 0){
					return false;
				}
			}

			// check projects for new category already existed
			var documents = this.workspace.documents();
			var ontoIds = documents.ids();
			for(var i in ontoIds){
				var id = ontoIds[i];
				var onto = documents.get(id);
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
			for(var i in ontoIds){
				var id = ontoIds[i];
				var onto = documents.get(id);
				var cat = onto.category();
				if(cat && cat.indexOf(oldCategory) == 0){
					cat = cat.replace(oldCategory, newCategory);
				}
				onto.category(cat);
			}
			
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
			var documents = this.workspace.documents();
			
			for(var i in sources){
				var source = sources[i];
				if(source.type == 'document'){
//					var onto = this.getOwlReactor().ontology(source.id);
//					onto.category(target.path);
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