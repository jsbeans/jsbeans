{
	$name: 'DataCube.Controls.FilterEntry',
	$parent: 'JSB.Widgets.Control',
	$require: 'JSB.Widgets.ToolManager',
	
	$client: {
		searchField: null,
		
		$constructor: function(searchField, opts){
			$base(opts);
			this.searchField = searchField;
			this.loadCss('FilterEntry.css');
			this.addClass('filterEntry');
			
			
			
		},
		

	}
}