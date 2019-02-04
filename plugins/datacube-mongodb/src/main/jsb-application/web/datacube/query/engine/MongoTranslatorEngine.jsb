{
	$name: 'DataCube.Query.Engine.MongoTranslatorEngine',
	$parent: 'DataCube.Query.Engine.Engine',

	$singleton: true,

	$server: {
		$require: [
		    'JSB.Store.Mongodb.MongodbStore',
		    'DataCube.Query.Translators.MongodbAggregateTranslator',
		    'DataCube.Query.QueryUtils',
        ],

		execute: function(name, executor, queryDescriptor){
		    var cube = queryDescriptor.cube;
		    var params = queryDescriptor.params;
		    var query = queryDescriptor.query;
		    var config = $this.getLocalConfig(name);

		    var providers = QueryUtils.extractProviders(query, cube);
		    // all - mongo
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