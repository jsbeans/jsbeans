{
	$name: 'jQuery.UI.JS.SafeActiveElement',
	$client:{
		$singleton: true,
		$require: ['JQuery'],

		$bootstrap: function(){
			(function(jQuery){
				jQuery.ui = jQuery.ui || {};

				`#include 'safe-active-element.js'`;
			}).call(null, JSB().$);
		}
	}
}