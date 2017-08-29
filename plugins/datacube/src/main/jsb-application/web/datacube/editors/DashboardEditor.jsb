{
	$name: 'DataCube.DashboardEditor',
	$parent: 'JSB.Widgets.Widget',
	
	$client: {
		$require: ['JSB.Widgets.ToolBar', 
		           'JSB.Widgets.Dashboard.Dashboard',
		           'DataCube.Controls.FilterSelector',
		           'DataCube.Widgets.FilterManager',
		           'DataCube.Widgets.WidgetWrapper'],
		
		entry: null,
		ignoreHandlers: false,
		wrappers: {},
		           
		$constructor: function(opts){
			$base(opts);
			
			this.loadCss('DashboardEditor.css');
			this.addClass('dashboardEditor');
			
			this.filterManager = new FilterManager(this);
			
			this.filterSelector = new FilterSelector(this, this.filterManager);
			this.append(this.filterSelector);
			
			
			this.dashboard = new Dashboard({
				emptyText: 'Перетащите сюда виджет',
				onDragAccept: function(d){
					if(d && d.length > 0 && d.get(0).draggingItems){
						for(var i in d.get(0).draggingItems){
							var obj = d.get(0).draggingItems[i];
							if(JSB.isInstanceOf(obj, 'DataCube.Widgets.WidgetListItem')){
								return true;
							}
						}
					}
					return false;
				},
				
				onDragDrop: function(d, callback){
					if(d && d.length > 0 && d.get(0).draggingItems){
						for(var i in d.get(0).draggingItems){
							var obj = d.get(0).draggingItems[i];
							if(JSB.isInstanceOf(obj, 'DataCube.Widgets.WidgetListItem')){
								$this.entry.server().createWidgetWrapper(obj.descriptor.jsb, obj.descriptor.name, function(widgetEntry){
									var wWrapper = new WidgetWrapper(widgetEntry, $this, {
										showSettings: true
									});
									$this.wrappers[wWrapper.getId()] = wWrapper;
									if(callback){
										callback.call($this, wWrapper);
									}
								});
								return;
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
			
			this.filterSelector.getElement().resize(function(){
				$this.dashboard.getElement().css('height', 'calc(100% - '+$this.filterSelector.getElement().outerHeight()+'px)');
			});
		},
		
		setCurrentEntry: function(entry){
			if(this.entry == entry){
				return;
			}
			this.entry = entry;
			this.filterManager.clear();
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
									var wServerId = $this.wrappers[wClientId].getWidgetEntry().getLocalId();
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
		}
		
	}
}