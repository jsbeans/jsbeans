{
	$name: 'JSB.DataCube.SliceNode',
	$parent: 'JSB.Workspace.EntryNode',
	$client: {
		$constructor: function(opts){
			$base(opts);
			this.loadCss('SliceNode.css');
			this.addClass('sliceNode');
			
			this.subscribe('Workspace.Entry.updated', function(){
			});
			
		}
		
		
	}
	
}