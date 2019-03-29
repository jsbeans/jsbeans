{
	$name: 'jQuery.UI.JS.Widget',
	$client:{
		$singleton: true,
		$require: ['JQuery'],

		$bootstrap: function(){
			(function(jQuery){
				`#include 'widget.js'`;
			}).call(null, JSB().$);
		}
	}
}