/*
 * This file is the part of jsBeans, high-level JavaScript client-server framework.
 * The contents of this file are subject to the MIT License (MIT).
 * (c) aa@sis.ru, da@sis.ru, Special Information Systems, LLC, 2011-2019
 *
 * Настоящий файл является частью клиент-серверной JavaScript платформы.
 * Условия использования и распространения содержимого данного файла соответствуют программному обеспечению с открытыми исходными кодами и равнозначно MIT License (MIT).
 * Авторские права принадлежат aa@sis.ru, da@sis.ru, ООО СИС, 2011-2019гг.
 */

{
	$name:'RDB',
	$server: {
		$require: 'JSB.System.Kernel',
		$singleton: true,
		$globalize: true,
		
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
			while(JSB().isFunction(connection)){
				connection = connection.call(this);
			}
			if(JSB().isString(connection)){
				connectionToken.connectionStr = connection;
				connectionToken.login = '';
				connectionToken.password = '';
			} else if(JSB().isPlainObject(connection)){
				if(JSB().isNull(connection.connectionStr)){
					return {
						success: false,
						error: 'Invalid connection argument'
					};
				}
				JSB().merge(connectionToken, connection);
			} else if(JSB().isArray(connection)){
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
			
			if(JSB().isString(sql)){
				sqlObj.sql = sql;
				if(!JSB().isNull(params)){
					
				}
			} else if(JSB().isPlainObject(sql) && !JSB().isNull(sql.sql)){
				sqlObj.sql = sql.sql;
				if(!JSB().isNull(sql.count)){
					sqlObj.count = sql.count;
				}
				if(!JSB().isNull(sql.params)){
					params = sql.params;
				}
			} else {
				return {
					success: false,
					error: 'Invalid command argument: ' + JSON.stringify(sql)
				};
			}
			
			// fill params
			if(!JSB().isNull(params)){
				if(!JSB().isArray(params)){
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
			
			if(!JSB().isNull(result.result.response.result)){
				response = result.result.response.result;
			} else {
				if(JSB().isArray(result.result.response.dataSets)){
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
			
			while(JSB().isFunction(connection)){
				connection = connection.call(this);
			}
			if(JSB().isString(connection)){
				connectionToken.connectionStr = connection;
				connectionToken.login = '';
				connectionToken.password = '';
			} else if(JSB().isPlainObject(connection)){
				if(JSB().isNull(connection.connectionStr)){
					return {
						success: false,
						error: 'Invalid connection argument'
					};
				}
				JSB().merge(connectionToken, connection);
			} else if(JSB().isArray(connection)){
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