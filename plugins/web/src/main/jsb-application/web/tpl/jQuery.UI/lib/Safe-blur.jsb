{
	$name: 'jQuery.UI.JS.SafeBlur',
	$client:{
		$singleton: true,
		$require: ['JQuery'],

		$bootstrap: function(){
			(function(jQuery){
			    $.ui = $.ui || {};

				`#include 'safe-blur.js'`;
			}).call(null, JSB().$);
		}
	}
}