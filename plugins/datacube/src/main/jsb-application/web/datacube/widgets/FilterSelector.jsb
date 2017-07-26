{
	$name: 'JSB.DataCube.Widgets.FilterSelector',
	$parent: 'JSB.Widgets.Control',
	$require: [],
	
	$client: {
		$constructor: function(opts){
			$base(opts);
			this.loadCss('FilterSelector.css');
			this.addClass('filterSelector');
		}
	}
}