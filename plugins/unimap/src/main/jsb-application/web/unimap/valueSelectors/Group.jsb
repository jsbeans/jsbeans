{
    $name: 'Unimap.ValueSelectors.Group',
    $parent: 'Unimap.ValueSelectors.Basic',

    createDefaultValues: function(key, scheme, values){
        $base(key, scheme, values);

        if(scheme.multiple){
            return;
        }

        var val = {};
        values.values.push(val);

        for(var i in scheme.items){
            val[i] = {};

            this.getMainSelector().getRenderByName(scheme.items[i].render).createDefaultValues(i, scheme.items[i], val[i]);
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

    updateValues: function(scheme, values, removedValues){
        var wasUpdated = false;

        // remove keys
        for(var i = 0; i < values.values.length; i++){
            for(var j in values.values[i]){
                if(!scheme.items[j]){
                    if(!removedValues[j]){
                        removedValues[j] = [];
                    }

                    removedValues[j].push(values.values[i][j]);
                    delete values.values[i][j];

                    wasUpdated = true;
                } else {
                    var render = this.getRenderByName(scheme.items[j]);

                    if(render.updateValues){
                        wasUpdated = render.updateValues(scheme.items[j], values[i][j], removedValues) || wasUpdated;
                    }
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

        // add keys
        for(var i in scheme.items){
            if(!values.values[0][i]){
                if(removedValues[i]){
                    if(scheme.multiple){
                        for(var j = 0; j < removedValues[i].length; j++){
                            if(!values.values[j]){
                                values.values[j] = {};
                            }

                            values.values[j][i] = removedValues[i][j];
                        }
                        delete removedValues[i];
                    } else {
                        values.values[0][i] = removedValues[i].shift();
                    }
                } else {
                    values.values[0][i] = {};
                    this.getRenderByName().createDefaultValues(i, scheme.items[i], values.values[0][i]);

                    var render = this.getRenderByName(scheme.items[i].render);
                    if(render.updateValues){
                        render.updateValues(scheme.items[i], values.values[0][i], removedValues);
                    }
                }

                wasUpdated = true;
            }
        }

        return wasUpdated;
    }
}