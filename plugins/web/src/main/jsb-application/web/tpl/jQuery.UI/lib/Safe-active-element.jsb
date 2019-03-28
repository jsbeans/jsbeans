{
	$name: 'jQuery.UI.JS.SafeActiveElement',
	$client:{
		$singleton: true,
		$require: ['JQuery'],

		$bootstrap: function(){
			(function(jQuery){
			    $.ui = $.ui || {};

				`#include 'safe-active-element.js'`;
			}).call(null, JSB().$);
		}
	}
}