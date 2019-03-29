{
	$name: 'jQuery.UI.JS.Datepicker',
	$client:{
		$singleton: true,
		$require: ['JQuery'],

		$bootstrap: function(){
			(function(jQuery){
			    $.ui = $.ui || {};

				`#include 'datepicker.js'`;
			}).call(null, JSB().$);
		}
	}
}