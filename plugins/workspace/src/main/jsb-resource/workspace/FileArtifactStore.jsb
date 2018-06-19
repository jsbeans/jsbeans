{
	$name: 'JSB.Workspace.FileArtifactStore',
	$session: false,
	$server: {
		$require: 'JSB.IO.FileSystem',

		$constructor: function(opts){
			this.options = opts;
		},
		
		fixFileName: function(fn){
			return fn.replace(/\|/g,'_');
		},
		
		getArtifactDir: function(entry){
			var eStore = entry.getEntryStore();
			var eDir = null;
			if(JSB.isInstanceOf(eStore, 'JSB.Workspace.FileEntryStore')){
				eDir = eStore.getEntryDir(entry);
			} else {
				//TODO:
				throw new Error('not implemented');
			}
			eDir = FileSystem.join(eDir, this.fixFileName(entry.getId()));
			return eDir;
		},
		
		write: function(entry, name, a, opts){
			var eDir = this.getArtifactDir(entry);
			var eFileName = FileSystem.join(eDir, name);
			var mtxName = 'JSB.Workspace.FileArtifactStore.' + entry.getId();
			JSB.getLocker().lock(mtxName);
			try {
				// ensure directory
				FileSystem.createDirectory(eDir, true);
			} finally {
				JSB.getLocker().unlock(mtxName);
			}
			mtxName = 'JSB.Workspace.FileArtifactStore.' + entry.getId() + '.' + name;
			JSB.getLocker().lock(mtxName);
			try {
				// write file
				var artifactType = entry._artifacts[name];
				if(!artifactType){
					throw new Error('Internal error: missing "'+name+'" in _artifacts descriptor of entry: ' + entry.getId());
				}
				
				if(artifactType == 'string'){
					FileSystem.write(eFileName, a, opts);	
				} else if(artifactType == 'value'){
					FileSystem.write(eFileName, JSON.stringify(a, null, 4));
				} else if(artifactType == 'binary'){
					if(JSB.isInstanceOf(a, 'JSB.IO.Stream')){
						var oStream = FileSystem.open(eFileName, {binary: true, write: true, read: false});
						a.copy(oStream, {
							onProgress: opts.onProgress
						});
						oStream.close();
					} else {
						FileSystem.write(eFileName, a, {binary: true});
					}
				} else {
					throw new Error('Unexpected artifact type: ' + artifactType);
				}
				
			} finally {
				JSB.getLocker().unlock(mtxName);
			}
		},
		
		size: function(entry, name){
			var eDir = this.getArtifactDir(entry);
			var eFileName = FileSystem.join(eDir, name);
			if(!FileSystem.exists(eFileName)){
				throw new Error('Internal error: Missing artifact file "'+eFileName+'" defined in entry: ' + entry.getId());
			}
			return FileSystem.size(eFileName);
		},
		
		read: function(entry, name, opts){
			var eDir = this.getArtifactDir(entry);
			var eFileName = FileSystem.join(eDir, name);
			var mtxName = 'JSB.Workspace.FileArtifactStore.' + entry.getId() + '.' + name;
			JSB.getLocker().lock(mtxName);
			try {
				if(!FileSystem.exists(eFileName)){
					throw new Error('Internal error: Missing artifact file "'+eFileName+'" defined in entry: ' + entry.getId());
				}
				
				var artifactType = entry._artifacts[name];
				if(!artifactType){
					throw new Error('Internal error: missing "'+name+'" in _artifacts descriptor of entry: ' + entry.getId());
				}
				
				if(artifactType == 'string'){
					if(opts && opts.stream){
						delete opts.stream;
						return FileSystem.open(eFileName, JSB.merge({binary: false}, opts, {read: true, write:false, append: false, update: false}));
					}
					return FileSystem.read(eFileName);	
				} else if(artifactType == 'value'){
					return JSON.parse(FileSystem.read(eFileName));
				} else if(artifactType == 'binary'){
					if(opts && opts.stream){
						delete opts.stream;
						return FileSystem.open(eFileName, JSB.merge({binary: true}, opts, {read: true, write:false, append: false, update: false}));
					}
					return FileSystem.read(eFileName, {binary: true});
				} else {
					throw new Error('Unexpected artifact type: ' + artifactType);
				}

			} finally {
				JSB.getLocker().unlock(mtxName);
			}
			
		},
		
		remove: function(entry, name){
			var eDir = this.getArtifactDir(entry);
			var eFileName = FileSystem.join(eDir, name);
			var mtxName = 'JSB.Workspace.FileArtifactStore.' + entry.getId() + '.' + name;
			JSB.getLocker().lock(mtxName);
			try {
				if(FileSystem.exists(eFileName)){
					FileSystem.remove(eFileName);
				}
				if(Object.keys(entry._artifacts).length == 0){
					if(FileSystem.exists(eDir)){
						FileSystem.remove(eDir);
					}
				}
			} finally {
				JSB.getLocker().unlock(mtxName);
			}
		},
		
		rename: function(entry, existedName, newName){
			var eDir = this.getArtifactDir(entry);
			var eFileName = FileSystem.join(eDir, existedName);
			var eFileNewName = FileSystem.join(eDir, newName);
			var mtxName = 'JSB.Workspace.FileArtifactStore.' + entry.getId() + '.' + existedName;
			JSB.getLocker().lock(mtxName);
			try {
				if(FileSystem.exists(eFileName)){
					FileSystem.move(eFileName, eFileNewName);
				}
			} finally {
				JSB.getLocker().unlock(mtxName);
			}
		}
	}
}