/** DataCube - jsBeans extension | jsbeans.org (MIT Licence) | (c) Special Information Systems, LLC */

{
	$name: 'DataCube.Query.Engine.Mongo.MongoTranslatorInterpreter',
	$parent: 'DataCube.Query.Engine.Interpreter',

	$singleton: true,

	$server: {
		$require: [
		    'JSB.Store.Mongodb.MongodbStore',
		    'DataCube.Query.Engine.Mongo.MongodbAggregateTranslator',
		    'DataCube.Query.QueryUtils',
        ],

		acceptable: function(name, executor, queryTask){
		    var query = queryTask.query;
		    var cube = queryTask.cube;
		    var config = $this.getLocalConfig(name);
		    var providers = queryTask.providers || QueryUtils.extractProviders(query, cube);

		    // all - mongo
		    if (providers.length == 0) {
		        return false;
		    }
            for(var  i = 0; i < providers.length; i++) {
                if(!(providers[i].getStore() instanceof MongodbStore)){
                    return false;
                }
            }
            return true;
		},

		execute: function(name, executor, queryTask){
		    var cube = queryTask.cube;
		    var params = queryTask.params;
		    var query = queryTask.query;
		    var config = $this.getLocalConfig(name);
		    var providers = queryTask.providers || QueryUtils.extractProviders(query, cube);

		    // all - mongo
		    if (providers.length == 0) {
		        return null;
		    }
            for(var  i = 0; i < providers.length; i++) {
                if(!(providers[i].getStore() instanceof MongodbStore)){
                    return null;
                }
            }
            var translator = new MongodbAggregateTranslator(providers, cube, executor);
            return translator.translatedQueryIterator(query, params);
		},
	}
}