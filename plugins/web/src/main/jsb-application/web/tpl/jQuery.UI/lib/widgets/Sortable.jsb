{
	$name: 'jQuery.UI.JS.Sortable',
	$client:{
		$singleton: true,
		$require: ['JQuery'],

		$bootstrap: function(){
			(function(jQuery){
			    $.ui = $.ui || {};

				`#include 'sortable.js'`;
			}).call(null, JSB().$);
		}
	}
}