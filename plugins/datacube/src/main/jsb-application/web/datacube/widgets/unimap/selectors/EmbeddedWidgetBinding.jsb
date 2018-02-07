{
    $name: 'Datacube.ValueSelectors.EmbeddedWidgetBinding',
    $parent: 'Unimap.ValueSelectors.Basic',

    isValueSkipping: function(){
        return this._selectorOpts.valueSkipping;
    },

    findRendersByName: function(name){
        return this.getMainSelector().findRendersByName(name, null, this._values[0].value);
    },

    getFullValues: function(){
        return {
            values: this._values[0].value,
            linkedFields: this._values[0].linkedFields
        }
    },

    getWidgetName: function(){
        return this._values[0].binding.jsb;
    },

    value: function(){
        return this.values();
    },

    values: function(){
        return this._values[0].value;
    }
}