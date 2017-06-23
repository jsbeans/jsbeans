{
	$name: 'JSB.DataCube.Providers.JsonFileDataProvider',
	$parent: 'JSB.DataCube.Providers.InMemoryDataProvider',
	
	$server: {
		$require: 'JSB.DataCube.Providers.DataProviderRepository',
		
		$bootstrap: function(){
			DataProviderRepository.registerDataProvider(this, {
				accepts: 'JSB.DataCube.Model.JsonFile'
			});
		},
		
		$constructor: function(entry){
			$base(entry);
		}
	}
}