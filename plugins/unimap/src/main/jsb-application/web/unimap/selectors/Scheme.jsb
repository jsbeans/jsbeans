{
    $name: 'Unimap.Selectors.Scheme',
    $parent: 'Unimap.Selectors.Basic',

    $alias: 'scheme',
    
	getSchemeValues: function(){
        return {
            values: this._values[0].value,
            linkedFields: this._values[0].linkedFields
        }
    },
    
    setSchemeValues: function(values){
    	this._values[0].value = values.values,
    	this._values[0].linkedFields = values.linkedFields
    }
    
}