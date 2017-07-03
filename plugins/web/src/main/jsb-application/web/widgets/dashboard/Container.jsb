{
	$name: 'JSB.Widgets.Dashboard.Container',
	$parent: 'JSB.Widgets.Control',
	$client: {
		$require: ['JSB.Widgets.Dashboard.Placeholder',
		           'JSB.Widgets.WidgetContainer',
		           'JSB.Widgets.FloatingContainer',
		           'JSB.Widgets.SplitBox'],
		           
		widgetContainer: null,
		splitBox: null,
		placeholders: {},
		type: null,
		childContainers: [],
		dashboard: null,
		parent: null,
		
		$constructor: function(opts, parent, dashboard){
			$base(opts);
			this.loadCss('Container.css');
			this.addClass('_jsb_dashboardContainer');
			this.dashboard = dashboard;
			this.parent = parent;
			
			// create client container
			this.clientContainer = this.$('<div class="_jsb_clientContainer"></div>');
			this.append(this.clientContainer);
			
			// create placeholders
			var phArr = ['center', 'left', 'top', 'right', 'bottom'];
			
			for(var i = 0; i < phArr.length; i++){
				var phType = phArr[i];
				(function(phType){
					var ph = new Placeholder({
						onDragAccept: function(d){
							var dragAccept = false;
							if(d && d.length > 0 && d.get(0).draggingItems){
								for(var widx in d.get(0).draggingItems){
									var w = d.get(0).draggingItems[widx];
									if($this.dashboard.isWidgetAccepted(w)){
										dragAccept = true;
										break;
									}
								}
							}
							if(!dragAccept && $this.options.onDragAccept(d)){
								dragAccept = true;
							}
							
							if(dragAccept){
								$this.addClass('dragging');
							}
							
							return dragAccept;
						},
						onDragDrop: function(d, callback){
							if(d && d.length > 0 && d.get(0).draggingItems){
								for(var widx in d.get(0).draggingItems){
									var w = d.get(0).draggingItems[widx];
									if($this.dashboard.isWidgetAccepted(w)){
										callback.call($this, w);
										return;
									}
								}
							}
							$this.options.onDragDrop.call($this, d, callback);
						},
						onDragStop: function(){
							$this.removeClass('dragging');
						},
						onDropWidget: function(widget){
							var cont = widget.getContainer();
							if(cont){
								cont.detachWidget(widget);
								cont.destroy();
							}
							$this.dockWidget(widget, phType);
						}
					});
					ph.addClass(phType);
					$this.append(ph);
					$this.placeholders[phType] = ph;
				})(phType);
			}
		},
		
		destroy: function(){
			if(this.type == 'widget'){
				var wArr = [];
				if(this.widgetContainer){
					for(var wId in this.widgetContainer.widgets){
						var w = this.widgetContainer.getWidget(wId);
						wArr.push(w);
					}
					for(var i = 0; i < wArr.length; i++){
						wArr[i].detachContainer();
					}
					this.widgetContainer.destroy();
					this.widgetContainer = null;
				}
			} else {
				if(this.splitBox){
					for(var i = 0; i < this.childContainers.length; i++){
						this.childContainers[i].destroy();
					}
					this.splitBox.destroy();
					this.splitBox = null;
				}
			}
			
			$base();
		},
		
		removeWidget: function(widget){
			this.widgetContainer.detachWidget(widget);
			
			if(Object.keys(this.widgetContainer.widgets).length == 0){
				// unwind container hierarchy
				this.widgetContainer.destroy();
				this.widgetContainer = null;
				var parentContainer = this.parent;
				if(parentContainer == this.dashboard){
					// remove container from dashboard
					parentContainer.container = null;
					parentContainer.placeholder.getElement().css('display', 'block');
					this.destroy();
					return {
						container: parentContainer,
						side: 'center'
					};
				} else {
					var leftContainer = null;
					var side = null;
					if(parentContainer.childContainers[0] == this){
						leftContainer = parentContainer.childContainers[1];
						if(parentContainer.splitBox.options.type == 'vertical'){
							side = 'left';
						} else {
							side = 'top';
						}
					} else {
						leftContainer = parentContainer.childContainers[0];
						if(parentContainer.splitBox.options.type == 'vertical'){
							side = 'right';
						} else {
							side = 'bottom';
						}

					}
					leftContainer.getElement().detach();
					parentContainer.splitBox.destroy();
					if(leftContainer.widgetContainer){
						leftContainer.widgetContainer.getElement().detach();
					}
					if(leftContainer.splitBox){
						leftContainer.splitBox.getElement().detach();
					}
					parentContainer.setContainer(leftContainer);
					leftContainer.destroy();
					this.destroy();
					return {
						container: parentContainer,
						side: side
					};
				}
				
			} else {
				return {
					container: this,
					side: 'center'
				}
			}
		},
		
		addWidget: function(widget){
			// create wodgetContainer if necessary
			if(!this.widgetContainer){
				this.widgetContainer = new WidgetContainer({
					caption: true
				});
				this.clientContainer.append(this.widgetContainer.getElement());
			}
			this.widgetContainer.attachWidget(widget);
			this.dashboard.widgets[widget.getId()] = widget;
			this.dashboard.widgetStates[widget.getId()] = 'docked';
			this.type = 'widget';
			this.getElement().attr('type', this.type);
			var tab = this.widgetContainer.getTab(widget.getId());
			tab.tab.draggable({
				start: function(evt, ui){
					evt.originalEvent.preventDefault();
					evt.stopPropagation();
					
					var wc = widget.getContainer();
					var cont = wc.getElement().closest('._jsb_dashboardContainer').jsb();
					this.prevContext = cont.removeWidget(widget);
					this.draggingItems = [widget];
					$this.dashboard.widgetStates[widget.getId()] = 'floating';

					// create floating container
					var fc = new WidgetContainer({
						caption: true
					});
					fc.attachWidget(widget);
					ui.helper.append(fc.getElement());
				},
				helper: function(evt){
					// create drag container
					var helper = $this.$('<div class="_jsb_dashboardDragHelper"></div>');
					return helper.get(0);
				},
				stop: function(evt, ui){
					if($this.dashboard.widgetStates[widget.getId()] != 'floating'){
						return;
					}
					if(this.prevContext){
						this.prevContext.container.dockWidget(widget, this.prevContext.side);
					}
				},
				revert: false,
				scroll: false,
				zIndex: 100000,
				distance: 10,
				appendTo: 'body'
			});
		},
		
		setContainer: function(container){
			if(container.type == 'widget'){
				container.widgetContainer.getElement().detach();
				this.widgetContainer = container.widgetContainer;
				container.widgetContainer = null;
				this.clientContainer.append(this.widgetContainer.getElement());
				this.type = 'widget';
				this.childContainers = [];
				this.getElement().attr('type', this.type);
			} else {
				container.splitBox.getElement().detach();
				this.splitBox = container.splitBox;
				container.splitBox = null;
				this.clientContainer.append(this.splitBox.getElement());
				this.type = 'split';
				this.childContainers = container.childContainers;
				container.childContainers = [];
				this.childContainers[0].parent = this;
				this.childContainers[1].parent = this;
				this.getElement().attr('type', this.type);
			}
		},
		
		dockWidget: function(widget, side){
			if(side == 'center'){
				this.addWidget(widget);
			} else {
				var splitType = (side == 'left' || side == 'right') ? 'vertical' : 'horizontal';
				var splitBox = new SplitBox({
					type: splitType,
					position: 0.5,
					
					onChange: function(){
						$this.dashboard.notifyChanged($this, 'JSB.Widgets.Dashboard.layoutSizeChanged', {});
					}
				});
				
				// create containers
				var c1 = new $class(this.options, this, this.dashboard);
				var c2 = new $class(this.options, this, this.dashboard);
				
				splitBox.addToPane(0, c1);
				splitBox.addToPane(1, c2);
				
				if(side == 'right' || side == 'bottom'){
					c1.setContainer(this);
					c2.addWidget(widget);
				} else {
					c1.addWidget(widget);
					c2.setContainer(this);
				}
				this.clientContainer.append(splitBox.getElement());
				this.childContainers = [c1, c2];
				this.widgetContainer = null;
				this.splitBox = splitBox;
				this.type = 'split';
				this.getElement().attr('type', this.type);
			}
			this.dashboard.notifyChanged(this, 'JSB.Widgets.Dashboard.widgetDocked', {widget: widget, side: side});
		},
		
		getLayout: function(){
			var desc = {
				type: this.type
			};
			if(this.type == 'widget'){
				desc.widgets = [];
				for(var wId in this.widgetContainer.widgets){
					var w = this.widgetContainer.getWidget(wId);
					desc.widgets.push(wId);
				}
			} else {
				desc.splitPosition = this.splitBox.getSplitterPosition();
				desc.splitType = this.splitBox.options.type;
				desc.containers = [];
				for(var i = 0; i < this.childContainers.length; i++){
					desc.containers.push(this.childContainers[i].getLayout());
				}
			}
			return desc;
		},
		
		setLayout: function(layout){
			if(layout.type == 'widget'){
				for(var i = 0; i < layout.widgets.length; i++){
					var wId = layout.widgets[i];
					var w = this.dashboard.widgets[wId]
					this.addWidget(w);
				}
			} else {
				this.splitBox = new SplitBox({
					type: layout.splitType,
					position: layout.splitPosition,
					
					onChange: function(){
						$this.dashboard.notifyChanged($this, 'JSB.Widgets.Dashboard.layoutSizeChanged', {});
					}
				});
				// create containers
				var c1 = new $class(this.options, this, this.dashboard);
				var c2 = new $class(this.options, this, this.dashboard);
				
				this.splitBox.addToPane(0, c1);
				this.splitBox.addToPane(1, c2);
				
				this.clientContainer.append(this.splitBox.getElement());
				this.childContainers = [c1, c2];
				this.widgetContainer = null;
				c1.setLayout(layout.containers[0]);
				c2.setLayout(layout.containers[1]);
			}
		}
	}
}
