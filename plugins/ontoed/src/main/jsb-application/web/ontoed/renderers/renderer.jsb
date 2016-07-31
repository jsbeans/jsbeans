JSB({
	name: 'Ontoed.Renderer',
	parent: 'JSB.Widgets.Control',
	client: {
		constructor: function(opts){
			var self = this;
			this.base(opts);
			this.addClass('renderer');
			this.loadCss('renderer.css');
		}
		
		
	}
});
