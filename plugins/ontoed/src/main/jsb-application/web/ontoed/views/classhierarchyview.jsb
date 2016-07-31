JSB({
	name:'Ontoed.ClassHierarchyView',
	parent: 'Ontoed.HierarchyView',
	require: [],
	
	client: {
		
		constructor: function(opts){
			var self = this;
			this.base(opts);
			this.loadCss('classhierarchyview.css');
			this.addClass('classHierarchyView');
			
			this.subscribe('changeWorkspaceElement', function(sender, msg, obj){
				if(!JSB().isInstanceOf(obj, 'Ontoed.Model.Ontology')){
					return;
				}
				self.setOntology(obj);
			});
		},
		
		
	},
	
	server: {
		loadTree: function(){
			this.entities = this.currentOntology.classes;
			this.etree = this.currentOntology.classHierarchy;
		}
	}
});