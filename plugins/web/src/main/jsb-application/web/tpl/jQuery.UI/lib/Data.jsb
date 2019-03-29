{
	$name: 'jQuery.UI.JS.Data',
	$client:{
		$singleton: true,
		$require: ['JQuery'],

		$bootstrap: function(){
			(function(jQuery){
				`#include 'data.js'`;
			}).call(null, JSB().$);
		}
	}
}