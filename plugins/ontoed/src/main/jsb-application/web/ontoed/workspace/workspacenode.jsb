JSB({
	name: 'Ontoed.WorkspaceNode',
	parent: 'JSB.Widgets.Control',
	client: {
		constructor: function(opts){
			this.base(opts);
			this.descriptor = opts.descriptor;
			this.loadCss('workspacenode.css');
			this.addClass('workspaceNode');
		},
		
		getName: function(){
			return this.descriptor.name;
		},
		
		setName: function(name){
			this.descriptor.name = name;
		}
	}
});
