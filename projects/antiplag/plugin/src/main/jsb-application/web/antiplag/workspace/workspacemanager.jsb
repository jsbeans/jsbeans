JSB({
	name:'Antiplag.WorkspaceManager',
	parent: 'JSB.Widgets.Actor',
	require: ['Antiplag.Host', 'Antiplag.Workspace'],
	
	server: {
		singleton:true,
		
		HttpApi: {
			mapping: {
				'exportOntology': 'exportOntology'
			}
		},
		
		workspaces: {},
		currentWorkspace: null,
		
		constructor: function(){
			var workspaceIds = Workspace.workspaces();
			if(!workspaceIds || workspaceIds.length == 0){
				var wId = JSB().generateUid();
				var workspace = new Workspace(wId);
				workspace.store();
				var wWrap = new Antiplag.Workspace(workspace);
				this.workspaces[wId] = wWrap;
			} else {
				for(var i in workspaceIds){
					var wId = workspaceIds[i];
					if(!wId){
						continue;
					}
					var workspace = new Workspace(wId);
					workspace.load();
					if(!workspace.name() || workspace.name() != wId){
						Log.error('Workspace corrupted or malformed: ' + wId)
						continue;
					}
					var wWrap = new Antiplag.Workspace(workspace);
					this.workspaces[wId] = wWrap;
				}
			}
		},
		
		setCurrentWorkspace: function(w){
			this.currentWorkspace = w;
		},
		
		getCurrentWorkspace: function(){
			return this.currentWorkspace;
		},
		
		getWorkspace: function(id){
			return this.workspaces[id];
		},
		
		getWorkspaces: function(){
			return this.workspaces;
		},
		
		createWorkspace: function(){
			var self = this;
			
			var wName = 'Мои онтологии';
			
			function checkExisted(name){
				for(var id in self.workspaces){
					var w = self.workspaces[id];
					if(w.getName() == name){
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
				var workspace = new Workspace(wId);
				workspace.setProperty('wName', curName);
				workspace.store();
				var wWrap = new Antiplag.Workspace(workspace);
				this.workspaces[wId] = wWrap;
				return wWrap;
			}
		},
		
		removeWorkspace: function(w){
			var wId = w.getId();
			if(this.workspaces[wId]){
				delete this.workspaces[wId];
			}
			w.getSystemWorkspace().remove();
			w.destroy();
		},
		
		exportOntology: function(obj){
			var workspace = this.workspaces[obj.wId];
			if(!workspace){
				throw 'Invalid workspace id specified: ' + obj.wId;
			}
			
			var ontology = workspace.getSystemWorkspace().ontologies().get(obj.oId);
			var oName = encodeURIComponent(ontology.title());
			var data = workspace.exportOntology(obj.oId, obj.format);
			var opts = {
				mode: 'text'
			};
			switch(obj.format){
			case 'TURTLE':
				opts.contentType = 'text/turtle';
				opts.contentDisposition = 'attachment; filename*=UTF-8\'\''+oName+'.ttl';
				break;
			case 'RDF/XML':
				opts.contentType = 'text/rdf+n3';
				opts.contentDisposition = 'attachment; filename*=UTF-8\'\''+oName+'.rdf';
				break;
			case 'OWL/XML':
				opts.contentType = 'text/xml';
				opts.contentDisposition = 'attachment; filename*=UTF-8\'\''+oName+'.owl';
				break;
			case 'ManchesterSyntax':
			case 'FunctionalSyntax':
				opts.contentType = 'text';
				opts.contentDisposition = 'attachment; filename*=UTF-8\'\''+oName+'.txt';
				break;
			}
			return Web.response(data, opts);
			
		}

	}
});