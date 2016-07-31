JSB({
	name:'Ontoed.HierarchyView',
	parent: 'JSB.Widgets.Widget',
	require: ['JQuery.UI.Effects', 
	          'JSB.Widgets.ToolBar', 
	          'JSB.Widgets.TreeView', 
	          'Ontoed.RendererRepository' 
	],
	
	common: {
		currentOntology: null,
	},
	
	client: {
		entities: {},
		etree: {},
		
		constructor: function(opts){
			var self = this;
			this.base(opts);
			this.loadCss('hierarchyview.css');
			this.addClass('hierarchyView');
			
			// create toolbar
			this.toolbar = new JSB.Widgets.ToolBar();
			this.append(this.toolbar);
/*			
			this.toolbar.addItem({
				key: 'create',
				element: '<div class="icon"></div><div class="caption">Создать&nbsp;&nbsp;<span class="arrow">&#x25be;</span></div>'
			});

			this.toolbar.addItem({
				key: 'refresh',
				element: '<div class="icon"></div>',
				click: function(){
					self.refresh();
				}
			});
*/			
			
			this.tree = new JSB.Widgets.TreeView({
				selectMulti: true,
				onSelectionChanged: function(key, item, evt){
					var entity = null;
					if(item){
						if(JSB().isArray(item)){
							entity = item[0].obj.entity;
						} else {
							entity = item.obj.entity;
						}
					}
					self.publish('selectEntity', entity);
				}
			});
			this.append(this.tree);
/*			
			this.subscribe('changeCurrentEntity', function(sender, msg, entity){
				if(sender == self){
					return;
				}
				var key = entity.info.md5;
				self.tree.selectItem(key);
			});
*/			
			this.subscribe('ontologyUpdate', function(sender, msg, params){
				if(sender == self.currentOntology){
					self.refresh();
				}
			});
		},
		
		setOntology: function(onto){
			var self = this;
			if(this.currentOntology == onto){
				return;
			}
			this.tree.getElement().loader();
			this.server.setOntology(onto, function(res){
				self.currentOntology = onto;
				self.entities = res.entities;
				self.etree = res.etree;
				self.drawTree();
				self.tree.getElement().loader('hide');
			});
		},
		
		onAfterSync: function(syncInfo){
			
		},
		
		refresh: function(){
			var self = this;
			this.tree.getElement().loader();
			var stdt = new Date().getTime();
			this.server.load(function(res){
				self.entities = res.entities;
				self.etree = res.etree;
				self.drawTree();
				
				self.tree.getElement().loader('hide');
			});
		},
		
		drawTree: function(){
			var self = this;
			
			function addTreeItem(itemDesc, parent){
//				var key = itemDesc.id;
				var key = JSB().generateUid();
				var entity = self.entities[itemDesc.id];
				var cssClass = '';
				var node = Ontoed.RendererRepository.createRendererForEntity(entity, {allowNavigate: true});
				
				var curTreeNode = self.tree.addNode({
					key: key,
					element: node
				}, parent);
				
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
							selected.push(self.tree.get(key));
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
								helper.append(self.$('<div class="odd">... и еще <em>'+odd+'</em> элемент' + suffix + '</div>'));
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
				
				var idArr = [];
				for(var i in itemDesc.children){
					idArr.push({
						id: i,
						label: self.entities[i].getLabel()
					});
				}
				idArr.sort(function(a, b){
					return a.label.localeCompare(b.label);
				});
				
				
				for(var i in idArr){
					var id = idArr[i].id;
					var desc = itemDesc.children[id];
					addTreeItem(desc, key);
				}
				
				return node;
			}
			
			this.tree.clear();
			
			// sort
			var idArr = [];
			for(var i in this.etree){
				idArr.push({
					id: i,
					label: self.entities[i].getLabel()
				});
			}
			idArr.sort(function(a, b){
				return a.label.localeCompare(b.label);
			});
			
			for(var i in idArr){
				var id = idArr[i].id;
				var desc = this.etree[id];
				addTreeItem(desc);
			}
		},
		
		
	},
	
	server: {
		loadTree: function(){
			throw 'Method should be overriden';
		},
		
		setOntology: function(onto){
			this.currentOntology = onto;
			return this.load();
		},
		
		load: function(){
			this.loadTree();
			
			return {
				entities: this.entities,
				etree: this.etree
			}

		}
		
	}
});