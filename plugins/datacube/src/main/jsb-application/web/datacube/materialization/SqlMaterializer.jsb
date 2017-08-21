{
	$name: 'DataCube.SqlMaterializer',
	$parent: 'DataCube.Materializer',
	
	$server: {
		$require: ['JSB.System.Config', 'JSB.Store.StoreManager', 'DataCube.MaterializationEngine'],
		
		$bootstrap: function(){
			MaterializationEngine.registerMaterializer('DataCube.Model.SqlSource', this);
		},
		
		$constructor: function(engine, source){
			$base(engine, source);
		}
	}
}