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
		var val = this.value();
		if(val && val.systemView){
			return val.view;
		}
	}
    
}