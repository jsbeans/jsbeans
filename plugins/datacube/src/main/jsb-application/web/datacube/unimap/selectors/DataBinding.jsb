{
    $name: 'Datacube.Selectors.DataBindingSelector',
    $parent: 'Unimap.Selectors.Basic',

    $alias: 'dataBinding',

    binding: function(){
        if(!this._values || this._values.length === 0){
            return;
        }

        return this._values[0].binding;
    },
    
    bindings: function(validOnly){
        var bindings = [];

        for(var i = 0; i < this._values.length; i++){
        	if(validOnly && !this._values[i].binding){
        		continue;
        	}
            bindings.push(this._values[i].binding);
        }

        return bindings;
    },


    bindingInfo: function(){
        if(!this._values || this._values.length === 0){
            return;
        }

        return this._values[0].bindingInfo;
    },
    
    bindingInfos: function(validOnly){
    	var bindingsInfo = [];
        
        if(this._values){
	        for(var i = 0; i < this._values.length; i++){
	        	if(validOnly && !this._values[i].binding){
	        		continue;
	        	}
	        	bindingsInfo.push(this._values[i].bindingInfo);
	        }
        }

        return bindingsInfo;
    },

    bindingType: function(){
        if(!this._values || this._values.length === 0){
            return;
        }

        return this._values[0].bindingType;
    },

    bindingTypes: function(){
    	var bindingTypes = [];
        
        if(this._values){
	        for(var i = 0; i < this._values.length; i++){
	        	if(validOnly && !this._values[i].binding){
	        		continue;
	        	}
	        	bindingTypes.push(this._values[i].bindingType);
	        }
        }

        return bindingTypes;
    },


    getBindingName: function(){
        return this._values[0].binding;
    },

    hasBinding: function(){
        return this._values[0] && JSB.isDefined(this._values[0].binding);
    },

    setBinding: function(binding, linkToSelector){
        if(!this._values || this._values.length === 0){
            this._values.push({});
        }

        this._values[0].binding = binding;
        this._values[0].value = binding;

        if(!linkToSelector){
            linkToSelector = this.getLinkToSelector();
        }

        this._values[0].bindingInfo = linkToSelector.getBindingInfo(binding);
        this._values[0].bindingType = this._values[0].bindingInfo.type;
    },

    value: function(layer){
        if(!this._values || this._values.length === 0){
            return;
        }

        var value;

        if(typeof this._values[0].value === 'object'){
            layer = layer || 'main';
            value = this._values[0].value[layer];
        } else {
            value = this._values[0].value;
        }

        if(this._selectorOpts && this._selectorOpts.valueType){
            switch(this._selectorOpts.valueType){
                case 'number':
                    if(typeof value === 'string'){
                        value = value.replace(/,/g, '.');
                    }

                    value = Number(value);

                    if(isNaN(value) || typeof this._values[0].value === 'string' && this._values[0].value.length === 0 || !JSB.isDefined(this._values[0].value)){
                        value = JSB.isDefined(this._selectorOpts.defaultValue) ? this._selectorOpts.defaultValue : undefined;
                    }
                    break;
                case 'string':
                default:
                    value = value;

                    if(!JSB.isDefined(value)){
                        value = JSB.isDefined(this._selectorOpts.defaultValue) ? this._selectorOpts.defaultValue : undefined;
                        break;
                    }

                    if(typeof value === 'string' && value.length === 0){
                        value = JSB.isDefined(this._selectorOpts.defaultValue) ? this._selectorOpts.defaultValue : '';
                    }
            }
        }

        return value;
    },

    values: function(layer, validOnly){
        if(!this._values || this._values.length === 0){
            return [];
        }

        var valArr = [];

        if(this._values[0].value !== null && typeof this._values[0].value === 'object'){
            layer = layer || 'main';

            for(var i = 0; i < this._values.length; i++){
            	var val = this._values[i].value && this._values[i].value[layer];
            	if(!validOnly || JSB.isDefined(val)){
            		valArr.push(val);
            	}
            }
        } else {
            for(var i = 0; i < this._values.length; i++){
            	var val = this._values[i].value;
            	if(!validOnly || JSB.isDefined(val)){
            		valArr.push(val);
            	}
            }
        }

        return valArr;
    }
}