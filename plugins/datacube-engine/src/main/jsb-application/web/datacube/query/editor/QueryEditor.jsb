{
	$name: 'DataCube.Query.QueryEditor',
	$parent: 'DataCube.Query.SchemeEditor',
	
	$client: {
		$constructor: function(opts){
			$base(JSB.merge({}, opts, {
				schemeName: '$query',
				expanded: true,
				elements: {
					
				}
			}));
		}
	},
	
	$server: {
		
	}
}