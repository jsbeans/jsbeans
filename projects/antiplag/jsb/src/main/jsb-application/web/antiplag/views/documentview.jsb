JSB({
	name:'Antiplag.DocumentView',
	parent: 'JSB.Widgets.Widget',
	require: ['JSB.Widgets.ScrollBox', 'Antiplag.DocumentRenderer'],
	
	client: {
		
		constructor: function(opts){
			var self = this;
			this.base(opts);
			this.addClass('documentView');
			this.loadCss('documentview.css');
			
			this.scrollBox = new JSB.Widgets.ScrollBox();
			this.append(this.scrollBox);
			
			this.docRenderer = new Antiplag.DocumentRenderer({document: this.options.document});
			this.scrollBox.append(this.docRenderer);
		}
		
	},
	
	server: {
		
	}
});