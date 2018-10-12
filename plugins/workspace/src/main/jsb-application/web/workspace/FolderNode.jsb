{
	$name: 'JSB.Workspace.FolderNode',
	$parent: 'JSB.Workspace.EntryNode',
	$require: ['JSB.Widgets.Button'],
	$client: {
		$constructor: function(opts){
			var self = this;
			$base(opts);
			$jsb.loadCss('FolderNode.css');
			this.addClass('folderNode');
			
			this.renderer.append('<div class="childCount">(<span></span>)</div>');
			
			var createEntryBtn = new Button({
				cssClass: 'roundButton btnCreate btn10',
				tooltip: 'Создать объект',
				onClick: function(evt){
					$this.explorer.showCreateMenu(evt, true, this);
				}
			});
			$this.toolbox.append(createEntryBtn.getElement());
			
			this.subscribe('JSB.Workspace.Entry.updated', function(sender){
				if(sender != $this.getTargetEntry()){
					return;
				}
				$this.update();
			});
			
			this.update();
		},
		
		update: function(){
			var childCount = $this.getTargetEntry().getChildCount();
			$this.find('> .renderer > .childCount > span').text(childCount);
			if(childCount == 0){
				$this.find('> .renderer > .childCount').addClass('empty');
			} else {
				$this.find('> .renderer > .childCount').removeClass('empty');
			}
		}
	}
}