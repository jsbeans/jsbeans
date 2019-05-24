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
    $name: 'Unimap.Selector',
    $require: ['Unimap.Repository'],

    _idMap: {},
    _values: null,

    $client: {
        ensureInitialized: function(callback){
            this.ensureTrigger('_initialized', callback);
        }
    },

    $constructor: function(opts){
        opts = opts || {};

        opts.values = opts.values || {};
        opts.values.values = opts.values.values || {};
        opts.values.commonFields = opts.values.commonFields || {};
        opts.values.linkedFields = opts.values.linkedFields || {};

        this._scheme = opts.scheme;
        this._values = opts.values.values;
        this._commonFields = opts.values.commonFields;
        this._linkedFields = opts.values.linkedFields;
        this._context = opts.context;

        function updateValues(){
            if(opts.createDefaultValues && Object.keys($this._values).length === 0){
                var defValues = $this.createDefaultValues();

                $this._values = defValues.values;
                $this._linkedFields = defValues.linkedFields;
            }

            if(opts.updateValues){
                $this.updateValues();
            }
        }

        if(JSB.isClient()){
            Repository.ensureInitialized(function(){
                $this._selectors = Repository.createAllSelectors({
                    mainSelector: $this
                });

                updateValues();

                $this.setTrigger('_initialized');
            });
        } else {
            this._selectors = Repository.createAllSelectors({
                mainSelector: this
            });

            updateValues();
        }
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

    destroy: function(){
        for(var i in this._selectors){
            this._selectors[i].destroy();
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
            if(key.length > 0) {
                return res.find ? res.find(key, undefined, isFindAll, schemePath) : res;
            } else {
                return res;
            }
        } else {
            for(var i in values) {
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

    findByInternalId: function(id, values, schemePath){
        if(this._idMap[id]){
            return this._idMap[id];
        }

        var res;

        if(!values){
            values = this._values;
        }

        for(var i in values){
            if(values[i].id == id){
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

        if(res){
            this._idMap[id] = res;

            return res;
        } else {
            for(var i in values){
                var r = this.getRenderByName(values[i] && values[i].render),
                    res = r.findByInternalId ? r.findByInternalId(id, values[i].values, schemePath ? (schemePath + '.' + i) : i) : undefined;

                if(res){
                    this._idMap[id] = res;

                    return res;
                }
            }
        }
    },

    findRendersByName: function(name, arr, values, schemePath){
        if(!arr){
            arr = [];
        }

        if(!values){
            values = this._values;
        }

        for(var i in values){
            var r = this.getRenderByName(values[i].render),
                curPath = schemePath;

            if(JSB.isString(curPath)){
                if(curPath.length > 0){
                    curPath += '.' + i;
                } else {
                    curPath += i;
                }
            } else {
                curPath = i;
            }

            if(values[i].render === name){
                arr.push(r.getInstance({key: i, schemePath: curPath, selector: values[i]}));
            }

            r.findRendersByName && r.findRendersByName(name, arr, values[i].values, curPath);
        }

        return arr;
    },
    
    findByType: function(typeName, arr, values, schemePath){
    	if(!arr){
            arr = [];
        }

        if(!values){
            values = this._values;
        }

        for(var i in values){
            var r = this.getRenderByName(values[i].render),
                curPath = schemePath;

            if(JSB.isString(curPath)){
                if(curPath.length > 0){
                    curPath += '.' + i;
                } else {
                    curPath += i;
                }
            } else {
                curPath = i;
            }
            
            if(JSB.isInstanceOf(r, typeName)){
            	arr.push(r.getInstance({key: i, schemePath: curPath, selector: values[i]}));
            }
            r.findByType && r.findByType(typeName, arr, values[i], curPath);
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
        if(this._selectors[name]){
            return this._selectors[name];
        } else {
            return this._selectors['basic'];
        }
    },

    getScheme: function(schemePath){
        function findInObject(obj, str){
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

        if(schemePath && this._scheme){
            return findInObject(this._scheme, schemePath);
        }

        return this._scheme;
    },

    getValues: function(){
        return {
            commonFields: this._commonFields,
            linkedFields: this._linkedFields,
            values: this._values
        }
    },

    updateValues: function(scheme, fullValues){
        scheme = scheme || this._scheme;
        fullValues = fullValues || {
        	linkedFields: this._linkedFields,
        	values: this._values
        };

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