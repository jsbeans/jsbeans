{
    $name: 'Unimap.ValueSelectors.Group',
    $parent: 'Unimap.ValueSelectors.Basic',

    createDefaultValues: function(key, scheme, values){
        $base(key, scheme, values);

        if(scheme.multiple){
            return;
        }

        var val = {};
        values.values.push(val);

        for(var i in scheme.items){
            val[i] = {};

            this.getMainSelector().getRenderByName(scheme.items[i].render).createDefaultValues(i, scheme.items[i], val[i]);
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
            var res = this.getMainSelector().find(key, values[i]);
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
            this.getMainSelector().findRendersByName(name, arr, values[i]);
        }

        return arr;
    },

    value: function(){
        if(!this._values){
            return;
        }

        return this.getRenderByName(this.getRenderName()).getInstance(undefined, { values: this._values[0] });
    },

    values: function(){
        if(!this._values){
            return;
        }

        var itemsArr = [];

        for(var i = 0; i < this._values.length; i++){
            itemsArr.push(this.getRenderByName(this.getRenderName()).getInstance(undefined, { values: this._values[i] }));
        }

        return itemsArr;
    }
}