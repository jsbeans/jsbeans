{
	$name: 'DataCube.Query.Engine.SQLEngine',
	$parent: 'DataCube.Query.Engine.Engine',

	$singleton: true,

	$server: {
		$require: [
		    'JSB.Store.Sql.SQLStore',
		    'DataCube.Query.Translators.SQLTranslator',
		    'DataCube.Query.QueryUtils',
        ],

		execute: function(name, executor, queryDescriptor){
		    var query = queryDescriptor.query;
		    var cube = queryDescriptor.cube;
		    var params = queryDescriptor.params;
		    var config = $this.getLocalConfig(name);

		    var providers = QueryUtils.extractProviders(query, cube);
            for(var  i = 0; i < providers.length; i++) {
                if(providers[i].getStore() instanceof SQLStore
                        && config.vendor == providers[i].getStore().getVendor())
                {
                    // set vendor provider as first/main
                    providers = [providers[i]].concat(providers.splice(i,0));
                    var translator = new SQLTranslator(providers, cube);
                    translator.vendor = config.vendor;
                    return translator.translatedQueryIterator(query, params);
                }
            }
            return null; // has no compatible provider
		},
	}
}