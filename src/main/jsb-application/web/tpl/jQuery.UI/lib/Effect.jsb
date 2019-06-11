{
	$name: 'jQuery.UI.JS.Effect',
	$client:{
		$singleton: true,
		$require: ['JQuery'],

		$bootstrap: function(){
			(function(jQuery){
				`#include 'effect.js'`;
			}).call(null, JSB().$);
		}
	}
}