{
	$name: 'JSB.Workspace.ExplorerNode',
	$parent: 'JSB.Widgets.Control',
	
	descriptor: {},
	explorer: null,
	
	getName: function(){
		return this.descriptor.name;
	},
	
	setName: function(name){
		this.descriptor.name = name;
		this.attr('title', this.descriptor.name);
	},
	
	$client: {
		$constructor: function(opts){
			$base(opts);
			if(opts){
				$jsb.merge(this.descriptor, opts.descriptor);
			}
			this.loadCss('ExplorerNode.css');
			this.addClass('workspaceExplorerNode');
			
			this.icon = this.$('<div class="icon"></div>');
			this.append(this.icon);
			this.attr('title', this.descriptor.name);
		},
	}
	
}