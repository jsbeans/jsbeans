JSO({
	name:'RDB',
	server: {
		singleton: true,
		globalize: true,
		body: {
			sql: function(connection, sql, params){
				var self = this;
				// detect sql type
				var msg = 'ExecuteStatementMessage';
				var retObj = {};

				// fillup connection
				var connectionToken = {
					connectionStr: '',
					login: '',
					password: ''
				};
				while(JSO().isFunction(connection)){
					connection = connection.call(this);
				}
				if(JSO().isString(connection)){
					connectionToken.connectionStr = connection;
					connectionToken.login = '';
					connectionToken.password = '';
				} else if(JSO().isPlainObject(connection)){
					if(JSO().isNull(connection.connectionStr)){
						return {
							success: false,
							error: 'Invalid connection argument'
						};
					}
					JSO().merge(connectionToken, connection);
				} else if(JSO().isArray(connection)){
					if(connection.length == 0){
						return {
							success: false,
							error: 'Connection argument array should not be zero-sized'
						};
					}
					connectionToken.connectionStr = connection[0];
					if(connection.length > 1){
						connectionToken.login = connection[1];
					}
					if(connection.length > 2){
						connectionToken.password = connection[2];
					}
				}
				
				var sqlObj = {
					sql: '',
					params: null,
					count: 0
				};
				
				if(JSO().isString(sql)){
					sqlObj.sql = sql;
					if(!JSO().isNull(params)){
						
					}
				} else if(JSO().isPlainObject(sql) && !JSO().isNull(sql.sql)){
					sqlObj.sql = sql.sql;
					if(!JSO().isNull(sql.count)){
						sqlObj.count = sql.count;
					}
					if(!JSO().isNull(sql.params)){
						params = sql.params;
					}
				} else {
					return {
						success: false,
						error: 'Invalid command argument: ' + JSON.stringify(sql)
					};
				}
				
				// fill params
				if(!JSO().isNull(params)){
					if(!JSO().isArray(params)){
						return {
							success: false,
							error: 'Invalid command params argument: ' + JSON.stringify(params)
						};
					}
					sqlObj.params = {};
					for(var i in params){
						sqlObj.params[parseInt(i) + 1] = params[i]; 
					}
				}
				
				var result = Kernel.ask('JdbcService', msg, {
					token: connectionToken,
					sql: sqlObj.sql,
					params: sqlObj.params,
					firstRowCount: sqlObj.count
				});
				
				if(!result.success){
					return {
						success: false,
						error: result.errorMsg
					};
				}
				
				var response = null;
				
				if(!JSO().isNull(result.result.response.result)){
					response = result.result.response.result;
				} else {
					if(JSO().isArray(result.result.response.dataSets)){
						if(result.result.response.dataSets.length == 1){
							response = result.result.response.dataSets[0];
						} else {
							response = [];
							for(var i in result.result.response.dataSets){
								var ds = result.result.response.dataSets[i];
								response.push(ds);
							}
						}
					}
				}

				return {
					success: true,
					result: response
				};
			},
			
			//Не использовать, написан под "узкую" задачу
			executeUpdate : function(connection, sql, params) {
				// fillup connection
				var connectionToken = {
					connectionStr: '',
					login: '',
					password: ''
				};
				
				while(JSO().isFunction(connection)){
					connection = connection.call(this);
				}
				if(JSO().isString(connection)){
					connectionToken.connectionStr = connection;
					connectionToken.login = '';
					connectionToken.password = '';
				} else if(JSO().isPlainObject(connection)){
					if(JSO().isNull(connection.connectionStr)){
						return {
							success: false,
							error: 'Invalid connection argument'
						};
					}
					JSO().merge(connectionToken, connection);
				} else if(JSO().isArray(connection)){
					if(connection.length == 0){
						return {
							success: false,
							error: 'Connection argument array should not be zero-sized'
						};
					}
					connectionToken.connectionStr = connection[0];
					if(connection.length > 1){
						connectionToken.login = connection[1];
					}
					if(connection.length > 2){
						connectionToken.password = connection[2];
					}
				}
				
				if (!this.connection) {
					this.connection = Packages.java.sql.DriverManager.getConnection(
							connectionToken.connectionStr, 
							connectionToken.login, 
							connectionToken.password);
				}
				
				var statement = this.connection.createStatement();
				statement.executeUpdate(sql);
				statement.close();
			}
		}
	}
});
/*
JSO({
	name:'RDB.DataSet',
	client: {
		constructor: function(){},
		body: {
			
		}
	},
	server: {
		constructor: function(opts){
			this.base(opts);
			this.opts = opts;
			Log.debug('DataSet opts: ' + JSON.stringify(opts));
			this.addRows(opts.rows);
			this.cursor = 0;
		},
		body: {
			addRows: function(rows){
				if(JSO().isNull(this.data)){
					this.data = [];
				}
				for(var i in rows){
					this.data.push(rows[i]);
				}
			},
			
			next: function(callback, count){
				if(this.cursor < this.data.length){
					callback.call(this, this.data[this.cursor++]);
				} else {
					
				}
			}
		}
	}
});
*/