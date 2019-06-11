{
	$name: 'jQuery.UI.JS.Sortable',
	$client:{
		$singleton: true,
		$require: ['JQuery',
		           'jQuery.UI.JS.Widget'],

		$bootstrap: function(){
			(function(jQuery){
				jQuery.ui = jQuery.ui || {};

				`#include 'sortable.js'`;
			}).call(null, JSB().$);
		}
	}
}