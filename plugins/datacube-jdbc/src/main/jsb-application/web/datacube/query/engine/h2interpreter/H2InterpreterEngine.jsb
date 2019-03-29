{
	$name: 'DataCube.Query.Engine.H2Interpreter.H2InterpreterEngine',
	$parent: 'DataCube.Query.Engine.Engine',

	$singleton: true,

	$server: {
		$require: [
            'JSB.Store.StoreManager',
		    'DataCube.Query.Engine.SQL.SQLTranslator',
		    'DataCube.Query.Engine.H2Interpreter.H2InterpreterLoopbackProvider',
		    'DataCube.Query.QueryUtils',
		    'JSB.Store.Sql.JDBC',
        ],

		acceptable: function(name, executor, queryTask) {
            return true;
		},

		execute: function(name, executor, queryTask){
//debugger;
		    var query = queryTask.query;
		    var cube = queryTask.cube;
		    var params = queryTask.params;
		    var config = $this.getLocalConfig(name);

		    var providers = QueryUtils.extractProviders(query, cube);
            providers = [$this._getSystemStoreProvider()].concat(providers);
            var translator = new SQLTranslator(providers, cube, executor);
            translator.vendor = 'H2';
            translator.interpreterMode = true;
            translator.engineConfig = config;
            translator.remoteQuery = new H2InterpreterLoopbackProvider(cube);
            return translator.translatedQueryIterator(query, params);
		},

		_getSystemStoreProvider: function(){
		    var store = StoreManager.getStore({
                name: 'system',
                type: 'JSB.Store.Sql.SQLStore',
                url: 'jdbc:h2:mem:system.db;DB_CLOSE_DELAY=-1',
            });;
            store.asSQL().connectedJDBC(function(connection){
                return JDBC.executeUpdate(connection, 'DROP ALIAS IF EXISTS DATACUBE; CREATE ALIAS datacube DETERMINISTIC FOR "org.jsbeans.datacube.LoopbackProviderIterator.datacube"; ');
            });
		    return {
		        getStore: function() {
		            return store;
                },
            };
		}
	}
}