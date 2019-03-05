{
    $name: 'Datacube.Selectors.BrowserViewBinding',
    $parent: 'Unimap.Selectors.Basic',

    $alias: 'browserViewBinding',
    
   	setSystemView: function(view){
		this.setValue({
			systemView: true,
			view: view
		});
	},
	
	getSystemView: function(){
		if(this.isSystemView()){
			return this.getView();
		}
	},
	
	isSystemView: function(){
		var val = this.value();
		return val && val.systemView;
	},
	
	getView: function(){
		var val = this.value();
		if(val && val.view){
			return val.view;
		}
	},
	
	getFullValues: function(){
        return {
            values: this._values[0].value,
            linkedFields: this._values[0].linkedFields
        }
    }
    
}