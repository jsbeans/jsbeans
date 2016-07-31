JSB({
	name:'Ontoed.PropertyHierarchyView',
	parent: 'Ontoed.HierarchyView',
	require: [],
	
	client: {
		
		constructor: function(opts){
			var self = this;
			this.base(opts);
			this.loadCss('propertyhierarchyview.css');
			this.addClass('propertyHierarchyView');
			
			this.subscribe('changeWorkspaceElement', function(sender, msg, obj){
				if(!JSB().isInstanceOf(obj, 'Ontoed.Model.Ontology')){
					return;
				}
				self.setOntology(obj);
			});
		}
		
	},
	
	server: {
		loadTree: function(){
			this.entities = this.currentOntology.properties;
			this.etree = this.currentOntology.propertyHierarchy;
		}

	}
});