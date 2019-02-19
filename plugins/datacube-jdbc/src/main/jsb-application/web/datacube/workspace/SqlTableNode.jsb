{
	$name: 'DataCube.SqlTableNode',
	$parent: 'DataCube.DatabaseTableNode',
	$client: {
		$constructor: function(opts){
			$base(opts);
			this.addClass('sqlTableNode');
		}
	}
}