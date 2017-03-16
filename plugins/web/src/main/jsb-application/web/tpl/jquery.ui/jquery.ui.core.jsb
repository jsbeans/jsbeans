{
	$name:'JQuery.UI.Core',
	$require: ['JQuery'],
	$client:{
		$singleton: true,
		$bootstrap: function(){
			JSB().loadCss('tpl/jquery.ui/jquery-ui-core.min.css');
			
			(function(jQuery){
				`#include jquery-ui-core.min.js`;
			}).call(null, JSB().$);
			
		}
	}
}