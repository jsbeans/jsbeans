{
	$name: 'JSB.Workspace.ExplorerNode',
	$parent: 'JSB.Widgets.Control',
	
	descriptor: {},
	explorer: null,
	
	getName: function(){
		return this.descriptor.name;
	},
	
	getExplorer: function(){
		return this.explorer;
	},
	
	
	$client: {
		$require: ['css:ExplorerNode.css'],
		selected: false,
		highlighted: false,
	
		$constructor: function(opts){
			$base(opts);
			if(opts){
				$jsb.merge(this.descriptor, opts.descriptor);
			}
			this.addClass('workspaceExplorerNode');
			
			this.attr('title', this.getName());
			
			$this.toolbox = $this.$('<div class="toolbox hidden"></div>');
			$this.append($this.toolbox);
			
			$this.subscribe('JSB.Workspace.Explorer.nodeSelected', function(sender, msg, params){
				if(params.node != $this){
					return;
				}
				$this.selected = params.selected;
				$this.updateState();
			});
			
			$this.subscribe('JSB.Workspace.Explorer.nodeHighlighted', function(sender, msg, params){
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
		
		setColored: function(bColored){
			if(bColored){
				this.addClass('nodeColored');
			} else {
				this.removeClass('nodeColored');
			}
		},
		
		updateState: function(){
			// do nothing, this method should be overriden
		}
	}
	
}