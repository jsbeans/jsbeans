{
	$name:'JQuery.UI.Effects',
	$require: ['JQuery.UI.Core'],
	$client:{
		$singleton: true,
		$bootstrap: function(readyCallback){
			JSB().loadCss('tpl/jquery.ui/jquery-ui-effects.min.css');

			(function(jQuery){
				`#include 'jquery-ui-effects.min.js'`;
				
			}).call(null, JSB().$);
			
		}
	}
}