{
	$name: 'DataCube.SliceNode',
	$parent: 'JSB.Workspace.EntryNode',
	$client: {
		$constructor: function(opts){
			$base(opts);
			this.addClass('sliceNode');
		}
	}
}