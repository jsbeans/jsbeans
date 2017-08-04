{
	$name: 'DataCube.SqlTableNode',
	$parent: 'JSB.Workspace.EntryNode',
	$client: {
		$constructor: function(opts){
			$base(opts);
			this.loadCss('SqlTableNode.css');
			this.addClass('sqlTableNode');
			
			this.subscribe('Workspace.Entry.updated', function(){
			});
			
		}
		
		
	}
	
}