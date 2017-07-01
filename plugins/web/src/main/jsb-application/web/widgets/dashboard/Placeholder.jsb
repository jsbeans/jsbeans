{
	$name: 'JSB.Widgets.Dashboard.Placeholder',
	$parent: 'JSB.Widgets.Control',
	$client: {
		$constructor: function(opts){
			$base(opts);
			this.loadCss('Placeholder.css');
			this.addClass('_jsb_dashboardPlaceholder');
			
			if(this.options.emptyText){
				this.append(`#dot
					<div class="_jsb_emptyText">{{=$this.options.emptyText}}</div>
				`);
			}
			
			this.getElement().droppable({
				accept: function(d){
					if($this.options.onDragAccept){
						return $this.options.onDragAccept.call($this, d);
					}
/*					
					if(d && d.length > 0 && d.get(0).draggingItems){
						var nodes = [];
						for(var i in d.get(0).draggingItems){
							var obj = d.get(0).draggingItems[i].obj;
							if(!JSB().isInstanceOf(obj, 'JSB.Workspace.ExplorerNode')){
								continue;
							}
							nodes.push(obj);
						}
						// check for dragging items
						return $this.checkMove(node, nodes);
					}
*/					
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
					var widget = null;
					if($this.options.onDragDrop){
						$this.options.onDragDrop.call($this, d, function(widget){
							if($this.options.onDropWidget){
								$this.options.onDropWidget.call($this, widget);
							}
						});
					}
				}

			});
		}
	}
}