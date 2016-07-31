JSB({
	name:'Ontoed.AnnotationsEditor',
	parent: 'JSB.Widgets.Widget',
	require: ['Ontoed.RendererRepository'],
	
	client: {
		currentEntity: null,
		annotations: {},
		renderers: [],
		
		constructor: function(opts){
			this.base(opts);
			this.addClass('annotationsEditor');
			this.loadCss('annotationseditor.css');
			this.annotationContainer = this.$('<ul class="annotationContainer"></ul>');
			this.append(this.annotationContainer);
			this.noItems = this.$('<div class="noItems hidden">Нет аннотаций</div>');
			this.append(this.noItems);
		},
		
		setCurrentEntity: function(entity){
			if(this.currentEntity == entity){
				return;
			}
			this.currentEntity = entity;
			this.refresh();
		},
		
		refresh: function(){
			this.updateAnnotations();
		},
		
		updateAnnotations: function(){
			var self = this;
			if(JSB().isInstanceOf(this.currentEntity, 'Ontoed.Model.Ontology')){
				// load annotations from ontology
				this.getElement().loader();
				this.currentEntity.server.getAnnotations(function(annotations){
					self.getElement().loader('hide');
					self.annotations = annotations;
					self.draw();
				});
			} else if(JSB().isInstanceOf(this.currentEntity, 'Ontoed.Model.Entity')){
				// load annotations from entity
				self.annotations = this.currentEntity.info.annotations;
				self.draw();
			}
		},
		
		draw: function(){
			// remove old renderers
			for(var i in this.renderers){
				this.renderers[i].destroy();
			}
			this.renderers = [];
			this.annotationContainer.empty();
			
			// group annotations
			var annotationMap = {};
			for(var i in this.annotations){
				var annot = this.annotations[i];
				var annotIri = annot.property.shortIRI;
				if(!annotationMap[annotIri]){
					annotationMap[annotIri] = [];
				}
				annotationMap[annotIri].push(annot);
			}
			
			// sort annotations
			var annotationArr = [];
			for(var iri in annotationMap){
				annotationArr.push(iri);
			}
			annotationArr.sort();
			
			for(var i in annotationArr){
				var iri = annotationArr[i];
				var annotationWrapper = this.$('<li class="annotationWrapper"><div class="property">'+iri+'</div></li>');
				this.annotationContainer.append(annotationWrapper);
				var annotaionArr = annotationMap[iri];
				var values = this.$('<ul class="values"></ul>');
				annotationWrapper.append(values);
				for(var i in annotaionArr){
					var annotation = annotaionArr[i];
					var renderer = Ontoed.RendererRepository.createRendererFor(annotation.value);
					if(renderer){
						this.renderers.push(renderer);
						values.append(this.$('<li class="value"></li>').append(renderer.getElement()));
					}
				}
			}
			
			if(annotationArr.length === 0){
				this.noItems.removeClass('hidden');
			} else {
				this.noItems.addClass('hidden');
			}
		}
		

	},
	
	server: {
		
	}
});