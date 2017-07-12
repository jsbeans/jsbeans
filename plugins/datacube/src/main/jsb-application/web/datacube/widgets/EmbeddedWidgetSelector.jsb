{
	$name: 'JSB.DataCube.Widgets.EmbeddedWidgetSelector',
	$parent: 'JSB.Widgets.Control',
	$require: ['JSB.Widgets.ToolManager', 'JSB.DataCube.Renderers.WidgetRenderer'],
	
	$client: {
		
		wDesc: null,
		renderer: null,
		
		$constructor: function(opts){
			$base(opts);
			this.addClass('embeddedWidgetSelector');
			this.loadCss('EmbeddedWidgetSelector.css');
			this.wrapper = opts.wrapper;
			
			this.attr('title', 'Перетащите сюда виджет');
			this.placeholderElt = this.$('<div class="placeholder">Перетащите сюда виджет</div>');
			this.append(this.placeholderElt);
			this.bindingElt = this.$('<div class="binding hidden"></div>');
			this.append(this.bindingElt);
			
			this.setupDroppable();
		},
		
		setupDroppable: function(){
			this.getElement().droppable({
				accept: function(d){
					if(d && d.length > 0 && d.get(0).draggingItems){
						for(var i in d.get(0).draggingItems){
							var obj = d.get(0).draggingItems[i];
							if(JSB.isInstanceOf(obj, 'JSB.DataCube.Widgets.WidgetListItem')){
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
					if(d && d.length > 0 && d.get(0).draggingItems){
						for(var i in d.get(0).draggingItems){
							var obj = d.get(0).draggingItems[i];
							if(JSB.isInstanceOf(obj, 'JSB.DataCube.Widgets.WidgetListItem')){
								$this.setDescriptor(obj.descriptor);
								evt.stopPropagation();
								return;
							}
						}
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
		
		setDescriptor: function(desc){
			$this.wDesc = desc;
			if(this.renderer){
				this.renderer.destroy();
			}
			this.renderer = new WidgetRenderer($this.wDesc, {});
			this.bindingElt.empty().append(this.renderer.getElement());
			this.placeholderElt.addClass('hidden');
			this.bindingElt.removeClass('hidden');
		},
		
		getDescriptor: function(){
			return this.wDesc;
		}
	}
}