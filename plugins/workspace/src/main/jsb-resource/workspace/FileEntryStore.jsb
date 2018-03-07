{
	$name: 'JSB.Workspace.FileEntryStore',
	$server: {
		$require: 'JSB.IO.FileSystem',

		$constructor: function(opts, wType){
			this.options = opts;
			this.wType = wType;
		},
		
		getWorkspaceIds: function(){
			var wIds = [];
			if(FileSystem.isDirectory(this.options.baseDirectory)){
				var dirs = FileSystem.list(this.options.baseDirectory, {files: false, links: false});
				var rx = new RegExp('^' + this.wType + '\-(.+)$', 'i');
				for(var i = 0; i < dirs.length; i++){
					var wDir = dirs[i];
					var m = wDir.match(rx);
					if(m && m.length > 1){
						wIds.push(m[1]);
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
		}

	}
}