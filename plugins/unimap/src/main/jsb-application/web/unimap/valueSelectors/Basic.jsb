{
    $name: 'Unimap.ValueSelectors.Basic',

    _excludeMethods: ['$', '$constructor', '$parent'],

    $constructor: function(opts){
        this._mainSelector = opts.mainSelector;

        this._selectorPrototype = function(opts){
            this._selectorBean = $this;
            this._key = opts.key;
            this._selectorOpts = opts.selector;
            this._values = JSB.isArray(opts.selector.values) ? opts.selector.values : [opts.selector.values];
        }

        this._selectorPrototype.prototype = {
            checked: this.checked,
            getContext: this.getContext,
            getInstance: this.getInstance,
            getKey: this.getKey,
            getLinkedFieldsByKey: this.getLinkedFieldsByKey,
            getMainSelector: this.getMainSelector,
            getRenderByName: this.getRenderByName,
            getRenderName: this.getRenderName,
            setValue: this.setValue,
            setValues: this.setValues,
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

    checked: function(){
        if(JSB.isDefined(this._selectorOpts.checked)){
            return this._selectorOpts.checked;
        } else {
            return true;
        }
    },

    getContext: function(){
        return this._selectorBean._mainSelector.getContext();
    },

    getDefaultValue: function(){
        return this._selectorOpts.defaultValue;
    },

    getInstance: function(key, selector){
        if(this._selectorPrototype){
            return new this._selectorPrototype({
                key: key,
                selector: selector
            });
        } else {
            return new this._selectorBean._selectorPrototype({
                key: key,
                selector: selector
            });
        }
    },

    getKey: function(){
        return this._key;
    },

    getLinkedFieldsByKey: function(key){
        return this.getMainSelector().getLinkedFieldsByKey(key);
    },

    getMainSelector: function(){
        return this._selectorBean ? this._selectorBean._mainSelector : this._mainSelector;
    },

    getRenderByName: function(name){
        return this.getMainSelector().getRenderByName(name);
    },

    getRenderName: function(){
        return this._selectorOpts.render;
    },

    setValue: function(val){
        this._values[0].value = val;
    },

    setValues: function(val){
        // todo
    },

    value: function(val){
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