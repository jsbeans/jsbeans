JSB({
	name:'Ontoed.AxiomEditor',
	parent: 'JSB.Widgets.Widget',
	require: ['Ontoed.RendererRepository', 'JSB.Widgets.Button', 'Ontoed.AxiomRenderer'],
	
	client: {
		currentEntity: null,
		renderers: [],
		
		constructor: function(opts){
			var self = this;
			this.base(opts);
			this.addClass('axiomEditor');
			this.loadCss('axiomeditor.css');
			
			this.toolBar = this.$('<div class="toolbar"></div>');
			this.append(this.toolBar);
			
			var createBtn = new JSB.Widgets.Button({
				cssClass: 'roundButton btnCreate btn16',
				tooltip: 'Добавить аксиому',
				onClick: function(){
					self.createAxiom();
				}
			});
			this.toolBar.append(createBtn.getElement());
			
			this.creatingContainer = this.$('<div class="creatingContainer"></div>');
			this.append(this.creatingContainer);
			
			this.axiomContainer = this.$('<ul class="axiomContainer"></ul>');
			this.append(this.axiomContainer);
			
			this.noItems = this.$('<div class="noItems hidden">Нет аксиом</div>');
			this.append(this.noItems);

		},
		
		createAxiom: function(){
			var self = this;
			var axiomRendererWrapper = self.$('<div class="axiomRendererWrapper editing"></div>');
			this.creatingContainer.prepend(axiomRendererWrapper);
			var axRenderer = new Ontoed.AxiomRenderer({
				context: this.currentEntity,
				ontology: this.currentEntity.ontology,
				allowNavigate: true, 
				edit: true,
				onComplete: function(axiom){
					if(axiom){
						// move renderer into main group
						var values = null;
						var axWrapper = self.axiomContainer.find('li.axiomWrapper[key="'+axiom.info.axiomType+'"]');
						if(axWrapper.length > 0){
							values = axWrapper.find('> ul.values');
						} else {
							axWrapper = self.$('<li class="axiomWrapper" key="'+axiom.info.axiomType+'"><div class="type">'+axiom.info.axiomType+'</div></li>');
							self.axiomContainer.append(axWrapper);
							values = self.$('<ul class="values"></ul>');
							axWrapper.append(values);
						}
						values.append(self.createAxiomRendererWrapper(axiom, axRenderer, axWrapper));
						self.noItems.addClass('hidden');
						
					} else {
						if(self.axiomContainer.find('> li').length === 0){
							self.noItems.removeClass('hidden');
						}
					}
					axiomRendererWrapper.remove();
				}
			});
			axiomRendererWrapper.append(axRenderer.getElement());
			this.renderers.push(axRenderer);
			this.noItems.addClass('hidden');
		},

		setCurrentEntity: function(entity){
			if(this.currentEntity == entity){
				return;
			}
			if(!JSB().isInstanceOf(entity, 'Ontoed.Model.Entity')){
				return;
			}
			this.currentEntity = entity;
			this.refresh();
		},
		
		refresh: function(){
			var self = this;
			var ontology = this.currentEntity.ontology;
			if(!ontology){
				throw 'Internal error: ontology is not defined';
			}
			
			self.getElement().loader();
			this.server.loadRequiredAxioms(this.currentEntity, function(axMap){
				self.getElement().loader('hide');
				self.draw(axMap);
			});
			
		},
		
		draw: function(axMap){
			var self = this;
			// remove old renderers
			for(var i in this.renderers){
				this.renderers[i].destroy();
			}
			this.renderers = [];
			this.axiomContainer.empty();
			this.creatingContainer.empty();
			
			// sort axioms
			var axiomArr = [];
			for(var axType in axMap){
				axiomArr.push(axType);
			}
			axiomArr.sort();
			
			for(var i in axiomArr){
				var axType = axiomArr[i];
				var axList = axMap[axType];
				
				var axiomWrapper = this.$('<li class="axiomWrapper" key="'+axType+'"><div class="type">'+axType+'</div></li>');
				this.axiomContainer.append(axiomWrapper);
				
				var values = this.$('<ul class="values"></ul>');
				axiomWrapper.append(values);
				for(var j in axList){
					var axiom = axList[j];
					(function(ax, axWrapper){
						var renderer = Ontoed.RendererRepository.createRendererForEntity(ax, {
							context: self.currentEntity, 
							allowNavigate: true, 
							ontology: self.currentEntity.ontology
						});
						self.renderers.push(renderer);
						
						values.append(self.createAxiomRendererWrapper(ax, renderer, axWrapper));
					})(axiom, axiomWrapper);
				}
			}
			
			if(axiomArr.length === 0){
				this.noItems.removeClass('hidden');
			} else {
				this.noItems.addClass('hidden');
			}
		},
		
		createAxiomRendererWrapper: function(ax, renderer, axWrapper){
			var self = this;
			var axiomRendererWrapper = self.$('<li class="axiomRendererWrapper"></li>');
			
			axiomRendererWrapper.append(renderer.getElement());
			
			if(ax.info.isImported){
				axiomRendererWrapper.addClass('imported');
			} else {
				var editBtn = new JSB.Widgets.Button({
					cssClass: 'roundButton btnEdit btn10',
					tooltip: 'Редактировать',
					onClick: function(){
						axiomRendererWrapper.addClass('editing');
						renderer.beginEdit();
					}
				});
				var deleteBtn = new JSB.Widgets.Button({
					cssClass: 'roundButton btnDelete btn10',
					tooltip: 'Удалить',
					onClick: function(){
						self.removeAxiom(ax, axiomRendererWrapper, axWrapper);
					}
				});
				
				renderer.setOption('onComplete', function(){
					axiomRendererWrapper.removeClass('editing');
				});
				
				axiomRendererWrapper
					.append(editBtn.getElement())
					.append(deleteBtn.getElement());

			}
			
			return axiomRendererWrapper;
		},
		
		removeAxiom: function(axiom, rendererWrapper, axiomWrapper){
			var onto = this.currentEntity.ontology;
			onto.server.remove(axiom.info.md5, function(res){
				if(res){
					rendererWrapper.remove();
					if(axiomWrapper.find('> ul.values > li').length == 0){
						axiomWrapper.remove();
					}
				}
			})
		}
		
	},
	
	server: {
		loadRequiredAxioms: function(entity){
			var axMap = {};
			var allAxioms = entity.getAxioms();
			
			var skipTypes = [];
			
			if(JSB().isInstanceOf(entity, 'Ontoed.Model.Class')){
				skipTypes = [
				             'ClassAssertion', 
/*				             'DataPropertyDomain', 
				             'ObjectPropertyDomain',
				             'AnnotationPropertyDomain',
				             'AnnotationAssertion',
				             'ObjectPropertyAssertion',
				             'DataPropertyAssertion',
				             'NegativeObjectPropertyAssertion',
				             'SameIndividual',
				             'DifferentIndividuals'*/];
			} else if(JSB().isInstanceOf(entity, 'Ontoed.Model.Property')){
				skipTypes = [
/*				             'ClassAssertion', 
				             'AnnotationAssertion',
				             'ObjectPropertyAssertion',
				             'DataPropertyAssertion',
				             'NegativeObjectPropertyAssertion',
				             'SameIndividual',
				             'DifferentIndividuals'*/];
			} else if(JSB().isInstanceOf(entity, 'Ontoed.Model.Instance')){
				skipTypes = [
/*				             'AnnotationAssertion',
				             'ObjectPropertyAssertion',
				             'DataPropertyAssertion',
				             'NegativeObjectPropertyAssertion'*/];
			}
			
			var skipMap = {};
			for(var i in skipTypes){
				skipMap[skipTypes[i]] = true;
			}
			
			// group by type
			for(var axId in allAxioms){
				var ax = allAxioms[axId];
				var axType = ax.info.axiomType;
				if(skipMap[axType]){
					continue;
				}

				if(axType == 'SubClassOf' || axType == 'SubObjectPropertyOf' || axType == 'SubDataPropertyOf' || axType == 'SubAnnotationPropertyOf'){
					// resolve the parent and child
					if(ax.info.resolver.type != axType || !ax.info.resolver.items || ax.info.resolver.items.length != 2){
						throw 'loadRequiredAxioms error: internal resolver error';
					}
					if(ax.info.resolver.items[1] == entity){
						// this is a parent - skipping
						continue;
					}
				}
				
				if(!axMap[axType]){
					axMap[axType] = {};
				}
				
				axMap[axType][axId] = ax;
				
			}
			
			return axMap;
		},
		
		
	}
});