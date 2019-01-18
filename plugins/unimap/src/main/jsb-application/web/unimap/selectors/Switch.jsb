{
    $name: 'Unimap.Selectors.Switch',
    $parent: 'Unimap.Selectors.Basic',

    $alias: 'switch',

    createDefaultValues: function(key, scheme, values, opts){
        $base(key, scheme, values, opts);

        if(values.checked){
            values.values[0] = {
                items: {}
            }

            for(var i in scheme.items){
                values.values[0].items[i] = {};

                this.getMainSelector().getRenderByName(scheme.items[i].render).createDefaultValues(i, scheme.items[i], values.values[0].items[i], opts);
            }
        }
    },

    find: function(key, values, isFindAll){
        var main = false,
            resArr = [],
            res;

        if(values){
            if(values[0]){
                res = this.getMainSelector().find(key, values[0]);
            }
        } else {
            main = true;
            if(this._values && this._values[0]){
                res = this.getMainSelector().find(key, this._values[0]);
            }
        }

        if(res){
            return res;
        }

        if(main && !isFindAll){
            return this.getRenderByName().getInstance();
        }

        if(resArr.length !== 0){
            return resArr;
        }
    },

    findAll: function(){
        var res = this.find(key, null, true);

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
            values = this._values[0];
        }

        this.getMainSelector().findRendersByName(name, arr, values);

        return arr;
    },

    updateValues: function(key, scheme, values, opts){
        var wasUpdated = $base(key, scheme, values, opts);

        // todo: test

        // remove keys
        for(var i in values.values[0]){
            if(!scheme.items[i]){   // remove keys
                if(!opts.removedValues[i]){
                    opts.removedValues[i] = [];
                }

                opts.removedValues[i].push(values.values[0][i]);
                delete values.values[0][i];

                wasUpdated = true;
            } else {    // update old keys
                if(!scheme.items[i].render){    // empty values was added in old scheme versions or scheme parts was disabled
                    delete values.values[0][i];
                    wasUpdated = true;
                    continue;
                }

                if(values.values[0][i]){
                    wasUpdated = this.getRenderByName(scheme.items[i].render).updateValues(i, scheme.items[i], values.values[0][i], opts) || wasUpdated;
                }
            }
        }

        if(!values.values[0]){
            if(Object.keys(scheme.items).length > 0){
                values.values[0] = {};
            } else {
                return wasUpdated;
            }
        }

        for(var i in scheme.items){
            if(!values.values[0][i] && scheme.items[i].render){
                if(opts.removedValues[i]){   // move keys
                    values.values[0][i] = opts.removedValues[i].shift();
                } else {    // add keys
                    values.values[0][i] = {};

                    this.getRenderByName(scheme.items[i].render).updateValues(i, scheme.items[i], values.values[0][i], opts);
                }

                wasUpdated = true;
            }
        }

        return wasUpdated;
    }
}