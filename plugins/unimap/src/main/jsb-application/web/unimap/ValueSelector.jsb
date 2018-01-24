{
    $name: 'Unimap.ValueSelector',
    $client: {
        $constructor: function(values){
            this._values = values;
        },

        _values: null,

        find: function(key){
            function find(values, key){
                for(var i in values){
                    if(i == key){
                        return new $this.class(values[i]);
                    }
                }

                for(var i in values){
                    var res = find(values[i].values, key);
                    if(res){
                        return res;
                    }
                }
            }

            return find(this._values, key);
        }
    }
}