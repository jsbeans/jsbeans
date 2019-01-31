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
		    var engines = Config.get('datacube.query.engines');
		    for(var i = 0; i < engines.length; i++) {
		        var e = engines[i];
		        if (e.alias == name || e.jsb == name) {
		            return e;
		        }
		    }
		    QueryUtils.throwError(0, 'Undefined config for engine "{}"', name);
		},
	}
}