{
	$name:'JQuery.UI.Interactions',
	$require: ['JQuery', 'JQuery.UI.Core'],
	$client:{
		$singleton: true,
		$bootstrap: function(){
			JSB().loadCss('tpl/jquery.ui/jquery-ui-int.min.css');

			(function(jQuery){
				`#include 'jquery-ui-int.min.js'`;
				`#include 'jquery.ui.touch-punch.min.js'`;
			}).call(null, JSB().$);
		}
	}
}