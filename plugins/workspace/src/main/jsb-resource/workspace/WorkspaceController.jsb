{
	$name: 'JSB.Workspace.WorkspaceController',
	$require: ['JSB.Workspace.WorkspaceManager'],
	$singleton: true,

	$server: {
		$require: ['JSB.IO.FileSystem', 
		           'JSB.System.Config'],
		managers: {},
		
		$constructor: function(){
			$base();
		},
		
		ensureManager: function(wmKey){
			if(!wmKey){
				throw new Error('No wmKey specified');
			}
			if(!this.managers[wmKey]){
				var dir = FileSystem.getUserDirectory();
				var fld = wmKey;
				if(Config.has('workspace.managers.' + wmKey)){
					var cfgEntry = Config.get('workspace.managers.' + wmKey);
					dir = cfgEntry.baseDirectory || dir;
					fld = cfgEntry.folderName || fld
				}
				
				var wm = new WorkspaceManager({
					id: 'wm-' + wmKey,
					artifactsStore: {
						home: FileSystem.join(dir, fld)
					}
				});
				this.managers[wmKey] = wm;
			}
			return this.managers[wmKey];
		}

	}
}