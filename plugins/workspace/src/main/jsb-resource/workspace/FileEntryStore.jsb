{
	$name: 'JSB.Workspace.FileEntryStore',
	$server: {
		$require: 'JSB.IO.FileSystem',

		$constructor: function(opts){
			this.options = opts;
		},
		
		getWorkspaces: function(){
			var wIds = [];
			var wExt = this.options.workspaceExt || 'ws';
			if(FileSystem.isDirectory(this.options.baseDirectory)){
				var users = FileSystem.list(this.options.baseDirectory, {files: false, links: false});
				for(var i = 0; i < users.length; i++){
					var user = users[i];
					var userWsDir = FileSystem.join(this.options.baseDirectory, user);
					var dirs = FileSystem.list(userWsDir, {files: false, links: false});

					for(var j = 0; j < dirs.length; j++){
						var wDir = dirs[i];
						var wPath = FileSystem.join(userWsDir, wDir);
						var wFile = FileSystem.join(wPath, wDir + '.' + wExt);
						if(FileSystem.exists(wFile)){
							wIds.push({
								wOwner: user,
								wId: wDir,
								wPath: wPath,
								wFile: wFile
							});
						}
					}
					
				}
			}
			var cursor = 0;
			return {
				next: function(){
					if(cursor < wIds.length){
						return wIds[cursor++];
					}
				}
			}
		},
		
		reserve: function(entry){
			if(entry.getWorkspace() == entry){
				return;
			}
			if(this.options.pageDirectoryName && (!JSB.isDefined(entry._entryStoreOpts) || JSB.isNull(entry._entryStoreOpts))){
				if(this.options.pageSize){
					entry._entryStoreOpts = parseInt(entry.getWorkspace().entries().count() / this.options.pageSize);
				} else {
					entry._entryStoreOpts = 0;
				}
			}
		},
		
		read: function(entry){
			var ext = this.options.entryExt || 'entry';
			var eDir = null;
			if(entry.getWorkspace() == entry){
				ext = this.options.workspaceExt || 'ws';
				eDir = FileSystem.join(this.options.baseDirectory, entry.getOwner(), entry.getId());
			} else {
				eDir = FileSystem.join(this.options.baseDirectory, entry.getWorkspace().getOwner(), entry.getWorkspace().getId());
				if(this.options.pageDirectoryName && JSB.isNumber(entry._entryStoreOpts)){
					eDir = FileSystem.join(eDir, this.options.pageDirectoryName + entry._entryStoreOpts);
				}
			}
			var eFileName = FileSystem.join(eDir, entry.getId() + '.' + ext);
			var mtxName = 'JSB.Workspace.FileEntryStore.' + entry.getId();
			JSB.getLocker().lock(mtxName);
			try {
				if(FileSystem.exists(eFileName)){
					var dataStr = FileSystem.read(eFileName);
					return JSON.parse(dataStr);
				}
			} finally {
				JSB.getLocker().unlock(mtxName);
			}
		},
		
		write: function(entry){
			var ext = this.options.entryExt || 'entry';
			var eDir = null;
			if(entry.getWorkspace() == entry){
				ext = this.options.workspaceExt || 'ws';
				eDir = FileSystem.join(this.options.baseDirectory, entry.getOwner(), entry.getId());
			} else {
				eDir = FileSystem.join(this.options.baseDirectory, entry.getWorkspace().getOwner(), entry.getWorkspace().getId());
				if(this.options.pageDirectoryName && JSB.isNumber(entry._entryStoreOpts)){
					eDir = FileSystem.join(eDir, this.options.pageDirectoryName + entry._entryStoreOpts);
				}
			}
			var eFileName = FileSystem.join(eDir, entry.getId() + '.' + ext);
			var mtxName = 'JSB.Workspace.FileEntryStore.' + entry.getId();
			JSB.getLocker().lock(mtxName);
			try {
				// ensure directory
				FileSystem.createDirectory(eDir, true);

				// write file
				FileSystem.write(eFileName, JSON.stringify(entry.getEntryDoc(), null, 4));
			} finally {
				JSB.getLocker().unlock(mtxName);
			}
		}
		

	}
}