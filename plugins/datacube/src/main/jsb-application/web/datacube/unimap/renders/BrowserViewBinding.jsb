{
	$name: 'Unimap.Render.BrowserViewBinding',
	$parent: 'Unimap.Render.Basic',
	$require: ['JSB.Widgets.ComboBox',
	           'css:BrowserViewBinding.css'],

	$alias: 'browserViewBinding',

	$client: {
		
		views: null,
		_innerController: null,

	    construct: function(){
	        this.addClass('browserViewBindingRender');
	        
	        this.server().getViewsWithScheme(function(views){
    			$this.views = views;
    			$this.setTrigger('viewsLoaded');
	        });

	        var name = this.$('<span class="name">' + this._scheme.name + '</span>');
	        this.append(name);

	        this.createRequireDesc(name);
	        this.createDescription(name);

	        if(this._values.values.length > 0){
	            this.addItem(this._values.values[0]);
	        } else {
	        	this._values.values.push({value:{}});
	            this.addItem();
	        }

	    },

	    addItem: function(values){
    		this.viewSelector = new ComboBox({
    			onChange: function(key){
    				if($this.ignoreHandlers){
    					return;
    				}
    				$this.setValue({
    					systemView: false,
    					view: JSB.merge({}, $this.views[key].opts, {viewType: key})
    				});
    			}
    		});
    		this.viewSelector.addClass('viewSelector');
    		this.append(this.viewSelector);
    		
	    	if(values && values.value && values.value.systemView){
	    		// render system view
	    		this.addClass('system');
	    		this.viewSelector.enable(false);
	    	} else {
	    		this.viewSelector.enable(true);
	    	}
	    	this.ensureTrigger('viewsLoaded', function(){
	    		var arr = $this.updateItems();
	    		
		    	if(values && values.value){
		    		$this.setValue(values.value);
		    	} else if(arr.length > 0){
		    		var key = arr[0];
		    		$this.setValue({
		    			systemView: false,
		    			view: JSB.merge({}, $this.views[key].opts, {viewType: key})
		    		});
		    	}
	    	})
	    },
	    
	    updateItems: function(){
	    	$this.viewSelector.clear();
	    	var viewArr = [];
	    	for(var key in $this.views){
	    		var opts = $this.views[key].opts;
	    		if(opts.acceptNode || opts.acceptEntry){
	    			continue;
	    		}
	    		viewArr.push(key);
	    	}
	    	$this.viewSelector.setItems(viewArr);
	    	return viewArr;
	    },
	    
	    setValue: function(val){
	    	this.ensureTrigger('viewsLoaded', function(){
	    		$this.ignoreHandlers = true;
	    		if(val){
	    			$this._values.values[0].value = val;
	    			$this.viewSelector.setData(val.view.viewType);
	    			$this.constructScheme(val.view.viewType);
	    		}
	    		
	    		$this.ignoreHandlers = false;
	    	});
	    },
	    
	    constructScheme: function(viewType){
            if(this._innerController){
                this._innerController.destroy();
            }
            
            var scheme = this.views[viewType].scheme;
            
            if(scheme && Object.keys(scheme).length > 0){
	            $this._innerController = $this.createInnerScheme(scheme, $this._values.values[0].value, function(){
	                $this._values.values[0].linkedFields = $this._innerController.getLinkedFields();
	            });
	            $this.append($this._innerController);
            }
        },
	},
	
	$server: {
		$require: ['JSB.Workspace.WorkspaceController'],
		
		combineScheme: function(jsb){
			var scheme = {},
            curJsb = jsb,
            schemesArray = [];

	        while(curJsb){
	            if(!curJsb.isSubclassOf('DataCube.Workspace.BrowserView')){
	                break;
	            }
	            var wScheme = curJsb.getDescriptor().$scheme;
	            if(wScheme && Object.keys(wScheme).length > 0){
	                schemesArray.push(wScheme);
	            }
	            curJsb = curJsb.getParent();
	        }
	
	        for(var i = schemesArray.length - 1; i > -1; i--){
	            JSB.merge(true, scheme, schemesArray[i]);
	        }
	
	        return scheme;
		},
		
		getViewsWithScheme: function(){
			var views = WorkspaceController.getBrowserViews();
			var rViews = {};
			for(var wType in views){
				var viewJsb = views[wType].jsb;
				var viewOpts = views[wType].opts;
				var viewScheme = null;
				if(viewJsb.isSubclassOf('DataCube.Workspace.BrowserView')){
					// combine scheme
					viewScheme = $this.combineScheme(viewJsb);
				}
				rViews[wType] = {scheme: viewScheme, opts: viewOpts};
			}
			
			return rViews;
		},
	}
}
