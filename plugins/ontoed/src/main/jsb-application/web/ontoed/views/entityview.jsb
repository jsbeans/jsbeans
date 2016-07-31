JSB({
	name:'Ontoed.EntityView',
	parent: 'JSB.Widgets.Widget',
	require: {
		'JSB.Widgets.SplitLayoutManager': 'SplitLayoutManager',
		'Ontoed.RendererRepository': 'RendererRepository'
	},
	
	client: {
		currentEntity: null,
	
		constructor: function(opts){
			var self = this;
			this.base(opts);
			this.addClass('entityView');
			
			this.layoutManager = new self.SplitLayoutManager({
				defaultLayout: 'classView',
				layouts: {
					classView: {
						split: 'vertical',
						panes: [{
							size: 0.7,
							widgets: 'entityForm',
						},{
							widgets: 'entityProps',
							caption: true
						}]
					}/*,
					propertyView: {
						split: 'vertical',
						panes: [{
							size: 0.7,
							widgets: 'entityForm',
						},{
							widgets: 'entityProps',
							caption: true
						}]
					}*/
				},
				
				widgets: {
					entityForm: {
						jsb: 'Ontoed.EntityFormView'
					},
					entityProps: {
						jsb: 'Ontoed.EntityPropsView',
						title: 'Свойства'
					}
				}
			});
			
			this.append(this.layoutManager);
			
			this.subscribe('changeCurrentEntity', function(sender, msg, entity){
				if(sender == self){
					return;
				}
				self.setEntity(entity);
			});
		},
		
		setEntity: function(entity){
			var self = this;
			if(self.currentEntity == entity){
				return;
			}
			self.currentEntity = entity;
			var entityRenderer = Ontoed.RendererRepository.createRendererForEntity(self.currentEntity);
/*			
			if(JSB().isInstanceOf(self.currentEntity, 'Ontoed.Model.Class')){
				// switch class view
				self.layoutManager.switchLayout('classView');
			} else if(JSB().isInstanceOf(self.currentEntity, 'Ontoed.Model.Property')){
				// switch property view
				self.layoutManager.switchLayout('propertyView');
			}
*/			
			// set entity renderer into tab
			var tab = self.container.getTab(self.getId());
			var textElt = tab.tab.find('._dwp_tabText');
			var rElt = textElt.find('> .renderer');
			if(rElt.length > 0){
				rElt.jso().destroy();
			}
			textElt.empty().append(entityRenderer.getElement());
		}
	},
	
	server: {
		
	}
});