{
    $name: 'Unimap.ValueSelectors.Basic',

    _excludeMethods: ['$', '$constructor', '$parent'],

    $constructor: function(opts){
        if(!opts){ opts = {}; }

        this._mainSelector = opts.mainSelector;

        this._selectorPrototype = function(opts){
            this._selectorBean = $this;
            this._key = opts.key;
            this._selectorOpts = opts.selector;
            this._schemePath = opts.schemePath;

            if(opts.selector && opts.selector.values){
                this._values = JSB.isArray(opts.selector.values) ? opts.selector.values : [opts.selector.values];
            }
        }

        this._selectorPrototype.prototype = {
            addMultipleValue: this.addMultipleValue,
            checked: this.checked,
            getContext: this.getContext,
            getInstance: this.getInstance,
            getKey: this.getKey,
            getLinkedFieldsByKey: this.getLinkedFieldsByKey,
            getLinkToSelector: this.getLinkToSelector,
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
        if(!this._selectorOpts){
            return undefined;
        }

        if(JSB.isDefined(this._selectorOpts.checked)){
            return this._selectorOpts.checked;
        } else {
            return true;
        }
    },

    createDefaultValues: function(key, scheme, values, opts){
        $current.updateValues(key, scheme, values, opts);
    },

    getContext: function(){
        return this._selectorBean._mainSelector.getContext();
    },

    getDefaultValue: function(){
        return this._selectorOpts ? this._selectorOpts.defaultValue : undefined;
    },

    getInstance: function(opts){
        if(!opts){
            opts = {};
        }

        if(this._selectorPrototype){
            return new this._selectorPrototype({
                key: opts.key,
                selector: opts.selector,
                schemePath: opts.schemePath
            });
        } else {
            return new this._selectorBean._selectorPrototype({
                key: opts.key,
                selector: opts.selector,
                schemePath: opts.schemePath
            });
        }
    },

    getKey: function(){
        return this._key;
    },

    getLinkedFieldsByKey: function(key){
        return this.getMainSelector().getLinkedFieldsByKey(key);
    },

    getLinkToSelector: function(){
        if(this._selectorOpts.linkTo){
            return this.getMainSelector().find(this._selectorOpts.linkTo);
        }
    },

    getMainSelector: function(){
        return this._selectorBean ? this._selectorBean._mainSelector : this._mainSelector;
    },

    getRenderByName: function(name){
        return this.getMainSelector().getRenderByName(name);
    },

    getRenderName: function(){
        return this._selectorOpts ? this._selectorOpts.render : undefined;
    },

    setChecked: function(b){
        this._selectorOpts.checked = b;
    },

    removeAllValues: function(){
        this._values = [];
    },

    removeValue: function(){
        //
    },

    removeValues: function(){
        //
    },

    setName: function(name){
        this._selectorOpts.name = name;
    },

    setValue: function(val){
        this._values[0].value = val;
    },

    setValues: function(values){
        if(!JSB.isArray(values)){
            values = [values];
        }

        for(var i = 0; i < values.length; i++){
            this._values[i].value = values[i];
        }
    },

    value: function(){
        if(!this._values || !this._values[0]){
            return;
        }

        if(this._selectorOpts && this._selectorOpts.valueType){
            var value;

            switch(this._selectorOpts.valueType){
                case 'number':
                    value = Number(this._values[0].value);

                    if(isNaN(value) || typeof this._values[0].value === 'string' && this._values[0].value.length === 0 || !JSB.isDefined(this._values[0].value)){
                        value = JSB.isDefined(this._selectorOpts.defaultValue) ? this._selectorOpts.defaultValue : undefined;
                    }
                    break;
                case 'string':
                default:
                    value = this._values[0].value;

                    if(!JSB.isDefined(value)){
                        value = JSB.isDefined(this._selectorOpts.defaultValue) ? this._selectorOpts.defaultValue : undefined;
                        break;
                    }

                    if(typeof value === 'string' && value.length === 0){
                        value = JSB.isDefined(this._selectorOpts.defaultValue) ? this._selectorOpts.defaultValue : '';
                    }
            }

            return value;
        }

        return this._values[0].value;
    },

    values: function(){
        if(!this._values || !this._values[0]){
            return;
        }

        var valArr = [];

        for(var i = 0; i < this._values.length; i++){
            if(this._selectorOpts && this._selectorOpts.valueType){
                var value;

                switch(this._selectorOpts.valueType){
                    case 'number':
                        value = Number(this._values[i].value);

                        if(isNaN(value)){
                            value = JSB.isDefined(this._selectorOpts.defaultValue) ? this._selectorOpts.defaultValue : undefined;
                        }
                        break;
                    case 'string':
                    default:
                        value = this._values[i].value;

                        if(!JSB.isDefined(value)){
                            value = JSB.isDefined(this._selectorOpts.defaultValue) ? this._selectorOpts.defaultValue : undefined;
                            break;
                        }

                        if(typeof value === 'string' && value.length === 0){
                            value = this._selectorOpts.defaultValue;
                        }
                }

                valArr.push(value);
            } else {
                valArr.push(this._values[i].value);
            }
        }

        return valArr;
    },

    updateValues: function(key, scheme, values, opts){
        var wasUpdated = false;

        if(!JSB.isDefined(values.checked)){
            values.checked = scheme.optional === 'checked';
            wasUpdated = true;
        }

        if(values.defaultValue !== scheme.defaultValue){
            values.defaultValue = scheme.defaultValue;
            wasUpdated = true;
        }

        if(values.render !== scheme.render){
            values.render = scheme.render;
            wasUpdated = true;
        }

        if(!JSB.isDefined(values.name) && scheme.editableName){
            values.name =  scheme.name;
            wasUpdated = true;
        }

        if(values.valueType !== scheme.valueType){
            values.valueType = scheme.valueType;
            wasUpdated = true;
        }

        if(!values.values){
            values.values = [];

            if(scheme.value){
                values.values[0] = {
                    value: scheme.value
                }
            }

            wasUpdated = true;
        }

        if(scheme.linkTo){
            if(!opts.linkedFields[scheme.linkTo]){
                opts.linkedFields[scheme.linkTo] = [];
                wasUpdated = true;
            }

            if(opts.linkedFields[scheme.linkTo].indexOf(key) < 0){
                opts.linkedFields[scheme.linkTo].push(key);
                wasUpdated = true;
            }
        }

        return wasUpdated;
    }
}