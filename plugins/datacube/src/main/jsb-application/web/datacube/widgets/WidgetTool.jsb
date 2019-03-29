{
	$name: 'DataCube.Widgets.WidgetTool',
	$parent: 'JSB.Widgets.Tool',
	$require: ['JSB.Widgets.ToolManager',
	           'DataCube.Widgets.WidgetWrapper',
	           'DataCube.Widgets.FilterManager',
	           'css:WidgetTool.css'],

	$client: {
		_wrapper: null,

		$bootstrap: function(){
			// register tooltip
			var self = this;
			ToolManager.registerTool({
				id: 'widgetTool',
				jso: self,
				wrapperOpts: {
					exclusive: 'widgetTool',
					modal: false,
					hideByOuterClick: true,
					hideInterval: 0,
					cssClass: 'widgetToolWrapper'
				}
			});
		},

		$constructor: function(opts){
			$base(opts);
			this.addClass('widgetTool');
			this.filterManager = new FilterManager(this);
        },
        
        getFilterManager: function(){
        	return this.filterManager;
        },

        update: function(){
        	var wDesc = this.getData();
        	if(wDesc.widgetEntry){
        		if(this._wrapper && this._wrapper.getWidgetEntry() != wDesc.widgetEntry){
        			this._wrapper.destroy();
        			this._wrapper = null;
        		}
        		if(!this._wrapper){
        			this._wrapper = new WidgetWrapper(wDesc.widgetEntry, this, {auto: false});
        			this.append(this._wrapper);
        		}
        		
    			this._wrapper.ensureWidgetInitialized(function(){
    				var widget = $this._wrapper.getWidget();
    				if(wDesc.filter){
                        widget.setContextFilter(wDesc.filter);
                    }
                    widget.refresh();
    			});

        	} else if(wDesc.widgetClass){
        		debugger;
        	}
        	
        }
    }
    
}