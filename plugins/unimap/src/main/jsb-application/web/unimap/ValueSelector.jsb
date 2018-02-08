{
    $name: 'Unimap.ValueSelector',
    $require: ['Unimap.ValueSelectors.Basic'],

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

        if(opts.rendersMap){
            this.createRendersMapByClasses(opts.rendersMap);
        } else if(opts.rendersDescription){
            this.createRendersMap(opts.rendersDescription);
        }
    },

    createRendersMap: function(rendersDescription){
        JSB.chain(rendersDescription, function(d, c){
            JSB.lookup(d.render, function(cls){
                $this._rendersMap[d.name] = new cls({
                    mainSelector: $this
                });
                c();
            });
        }, function(){
            $this.setInitialized();
        });
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

    ensureInitialized: function(callback){
        this.ensureTrigger('_selectorInitialized', callback);
    },

    find: function(key, values){
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
                return res.find(key);
            } else {
                return res;
            }
        } else {
            for(var i in values){
                var r = this.getRenderByName(values[i].render),
                    res = r.find ? r.find(curKey[0], values[i].values) : undefined;

                if(res){
                    if(key.length > 0){
                        return res.find(key);
                    } else {
                        return res;
                    }
                }
            }
        }

        if(main){
            return this.getRenderByName().getInstance();
        }
    },

    findAll: function(key){
        // todo: find all keys in value group on same level
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

        return this._linkedFields[key];
    },

    getRenderByName: function(name){
        if(this._rendersMap[name]){
            return this._rendersMap[name];
        } else {
            return this._baseSelector;
        }
    },

    setInitialized: function(){
        this.setTrigger('_selectorInitialized');
    }
}