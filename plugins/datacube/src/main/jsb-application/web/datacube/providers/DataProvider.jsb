{
	$name: 'JSB.DataCube.Providers.DataProvider',
	$fixedId: true,
	$sync: {
		updateCheckInterval: 0
	},
	
	entry: null,
	
	$server: {
		$disableRpcInstance: true,
		
		$constructor: function(entry){
			$base();
			this.entry = entry;
		}
	}
}