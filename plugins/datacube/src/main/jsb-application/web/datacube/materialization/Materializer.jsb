{
	$name: 'DataCube.Materializer',
	
	$server: {
		engine: null,
		source: null,
		
		$constructor: function(engine, source){
			this.engine = engine;
			this.source = source;
		}
	}
}