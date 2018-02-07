{
    $name: 'Datacube.ValueSelectors.DataBindingSelector',
    $parent: 'Unimap.ValueSelectors.Basic',

    getBindingName: function(){
        return this._values[0].binding;
    },

    value: function(layer){
        if(typeof this._values[0].value === 'object'){
            layer = layer || 'main';
            return this._values[0].value[layer];
        }
        return this._values[0].value;
    },

    values: function(layer){
        var valArr = [];

        if(typeof this._values[0].value === 'object'){
            layer = layer || 'main';

            for(var i = 0; i < this._values.length; i++){
                valArr.push(this._values[i].value[layer]);
            }
        } else {
            for(var i = 0; i < this._values.length; i++){
                valArr.push(this._values[i].value);
            }
        }

        return valArr;
    }
}