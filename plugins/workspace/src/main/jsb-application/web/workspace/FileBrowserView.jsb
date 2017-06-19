{
	$name: 'JSB.Workspace.FileBrowserView',
	$parent: 'JSB.Workspace.BrowserView',
	
	$client: {
		$constructor: function(opts){
			$base(opts);
			
			this.loadCss('FileBrowserView.css');
			this.addClass('workspaceFileBrowserView');
			
		},
		
	},
	
	$server: {
	}
}