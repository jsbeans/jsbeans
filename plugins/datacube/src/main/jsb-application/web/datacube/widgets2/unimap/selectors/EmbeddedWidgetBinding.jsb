{
    $name: 'Datacube.ValueSelectors.EmbeddedWidgetBinding',
    $parent: 'Unimap.ValueSelectors.Basic',

    isValueSkipping: function(){
        return this._values.valueSkipping;
    },

    findRendersByName: function(name){
        return this.getMainSelector().findRendersByName(name, null, this._values[0].value);
    },

    getWidgetName: function(){
        return this._values[0].binding.jsb;
    },

    values: function(){
        return this._values[0].value;
    }
}