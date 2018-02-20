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
            this._linkedValues = {};

            var linkedKeys = this.getLinkedFieldsByKey(this.getKey()),
                linkedValues = [];

            for(var i = 0; i < linkedKeys.length; i++){
                var selector = this._selectorBean._mainSelector.findAll(linkedKeys[i]);

                for(var j = 0; j < selector.length; j++){
                    if(selector[j].getRenderName() === 'dataBinding'){
                        linkedValues.push(selector[j]);
                    }
                }
            }

            for(var i = 0; i < linkedValues.length; i++){
                if(linkedValues[i]._values.length > 0 && linkedValues[i]._values[0].binding){ // todo: check slice id
                    if(!this._linkedValues[linkedValues[i]._values[0].binding]){
                        this._linkedValues[linkedValues[i]._values[0].binding] = [];
                    }

                    this._linkedValues[linkedValues[i]._values[0].binding].push(linkedValues[i]);
                }
            }
        }

        for(var i in this._linkedValues){
            for(var j = 0; j < this._linkedValues[i].length; j++){
                this._linkedValues[i][j].setValue(dataEl[i]);
            }
        }

        return true;
    },

    position: function(){
        if(!JSB.isDefined(this._values[0])){
            return;
        }

        return this._values[0].cursor;
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