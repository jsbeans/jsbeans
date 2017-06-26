({
	$name: 'jsb.store.Example',
	$singleton: true,

	$server: {
		$require: [
		    'jsb.store.StoreManager',
		    'jsb.store.sql.SQLSchemaInspector'
		],

		$constructor: function(){
			$base();
		},

		example: function() {
debugger;
//		    var store = StoreManager.getStore('MySQLStore'); // DataStore with auto managed connections
		    var store = StoreManager.getStore({
                name: 'pdb',
                type: 'jsb.store.sql.SQLStore',
		        url: 'jdbc:postgresql://172.16.2.1:5432/passportdb',
		        properties: {
                    user: 'postgres',
                    password: 'p05tgre5',
		        }
		    });

            var schema = store.extractSchema();
//		    var sqldb = store.asSQL(); // SQL
//            var schemas = sqldb.connectedJDBC(function(conn){
//                var SQLSchemaInspector = JSB.get('jsb.store.sql.SQLSchemaInspector').getClass();
//                return new SQLSchemaInspector().extractSchemas(conn);
//            });

            try {
                var mosqldb = store.asMoSQL(); // mongo-sql Json to SQL
//
                mosqldb.parametrizedQuery({
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

            } finally {
                db.close();
            }
		}

	}
})