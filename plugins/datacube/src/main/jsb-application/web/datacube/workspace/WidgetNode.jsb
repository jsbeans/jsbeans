/** DataCube - jsBeans extension | jsbeans.org (MIT Licence) | (c) Special Information Systems, LLC */

{
	$name: 'DataCube.WidgetNode',
	$parent: 'JSB.Workspace.EntryNode',
	$client: {
		$require: ['css:WidgetNode.css'],
		
		$constructor: function(opts){
			$base(opts);
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