{
	$name: 'Unimap.Render.Scheme',
	$parent: 'Unimap.Render.Basic',
	$require: ['css:Scheme.css'],

	$alias: 'scheme',

	$client: {
		
		_innerController: null,

	    construct: function(){
	        this.addClass('schemeRender');
	        
	        if(this._scheme.name){
		        var name = this.$('<span class="name">' + this._scheme.name + '</span>');
		        this.append(name);
	
		        this.createRequireDesc(name);
		        this.createDescription(name);
	        }

	        if(this._values.values.length == 0){
	        	this._values.values.push({value:{}});
	        }
	        this.addItem(this._values.values[0]);
	    },

	    addItem: function(values){
	    	if(values && values.value){
	    		$this.setValue(values.value);
	    	}
	    },
	    
	    setValue: function(val){
    		if(val){
    			$this._values.values[0].value = val;
    			$this.constructScheme();
    		}
	    },
	    
	    constructScheme: function(){
            if(this._innerController){
                this._innerController.destroy();
            }
            
            var scheme = this._scheme.scheme;
            
            if(scheme && Object.keys(scheme).length > 0){
	            $this._innerController = $this.createInnerScheme(scheme, $this._values.values[0].value, function(){
	                $this._values.values[0].linkedFields = $this._innerController.getLinkedFields();
	            });
	            $this.append($this._innerController);
            }
        }
	}
	
}
