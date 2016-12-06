JSB({
	name:'JQuery.UI.Effects',
	require: ['JQuery', 'JQuery.UI.Core'],
	client:{
		bootstrap: function(readyCallback){
			JSO().loadCss('tpl/jquery.ui/jquery-ui-effects.min.css');
			JSO().loadCss('tpl/jquery.ui/jquery.ui.loader.css');

			(function(jQuery){
				#include 'jquery-ui-effects.min.js';
				#include 'jquery.ui.loader.js';
			}).call(null, JSO().$);
			
		}
	}
});