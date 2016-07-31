JSB({
	name:'Ontoed.EntityFormView',
	parent: 'JSB.Widgets.Widget',
	require: {
	},
	
	client: {
		constructor: function(opts){
			var self = this;
			this.base(opts);
			this.addClass('entityFormView');
			this.loadCss('entityformview.css');
			
			this.append(#dot{{
				<dwp-control jso="JSB.Widgets.ScrollBox">
					<div class="entityHeader">
						<div class="entityTitle"></div>
						<dwp-control jso="JSB.Widgets.PrimitiveEditor" class="entityIRI" mode="inplace"></dwp-control>
					</div>
					
					<dwp-control jso="JSB.Widgets.GroupBox" class="annotationsGroup" title="Аннотации" collapsible="false">
						<dwp-control jso="Ontoed.AnnotationsEditor"></dwp-control>
					</dwp-control>
					
					<dwp-control jso="JSB.Widgets.GroupBox" class="axiomGroup" title="Аксиомы" collapsible="false">
						<dwp-control jso="Ontoed.AxiomEditor"></dwp-control>
					</dwp-control>
					
				</dwp-control>
			}});
			
			this.subscribe('changeCurrentEntity', function(sender, msg, obj){
				if(!JSB().isInstanceOf(obj, 'Ontoed.Model.Entity')){
					return;
				}
				self.setEntity(obj);
			});
		},
		
		setEntity: function(e){
			var self = this;
			if(this.currentEntity == e){
				return;
			}
			this.currentEntity = e;
			this.titleText = '';
			if(JSB().isInstanceOf(this.currentEntity, 'Ontoed.Model.Class')){
				this.getElement().attr('key','class');
				this.titleText = 'Класс ';
			} else if(JSB().isInstanceOf(this.currentEntity, 'Ontoed.Model.AnnotationProperty')){
				this.getElement().attr('key','annotationProperty');
				this.titleText = 'Аннотационное свойство ';
			} else if(JSB().isInstanceOf(this.currentEntity, 'Ontoed.Model.DataProperty')){
				this.getElement().attr('key','dataProperty');
				this.titleText = 'Свойство с данными ';
			} else if(JSB().isInstanceOf(this.currentEntity, 'Ontoed.Model.ObjectProperty')){
				this.getElement().attr('key','objectProperty');
				this.titleText = 'Объектное свойство ';
			} else if(JSB().isInstanceOf(this.currentEntity, 'Ontoed.Model.Instance')){
				this.getElement().attr('key','instance');
				this.titleText = 'Экземпляр ';
			}
			JSB().deferUntil(function(){
				self.refresh();
			}, function(){
				return self.isContentReady();
			});
			
		},
		
		refresh: function(){
			this.find('.entityTitle').text(this.titleText);
			this.find('.entityIRI').jso().setData(this.currentEntity.info.iri);
			
			var annotationsEditor = this.find('*[jso="Ontoed.AnnotationsEditor"]').jso();
			annotationsEditor.setCurrentEntity(this.currentEntity);
			
			var axiomEditor = this.find('*[jso="Ontoed.AxiomEditor"]').jso();
			axiomEditor.setCurrentEntity(this.currentEntity);
			
		}
	},
	
	server: {
		
	}
});