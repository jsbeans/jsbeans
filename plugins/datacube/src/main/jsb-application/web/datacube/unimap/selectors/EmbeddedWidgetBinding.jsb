{
    $name: 'Datacube.Selectors.EmbeddedWidgetBinding',
    $parent: 'Unimap.Selectors.Basic',

    $alias: 'embeddedWidget',

    isValueSkipping: function(){
        return this._selectorOpts.valueSkipping;
    },

    extractWidgetScheme: function(wName){
        var scheme = {},
            curWidgetJsb = JSB.get(wName),
            schemesArray = [];

        while(curWidgetJsb){
            if(!curWidgetJsb.isSubclassOf('DataCube.Widgets.Widget')){
                break;
            }
            var wScheme = curWidgetJsb.getDescriptor().$scheme;
            if(wScheme && Object.keys(wScheme).length > 0){
                schemesArray.push(wScheme);
            }
            curWidgetJsb = curWidgetJsb.getParent();
        }

        for(var i = schemesArray.length - 1; i > -1; i--){
            JSB.merge(true, scheme, schemesArray[i]);
        }

        return scheme;
    },

    findRendersByName: function(name, arr, values){
        if(!arr){
            arr = [];
        }

        if(!values){
            values = this._values;
        }

        if(values && values[0]){
            this.getMainSelector().findRendersByName(name, arr, values[0].value);
        }

        return arr;
    },

    getFullValues: function(){
        return {
            values: this._values[0].value,
            linkedFields: this._values[0].linkedFields
        }
    },

    getWidgetBean: function(){
        if(!this._values[0].binding){
            return;
        }

        return this._values[0].binding.jsb;
    },

    getWidgetName: function(){
        if(!this._values[0].binding){
            return;
        }

        return this._values[0].binding.name;
    },

    value: function(){
        if(!this._values){
            return;
        }

        return this.values();
    },

    values: function(){
        if(!this._values){
            return;
        }

        return this._values[0].value;
    },

    updateValues: function(key, scheme, values, opts){
        var wasUpdated = $base(key, scheme, values, opts);

        if(!JSB.isDefined(values.valueSkipping)){
            values.valueSkipping = true;
        }

        for(var i = 0; i < values.values.length; i++){
            if(!values.values[i].binding){
                continue;
            }

            var wScheme = this.extractWidgetScheme(values.values[i].binding.jsb);
            wasUpdated = this.getMainSelector().updateValues(wScheme, {values: values.values[i].value, linkedFields: values.values[i].linkedFields}) || wasUpdated;
        }


        return wasUpdated;
    }
}