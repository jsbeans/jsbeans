{
    $name: 'Unimap.ValueSelectors.Group',
    $parent: 'Unimap.ValueSelectors.Basic',

    createDefaultValues: function(key, scheme, values, opts){
        $base(key, scheme, values, opts);

        if(scheme.multiple){
            return;
        }

        var val = {};
        values.values.push(val);

        for(var i in scheme.items){
            val[i] = {};

            this.getMainSelector().getRenderByName(scheme.items[i].render).createDefaultValues(i, scheme.items[i], val[i], opts);
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
            var res = this.getMainSelector().find(key, values[i]);
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

    findAll: function(key, values){
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
            this.getMainSelector().findRendersByName(name, arr, values[i]);
        }

        return arr;
    },

    getName: function(){
        return this._selectorOpts.name;
    },

    value: function(){
        if(!this._values){
            return;
        }

        return this.getRenderByName(this.getRenderName()).getInstance(undefined, { values: this._values[0] });
    },

    values: function(){
        if(!this._values){
            return;
        }

        var itemsArr = [];

        for(var i = 0; i < this._values.length; i++){
            itemsArr.push(this.getRenderByName(this.getRenderName()).getInstance(undefined, { values: this._values[i] }));
        }

        return itemsArr;
    },

    updateValues: function(key, scheme, values, opts){
        var wasUpdated = $base(key, scheme, values, opts);

        // remove keys
        for(var i = 0; i < values.values.length; i++){
            for(var j in values.values[i]){
                if(!scheme.items[j]){   // remove keys
                    if(!opts.removedValues[j]){
                        opts.removedValues[j] = [];
                    }

                    opts.removedValues[j].push(values.values[i][j]);
                    delete values.values[i][j];

                    wasUpdated = true;
                } else {    // update old keys
                    if(!scheme.items[j].render){    // empty values was added in old scheme versions or scheme parts was disabled
                        delete values.values[i][j];
                        wasUpdated = true;
                        continue;
                    }

                    wasUpdated = this.getRenderByName(scheme.items[j].render).updateValues(j, scheme.items[j], values.values[i][j], opts) || wasUpdated;
                }
            }
        }

        if(!values.values[0]){
            if(scheme.multiple){
                return wasUpdated;
            } else {
                values.values[0] = {};
            }
        }

        for(var i in scheme.items){
            if(!values.values[0][i] && scheme.items[i].render){
                if(opts.removedValues[i]){   // move keys
                    if(scheme.multiple){
                        for(var j = 0; j < opts.removedValues[i].length; j++){
                            if(!values.values[j]){
                                values.values[j] = {};
                            }

                            values.values[j][i] = opts.removedValues[i][j];
                        }
                        delete opts.removedValues[i];
                    } else {
                        values.values[0][i] = opts.removedValues[i].shift();
                    }
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