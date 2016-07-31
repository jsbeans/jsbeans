JSB({
	name:'Ontoed.AxiomView',
	parent: 'JSB.Widgets.Widget',
	require: {
	},
	
	client: {
		constructor: function(opts){
			var self = this;
			this.base(opts);
			this.addClass('axiomView');
			this.loadCss('axiomview.css');
			
		}
		
	},
	
	server: {
		
	}
});