{
	$name: 'jQuery.UI.JS.Droppable',
	$client:{
		$singleton: true,
		$require: ['JQuery',
		           'jQuery.UI.JS.Widget'],

		$bootstrap: function(){
			(function(jQuery){
				jQuery.ui = jQuery.ui || {};

				`#include 'droppable.js'`;
			}).call(null, JSB().$);
		}
	}
}