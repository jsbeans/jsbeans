{
    $name: 'Unimap.ValueSelectors.Switch',
    $parent: 'Unimap.ValueSelectors.Basic',

    createDefaultValues: function(key, scheme, values, opts){
        $base(key, scheme, values, opts);

        if(values.checked){
            values.values[0] = {
                items: {}
            }

            for(var i in scheme.items){
                values.values[0].items[i] = {};

                this.getMainSelector().getRenderByName(scheme.items[i].render).createDefaultValues(i, scheme.items[i], values.values[0].items[i], opts);
            }
        }
    },

    find: function(key, values, isFindAll){
        var main = false,
            resArr = [],
            res;

        if(values){
            if(values[0]){
                res = this.getMainSelector().find(key, values[0]);
            }
        } else {
            main = true;
            if(this._values && this._values[0]){
                res = this.getMainSelector().find(key, this._values[0]);
            }
        }

        if(res){
            return res;
        }

        if(main && !isFindAll){
            return this.getRenderByName().getInstance();
        }

        if(resArr.length !== 0){
            return resArr;
        }
    },

    findAll: function(){
        var res = this.find(key, null, true);

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
            values = this._values[0];
        }

        this.getMainSelector().findRendersByName(name, arr, values);

        return arr;
    },

    updateValues: function(key, scheme, values, opts){
        var wasUpdated = $base(key, scheme, values, opts);

        // todo

        return wasUpdated;
    }
}