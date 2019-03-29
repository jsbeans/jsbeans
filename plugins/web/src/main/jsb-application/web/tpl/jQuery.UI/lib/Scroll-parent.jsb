{
	$name: 'jQuery.UI.JS.ScrollParent',
	$client:{
		$singleton: true,
		$require: ['JQuery'],

		$bootstrap: function(){
			(function(jQuery){
				`#include 'scroll-parent.js'`;
			}).call(null, JSB().$);
		}
	}
}