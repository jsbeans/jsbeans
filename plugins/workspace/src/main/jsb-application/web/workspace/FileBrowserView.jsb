{
	$name: 'JSB.Workspace.FileBrowserView',
	$parent: 'JSB.Workspace.BrowserView',
	
	$client: {
		$require: ['css:FileBrowserView.css'],
		$constructor: function(opts){
			$base(opts);
			this.addClass('workspaceFileBrowserView');
		},
		
		refresh: function(){}
		
	},
	
	$server: {
		$require: 'JSB.Workspace.WorkspaceController',
		$bootstrap: function(){
			WorkspaceController.registerBrowserView(null, this, {
				priority: 0,
				acceptNode: [null, 'JSB.Workspace.FolderNode'],
				caption: 'Файлы'
			});
		},
	}
}