{
	$name: 'jQuery.UI.JS.Resizable',
	$client:{
		$singleton: true,
		$require: ['JQuery',
		           'jQuery.UI.JS.Widget'],

		$bootstrap: function(){
			(function(jQuery){
				jQuery.ui = jQuery.ui || {};

				`#include 'resizable.js'`;
			}).call(null, JSB().$);
		}
	}
}