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
		
		read: function(eDesc){
			var eFileName = FileSystem.join(this.options.workspaceDirectory, id + '.json');
			var dataStr = FileSystem.read(eFileName);
			var data = JSON.parse(dataStr);
			return data;
		},
		
		write: function(entry){
			var ext = this.options.entryExt || 'entry';
			var eDir = null;
			if(!entry.getWorkspace()){
				ext = this.options.workspaceExt || 'ws';
				eDir = FileSystem.join(this.options.baseDirectory, entry.getOwner(), entry.getId());
			} else {
				eDir = FileSystem.join(this.options.baseDirectory, entry.getWorkspace().getOwner(), entry.getWorkspace().getId());
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
		},
		
		getEntries: function(){
			var ext = this.options.entryExt || 'entry';
			var entryFiles = FileSystem.list(this.options.workspaceDirectory, {directories: false, links: false, filter: '*.' + ext});
			debugger;
		}

	}
}