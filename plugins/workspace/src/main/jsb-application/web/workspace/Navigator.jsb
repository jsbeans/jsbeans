{
	$name: 'JSB.Workspace.Navigator',
	$parent: 'JSB.Widgets.Control',
	
	$require: ['JSB.Workspace.WorkspaceController',
	           'JSB.Widgets.RendererRepository'],
	
	$client: {
		wmKey: null,
		currentNode: null,
		
		$constructor: function(opts){
			$base(opts);
			
			this.loadCss('Navigator.css');
			this.addClass('workspaceNavigator');
			
			if(this.options.wmKey){
				this.wmKey = this.options.wmKey;
			}
			
			this.wnbContainer = this.$('<ul class="wnbContainer"></ul>');
			this.append(this.wnbContainer);
			
			this.subscribe('JSB.Workspace.nodeOpen', function(sender, msg, node){
				if(!$jsb.isInstanceOf(sender, 'JSB.Workspace.Explorer') || sender.wmKey != $this.wmKey){
					return;
				}
				$this.setCurrentNode(node);
			});

            this.subscribe('JSB.Workspace.Entry.destroyed', function(sender){
            	if($this.currentNode && $this.currentNode.getTargetEntry() == sender){
                    $this.setCurrentNode(null);
                    $this.publish('JSB.Workspace.nodeOpen', null);
            	}
            });
			
			this.subscribe(['JSB.Workspace.renameEntry', 'JSB.Workspace.moveEntry'], function(sender, msg, params){
				$this.refresh();
			});
			
			this.refresh();
		},
		
		setCurrentNode: function(node){
			if(node && (!$jsb.isInstanceOf(node, 'JSB.Workspace.ExplorerNode') || this.currentNode == node)){
				return;
			}
			this.currentNode = node;
			this.refresh();
		},
		
		bindManager: function(wmKey){
			this.wmKey = wmKey;
		},
		
		refresh: function(){
			this.wnbContainer.empty();
			// add root
			var rootElt = this.$(`
				<li class="tag root">
					<div class="icon"></div>
				</li>
			`);
			
			this.wnbContainer.append(rootElt);
			
			if(!this.currentNode){
				rootElt.addClass('active');
			} else {
				rootElt.click(function(){
					$this.setCurrentNode(null);
					$this.publish('JSB.Workspace.nodeOpen', null);
				});
				// generate path
				var explorer = this.currentNode.explorer;
				var path = [];
				for(var curNode = this.currentNode; curNode; curNode = explorer.tree.get(curNode.treeNode.parent).obj){
					path.push(curNode);
					
					if(!curNode.treeNode.parent){
						break;
					}
				}
				
				for(var i = path.length - 1; i >= 0; i--){
					var tag = (function(curNode, i){
						// add separator
						$this.wnbContainer.append('<li class="separator"></li>');
						
						// add node
						var nodeElt = $this.$('<li class="tag"></li>');
						
						if(JSB.isInstanceOf(curNode, 'JSB.Workspace.EntryNode')){
							nodeElt.append(RendererRepository.createRendererFor(curNode.getTargetEntry()).getElement());
						} else {
							nodeElt.append('<div class="icon"></div>');
							nodeElt.append(`#dot <div class="text">{{=curNode.getName()}}</div>`);
						}
						nodeElt.attr('key', curNode.getJsb().$name);
						
						$this.wnbContainer.append(nodeElt);
						
						if(i > 0){
							nodeElt.click(function(){
								$this.setCurrentNode(curNode);
								$this.publish('JSB.Workspace.nodeOpen', curNode);
							});
						}
/*						
						var img = curNode.find('.icon').css('background-image');
						nodeElt.find('.icon').css('background-image', img);
*/						
						return nodeElt;
					})(path[i], i);
					
					if(i == 0){
						tag.addClass('active');
					}
				}
			}
		}
	}
	
}