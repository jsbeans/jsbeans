JSB({
	name:'JQuery.UI.Core',
	require: ['JQuery'],
	client:{
		bootstrap: function(){
			JSO().loadCss('tpl/jquery.ui/jquery-ui-core.min.css');
			
			(function(jQuery){
				#include 'jquery-ui-core.min.js';
			}).call(null, JSO().$);
			
		}
	}
});