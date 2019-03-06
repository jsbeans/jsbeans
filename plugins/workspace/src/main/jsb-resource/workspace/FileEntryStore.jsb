{
	$name: 'JSB.Workspace.FileEntryStore',
	$session: false,
	$server: {
		$require: ['JSB.IO.FileSystem'],

		$constructor: function(opts){
			this.options = opts;
		},
		
		getWorkspaces: function(){
			var wIds = [];
			var wExt = this.options.workspaceExt || 'ws';
			
			function _combineWorkspaces(dir){
				var wMap = {};
				if(FileSystem.exists(dir) && FileSystem.isDirectory(dir)){
					var users = FileSystem.list(dir, {files: false, links: false});
					for(var i = 0; i < users.length; i++){
						var user = users[i];
						var userWsDir = FileSystem.join(dir, user);
						var dirs = FileSystem.list(userWsDir, {files: false, links: false});

						for(var j = 0; j < dirs.length; j++){
							var wDir = dirs[j];
							var wPath = FileSystem.join(userWsDir, wDir);
							var wFile = FileSystem.join(wPath, wDir + '.' + wExt);
							if(FileSystem.exists(wFile)){
								wMap[wDir] = {
									wOwner: user,
									wId: wDir
								};
							}
						}
						
					}

				}
				return wMap;
			}
			
			// combine workspaces from directories
			var wReadMap = _combineWorkspaces(this.options.readDirectory);
			var wMap = _combineWorkspaces(this.options.baseDirectory);
			
			// merge with read map
			for(var wId in wReadMap){
				if(wMap[wId]){
					continue;
				}
				wMap[wId] = {
					wOwner: wReadMap[wId].wOwner,
					wId: wId
				};
			}
			
			for(var wId in wMap){
				wIds.push(wMap[wId]);
			}
			
			var cursor = 0;
			return {
				next: function(){
					if(cursor < wIds.length){
						return wIds[cursor++];
					}
				},
				
				hasNext: function(){
					return cursor < wIds.length;
				},
				
				count: function(){
					return wIds.length;
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
		
		getEntryDir: function(entry, bRead){
			var eDir = null;
			if(entry.getWorkspace() == entry){
				if(bRead){
					eDir = FileSystem.join(this.options.readDirectory, entry.getOwner(), entry.getId());
				} else {
					eDir = FileSystem.join(this.options.baseDirectory, entry.getOwner(), entry.getId());
				}
			} else {
				if(bRead){
					eDir = FileSystem.join(this.options.readDirectory, entry.getWorkspace().getOwner(), entry.getWorkspace().getId());
				} else {
					eDir = FileSystem.join(this.options.baseDirectory, entry.getWorkspace().getOwner(), entry.getWorkspace().getId());
				}
				if(this.options.pageDirectoryName && JSB.isNumber(entry._entryStoreOpts)){
					eDir = FileSystem.join(eDir, this.options.pageDirectoryName + entry._entryStoreOpts);
				}
			}
			return eDir;
		},
		
		fixFileName: function(fn){
			return fn.replace(/\|/g,'_');
		},
		
		read: function(entry){
			var ext = this.options.entryExt || 'entry';
			var eDir = this.getEntryDir(entry);
			var erDir = this.getEntryDir(entry, true);
			var isWs = false;
			if(entry.getWorkspace() == entry){
				ext = this.options.workspaceExt || 'ws';
				isWs = true;
			}
			var fName = this.fixFileName(entry.getId());
			var eFileName = FileSystem.join(eDir, fName + '.' + ext);
			var erFileName = FileSystem.join(erDir, fName + '.' + ext);
			var mtxName = 'JSB.Workspace.FileEntryStore.' + entry.getId();
			JSB.getLocker().lock(mtxName);
			try {
				var res = null, readRes = null, baseRes = null;
				if(FileSystem.exists(erFileName)){
					readRes = JSON.parse(FileSystem.read(erFileName));
					if(isWs){
						entry._hasRead = true;
					}
				}
				if(FileSystem.exists(eFileName)){
					baseRes = JSON.parse(FileSystem.read(eFileName));
				}
				if(readRes && baseRes){
					// shallow merge
					res = JSB.merge({}, readRes, baseRes);

					// merge entries
					if(isWs && res._entries && readRes._entries && baseRes._entries){
						JSB.merge(res._entries, readRes._entries, baseRes._entries);
					}
					
					// merge shares
					if(res._shares && readRes._shares && baseRes._shares){
						JSB.merge(res._shares, readRes._shares, baseRes._shares);
					}

					// merge children
					if(res._children && readRes._children && baseRes._children){
						JSB.merge(res._children, readRes._children, baseRes._children);
					}

					// merge artifacts
					if(res._artifacts && readRes._artifacts && baseRes._artifacts){
						JSB.merge(res._artifacts, readRes._artifacts, baseRes._artifacts);
					}
				} else if(readRes){
					res = readRes;
				} else if(baseRes){
					res = baseRes;
				}
				if(entry.getWorkspace()._hasRead){
					// TODO: actualize _children
					
					if(isWs){
						// TODO: actualize _entries
					}
				}
/*				if(isWs){
					if(FileSystem.exists(erFileName)){
						res = JSON.parse(FileSystem.read(erFileName));
					}
					if(FileSystem.exists(eFileName)){
						var r = JSON.parse(FileSystem.read(eFileName));
						if(!res){
							res = r;
						} else {
							JSB.merge(true, res, r);
						}
					}
				} else {
					if(FileSystem.exists(eFileName)){
						res = JSON.parse(FileSystem.read(eFileName));
					} else if(FileSystem.exists(erFileName)){
						res = JSON.parse(FileSystem.read(erFileName));
					}
				}
*/				
				return res;
			} catch(e){
				entry.getWorkspace().blockWithException(e);
				throw e;
			} finally {
				JSB.getLocker().unlock(mtxName);
			}
		},
		
		write: function(entry){
			var ext = this.options.entryExt || 'entry';
			var eDir = this.getEntryDir(entry);
			if(entry.getWorkspace() == entry){
				ext = this.options.workspaceExt || 'ws';
			}
			var eFileName = FileSystem.join(eDir, this.fixFileName(entry.getId()) + '.' + ext);
			var eFileNameTmp = eFileName + '.tmp';
			var mtxName = 'JSB.Workspace.FileEntryStore.' + entry.getId();
			JSB.getLocker().lock(mtxName);
			try {
				// ensure directory
				FileSystem.createDirectory(eDir, true);

				// write file
				FileSystem.write(eFileNameTmp, JSON.stringify(entry.getEntryDoc(), null, 4));
				FileSystem.move(eFileNameTmp, eFileName, true);
			} catch(e){
				entry.getWorkspace().blockWithException(e);
				throw e;
			} finally {
				JSB.getLocker().unlock(mtxName);
			}
		},
		
		remove: function(entry){
			var ext = this.options.entryExt || 'entry';
			var eDir = this.getEntryDir(entry);
			if(entry.getWorkspace() == entry){
				ext = this.options.workspaceExt || 'ws';
			}
			var eFileName = FileSystem.join(eDir, this.fixFileName(entry.getId()) + '.' + ext);
			var mtxName = 'JSB.Workspace.FileEntryStore.' + entry.getId();
			JSB.getLocker().lock(mtxName);
			try {
				if(FileSystem.exists(eFileName)){
					FileSystem.remove(eFileName);
				}
				
				if(entry.getWorkspace() == entry){
					if(FileSystem.exists(eDir)){
						FileSystem.remove(eDir);
					}
				}
			} catch(e){
				entry.getWorkspace().blockWithException(e);
				throw e;
			} finally {
				JSB.getLocker().unlock(mtxName);
			}
		}

	}
}