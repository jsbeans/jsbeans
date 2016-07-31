JSB({
	name:'Ontoed.Model.Ontology',
	parent: 'Ontoed.Project',
	require: ['Ontoed.Model.Class', 'Ontoed.Model.Axiom', 'Ontoed.Model.ObjectProperty', 'Ontoed.Model.DataProperty', 'Ontoed.Model.AnnotationProperty'],
	
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
			console.log('Cleaning ontology: ' + this.getId());
			
			this.getSuperClass('Ontoed.Project').destroy.call(this);
		},
		
		onAfterSync: function(syncInfo){
			if(syncInfo.isChanged('updateCounter')){
				this.publish('ontologyUpdate');
			}
		}
	},
	
	server: {
		disableRpcInstance: true,
		
		model: null,
		ontology: null,
		
		details: null,
//		functionalExpression: '',
		classHierarchy: {},
		propertyHierarchy: {},
		objectPropertyHierarchy: {},
		dataPropertyHierarchy: {},
		annotationPropertyHierarchy: {},
		iriMap: {},
		entities: {},
		classes: {},
		axioms: {},
		properties: {},
		annotations: {},
		prefixes: {},
		imported: {},
		instances: {},
		

		
		constructor: function(ontoId, onto, w){
			this.base();
			this.setId(ontoId);
			this.ontology = onto,
			this.model = onto.ontologyModel();
			this.workspace = w;
			
			this.axiomProfiler = new JSB.Profiler();
			
			Log.debug('Loading ontology: ' + ontoId);
			this.model.load();
			Log.debug('Ontology ' + ontoId + ' loaded');
			this.updateModel(true);
			
			Log.debug('axiom profiling: ' + this.axiomProfiler.dump());
		},
		
		destroy: function(){
			// TODO: clear entries
			Log.debug('Cleaning ontology: ' + this.ontology.uri());
			
			this.getSuperClass('Ontoed.Project').destroy.call(this);
		},
		
		updateModel: function(bFirstCall){
			var self = this;
			Log.debug('Updating ontology model: ' + this.getId());
			
			var startTs = new Date().getTime();

	        this.prevEntities = this.entities;
	        this.entities = {};
	        this.prevAxioms = this.axioms;
	        this.axioms = {};
	        
	        var profiler = new JSB.Profiler();
	        profiler.probe('ontologyDetails');
	        
	        var ontologyDetails = null;
	        
	        this.locked(function(){
                ontologyDetails = self.model.ontologyDetails();
	        });

	        this.details = ontologyDetails;
	        
//	        // update raw expression
//	        this.functionalExpression = ontologyDetails.functionalExpression;

			// update classes
	        profiler.probe('updateClassTree');
			this.updateClassTree(ontologyDetails.classesTree);
			
			// update object property trees
			profiler.probe('updatePropertyTree');
			this.updatePropertyTree(ontologyDetails.objectPropertiesTree, Ontoed.Model.ObjectProperty, this.objectPropertyHierarchy);
			this.updatePropertyTree(ontologyDetails.dataPropertiesTree, Ontoed.Model.DataProperty, this.dataPropertyHierarchy);
			this.updatePropertyTree(ontologyDetails.annotationPropertiesTree, Ontoed.Model.AnnotationProperty, this.annotationPropertyHierarchy);
			
			// update instances
			profiler.probe('updateInstances');
			this.updateInstances(ontologyDetails.individuals);

	        // update axioms
			profiler.probe('updateAxioms');
			this.updateAxioms(ontologyDetails.axioms);

			// update annotations
			profiler.probe('updateAnnotations');
			this.updateAnnotations(ontologyDetails.annotations);
			
			// update prefixes
			profiler.probe('updatePrefixes');
			this.updatePrefixes(ontologyDetails.prefixes);
			
			// update imported ontologies
			profiler.probe('updateImportedOntologies');
			this.updateImportedOntologies(ontologyDetails);
			
			// remove unexisted objects
			this.removeUnexisted(this.prevEntities);
			this.removeUnexisted(this.prevAxioms);

			
			// entities post update
			profiler.probe('postUpdateEntities');
			this.postUpdateEntities(bFirstCall);
			
			this.updateCounter++;
			
			profiler.probe();
			Log.debug('Ontology model updated: ' + this.getId() + ' in ' + (new Date().getTime() - startTs) + 'ms');
			Log.debug('updateModel profiling: ' + profiler.dump());
			
			if(!bFirstCall){
				this.doSync();
			}
		},
		
		updatePrefixes: function(prefixes){
			this.prefixes = prefixes;
		},
		
		postUpdateEntities: function(bFirstCall){
			for(var i in this.entities){
				this.entities[i].postUpdate(bFirstCall);
			}
		},
		
		removeUnexisted: function(obj){
			for(var id in obj){
				var entity = obj[id];
				
				if(entity.info && entity.info.shortIRI && this.iriMap[entity.info.shortIRI]){
					delete this.iriMap[entity.info.shortIRI];
				}
				
				entity.destroy();
			}
		},
		
		updateImportedOntologies: function(details){
			var self = this;
			var w = self.workspace.getSystemWorkspace();
			this.imported = {};
			
			function scanImported(importedScope, importedDetails){
				if(!JSB().isArray(importedDetails)){
					importedDetails = [importedDetails];
				}
				
				for(var i in importedDetails){
					var det = importedDetails[i];
					importedScope[det.iri] = {
						loaded: det.loaded,
						iri: det.iri
					};
					
					if(det.loaded){
						// obtain system ontology object
						var onto = w.ontologies().byURI(det.iri);
						JSB().merge(importedScope[det.iri],{
							type: 'ontology',
							id: onto.id(),
							file: onto.getProperty('file'),
							title: onto.title(),
							name: onto.uri()
						});
					}
					
					if(det.importedOntologies){
						if(JSB().isArray(det.importedOntologies) && det.importedOntologies.length == 0){
							continue;
						}
						importedScope[det.iri].imported = {};
						scanImported(importedScope[det.iri].imported, det.importedOntologies);
					}
				}
			}
			
			scanImported(this.imported, details.importedOntologies);
		},
		
		updateAnnotations: function(annotations){
			for(var i in annotations){
				var annot = annotations[i];
				this.annotations[annot.md5] = annot;
			}
		},
		
		createAxiom: function(axiom){
			var axDesc = {
				md5: axiom.md5,
				axiomType: axiom.axiomType,
				isAnnotation: axiom.isAnnotation,
				isLogical: axiom.isLogical,
				isImported: axiom.isImported,
				functionalExpression: axiom.functionalExpression,
				type: axiom.type,
				annotations: {},
				signature: {}
			};
			
			var axId = axDesc.md5;
			
			// update signatures
			this.axiomProfiler.probe('updateSignatures');
			for(var s in axiom.signature){
				var sig = axiom.signature[s];
				var id = sig.md5;
				if(!id){
					// TODO: anonymous class
					throw 'Internal error'
				}
				if(this.entities[id]){
					axDesc.signature[id] = this.entities[id];
				} else {
					axDesc.signature[id] = sig;
				}
			}
			
			// update annotations
			this.axiomProfiler.probe('updateAnnotations');
			for(var i in axiom.annotations){
				var annot = axiom.annotations[i];
				axDesc.annotations[annot.md5] = annot;
			}

			this.axiomProfiler.probe('constructAxioms');
			var axInst = JSB().getInstance(this.getId() + '|' + axId);
			if(!axInst){
				axInst = new Ontoed.Model.Axiom(this.getId() + '|' + axId, axDesc, this);
			}
			
			this.axiomProfiler.probe();

			return axInst;
		},
		
		updateAxioms: function(axioms){
			var self = this;
			for(var i = 0; i < axioms.length; i++){
				var axiom = axioms[i];
				Log.debug('Processing axiom: ' + i + ' of ' + axioms.length + ' (' + axiom.md5 + ')');
				
				var axInst = this.createAxiom(axiom);
				
				var axId = axInst.info.md5;
				this.axioms[axId] = axInst;
				if(this.prevAxioms[axId]){
					delete this.prevAxioms[axId];
				}
			}
		},

		createEntity: function(desc){
			var eDesc = {
				md5: desc.md5,
				isAnonymous: desc.isAnonymous,
				isImported: desc.isImported,
				isDeclared: desc.isDeclared,
				isBuiltIn: desc.isBuiltIn,
				isFunctional: desc.isFunctional,
				label: desc.label,
				type: desc.type,
				iri: desc.iri,
				shortIRI: desc.shortIRI,
				manchesterExpression: desc.manchesterExpression,
				functionalExpression: desc.functionalExpression,
				comment: desc.comment,
				annotations: {}
			};
			
			var eId = eDesc.md5;
			
			// update annotations
			for(var i in desc.annotations){
				var annot = desc.annotations[i];
				eDesc.annotations[annot.md5] = annot;
			}
			
			var eInst = JSB().getInstance(this.getId() + '|' + eId);
			
			if(!eInst){
				// create new instance
				var EntityClass = null;
				switch(eDesc.type){
				case 'Class':
					EntityClass = Ontoed.Model.Class;
					break;
				case 'ObjectProperty':
					EntityClass = Ontoed.Model.ObjectProperty;
					break;
				case 'DataProperty':
					EntityClass = Ontoed.Model.DataProperty;
					break;
				case 'AnnotationProperty':
					EntityClass = Ontoed.Model.AnnotationProperty;
					break;
				case 'Individual':
					EntityClass = Ontoed.Model.Instance;
					break;
				default:
					return null;
				}
				eInst = new EntityClass(this.getId() + '|' + eId, eDesc, this);
			} else {
				// update existed instance
				eInst.update(eDesc);
			}
			
			return eInst;
		},
		
		updateInstances: function(individuals){
			var self = this;
			for(var i in individuals){
				var desc = individuals[i];
				var indId = desc.md5;
				
				var indInst = this.createEntity(desc);
				
				self.instances[indId] = indInst;
				self.entities[indId] = indInst;
				self.iriMap[desc.shortIRI] = indInst;
				if(self.prevEntities[indId]){
					delete self.prevEntities[indId];
				}
				
				// update instanceOfClasses
				for(var j in desc.instanceOfClasses){
					var clsId = desc.instanceOfClasses[j].md5;
					var clsInst = self.entities[clsId];
					if(clsInst){
						indInst.instanceOfClasses[clsId] = clsInst;
					}
				}

			}
		},
		
		updateClassTree: function(ct){
			var self = this;
			var entityScopes = {};

			function parseClass(desc, hierarchyScope){
				var clsId = desc.md5;
				var classInst = self.createEntity(desc);

				if(!entityScopes[clsId]){
					entityScopes[clsId] = {
						id: clsId,
						children: {},
						parents: {}
					};
				}
				hierarchyScope[clsId] = entityScopes[clsId];

				self.classes[clsId] = classInst;
				self.entities[clsId] = classInst;
				self.iriMap[desc.shortIRI] = classInst;
				if(self.prevEntities[clsId]){
					delete self.prevEntities[clsId];
				}
				
				for(var i in desc.subClasses){
					
					var chInst = parseClass(desc.subClasses[i], hierarchyScope[clsId].children);
					var chId = chInst.info.md5;
					if(chInst.info.isAnonymous){
						// TODO: generate id for anonymous class
						throw 'ID for anonymous class is not implemented yet';
					}
					hierarchyScope[clsId].children[chId].parents[clsId] = true;
				}
				return classInst;
			}
			
			parseClass(ct, this.classHierarchy);
			
			this.prepareTree(this.classHierarchy);
		},

		updatePropertyTree: function(pt, PropertyClass, additinalHierarchy){
			var self = this;
			var propertyScopes = {};

			function parseProperty(desc, hierarchyScope){
				var pId = desc.md5;
				var pInst = self.createEntity(desc);

				if(!propertyScopes[pId]){
					propertyScopes[pId] = {
						id: pId,
						children: {},
						parents: {}
					};
				}
				hierarchyScope[pId] = propertyScopes[pId];

				self.properties[pId] = pInst;
				self.entities[pId] = pInst;
				self.iriMap[desc.shortIRI] = pInst;
				if(self.prevEntities[pId]){
					delete self.prevEntities[pId];
				}

				
				for(var i in desc.subProperties){
					var chInst = parseProperty(desc.subProperties[i], hierarchyScope[pId].children);
					var chId = chInst.info.md5;
					if(chInst.info.isAnonymous){
						// TODO: generate id for anonymous property
						throw 'ID for anonymous property is not implemented yet';
					}
					hierarchyScope[pId].children[chId].parents[pId] = true;
				}
				return pInst;
			}
			
			for(var i in pt.subProperties){
				parseProperty(pt.subProperties[i], this.propertyHierarchy);
				if(additinalHierarchy){
					parseProperty(pt.subProperties[i], additinalHierarchy);
				}
			}
			
			this.prepareTree(this.propertyHierarchy);
			if(additinalHierarchy){
				this.prepareTree(additinalHierarchy);
			}
			
		},
		
		prepareTree: function(etree){
			var self = this;

			// Collect references
			var refs = {};
			function collectRefs(node){
				if(refs[node.id]){
					return;
				}
				refs[node.id] = node;
				for(var i in node.children){
					collectRefs(node.children[i]);
				}
			}
			for(var i in etree){
				collectRefs(etree[i]);
			}
			
			var omitPerformed = {};
			
			// Omit duplicates
			function omitDuplicates(topNode){
				var pToRemove = [];
				
				// avoid cyclic omitting
				if(omitPerformed[topNode.id]){
					return;
				}
				omitPerformed[topNode.id] = true;
				
				for(var id in topNode.children){
					var chNode = topNode.children[id];
					
					// malformed tree protection
					if(topNode.id == id){
						delete topNode.children[id];
						if(chNode.parents[topNode.id]){
							delete chNode.parents[topNode.id];
						}
					}
					
					if(topNode.parents && Object.keys(topNode.parents).length > 0 && Object.keys(chNode.parents).length > 1){
						// generate parents map
						var pMap = {};
						
						function recursiveCheckParents(rId){
							if(pMap[rId]){
								return;
							}
							pMap[rId] = true;
							var rNode = refs[rId];
							for(var pId in rNode.parents){
								if(chNode.parents[pId]) {
									// remove chNode from pId parent
									pToRemove.push(pId);
								}
								recursiveCheckParents(pId)
							}
						}
						
						recursiveCheckParents(topNode.id);
					}
					
					for(var i in pToRemove){
						var pId = pToRemove[i];
						delete chNode.parents[pId];
						if(refs[pId].children && refs[pId].children[chNode.id]){
							delete refs[pId].children[chNode.id];
						}
					}
				}

				var chIds = [];
				for(var id in topNode.children){
					chIds.push(id);
				}
				for(var i in chIds){
					var id = chIds[i];
					if(topNode.children[id]){
						omitDuplicates(topNode.children[id]);
					}
				}
			}
			
			for(var i in etree){
				omitDuplicates(etree[i]);
			}
		},

		getClassTree: function(){
			return this.classHierarchy;
		},
		
		getClasses: function(){
			return this.classes;
		},
		
		getPropertyTree: function(type){
			if(!type){
				return this.propertyHierarchy;
			}
			switch(type){
			case 'ObjectProperty':
				return this.objectPropertyHierarchy;
				break;
			case 'DataProperty':
				return this.dataPropertyHierarchy;
				break;
			case 'AnnotationProperty':
				return this.annotationPropertyHierarchy;
				break;
			}
		},
		
		getProperties: function(){
			return this.properties;
		},
		
		getAnnotations: function(){
			return this.annotations;
		},
		
		getPrefixes: function(){
			return this.prefixes;
		},
		
		locked: function(callback){
			var locker = JSB().getLocker();
			var mtxName = 'ontologyModify_' + this.getId();
			locker.lock(mtxName);
			var result = null;
			try {
				result = callback.call(this);
			} finally {
				locker.unlock(mtxName);
			}
			return result;
		},
		
		deferredUpdate: function(){
			var self = this;
			JSB().defer(function(){
				self.updateModel();
			}, 100, 'ontologyUpdate_' + this.getId());
		},
		
		savePrefixes: function(prefixes){
			var self = this;
			this.locked(function(){
				self.model.prefixes(prefixes);
				self.save();
				self.deferredUpdate();
			});
			
			return true;
		},

		
		getInfo: function(){
			return {
				title: this.ontology.title(),
				uri: this.ontology.uri()
			};
		},
		
		getStats: function(){
			return this.model.stats();
		},
		
		getImported: function(){
			return this.imported;
		},
		
		insertImports: function(ids){
			var self = this;
			return this.locked(function(){
				for(var i = 0; i < ids.length; i++){
					var onto = self.workspace.ensureOntology(ids[i]);
					self.model.insertImport({iri:onto.ontology.uri()});
				}
				self.save();
				self.deferredUpdate();
				return true;
			});
			return false;
		},

		removeImport: function(id){
			var self = this;
			return this.locked(function(){
				var onto = self.workspace.getSystemWorkspace().ontologies().get(id);
				self.model.removeImport({iri:onto.uri()});
				self.save();
				self.deferredUpdate();
				return true;
			});
			return false;
		},
		
		remove: function(id){
			var self = this;
			
			this.locked(function(){
				self.model.remove({
					md5: id
				})
				self.save();
				self.deferredUpdate();
			});
			
			return true;
		},
		
		saveAxiom: function(tree, oldId){
			var self = this;
			
			var axInst = this.locked(function(){
				var axResArr = self.model.insertAxioms(tree, {
					annotations: false,
	                functionalExpression: true,
	                signature: true
				});
				if(oldId){
					self.model.remove({
						md5: oldId
					})
				}
				
				self.save();
				
				if(axResArr.length == 0){
					throw 'Error in saveAxiom: expected axiom descriptor';
				}
				var axDesc = axResArr[0];
				
				// check up signature entities is existed
				for(var i = 0; i < axDesc.signature.length; i++ ){
					var eDesc = axDesc.signature[i];
					var eId = eDesc.md5;
					if(!self.entities[eId]){
						var eInst = self.createEntity(eDesc);
						if(eInst){
							self.entities[eId] = eInst;
							self.iriMap[eDesc.shortIRI] = eInst;
						}
					}
				}
				
				// create new axiom
				var axInst = self.createAxiom(axDesc);
				self.axioms[axDesc.md5] = axInst;
				
				self.deferredUpdate();

				return axInst;
			});
			
			return axInst;
		},
		
		save: function(){
			var self = this;
			var locker = JSB().getLocker();
			var mtxName = 'ontologySave_' + this.getId();
			JSB().defer(function(){
				self.locked(function(){
					self.model.store();
				});
			}, 500, mtxName);
		}
	}
});