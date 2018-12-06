{
	$name: 'JSB.Workspace.EntryNode',
	$parent: 'JSB.Workspace.ExplorerNode',
	$require: {
		Editor: 'JSB.Widgets.PrimitiveEditor',
		Button: 'JSB.Widgets.Button',
		RendererRepository: 'JSB.Widgets.RendererRepository',
		ToolManager: 'JSB.Widgets.ToolManager',
		ShareTool: 'JSB.Workspace.ShareTool'
	},
	
	isLink: function(){
		return this.descriptor.isLink;
	},
	
	$client: {
		$require: ['css:EntryNode.css'],
		renderer: null,
		
		$constructor: function(opts){
			var self = this;
			$base(opts);
			this.addClass('entryNode');
			
			if(this.isLink()){
				var linkIcon = this.$('<div class="linkIcon"></div>');
				this.append(linkIcon);
			}
			
			var shareIcon = this.$('<div class="shareIcon"></div>');
			this.append(shareIcon);
			
			$this.updateShareState();
			
			
			RendererRepository.ensureReady(function(){
				$this.renderer = RendererRepository.createRendererFor($this.getTargetEntry(), {
					editable: true,
					onValidate: function(val){
						return val && val.trim().length >= 3;
					},
					onChange: function(val, evt){
						if($this.descriptor.name == val){
							return;
						}
						$this.server().rename($this.getTargetEntry(), val, function(res, fail){
							if(fail){
								$this.renderer.update();
								$this.getExplorer().displayError(fail);
								return;
							}
							$this.descriptor.name = val;
							$this.publish('JSB.Workspace.renameEntry', {
								node: $this,
								entry: $this.getTargetEntry(),
								name: val
							});
						});
						
					}
				});
				
				if(!$this.renderer){
					throw new Error('Failed to create renderer for: ' + $this.descriptor.entry.getJsb().$name);
				}
				
				$this.append($this.renderer);
				
				var menuItems = $this.collectMenuItems();
				if(menuItems.length > 0){
					var menuBtn = new Button({
						cssClass: 'roundButton btnMenu btn10',
						tooltip: 'Дополнительные опции',
						onClick: function(evt){
							var pivot = $this.$(evt.currentTarget);
							ToolManager.activate({
								id: '_dwp_droplistTool',
								cmd: 'show',
								data: menuItems,
								key: 'entryMenu',
								target: {
									selector: pivot,
									dock: 'bottom'
								},
								callback: function(key, item, evt){
									if(item && item.callback){
										item.callback(evt);
									}
								}
							});
						}
					});
					$this.toolbox.append(menuBtn.getElement());
				}

			});
			
			this.subscribe('JSB.Workspace.Entry.updated', function(sender, msg, syncInfo){
				if($this.getTargetEntry() != sender || $this.isDestroyed()){
					return;
				}
				if(syncInfo.isChanged('_childCount')){
					$this.explorer.synchronizeNodeChildren($this.treeNode.key);
				}
				if(syncInfo.isChanged('_shareCount')){
					$this.updateShareState();
				}
			});
			
			this.subscribe('JSB.Workspace.Entry.destroyed', function(sender){
				if(sender != $this.getTargetEntry()){
					return;
				}
				if($this.isDestroyed()){
					return;
				}
				
				// remove from tree
				if(this.treeNode.tree.get(this.treeNode.key)){
					this.treeNode.tree.deleteNode(this.treeNode.key);
				}
				
				// destroy self
				$this.destroy();
			});
		},
		
		updateShareState: function(){
			if($this.getEntry().getShareCount() > 0){
				$this.addClass('hasShares');
			} else {
				$this.removeClass('hasShares');
			}
		},
		
		collectMenuItems: function(){
			var items = [];
			if($this.options.allowOpen){
				items.push({
					key: 'entryOpen',
					element: '<div class="icon"></div><div class="text">Открыть</div>',
					allowHover: true,
					allowSelect: true,
					callback: function(){
						$this.explorer.publish('JSB.Workspace.nodeOpen', $this);
					}
				});
			}
			
			if($this.options.allowEdit){
				items.push({
					key: 'entryRename',
					element: '<div class="icon"></div><div class="text">Изменить название</div>',
					allowHover: true,
					allowSelect: true,
					callback: function(){
						JSB.defer(function(){
							$this.renderer.beginEdit();	
						}, 10);
					}
				});
			}
			
			if($this.options.allowShare) {
				items.push({
					key: 'entryShare',
					element: '<div class="icon"></div><div class="text">Поделиться...</div>',
					allowHover: true,
					allowSelect: true,
					callback: function(evt){
						// show share dialog
						ToolManager.activate({
							id: 'JSB.Workspace.ShareTool',
							cmd: 'show',
							data: {
								entry: $this.getTargetEntry(),
								explorer: $this.explorer
							},
							key: 'shareMenu',
							target: {
								selector: $this.getElement(),
								weight: 10.0
							},
							constraints: [{
								selector: $this.getElement(),
								weight: 10.0
							}]
						});
					}
				});
			}
			
			return items;
		},
		
		getName: function(){
			return this.descriptor.name || $this.getTargetEntry().getName();
		},
		
		getEntry: function(){
			return this.descriptor.entry;
		},
		
		getTargetEntry: function(){
			var entry = this.getEntry();
			if(entry.isLink()){
				return entry.getTargetEntry();
			}
			return entry;
		},
		
		updateState: function(){
			var isToolboxVisible = this.isSelected() || this.isHighlighted();
			if(isToolboxVisible){
				$this.toolbox.removeClass('hidden');
				$this.renderer.getElement().css('padding-right', this.toolbox.width());
			} else {
				$this.toolbox.addClass('hidden');
				$this.renderer.getElement().css('padding-right', 0);
			}
			
		}
		
	},
	
	$server: {
		rename: function(entry, newName){
			entry.setName(newName);
			entry.getWorkspace().store();
			entry.doSync();
		}
	}
	
}