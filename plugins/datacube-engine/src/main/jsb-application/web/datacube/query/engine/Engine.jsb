{
	$name: 'DataCube.Query.Engine.Engine',

	$server: {
		$require: [
		    'DataCube.Query.QueryUtils',
        ],

		execute: function(alias, executor, queryDescriptor){
            throw 'interface method not implemented';
		},

		getLocalConfig: function(name) {
		    var engine = Config.get('datacube.query.engines.' + name);
		    QueryUtils.throwError(engine, 'Undefined config for engine "{}"', name);
		    return engine;
		},
	}
}