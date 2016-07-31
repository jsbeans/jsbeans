JSB({
	name:'Ontoed.OntologyImportsEditor',
	parent: 'JSB.Widgets.Widget',
	require: ['JSB.Widgets.TreeView', 'Ontoed.OntologyNode', 'Ontoed.MissingOntologyNode', 'JSB.Widgets.Button'],
	
	client: {
		currentOntology: null,
		imported: {},
		
		constructor: function(opts){
			var self = this;
			this.base(opts);
			this.addClass('ontologyImportsEditor');
			this.loadCss('ontologyimportseditor.css');
			
			// create tree
			this.tree = new JSB.Widgets.TreeView({
				allowHover: true,
				allowSelect: false
			});
			this.append(this.tree);
			this.append('<div class="noImportsMessage hidden">Нет импортируемых онтологий</div>');
			
			this.subscribe('ontologyUpdate', function(sender, msg, params){
				if(sender == self.currentOntology){
					self.refresh();
				}
			});
			
			this.getElement().droppable({
				accept: function(d){
					if(d && d.length > 0 && d.get(0).draggingItems){
						var nodes = [];
						for(var i in d.get(0).draggingItems){
							var ontoNode = d.get(0).draggingItems[i].obj;
							if(JSB().isInstanceOf(ontoNode, 'Ontoed.OntologyNode')){
								nodes.push(d.get(0).draggingItems[i].obj);
							}
						}
						return nodes.length > 0;
					}
					return false;
				},
				tolerance: 'pointer',
				greedy: true,
				over: function(evt, ui){
					if( !ui.helper.hasClass('accepted') ){
						ui.helper.addClass('accepted');
					}
					self.getElement().addClass('acceptDraggable');
				},
				out: function(evt, ui){
					if( ui.helper.hasClass('accepted') ){
						ui.helper.removeClass('accepted');
					}
					self.getElement().removeClass('acceptDraggable');
				},
				drop: function(evt, ui){
					var d = ui.draggable;
					self.getElement().removeClass('acceptDraggable');
					var ontoIds = [];
					for(var i in d.get(0).draggingItems){
						var ontoDesc = d.get(0).draggingItems[i].obj.descriptor;
						ontoIds.push(ontoDesc.id);
					}
					self.getElement().loader();
					self.currentOntology.server.insertImports(ontoIds, function(res){});
				}
			});
		},
		
		setOntology: function(onto){
			if(this.currentOntology == onto){
				return;
			}
			if(!JSB().isInstanceOf(onto, 'Ontoed.Model.Ontology')){
				return;
			}
			this.currentOntology = onto;
			this.refresh();
		},
		
		refresh: function(){
			var self = this;
			self.getElement().loader();
			this.currentOntology.server.getImported(function(imported){
				self.imported = imported;
				self.draw();
				self.getElement().loader('hide');
			});
		},
		
		draw: function(){
			this.tree.clear();
			var bFilled = false;
			for(var id in this.imported){
				var desc = this.imported[id];
				this.addTreeItem(desc);
				bFilled = true;
			}
			if(!bFilled){
				this.find('.noImportsMessage').removeClass('hidden');
			} else {
				this.find('.noImportsMessage').addClass('hidden');
			}
			
			this.sort();
		},
		
		addTreeItem: function(itemDesc, parent){
			var self = this;
			var key = JSB().generateUid();
			var node = null;
			if(itemDesc.loaded){
				node = new Ontoed.OntologyNode({
					descriptor: itemDesc,
					onDblClick: function(){
						var witem = this;
						if(!witem.ontology){
							self.$('.ontoedContainer').loader();
							self.$('.ontoedContainer').loader('content', 'Загрузка онтологии');
							self.currentOntology.workspace.server.ensureOntology(witem.descriptor.id, function(onto){
								self.$('.ontoedContainer').loader('hide');
								witem.ontology = onto;
								self.publish('changeWorkspaceElement', onto);
							});
						} else {
							self.publish('changeWorkspaceElement', witem.ontology);
						}
					}
				});
			} else {
				itemDesc.type = 'missing';
				node = new Ontoed.MissingOntologyNode({
					descriptor: itemDesc
				});
			}
			
			var nodeContainer = this.$('<div class="nodeContainer"></div>');
			nodeContainer.append(node.getElement());
			if(!parent){
				var deleteBtn = new JSB.Widgets.Button({
					cssClass: 'roundButton btnDelete btn10',
					tooltip: 'Удалить',
					onClick: function(){
						self.getElement().loader();
						self.currentOntology.server.removeImport(itemDesc.id, function(res){});
					}
				});
				nodeContainer.append(deleteBtn.getElement());
			}
			
			var curTreeNode = self.tree.addNode({
				key: key,
				element: nodeContainer,
				cssClass: itemDesc.type
			}, parent);
			node.treeNode = curTreeNode;
			
			if(itemDesc.imported){
				for(var id in itemDesc.imported){
					var desc = itemDesc.imported[id];
					self.addTreeItem(desc, key);
				}
			}
			
			return node;
		},
		
		sort: function(){
			this.tree.sort(function(a, b){
				if(JSB().isInstanceOf(a.obj, 'Ontoed.FolderNode') && !JSB().isInstanceOf(b.obj, 'Ontoed.FolderNode')){
					return -1;
				}
				if(!JSB().isInstanceOf(a.obj, 'Ontoed.FolderNode') && JSB().isInstanceOf(b.obj, 'Ontoed.FolderNode')){
					return 1;
				}
				
				if(JSB().isInstanceOf(a.obj, 'Ontoed.FolderNode') && JSB().isInstanceOf(b.obj, 'Ontoed.FolderNode')){
					return a.obj.getName().localeCompare(b.obj.getName());
				}
				
				if(JSB().isInstanceOf(a.obj, 'Ontoed.OntologyNode') && JSB().isInstanceOf(b.obj, 'Ontoed.OntologyNode')){
					return a.obj.getUri().localeCompare(b.obj.getUri());
				}
				
				return 0;
			});
		},

	},
	
	server: {
		
	}
});