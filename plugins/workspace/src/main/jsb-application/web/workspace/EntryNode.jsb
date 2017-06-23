{
	$name: 'JSB.Workspace.EntryNode',
	$parent: 'JSB.Workspace.ExplorerNode',
	$require: {
		Editor: 'JSB.Widgets.PrimitiveEditor',
		Button: 'JSB.Widgets.Button'
	},
	$client: {
		$constructor: function(opts){
			var self = this;
			$base(opts);
			this.loadCss('EntryNode.css');
			this.addClass('entryNode');
			
			this.editor = new Editor({
				mode:'inplace',
				dblclick: false,
				onValidate: function(val){
					return val && val.trim().length >= 3;
				},
				onChange: function(val, evt){
					if($this.descriptor.name == val){
						return;
					}
					$this.server().rename($this.descriptor.entry, val, function(){
						$this.descriptor.name = val;
						$this.publish('Workspace.renameEntry', {
							node: $this,
							name: val
						});
					});
					
				}
			});
			this.editor.setData(this.descriptor.entry.getName());
			this.append(this.editor);
			
			var paddingRight = 4;
			
			if(this.options.allowEdit){
				// add buttons
				var editBtn = new Button({
					cssClass: 'roundButton btnEdit btn10',
					tooltip: 'Изменить название',
					onClick: function(evt){
						evt.stopPropagation();
						self.editor.beginEdit();
					}
				});
				this.append(editBtn);
				paddingRight += 20;
			}
			
			if(this.options.allowOpen){
				var openBtn = new Button({
					cssClass: 'roundButton btnOpen btn10',
					tooltip: 'Открыть',
					onClick: function(evt){
						evt.stopPropagation();
						$this.explorer.publish('Workspace.nodeOpen', $this);
					}
				});
				this.append(openBtn);
				paddingRight += 20;
			}
			
			this.editor.getElement().css('padding-right', paddingRight);
		},
		
		getEntry: function(){
			return this.descriptor.entry;
		}
	},
	
	$server: {
		rename: function(entry, newName){
			entry.title(newName);
			entry.workspace.store();
			entry.doSync();
		}
	}
	
}