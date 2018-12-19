{
	$name: 'JSB.Workspace.FolderBrowserView',
	$parent: 'JSB.Workspace.BrowserView',
	
	$client: {
		$require: ['css:FolderBrowserView.css'],
		$constructor: function(opts){
			$base(opts);
			this.addClass('workspaceFolderBrowserView');
		},
		
		refresh: function(){}
		
	},
	
	$server: {
		$require: 'JSB.Workspace.WorkspaceController',
		$bootstrap: function(){
			WorkspaceController.registerBrowserView(null, this, {
				priority: 0,
				acceptNode: [null, 'JSB.Workspace.FolderNode'],
				acceptEntry: [null, 'JSB.Workspace.FolderEntry'],
				caption: 'Объекты'
			});
		},
	}
}