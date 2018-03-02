{
	$name: 'JSB.Workspace.WorkspaceManager',
	$require: ['JSB.Workspace.Workspace'],
	$fixedId: true,
	$sync: {
		updateCheckInterval: 0
	},
	
	wmKey: null,
	exlorerNodeTypes: null,
	
	$server: {
		$require: ['JSB.Workspace.FileArtifactsStore', 
		           'JSB.Workspace.WorkspaceController'],

	    WORKSPACES_DIRECTORY: 'workspaces',

		$constructor: function(options){
	        this.File = Packages.java.io.File;

		    var options = this.options = options || {};
		    this.scopeId = this.id = options.id || 'global';
		    this.wmKey = options.wmKey;
		    $base();
            this.artifactsStore = new FileArtifactsStore(options.artifactsStore);
            
            if(!this.workspaceIds().next()){
				var wId = JSB().generateUid();
				var workspace = this.workspace(wId);
				workspace.load();
				workspace.store();
			}
            this.exlorerNodeTypes = WorkspaceController.constructExplorerNodeTypeSlice(this.wmKey);
		},

		_example: function(){
		    var WorkspaceManager = JSB.get('JSB.Workspace.WorkspaceManager').getClass();
		    var man = new WorkspaceManager();

		    var itIds = man.workspaceIds();
		    var ids = [];
		    for(var id; id = itIds.next();){
		        ids.push(id);
		    }

		    var ws = man.workspace('ws1');
		    ws.load();// initialize or load artifact

		    var itEntries = ws.entries();
            var entries = [];
            for(var e; e = itEntries.next();){
                entries.push(e);
            }

            ws.artifactPath('my-file.txt');
            ws.writeArtifactAsText('my-file.txt','aaa');
            ws.readArtifactAsText('my-file.txt');


            var e1 = ws.entry('e1');
            ws.entryPropertyPath(e1,'id');
		},
		
		workspaceIds: function(){
		    var workspaceIds = this.artifactsStore.directories(this.artifactPath());
		    var self = this;
            return {
                next: function() {
                    var workspaceId = workspaceIds.next();
                    if (typeof workspaceId !== 'undefined') {
                        while(workspaceId.endsWith('/') || workspaceId.endsWith('\\')) {
                            workspaceId = workspaceId.substring(0, workspaceId.length-1);
                        }
                        return workspaceId;
                    }
                }
            };
		},

		workspaces: function() {
		    var localIds = this.workspaceIds();
            return {
                next: function() {
                    var localId = localIds.next();
                    if ($jsb.isDefined(localId)) {
                        return $this.workspace(localId);
                    }
                }
            };
		},

		workspace: function(id){
		    var insId = this.workspaceInstanceId(id);
		    var ws = JSB().getInstance(insId);
		    if (!ws) {
		        ws = this._locked(insId, function(){
                    var ws = JSB().getInstance(insId);
                    if (!ws) {
                        ws = new Workspace(id, $this);
                    }
                    return ws;
		        });
		    }
		    return ws;
		},

		remove: function(){
		    var self = this;
		    this._locked('remove', function() {
                var workspaces = self.workspaces();
                var ws;
                while (ws = workspaces.next()) {
                    ws.remove();
                }
                self.artifactsStore.remove(self.artifactPath());
		    });
		    this.destroy();
		},

		workspaceInstanceId: function(id) {
		    return this.scopeId + '-' + id;
		},

		artifactPath: function(path) {
		    var basePath = this.artifactsStore.subPath(this.scopeId, this.WORKSPACES_DIRECTORY);
		    if (path) {
		        return this.artifactsStore.subPath(basePath, path);
		    } else {
		        return basePath;
		    }
		},

		_locked: function(id, func) {
            var locker = JSB().getLocker();
            var mtxName = 'WorkspaceManager:' + this.scopeId + ':' + id;
            try {
                locker.lock(mtxName);
                return func.call(this);
            } finally {
                locker.unlock(mtxName);
            }
		},
		
		createWorkspace: function(){
			var self = this;
			
			var wName = 'Мои проекты';
			
			function checkExisted(name){
				for (var workspace, itWss = this.workspaces(); workspace = itWss.next();){
			        workspace.load();
			        if(workspace.getName() == name){
						return true;
					}
				}
				return false;
			}
			
			for(var startNum = 2; ; startNum++){
				var curName = wName + ' ' + startNum;
				if(checkExisted(curName)){
					continue;
				}
				
				// create new workspace
				var wId = JSB().generateUid();
				var workspace = this.workspace(wId);
				workspace.load();
				workspace.setName(curName);
				return workspace;
			}
		},
		
		removeWorkspace: function(w){
			w.remove();
		},
	}
}