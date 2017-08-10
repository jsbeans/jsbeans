{
	$name:'JQuery.UI',
	$require: ['JQuery.UI.Core', 'JQuery.UI.Interactions', 'JQuery.UI.Effects'],
	$client:{
		$singleton: true,
		$bootstrap: function(){
			JSB().loadCss('tpl/jquery.ui/jquery-ui-widgets.min.css');
			
			(function(jQuery){
				`#include 'jquery-ui-widgets.min.js'`;
			}).call(null, JSB().$);
			
		}
	}
}