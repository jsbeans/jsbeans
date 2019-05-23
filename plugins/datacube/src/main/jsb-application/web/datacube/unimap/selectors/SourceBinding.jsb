/** DataCube - jsBeans extension | jsbeans.org (MIT Licence) | (c) Special Information Systems, LLC */

{
    $name: 'Datacube.Selectors.SourceSelector',
    $parent: 'Unimap.Selectors.Basic',

    $alias: 'sourceBinding',

    binding: function(){
        return this._values && this._values.length > 0 && this._values[0].binding;
    },

    data: function(){
        return this._values && this._values.length > 0 && this._values[0].binding && this._values[0].binding.data;
    },

    isEmbeddedBinding: function(){
        return this._values && this._values.length > 0 && this._values[0].binding && this._values[0].binding.embeddedBinding;
    },

    isReset: function(){
        var item = this._values[0].binding;

        return item.fetchOpts && item.fetchOpts.reset;
    },

    getBindingInfo: function(binding){
        function collectFields(desc, path){
            if(!desc){
                return;
            }
            if(desc.type == 'array'){
                collectFields(desc.arrayType, path);
            } else if(desc.type == 'object'){
                var fieldArr = Object.keys(desc.record);
                fieldArr.sort(function(a, b){
                    return a.toLowerCase().localeCompare(b.toLowerCase());
                });
                for(var i = 0; i < fieldArr.length; i++){
                    var f = fieldArr[i];
                    var rf = desc.record[f];
                    var curPath = (path ? path + '.' : '') + f;
                    var schemeRef = JSB.merge({field: f}, rf);
                    $this._bindingsInfoMap[curPath] = schemeRef;
                    collectFields(rf, curPath);
                }
            }
        }

        if(!this._bindingsInfoMap){
            this._bindingsInfoMap = {};

            collectFields(this._values[0].binding, '');
        }

        return $this._bindingsInfoMap[binding];
    },

    hasBinding: function(){
        return this._values && this._values.length > 0 && this._values[0] && JSB.isDefined(this._values[0].binding);
    },

    next: function(opts){
        if(!opts){
            opts = {};
        }

        var item = this._values[0].binding;

        if(!JSB.isDefined(item.cursor)){
            item.cursor = 0;
        }

        if(!item.data || (item.cursor > 0 && !JSB.isArray(item.data))){
            return false;
        }

        var dataEl = null;

        if(JSB.isArray(item.data)){
            if(item.cursor >= item.data.length){
                return false;
            }
            // set data for embedded widgets
            if(opts.embeddedBindings){
                for(var i = 0; i < opts.embeddedBindings.length; i++){
                    opts.embeddedBindings[i].setBindingData(item.data[item.cursor], true);
                }
            }

            dataEl = item.data[item.cursor++];
        } else {
            dataEl = item.data;
            item.cursor++;
        }

        // fill values
        if(!this._linkedValues){
            var linkedKeys = this.getLinkedFieldsByKey(this.getKey()),
                linkedValues = [];

            for(var i = 0; i < linkedKeys.length; i++){
                var selector = this._selectorBean._mainSelector.findAll(linkedKeys[i]);

                for(var j = 0; j < selector.length; j++){
                    if(selector[j].getRenderName() === 'dataBinding' && selector[j]._values.length > 0 && selector[j].bindings(true).length > 0){
                        linkedValues.push(selector[j]);
                    }
                }
            }

            this._linkedValues = linkedValues;
        }

        for(var i = 0; i < this._linkedValues.length; i++){
            var values = [],
                bindings = this._linkedValues[i].bindings(true),
                infos = this._linkedValues[i].bindingInfos(true);

            for(var k = 0; k < bindings.length; k++){
            	if(infos[k] && infos[k].cubeField){
            		continue;
            	}
                values.push(dataEl[bindings[k]]);
            }

            this._linkedValues[i].setValues(values);
        }

        return true;
    },

    position: function(){
        if(!JSB.isDefined(this._values[0]) || !JSB.isDefined(this._values[0].binding)){
            return;
        }

        return this._values[0].binding.cursor;
    },

    reset: function(){
        var item = this._values[0].binding;

        if(!item.fetchOpts){
            item.fetchOpts = {};
        }

        item.fetchOpts.reset = true;

        if(item.data){
            delete item.data;
        }

        if(item.cursor){
            delete item.cursor;
        }
    },

    setBindingData: function(data, embeddedBinding){
        this._values[0].binding.data = [data];
        this._values[0].binding.embeddedBinding = embeddedBinding;
    },
    
    $client: {
    	getBoundSource: function(callback){
    		if(!this.hasBinding()){
    			if(callback){
    				callback.call(this, null);
    			}
    			return;
    		}
    		this.server().getBoundSource(this._values, function(obj){
    			if(callback){
    				callback.call(this, obj);
    			}
    		})
    	}
    },
    
    $server: {
    	$require: ['JSB.Workspace.WorkspaceController'],
    	
    	getBoundSource: function(values){
    		if(!values){
    			values = this._values;
    		}
    		if(values && values.length > 0 && values[0].binding && values[0].binding.workspaceId && values[0].binding.source){
    			var wsId = values[0].binding.workspaceId;
    			var eId = values[0].binding.source;
    			return WorkspaceController.getEntry(wsId, eId);
    		}
    	}
    }
}