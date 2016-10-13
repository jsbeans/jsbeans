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
		
		ontologies: {},
		workspace: null,
		currentOntology: null,
		
		constructor: function(w){
			this.base();
			var wId = w.name();
			this.workspace = w;
			this.setId(wId);
			
			try {
				this.workspace.load();
				this.wName = this.workspace.getProperty('wName');
				if(!this.wName || this.wName.length == 0){
					this.wName = 'Мои онтологии';
					this.workspace.setProperty('wName', this.wName);
					this.workspace.store();
				}
			} catch(e){
				// workspace has not been stored yet
			}
		},
		
		getSystemWorkspace: function(){
			return this.workspace;
		},
		
		createOntologyFromContent: function(name, category, content){
			var self = this;
			var locker = JSB().getLocker();
			locker.lock('createOntologyFromContent');
			var ontology = this.workspace.ontologies().createById(JSB().generateUid());
			ontology.category(category);
			ontology.setProperty('file', name);
			try {
				var model = ontology.ontologyModel();
				model.loadContent(content,{
					isolated: true
				});
				
				// check ontology is spin ontology
				var opts = {
					imports: true,
					axioms: false,
					signature: false,
					annotations:  false,
					individuals: false,
					entities: false,
					classesTree: false,
					objectPropertiesTree: false,
					dataPropertiesTree: false,
					annotationPropertiesTree: false
				};
				var ontologyDetails = null;
				this.locked(function(){
	                ontologyDetails = model.ontologyDetails(opts);
		        });
				
				var importedOntologies = ontologyDetails.importedOntologies;
				var spinUri = '' + Packages.ru.avicomp.spinmap.external.vocabulary.TOPBRAID_SPIN.BASE_URI.toString();
				for(var i in importedOntologies){
					var det = importedOntologies[i];
					if(det.iri.toLowerCase() == spinUri.toLowerCase()){
						ontology.setProperty('spin', {
							enabled: true
						});
						break;
					}
				}
				
				model.store();
				this.workspace.store();
			} catch(e){
				this.workspace.ontologies().remove(ontology.id());
				Log.error(true, e);
				throw e;
			} finally{
				locker.unlock('createOntologyFromContent');
			}
			
			JSB().defer(function(){
				self.workspace.ontologies().reactor().resolveImports();
				self.updateOntologies();
				self.workspace.store();
			}, 300, 'createOntologyFromContent' + this.getId());
			
			return ontology;
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
		
		createNewOntology: function(name, category, iri, desc){
			var locker = JSB().getLocker();
			locker.lock('createOntologyFromContent');
			var ontology = this.workspace.ontologies().createById(JSB().generateUid());
			try {
				ontology.category(category);
				ontology.uri(iri);
				ontology.title(name);
				ontology.description(desc);
				ontology.ontologyModel().load();
				this.workspace.store();
			} catch(e){
				this.workspace.ontologies().remove(ontology.id());
				Log.error(true, e);
				throw e;
			} finally {
				locker.unlock('createOntologyFromContent');
			}
			return ontology;
		},
		
		createNewSpinOntology: function(name, category, iri, desc){
			var locker = JSB().getLocker();
			locker.lock('createOntologyFromContent');
			var ontology = this.workspace.ontologies().createById(JSB().generateUid());
			try {
				ontology.category(category);
				ontology.uri(iri);
				ontology.title(name);
				ontology.description(desc);
				
				ontology.setProperty('spin', {
					enabled: true
				});
				ontology.ontologyModel().load();
				this.workspace.store();
			} catch(e){
				this.workspace.ontologies().remove(ontology.id());
				Log.error(true, e);
				throw e;
			} finally {
				locker.unlock('createOntologyFromContent');
			}
			return ontology;
		},
		
		updateOntologies: function(){
			for(var id in this.ontologies){
				this.ontologies[id].updateModel();
			}
		},
		
		ensureOntology: function(id){
			var self = this;
			if(!this.ontologies[id]){
				JSB().getLocker().lock('ensureOntology');
				try {
					if(!this.ontologies[id]){
						var ontology = this.workspace.ontologies().get(id);
						if(!ontology){
							ontology = this.workspace.ontologies().createById(id);
							this.workspace.store();
						}
						if(ontology.getProperty('spin')){
							this.ontologies[id] = new Ontoed.Model.SpinOntology(id, ontology, this);
						} else {
							// simple ontology
							this.ontologies[id] = new Ontoed.Model.Ontology(id, ontology, this);
						}
					}
				} finally {
					JSB().getLocker().unlock('ensureOntology');
				}
			}
			
			return this.ontologies[id];
		},
		
		exportOntology: function(id, format){
			var ontology = this.workspace.ontologies().get(id);
			var model = null;
			if(ontology.getProperty('spin')){
				model = ontology.spinModel();
			} else {
				model = ontology.ontologyModel();
			}
			return model.export(format);
		},
		
		removeOntology: function(id){
			// remove ontology model object
			if(this.ontologies[id]){
				this.ontologies[id].destroy();
				delete this.ontologies[id];
			}
			
			// remove from workspace
			this.workspace.ontologies().remove(id);
			
			this.workspace.store();
			
			return true;
		},
		
		removeCategory: function(category){
			// remove ontologies from this category
			var ontologies = this.workspace.ontologies();
			var ontoIds = ontologies.ids();
			for(var i in ontoIds){
				var id = ontoIds[i];
				var onto = ontologies.get(id);
				var cat = onto.category();
				if(cat && cat.indexOf(category) == 0){
					this.removeOntology(id);
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
			var ontologies = this.workspace.ontologies();
			var ontoIds = ontologies.ids();
			for(var i in ontoIds){
				var id = ontoIds[i];
				var onto = ontologies.get(id);
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
				var onto = ontologies.get(id);
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
				this.workspace.setProperty('wName', t);
				this.wName = t;
				this.workspace.store();
			} catch(e){
				Log.error(true, e);
				return false;
			}
			
			return true;
		},

		moveItems: function(target, sources){
			var ontologies = this.workspace.ontologies();
			
			for(var i in sources){
				var source = sources[i];
				if(source.type == 'ontology'){
					var onto = ontologies.get(source.id);
					onto.category(target.path);
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