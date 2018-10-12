{
	$name: 'DataCube.WidgetNode',
	$parent: 'JSB.Workspace.EntryNode',
	$client: {
		$constructor: function(opts){
			$base(opts);
			$jsb.loadCss('WidgetNode.css');
			this.addClass('widgetNode');
			
			this.subscribe('JSB.Workspace.Entry.updated', function(sender){
				if(sender != $this.getTargetEntry()){
					return;
				}
				$this.update();
			});
			
			$this.update();
		},
		
		update: function(){
			if($this.getTargetEntry().isUnused()){
				this.addClass('unused');
			} else {
				this.removeClass('unused');
			}
		}
	}
}