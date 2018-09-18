{
    $name: 'Unimap.ValueSelectors.Group',
    $parent: 'Unimap.ValueSelectors.Basic',

    addValue: function(){
        var scheme = this.getMainSelector().getScheme();
        if(!scheme){
            throw new Error('Must specify a scheme');
        }

        function objectByString(obj, str){
            str = str.replace(/\[(\w+)\]/g, '.$1'); // convert indexes to properties
            str = str.replace(/^\./, '');           // strip a leading dot
            var a = str.split('.');
            for (var i = 0, n = a.length; i < n; ++i) {
                var k = a[i];
                if (k in obj) {
                    obj = obj[k];
                } else {
                    return;
                }
            }
            return obj;
        }

        var schemePart = objectByString(scheme, this._schemePath),
            itemsKeys = Object.keys(schemePart.items),
            value = {},
            linkedFields = {};

        this.createDefaultValues(this.getKey(), schemePart, value, {linkedFields: linkedFields}, true);

        this.getMainSelector().addLinkedFields(linkedFields);

        this._values.push(value.values[0]);

        if(itemsKeys.length > 1){
            return this.getRenderByName(this.getRenderName()).getInstance({selector: value, schemePath: this._schemePath + ".items." + itemsKeys[0]});
        } else {
            return this.getRenderByName(schemePart.items[itemsKeys[0]].render).getInstance({key: itemsKeys[0], selector: value.values[0][itemsKeys[0]], schemePath: this._schemePath + '.items.' + itemsKeys[0]});
        }
    },

    createDefaultValues: function(key, scheme, values, opts, isAddNewValue){
        $base(key, scheme, values, opts);

        if(scheme.multiple && !isAddNewValue){
            return;
        }

        if(!scheme.items || Object.keys(scheme.items).length === 0){
            return;
        }

        var val = {};
        values.values.push(val);

        for(var i in scheme.items){
            val[i] = {};

            this.getMainSelector().getRenderByName(scheme.items[i].render).createDefaultValues(i, scheme.items[i], val[i], opts);
        }
    },

    find: function(key, values, isFindAll, schemePath){
        var main = false,
            resArr = [];

        if(!values){
            main = true;
            values = this._values;

            if(!schemePath){
                schemePath = this._schemePath || '';
            }
        }

        if(JSB.isString(schemePath)){
            if(schemePath.length > 0){
        		if(schemePath.length - schemePath.lastIndexOf('items') !== 5){
        			schemePath += '.items';
        		}
            } else {
                schemePath += 'items';
            }
        }

        for(var i = 0; i < values.length; i++){
            var res = this.getMainSelector().find(key, values[i], null, !i ? schemePath : undefined);
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

        return this.getRenderByName(this.getRenderName()).getInstance({selector: { values: this._values[0] }});
    },

    values: function(){
        if(!this._values){
            return;
        }

        var itemsArr = [];

        for(var i = 0; i < this._values.length; i++){
            itemsArr.push(this.getRenderByName(this.getRenderName()).getInstance({selector: { values: this._values[i] }}));
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

                    if(values.values[i][j]){
                        wasUpdated = this.getRenderByName(scheme.items[j].render).updateValues(j, scheme.items[j], values.values[i][j], opts) || wasUpdated;
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