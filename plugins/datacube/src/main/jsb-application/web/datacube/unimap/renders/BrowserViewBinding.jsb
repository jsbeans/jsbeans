{
	$name: 'Unimap.Render.BrowserViewBinding',
	$parent: 'Unimap.Render.EntryBinding',
	$require: ['css:BrowserViewBinding.css'],

	$alias: 'browserViewBinding',

	$client: {

	    construct: function(){
	        this.addClass('browserViewBindingRender');

	        $base();

	    },

	    addItem: function(values, itemIndex){
	    	if(values && values.value && values.value.systemView){
	    		// render system view
	    		this.addClass('system');
	    		this.append(this.$('<div class="type"></div>').text(values.value.view.viewType))
	    	} else {
	    		$base(values, itemIndex);
	    	}
	    }
	}
}