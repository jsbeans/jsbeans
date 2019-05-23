/** DataCube - jsBeans extension | jsbeans.org (MIT Licence) | (c) Special Information Systems, LLC */

{
	$name: 'DataCube.WelcomeView',
	$parent: 'JSB.Workspace.BrowserView',
	
	$expose: {
		priority: 1,
		acceptNode: [null],
		acceptEntry: [null],
		caption: 'Главная'
	},
	
	$client: {
		$require: ['css:WelcomeView.css'],
		$constructor: function(opts){
			$base(opts);
			
			this.addClass('welcomeView');
			
		},
		
		refresh: function(){}
		
	}
	
}