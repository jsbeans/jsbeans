{
	$name: 'JSB.Workspace.FolderEntry',
	$parent: 'JSB.Workspace.Entry',
	
	$server: {
		$require: 'JSB.Workspace.WorkspaceController',
		
		$bootstrap: function(){
			WorkspaceController.registerExplorerNode(null, this, 0, 'JSB.Workspace.FolderNode');
		},

		$constructor: function(id, workspace, opts){
			$base(id, workspace);
		}

	}
}