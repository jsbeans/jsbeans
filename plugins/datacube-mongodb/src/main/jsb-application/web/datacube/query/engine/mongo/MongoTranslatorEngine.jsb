{
	$name: 'DataCube.Query.Engine.Mongo.MongoTranslatorEngine',
	$parent: 'DataCube.Query.Engine.Engine',

	$singleton: true,

	$server: {
		$require: [
		    'JSB.Store.Mongodb.MongodbStore',
		    'DataCube.Query.Engine.Mongo.MongodbAggregateTranslator',
		    'DataCube.Query.QueryUtils',
        ],

		execute: function(name, executor, queryTask){
		    var cube = queryTask.cube;
		    var params = queryTask.params;
		    var query = queryTask.query;
		    var config = $this.getLocalConfig(name);

		    var providers = QueryUtils.extractProviders(query, cube);
		    // all - mongo
		    if (providers.length == 0) {
		        return null;
		    }
            for(var  i = 0; i < providers.length; i++) {
                if(!(providers[i].getStore() instanceof MongodbStore)){
                    return null;
                }
            }
            var translator = new MongodbAggregateTranslator(providers, cube);
            return translator.translatedQueryIterator(query, params);
		},
	}
}