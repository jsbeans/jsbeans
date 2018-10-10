{
	$name: 'DataCube.Controls.DatabaseSelector',
	$parent: 'JSB.Widgets.Control',
	$require: ['JSB.Widgets.RendererRepository',
	           'JSB.Widgets.ToolManager'],
	
	$client: {
		ready: false,
		
		options: {
			onChange: null
		},
		
		$constructor: function(opts){
			$base(opts);
			this.addClass('databaseSelector');
			$jsb.loadCss('DatabaseSelector.css');
			
			this.attr('title', 'Выберите базу');
			this.placeholderElt = this.$('<div class="placeholder">Выберите/перетащите базу</div>');
			this.append(this.placeholderElt);
			this.bindingElt = this.$('<div class="binding"></div>');
			this.append(this.bindingElt);
			
			this.setupDroppable();
			
			this.getElement().click(function(evt){
				$this.showTool(evt);
			});
				
			this.ready = true;
		},
		
		setupDroppable: function(){
			this.getElement().droppable({
				accept: function(d){
					if(d && d.length > 0 && d.get(0).draggingItems){
						for(var i in d.get(0).draggingItems){
							var obj = d.get(0).draggingItems[i].obj;
							if(!JSB.isInstanceOf(obj, 'JSB.Workspace.ExplorerNode')){
								continue;
							}
							var entry = obj.getTargetEntry();
							if(JSB.isInstanceOf(entry,'DataCube.Model.DatabaseSource')){
								return true;
							}
						}
						
					}
					return false;
				},
				tolerance: 'pointer',
				greedy: true,
				over: function(evt, ui){
					if( !ui.helper.hasClass('accepted') ){
						ui.helper.addClass('accepted');
					}
					$this.getElement().addClass('acceptDraggable');
				},
				out: function(evt, ui){
					if( ui.helper.hasClass('accepted') ){
						ui.helper.removeClass('accepted');
					}
					$this.getElement().removeClass('acceptDraggable');
				},
				drop: function(evt, ui){
					var d = ui.draggable;
					$this.getElement().removeClass('acceptDraggable');
					for(var i in d.get(0).draggingItems){
						var obj = d.get(0).draggingItems[i].obj;
						if(!JSB().isInstanceOf(obj, 'JSB.Workspace.ExplorerNode')){
							continue;
						}
						$this.setSource(obj.getTargetEntry());
						break;
					}
				}
			});
		},
		
		setWorkspace: function(workspace){
			this.workspace = workspace;
		},
		
		
		setSource: function(entry){
			if(!JSB.isInstanceOf(entry,'DataCube.Model.DatabaseSource')){
				return;
			}
			this.source = entry;
			this.bindingElt.empty();
			this.bindingElt.append(RendererRepository.createRendererFor(entry).getElement());
			this.addClass('filled');
			if(this.options.onChange){
				this.options.onChange.call(this, entry);
			}
		},
		
		getSource: function(){
			return this.source;
		},
		
		showTool: function(evt){
			var items = [];
			this.server().combineDatabases(this.workspace, function(dbs){
				for(var srcId in dbs){
					items.push({key: srcId, element:RendererRepository.createRendererFor(dbs[srcId])});
				}
				ToolManager.activate({
					id: '_dwp_droplistTool',
					cmd: 'show',
					data: items,
					target: {
						selector: $this.getElement(),
						dock: 'bottom'
					},
					callback: function(key, item, evt){
						if(item){
							$this.setSource(item.obj.getObject());
						}
						
					}
				});

			});
		}
	},
	
	$server: {
		combineDatabases: function(w){
			var dbs = {};
			for (var entry, it = w.entries(); entry = it.next();) {
				if(!JSB.isInstanceOf(entry, 'DataCube.Model.DatabaseSource')){
					continue;
				}
				dbs[entry.getId()] = entry;
			}
			return dbs;
		}
	}
}