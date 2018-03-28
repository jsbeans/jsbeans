{
	$name: 'JSB.Workspace.Explorer',
	$parent: 'JSB.Widgets.Widget',
	
	$require: ['JSB.Widgets.RendererRepository',
	           'JSB.Workspace.FolderNode',
	           'JSB.Workspace.UploadNode',
	           'JSB.Workspace.SearchEditor',
	           'JSB.Widgets.ToolBar', 
	           'JSB.Widgets.TreeView', 
	           'JSB.Widgets.ToolManager',
	           'JSB.Widgets.PrimitiveEditor',
	           'JSB.Widgets.Button',
	           'JQuery.UI.Effects',
	           'JQuery.UI.Loader',
	           'JSB.Web'],
	
	$sync: {
		updateCheckInterval: 0
	},
	
	currentWorkspace: null,
	wTreeMap: {},
	mCollapseKeys: {},
	mExpandKeys: {},
	
	$client: {
		_isReady: false,
		ignoreSync: 0,
		
		$constructor: function(opts){
			$base(opts);
			
			this.loadCss('Explorer.css');
			this.addClass('workspaceExplorer');
			
			// create toolbar
			this.toolbar = new ToolBar();
			this.append(this.toolbar);
			
			this.toolbar.addItem({
				key: 'createFolder',
				tooltip: 'Создать новую папку',
				element: '<div class="icon"></div>',
				click: function(){
					$this.createNewEntry('JSB.Workspace.FolderEntry', {}, 'Новая папка');
				}
			});
			
			this.toolbar.addSeparator({key: 'createSeparator'});

			var uploadItem = this.toolbar.addItem({
				key: 'import',
				tooltip: 'Импортировать файл',
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
				var self = this;
				var item = $this.tree.getSelected();
				var parentNode = null;
				var parentKey = null;
				if(item == null){
					// choose root
				} else {
					if(JSB().isArray(item)){
						item = item[0];
					}
					if(JSB().isInstanceOf(item.obj, 'JSB.Workspace.FolderNode')){
						parentNode = item.obj;
						parentKey = parentNode.treeNode.key;
					} else {
						// move up to nearest parent
						parentNode = $this.tree.get(item.parent).obj;
						parentKey = parentNode.treeNode.key;
					}
				}
				
				var files = [];
				for(var i = 0; i < this.files.length; i++ ){
					files.push(this.files[i]);
				}
				
				$this.expandNode(parentKey, function(){
					for(var i = 0; i < files.length; i++ ){
						var file = files[i];
						// upload file
						var uploadNode = new UploadNode({
							file: file, 
							node: parentNode, 
							item: null, 
							tree: $this.tree,
							w: $this,
							workspace: $this.currentWorkspace
						});
						var curTreeNode = $this.tree.addNode({
							key: JSB().generateUid(),
							element: uploadNode,
						}, parentKey);
						uploadNode.treeNode = curTreeNode;
						uploadNode.execute();
					}
					
				});
				
			});
			
			var downloadItem = this.toolbar.addItem({
				key: 'export',
				tooltip: 'Экспортировать файл',
				element: '<div class="icon"><input type="file" style="display: none;" /></div>',
				click: function(evt, id, obj){
					var elt = $this.$(evt.currentTarget);
					var sel = $this.tree.getSelected();
					if(!sel){
						return;
					}
					
					// TODO: export
				}
			});
			
			this.toolbar.addSeparator({key: 'lastSeparator'});

			this.toolbar.addItem({
				key: 'delete',
				tooltip: 'Удалить',
				element: '<div class="icon"></div>',
				click: function(){
					var sel = $this.tree.getSelected();
					var selToDel = $this.combineSelectionForDelete(sel);
					if(!selToDel || selToDel.length == 0){
						return;
					}
					var targets = [];
					var constraints = [];
					if(!JSB().isArray(selToDel) || selToDel.length == 1){
						var ss = selToDel;
						if(JSB().isArray(ss)){
							ss = selToDel[0];
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
							selector: $this.$(this),
							pivotHorz: 'center',
							pivotVert: 'center',
							offsetHorz: 0,
							offsetVert: 0
						}
						constraints = [{
							selector: $this.$(this),
							weight: 10.0
						}];
					}
					var msgElt = $this.$('<div><div>Следующие элементы будут удалены безвозвратно:</div></div>');
					var nodesToDelElt = $this.$('<div style="font-weight:bold; padding: 4px 0 0 10px;"></div>');
					for(var i = 0; i < selToDel.length; i++){
						var nodeElt = '';
						var node = selToDel[i].obj;
						if(JSB.isInstanceOf(node, 'JSB.Workspace.EntryNode')){
							var entry = node.getEntry();
							var renderer = RendererRepository.createRendererFor(entry, {editable:false});
							nodeElt = renderer.getElement();
						} else {
							nodeElt = $this.$('<span></span>').text(selToDel[i].obj.getName());
						}
						nodesToDelElt.append($this.$('<div></div>').append(nodeElt));
					}
					msgElt.append(nodesToDelElt);
					msgElt.append('<div>Продолжить удаление?</div>');
					ToolManager.showMessage({
						icon: 'removeDialogIcon',
						text: msgElt,
						buttons: [{text: 'Удалить', value: true},
						          {text: 'Нет', value: false}],
						target: targets,
						constraints: constraints,
						callback: function(bDel){
							if(bDel){
								$this.removeItems(selToDel);
							}
						}
					});
				}
			});
			
			this.toolbar.addSeparator({key: 'deleteSeparator'});
			
			this.toolbar.addItem({
				key: 'search',
				tooltip: 'Поиск',
				allowHover: false,
				element: new SearchEditor({
					onChange: function(txt){
						$this.updateFiltered(txt && txt.toLowerCase());
					}
				}),
			});

			this.tree = new TreeView({
				selectMulti: true,
				onSelectionChanged: function(key, obj){
					$this.updateToolbar();
				},
				onNodeSelected: function(key, bSelected, evt){
					$this.publish('JSB.Workspace.Explorer.nodeSelected', {node: $this.tree.get(key).obj, selected: bSelected});
				},
				onNodeHighlighted: function(key, bHighlighted, evt){
					$this.publish('JSB.Workspace.Explorer.nodeHighlighted', {node: $this.tree.get(key).obj, selected: bHighlighted});
				}

			});
			this.append(this.tree);
			
			// replace container
			this.installDropContainer(null);
			
			// file upload
			this.installUploadContainer(null);

			$this.toolbar.getElement().resize(function(){
				JSB.defer(function(){
					$this.tree.getElement().css({
						top: $this.toolbar.getElement().outerHeight()
					});
				}, 100, 'explorerToolbarResize' + $this.getId());
			});

			this.subscribe('JSB.Workspace.nodeOpen', function(sender, msg, node){
			    if(node.workspace !== $this.currentWorkspace) {return};

			    var nodeKey = $this.wTreeMap[node.descriptor.entry.getId()] ? $this.wTreeMap[node.descriptor.entry.getId()].key : null;
			    if(!nodeKey) return;
			    if(node.getEntry().getChildCount() > 0){
			        $this.tree.expandNode(nodeKey);
			    }
			    $this.tree.selectItem(nodeKey);
			});

			this.subscribe('JSB.Workspace.Entry.open', function(sender, msg, entry){
			    $this.openNodeByEntry(entry);
			});
			
			this.subscribe('JSB.Workspace.Entry.updated', function(sender, msg, syncInfo){
				if(sender == $this.currentWorkspace && $this._isReady){
					if(syncInfo.isChanged('_name')){
						$this.updateTab();
					}
					if(syncInfo.isChanged('_childCount')){
						$this.synchronizeNodeChildren();
					}
				}
			});
			
			this.publish('JSB.Workspace.Explorer.initialized');

			this.refreshWorkspaces();
		},
		
		pushIgnoreSync: function(){
			this.ignoreSync++;
		},
		
		popIgnoreSync: function(){
			this.ignoreSync--;
			if(this.ignoreSync < 0){
				this.ignoreSync = 0;
			}
		},
		
		isIgnoreSync: function(){
			return this.ignoreSync > 0;
		},
		
		refreshWorkspaces: function(){
			$this.server().getWorkspaces(function(wMap){
				if(Object.keys(wMap).length == 0){
					throw 'Error: No default workspace existed';
				}
				var lastId = Web.getCookie('Workspace.currentWorkspace');
				if(!wMap[lastId]){
					// choose the first user workspace
					var bFound = false;
					for(var wId in wMap){
						if(wMap[wId].wType == 'user'){
							bFound = true;
							lastId = wId;
							break;
						}
					}
					if(!bFound){
						throw new Error('Failed to find user workspace');
					}
				}
				$this.setCurrentWorkspaceId(lastId);
			});
			
		},
		
		setCurrentWorkspaceId: function(wId, callback){
			Web.setCookie('Workspace.currentWorkspace', wId, {expires: 30*24*3600});
			this._isReady = false;
			this.server().setCurrentWorkspaceId(wId, function(wInfo){
				var w = wInfo.workspace;
				var explorerNodeTypes = wInfo.explorerNodeTypes;
				$this.currentWorkspace = w;
				$this.explorerNodeTypes = explorerNodeTypes;
				$this.publish('JSB.Workspace.changeWorkspace', w);

				// upload all node type beans
				var nodeTypes = [];
				for(var eType in explorerNodeTypes){
					var nType = explorerNodeTypes[eType];
					nodeTypes.push(nType);
				}
				
				// lookup all nodeBeans
				$jsb.chain(nodeTypes, function(nType, c){
					$jsb.lookup(nType, function(cls){
						c.call($this);
					});
				}, function(){
					$this.updateTab();
					$this.refresh();
					$this.updateToolbar();
					
					if(callback){
						callback.call($this);
					}
					
				});

			});
		},
		
		updateTab: function(){
			var tab = this.getContainer().getTab(this.getId());
			var wIcon = tab.tab.find('._dwp_icon');
			var textElt = tab.tab.find('._dwp_tabText');
			var editor = textElt.find('> ._dwp_primitiveEditor');
			if(editor.length > 0){
				editor = editor.jsb();
			} else {
				editor = new PrimitiveEditor({
					mode: 'inplace',
					onValidate: function(val){
						var t = val.trim();
						if(t.length < 3 || t.length > 32){
							return false;
						}
						return /^[\-_\.\s\wа-я]+$/i.test(t);
					},
					onChange: function(val){
						if($this.currentWorkspace.getName() == val.trim()){
							return;
						}
						$this.renameWorkspace(val.trim());
/*						
						$this.currentWorkspace.server().setName(val.trim(), function(){
							
							if(!res){
								editor.setData($this.currentWorkspace.getName());
								editor.setMark(true);
								editor.beginEdit();	
							}
							
						});
*/						
					}
				});
				var renameBtn = new Button({
					cssClass: 'roundButton btnEdit btn10',
					tooltip: 'Изменить название',
					onClick: function(){
						JSB().defer(function(){
							editor.beginEdit();	
						});
						
					}
				});
				var menuBtn = new Button({
					cssClass: 'roundButton btnMenu btn10',
					tooltip: 'Переключить рабочее пространство',
					onClick: function(){
						$this.showWorkspaceMenu();
					}
				});
				textElt.empty()
					.append(editor.getElement())
					.append(renameBtn.getElement())
					.append(menuBtn.getElement());
			}
			editor.setData(this.currentWorkspace.getName());
			wIcon.attr('wtype', this.currentWorkspace.getWorkspaceType());
		},
		
		resetFiltered: function(){
			for(var eId in this.wTreeMap){
				if(JSB.isInstanceOf(this.wTreeMap[eId].node, 'JSB.Workspace.ExplorerNode')){
					this.wTreeMap[eId].node.setColored(false);
				}
			}
		},
		
		updateFiltered: function(filter){
			function _updateFiltered(filter){
				$this.lastFilter = filter;
				if(filter && filter.length >= 3 ){
					$this.tree.getElement().loader();
					$this.server().loadFilteredNodes(filter, function(sTree){
						
						if($this.lastFilter != filter){
							return;
						}
						$this.expandFound(sTree);
					});
				} else {
					// reset filter
					$this.resetFiltered();
				}
			}
			JSB.defer(function(){
				_updateFiltered(filter);
			}, 300, 'JSB.Workspace.Explorer.updateFiltered.' + this.getId());
		},
		
		highlightFiltered: function(sTree){
			$this.resetFiltered();
			var minTop = null;
			var topNode = null;
			
			function _highlightFiltered(scope){
				for(var eId in scope){
					if(scope[eId].matched){
						$this.wTreeMap[eId].node.setColored(true);
						var rcNode = $this.wTreeMap[eId].node.getElement().get(0).getBoundingClientRect();
						if(JSB.isNull(minTop) || rcNode.top < minTop){
							minTop = rcNode.top;
							topNode = $this.wTreeMap[eId].node;
						}
					}
					_highlightFiltered(scope[eId].children);
				}
			}
			
			_highlightFiltered(sTree);
			if(topNode){
				$this.tree.scrollTo(topNode.treeNode.key);
			}
			$this.tree.getElement().loader('hide');
		},
		
		expandFound: function(nTree){
			this.tree.collapseAll();
			
			// prepare expand list
			var eLst = [];
			
			function placeExpandList(dId, dDesc, deep){
				if(dDesc.children && Object.keys(dDesc.children).length > 0){
					if(!eLst[deep]){
						eLst[deep] = {};
					}
					eLst[deep][dId] = true;
					for(var chId in dDesc.children){
						placeExpandList(chId, dDesc.children[chId], deep + 1);
					}
				}
			}
			
			for(var eId in nTree){
				placeExpandList(eId, nTree[eId], 0);
			}
			
			function _expandIteration(){
				if(eLst.length == 0){
					JSB.defer(function(){
						$this.highlightFiltered(nTree);	
					});
				} else {
					var ids = eLst.shift();
					JSB.chain(Object.keys(ids), function(id, callback){
						var key = $this.wTreeMap[id].key;
						$this.expandNode(key, callback);
					}, function(){
						_expandIteration();
					})
				}
			}
			
			_expandIteration();
		},
		
		renameWorkspace: function(newName){
			this.server().renameWorkspace(newName, function(){
				$this.currentWorkspace._name = newName;
			});
		},

		showWorkspaceMenu: function(){
			var tab = this.getContainer().getTab(this.getId());
			var btnElt = tab.tab.find('.btnMenu');
			
			this.server().getWorkspaces(function(wMap){
				// construct menu
				var items = [{
					key: 'createWorkspace',
					element: '<div class="icon"></div><div class="text">Создать рабочую область ...</div>',
					cssClass: 'menuItem menuCreate'
				}];
				
				var userWorkspaceIds = [];
				var systemWorkspaceIds = [];
				for(var wId in wMap){
					if(wId == $this.currentWorkspace.getId()){
						continue;
					}
					if(wMap[wId].wType == 'system'){
						systemWorkspaceIds.push(wId);
					} else {
						userWorkspaceIds.push(wId);
					}
				}
				
				function _compareWorkspaces(id1, id2){
					return wMap[id1].wName.localeCompare(wMap[id2].wName);
				}
				
				systemWorkspaceIds.sort(_compareWorkspaces);
				userWorkspaceIds.sort(_compareWorkspaces);

				// add separator
				if(userWorkspaceIds.length > 0){
					items.push({
						key: 'menuSeparator',
						element: '<div class="separator"></div>',
						cssClass: 'menuSeparator',
						allowHover: false,
						allowSelect: false
					});
				}
				
				// add other items
				for(var i = 0; i < userWorkspaceIds.length; i++){
					wId = userWorkspaceIds[i];
					(function(wId){
						var strProc = $this.callbackAttr(function(evt){
							if(!evt) {
								evt = this.event;
							}
							evt.cancelBubble = true;
							if(evt.stopPropagation){
								evt.stopPropagation();
							}
							$this.tryRemoveWorkspace(wId, wMap[wId].wName, evt, $this.messageTool);
						});
						items.push({
							key: wId,
							element: '<div class="icon"></div><div class="text">'+wMap[wId].wName+'</div><div class="delete" onclick="('+strProc+')(event)"><div class="icon"></div></div>',
							cssClass: 'menuItem menuWorkspace userWorkspace'
						});
					})(wId);
				}
				
				if(systemWorkspaceIds.length > 0){
					items.push({
						key: 'menuSeparator',
						element: '<div class="separator"></div>',
						cssClass: 'menuSeparator',
						allowHover: false,
						allowSelect: false
					});
				}
				
				for(var i = 0; i < systemWorkspaceIds.length; i++){
					wId = systemWorkspaceIds[i];
					items.push({
						key: wId,
						element: '<div class="icon"></div><div class="text">'+wMap[wId].wName+'</div>',
						cssClass: 'menuItem menuWorkspace systemWorkspace'
					});
				}
				
				$this.messageTool = ToolManager.activate({
					id: '_dwp_droplistTool',
					cmd: 'show',
					data: items,
					key: 'workspaceMenu',
					target: {
						selector: btnElt,
						dock: 'bottom'
					},
					callback: function(key, item, evt){
						if(key == 'createWorkspace'){
							// create new workspace
							$this.server().createWorkspace(function(wInfo){
								$this.setCurrentWorkspaceId(wInfo.wId, function(){
									var editor = tab.tab.find('._dwp_primitiveEditor').jsb();
									editor.beginEdit();
								});
							});
						} else {
							// switch workspace
							$this.setCurrentWorkspaceId(key);
						}
					}
				});
				
			});
		},

		tryRemoveWorkspace: function(wId, wName, evt, messageTool){
			var sel = this.$(evt.currentTarget);
			ToolManager.showMessage({
				icon: 'removeDialogIcon',
				text: 'Содержимое рабочей области <strong>'+wName+'</strong> будет безвозвратно удалено. Вы уверены, что хотите удалить?',
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
						$this.server().removeWorkspace(wId, function(){
							messageTool.close();
						});
					}
				}
			});
		},
		
		installDropContainer: function(node){
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
							if(!JSB.isInstanceOf(obj, 'JSB.Workspace.ExplorerNode')){
								continue;
							}
							// temporary check
							if(JSB.isInstanceOf(obj, 'DataCube.SliceNode') 
								|| JSB.isInstanceOf(obj, 'DataCube.SqlTableNode') 
								|| JSB.isInstanceOf(obj, 'DataCube.WidgetNode')) {
								continue;
							}
/*							
							if(JSB.isInstanceOf(obj, 'JSB.Workspace.EntryNode')){
								if(obj.getEntry().getParentId()){
									continue;	// node has a fixed parent - skipping
								}
							}
*/							
							nodes.push(obj);
						}
						// check for dragging items
						return $this.checkMove(node, nodes);
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
						if(!JSB().isInstanceOf(obj, 'JSB.Workspace.ExplorerNode')){
							continue;
						}
						nodes.push(obj);
					}
					$this.doMove(node, nodes);
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
					
					var parentKey = node ? node.treeNode.key : null;
					var files = [];
					var items = [];
					for(var i = 0; i < dt.files.length; i++ ){
						files.push(dt.files[i]);
						items.push(dt.items[i]);
					}
					$this.expandNode(parentKey, function(){
						for(var i = 0; i < files.length; i++ ){
							var file = files[i];
							// upload file
							var uploadNode = new UploadNode({
								file: file, 
								node: node, 
								item: dt.items ? items[i].webkitGetAsEntry() : null, 
								tree: $this.tree,
								w: $this,
								workspace: $this.currentWorkspace
							});
							var curTreeNode = $this.tree.addNode({
								key: JSB.generateUid(),
								element: uploadNode,
							}, parentKey);
							uploadNode.treeNode = curTreeNode;
							uploadNode.execute();
						}
						
					});
					
					return false;
				}
			});
		},
		
		combineSelectionForDelete: function(sel){
			if(!sel){
				return sel;
			}
			var newSel = [];
			if(!JSB.isArray(sel)){
				sel = [sel];
			}
			for(var i = 0; i < sel.length; i++){
				var node = sel[i].obj;
				if(JSB.isInstanceOf(node, 'JSB.Workspace.EntryNode')){
					var entry = node.getEntry();
				}
				newSel.push(sel[i]);
			}
			return newSel;
		},

		updateToolbar: function(){
			var selection = this.tree.getSelected();
			
			// calculate selection for delete
			var selToDel = this.combineSelectionForDelete(selection);
			
			if(!selToDel || selToDel.length == 0){
				// disable buttons
				this.toolbar.enableItem('delete', false);
			} else {
				// enable buttons
				this.toolbar.enableItem('delete', true);
			}
/*			
			if(!selection || JSB().isArray(selection) && selection.length != 1 || !JSB().isInstanceOf(selection.obj, 'Ontoed.OntologyNode')){
				this.toolbar.enableItem('export', false);
			} else {
				this.toolbar.enableItem('export', true);
			}
*/			
		},

		refresh: function(){
		    this._isReady = false;
			this.tree.getElement().loader();
			this.server().loadNodes(function(nTree){
				$this.tree.getElement().loader('hide');
				$this.wTree = nTree;
				$this.redrawTree(nTree);
				$this._isReady = true;
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

		addTreeItem: function(itemDesc, parent, bReplace, treeNodeOpts){
		    var key = JSB().generateUid();
			var node = null;
/*			
			if(this.wTreeMap[itemDesc.entry.getId()] && !bReplace){
				return this.wTreeMap[itemDesc.entry.getId()].node;
			}
*/			
			var nodeSlice = this.explorerNodeTypes;
			var nodeType = nodeSlice[itemDesc.entry.getJsb().$name];
			if(!nodeType || !JSB.get(nodeType)){
				return null;
			}
			var nodeCls = JSB.get(nodeType).getClass();
			node = new nodeCls({
				descriptor: itemDesc,
				allowOpen: true,
				allowEdit: true
			});
			this.wTreeMap[itemDesc.entry.getId()] = {
                id: itemDesc.entry.getId(),
                key: key,
                parent: itemDesc.entry.getParentId(),
                parentKey: parent,
                node: node
            };

			
			node.explorer = this;
			node.workspace = this.currentWorkspace;
			
			var curTreeNode = null;
			function onNodeExpand(treeNode, isManual){
			    if(isManual) {
			        $this.mExpandKeys[treeNode.key] = true;
			        $this.mCollapseKeys[treeNode.key] = false;
			    }
				if(!treeNode.dynamicChildren){
					return;
				}
				$this._isReady = false;
				$this.server().loadNodes(itemDesc.entry, function(nTree){
					var chArr = Object.keys(nTree);
					chArr.sort(function(a, b){
						return nTree[a].name.localeCompare(nTree[b].name);
					});
					var parentKey = treeNode.key;
					for(var i = 0; i < chArr.length; i++){
						var eId = chArr[i];
						var chDesc = nTree[eId];
						$this.addTreeItem(chDesc, parentKey, false, {collapsed:true});
					}

					$this._isReady = true;
					treeNode.obj.setTrigger('JSB.Workspace.Explorer.nodeChildrenLoaded.' + treeNode.key);
				});
			}
			function onNodeCollapse(treeNode, isManual){
                if(isManual) {
                    $this.mExpandKeys[treeNode.key] = false;
                    $this.mCollapseKeys[treeNode.key] = true;
                }
			    var selected = $this.tree.getSelected();

			    if(selected && $this.tree.isChild(treeNode.key, selected.key, true)){
			        $this.tree.selectItem(null, null);
			    }
			}
			if(bReplace){
				curTreeNode = $this.tree.replaceNode({
					key: key,
					element: node,
					dynamicChildren: itemDesc.hasEntryChildren,
					childrenLoadingText: 'Загрузка',
					onExpand: onNodeExpand,
					onCollapse: onNodeCollapse,
					collapsed: treeNodeOpts && treeNodeOpts.collapsed
				}, parent);
			} else {
				curTreeNode = $this.tree.addNode({
					key: key,
					element: node,
					dynamicChildren: itemDesc.hasEntryChildren,
					childrenLoadingText: 'Загрузка',
					onExpand: onNodeExpand,
					onCollapse: onNodeCollapse,
					collapsed: treeNodeOpts && treeNodeOpts.collapsed
				}, parent);
			}
			node.treeNode = curTreeNode;
			
			if(JSB.isInstanceOf(node, 'JSB.Workspace.FolderNode')){
				this.installDropContainer(node);
				this.installUploadContainer(node);
			}
			
			if(node.options.allowOpen){
				node.getElement().dblclick(function(){
					$this.publish('JSB.Workspace.nodeOpen', node);
				});
			}
			
			node.getElement().draggable({
				start: function(evt, ui){
					$this.tree.setOption('allowHover', false);
					evt.originalEvent.preventDefault();
					evt.stopPropagation();
				},
				helper: function(evt, ui){
					var selected = $this.tree.getSelected();
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
						selected = [$this.tree.get(key)];
					}
					
					this.draggingItems = selected;
					
					// create drag container
					var helper = $this.$('<div class="dragHelper workspaceItems"></div>');
					
					function prepareNodeForDragging(node){
						if(JSB.isInstanceOf(node, 'JSB.Workspace.EntryNode')){
							return RendererRepository.createRendererFor(node.getEntry()).getElement();
						} else {
							return node.getElement().clone();
						}
					}
					
					if(selected.length <= 3){
						for(var i = 0; i < selected.length; i++ ){
							helper.append($this.$('<div class="dragItem"></div>').append(prepareNodeForDragging(selected[i].obj)));
						}	
					} else {
						for(var i = 0; i < Math.min(selected.length, 2); i++ ){
							helper.append($this.$('<div class="dragItem"></div>').append(prepareNodeForDragging(selected[i].obj)));
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
							helper.append($this.$('<div class="odd">... и еще <em>'+(selected.length - 2)+'</em> элемент' + suffix + '</div>'));
						}
					}
					
					return helper.get(0);
				},
				stop: function(evt, ui){
					$this.tree.setOption('allowHover', true);
				},
				revert: false,
				scroll: false,
				zIndex: 100000,
				distance: 30,
				appendTo: 'body'
			});
			
			if(itemDesc.children && Object.keys(itemDesc.children).length > 0){
				var chArr = Object.keys(itemDesc.children);
				chArr.sort(function(a, b){
					return itemDesc.children[a].name.localeCompare(itemDesc.children[b].name);
				});
				for(var i = 0; i < chArr.length; i++){
					var eId = chArr[i];
					var desc = itemDesc.children[eId];
					$this.addTreeItem(desc, key);
				}
			}
			
			return node;
		},
		
		expandNode: function(key, callback){
			if(key){
				$this.tree.expandNode(key);
				if($this.tree.isDynamicChildren(key)){
					var node = $this.tree.get(key).obj;
					node.ensureTrigger('JSB.Workspace.Explorer.nodeChildrenLoaded.' + key, function(){
						callback.call($this);
					});
				} else {
					callback.call($this);
				}
			} else {
				callback.call($this);
			}
		},

		removeTreeItem: function(key){
		    this.tree.deleteNode(key);
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
			var targetId = targetNode ? targetNode.getEntry().getId() : null;
			var sourceIds = [];
			for(var i = 0; i < sourceNodes.length; i++){
				sourceIds.push(sourceNodes[i].getEntry().getId());
			}
			
			this.server().moveItems(targetId, sourceIds, function(res){
				if(targetNode){
					$this.tree.expandNode(targetNode.treeNode.key);
				}
			});
		},
		
		removeItems: function(sel){
			var batch = [];
			if(!JSB().isArray(sel)){
				sel = [sel];
			}
			for(var i in sel){
				var node = sel[i].obj;
				if(JSB().isInstanceOf(node, 'JSB.Workspace.UploadNode')){
					if(node.getElement().is('.error')){
						$this.tree.deleteNode(sel[i].key);
					}
				} else if(JSB().isInstanceOf(node, 'JSB.Workspace.EntryNode')){
					batch.push({
						id: node.getEntry().getId(),
						key: sel[i].key
					});
				}
			}
			this.server().removeItems(batch, function(removed){
				for(var i = 0; i < removed.length; i++){
					if($this.tree.get(removed[i])){
						$this.tree.deleteNode(removed[i]);
					}
				}
			});
		},
		
		synchronizeNodeChildren: function(pKey){
			if(this.isIgnoreSync()){
				return;
			}
			var pEntry = this.currentWorkspace;
			var treeNode = null;
			if(pKey){
				treeNode = this.tree.get(pKey).obj;
				pEntry = treeNode.getEntry();
				
				if(this.tree.isDynamicChildren(pKey) && pEntry.getChildCount() > 0){
					return;
				}
				
				if((!this.tree.isDynamicChildren(pKey) && this.tree.getChildNodes(pKey).length == 0 && pEntry.getChildCount() > 0) || 
					(this.tree.isDynamicChildren(pKey) && pEntry.getChildCount() == 0)){
					// change dynamic node type
					this.addTreeItem({
						entry: pEntry,
						name: pEntry.getName(),
						hasEntryChildren: pEntry.getChildCount() > 0
					}, pKey, true, {collapsed:true});
					return;
				}
			}
			
			
			// load actual children
			this.server().loadNodes(pEntry, function(nTree){
				// collect current tree children
				var treeChildren = {};
				var chArr = $this.tree.getChildNodes(pKey);
				for(var i = 0; i < chArr.length; i++){
					var node = $this.tree.get(chArr[i]).obj;
					if(JSB.isInstanceOf(node, 'JSB.Workspace.EntryNode')){
						var e = node.getEntry();
						treeChildren[e.getId()] = chArr[i];
					}
				}

				// remove missing
				for(var eId in treeChildren){
					if(!nTree[eId]){
						$this.tree.deleteNode(treeChildren[eId]);
					}
				}
				
				// add new
				var bNew = false;
				for(var eId in nTree){
					if(!treeChildren[eId]){
						$this.addTreeItem(nTree[eId], pKey, false, {collapsed:true});
						bNew = true;
					}
				}
				if(bNew){
					$this.sort();
				}
			});
		},
		
		redrawTree: function(nTree, bExpanded){
			this.tree.clear();
			for(var eId in nTree){
				var desc = nTree[eId];
				this.addTreeItem(desc, null, false, {collapsed:bExpanded ? false:true});
			}
			
			this.sort();
		},
		
		sort: function(){
			this.tree.sort(function(a, b){
				if(JSB().isInstanceOf(a.obj, 'JSB.Workspace.FolderNode') && !JSB().isInstanceOf(b.obj, 'JSB.Workspace.FolderNode')){
					return -1;
				}
				if(!JSB().isInstanceOf(a.obj, 'JSB.Workspace.FolderNode') && JSB().isInstanceOf(b.obj, 'JSB.Workspace.FolderNode')){
					return 1;
				}
				
				return a.obj.getName().localeCompare(b.obj.getName());
			});
		},
		
		createNewEntry: function(eType, opts, prefixName){
			// resolve parent
			var item = this.tree.getSelected();
			var parentEntry = null;
			var parentKey = null;
			if(item == null){
				// choose root
			} else {
				if(JSB().isArray(item)){
					item = item[0];
				}
				var curItem = item;
				while(curItem){
					if(JSB().isInstanceOf(curItem.obj, 'JSB.Workspace.FolderNode')){
						parentEntry = curItem.obj.getEntry();
						parentKey = curItem.key;
						break;
					} else {
						if(curItem.parent){
							curItem = this.tree.get(curItem.parent);
						} else {
							curItem = null;
						}
					}
				}
			}
			$this.pushIgnoreSync();
			$this.expandNode(parentKey, function(){
				$this.server().createNewEntry(eType, opts, prefixName, parentEntry, function(desc){
					if(!desc){
						// internal error: folder already exists
						$this.popIgnoreSync();
						return;
					}
					var node = $this.addTreeItem(desc, parentKey);
					if(parentKey){
						$this.tree.expandNode(parentKey);
					}
					$this.sort();
					$this.popIgnoreSync();
					if(!node){
						return;
					}
					JSB().deferUntil(function(){
						$this.tree.scrollTo(node.treeNode.key);
						if(node.options.allowOpen){
							$this.publish('JSB.Workspace.nodeOpen', node);
						}
						if(node.renderer && node.renderer.editor){
							node.renderer.editor.beginEdit();	
						}
						
					}, function(){
						return node.getElement().width() > 0 && node.getElement().height() > 0 && node.renderer;
					});
				});
			});

/*			
			this.server().loadEntryNames(function(names){
				var nameMap = {};
				for(var i = 0; i < names.length; i++){
					nameMap[names[i]] = true;
				}
				var lastNum = 1;
				var testName;
				while(true){
					// construct current folder path
					var testName = prefixName + ' ' + lastNum;
					if(!nameMap[testName]){
						break;
					}
					lastNum++;
				}
				var curPath = $this.constructPathFromKey(parentKey);
				$this.server().addEntry(eType, opts, testName, curPath, function(desc){
					if(!desc){
						// internal error: folder already exists
						return;
					}
					var node = $this.addTreeItem(desc, parentKey);
					if(!node){
						return;
					}
					JSB().deferUntil(function(){
						if(node.options.allowOpen){
							$this.publish('JSB.Workspace.nodeOpen', node);
						}
						if(node.renderer && node.renderer.editor){
							node.renderer.editor.beginEdit();	
						}
						
					}, function(){
						return node.getElement().width() > 0 && node.getElement().height() > 0 && node.renderer;
					});
					
					$this.sort();
				});
			});*/
		},

		openNodeByEntry: function(entry){
		    function getNodeKeyByEntryId(entryId){
    		    for(var i in $this.tree.itemMap){
    		        if(!$this.tree.itemMap[i].dummy && $this.tree.itemMap[i].obj.descriptor.entry.getId() === entryId){
    		            return $this.tree.itemMap[i].key;
    		        }
    		    }
		    }

		    var nodeKey = getNodeKeyByEntryId(entry.getId());
		    if(nodeKey){
		        this.tree.selectItem(nodeKey);

		        this.publish('JSB.Workspace.nodeOpen', this.tree.get(nodeKey).obj);
		    } else {
		        var parentKey = getNodeKeyByEntryId(entry.getParentId());

		        if(parentKey){
		            this.expandNode(parentKey, function(){
		                var nodeKey = getNodeKeyByEntryId(entry.getId());

		                if(nodeKey){
		                    $this.tree.selectItem(nodeKey);

		                    $this.publish('JSB.Workspace.nodeOpen', $this.tree.get(nodeKey).obj);
		                }
		            });
		        } else {
		            // todo
		        }
		    }
		}
	},
	
	$server: {
		$require: ['JSB.Workspace.WorkspaceController',
		           'JSB.System.Kernel'],
		
		$constructor: function(){
			$base();
			this.subscribe('JSB.Workspace.workspaceUpdated', function(sender, msg, params){
				$jsb.defer(function(){
					$this.remote().refresh();
				}, 300, 'updated_' + $this.getId());
			});
		},
		
		getWorkspaces: function(){
			var userWType = 'user';
			var wArr = WorkspaceController.getWorkspacesInfo(Kernel.user());
			var bFound = false;
			for(var i = 0; i < wArr.length; i++){
				if(wArr[i].wType == userWType){
					bFound = true;
					break;
				}
			}
			if(!bFound){
				var ws = WorkspaceController.createWorkspace(userWType);
				wArr = WorkspaceController.getWorkspacesInfo(Kernel.user());
			}
			var wMap = {};
			for(var i = 0; i < wArr.length; i++){
				wMap[wArr[i].wId] = {
					wId: wArr[i].wId,
					wType: wArr[i].wType,
					wOwner: wArr[i].wOwner,
					wName: WorkspaceController.getWorkspace(wArr[i].wId).getName()
				};
			}
			return wMap;
		},
		
		setCurrentWorkspaceId: function(wId){
			if(!wId){
				return;
			}
			$this.currentWorkspace = WorkspaceController.getWorkspace(wId);
			$this.explorerNodeTypes = WorkspaceController.constructExplorerNodeTypeSlice($this.currentWorkspace.getWorkspaceType());
			return {
				workspace: $this.currentWorkspace, 
				explorerNodeTypes: $this.explorerNodeTypes
			};
		},
		
		loadEntryNames: function(){
			var w = this.currentWorkspace;
			var nameArr = [];
			for (var entry, it = w.entries(); entry = it.next();) {
				nameArr.push(entry.getName());
			}
			return nameArr;
		},
		
		createWorkspace: function(){
			var names = {};
			var wsMap = this.getWorkspaces();
			for(var wId in wsMap){
				names[wsMap[wId].wName.trim()] = true;
			}
			var userWType = 'user';
			var ws = WorkspaceController.createWorkspace(userWType);
			var prefix = ws.getName().trim();
			var testName = prefix;
			for(var i = 1; ; i++ ){
				if(i > 1){
					testName = prefix + ' ' + i;
				}
				if(!names[testName]){
					break;
				}
			}
			ws.setName(testName);
			ws.store();
			
			var wInfo = WorkspaceController.getWorkspaceInfo(ws.getId());
			wInfo.wName = testName;
			
			return wInfo;
		},
		
		removeWorkspace: function(wId){
			WorkspaceController.removeWorkspace(wId);
		},
		
		renameWorkspace: function(newName){
			this.currentWorkspace.setName(newName);
			this.currentWorkspace.store();
		},
		
		moveItems: function(tId, sources){
			var bNeedStore = false;
			for(var i = 0; i < sources.length; i++){
				var sId = sources[i];
				if(sId == tId){
					continue;
				}
				
				// check for cycle
				var curEntry = tId ? this.currentWorkspace.entry(tId) : this.currentWorkspace;
				var bCycle = false;
				while(curEntry && curEntry.getParentId()){
					if(curEntry.getParentId() == sId){
						bCycle = true;
						break;
					}
					curEntry = this.currentWorkspace.entry(curEntry.getParentId());
				}
				
				if(bCycle){
					continue;
				}
				
				var target = tId ? this.currentWorkspace.entry(tId) : this.currentWorkspace;
				target.addChildEntry(this.currentWorkspace.entry(sId));
				bNeedStore = true;
			}
			if(bNeedStore){
				this.currentWorkspace.store();
			}
		},
		
		removeItems: function(items){
			var removed = [];
			// remove entries
			for(var i = 0; i < items.length; i++){
				var entry = this.currentWorkspace.entry(items[i].id);
				try {
					entry.remove();
					removed.push(items[i].key);
				} catch(e){
					//TODO:
				}
			}
			
			this.currentWorkspace.store();
			
			return removed;
		},
		
		createNewEntry: function(eType, opts, name, parent){
			var eJsb = JSB.get(eType);
			if(!eJsb){
				throw new Error('Unable to file entry type: ' + eType);
			}
			var eCls = eJsb.getClass();
			var entry = new eCls($jsb.generateUid(), this.currentWorkspace, opts);
			
			if(!parent){
				parent = this.currentWorkspace;
			}
			var children = parent.getChildren();
			var testName = null;
			for(var suffix = 1; ; suffix++ ){
				if(suffix == 1){
					testName = name;
				} else {
					testName = name + ' ' + suffix;
				}
				var bFound = false;
				for(var chId in children){
					if(children[chId].getName() == testName){
						bFound = true;
						break;
					}
				}
				if(!bFound){
					break;
				}
			}
			
			entry.setName(testName);
			parent.addChildEntry(entry);
			this.currentWorkspace.store();
			this.currentWorkspace.doSync();
			return {
				entry: entry,
				name: testName
			};
		},
		
		loadNodes: function(pEntry, opts){
			pEntry = pEntry || this.currentWorkspace;
			var children = pEntry.getChildren();
			var nTree = {};
			for(var chId in children){
				var chEntry = children[chId];
/*				if(!chEntry.getName()){
					debugger;
				}*/
				nTree[chId] = {
					children: {},
					name: chEntry.getName(),
					entry: chEntry,
					hasEntryChildren: chEntry.children().count() > 0
				}
			}
			return nTree;
		},
		
		loadFilteredNodes: function(filter){
			var nTree = {};
			function place(e, scope, matched){
				if(e.getParent()){
					var chScope = place(e.getParent(), scope);
					if(!chScope[e.getId()]){
						chScope[e.getId()] = {
							children: {},
							name: e.getName()
						};
					}
					if(matched){
						chScope[e.getId()].matched = true;
					}
					return chScope[e.getId()].children;
				} else {
					if(!scope[e.getId()]){
						scope[e.getId()] = {
							children: {},
							name: e.getName()
						};
					}
					if(matched){
						scope[e.getId()].matched = true;
					}
					return scope[e.getId()].children;
				}
			}
			
			if(filter && filter.length >= 3){
				var it = this.currentWorkspace.search(filter);
				while(it.hasNext()){
					var e = it.next();
					place(e, nTree, true);
				}
			}
			return nTree;
		}
		
	}
}