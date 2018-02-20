{
    $name: 'Unimap.ValueSelector',
    $require: ['Unimap.ValueSelectors.Basic', 'Unimap.Bootstrap'],

    _rendersMap: {},
    _baseSelector: null,
    _values: null,

    $constructor: function(opts){
        this._values = opts.values;
        this._linkedFields = opts.linkedFields || {};
        this._context = opts.context;

        this._baseSelector = new Basic({
            mainSelector: $this
        });

        this.createRendersMapByClasses(JSB.getInstance(opts.bootstrap ? opts.bootstrap : 'Unimap.Bootstrap').getValueSelectorsMap());
    },

    createDefaultValues: function(scheme){
        for(var i in scheme){
            if(!this._values[i]){
                this._values[i] = {}
            }

            this.getRenderByName(scheme[i].render).createDefaultValues(i, scheme[i], this._values[i]);
        }

        return {
            values: this._values,
            linkedFields: this._linkedFields
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

    find: function(key, values, isFindAll){
        if(!key || key.length == 0){
            return;
        }

        var main = false;
        if(!values){
            main = true;
            values = this._values;
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
                res = this.getRenderByName(values[i].render).getInstance(i, values[i]);
                break;
            }
        }

        if(!res && strict){
            return null;
        }

        if(res){
            if(key.length > 0){
                return res.find(key, undefined, isFindAll);
            } else {
                return res;
            }
        } else {
            for(var i in values){
                var r = this.getRenderByName(values[i].render),
                    res = r.find ? r.find(curKey[0], values[i].values, isFindAll) : undefined;

                if(res){
                    if(key.length > 0){
                        return res.find(key, undefined, isFindAll);
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
                arr.push(r.getInstance(i, values[i]));
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
    }
}