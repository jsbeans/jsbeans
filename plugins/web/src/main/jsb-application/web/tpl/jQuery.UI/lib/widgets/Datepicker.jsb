{
	$name: 'jQuery.UI.JS.Datepicker',
	$client:{
		$singleton: true,
		$require: ['JQuery'],

		$bootstrap: function(){
			(function(jQuery){
				jQuery.ui = jQuery.ui || {};

				`#include 'datepicker.js'`;
			}).call(null, JSB().$);
		}
	}
}