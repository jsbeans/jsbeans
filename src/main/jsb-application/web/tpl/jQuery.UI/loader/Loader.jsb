{
	$name:'jQuery.UI.Loader',
	$client:{
		$singleton: true,
		$require: ['JQuery',
		           'css:jquery.ui.loader.css',
		           'jQuery.UI.JS.Widget'],

		$bootstrap: function(){
			(function(jQuery){
				`#include 'jquery.ui.loader.js'`;
			}).call(null, JSB().$);
		}
	}
}