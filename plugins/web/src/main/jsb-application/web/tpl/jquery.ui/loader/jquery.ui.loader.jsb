{
	$name:'JQuery.UI.Loader',
	$require: ['JQuery.UI.Core'],
	$client:{
		$singleton: true,
		$bootstrap: function(){
			JSB().loadCss('tpl/jquery.ui/loader/jquery.ui.loader.css');

			
			(function(jQuery){
				`#include 'jquery.ui.loader.js'`;
			}).call(null, JSB().$);
			
		}
	}
}