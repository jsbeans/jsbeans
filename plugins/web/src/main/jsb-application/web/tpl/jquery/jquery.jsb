/*
{
	$name:'JQuery',
	$client:{
		$singleton: true,

		$scopeRegister: function(){
		    // todo: add $ in scope like $this
		},

		$bootstrap: function(readyCallback){
		    // contains JSBjQuery
			`#include 'jquery-jsb-3.3.1.js'`;

			JSB().addLibraryScope('$', JSBjQuery);

			// override global variable to bind all plugins to JSB().$
			var jQuery = JSB().$;

			(function(jQuery){
				`#include 'jquery.resize.js'`;
				`#include 'jquery.visible.js'`;
				`#include 'jquery.mousewheel.js'`;
				`#include 'jquery.cookie.js'`;
			}).call(null, JSB().$);
		}
	}
}
*/
{
	$name:'JQuery',
	$client:{
		$singleton: true,

		$bootstrap: function(readyCallback){
			//`#include 'jquery-3.3.1.js'`;
			`#include 'jquery-jsb-3.3.1.js'`;

			//JSB().addLibraryScope('$', window.jQuery.noConflict());
			JSB().addLibraryScope('$', JSBjQuery.noConflict());

			// override global variable to bind all plugins to JSB().$
			var jQuery = JSB().$;

			(function(jQuery){
				`#include 'jquery.resize.js'`;
				`#include 'jquery.visible.js'`;
				`#include 'jquery.mousewheel.js'`;
				`#include 'jquery.cookie.js'`;
			}).call(null, JSB().$);
		}
	}
}