{
    $name: 'Datacube.ValueSelectors.Formatter',
    $parent: 'Unimap.ValueSelectors.Basic',

    value: function(){
        if(!this._values || !this._values[0]){
            return JSB.isDefined(this._selectorOpts.defaultValue) ? this._selectorOpts.defaultValue : undefined;
        }

        if(JSB.isDefined(this._values[0].isAdvancedSettings)){
            if(this._values[0].isAdvancedSettings){
                return this._values[0].advancedValue || (JSB.isDefined(this._selectorOpts.defaultValue) ? this._selectorOpts.defaultValue : undefined);
            } else {
                return this._values[0].baseValue || (JSB.isDefined(this._selectorOpts.defaultValue) ? this._selectorOpts.defaultValue : undefined);
            }
        } else {
            if(JSB.isDefined(this._values[0].baseValue)){
                return this._values[0].baseValue || (JSB.isDefined(this._selectorOpts.defaultValue) ? this._selectorOpts.defaultValue : undefined);
            }

            if(JSB.isDefined(this._values[0].advancedValue)){
                return this._values[0].advancedValue || (JSB.isDefined(this._selectorOpts.defaultValue) ? this._selectorOpts.defaultValue : undefined);
            }

            return this._values[0].value || (JSB.isDefined(this._selectorOpts.defaultValue) ? this._selectorOpts.defaultValue : undefined);
        }
    }
}