{
	$name: 'DataCube.Query.QueryEditor',
	$parent: 'DataCube.Query.SchemeEditor',
	
	$client: {
		$constructor: function(opts){
			$base(JSB.merge({}, opts, {
				schemeEntry: '$query',
				elements: {
					
				}
			}));
		}
	},
	
	$server: {
		
	}
}