{
	$name: 'DataCube.Api.Widget',
	$parent: 'JSB.Widgets.Control',
	
	$client: {
		$require: ['DataCube.Widgets.FilterManager','DataCube.Api.WidgetController'],
		
		options: {
			wsid: null,
			wid: null,
			onCreateWidget: null
		},
		widgetEntry: null,
		values: null,
		widget: null,
		
		$constructor: function(opts){
			$base(opts);
			
			var wsId = opts.wsid;
			var wId = opts.wid;
			this.server().getWidgetEntry(wsId, wId, function(wEntry){
				$this.widgetEntry = wEntry;
				$this.init();
			});
		},
		
		init: function(){
			this.values = this.widgetEntry.getValues();
			JSB.lookup($this.getWidgetType(), function(WidgetClass){
				$this.widget = new WidgetClass();
				$this.append($this.widget);
				$this.widget.setWrapper($this);
				$this.widget.ensureInitialized(function(){
					$this.subscribe('DataCube.filterChanged', function(sender, msg, params){
						if(!JSB.isInstanceOf(sender, 'DataCube.Widgets.Widget')){
							return;
						}
						$this.widget.refresh(params);
					});

					$this.publish('DataCube.Api.Widget.widgetCreated', {wsid: $this.options.wsid, wid: $this.options.wid});
					if($this.options.onCreateWidget){
						if(JSB.isString($this.options.onCreateWidget)){
							$this.options.onCreateWidget = eval('(' + $this.options.onCreateWidget + ')');
						}
						$this.options.onCreateWidget.call($this, $this.widget);
					}
					if($this.options.auto){
						$this.widget.refresh();
					}
				});

			});
		},
		
		getName: function(){
			return this.getWidgetEntry().getName();
		},
		
		getWidgetType: function(){
			return this.getWidgetEntry().getWidgetType();
		},
		
		getValues: function(){
			return this.values;
		},
		
		getDashboard: function(){
			return this.getWidgetEntry().getDashboard();
		},
		
		getWidgetEntry: function(){
			return this.widgetEntry;
		},
		
		getWidget: function(){
			return $this.widget;
		},
		
		localizeFilter: function(src){
			return WidgetController.getFilterManager().localizeFilter(src);
		},
		
		constructFilterBySource: function(source){
			return WidgetController.getFilterManager().constructFilterBySource(source);
		},

		constructFilterByLocal: function(filters, src){
			return WidgetController.getFilterManager().constructFilterByLocal(filters, src);
		},

		clearFilters: function(widget){
			WidgetController.getFilterManager().clearFilters(widget);
		},
		
		hasFilter: function(fDesc){
			return WidgetController.getFilterManager().hasFilter(fDesc);
		},
		
		addFilter: function(fDesc, sourceIds, widget){
			return WidgetController.getFilterManager().addFilter(fDesc, sourceIds, widget);
		},
		
		removeFilter: function(fItemId, widget){
			return WidgetController.getFilterManager().removeFilter(fItemId, widget);
		},
		
		getFilterManager: function(){
			return WidgetController.getFilterManager();
		}
	},
	
	$server: {
		$require: ['JSB.Workspace.WorkspaceController'],
		
		getWidgetEntry: function(wsId, wId){
			var wm = WorkspaceController.ensureManager('datacube');
			if(!wm){
				throw new Error('Internal error: missing WorkspaceManager for datacube');
			}
			var w = wm.workspace(wsId);
			if(!w){
				throw new Error('Unable to find workspace with id: ' + wsId);
			}
			
			var widgetEntry = w.entry(wId);
			if(!widgetEntry || !JSB.isInstanceOf(widgetEntry, 'DataCube.Model.Widget')){
				throw new Error('Unable to find widget with id: ' + wId);
			}
			
			return widgetEntry;
		}
	}
}