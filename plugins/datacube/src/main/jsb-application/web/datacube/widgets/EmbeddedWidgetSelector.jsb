{
	$name: 'JSB.DataCube.Widgets.EmbeddedWidgetSelector',
	$parent: 'JSB.Widgets.Control',
	$require: ['JSB.Widgets.ToolManager', 'JSB.DataCube.Renderers.EmbededWidgetRenderer', 'JSB.Widgets.Button'],
	
	$client: {
		
		wDesc: null,
		renderer: null,
		lastAccepted: false,
		dragUi: false,
		ready: false,
		
		$constructor: function(opts){
			$base(opts);
			this.addClass('embeddedWidgetSelector');
			this.loadCss('EmbeddedWidgetSelector.css');
			this.wrapper = opts.wrapper;
			
			var removeButton = new Button({
				cssClass: 'roundButton btn10 btnDelete',
				tooltip: 'Удалить',
				onClick: function(evt){
					evt.stopPropagation();
					$this.wDesc = null;
					$this.removeClass('filled');
					if($this.options.onChange && $this.ready){
						$this.options.onChange.call($this, null);
					}
				}
			});
			
			this.append(removeButton);
			
			this.attr('title', 'Перетащите сюда виджет');
			this.placeholderElt = this.$('<div class="placeholder">Перетащите сюда виджет</div>');
			this.append(this.placeholderElt);
			this.bindingElt = this.$('<div class="binding"></div>');
			this.append(this.bindingElt);
			
			this.setupDroppable();
			
			if(this.options.value){
				this.setDescriptor(this.options.value);
			}
			this.ready = true;
		},
		
		setupDroppable: function(){
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
			
			this.getElement().droppable({
				accept: function(d){
					$this.lastAccepted = false;
					if(d && d.length > 0 && d.get(0).draggingItems){
						for(var i in d.get(0).draggingItems){
							var obj = d.get(0).draggingItems[i];
							if(JSB.isInstanceOf(obj, 'JSB.DataCube.Widgets.WidgetListItem')){
								$this.lastAccepted = true;
								return true;
							}
						}
					}
					return false;
				},
				tolerance: 'pointer',
				greedy: true,
				activate: function(evt, ui){
					ui.draggable.bind('drag', dragCallback);
					$this.dragUi = ui;
				},
				drop: function(evt, ui){
					var d = ui.draggable;
					$this.dragUi = null;
					$this.getElement().removeClass('acceptDraggable');
					if(d && d.length > 0 && d.get(0).draggingItems){
						for(var i in d.get(0).draggingItems){
							var obj = d.get(0).draggingItems[i];
							if(JSB.isInstanceOf(obj, 'JSB.DataCube.Widgets.WidgetListItem')){
								$this.setDescriptor({name: obj.descriptor.name, jsb: obj.descriptor.jsb});
								evt.stopPropagation();
								return;
							}
						}
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
			
		},
		
		isFilled: function(){
			if($this.wDesc){
				return true;
			}
			return false;
		},
		
		setDescriptor: function(wDesc){
			$this.wDesc = wDesc;
			if(this.renderer){
				this.renderer.destroy();
			}
			this.renderer = new EmbededWidgetRenderer($this.wDesc, {});
			this.bindingElt.empty().append(this.renderer.getElement());
			this.addClass('filled');
			
			if(this.options.onChange && this.ready){
				this.options.onChange.call(this, $this.wDesc);
			}
		},
		
		getDescriptor: function(){
			return this.wDesc;
		}
	}
}