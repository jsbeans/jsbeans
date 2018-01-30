{
    $name: 'Unimap.ValueSelectors.Basic',

    _excludeMethods: ['$', '$constructor', '$parent'],

    $constructor: function(opts){
        this._mainSelector = opts.mainSelector;

        this._selectorPrototype = function(opts){
            this._selector = $this;
            this._render = opts.selector.render;
            this._values = JSB.isArray(opts.selector.values) ? opts.selector.values : [opts.selector.values];
            this._key = opts.key;
        }

        this._selectorPrototype.prototype = {
            find: this.find,
            getInstance: this.getInstance,
            getLinkedFieldsByKey: this.getLinkedFieldsByKey,
            getRenderByName: this.getRenderByName,
            setValue: this.setValue,
            value: this.value,
            values: this.values
        };

        var methods = this.jsb.getMethods(true);

        for(var i = 0; i < methods.length; i++){
            if(this._excludeMethods.indexOf(methods[i]) < 0){
                this._selectorPrototype.prototype[methods[i]] = this[methods[i]];
            }
        }
    },

    find: function(key, values){
        if(!key || key.length == 0){
            return;
        }

        if(!values){
            values = this._values;
        }

        if(JSB.isArray(values)){
            values = values[0];
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
                var res = this.getRenderByName(values[i].render).getInstance(i, values[i]).find(curKey[0]);
                if(res){
                    if(key.length > 0){
                        return res.find(key);
                    } else {
                        return res;
                    }
                }
            }
        }
    },

    getInstance: function(key, selector){
        if(this._selectorPrototype){
            return new this._selectorPrototype({
                key: key,
                selector: selector
            });
        } else {
            return new this._selector._selectorPrototype({
                key: key,
                selector: selector
            });
        }
    },

    getKey: function(){
        return this._key;
    },

    getLinkedFieldsByKey: function(key){
        return this._selector._mainSelector.getLinkedFieldsByKey(key);
    },

    getRenderByName: function(name){
        return this._selector._mainSelector.getRenderByName(name);
    },

    setValue: function(val){
        this._values[0].value = val;
    },

    setValues: function(val){
        // todo
    },

    value: function(){
        return this._values[0].value;
    },

    values: function(){
        var valArr = [];

        for(var i = 0; i < this._values.length; i++){
            valArr.push(this._values[i].value);
        }

        return valArr;
    }
}