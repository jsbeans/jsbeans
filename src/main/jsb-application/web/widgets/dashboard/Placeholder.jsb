/*
 * This file is the part of jsBeans, high-level JavaScript client-server framework.
 * The contents of this file are subject to the MIT Licence (MIT).
 * (c) aa@sis.ru, da@sis.ru, Special Information Systems, LLC, 2011-2019
 *
 * Настоящий файл является частью клиент-серверной JavaScript платформы.
 * Условия использования и распространения содержимого данного файла соответствуют программному обеспечению с открытыми исходными кодами и равнозначно MIT Licence (MIT).
 * Авторские права принадлежат aa@sis.ru, da@sis.ru, ООО СИС, 2011-2019гг.
 */

{
	$name: 'JSB.Widgets.Dashboard.Placeholder',
	$parent: 'JSB.Widgets.Control',
	$client: {
		$require: ['jQuery.UI.Droppable',
		           'css:Placeholder.css'],
		lastAccepted: false,
		dragUi: false,
		
		$constructor: function(opts){
			$base(opts);
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
						if($this.options.onDragStart){
							$this.options.onDragStart.call($this);
						}
					},
					tolerance: 'pointer',
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
				return $this.getElement().width() > 0 && $this.getElement().height(); 
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
		},
		
		enable: function(b){
			if(!JSB.isDefined(b)){
				b = true;
			}
			if(b){
				this.removeClass('hidden');
				this.getElement().droppable('enable');
			} else {
				this.getElement().droppable('disable');
				this.addClass('hidden');
			}
		}
	}
}