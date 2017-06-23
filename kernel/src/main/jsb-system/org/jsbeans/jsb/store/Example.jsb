({
	$name: 'jsb.store.Example',
	$singleton: true,

	$server: {
		$require: [
		    'jsb.store.StoreManager',
		],

		$constructor: function(){
			$base();
		},

		example: function() {
		    var store = StoreManager.getStore('MySQLStore'); // DataStore with auto managed connections
//		    var store = StoreManager.getStore({
//              name: '',
//		        url: '',
//		        properties: {
//                    user: '',
//                    password: '',
//		        }
//		    });

            try {
                var db = store.connect();

            } finally {
                if (db) db.close();
            }

//            // force disconnect store
//		    StoreManager.disconnect(store);
//
//		    // force update store connection
//		    StoreManager.connect(store);

		    var sqldb = store.asSQL(); // SQL
		    var mosqldb = store.asMoSQL(); // mongo-sql Json to SQL

		    mosqldb.execute({
                  type: 'select'
                , table: 'users'
                , columns: ['a', { type: 'sum' , name: 'i'}]
                , groupBy: ['a']
                , where: { $or: { id: '${id}', name: '${name}' }
                , limit: 100}
            });
		}

	}
})