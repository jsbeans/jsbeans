JSB({
	name:'Ontoed.WorkspaceManager',
	parent: 'JSB.Widgets.Actor',
	require: ['Ontoed.Host', 'Ontoed.Workspace'],
	
	server: {
		singleton:true,
		
		workspaces: {},
		currentWorkspace: null,
		
		constructor: function(){
			var workspaceIds = Workspace.workspaces();
			if(!workspaceIds || workspaceIds.length == 0){
				var wId = JSB().generateUid();
				var workspace = new Workspace(wId);
				this.fillExamples(workspace);
				workspace.store();
				var wWrap = new Ontoed.Workspace(workspace);
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
					var wWrap = new Ontoed.Workspace(workspace);
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
		
		fillExamples: function(workspace){
			Log.info('Creating examples...');

			var ontologies = [
			                  'foaf.rdf', 
			                  'goodrelations.owl' 
			                  ];
			
			for(var i in ontologies){
				var file = ontologies[i];
				var path = '/ontologies/' + file;
				
				var ontology = workspace.ontologies().createById(JSB().generateUid());
				ontology.category('Примеры');
				var model = ontology.ontologyModel();
				model.loadResource(path, {isolated: true});
				model.store();
			}
			
			Log.info('Examples successfully created');
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
				var wWrap = new Ontoed.Workspace(workspace);
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
		}

	}
});