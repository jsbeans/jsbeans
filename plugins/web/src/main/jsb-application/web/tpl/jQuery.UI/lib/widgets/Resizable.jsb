{
	$name: 'jQuery.UI.JS.Resizable',
	$client:{
		$singleton: true,
		$require: ['JQuery'],

		$bootstrap: function(){
			(function(jQuery){
			    $.ui = $.ui || {};

				`#include 'resizable.js'`;
			}).call(null, JSB().$);
		}
	}
}