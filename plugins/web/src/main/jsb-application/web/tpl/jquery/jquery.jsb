JSB({
	name:'JQuery',
	client:{
		singleton: true,
		bootstrap: function(readyCallback){
			
			#include 'jquery-1.11.3.min.js';
			
			JSB().addLibraryScope('$', window.jQuery.noConflict());
			
			// override global variable to bind all plugins to JSO().$
			var jQuery = JSB().$;

			(function(jQuery){
				#include 'jquery.resize.js';
				#include 'jquery.mousewheel.js';
				#include 'jquery.cookie.js';
			}).call(null, JSB().$);
			
		}
	}
});