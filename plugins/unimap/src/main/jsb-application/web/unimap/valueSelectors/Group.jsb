{
    $name: 'Unimap.ValueSelectors.Group',
    $parent: 'Unimap.ValueSelectors.Basic',

    find: function(key, values){
        var main = false;
        if(!values){
            main = true;
            values = this._values;
        }

        for(var i = 0; i < values.length; i++){
            var res = this.getMainSelector().find(key, values[i]);
            if(res){
                return res;
            }
        }

        if(main){
            return this.getRenderByName().getInstance();
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