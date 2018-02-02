{
    $name: 'Unimap.ValueSelectors.Select',
    $parent: 'Unimap.ValueSelectors.Basic',

    find: function(key, values){
        if(!values){
            values = this._values;
        }

        for(var i = 0; i < values.length; i++){
            if(!values[i].items){
                continue;
            }

            var res = this.getMainSelector().find(key, values[i].items);
            if(res){
                return res;
            }
        }
    },

    findRendersByName: function(name, arr, values){
        if(!arr){
            arr = [];
        }

        if(!values){
            values = this._values;
        }

        for(var i = 0; i < values.length; i++){
            if(!values[i].items){
                continue;
            }

            this.getMainSelector().findRendersByName(name, arr, values[i].items);
        }

        return arr;
    }
}