{
	$name: 'DataCube.SqlTableNode',
	$parent: 'JSB.Workspace.EntryNode',
	$client: {
		$constructor: function(opts){
			$base(opts);
			this.addClass('sqlTableNode');
		}
	}
}