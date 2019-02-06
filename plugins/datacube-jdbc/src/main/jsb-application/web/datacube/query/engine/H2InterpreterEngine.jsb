{
	$name: 'DataCube.Query.Engine.H2InterpreterEngine',
	$parent: 'DataCube.Query.Engine.Engine',

	$singleton: true,

	$server: {
		$require: [
            'JSB.Store.StoreManager',
		    'DataCube.Query.Translators.SQLTranslator',
		    'DataCube.Query.QueryUtils',
		    'JSB.Store.Sql.JDBC',
        ],

		execute: function(name, executor, queryDescriptor){
debugger;
		    var query = queryDescriptor.query;
		    var cube = queryDescriptor.cube;
		    var params = queryDescriptor.params;
		    var config = $this.getLocalConfig(name);

		    var providers = QueryUtils.extractProviders(query, cube);
            providers = [$this._getSystemStoreProvider()].concat(providers);
            var translator = new SQLTranslator(providers, cube);
            translator.vendor = 'H2';
            translator.interpreterMode = {
                remoteEngine: config.next
            };
            return translator.translatedQueryIterator(query, params);
		},

		_getSystemStoreProvider: function(){
		    var store = StoreManager.getStore({
                name: 'system',
                type: 'JSB.Store.Sql.SQLStore',
                url: 'jdbc:h2:' + '~/system.db'
            });;
            store.asSQL().connectedJDBC(function(connection){
                return JDBC.executeUpdate(connection, 'DROP ALIAS IF EXISTS DATACUBE; CREATE ALIAS datacube FOR "org.jsbeans.datacube.RemoteQueryIterator.datacube"; ');
            });
		    return {
		        getStore: function() {
		            return store;
                },
            };
		}
	}
}