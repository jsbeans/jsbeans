{
    $name: 'Datacube.Selectors.JoinFilterSelector',
    $parent: 'Unimap.Selectors.Basic',

    $alias: 'joinFilter',

    value: function(){
        if(!this._values || !this._values[0]){
            return JSB.isDefined(this._selectorOpts.defaultValue) ? this._selectorOpts.defaultValue : undefined;
        }

        return this._values[0];
    },

    values: function(){
        return this._values;
    }
}