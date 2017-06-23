{
	$name: 'JSB.Workspace.FileEntry',
	$parent: 'JSB.Workspace.Entry',
	
	$server: {
		$require: 'JSB.Workspace.WorkspaceController',
		
		$bootstrap: function(){
			WorkspaceController.registerFileUploadCallback(null, this, 0, function(name, data){
				return true;
			});
			WorkspaceController.registerExplorerNode(null, this, 0, 'JSB.Workspace.FileNode');
		},

		$constructor: function(id, workspace, opts){
			$base(id, workspace);
			if(opts){
				if(opts.fileName){
					this.title(opts.fileName);
				}
				if(opts.fileData){
					// store artifact
					this.workspace.writeArtifactAsBinary(this.getLocalId() + '.data', opts.fileData);
				}
			}
		},

		destroy: function(){
			if(this.workspace.existsArtifact(this.getLocalId() + '.data')){
				this.workspace.removeArtifact(this.getLocalId() + '.data');
			}
			$base();
		},
	}
}