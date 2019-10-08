/*
 * This file is the part of jsBeans, high-level JavaScript client-server framework.
 * The contents of this file are subject to the MIT Licence (MIT).
 * (c) aa@sis.ru, da@sis.ru, Special Information Systems, LLC, 2011-2019
 *
 * Настоящий файл является частью клиент-серверной JavaScript платформы.
 * Условия использования и распространения содержимого данного файла соответствуют программному обеспечению с открытыми исходными кодами и равнозначно MIT Licence (MIT).
 * Авторские права принадлежат aa@sis.ru, da@sis.ru, ООО СИС, 2011-2019гг.
 */

{
    $name:'JSB.Net.Http',
	$require: ['JSB.Net.HttpConnection'],
    $server: {
        $singleton: true,

        example: function(){
            // simple GET string
            var http = Http.connect({url: 'http://ya.ru'}).getResult();


            // simple post
            var c = Http.connect({
               method: 'POST',
               url: 'http://fulltext.sis.ru/sm'
               // proxy: {host:'', port:0, login:'', password:''}
            });
            c.send('example string data');
            c.getResult(); // {responseCode: c.getResponseCode(), responseMessage: getResponseMessage(), error: c.getError(), body: c.getBody()} and close();



            // extended request

            var data = [{ex: '1'}, {ex:'2'}, 'string example 3', {ex:'4'}, [1,2,3,4,5]];
            var connection = Http.connect({
                method: 'POST',
                url: 'http://fulltext.sis.ru/sm',
                responseType: 'json'
            });

            for (var i in data) {
               connection.send(data[i], i + 1 === data.length);
            }

            connection.getResponseCode(); // HTTP Status-Code
            connection.getError();
            connection.getBody(); // single


            connection.readLine(); // single
            connection.read(1024); // read 1024
        },

        connect: function(options) {
            this.lastId = (this.lastId||0) + 1;
            options.id = this.lastId;
            var httpConnection = new HttpConnection(options);
            httpConnection.connect();
            return httpConnection;
        },
        
        request: function(method, url, data, props){
        	if(!props){
        		props = {};
        	}
        	var c = this.connect(JSB.merge(true, {
                method: method,
                url: url,
                requestProperties: {
                	'Content-Type': 'application/x-www-form-urlencoded',
                	'charset': 'utf-8'
                }
        	}, props));
        	
        	try {
	        	if(data){
	        		if(JSB.isPlainObject(data) || JSB.isArray(data)){
	        			c.sendArgs(data);
	        		} else {
	        			c.send(data);
	        		}
	        	}
	        	
	        	var result = c.getResult();
	        	return result;
        	} finally {
        		c.destroy();
        	}
        	
        	
        }
    }
}