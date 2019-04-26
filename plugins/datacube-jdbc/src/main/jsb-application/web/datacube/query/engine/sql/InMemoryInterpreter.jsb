{
	$name: 'DataCube.Query.Engine.SQL.InMemoryInterpreter',
	$parent: 'DataCube.Query.Engine.SQL.SQLInterpreter',

	$singleton: true,

	$server: {
		$require: [
            'JSB.Store.StoreManager',
		    'JSB.Store.Sql.JDBC',
		    'DataCube.Query.QueryUtils',
        ],

		getLocalConfig: function(name) {
		    var engine = Config.get('datacube.query.engine.interpreters.' + name);
		    QueryUtils.throwError(engine, 'Undefined config for engine "{}"', name);
		    return JSB.merge({}, engine, {
		        inMemory: true,
		        vendor: 'H2',
		    });
		},

		getInMemoryDataProvider: function(){
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