{
	$name: 'JSB.Widgets.MenuAction',
	$require: 'JSB.Widgets.MenuRegistry',
	
	execute: function(ctx){
		throw new Error('JSB.Widgets.MenuAction.execute method should be overriden');
	}
}