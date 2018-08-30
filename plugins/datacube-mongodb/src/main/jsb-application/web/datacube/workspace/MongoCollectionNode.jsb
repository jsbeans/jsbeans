{
	$name: 'DataCube.MongoCollectionNode',
	$parent: 'JSB.Workspace.EntryNode',
	$client: {
		$constructor: function(opts){
			$base(opts);
			this.addClass('mongoCollectionNode');
		}
	}
}