{
	$name: 'JSB.DataCube.Widgets.Widget',
	$parent: 'JSB.Widgets.Widget',
	$require: 'JSB.DataCube.Widgets.WidgetExplorer',
	
	$client: {
		wrapper: null,
		
		setWrapper: function(w){
			this.wrapper = w;
		},
		
		refresh: function(){}
	},
	
	$server: {}
}