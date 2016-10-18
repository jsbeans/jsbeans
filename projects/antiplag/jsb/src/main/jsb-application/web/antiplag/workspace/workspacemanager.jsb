JSB({
	name:'Antiplag.WorkspaceManager',
	parent: 'JSB.Widgets.Actor',
	require: ['Antiplag.Host', 'Antiplag.Workspace'],
	
	server: {
		singleton:true,

		HttpApi: {
			mapping: {
				'exportDocument': 'exportDocument'
			}
		},

		workspaces: {},
		currentWorkspace: null,
		
		constructor: function(){
		    var AntiplagWorkspaceManagerFactory = Packages.ru.avicomp.antiplag.AntiplagWorkspaceManagerFactory;
		    var wokrspaceManager = this.wokrspaceManager = new AntiplagWorkspaceManagerFactory().create();
//		    var wokrspaceManager = this.wokrspaceManager = new AntiplagWorkspaceManagerFactory().create(userName);

		    if (wokrspaceManager.workspaces().count() == 0) {
		        // create first workspace
		        var workspace = wokrspaceManager.workspace(JSB().generateUid());
				this.fillExamples(workspace);
				workspace.store();

				var wWrap = new Antiplag.Workspace(workspace);
				this.workspaces[''+workspace.id()] = wWrap;
		    } else {
		        var self = this;
		        // load all existed workspace descriptor
		        wokrspaceManager.workspaces().forEach(new java.util.function.Consumer() {
		            accept: function(workspace){
		                try {
                            workspace.load();
                            var wWrap = new Antiplag.Workspace(workspace);
                            self.workspaces[''+workspace.id()] = wWrap;
                        }catch (e) {
                            Log.error(true, 'Workspace loading failed: ' + workspace.id());
                            throw e;
                        }
                    }
		        });

//		        for(var it = wokrspaceManager.workspaces().iterator(); it.hasNext();) {
//		            var workspace = it.next();
//                    workspace.load();
//                    var wWrap = new Antiplag.Workspace(workspace);
//                    self.workspaces[''+workspace.id()] = wWrap;
//		        }
		    }
		},
		
		setCurrentWorkspace: function(w){
			this.currentWorkspace = w;
		},
		
		getCurrentWorkspace: function(){
			return this.currentWorkspace;
		},

        /** Get default or specified workspaces`s reactor for operate with entries as types runtime objects
        */
		getReactor: function(workspace, type){
		    return workspace.reactor(!!type ? type : Packages.ru.avicomp.ontoed.ws.owlapi.SimpleReactor.getType());
		},

        /** Get workspaces`s reactor for operate with Documents
        */
		getDocumentsReactor: function(workspace){
		    return workspace.reactor(Packages.ru.avicomp.antiplag.DocumentsReactor.getType());
		},
		
		getWorkspace: function(id){
			return this.workspaces[id];
		},
		
		getWorkspaces: function(){
			return this.workspaces;
		},
		
		createWorkspace: function(){
			var self = this;
			
			var wName = 'Мои документы';
			
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
				var workspace = this.wokrspaceManager.workspace(JSB().generateUid());
				workspace.set('wName', curName);
				workspace.store();
				var wWrap = new Antiplag.Workspace(workspace);
				this.workspaces[''+workspace.id()] = wWrap;
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
		
		exportDocument: function(obj){
		    var workspaceId = ''+obj.wId,
		        documentId = ''+obj.id,
		        format = ''+obj.format;

			var workspace = this.workspaces[workspaceId];
			if(!workspace){
				throw 'Invalid workspace id specified: ' + workspaceId;
			}

			var document = this.getDocumentsReactor(workspace.getSystemWorkspace()).entry(documentId);
			if(documentId !== ''+document.id()){
				throw 'Invalid document id specified: ' + documentId + '!='+document.id();
			}

			var oName = 'name';
			var data = workspace.exportDocument(documentId, format);
			var opts = {
				mode: 'text'
			};
			switch(format){
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
			
		},

		fillExamples: function (workspace) {
			Log.info('Creating examples...');

			var documentsReactor = this.getDocumentsReactor(workspace);
			var documents = [
			                  'test.pdf',
			                  'test.docx'
			                  ];

			for(var i in documents){
				var file = documents[i];
				var path = '/examples/documents/' + file;

                // create new document
                var document = documentsReactor.entry(JSB().generateUid());
                document.uri(path);
				document.category('Примеры');
                // set document type by file extension
			    document.type(Packages.ru.avicomp.antiplag.DocumentType.valueForFile(file));

				// load resource as document artifact
				documentsReactor.loadArtifactFromResource(document, document.getClass(), path);

				// try extract document plaintext
                documentsReactor.extractTexts(document, false);

                // attributes stored as fields in workspace
                var attributesJavaMap = document.plaintextAttributes();
                var attributes = utils.javaToJson(attributesJavaMap);
                Log.debug("Document text attributes " +  document.id() + ': ' + JSON.stringify(attributes, 0, 2));

                // text stored as document.plaintextFile() artifact
                var plaintext = '' + documentsReactor.readPlaintextAsString(document);
                Log.debug("Document plaintext " +  document.id() + ': ' + plaintext);

				// store artifacts and update document entry descriptor
				documentsReactor.store(document);
			}
			Log.info('Examples successfully created');
		}

	}
});