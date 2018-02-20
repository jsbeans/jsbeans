{
    $name: 'Unimap.ValueSelectors.Select',
    $parent: 'Unimap.ValueSelectors.Basic',

    createDefaultValues: function(key, scheme, values){
        $base(key, scheme, values);

        var val = Object.keys(scheme.items)[0];

        values.values[0] = {
            items: {},
            value: val
        };

        if(scheme.items[val].items){
            for(var i in scheme.items[val].items){
                values.values[0].items[i] = {};

                this.getMainSelector().getRenderByName(scheme.items[val].items[i].render).createDefaultValues(i, scheme.items[val].items[i], values.values[0].items[i]);
            }
        }
    },

    find: function(key, values, isFindAll){
        var main = false,
            resArr = [];

        if(!values){
            main = true;
            values = this._values;
        }

        for(var i = 0; i < values.length; i++){
            if(!values[i].items){
                continue;
            }

            var res = this.getMainSelector().find(key, values[i].items);
            if(res){
                if(isFindAll){
                    resArr.push(res);
                } else {
                    return res;
                }
            }
        }

        if(main && !isFindAll){
            return this.getRenderByName().getInstance();
        }

        if(resArr.length !== 0){
            return resArr;
        }
    },

    findAll: function(){
        var res = this.find(key, values, true);

        if(!JSB.isDefined(res)){
            return [];
        }

        return res;
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