{
	$name: 'JSB.Workspace.FileEntry',
	$parent: 'JSB.Workspace.Entry',
	
	$server: {
		$require: 'JSB.Workspace.WorkspaceController',
		
		$bootstrap: function(){
			WorkspaceController.registerFileUploadCallback(null, this, 0, function(name, data){
				return true;
			});
			WorkspaceController.registerExplorerNode(null, this, {
				priority: 0, 
				nodeType:'JSB.Workspace.FileNode',
				create: false,
				move:true,
				remove: true
			});
		},

		$constructor: function(id, workspace, opts){
			$base(id, workspace);
			if(opts){
				if(opts.fileName){
					this.setName(opts.fileName);
				}
				if(opts.fileData){
					// store artifact
					this.storeArtifact('.data', opts.fileData);
				}
			}
		},

		destroy: function(){
			if(this.existsArtifact('.data')){
				this.removeArtifact('.data');
			}
			$base();
		},
	}
}