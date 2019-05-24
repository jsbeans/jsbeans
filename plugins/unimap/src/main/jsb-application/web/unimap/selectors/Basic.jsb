/*
 * This file is the part of jsBeans, high-level JavaScript client-server framework.
 * The contents of this file are subject to the MIT License (MIT).
 * (c) aa@sis.ru, da@sis.ru, Special Information Systems, LLC, 2011-2019
 *
 * Настоящий файл является частью клиент-сервеной JavaScript платформы.
 * Условия использования и распространения содержимого данного файла соответствуют программному обеспечению с открытыми исходными кодами и равнозначно MIT License (MIT).
 * Авторские права принадлежат aa@sis.ru, da@sis.ru, ООО СИС, 2011-2019гг.
 */

{
    $name: 'Unimap.Selectors.Basic',
    $require: ['Unimap.Repository'],

    $alias: 'basic',

    _excludeMethods: ['$', '$constructor', '$parent'],

    $constructor: function(opts){
        if(!opts){
            opts = {};
        }

        this._mainSelector = opts.mainSelector;

        this.Selector = function(opts){
            this._selectorBean = $this;
            this._key = opts.key;
            this._selectorOpts = opts.selector;
            this._schemePath = opts.schemePath;

            if(opts.selector && opts.selector.values){
                this._values = JSB.isArray(opts.selector.values) ? opts.selector.values : [opts.selector.values];
            }
        }
        
        this.Selector.prototype = $this;
/*        
        this.Selector.prototype = {
            addMultipleValue: this.addMultipleValue,
            checked: this.checked,
            getContext: this.getContext,
            getInstance: this.getInstance,
            getInternalId: this.getInternalId,
            getKey: this.getKey,
            getLinkedFieldsByKey: this.getLinkedFieldsByKey,
            getLinkToSelector: this.getLinkToSelector,
            getMainSelector: this.getMainSelector,
            getRenderByName: this.getRenderByName,
            getRenderName: this.getRenderName,
            removeValue: this.removeValue,
            removeAllValues: this.removeAllValues,
            scheme: this.scheme,
            setName: this.setName,
            setFullValue: this.setFullValue,
            setValue: this.setValue,
            setValues: this.setValues,
            value: this.value,
            values: this.values
        };

        var methods = this.jsb.getMethods(false);

        for(var i = 0; i < methods.length; i++){
            if(this._excludeMethods.indexOf(methods[i]) < 0){
                this.Selector.prototype[methods[i]] = this[methods[i]];
            }
        }
*/        
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

    getInternalId: function(){
        return this._selectorOpts ? this._selectorOpts.id : undefined;
    },

    getInstance: function(opts){
        if(!opts){
            opts = {};
        }

        if(this.Selector){
            return new this.Selector({
                key: opts.key,
                selector: opts.selector,
                schemePath: opts.schemePath
            });
        } else {
            return new this._selectorBean.Selector({
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
    	if(!this._values){
    		return;
    	}
    	
        for(var i = this._values.length - 1; i > -1 ; i--){
        	this._values.splice(i, 1);
        }
    },

    removeValue: function(index){
    	if(!this._values){
    		return;
    	}

        if(index){
            if(this._values[index]){
                this._values.splice(index, 1);
            }
        } else {
            if(this._values[0]){
                this._values.splice(0, 1);
            }
        }
    },

    removeValues: function(){
        //
    },

    scheme: function(){
        if(this._schemePath){
            return this.getMainSelector().getScheme(this._schemePath);
        }
    },

    setName: function(name){
        this._selectorOpts.name = name;
    },
    
    getName: function(){
    	return this._selectorOpts.name || this.scheme().name;
    },

    setFullValue: function(val){
        this._values[0] = val;
    },

    setValue: function(val){    	
    	if(!this._values[0]){
    		this._values[0] = {};
    	}
    	
        this._values[0].value = val;
    },

    setValues: function(values){
        if(!JSB.isArray(values)){
            values = [values];
        }

        for(var i = 0; i < values.length; i++){
        	if(!this._values[i]){
        		this._values[i] = {};
        	}
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

        if(!JSB.isDefined(values.id)){
            values.id = JSB.generateUid();;
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
        
        if(!values.values || values.values.length === 0){
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

            values.linkTo = scheme.linkTo;
        }

        return wasUpdated;
    }
}