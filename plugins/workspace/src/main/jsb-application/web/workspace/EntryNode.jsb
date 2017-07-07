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
							$this.publish('Workspace.renameEntry', {
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
				var paddingRight = 4;
				
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
					$this.append(editBtn);
					paddingRight += 20;
				}
				
				if($this.options.allowOpen){
					var openBtn = new Button({
						cssClass: 'roundButton btnOpen btn10',
						tooltip: 'Открыть',
						onClick: function(evt){
							evt.stopPropagation();
							$this.explorer.publish('Workspace.nodeOpen', $this);
						}
					});
					$this.append(openBtn);
					paddingRight += 20;
				}
				
				$this.renderer.getElement().css('padding-right', paddingRight);

			});
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