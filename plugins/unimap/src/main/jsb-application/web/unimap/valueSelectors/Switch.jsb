{
    $name: 'Unimap.ValueSelectors.Switch',
    $parent: 'Unimap.ValueSelectors.Basic',

    find: function(key, values, isFindAll){
        var main = false,
            resArr = [];

        if(!values){
            main = true;
            values = this._values[0];
        }

        var res = this.getMainSelector().find(key, values);

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
            values = this._values[0];
        }

        this.getMainSelector().findRendersByName(name, arr, values);

        return arr;
    }
}