{
	$name: 'DataCube.SliceNode',
	$parent: 'JSB.Workspace.EntryNode',
	$client: {
		$constructor: function(opts){
			$base(opts);
			this.loadCss('SliceNode.css');
			this.addClass('sliceNode');
		}
	}
}