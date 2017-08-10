{
	$name:'JQuery.UI.Resizable',
	$require: ['JQuery.UI'],
	$client:{
		$singleton: true,
		$bootstrap: function(){
			JSB().loadCss('tpl/jquery.ui/resizable/jquery-ui.min.css');
			JSB().loadCss('tpl/jquery.ui/resizable/jquery-ui.structure.min.css');
			JSB().loadCss('tpl/jquery.ui/resizable/jquery-ui.theme.min.css');

			(function(jQuery){
				`#include 'jquery-ui.min.js'`;
			}).call(null, JSB().$);
		}
	}
}