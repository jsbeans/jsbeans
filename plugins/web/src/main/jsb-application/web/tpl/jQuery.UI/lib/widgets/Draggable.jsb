{
	$name: 'jQuery.UI.JS.Draggable',
	$client:{
		$singleton: true,
		$require: ['JQuery',
		           'jQuery.UI.JS.Plugin'],

		$bootstrap: function(){
			(function(jQuery){
			    $.ui = $.ui || {};

				`#include 'draggable.js'`;
			}).call(null, JSB().$);
		}
	}
}