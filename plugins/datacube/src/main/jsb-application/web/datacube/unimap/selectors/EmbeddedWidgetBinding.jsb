{
    $name: 'Datacube.ValueSelectors.EmbeddedWidgetBinding',
    $parent: 'Unimap.ValueSelectors.Basic',

    isValueSkipping: function(){
        return this._selectorOpts.valueSkipping;
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
    }
}