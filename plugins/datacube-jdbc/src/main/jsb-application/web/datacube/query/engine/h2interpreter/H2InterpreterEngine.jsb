{
	$name: 'DataCube.Query.Engine.H2Interpreter.H2InterpreterEngine',
	$parent: 'DataCube.Query.Engine.Engine',

	$singleton: true,

	$server: {
		$require: [
            'JSB.Store.StoreManager',
		    'DataCube.Query.Engine.SQL.SQLTranslator',
		    'DataCube.Query.Engine.H2Interpreter.H2InterpreterRemoteQuery',
		    'DataCube.Query.QueryUtils',
		    'JSB.Store.Sql.JDBC',
        ],

		acceptable: function(name, executor, queryTask) {
            return true;
		},

		execute: function(name, executor, queryTask){
debugger;
		    var query = queryTask.query;
		    var cube = queryTask.cube;
		    var params = queryTask.params;
		    var config = $this.getLocalConfig(name);

		    var providers = QueryUtils.extractProviders(query, cube);
            providers = [$this._getSystemStoreProvider()].concat(providers);
            var translator = new SQLTranslator(providers, cube);
            translator.vendor = 'H2';
            translator.interpreterMode = true;
            translator.engineConfig = config;
            translator.remoteQuery = new H2InterpreterRemoteQuery(cube);
            return translator.translatedQueryIterator(query, params);
		},

		_getSystemStoreProvider: function(){
		    var store = StoreManager.getStore({
                name: 'system',
                type: 'JSB.Store.Sql.SQLStore',
                url: 'jdbc:h2:mem:system.db;DB_CLOSE_DELAY=-1',
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