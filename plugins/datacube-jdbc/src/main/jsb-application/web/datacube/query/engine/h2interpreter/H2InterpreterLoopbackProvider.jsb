/** DataCube - jsBeans extension | jsbeans.org (MIT Licence) | (c) Special Information Systems, LLC */

{
	$name: 'DataCube.Query.Engine.H2Interpreter.H2InterpreterLoopbackProvider',
	$parent: 'DataCube.Query.Engine.Loopback.LoopbackProvider',

	$server: {
		$require: [
		    'DataCube.Query.QueryUtils',
		    'DataCube.Query.Console',
		    'DataCube.Query.Query',
            'JSB.Store.Sql.JDBC',
		    'Datacube.Types.DataTypes',


		    'java:org.jsbeans.datacube.LoopbackProviderIterator',
            'java:org.jsbeans.datacube.SimpleResultSet',

            'java:org.h2.tools.SimpleRowSource',
		    'java:java.util.concurrent.Callable',
            'java:java.sql.Types',
            'java:java.sql.JDBCType',
        ],

        $constructor: function(cube){
            $base(cube, LoopbackProviderIterator.LoopbackIterators);
        },

		produceCallback: function(queryTask){
		    return new Callable(){
                call: function(){
                       return $this.execute(queryTask);
                }
            };
		},

		execute: function(queryTask){
            var query = queryTask.query;
            var cube = queryTask.cube;

		    function getQuery(name) {
		        if (query.$views && query[name]) {
		            return query[name];
		        }
		        return QueryUtils.findView(name, null, query);
		    }

		    var columns = [];
		    var sqlTypes = [];
		    var rows = 0;
		    var it = Query.execute(queryTask);
            var resultSet = new SimpleResultSet(new SimpleRowSource() {
                readRow: function () {
                    var obj = it.next();
                    if (++rows % 1000 == 0) {
                        QueryUtils.logDebug('Loaded {} objects, last:{}', rows, JSON.stringify(obj));
                    }
                    if (obj) {
                        var row = [];
                        for(var i = 0; i < columns.length; i++) {
                            var value = JDBC.convertToSQLValue(obj[columns[i]], sqlTypes[i]);
                            row.push(value);
                        }
                        rows ++;
                        return row;
                    } else {
                        return null;
                    }
                },

                close: function() {
                    it.close();
                },

                reset: function() {
                    it = Query.execute(queryTask);
                }
            });


            for(var alias in query.$select){
		        try {
		            var type = QueryUtils.extractType(query.$select[alias], query, cube, getQuery);
		            var sqlType = JDBC.getJDBCTypeVendorNumber(type);
		            resultSet.addColumn(alias, sqlType, 0, 0);
                } catch(ex){
                    JSB.getLogger().error(ex);
                    resultSet.addColumn(alias, Types.VARCHAR, 0, 0);
                }
                columns.push(alias);
                sqlTypes.push(sqlType||Types.VARCHAR);
		    }

            return resultSet;
		},
	}
}