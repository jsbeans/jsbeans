{
	$name: 'JSB.Workspace.FolderNode',
	$parent: 'JSB.Workspace.EntryNode',
	$client: {
		$constructor: function(opts){
			var self = this;
			$base(opts);
			this.loadCss('FolderNode.css');
			this.addClass('folderNode');
			
			this.renderer.append('<div class="childCount">(<span></span>)</div>');
			
			this.subscribe('JSB.Workspace.Entry.updated', function(sender){
				if(sender != $this.getEntry()){
					return;
				}
				$this.update();
			});
			
			this.update();
		},
		
		update: function(){
			var childCount = $this.getEntry().getChildCount();
			$this.find('> .renderer > .childCount > span').text(childCount);
			if(childCount == 0){
				$this.find('> .renderer > .childCount').addClass('empty');
			} else {
				$this.find('> .renderer > .childCount').removeClass('empty');
			}
		}
	}
	
}