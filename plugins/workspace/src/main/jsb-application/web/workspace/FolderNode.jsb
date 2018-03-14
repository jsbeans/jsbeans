{
	$name: 'JSB.Workspace.FolderNode',
	$parent: 'JSB.Workspace.EntryNode',
	$client: {
		$constructor: function(opts){
			var self = this;
			$base(opts);
			this.loadCss('FolderNode.css');
			this.addClass('folderNode');
		}
	}
	
}