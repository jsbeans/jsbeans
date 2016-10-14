JSB({
	name:'Antiplag.WorkspaceView',
	parent: 'JSB.Widgets.Widget',
	require: ['Antiplag.WorkspaceManager', 
	          'JSB.Widgets.ToolBar', 
	          'JSB.Widgets.TreeView', 
	          'JSB.Widgets.ToolManager',
	          'JSB.Widgets.PrimitiveEditor',
	          'JSB.Widgets.Button',
	          'Antiplag.FolderNode', 
	          'Antiplag.DocumentNode', 
	          'Antiplag.UploadNode',
	          'JQuery.UI.Effects',
	          'Web'],
	
	common: {
		sync: true,
		
		currentWorkspace: null,
	},
	          
	client: {
		constructor: function(opts){
			var self = this;
			this.base(opts);
			
			this.loadCss('workspaceview.css');
			this.addClass('workspaceView');
			
			// create toolbar
			this.toolbar = new JSB.Widgets.ToolBar();
			this.append(this.toolbar);
			
			this.toolbar.addItem({
				key: 'createFolder',
				tooltip: 'Создать новую папку',
				element: '<div class="icon"></div>',
				click: function(){
					self.createNewFolder();
				}
			});
			
			this.toolbar.addItem({
				key: 'createOntology',
				tooltip: 'Создать новую онтологию',
				element: '<div class="icon"></div>',
				click: function(evt){
					var elt = self.$(evt.currentTarget);
					JSB.Widgets.ToolManager.activate({
						id: 'newOntologyTool',
						cmd: 'show',
						data: {
							type: 'ontology'
						},
						scope: null,
						target: {
							selector: elt,
							weight: 10.0
						},
						constraints: [{
							selector: self.toolbar.getElement(),
							weight: 10.0
						}],
	
						callback: function(res){
							self.createNewOntology(res);
						}
					});

				}
			});

			this.toolbar.addItem({
				key: 'createSpinOntology',
				tooltip: 'Создать онтологию SPIN отображения',
				element: '<div class="icon"></div>',
				click: function(evt){
					var elt = self.$(evt.currentTarget);
					JSB.Widgets.ToolManager.activate({
						id: 'newOntologyTool',
						cmd: 'show',
						data: {
							type: 'spin'
						},
						scope: null,
						target: {
							selector: elt,
							weight: 10.0
						},
						constraints: [{
							selector: self.toolbar.getElement(),
							weight: 10.0
						}],
	
						callback: function(res){
							self.createNewSpinOntology(res);
						}
					});

				}
			});

			this.toolbar.addSeparator();

			var uploadItem = this.toolbar.addItem({
				key: 'import',
				tooltip: 'Импортировать онтологию',
				element: '<div class="icon"><input type="file" style="display: none;" /></div>',
				click: function(evt, id, obj){
					var input = obj.wrapper.find('input[type="file"]');
					if(evt.target == input.get(0)){
						return;
					}
					input.trigger('click');
				}
			});
			uploadItem.wrapper.find('input[type="file"]').change(function(){
				var item = self.tree.getSelected();
				var parentNode = null;
				if(item == null){
					// choose root
				} else {
					if(JSB().isArray(item)){
						item = item[0];
					}
					if(JSB().isInstanceOf(item.obj, 'Antiplag.FolderNode')){
						parentNode = item.obj;
					} else {
						// move up to nearest parent
						parentNode = self.tree.get(item.parent).obj;
					}
				}
				
				for(var i = 0; i < this.files.length; i++ ){
					var file = this.files[i];
					if(/\.((rdf)|(ttl)|(owl))/i.test(file.name)){
						// upload file
						var uploadNode = new Antiplag.UploadNode({
							file: file, 
							node: parentNode, 
							item: null, 
							tree: self.tree,
							w: self
						});
						var curTreeNode = self.tree.addNode({
							key: JSB().generateUid(),
							element: uploadNode,
						}, parentNode ? parentNode.treeNode.key : null);
						uploadNode.treeNode = curTreeNode;
					}
				}
			});
			
			var downloadItem = this.toolbar.addItem({
				key: 'export',
				tooltip: 'Экспортировать онтологию',
				element: '<div class="icon"><input type="file" style="display: none;" /></div>',
				click: function(evt, id, obj){
					var elt = self.$(evt.currentTarget);
					var sel = self.tree.getSelected();
					if(!sel){
						return;
					}
					
					var node = sel.obj;
					var items = null;
					if(!JSB().isInstanceOf(node, 'Antiplag.OntologyNode')){
						return;
					}
					
					if(node.descriptor.type == 'spinontology'){
						items = [{
							key: 'TURTLE',
							element: 'TURTLE'
						},{
							key: 'RDF/XML',
							element: 'RDF'
						}];
					} else {
						items = [{
							key: 'TURTLE',
							element: 'TURTLE'
						},{
							key: 'RDF/XML',
							element: 'RDF'
						},{
							key: 'OWL/XML',
							element: 'OWL'
						},{
							key: 'ManchesterSyntax',
							element: 'ManchesterSyntax'
						},{
							key: 'FunctionalSyntax',
							element: 'FunctionalSyntax'
						}];
					}
					
					JSB.Widgets.ToolManager.activate({
						id: '_dwp_droplistTool',
						cmd: 'show',
						data: items,
						target: {
							selector: elt,
							dock: 'bottom'
						},
						callback: function(key, item, evt){
							var format = key;
							var oId = node.descriptor.id;
							var wId = self.currentWorkspace.getId();
							window.open('/api/exportOntology?wId='+wId+'&oId='+oId+'&format='+format, '_blank');
						}
					});
					
				}
			});
			


			this.toolbar.addSeparator();

			this.toolbar.addItem({
				key: 'delete',
				tooltip: 'Удалить',
				element: '<div class="icon"></div>',
				click: function(){
					var sel = self.tree.getSelected();
					if(!sel || sel.length == 0){
						return;
					}
					var targets = [];
					var constraints = [];
					if(!JSB().isArray(sel) || sel.length == 1){
						var ss = sel;
						if(JSB().isArray(ss)){
							ss = sel[0];
						}
						targets.push({
							selector: ss.wrapper,
							pivotHorz: 'right',
							pivotVert: 'center',
							offsetHorz: 0,
							offsetVert: 0
						});
						constraints.push({
							selector: ss.wrapper,
							weight: 10.0
						});
					} else {
						targets = {
							selector: self.$(this),
							pivotHorz: 'center',
							pivotVert: 'center',
							offsetHorz: 0,
							offsetVert: 0
						}
						constraints = [{
							selector: self.$(this),
							weight: 10.0
						}];
					}
					JSB.Widgets.ToolManager.showMessage({
						icon: 'removeDialogIcon',
						text: 'Вы уверены что хотите удалить выбранные элементы?',
						buttons: [{text: 'Удалить', value: true},
						          {text: 'Нет', value: false}],
						target: targets,
						constraints: constraints,
						callback: function(bDel){
							if(bDel){
								self.removeItems(sel);
							}
						}
					});
				}
			});

			this.toolbar.addItem({
				key: 'refresh',
				tooltip: 'Обновить',
				element: '<div class="icon"></div>',
				click: function(){
					self.refresh();
				}
			});
			
			
			this.tree = new JSB.Widgets.TreeView({
				selectMulti: true,
				onSelectionChanged: function(key, obj){
					self.updateToolbar();
				}
			});
			this.append(this.tree);
			
			// file upload
			this.installDropContainer(null);
			this.installUploadContainer(null);

			// refresh workspace
			this.server.getWorkspaces(function(wMap){
				if(Object.keys(wMap).length == 0){
					throw 'Error: No default workspace existed';
				}
				var lastId = Web.getCookie('Antiplag.currentWorkspace');
				if(!wMap[lastId]){
					lastId = Object.keys(wMap)[0];
				}
				self.setCurrentWorkspace(wMap[lastId]);
			});
			
			this.subscribe('_jsb_switchLayout', function(sender, msg, layoutName){
				self.updateTab();
			});
			
			this.subscribe('changeWorkspaceElement', function(sender, msg, onto){
				self.tree.find('li._dwp_treeViewNode.current').removeClass('current');
				self.tree.find('li._dwp_treeViewNode[key="'+onto.getId()+'"]').addClass('current');
				self.currentWorkspace.server.setCurrentOntology(onto);
			});
		},
		
		setCurrentWorkspace: function(w, callback){
			var self = this;
			this.currentWorkspace = w;
			Web.setCookie('Antiplag.currentWorkspace', w.getId(), {expires: 30*24*3600});
			this.server.setCurrentWorkspace(w, function(){
				self.updateTab();
				self.refresh();
				self.updateToolbar();
				
				if(callback){
					callback.call(self);
				}
			});
		},
		
		updateTab: function(){
			var self = this;
			var tab = this.container.getTab(this.getId());
			var textElt = tab.tab.find('._dwp_tabText');
			var editor = textElt.find('> ._dwp_primitiveEditor');
			if(editor.length > 0){
				editor = editor.jso();
			} else {
				editor = new JSB.Widgets.PrimitiveEditor({
					mode: 'inplace',
					onValidate: function(val){
						var t = val.trim();
						if(t.length < 3 || t.length > 32){
							return false;
						}
						return /^[\-_\.\s\wа-я]+$/i.test(t);
					},
					onChange: function(val){
						if(self.currentWorkspace.getName() == val.trim()){
							return;
						}
						self.currentWorkspace.rename(val.trim(), function(res){
							if(!res){
								editor.setData(self.currentWorkspace.getName());
								editor.setMark(true);
								editor.beginEdit();	
							}
						});
					}
				});
				var renameBtn = new JSB.Widgets.Button({
					cssClass: 'roundButton btnEdit btn10',
					tooltip: 'Изменить название',
					onClick: function(){
						JSB().defer(function(){
							editor.beginEdit();	
						});
						
					}
				});
				var menuBtn = new JSB.Widgets.Button({
					cssClass: 'roundButton btnMenu btn10',
					tooltip: 'Переключить рабочее пространство',
					onClick: function(){
						self.showWorkspaceMenu();
					}
				});
				textElt.empty()
					.append(editor.getElement())
					.append(renameBtn.getElement())
					.append(menuBtn.getElement());
			}
			editor.setData(this.currentWorkspace.getName());
		},
		
		showWorkspaceMenu: function(){
			var self = this;
			var tab = this.container.getTab(this.getId());
			var btnElt = tab.tab.find('.btnMenu');
			
			this.server.getWorkspaces(function(wMap){
				// construct menu
				var items = [{
					key: 'createWorkspace',
					element: '<div class="icon"></div><div class="text">Создать рабочую область ...</div>',
					cssClass: 'menuItem menuCreate'
				}];

				// add separator
				if(Object.keys(wMap).length > 1){
					items.push({
						key: 'menuSeparator',
						element: '<div class="separator"></div>',
						cssClass: 'menuSeparator',
						allowHover: false,
						allowSelect: false
					});
				}
				
				// add other items
				for(var wId in wMap){
					var w = wMap[wId];
					if(w == self.currentWorkspace){
						continue;
					}
					(function(w, wId){
						var strProc = self.callbackAttr(function(evt){
							if(!evt) {
								evt = this.event;
							}
							evt.cancelBubble = true;
							if(evt.stopPropagation){
								evt.stopPropagation();
							}
							self.tryRemoveWorkspace(w, evt, messageTool);
						});
						items.push({
							key: wId,
							element: '<div class="icon"></div><div class="text">'+w.getName()+'</div><div class="delete" onclick="('+strProc+')(event)"><div class="icon"></div></div>',
							cssClass: 'menuItem menuWorkspace'
						});
					})(w, wId);
				}
				
				var messageTool = JSB.Widgets.ToolManager.activate({
					id: '_dwp_droplistTool',
					cmd: 'show',
					data: items,
					target: {
						selector: btnElt,
						dock: 'bottom'
					},
					callback: function(key, item, evt){
						if(key == 'createWorkspace'){
							// create new workspace
							self.server.createWorkspace(function(w){
								self.setCurrentWorkspace(w, function(){
									var editor = tab.tab.find('._dwp_primitiveEditor').jso();
									editor.beginEdit();
								});
							});
						} else {
							// switch workspace
							self.setCurrentWorkspace(wMap[key]);
						}
					}
				});
				
			});
		},
		
		tryRemoveWorkspace: function(w, evt, messageTool){
			var self = this;
			var sel = this.$(evt.currentTarget);
			JSB.Widgets.ToolManager.showMessage({
				icon: 'removeDialogIcon',
				text: 'Содержимое рабочей области <strong>'+w.getName()+'</strong> будет безвозвратно удалено. Вы уверены, что хотите удалить?',
				buttons: [{text: 'Удалить', value: true},
				          {text: 'Нет', value: false}],
				target: {
					selector: sel,
					pivotHorz: 'center',
					pivotVert: 'center',
					offsetHorz: 0,
					offsetVert: 0
				},
				constraints: [{
					selector: sel,
					weight: 10.0
				}, {
					selector: messageTool.getElement(),
					weight: 10.0
				}],
				callback: function(bDel){
					if(bDel){
						self.server.removeWorkspace(w, function(){
							messageTool.close();
						});
					}
				}
			});
		},
		
		installDropContainer: function(node){
			var self = this;
			var container = this.getElement();
			if(node){
				container = node.getElement();
			}
			container.droppable({
				accept: function(d){
					if(d && d.length > 0 && d.get(0).draggingItems){
						var nodes = [];
						for(var i in d.get(0).draggingItems){
							var obj = d.get(0).draggingItems[i].obj;
							if(!JSB().isInstanceOf(obj, 'Antiplag.WorkspaceNode')){
								continue;
							}
							nodes.push(obj);
						}
						// check for dragging items
						return self.checkMove(node, nodes);
					}
					return false;
				},
				tolerance: 'pointer',
				greedy: true,
				over: function(evt, ui){
					if( !ui.helper.hasClass('accepted') ){
						ui.helper.addClass('accepted');
					}
					container.addClass('acceptDraggable');
				},
				out: function(evt, ui){
					if( ui.helper.hasClass('accepted') ){
						ui.helper.removeClass('accepted');
					}
					container.removeClass('acceptDraggable');
				},
				drop: function(evt, ui){
					var d = ui.draggable;
					container.removeClass('acceptDraggable');
					var nodes = [];
					for(var i in d.get(0).draggingItems){
						var obj = d.get(0).draggingItems[i].obj;
						if(!JSB().isInstanceOf(obj, 'Antiplag.WorkspaceNode')){
							continue;
						}
						nodes.push(obj);
					}
					self.doMove(node, nodes);
				}
			});
		},
		
		installUploadContainer: function(node){
			var self = this;
			var container = this.getElement();
			if(node){
				container = node.getElement();
			}
			container.bind({
				dragenter: function(e) {
					container.addClass('acceptDraggable');
					return false;
				},
				dragover: function(){
					container.addClass('acceptDraggable');
					return false;
				},
				dragleave: function() {
					container.removeClass('acceptDraggable');
					return false;
				},
				drop: function(e) {
					container.removeClass('acceptDraggable');
					var dt = e.originalEvent.dataTransfer;
					if(!dt || !dt.files){
						return false;
					}
					for(var i = 0; i < dt.files.length; i++ ){
						var file = dt.files[i];
						var isFile = /\.((rdf)|(ttl)|(owl))/i.test(file.name);
						var isDir = dt.items ? dt.items[i].webkitGetAsEntry().isDirectory : false;
						
						if(isFile || isDir){
							// upload file
							var uploadNode = new Antiplag.UploadNode({
								file: file, 
								node: node, 
								item: dt.items ? dt.items[i].webkitGetAsEntry() : null, 
								tree: self.tree,
								w: self
							});
							var curTreeNode = self.tree.addNode({
								key: JSB().generateUid(),
								element: uploadNode,
							}, node ? node.treeNode.key : null);
							uploadNode.treeNode = curTreeNode;
						}
					}
					
					return false;
				}
			});
		},
		
		updateToolbar: function(){
			var selection = this.tree.getSelected();
			if(!selection || selection.length == 0){
				// disable buttons
				this.toolbar.enableItem('delete', false);
			} else {
				// enable buttons
				this.toolbar.enableItem('delete', true);
			}
			if(!selection || JSB().isArray(selection) && selection.length != 1 || !JSB().isInstanceOf(selection.obj, 'Antiplag.OntologyNode')){
				this.toolbar.enableItem('export', false);
			} else {
				this.toolbar.enableItem('export', true);
			}
		},
		
		refresh: function(){
			var self = this;
			this.tree.getElement().loader();
			this.server.loadWorkspaceTree(function(wtree){
				self.tree.getElement().loader('hide');
				self.wtree = wtree;
				self.redrawTree();
			});
		},
		
		constructPathFromKey: function(key){
			var curKey = key;
			var path = '';
			while(curKey){
				var item = this.tree.get(curKey);
				if(path.length > 0){
					path = item.obj.getName() + '/' + path;
				} else {
					path = item.obj.getName();
				}
				curKey = item.parent;
			}
			
			return path;
		},
		
		addTreeItem: function(itemDesc, parent, bReplace){
			var self = this;
			var key = JSB().generateUid();
			var node = null;
			switch(itemDesc.type){
			case 'node':
				node = new Antiplag.FolderNode({
					descriptor: itemDesc,
					onChangeName: function(oldName, newName, evt){
						var node = this;
						var path = self.constructPathFromKey(parent);
						if(path.length > 0){
							path += '/';
						}
						var oldPath = path + oldName;
						var newPath = path + newName;
						self.server.renameCategory(oldPath, newPath, function(res){
							if(res){
								// all is ok
								node.setName(newName);
								self.sort();
							} else {
								node.editor.setData(oldName);
								node.editor.beginEdit();
								node.editor.setMark(true);
							}
						})
						
					}
				});
				
				self.installDropContainer(node);
				self.installUploadContainer(node);
				
				break;
			case 'ontology':
				node = new Antiplag.OntologyNode({
					descriptor: itemDesc,
					onDblClick: function(){
						var witem = this;
						if(!witem.ontology){
							self.$('.antiplagContainer').loader();
							self.$('.antiplagContainer').loader('content', 'Загрузка онтологии');
							self.currentWorkspace.server.ensureOntology(witem.descriptor.id, function(onto){
								self.$('.antiplagContainer').loader('hide');
								witem.ontology = onto;
								self.publish('changeWorkspaceElement', onto);
							});
						} else {
							self.publish('changeWorkspaceElement', witem.ontology);
						}
					}
				});
				key = itemDesc.id;
				break;
			case 'project':
				break;
			}
			
			var curTreeNode = null;
			if(bReplace){
				curTreeNode = self.tree.replaceNode({
					key: key,
					element: node,
					cssClass: itemDesc.type
				}, parent);
			} else {
				curTreeNode = self.tree.addNode({
					key: key,
					element: node,
					cssClass: itemDesc.type
				}, parent);
			}
			node.treeNode = curTreeNode;
			
			node.getElement().draggable({
				start: function(evt, ui){
					self.tree.setOption('allowHover', false);
					evt.originalEvent.preventDefault();
					evt.stopPropagation();
				},
				helper: function(evt, ui){
					var selected = self.tree.getSelected();
					if(!selected){
						selected = [];
					}
					if(!JSB().isArray(selected)){
						selected = [selected];
					}
					var bFound = false;
					for(var i in selected){
						if(selected[i].key == key){
							bFound = true;
							break;
						}
					}
					if(!bFound){
						selected = [self.tree.get(key)];
					}
					
					this.draggingItems = selected;
					
					// create drag container
					var helper = self.$('<div class="dragHelper workspaceItems"></div>');
					
					if(selected.length <= 3){
						for(var i = 0; i < selected.length; i++ ){
							helper.append(selected[i].obj.getElement().clone());
						}	
					} else {
						for(var i = 0; i < Math.min(selected.length, 2); i++ ){
							helper.append(selected[i].obj.getElement().clone());
						}
						if(selected.length > 2){
							var suffix = '';
							var odd = selected.length - 2;
							var dd = odd % 10;
							var dd2 = odd % 100;
							if( dd == 0 || (dd >= 5 && dd <= 9) || (dd2 >= 11 && dd2 <= 19)){
								suffix = 'ов';
							} else if(dd >= 2 && dd <= 4) {
								suffix = 'а';
							}
							helper.append(self.$('<div class="odd">... и еще <em>'+(selected.length - 2)+'</em> элемент' + suffix + '</div>'));
						}
					}
					
					return helper.get(0);
				},
				stop: function(evt, ui){
					self.tree.setOption('allowHover', true);
				},
				revert: false,
				scroll: false,
				zIndex: 100000,
				distance: 10,
				appendTo: 'body'
			});
			
			if(itemDesc.type == 'node'){
				for(var id in itemDesc.children){
					var desc = itemDesc.children[id];
					self.addTreeItem(desc, key);
				}
			}
			
			return node;
		},
		
		checkMove: function(targetNode, sourceNodes){
			var targetPath = null;
			if(!sourceNodes || sourceNodes.length === 0){
				return false;
			}
			if(targetNode){
				targetPath = this.constructPathFromKey(targetNode.treeNode.key);
			}
			for(var i in sourceNodes){
				if((targetNode && sourceNodes[i].treeNode.parent == targetNode.treeNode.key) || (!targetNode && sourceNodes[i].treeNode.parent == null)){
					return false;
				}
				if(targetPath){
					var sourcePath = this.constructPathFromKey(sourceNodes[i].treeNode.key);
					// check targetPath not overlapping sourcePath
					if(targetPath.indexOf(sourcePath) === 0){
						return false;
					}
				}
			}
			return true;
		},
		
		doMove: function(targetNode, sourceNodes){
			var self = this;
			function prepareNode(node){
				if(!node || JSB().isInstanceOf(node, 'Antiplag.FolderNode')){
					return {
						type: 'node',
						path: node ? self.constructPathFromKey(node.treeNode.key) : '',
						name: node ? node.getName() : ''
					}
				} else if(JSB().isInstanceOf(node, 'Antiplag.OntologyNode')){
					return {
						type: 'ontology',
						id: node.descriptor.id,
						path: self.constructPathFromKey(node.treeNode.parent)
					}
				}
				return null;
			}
			var targetObj = prepareNode(targetNode);
			var sourceArr = [];
			for(var i in sourceNodes){
				sourceArr.push(prepareNode(sourceNodes[i]));
			}
			
			this.server.moveItems(targetObj, sourceArr, function(res){
				if(res){
					for(var i in sourceNodes){
						self.tree.moveNode(sourceNodes[i].treeNode.key, targetNode ? targetNode.treeNode.key:null);
					}
				}
			});
		},
		
		removeItems: function(sel){
			var self = this;
			var batch = [];
			if(!JSB().isArray(sel)){
				sel = [sel];
			}
			for(var i in sel){
				var node = sel[i].obj;
				if(JSB().isInstanceOf(node, 'Antiplag.OntologyNode')){
					batch.push({
						type: 'ontology',
						id: node.descriptor.id,
						key: sel[i].key
					});
				} else if(JSB().isInstanceOf(node, 'Antiplag.FolderNode')){
					batch.push({
						type: 'node',
						path: node ? this.constructPathFromKey(node.treeNode.key) : '',
						key: sel[i].key
					});
				} else if(JSB().isInstanceOf(node, 'Antiplag.UploadNode')){
					if(node.getElement().is('.error')){
						self.tree.deleteNode(sel[i].key);
					}
				}
			}
			this.server.removeItems(batch, function(removed){
				for(var i in removed){
					self.tree.deleteNode(removed[i].key, function(itemObj){
						var node = itemObj.obj;
						if(JSB().isInstanceOf(node, 'Antiplag.OntologyNode') && node.ontology){
							node.ontology.destroy();
						}
					});
				}
			});
		},
		
		redrawTree: function(){
			var self = this;
			this.tree.clear();

			for(var id in this.wtree){
				var desc = this.wtree[id];
				this.addTreeItem(desc);
			}
			
			this.sort();
		},
		
		sort: function(){
			this.tree.sort(function(a, b){
				if(JSB().isInstanceOf(a.obj, 'Antiplag.FolderNode') && !JSB().isInstanceOf(b.obj, 'Antiplag.FolderNode')){
					return -1;
				}
				if(!JSB().isInstanceOf(a.obj, 'Antiplag.FolderNode') && JSB().isInstanceOf(b.obj, 'Antiplag.FolderNode')){
					return 1;
				}
				
				if(JSB().isInstanceOf(a.obj, 'Antiplag.FolderNode') && JSB().isInstanceOf(b.obj, 'Antiplag.FolderNode')){
					return a.obj.getName().localeCompare(b.obj.getName());
				}
				
				if(JSB().isInstanceOf(a.obj, 'Antiplag.OntologyNode') && JSB().isInstanceOf(b.obj, 'Antiplag.OntologyNode')){
					return a.obj.getUri().localeCompare(b.obj.getUri());
				}
				
				return 0;
			});
		},
		
		createNewOntology: function(ontoDesc){
			var self = this;
			// resolve parent
			var item = this.tree.getSelected();
			var parentKey = null;
			if(item == null){
				// choose root
			} else {
				if(JSB().isArray(item)){
					item = item[0];
				}
				if(JSB().isInstanceOf(item.obj, 'Antiplag.FolderNode')){
					parentKey = item.key;
				} else {
					// move up to nearest parent
					parentKey = item.parent;
				}
			}
			
			var curPath = this.constructPathFromKey(parentKey);
			
			// create new folder
			self.server.addOntology(curPath, ontoDesc, function(desc){
				if(!desc){
					// internal error: failed to create ontology
					return;
				}
				var node = self.addTreeItem(desc, parentKey);
				self.sort();
				
				self.$('.antiplagContainer').loader();
				self.$('.antiplagContainer').loader('content', 'Загрузка онтологии');
				self.currentWorkspace.server.ensureOntology(desc.id, function(onto){
					self.$('.antiplagContainer').loader('hide');
					self.publish('changeWorkspaceElement', onto);
				});
			});

		},
		
		createNewFolder: function(){
			var self = this;
			// resolve parent
			var item = this.tree.getSelected();
			var parentKey = null;
			if(item == null){
				// choose root
			} else {
				if(JSB().isArray(item)){
					item = item[0];
				}
				if(JSB().isInstanceOf(item.obj, 'Antiplag.FolderNode')){
					parentKey = item.key;
				} else {
					// move up to nearest parent
					parentKey = item.parent;
				}
			}
			
			// choose folder name
			this.server.loadWorkspaceFolders(function(categories){
				
				var catMap = {};
				for(var i in categories){
					catMap[categories[i]] = true;
				}

				var curPath = self.constructPathFromKey(parentKey);
				if(curPath.length > 0){
					curPath += '/';
				}
				
				var lastNum = 1;
				var path = null;
				while(true){
					// construct current folder path
					var testName = 'Новая папка';
					if(lastNum > 1){
						testName += ' ' + lastNum;
					}
					path = curPath + testName;
					if(!catMap[path]){
						break;
					}
					lastNum++;
				}
				
				// create new folder
				self.server.addCategory(path, function(desc){
					if(!desc){
						// internal error: folder already exists
						return;
					}
					var node = self.addTreeItem(desc, parentKey);
					JSB().deferUntil(function(){
						node.editor.beginEdit();
					}, function(){
						return node.getElement().width() > 0 && node.getElement().height() > 0;
					});
					
					self.sort();
				});
			});
		}
	},
	
	server: {
		getWorkspaces: function(){
			return Antiplag.WorkspaceManager.getWorkspaces();
		},
		
		setCurrentWorkspace: function(w){
			if(!w){
				return;
			}
			this.currentWorkspace = w;
			Antiplag.WorkspaceManager.setCurrentWorkspace(w);
		},
		
		loadWorkspaceFolders: function(){
			var w = this.currentWorkspace.getSystemWorkspace();
			var categories = w.getProperty('categories');
			return categories;
		},
		
		createWorkspace: function(){
			return Antiplag.WorkspaceManager.createWorkspace();
		},
		
		removeWorkspace: function(w){
			return Antiplag.WorkspaceManager.removeWorkspace(w);
		},
		
		renameCategory: function(oldCategory, newCategory){
			return this.currentWorkspace.renameCategory(oldCategory, newCategory);
		},
		
		moveItems: function(target, sources){
			return this.currentWorkspace.moveItems(target, sources);
		},
		
		removeItems: function(items){
			var removed = [];
			// remove ontologies
			for(var i in items){
				if(items[i].type == 'ontology'){
					if(this.currentWorkspace.removeOntology(items[i].id)){
						removed.push(items[i]);
					}
				}
			}
			
			// remove categories
			for(var i in items){
				if(items[i].type == 'node'){
					if(this.currentWorkspace.removeCategory(items[i].path)){
						removed.push(items[i]);
					}
				}
			}
			
			return removed;
		},
		
		addCategory: function(category){
			return this.currentWorkspace.addCategory(category);
		},
		
		addOntology: function(category, ontoDesc){
			var onto = this.currentWorkspace.createNewOntology(ontoDesc.name, category, ontoDesc.iri, ontoDesc.desc);
			return {
				type: 'ontology',
				id: onto.id(),
				title: onto.title(),
				name: onto.uri()
			};
		},
		
		addSpinOntology: function(category, ontoDesc){
			var onto = this.currentWorkspace.createNewSpinOntology(ontoDesc.name, category, ontoDesc.iri, ontoDesc.desc);
			return {
				type: 'spinontology',
				id: onto.id(),
				title: onto.title(),
				name: onto.uri()
			};
		},
			
		loadWorkspaceTree: function(){

			var tree = {};
			var w = this.currentWorkspace.getSystemWorkspace();
			
			function touch(cat){
				var curTree = tree;
				cat = cat.trim();
				if(cat.length > 0){
					var parts = cat.split('/');
					for(var i = 0; i < parts.length; i++ ){
						var part = parts[i];
						if(!curTree[part]){
							curTree[part] = {
								type: 'node',
								children: {},
								name: part
							}
						}
						curTree = curTree[part].children;
					}
				}
				
				return curTree;
			}
			
			// collect categories
			var categories = w.getProperty('categories');
			for(var i in categories){
				var cat = categories[i];
				touch(cat);
			}
			
			// collect projects
			var projects = w.projects();
			
			// collect ontologies
			var ontologies = w.ontologies();
			var ontoIds = ontologies.ids();
			for(var i in ontoIds){
				var id = ontoIds[i];
				var onto = ontologies.get(id);
				var treeNode = touch(onto.category());
				treeNode[onto.uri()] = {
					type: 'ontology',
					id: id,
					file: onto.getProperty('file'),
					title: onto.title(),
					name: onto.uri()
				};
				
				if(onto.getProperty('spin')){
					treeNode[onto.uri()].type = 'spinontology';
				}
			}
			
			
			return tree;
		},
		
		loadFromContent: function(obj){
			try {
				var onto = this.currentWorkspace.createOntologyFromContent(obj.name, obj.category, obj.content);
				var ontoDesc = {
					type: 'ontology',
					id: onto.id(),
					file: onto.getProperty('file'),
					title: onto.title(),
					name: onto.uri()
				};
				if(onto.getProperty('spin')){
					ontoDesc.type = 'spinontology';
				}
				return ontoDesc;
			} catch(e){
				return {
					type: 'error',
					error: e
				}
			}
		}
	}
});