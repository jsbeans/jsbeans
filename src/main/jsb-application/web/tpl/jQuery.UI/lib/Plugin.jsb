{
	$name: 'jQuery.UI.JS.Plugin',
	$client:{
		$singleton: true,
		$require: ['JQuery'],

		$bootstrap: function(){
			(function(jQuery){
				jQuery.ui = jQuery.ui || {};

				`#include 'plugin.js'`;
			}).call(null, JSB().$);
		}
	}
}