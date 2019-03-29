{
	$name: 'jQuery.UI.JS.Keycode',
	$client:{
		$singleton: true,
		$require: ['JQuery'],

		$bootstrap: function(){
			(function(jQuery){
			    $.ui = $.ui || {};

				`#include 'keycode.js'`;
			}).call(null, JSB().$);
		}
	}
}