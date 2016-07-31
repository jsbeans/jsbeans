JSB({
	name:'Ontoed.DiagramView',
	parent: 'JSB.Widgets.Widget',
	require: {
		'Ontoed.Diagram': 'Diagram'
	},
	
	client: {
		currentOntology: null,
		
		constructor: function(opts){
			var self = this;
			this.base(opts);
			this.addClass('diagramView');
			this.loadCss('diagramview.css');
			
			this.diagram = new self.Diagram();
			this.append(this.diagram);
			
			this.subscribe('changeWorkspaceElement', function(sender, msg, obj){
				if(!JSB().isInstanceOf(obj, 'Ontoed.Model.Ontology')){
					return;
				}
				self.setOntology(obj);
			});
		},
		
		setOntology: function(onto){
			var self = this;
			if(this.currentOntology == onto){
				return;
			}
			this.currentOntology = onto;
		}
		
	},
	
	server: {
		
	}
});