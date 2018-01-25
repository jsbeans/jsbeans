{
    $name: 'Unimap.ValueSelectors.Basic',

    _excludeMethods: ['$', '$constructor', '$parent'],

    $constructor: function(opts){
        this._mainSelector = opts.mainSelector;

        this._objectPrototype = function(values){
            this._selector = $this;
            this._values = values;
        }

        this._objectPrototype.prototype = {
            find: this.find,
            getInstance: this.getInstance,
            getRenderByName: this.getRenderByName,
            value: this.value,
            values: this.values
        };

        var methods = this.jsb.getMethods(true);

        for(var i = 0; i < methods.length; i++){
            if(this._excludeMethods.indexOf(methods[i]) < 0){
                this._objectPrototype.prototype[methods[i]] = this[methods[i]];
            }
        }
    },

    find: function(key, values){
        if(!key || key.length == 0){
            return;
        }

        if(!values){
            values = this._values.values;
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
                res = this.getRenderByName(values[i].render).getInstance(values[i]);
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
                var res = this.getRenderByName(values[i].render).getInstance(values[i]).find(curKey[0]);
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

    getInstance: function(values){
        return new this._objectPrototype(values);
    },

    getRenderByName: function(name){
        return this._selector._mainSelector.getRenderByName(name);
    },

    value: function(){
        return this._values.values[0].value;
    },

    values: function(){
        var valArr = [];

        for(var i = 0; i < this._values.values.length; i++){
            valArr.push(this._values.values[i].value);
        }

        return valArr;
    }
}