{
	$name: 'Unimap.Render.AutocompleteGroup',
	$parent: 'Unimap.Render.Group',

	$alias: 'autocompleteGroup',
	$selector: 'Unimap.Selectors.Group',

	$client: {
	    changeLinkTo: function(values, render){
	        if(this._values.values.length > 0 || !this._scheme.linkedFields || !values.values[0].binding){
	            return;
            }

	        var fields = render.getFields(),
	            addValues = [],
	            index = 0,
	            val = {};

            while(index < fields.length){
                for(var j in this._scheme.linkedFields){
                    var next = false;

                    switch(this._scheme.linkedFields[j].type){
                        case 'any':
                            val[j] = fields[index];

                            if(!this._scheme.linkedFields[j].repeat){
                                next = true;
                            }
                            break;
                        case 'number':
                            if('integer' == fields[index].type || 'float' == fields[index].type || 'number' === fields[index].type){
                                val[j] = fields[index];

                                if(!this._scheme.linkedFields[j].repeat){
                                    next = true;
                                }
                            }
                            break;
                        default:
                            if(this._scheme.linkedFields[j].type == fields[index].type){
                                val[j] = fields[index];

                                if(!this._scheme.linkedFields[j].repeat){
                                    next = true;
                                }
                            }
                    }

                    if(next){
                        break;
                    }
                }

                index++;

                if(Object.keys(val).length === Object.keys(this._scheme.linkedFields).length){
                    for(var i in val){
                        val[i].used = true;
                    }

                    addValues.push(val);

                    val = {};
                }
            }

            if(addValues.length > 0){
                for(var i = 0; i < addValues.length; i++){
                    this.addItem();
                }

                for(var i in this._scheme.linkedFields){
                    var renders = this.findRendersByKey(i);

                    for(var j = 0; j < renders.length; j++){
                        renders[j].setValues([addValues[j][i].field]);
                    }
                }
            }
	    }
	}
}