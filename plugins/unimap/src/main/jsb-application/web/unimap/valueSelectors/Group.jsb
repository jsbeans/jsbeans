{
    $name: 'Unimap.ValueSelectors.Group',
    $parent: 'Unimap.ValueSelectors.Basic',

    getItems: function(){
        var itemsArr = [];

        for(var i = 0; i < this._values.values.length; i++){
            itemsArr.push(this.getInstance(undefined, this._values.values[i]));
        }

        return itemsArr;
    },

    find: function(key){
        for(var i = 0; i < this._values.length; i++){
            var res = $base(key, this._values[i]);
            if(res){
                return res;
            }
        }
    }
}