{
    $name: 'Datacube.ValueSelectors.SourceSelector',
    $parent: 'Unimap.ValueSelectors.Basic',

    binding: function(){
        // todo
    },

    hasBinding: function(){
        return JSB.isDefined(this._values.values[0].binding);
    },

    next: function(){
        var item = this._values.values[0];

        if(!JSB.isDefined(item.cursor)){
            item.cursor = 0;
        }

        if(!item.data || (item.cursor > 0 && !JSB.isArray(item.data))){
            return false;
        }

        var dataEl = null;

        if(JSB.isArray(item.data)){
            if(item.cursor >= item.data.length){
                return false;
            }

            dataEl = item.data[item.cursor++];
        } else {
            dataEl = item.data;
            item.cursor++;
        }

        // fill values
        if(!this._linkedValues){
            this._linkedValues = [];

            var linkedKeys = this.getLinkedFieldsByKey(this.getKey());

            for(var i = 0; i < linkedKeys.length; i++){
                this._linkedValues.push(this.find(linkedKeys[i]));
            }
        }

        for(var i = 0; i < this._linkedValues.length; i++){
            this._linkedValues[i].setValue();   // todo
        }

        return true;
    }
}