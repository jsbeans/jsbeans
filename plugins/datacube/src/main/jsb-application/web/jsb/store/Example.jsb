({
	$name: 'JSB.Store.Example',
	$singleton: true,

	$server: {
		$require: [
		    'JSB.Store.StoreManager',
		    'JSB.Store.Sql.SQLSchemaInspector'
		],

		$constructor: function(){
			$base();
		},

		example: function() {
debugger;
//		    var store = StoreManager.getStore('MySQLStore'); // DataStore with auto managed connections
		    var store = StoreManager.getStore({
                name: 'pdb',
                type: 'JSB.Store.Sql.SQLStore',
		        url: 'jdbc:postgresql://172.16.2.1:5432/passportdb',
		        properties: {
                    user: 'postgres',
                    password: 'p05tgre5',
		        }
		    });

            var schema = store.extractSchema();
//		    var sqldb = store.asSQL(); // SQL
//            var schemas = sqldb.connectedJDBC(function(conn){
//                var SQLSchemaInspector = JSB.get('JSB.Store.Sql.SQLSchemaInspector').getClass();
//                return new SQLSchemaInspector().extractSchemas(conn);
//            });

            try {
                var mosqldb = store.asMoSQL(); // mongo-sql Json to SQL
//
                var iterator = mosqldb.iteratedParametrizedQuery({
                      type: 'select'
                    , table: 'artefact'
                    , columns: ['id', 'description', 'length']
                    , where: {
                        $or: {
                            $notNull: {id: true}
                        }
                    }
                    , limit: 100
                }, {
                    id: 123
                });
                iterator.next();
                iterator.close();

            } finally {
                db.close();
            }
		}

	}
})