{
	$name: 'JSB.Workspace.EntryNode',
	$parent: 'JSB.Workspace.ExplorerNode',
	$require: {
		Editor: 'JSB.Widgets.PrimitiveEditor',
		Button: 'JSB.Widgets.Button',
		RendererRepository: 'JSB.Widgets.RendererRepository',
	},
	
	$client: {
		renderer: null,
		
		$constructor: function(opts){
			var self = this;
			$base(opts);
			this.loadCss('EntryNode.css');
			this.addClass('entryNode');
			
			RendererRepository.ensureReady(function(){
				$this.renderer = RendererRepository.createRendererFor($this.descriptor.entry, {
					editable: true,
					onValidate: function(val){
						return val && val.trim().length >= 3;
					},
					onChange: function(val, evt){
						if($this.descriptor.name == val){
							return;
						}
						$this.server().rename($this.descriptor.entry, val, function(){
							$this.descriptor.name = val;
							$this.publish('JSB.Workspace.renameEntry', {
								node: $this,
								entry: $this.getEntry(),
								name: val
							});
						});
						
					}
				});
				
				if(!$this.renderer){
					throw new Error('Failed to create renderer for: ' + $this.descriptor.entry.getJsb().$name);
				}
				
				$this.append($this.renderer);
				
				if($this.options.allowEdit){
					// add buttons
					var editBtn = new Button({
						cssClass: 'roundButton btnEdit btn10',
						tooltip: 'Изменить название',
						onClick: function(evt){
							evt.stopPropagation();
							self.renderer.beginEdit();
						}
					});
					$this.toolbox.append(editBtn.getElement());
				}
				
				if($this.options.allowOpen){
					var openBtn = new Button({
						cssClass: 'roundButton btnOpen btn10',
						tooltip: 'Открыть',
						onClick: function(evt){
							evt.stopPropagation();
							$this.explorer.publish('JSB.Workspace.nodeOpen', $this);
						}
					});
					$this.toolbox.append(openBtn.getElement());
				}
			});
			
			this.subscribe('JSB.Workspace.Entry.updated', function(sender, msg, syncInfo){
				if($this.getEntry() != sender || $this.isDestroyed()){
					return;
				}
				if(syncInfo.isChanged('_childCount')){
					$this.explorer.synchronizeNodeChildren($this.treeNode.key);
				}
			});
			
			this.subscribe('JSB.Workspace.Entry.destroyed', function(sender){
				if(sender != $this.getEntry()){
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
		
		getName: function(){
			return this.descriptor.name || this.descriptor.entry.getName();
		},
		
		getEntry: function(){
			return this.descriptor.entry;
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