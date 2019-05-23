/** DataCube - jsBeans extension | jsbeans.org (MIT Licence) | (c) Special Information Systems, LLC */

{
	$name: 'DataCube.Query.Engine.Interpreter',

	$server: {
		$require: [
		    'DataCube.Query.QueryUtils',
        ],

		acceptable: function(name, executor, queryTask){
		    return true;
		},

		execute: function(alias, executor, queryTask){
            throw 'interface method not implemented';
		},

		getLocalConfig: function(name) {
		    var engine = Config.get('datacube.query.engine.interpreters.' + name);
		    QueryUtils.throwError(engine, 'Undefined config for engine "{}"', name);
		    return engine;
		},
	}
}