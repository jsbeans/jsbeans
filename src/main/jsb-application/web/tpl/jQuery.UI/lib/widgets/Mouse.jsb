{
	$name: 'jQuery.UI.JS.Mouse',
	$client:{
		$singleton: true,
		$require: ['JQuery',
		           'jQuery.UI.JS.Widget'],

		$bootstrap: function(){
			(function(jQuery){
				jQuery.ui = jQuery.ui || {};

				`#include 'mouse.js'`;
			}).call(null, JSB().$);
		}
	}
}