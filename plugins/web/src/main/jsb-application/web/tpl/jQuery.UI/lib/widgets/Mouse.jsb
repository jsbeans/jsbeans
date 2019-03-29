{
	$name: 'jQuery.UI.JS.Mouse',
	$client:{
		$singleton: true,
		$require: ['JQuery'],

		$bootstrap: function(){
			(function(jQuery){
			    $.ui = $.ui || {};

				`#include 'mouse.js'`;
			}).call(null, JSB().$);
		}
	}
}