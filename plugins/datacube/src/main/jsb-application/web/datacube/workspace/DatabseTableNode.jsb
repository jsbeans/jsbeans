{
	$name: 'DataCube.DatabaseTableNode',
	$parent: 'JSB.Workspace.EntryNode',
	$client: {
		$constructor: function(opts){
			$base(opts);
			this.addClass('databaseTableNode');
		}
	}
}