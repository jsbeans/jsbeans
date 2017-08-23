{
	$name: 'DataCube.Materializer',
	
	$server: {
		engine: null,
		source: null,
		
		$constructor: function(engine, source){
			this.engine = engine;
			this.source = source;
		},
		
		createTable: function(tName, fields){},
		
		createIndex: function(tName, idxName, idxFields){},
		
		insert: function(tName, obj){}
	}
}