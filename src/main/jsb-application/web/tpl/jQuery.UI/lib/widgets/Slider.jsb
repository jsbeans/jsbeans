{
	$name: 'jQuery.UI.JS.Slider',
	$client:{
		$singleton: true,
		$require: ['JQuery',
		           'jQuery.UI.JS.Widget'],

		$bootstrap: function() {
			(function(jQuery){
				jQuery.ui = jQuery.ui || {};

				`#include 'slider.js'`;
			}).call(null, JSB().$);
		}
	}
}