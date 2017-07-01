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
					this.destroy();
					parentContainer.placeholder.getElement().css('display', 'block');
				} else {
					
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
			this.type = 'widget';
			this.getElement().attr('type', this.type);
			var tab = this.widgetContainer.getTab(widget.getId());
			tab.tab.draggable({
				start: function(evt, ui){
					evt.originalEvent.preventDefault();
					evt.stopPropagation();
					
					var wc = widget.getContainer();
					var cont = wc.getElement().closest('._jsb_dashboardContainer').jsb();
					cont.removeWidget(widget);

					// create floating container
					var fc = new WidgetContainer({
						caption: true
					});
					fc.attachWidget(widget);
					ui.helper.append(fc.getElement());
				},
				helper: function(evt){
					this.draggingItems = [widget];
					// create drag container
					var helper = $this.$('<div class="_jsb_dashboardDragHelper"></div>');
					return helper.get(0);
				},
				stop: function(evt, ui){
					
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
				this.widgetContainer = container.widgetContainer;
				this.clientContainer.append(this.widgetContainer.getElement());
				this.type = 'widget';
				this.getElement().attr('type', this.type);
			} else {
				this.splitBox = container.splitBox;
				this.clientContainer.append(this.splitBox.getElement());
				this.type = 'split';
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
					position: 0.5
				});
				if(this.widgetContainer){
					this.widgetContainer.getElement().detach();
				}
				if(this.splitBox){
					this.splitBox.getElement().detach();
				}
				this.clientContainer.append(splitBox.getElement());
				
				// create containers
				var c1 = new $class(this.options, this, this.dashboard);
				var c2 = new $class(this.options, this, this.dashboard);
				
				this.childContainers = [c1, c2];
				splitBox.addToPane(0, c1);
				splitBox.addToPane(1, c2);
				
				if(side == 'right' || side == 'bottom'){
					c1.setContainer(this);
					c2.addWidget(widget);
				} else {
					c1.addWidget(widget);
					c2.setContainer(this);
				}
				this.widgetContainer = null;
				this.splitBox = splitBox;
				this.type = 'split';
				this.getElement().attr('type', this.type);
			}
		}
	}
}