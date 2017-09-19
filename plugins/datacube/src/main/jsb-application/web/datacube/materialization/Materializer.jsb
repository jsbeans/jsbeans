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
		removeTable: function(tName){},
		renameTable: function(oldName, newName){},
		
		createIndex: function(tName, idxName, idxFields){},
		removeIndex: function(tName, idxName){},
		
		insert: function(tName, obj){}
	}
}