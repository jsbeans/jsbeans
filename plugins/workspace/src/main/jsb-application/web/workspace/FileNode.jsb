{
	$name: 'JSB.Workspace.FileNode',
	$parent: 'JSB.Workspace.EntryNode',
	$require: {
		Editor: 'JSB.Widgets.PrimitiveEditor',
		Button: 'JSB.Widgets.Button'
	},
	$client: {
		$constructor: function(opts){
			var self = this;
			$base(opts);
			this.loadCss('FileNode.css');
			this.addClass('fileNode');
		}
	}
	
}