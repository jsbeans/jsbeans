{
    $name: 'Unimap.ValueSelector',
    $require: ['Unimap.ValueSelectors.Basic', 'Unimap.Bootstrap'],

    _rendersMap: {},
    _baseSelector: null,
    _values: null,

    $constructor: function(opts){
        this._scheme = opts.scheme;
        this._values = opts.values && opts.values.values || {};
        this._linkedFields = opts.values && opts.values.linkedFields || {};
        this._context = opts.context;

        this._baseSelector = new Basic({
            mainSelector: $this
        });

        this.createRendersMapByClasses(JSB.getInstance(opts.bootstrap ? opts.bootstrap : 'Unimap.Bootstrap').getValueSelectorsMap());
    },

    addLinkedFields: function(linkedFields){
        for(var i in linkedFields){
            if(!this._linkedFields[i]){
                this._linkedFields[i] = [];
            }

            for(var j = 0; j < linkedFields[i].length; j++){
                if(this._linkedFields[i].indexOf(linkedFields[i][j]) < 0){
                    this._linkedFields[i].push(linkedFields[i][j]);
                }
            }
        }
    },

    createDefaultValues: function(scheme){
        if(!scheme){
            scheme = this._scheme;
        }

        if(!scheme){
            throw new Error('Must specify a scheme');
        }

        var values = {},
            linkedFields = {};

        for(var i in scheme){
            if(scheme[i].render){
                if(!values[i]){
                    values[i] = {}
                }

                this.getRenderByName(scheme[i].render).createDefaultValues(i, scheme[i], values[i], {linkedFields: linkedFields});
            }
        }

        return {
            values: values,
            linkedFields: linkedFields
        };
    },

    createRendersMapByClasses: function(rendersMap){
        for(var i in rendersMap){
            this._rendersMap[i] = new rendersMap[i]({
                mainSelector: this
            });
        }
    },

    destroy: function(){
        this._baseSelector.destroy();

        for(var i in this._rendersMap){
            this._rendersMap[i].destroy();
        }
        $base();
    },

    find: function(key, values, isFindAll, schemePath){
        if(!key || key.length == 0){
            return;
        }

        var main = false;
        if(!values){
            main = true;
            values = this._values;

            if(!schemePath){
                schemePath = this._schemePath;
            }
        }

        key = key.trim();

        var regexp = /\S+(?=\s|$)/,
            curKey = key.match(regexp),
            res,
            strict = false;

        key = key.substring(curKey[0].length).trim();

        if(curKey[0] == '>'){
            strict = true;
            curKey = key.match(regexp);
            key = key.substring(curKey[0].length).trim();
        }

        for(var i in values){
            if(i == curKey[0]){
                if(JSB.isString(schemePath)){
                    if(schemePath.length > 0){
                        schemePath += '.' + i;
                    } else {
                        schemePath += i;
                    }
                } else {
                    schemePath = i;
                }

                res = this.getRenderByName(values[i].render).getInstance({ key: i, selector: values[i], schemePath: schemePath });
                break;
            }
        }

        if(!res && strict){
            return null;
        }

        if(res){
            if(key.length > 0){
                return res.find ? res.find(key, undefined, isFindAll, schemePath) : res;
            } else {
                return res;
            }
        } else {
            for(var i in values){
                var r = this.getRenderByName(values[i] && values[i].render),
                    res = r.find ? r.find(curKey[0], values[i].values, isFindAll, schemePath ? (schemePath + '.' + i) : i) : undefined;

                if(res){
                    if(key.length > 0){
                        return res.find(key, undefined, isFindAll, schemePath);
                    } else {
                        return res;
                    }
                }
            }
        }

        if(main && !isFindAll){
            return this.getRenderByName().getInstance();
        }
    },

    findAll: function(key, values){
        var res = this.find(key, values, true);

        if(!JSB.isDefined(res)){
            return [];
        }

        if(!JSB.isArray(res)){
            res = [res];
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

        for(var i in values){
            var r = this.getRenderByName(values[i].render);

            if(values[i].render === name){
                arr.push(r.getInstance({key: i, selector: values[i]}));
            }

            r.findRendersByName && r.findRendersByName(name, arr, values[i].values);
        }

        return arr;
    },

    getContext: function(){
        return this._context;
    },

    getLinkedFieldsByKey: function(key){
        if(!key){
            return;
        }

        return this._linkedFields[key] ? this._linkedFields[key] : [];
    },

    getRenderByName: function(name){
        if(this._rendersMap[name]){
            return this._rendersMap[name];
        } else {
            return this._baseSelector;
        }
    },

    getScheme: function(){
        return this._scheme;
    },

    updateValues: function(scheme, fullValues){
        var removedValues = {},
            wasUpdated = false,
            values = fullValues.values,
            linkedFields = fullValues.linkedFields;

        for(var i in values){
            if(!scheme[i]){ // remove keys
                if(!removedValues[i]){
                    removedValues[i] = [];
                }
                removedValues[i].push(values[i]);
                delete values[i];

                wasUpdated = true;
            } else {    // update old keys
                if(!scheme[i].render){  // empty values was added in old scheme versions or scheme parts was disabled
                    delete values[i];
                    continue;
                }

                wasUpdated = this.getRenderByName(scheme[i].render).updateValues(i, scheme[i], values[i], {linkedFields: linkedFields, removedValues: removedValues}) || wasUpdated;
            }
        }

        for(var i in scheme){
            if(!values[i] && scheme[i].render){
                if(removedValues[i]){   // move keys
                    values[i] = removedValues[i].shift();
                } else {    // add keys
                    values[i] = {};

                    this.getRenderByName(scheme[i].render).updateValues(i, scheme[i], values[i], {linkedFields: linkedFields, removedValues: removedValues});
                }

                wasUpdated = true;
            }
        }

        return wasUpdated;
    }
}