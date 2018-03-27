{
    $name: 'Datacube.ValueSelectors.SourceSelector',
    $parent: 'Unimap.ValueSelectors.Basic',

    binding: function(){
        return this._values[0].binding;
    },

    data: function(){
        return this._values[0].binding.data;
    },

    isEmbeddedBinding: function(){
        return this._values[0].binding.embeddedBinding;
    },

    isReset: function(){
        var item = this._values[0].binding;

        return item.fetchOpts && item.fetchOpts.reset;
    },

    hasBinding: function(){
        return this._values[0] && JSB.isDefined(this._values[0].binding);
    },

    next: function(opts){
        if(!opts){
            opts = {};
        }

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
            // set data for embedded widgets
            if(opts.embeddedBindings){
                for(var i = 0; i < opts.embeddedBindings.length; i++){
                    opts.embeddedBindings[i].setBindingData(item.data[item.cursor], true);
                }
            }

            dataEl = item.data[item.cursor++];
        } else {
            dataEl = item.data;
            item.cursor++;
        }

        // fill values
        if(!this._linkedValues){
            var linkedKeys = this.getLinkedFieldsByKey(this.getKey()),
                linkedValues = [];

            for(var i = 0; i < linkedKeys.length; i++){
                var selector = this._selectorBean._mainSelector.findAll(linkedKeys[i]);

                for(var j = 0; j < selector.length; j++){
                    if(selector[j].getRenderName() === 'dataBinding' && selector[j]._values.length > 0 && selector[j].bindings(true).length > 0){
                        linkedValues.push(selector[j]);
                    }
                }
            }

            this._linkedValues = linkedValues;
        }

        for(var i = 0; i < this._linkedValues.length; i++){
            var values = [],
                bindings = this._linkedValues[i].bindings(true);

            for(var k = 0; k < bindings.length; k++){
                values.push(dataEl[bindings[k]]);
            }

            this._linkedValues[i].setValues(values);
        }

        return true;
    },

    position: function(){
        if(!JSB.isDefined(this._values[0]) || !JSB.isDefined(this._values[0].binding)){
            return;
        }

        return this._values[0].binding.cursor;
    },

    reset: function(){
        var item = this._values[0].binding;

        if(!item.fetchOpts){
            item.fetchOpts = {};
        }

        item.fetchOpts.reset = true;

        if(item.data){
            delete item.data;
        }

        if(item.cursor){
            delete item.cursor;
        }
    },

    setBindingData: function(data, embeddedBinding){
        this._values[0].binding.data = [data];
        this._values[0].binding.embeddedBinding = embeddedBinding;
    }
}