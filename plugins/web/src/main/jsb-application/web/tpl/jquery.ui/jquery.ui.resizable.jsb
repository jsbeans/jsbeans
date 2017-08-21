{
	$name:'JQuery.UI.Resizable',
	$require: ['JQuery.UI'],
	$client:{
		$singleton: true,
		$bootstrap: function(){
			JSB().loadCss('tpl/jquery.ui/jquery-ui.min.css');
			JSB().loadCss('tpl/jquery.ui/jquery-ui.structure.min.css');
			JSB().loadCss('tpl/jquery.ui/jquery-ui.theme.min.css');

			(function(jQuery){
				`#include 'jquery-ui-core.min.js'`;
				`#include 'disable-selection.js'`;
			}).call(null, JSB().$);
		}
	}
}