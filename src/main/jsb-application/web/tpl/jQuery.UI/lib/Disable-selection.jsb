{
	$name: 'jQuery.UI.JS.DisableSelection',
	$client:{
		$singleton: true,
		$require: ['JQuery'],

		$bootstrap: function(){
			(function(jQuery){
				`#include 'disable-selection.js'`;
			}).call(null, JSB().$);
		}
	}
}