JSB({
	name:'JQuery.UI',
	require: ['JQuery'],
	client:{
		bootstrap: function(){
			JSO().loadCss('tpl/jquery.ui/jquery-ui.min.css');
			
			(function(jQuery){
				#include 'jquery-ui.min.js';
			}).call(null, JSO().$);
			
		}
	}
});