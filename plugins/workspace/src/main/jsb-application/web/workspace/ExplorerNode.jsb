{
	$name: 'JSB.Workspace.ExplorerNode',
	$parent: 'JSB.Widgets.Control',
	
	descriptor: {},
	
	getName: function(){
		return this.descriptor.name;
	},
	
	setName: function(name){
		this.descriptor.name = name;
	},
	
	$client: {
		$constructor: function(opts){
			$base(opts);
			if(opts){
				$jsb.merge(this.descriptor, opts.descriptor);
			}
			this.loadCss('ExplorerNode.css');
			this.addClass('workspaceExplorerNode');
		},
	}
	
}