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
	$name: 'JSB.Widgets.Dashboard.Container',
	$parent: 'JSB.Widgets.Control',
	$client: {
		$require: ['JSB.Widgets.Dashboard.Placeholder',
		           'JSB.Widgets.WidgetContainer',
		           'JSB.Widgets.FloatingContainer',
		           'JSB.Widgets.SplitBox',
		           'css:Container.css'],
		           
		widgetContainer: null,
		splitBox: null,
		placeholders: {},
		type: null,
		childContainers: [],
		dashboard: null,
		parent: null,
		
		$constructor: function(opts, parent, dashboard){
			$base(opts);
			this.addClass('_jsb_dashboardContainer');
			this.dashboard = dashboard;
			this.parent = parent;
			
			// create client container
			this.clientContainer = this.$('<div class="_jsb_clientContainer"></div>');
			this.append(this.clientContainer);
			
			this.phContainer = this.$('<div class="_jsb_phContainer"></div>');
			this.append(this.phContainer);
			
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
							if(!dragAccept && $this.options.onDragAccept){
								if($this.options.onDragAccept(d)){
									dragAccept = true;
								}
							}
							
							if(dragAccept){
								$this.enableDragging(true);
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
							if($this.options.onDragDrop){
								$this.options.onDragDrop.call($this, d, callback);
							}
						},
						onDragStop: function(){
							$this.enableDragging(false);
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
					$this.phContainer.append(ph.getElement());
					$this.placeholders[phType] = ph;
				})(phType);
			}
		},
		
		enableDragging: function(bEnable){
			if(bEnable){
				if($this.hasClass('dragging')){
					return;
				}
				$this.addClass('dragging');
				// figure out deep
				var curContainer = this;
				var leftOffset = 0;
				var rightOffset = 0;
				var topOffset = 0;
				var bottomOffset = 0;
				var step = 11;
				var bStopLeft = false;
				var bStopRight = false;
				var bStopTop = false;
				var bStopBottom = false;
				while(curContainer){
					var pContainer = curContainer.parent;
					if(!JSB.isInstanceOf(pContainer, 'JSB.Widgets.Dashboard.Container')){
						break;
					}
					
					if(pContainer.childContainers[0] == curContainer){
						if(pContainer.splitBox.getType() == 'vertical'){
							// left
							bStopRight = true;
						} else {
							// top
							bStopBottom = true;
						}
					} else {
						if(pContainer.splitBox.getType() == 'vertical') {
							// right
							bStopLeft = true;
						} else {
							// bottom
							bStopTop = true;
						}
					}
					
					if(!bStopLeft){
						leftOffset += step;
					}
					if(!bStopRight){
						rightOffset += step;
					}
					if(!bStopTop){
						topOffset += step;
					}
					if(!bStopBottom){
						bottomOffset += step;
					}

					curContainer = pContainer;
				}
				
				$this.phContainer.css({
					'margin-left': leftOffset,
					'margin-right': rightOffset,
					'margin-top': topOffset,
					'margin-bottom': bottomOffset
				});
				
			} else {
				$this.removeClass('dragging');
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
			var desc = this.undockWidget(widget);
			this.dashboard.notifyChanged(this, 'JSB.Widgets.Dashboard.widgetRemoved', {widget: widget, side: desc.side});
		},
		
		undockWidget: function(widget){
			if(widget && this.widgetContainer){
				this.widgetContainer.detachWidget(widget);
			}
			
			if(!this.widgetContainer || Object.keys(this.widgetContainer.widgets).length == 0){
				// unwind container hierarchy
				if(this.widgetContainer){
					this.widgetContainer.destroy();
				}
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
		
		addWidget: function(widget, bPreserveActive){
			// create wodgetContainer if necessary
			if(!this.widgetContainer){
				this.widgetContainer = new WidgetContainer({
					caption: true
				});
				this.clientContainer.append(this.widgetContainer.getElement());
			}
			var curWidget = this.widgetContainer.getActiveWidget();
			this.widgetContainer.attachWidget(widget);
			
			// switch to the first widget
			if(curWidget && bPreserveActive){
				this.widgetContainer.switchWidget(curWidget);
			}
			
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
					this.prevContext = cont.undockWidget(widget);
					this.draggingItems = [widget];
					$this.dashboard.widgetStates[widget.getId()] = 'floating';

					// create floating container
					var fc = new WidgetContainer({
						caption: true
					});
					fc.addClass('_jsb_dashboardFloatingContainer');
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
			} else if(container.type == 'split'){
				container.splitBox.getElement().detach();
				this.splitBox = container.splitBox;
				container.splitBox = null;
				this.clientContainer.append(this.splitBox.getElement());
				this.type = 'split';
				this.childContainers = container.childContainers;
				container.childContainers = [];
				this.childContainers[0].parent = this;
				this.childContainers[1].parent = this;
			}
			this.getElement().attr('type', this.type);
		},
		
		dockWidget: function(widget, side){
			if(side == 'center'){
				if(this.type == 'split'){
					JSB.getLogger().error('Failed to dock widget into center of split');
					return;
				}
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
				
				var pane1 = splitBox.addToPane(0, c1);
				var pane2 = splitBox.addToPane(1, c2);
				
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
				this.type = 'widget';
				for(var i = 0; i < layout.widgets.length; i++){
					var wId = layout.widgets[i];
					var w = this.dashboard.widgets[wId];
					if(w){
						this.addWidget(w, true);
					}
				}
				if(!this.widgetContainer || Object.keys(this.widgetContainer.widgets).length == 0){
					this.undockWidget();
				}
			} else {
				this.type = 'split';
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
			this.getElement().attr('type', this.type);
		}
	}
}
