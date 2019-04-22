{
    $name: 'Unimap.Selectors.Select',
    $parent: 'Unimap.Selectors.Basic',

    $alias: 'select',

    createDefaultValues: function(key, scheme, values, opts){
        $base(key, scheme, values, opts);
        if(!scheme.items || Object.keys(scheme.items).length == 0){
        	return;
        }

        var val = Object.keys(scheme.items)[0];

        values.values[0] = {
            items: {},
            value: val
        };

        for(var i in scheme.items){
            if(scheme.items[i].items){
                for(var j in scheme.items[i].items){
                    values.values[0].items[j] = {};

                    this.getMainSelector().getRenderByName(scheme.items[i].items[j].render).createDefaultValues(j, scheme.items[i].items[j], values.values[0].items[j], opts);
                }
            }
        }
    },

    find: function(key, values, isFindAll, schemePath){
        var main = false,
            resArr = [];

        if(!values){
            main = true;
            values = this._values;
            
            if(!schemePath){
                schemePath = this._schemePath;
            }
        }
        
        if(JSB.isString(schemePath)){
            if(schemePath.length > 0){
            	var itemsIdx = schemePath.lastIndexOf('items');
        		if(itemsIdx < 0 || schemePath.length - itemsIdx !== 5){
        			schemePath += '.items';
        		}
            } else {
                schemePath += 'items';
            }
        }

        for(var i = 0; i < values.length; i++){
            if(!values[i].items){
                continue;
            }

            var res = this.getMainSelector().find(key, values[i].items, isFindAll, schemePath + '.' + values[i].value + '.items');
            if(res){
                if(isFindAll){
                    resArr.push(res);
                } else {
                    return res;
                }
            }
        }

        if(main && !isFindAll){
            return this.getRenderByName().getInstance();
        }

        if(resArr.length !== 0){
            return resArr;
        }
    },
    
    findByInternalId: function(id, values, schemePath){
        if(!values){
            values = this._values;

            if(!schemePath){
                schemePath = this._schemePath;
            }
        }

        if(JSB.isString(schemePath)){
            if(schemePath.length > 0){
            	var itemsIdx = schemePath.lastIndexOf('items');
        		if(itemsIdx < 0 || schemePath.length - itemsIdx !== 5){
        			schemePath += '.items';
        		}
            } else {
                schemePath += 'items';
            }
        }

        for(var i = 0; i < values.length; i++){
        	if(!values[i].items){
                continue;
            }
        	var res = this.getMainSelector().findByInternalId(id, values[i].items, schemePath + '.' + values[i].value + '.items');

            if(res){
                return res;
            }
        }
    },

    findAll: function(){
        var res = this.find(key, values, true);

        if(!JSB.isDefined(res)){
            return [];
        }

        return res;
    },

    findRendersByName: function(name, arr, values, schemePath){
        if(!arr){
            arr = [];
        }

        if(!values){
            values = this._values;
            
            if(!schemePath){
                schemePath = this._schemePath;
            }
        }
        
        if(JSB.isString(schemePath)){
            if(schemePath.length > 0){
            	var itemsIdx = schemePath.lastIndexOf('items');
        		if(itemsIdx < 0 || schemePath.length - itemsIdx !== 5){
        			schemePath += '.items';
        		}
            } else {
                schemePath += 'items';
            }
        }

        for(var i = 0; i < values.length; i++){
            if(!values[i].items){
                continue;
            }
            this.getMainSelector().findRendersByName(name, arr, values[i].items, schemePath + '.' + values[i].value + '.items');
        }

        return arr;
    },
    
    findByType: function(typeName, arr, selOpts, schemePath){
        if(!arr){
            arr = [];
        }
        
        if(!schemePath){
            schemePath = this._schemePath;
        }
        
        if(schemePath){
	        var scheme = this.getMainSelector().getScheme(schemePath);
	        
	        if(scheme && scheme.optional && selOpts && !selOpts.checked){
	        	return arr;
	        }
        }
        
        if(JSB.isString(schemePath)){
            if(schemePath.length > 0){
            	var itemsIdx = schemePath.lastIndexOf('items');
        		if(itemsIdx < 0 || schemePath.length - itemsIdx !== 5){
        			schemePath += '.items';
        		}
            } else {
                schemePath += 'items';
            }
        }

        var values = (selOpts && selOpts.values) || this._values;

        for(var i = 0; i < values.length; i++){
        	if(!values[i].items){
        		continue;
        	}
        	this.getMainSelector().findByType(typeName, arr, values[i].items, schemePath + '.' + values[i].value + '.items');
        }

        return arr;
    },

    updateValues: function(key, scheme, values, opts){
        var wasUpdated = $base(key, scheme, values, opts),
            value;

        if(values.values[0]){
            value = values.values[0].value;

            // remove keys
            if(scheme.items && scheme.items[value] && scheme.items[value].items){
                for(var i in values.values[0].items){
                    if(!scheme.items[value].items[i]){   // remove keys
                        if(!opts.removedValues[i]){
                            opts.removedValues[i] = [];
                        }

                        opts.removedValues[i].push(values.values[0].items[i]);
                        delete values.values[0].items[i];

                        wasUpdated = true;
                    } else {    // update old keys
                        if(!scheme.items[value].items[i].render){    // empty values was added in old scheme versions or scheme parts was disabled
                            delete values.values[0].items[i];
                            wasUpdated = true;
                            continue;
                        }

                        if(values.values[0].items[i]){
                            wasUpdated = this.getRenderByName(scheme.items[value].items[i].render).updateValues(i, scheme.items[value].items[i], values.values[0].items[i], opts) || wasUpdated;
                        }
                    }
                }
            }
        } else {
            value = scheme.items ? Object.keys(scheme.items)[0] : undefined;

            values.values[0] = {
                items: {},
                value: value
            };
        }

        if(scheme.items && scheme.items[value] && value){
            for(var i in scheme.items[value].items){
                if(!values.values[0].items){
                    values.values[0].items = {};
                }

                if(!values.values[0].items[i] && scheme.items[value].items[i].render){
                    if(opts.removedValues[i]){   // move keys
                        values.values[0].items[i] = opts.removedValues[i].shift();
                    } else {    // add keys
                        values.values[0].items[i] = {};

                        this.getRenderByName(scheme.items[value].items[i].render).updateValues(i, scheme.items[value].items[i], values.values[0].items[i], opts);
                    }

                    wasUpdated = true;
                }
            }
        }

        return wasUpdated;
    }
}