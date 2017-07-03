{
	$name: 'JSB.Widgets.Dashboard.Placeholder',
	$parent: 'JSB.Widgets.Control',
	$client: {
		
		lastAccepted: false,
		dragUi: false,
		
		$constructor: function(opts){
			$base(opts);
			this.loadCss('Placeholder.css');
			this.addClass('_jsb_dashboardPlaceholder');
			
			if(this.options.emptyText){
				this.append(`#dot
					<div class="_jsb_emptyText">{{=$this.options.emptyText}}</div>
				`);
			}
			
			JSB.deferUntil(function(){
				function dragCallback(evt, ui){
					if(!$this.dragUi || !$this.lastAccepted){
						return;
					}
					// check if over
					var r = $this.getElement().get(0).getBoundingClientRect();
					if(evt.pageX >= r.left && evt.pageX < r.left + r.width && evt.pageY >= r.top && evt.pageY < r.top + r.height){
						if( !$this.dragUi.helper.hasClass('accepted') ){
							$this.dragUi.helper.addClass('accepted');
						}
						$this.getElement().addClass('acceptDraggable');
					} else {
						if( ui.helper.hasClass('accepted') ){
							ui.helper.removeClass('accepted');
						}
						$this.getElement().removeClass('acceptDraggable');
					}
				}
				
				$this.getElement().droppable({
					accept: function(d){
						$this.lastAccepted = false;
						if($this.options.onDragAccept){
							$this.lastAccepted = $this.options.onDragAccept.call($this, d);
						}
						return $this.lastAccepted;
					},
					activate: function(evt, ui){
						ui.draggable.bind('drag', dragCallback);
						$this.dragUi = ui;
					},
					tolerance: 'pointer',
					greedy: true,
					drop: function(evt, ui){
						$this.dragUi = null;
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
					},
					deactivate: function(evt, ui){
						ui.draggable.unbind('drag', dragCallback);
						$this.dragUi = null;
						if($this.options.onDragStop){
							$this.options.onDragStop.call($this);
						}
					}

				});
			}, function(){
				return $this.getElement().width() > 0 && $this.getElement().height() > 0;
			});
			
			
/*			
			this.getElement().on({
				'mouseover': function(evt){
					if(!$this.dragUi || !$this.lastAccepted){
						return;
					}
					if( !$this.dragUi.helper.hasClass('accepted') ){
						$this.dragUi.helper.addClass('accepted');
					}
					$this.getElement().addClass('acceptDraggable');
				},
				'mouseout': function(evt){
					
					if(!$this.dragUi || !$this.lastAccepted){
						return;
					}
					if( $this.dragUi.helper.hasClass('accepted') ){
						$this.dragUi.helper.removeClass('accepted');
					}
					$this.getElement().removeClass('acceptDraggable');
					
				}
			});
*/			
		}
	}
}