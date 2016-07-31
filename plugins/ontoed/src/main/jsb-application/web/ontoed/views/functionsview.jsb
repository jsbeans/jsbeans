JSB({
	name:'Ontoed.FunctionsView',
	parent: 'JSB.Widgets.Widget',
	require: {
	},
	
	client: {
		currentOntology: null,
		
		constructor: function(opts){
			var self = this;
			this.base(opts);
			this.addClass('functionsView');
			this.loadCss('functionsview.css');
			
			this.subscribe('changeWorkspaceElement', function(sender, msg, obj){
				if(!JSB().isInstanceOf(obj, 'Ontoed.Model.SpinOntology')){
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