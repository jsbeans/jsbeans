{
    $name: 'Datacube.ValueSelectors.DataBindingSelector',
    $parent: 'Unimap.ValueSelectors.Basic',

    binding: function(){
        if(!this._values || this._values.length === 0){
            return;
        }

        return this._values[0].binding;
    },

    bindingType: function(){
        if(!this._values || this._values.length === 0){
            return;
        }

        return this._values[0].bindingType;
    },

    bindings: function(){
        var bindings = [];

        for(var i = 0; i < this._values.length; i++){
            bindings.push(this._values[i].binding);
        }

        return bindings;
    },

    getBindingName: function(){
        return this._values[0].binding;
    },

    value: function(layer){
        if(!this._values || this._values.length === 0){
            return;
        }

        if(typeof this._values[0].value === 'object'){
            layer = layer || 'main';
            return this._values[0].value[layer];
        }
        return this._values[0].value;
    },

    values: function(layer){
        if(!this._values || this._values.length === 0){
            return [];
        }

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