{
    $name: 'Unimap.ValueSelectors.Group',
    $parent: 'Unimap.ValueSelectors.Basic',

    find: function(key){
        for(var i = 0; i < this._values.length; i++){
            var res = $base(key, this._values[i]);
            if(res){
                return res;
            }
        }
    },

    value: function(){
        return this.getInstance(undefined, this._values[0].values);
    },

    values: function(){
        var itemsArr = [];

        for(var i = 0; i < this._values.length; i++){
            itemsArr.push(this.getRenderByName().getInstance(null, { values: this._values[i] }));
        }

        return itemsArr;
    }
}