{
    $name: 'Datacube.ValueSelectors.SourceSelector',
    $parent: 'Unimap.ValueSelectors.Basic',

    binding: function(){
        return this._values[0].binding;
    },

    hasBinding: function(){
        return JSB.isDefined(this._values[0].binding);
    },

    next: function(){
        var item = this._values[0].binding;

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
            this._linkedValues = {};

            var linkedKeys = this.getLinkedFieldsByKey(this.getKey()),
                linkedValues = [];

            for(var i = 0; i < linkedKeys.length; i++){
                linkedValues.push(this._selectorBean._mainSelector.find(linkedKeys[i]));
            }

            for(var i = 0; i < linkedValues.length; i++){
                if(linkedValues[i]._values[0].binding){ // todo: check slice id
                    this._linkedValues[linkedValues[i]._values[0].binding] = linkedValues[i];
                }
            }
        }

        for(var i in this._linkedValues){
            this._linkedValues[i].setValue(dataEl[i]);
        }

        return true;
    }
}