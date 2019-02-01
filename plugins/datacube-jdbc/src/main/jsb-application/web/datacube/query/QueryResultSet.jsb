{
	$name: 'DataCube.Query.QueryResultSet',
	$singleton: true,

	$server: {
		$require: [
            'DataCube.Query.Query',
		    'JSB.Store.Sql.JDBC',
		    'DataCube.Query.QueryUtils',

            'java:org.h2.tools.SimpleResultSet',
            'java:org.h2.tools.SimpleRowSource',
            'java:java.sql.Types',
            'java:java.sql.JDBCType',
        ],

		execute: function(queryDescriptor){
debugger;

            var query = queryDescriptor.query;
            var cube = queryDescriptor.cube;

		    function getQuery(name) {
		        if (query.$views && query[name]) {
		            return query[name];
		        }
		        return QueryUtils.findView(name, null, query);
		    }

		    var columns = [];
		    var it = Query.execute(queryDescriptor);
            var resultSet = new SimpleResultSet(new SimpleRowSource() {
                readRow: function () {
QueryUtils.logDebug('Next row started');
                    var obj = it.next();
QueryUtils.logDebug('Next Object:\n{}', JSON.stringify(obj));
                    if (obj) {
                        var row = [];
                        for(var i = 0; i < columns.length; i++) {
                            row.push(obj[columns[i]]);
                        }
                        return row;
                    } else {
                        return null;
                    }
                },

                close: function() {
                    it.close();
                },

                reset: function() {
                    it = Query.execute(queryDescriptor);
                }
            });


            for(var alias in query.$select){
		        try {
		            var type = QueryUtils.extractType(query.$select[alias], query, cube, getQuery);
		            var jdbcType = JDBCType.valueOf(JDBC.toJdbcType(type));
		            var sqlType = 0 + jdbcType.getVendorTypeNumber().intValue();
		            resultSet.addColumn(alias, sqlType, 0, 0);
                } catch(ex){
                    JSB.getLogger().error(ex);
                    resultSet.addColumn(alias, Types.VARCHAR, 0, 0);
                }
                columns.push(alias);
		    }

            return resultSet;
		},
	}
}