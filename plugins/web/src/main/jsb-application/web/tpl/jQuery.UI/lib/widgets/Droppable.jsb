{
	$name: 'jQuery.UI.JS.Droppable',
	$client:{
		$singleton: true,
		$require: ['JQuery'],

		$bootstrap: function(){
			(function(jQuery){
			    $.ui = $.ui || {};

				`#include 'droppable.js'`;
			}).call(null, JSB().$);
		}
	}
}