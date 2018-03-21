{
	$name: 'Unimap.Render.AutocompleteGroup',
	$parent: 'Unimap.Render.Group',
	$client: {
	    changeLinkTo: function(values){
	        if(this._values.values.length > 0 || !this._scheme.linkedFields || !values.values[0].binding){ return; }

	        var fields = values.values[0].binding.arrayType.record,
	            keys = Object.keys(values.values[0].binding.arrayType.record),
	            k = 0,
	            addValues = [];

            while(k < keys.length){
                var f = true,
                    val = {};

                for(var i in this._scheme.linkedFields){
                    switch(this._scheme.linkedFields[i].type){
                        case 'any':
                            val[i] = [fields[keys[k]].field];
                            break;
                        default:
                            if(this._scheme.linkedFields[i].type == fields[keys[k]].type){
                                val[i] = [fields[keys[k]].field];
                            }
                    }

                    if(val[i] && !this._scheme.linkedFields[i].repeat){
                        k++;

                        if(k < keys.length){
                            break;
                        }
                    }
                }

                if(Object.keys(val).length === Object.keys(this._scheme.linkedFields).length){
                    addValues.push(val);
                }

                k++;
            }

            if(addValues.length > 0){
                for(var i = 0; i < addValues.length; i++){
                    this.addItem();
                }

                for(var i in this._scheme.linkedFields){
                    var renders = this.findRendersByKey(i);

                    for(var j = 0; j < renders.length; j++){
                        renders[j].setValues(addValues[j][i]);
                    }
                }
            }
	    }
	}
}