{
	$name: 'DataCube.DashboardEditor',
	$parent: 'JSB.Widgets.Widget',
	
	$client: {
		$require: ['JSB.Widgets.ToolBar', 
		           'JSB.Widgets.Dashboard.Dashboard',
		           'DataCube.Controls.FilterSelector',
		           'DataCube.Widgets.FilterManager',
		           'DataCube.Widgets.WidgetWrapper',
		           'JSB.Widgets.MenuBar',
		           'css:DashboardEditor.css'],
		
		entry: null,
		ignoreHandlers: false,
		wrappers: {},
		           
		$constructor: function(opts){
			$base(opts);
			this.addClass('dashboardEditor loading');
			
			this.filterManager = new FilterManager(this);
			
			this.header = this.$('<div class="header"></div>');
			this.append(this.header);
			
			this.filterSelector = new FilterSelector(this, this.filterManager);
			this.header.append(this.filterSelector.getElement());
			
			this.menuBar = new MenuBar({
				category: 'dashboardEditor',
				cssClass: 'dashboardMenu',
				context: this
			});
			this.header.append(this.menuBar.getElement());
			
			
			this.dashboard = new Dashboard({
				emptyText: 'Перетащите сюда виджет',
				onDragAccept: function(d){
					if(d && d.length > 0 && d.get(0).draggingItems){
						for(var i in d.get(0).draggingItems){
							var obj = d.get(0).draggingItems[i];
							if(JSB.isInstanceOf(obj, 'DataCube.Renderers.WidgetRegistryRenderer')){
								return true;
							}
							if(obj.obj && JSB.isInstanceOf(obj.obj, 'DataCube.WidgetNode')){
								var dashboardEntry = $this.entry;
								if(obj.tree && obj.parent
									&& JSB.isInstanceOf(obj.tree.get(obj.parent).obj, 'DataCube.DashboardNode') 
									&& obj.tree.get(obj.parent).obj.getEntry() == $this.entry){
									return true;
								}
							}
						}
					}
					return false;
				},
				
				onDragDrop: function(d, callback){
					if(d && d.length > 0 && d.get(0).draggingItems){
						for(var i in d.get(0).draggingItems){
							var obj = d.get(0).draggingItems[i];
							if(JSB.isInstanceOf(obj, 'DataCube.Renderers.WidgetRegistryRenderer')){
								$this.entry.server().createWidgetWrapper(obj.getObject().jsb, obj.getObject().name, function(widgetEntry, fail){
									if(widgetEntry){
										var wWrapper = new WidgetWrapper(widgetEntry, $this, {
											showSettings: true
										});
										$this.wrappers[wWrapper.getId()] = wWrapper;
										if(callback){
											callback.call($this, wWrapper);
										}
									}
								});
								return;
							} else if(obj.obj && JSB.isInstanceOf(obj.obj, 'DataCube.WidgetNode')){
								var widgetEntry = obj.obj.getEntry();
								$this.entry.server().checkWrapperRelation(widgetEntry.getId(), function(res, fail){
									if(res){
										var wWrapper = new WidgetWrapper(widgetEntry, $this, {});
										$this.wrappers[wWrapper.getId()] = wWrapper;
										if(callback){
											callback.call($this, wWrapper);
										}
									}
								});
							}
						}
					}
				},
				
				onChange: function(){
					if($this.ignoreHandlers){
						return;
					}
					$this.updateLayout(this.getLayout());
				}
			});
			this.append(this.dashboard);
			
			this.loadingBack = $this.$('<div class="loadingBack"><div class="message"><div class="icon"></div></div></div>');
			this.append(this.loadingBack);
			
			this.header.resize(function(){
				$this.dashboard.getElement().css('height', 'calc(100% - '+($this.header.outerHeight() + 4)+'px)');
			});
		},
		
		setCurrentEntry: function(entry){
			if(this.entry == entry){
				return;
			}
			this.entry = entry;
			this.filterManager.clear();
			$this.addClass('loading');
			this.entry.server().load(function(dashboardDesc){
				// remove old wrappers
				for(var wId in $this.wrappers){
					$this.wrappers[wId].destroy();
				}
				
				// create wrappers
				$this.wrappers = {};
				var wWrappers = {};
				for(var wId in dashboardDesc.wrappers){
					var wWrapper = new WidgetWrapper(dashboardDesc.wrappers[wId], $this);
					wWrappers[wId] = wWrapper;
					$this.wrappers[wWrapper.getId()] = wWrapper;
				}
				
				// translate layout ids
				var layout = JSB.clone(dashboardDesc.layout);
				if(layout){
					function performLayout(lEntry){
						if(lEntry && lEntry.widgets){
							var nWidgets = [];
							for(var i = 0; i < lEntry.widgets.length; i++){
								var wServerId = lEntry.widgets[i];
								if(wServerId && wWrappers[wServerId]){
									var wClientId = wWrappers[wServerId].getId();
									nWidgets.push(wClientId);
								} else {
									debugger;
								}
							}
							lEntry.widgets = nWidgets;
						} 
						if(lEntry && lEntry.containers){
							for(var i = 0; i < lEntry.containers.length; i++){
								performLayout(lEntry.containers[i]);
							}
						} 
					}
					
					performLayout(layout);
				}
				var desc = {
					layout: layout,
					widgets: $this.wrappers
				};
				$this.ignoreHandlers = true;
				$this.dashboard.setLayout(desc);
				$this.ignoreHandlers = false;
				
				JSB.chain(Object.keys($this.wrappers), function(wId, callback){
					$this.wrappers[wId].ensureWidgetInitialized(callback);
				}, function(){
					$this.removeClass('loading');
				});
			});
		},
		
		updateLayout: function(dlayout){
			var layoutToStore = null;
			if(dlayout){
				layoutToStore = dlayout.layout;
				if(layoutToStore){
					function performLayout(lEntry){
						if(lEntry && lEntry.widgets){
							var nWidgets = [];
							for(var i = 0; i < lEntry.widgets.length; i++){
								var wClientId = lEntry.widgets[i];
								if(wClientId && $this.wrappers[wClientId]){
									var wServerId = $this.wrappers[wClientId].getWidgetEntry().getId();
									nWidgets.push(wServerId);
								}
							}
							lEntry.widgets = nWidgets;
						} 
						if(lEntry && lEntry.containers){
							for(var i = 0; i < lEntry.containers.length; i++){
								performLayout(lEntry.containers[i]);
							}
						} 
					}
					
					performLayout(layoutToStore);
				}
			}
			this.entry.server().updateLayout(layoutToStore);
		},
		
		getFilterSelector: function(){
			return this.filterSelector;
		},
		
		getFilterManager: function(){
			return this.filterManager;
		},
		
		getDashboard: function(){
			return this.entry;
		},
		
		getWrappers: function(){
			return this.wrappers;
		}
		
	}
}