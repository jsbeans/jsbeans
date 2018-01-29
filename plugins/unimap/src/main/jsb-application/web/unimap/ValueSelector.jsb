{
    $name: 'Unimap.ValueSelector',
    $require: ['Unimap.ValueSelectors.Basic'],

    _rendersMap: {},
    _baseSelector: null,
    _values: null,

    $constructor: function(opts){
        this._values = opts.values;
        this._linkedFields = opts.linkedFields || {};

        this._baseSelector = new Basic({
            mainSelector: $this
        });

        this.createRenderMap(opts.rendersDescription);
    },

    createRenderMap: function(rendersDescription){
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

    find: function(key){
        return this._baseSelector.getInstance().find(key, this._values);
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