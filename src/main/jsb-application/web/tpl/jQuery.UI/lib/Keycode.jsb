{
	$name: 'jQuery.UI.JS.Keycode',
	$client:{
		$singleton: true,
		$require: ['JQuery'],

		$bootstrap: function(){
			(function(jQuery){
				jQuery.ui = jQuery.ui || {};

				`#include 'keycode.js'`;
			}).call(null, JSB().$);
		}
	}
}