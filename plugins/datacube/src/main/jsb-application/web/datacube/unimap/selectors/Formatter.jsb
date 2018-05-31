{
    $name: 'Datacube.ValueSelectors.Formatter',
    $parent: 'Unimap.ValueSelectors.Basic',

    value: function(){
        if(JSB.isDefined(this._values.isAdvancedSettings) && this._values.isAdvancedSettings){
            return this._values[0].advancedValue;
        } else {
            return JSB.isDefined(this._values[0].baseValue) ? this._values[0].baseValue : this._values[0].value;
        }
    }
}