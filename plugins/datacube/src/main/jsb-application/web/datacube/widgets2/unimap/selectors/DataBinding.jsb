{
    $name: 'Datacube.ValueSelectors.DataBindingSelector',
    $parent: 'Unimap.ValueSelectors.Basic',

    value: function(layer){
        layer = layer || 'main';

        return this._values[0].value[layer];
    },

    values: function(layer){
        layer = layer || 'main';
        var valArr = [];

        for(var i = 0; i < this._values.length; i++){
            valArr.push(this._values[i].value[layer]);
        }

        return valArr;
    }
}