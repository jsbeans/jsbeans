{
	$name: 'JSB.Workspace.FileNode',
	$parent: 'JSB.Workspace.EntryNode',
	$client: {
		$constructor: function(opts){
			var self = this;
			$base(opts);
			this.loadCss('FileNode.css');
			this.addClass('fileNode');
		}
	}
	
}