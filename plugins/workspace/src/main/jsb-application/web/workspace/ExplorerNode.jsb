{
	$name: 'JSB.Workspace.ExplorerNode',
	$parent: 'JSB.Widgets.Control',
	
	descriptor: {},
	explorer: null,
	
	getName: function(){
		return this.descriptor.name;
	},
	
	
	$client: {
		selected: false,
		highlighted: false,
	
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
			
			$this.toolbox = $this.$('<div class="toolbox hidden"></div>');
			$this.append($this.toolbox);
			
			$this.subscribe('Workspace.Explorer.nodeSelected', function(sender, msg, params){
				if(params.node != $this){
					return;
				}
				$this.selected = params.selected;
				$this.updateState();
			});
			
			$this.subscribe('Workspace.Explorer.nodeHighlighted', function(sender, msg, params){
				if(params.node != $this){
					return;
				}
				$this.highlighted = params.selected;
				$this.updateState();
			});
		},
		
		setName: function(name){
			this.descriptor.name = name;
			this.attr('title', this.descriptor.name);
		},
		
		isSelected: function(){
			return this.selected;
		},

		isHighlighted: function(){
			return this.highlighted;
		},
		
		updateState: function(){
			// do nothing, this method should be overriden
		}
	}
	
}