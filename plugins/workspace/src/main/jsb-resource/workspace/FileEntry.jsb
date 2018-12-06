{
	$name: 'JSB.Workspace.FileEntry',
	$parent: 'JSB.Workspace.Entry',
	
	fileSize: null,
	
	$server: {
		$require: ['JSB.Workspace.WorkspaceController', 
		           'JSB.Web.Download'],
		
		$bootstrap: function(){
			WorkspaceController.registerFileUploadCallback(null, this, 0, function(name, data){
				return true;
			});
			WorkspaceController.registerExplorerNode(null, this, {
				priority: 0, 
				nodeType:'JSB.Workspace.FileNode',
				create: false,
				move:true,
				remove: true,
				share: true,
				rename: true
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
			} else {
				this.fileSize = this.property('fileSize');
			}
		},
		
		uploadFile: function(fileInfo){
			var tempName = '.data.' + JSB.generateUid();
			try {
				var lastProgress = -1;
				this.storeArtifact(tempName, fileInfo.data, {
					onProgress: function(copied){
						var curProgress = Math.floor((copied * 100) / fileInfo.size);
						if(curProgress != lastProgress){
							$this.publish('JSB.Workspace.FileEntry.upload', {status: 'Обновление файла ' + curProgress + '%', success: true}, {session: true});
							lastProgress = curProgress;
						}
					}
				});
				this.removeArtifact('.data');
				this.renameArtifact(tempName, '.data');
			} finally {
				this.removeArtifact(tempName);
			}
		},
		
		downloadFile: function(){
			var fileName = this.getName();
			var dh = new Download(fileName, {mode: 'binary'}, function(outputStream){
				var inputStream = $this.loadArtifact('.data', {stream: true});
				inputStream.copy(outputStream);
				inputStream.close();
			});
			return dh;
		},
		
		read: function(opts){
			return this.loadArtifact('.data', opts);
		},
		
		getFileSize: function(){
			return this.getArtifactSize('.data');
		},

		destroy: function(){
			if(this.existsArtifact('.data')){
				this.removeArtifact('.data');
			}
			$base();
		},
	}
}