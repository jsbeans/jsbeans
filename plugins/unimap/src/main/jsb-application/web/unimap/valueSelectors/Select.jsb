{
    $name: 'Unimap.ValueSelectors.Select',
    $parent: 'Unimap.ValueSelectors.Basic',

    find: function(key){
        for(var i = 0; i < this._values.values.length; i++){
            var res = $base(key, this._values.values[i].items);
            if(res){
                return res;
            }
        }
    }
}