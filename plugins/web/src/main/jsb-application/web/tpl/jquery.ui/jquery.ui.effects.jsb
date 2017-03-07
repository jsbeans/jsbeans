{
	name:'JQuery.UI.Effects',
	require: ['JQuery', 'JQuery.UI.Core'],
	client:{
		singleton: true,
		bootstrap: function(readyCallback){
			JSB().loadCss('tpl/jquery.ui/jquery-ui-effects.min.css');
			JSB().loadCss('tpl/jquery.ui/jquery.ui.loader.css');

			(function(jQuery){
				#include 'jquery-ui-effects.min.js';
				#include 'jquery.ui.loader.js';
			}).call(null, JSB().$);
			
		}
	}
}