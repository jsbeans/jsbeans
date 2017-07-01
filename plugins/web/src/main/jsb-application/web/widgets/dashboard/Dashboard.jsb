{
	$name: 'JSB.Widgets.Dashboard.Dashboard',
	$parent: 'JSB.Widgets.Control',
	$client: {
		$require: ['JSB.Widgets.Dashboard.Container',
		           'JSB.Widgets.Dashboard.Placeholder'],
		           
	    placeholder: null,
	    container: null,
	    widgets: {},
	    
		$constructor: function(opts){
			$base(opts);
			this.loadCss('Dashboard.css');
			this.addClass('_jsb_dashboard');
			
			// setup initial placeholder
			this.placeholder = new Placeholder(JSB.merge({
				emptyText: opts.emptyText,
				onDragAccept: function(d){
					var dragAccept = false;
					if(d && d.length > 0 && d.get(0).draggingItems){
						for(var widx in d.get(0).draggingItems){
							var w = d.get(0).draggingItems[widx];
							if($this.isWidgetAccepted(w)){
								dragAccept = true;
								break;
							}
						}
					}
					if(!dragAccept && $this.options.onDragAccept(d)){
						dragAccept = true;
					}
					
					return dragAccept;
				},
				onDragDrop: function(d, callback){
					if(d && d.length > 0 && d.get(0).draggingItems){
						for(var widx in d.get(0).draggingItems){
							var w = d.get(0).draggingItems[widx];
							if($this.isWidgetAccepted(w)){
								callback.call($this, w);
								return;
							}
						}
					}
					$this.options.onDragDrop.call($this, d, callback);
				},
				onDropWidget: function(widget){
					$this.placeWidget(widget);
				}
			}, opts.placeholder || {}));
			this.append(this.placeholder);
		},
		
		placeWidget: function(widget){
			if(!this.container){
				this.container = new Container($this.options, $this, $this);
				this.append(this.container);
				this.placeholder.getElement().css('display', 'none');
			}
			this.container.addWidget(widget);
		},
		
		isWidgetAccepted: function(widget){
			if(this.widgets[widget.getId()]){
				return true;
			}
			return false;
		}
	}
}