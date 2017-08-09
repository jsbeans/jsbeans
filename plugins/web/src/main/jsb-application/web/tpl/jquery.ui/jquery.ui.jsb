{
	$name:'JQuery.UI',
	$require: ['JQuery'],
	$client:{
		$singleton: true,
		$bootstrap: function(){
			JSB().loadCss('tpl/jquery.ui/jquery-ui.min.css');
			
			(function(jQuery){
				`#include 'jquery-ui.js'`;
				`#include 'jquery.ui.loader.js'`;
			}).call(null, JSB().$);
			
		}
	}
}