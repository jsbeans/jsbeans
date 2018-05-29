{
    $name: 'Unimap.ValueSelectors.Select',
    $parent: 'Unimap.ValueSelectors.Basic',

    createDefaultValues: function(key, scheme, values, opts){
        $base(key, scheme, values, opts);

        var val = Object.keys(scheme.items)[0];

        values.values[0] = {
            items: {},
            value: val
        };

        if(scheme.items[val].items){
            for(var i in scheme.items[val].items){
                values.values[0].items[i] = {};

                this.getMainSelector().getRenderByName(scheme.items[val].items[i].render).createDefaultValues(i, scheme.items[val].items[i], values.values[0].items[i], opts);
            }
        }
    },

    find: function(key, values, isFindAll){
        var main = false,
            resArr = [];

        if(!values){
            main = true;
            values = this._values;
        }

        for(var i = 0; i < values.length; i++){
            if(!values[i].items){
                continue;
            }

            var res = this.getMainSelector().find(key, values[i].items);
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

    findAll: function(){
        var res = this.find(key, values, true);

        if(!JSB.isDefined(res)){
            return [];
        }

        return res;
    },

    findRendersByName: function(name, arr, values){
        if(!arr){
            arr = [];
        }

        if(!values){
            values = this._values;
        }

        for(var i = 0; i < values.length; i++){
            if(!values[i].items){
                continue;
            }

            this.getMainSelector().findRendersByName(name, arr, values[i].items);
        }

        return arr;
    },

    updateValues: function(key, scheme, values, opts){
        var wasUpdated = $base(key, scheme, values, opts),
            value;

        if(values.values[0]){
            value = values.values[0].value;

            // remove keys
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

                    wasUpdated = this.getRenderByName(scheme.items[value].items[i].render).updateValues(i, scheme.items[value].items[i], values.values[0].items[i], opts) || wasUpdated;
                }
            }
        } else {
            value = scheme.items ? Object.keys(scheme.items)[0] : undefined;

            values.values[0] = {
                items: {},
                value: value
            };
        }

        if(scheme.items && value){
            for(var i in scheme.items[value].items){
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