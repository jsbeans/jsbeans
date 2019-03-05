{
	$name: 'JSB.Workspace.FolderBrowserView',
	$parent: 'JSB.Workspace.BrowserView',
	
	$expose: {
		priority: 0,
		acceptNode: [null, 'JSB.Workspace.FolderNode'],
		acceptEntry: [null, 'JSB.Workspace.FolderEntry'],
		caption: 'Объекты'
	},
	
	$client: {
		$require: ['css:FolderBrowserView.css'],
		$constructor: function(opts){
			$base(opts);
			this.addClass('workspaceFolderBrowserView');
		},
		
		refresh: function(){}
		
	}
	
}