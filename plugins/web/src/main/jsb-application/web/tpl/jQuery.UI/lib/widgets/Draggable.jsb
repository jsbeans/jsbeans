{
	$name: 'jQuery.UI.JS.Draggable',
	$client:{
		$singleton: true,
		$require: ['JQuery',
		           'jQuery.UI.JS.Widget',
		           'jQuery.UI.JS.Plugin'],

		$bootstrap: function(){
			(function(jQuery){
				jQuery.ui = jQuery.ui || {};

				`#include 'draggable.js'`;
			}).call(null, JSB().$);
		}
	}
}