{
	$name: 'JSB.DataCube.DashboardEditor',
	$parent: 'JSB.Widgets.Widget',
	
	$client: {
		$require: ['JSB.Widgets.ToolBar', 
		           'JSB.Widgets.Dashboard.Dashboard',
		           'JSB.DataCube.Widgets.FilterSelector',
		           'JSB.DataCube.Widgets.WidgetWrapper'],
		
		entry: null,
		ignoreHandlers: false,
		           
		$constructor: function(opts){
			$base(opts);
			
			this.loadCss('DashboardEditor.css');
			this.addClass('dashboardEditor');
			
			this.filterSelector = new FilterSelector(this);
			this.append(this.filterSelector);
			
			this.dashboard = new Dashboard({
				emptyText: 'Перетащите сюда виджет',
				onDragAccept: function(d){
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
				
				onDragDrop: function(d, callback){
					if(d && d.length > 0 && d.get(0).draggingItems){
						for(var i in d.get(0).draggingItems){
							var obj = d.get(0).draggingItems[i];
							if(JSB.isInstanceOf(obj, 'JSB.DataCube.Widgets.WidgetListItem')){
								$this.entry.server().createWidgetWrapper(obj.descriptor.jsb, obj.descriptor.name, function(wWrapper){
									wWrapper.setOwner($this);
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
			this.filterSelector.clear();
			this.entry.server().load(function(dashboardDesc){
				for(var wId in dashboardDesc.wrappers){
					dashboardDesc.wrappers[wId].setOwner($this);
				}
				var desc = {
					layout: dashboardDesc.layout,
					widgets: dashboardDesc.wrappers
				};
				$this.ignoreHandlers = true;
				$this.dashboard.setLayout(desc);
				$this.ignoreHandlers = false;
			});
		},
		
		updateLayout: function(dlayout){
			this.entry.server().updateLayout(dlayout ? dlayout.layout : null);
		},
		
		getFilterSelector: function(){
			return this.filterSelector;
		},
		
		getDashboard: function(){
			return this.entry;
		}
		
	}
}