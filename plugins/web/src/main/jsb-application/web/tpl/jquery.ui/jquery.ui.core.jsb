{
	$name:'JQuery.UI.Core',
	$require: ['JQuery'],
	$client:{
		$singleton: true,
		$bootstrap: function(){
			JSB().loadCss('tpl/jquery.ui/jquery-ui-core.min.css');
			JSB().loadCss('tpl/jquery.ui/jquery-ui.structure.min.css');
			JSB().loadCss('tpl/jquery.ui/jquery-ui.theme.min.css');
			
			(function(jQuery){
				`#include 'jquery-ui-core.min.js'`;
			}).call(null, JSB().$);
			
		}
	}
}