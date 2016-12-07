JSB({
    name:'Http',
	require: {
		'HttpConnection': 'HttpConnection'
	},
    server: {
        singleton: true,

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
            var httpConnection = new this.HttpConnection(options);
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
        	if(data){
        		if(JSB.isPlainObject(data) || JSB.isArray(data)){
        			c.sendArgs(data);
        		} else {
        			c.send(data);
        		}
        	}
        	
        	var result = c.getResult();
        	
        	c.destroy();
        	
        	return result;
        }
    }
});


JSB({
    name:'HttpConnection',

    server: {
        constructor: function(options){
//            if(!Kernel.isAdmin()) throw new Exception('Has no permissions');

            this.URL = Packages.java.net.URL;
            this.Proxy = Packages.java.net.Proxy;
            this.Authenticator = Packages.java.net.Authenticator;
            this.HttpURLConnection = Packages.java.net.HttpURLConnection;
            this.InetSocketAddress = Packages.java.net.InetSocketAddress;
            this.HttpHelper = Packages.org.jsbeans.helpers.HttpHelper;

            this.options = JSO().merge(true, {}, this.defaultOptions, options);
            this.log = this.logger(this.options.id, this.options.debug, this.options.trace);
        },

        defaultOptions: {
            debug: true,
            trace: true,

            connectTimeout: 3000, // remote machine does not answer
            socketTimeout: 15000,// connection interrupted
            method: 'GET',
            charset: 'utf-8',
            useCaches: false,
            delimiter: '\n',
            responseType: 'string', // HttpHelper.ResultType: string, bytes, base64, json
            requestProperties: {
                Accept: 'Accept", "*/*',
                "User-Agent": "Wget/1.12"
            },
        },

        connect: function(){
//                this.log.trace('connect(): ', this.options);

            var options = this.options;
            var url = new this.URL(options.url)

            var proxyHost = options.proxy_host || options.proxyHost || options.proxy && options.proxy.host;
            if (proxyHost) {
                var proxyPort = options.proxy_port || options.proxyPort || options.proxy && options.proxy.port;
                var proxyUser = options.proxy_user || options.proxyUser || options.proxy && options.proxy.user;
                var proxyPwd = options.proxy_password || options.proxyPassword || options.proxy && options.proxy.password;

//                    this.log.trace('connect(): setup proxy: ' + proxyHost + ':' + proxyPort);
                var proxy = new this.Proxy(this.Proxy.Type.HTTP, new this.InetSocketAddress(proxyHost, proxyPort));

                this.httpConnection = url.openConnection(proxy);

                if (proxyUser) {
//                        this.log.trace('connect(): proxy auth ');
                    this.HttpHelper.defaultAuth(proxyUser, proxyPwd); // TODO:
                }
            } else {
               this.httpConnection = url.openConnection();
            }

//                this.log.trace('connect(): connected with ' + options.url);

            options.connectTimeout  && this.httpConnection.setConnectTimeout(options.connectTimeout);
            options.socketTimeout   && this.httpConnection.setReadTimeout(options.socketTimeout);
            options.useCaches       && this.httpConnection.setUseCaches(options.useCaches);
            options.charset         && this.httpConnection.setRequestProperty("charset", options.charset);

            for(var key in options.requestProperties) if (options.requestProperties.hasOwnProperty(key)) {
               var val = options.requestProperties[key];
               this.httpConnection.setRequestProperty(key, val);
            }

            if(options.user && options.password) {
                var encoding = this.HttpHelper.toBase64(options.user + ':' + options.password);
                this.httpConnection.addRequestProperty("Authorization", "Basic " + encoding);
//                    this.log.trace('connect(): HTTP Authorization Basic ' + encoding);
            }

            this.httpConnection.setRequestMethod(options.method);
        },

        disconnect: function() {
//                this.log.trace('disconnect()');
        	if (this.outputStream) try { this.outputStream.close(); } finally {}
            if (this.inputStream) try { this.inputStream.close(); } finally {}
            if (this.errorStream) try { this.errorStream.close(); } finally {}
            this.httpConnection.disconnect();
        },

        destroy: function(){
            this.disconnect();
            $base();
        },

        send: function(data){
            if(!this.httpConnection.getDoOutput()) {
                this.httpConnection.setDoOutput(true);
            }
            try {
                var outputStream = this.outputStream = this.outputStream || this.httpConnection.getOutputStream();

                if(JSB.isString(data)) {
                    this.HttpHelper.streamWriteString(outputStream, data, this.options.charset);
                } else if(JSB.isPlainObject(data)) {
                    var json = JSON.stringify(data) + this.options.delimiter;
                    this.HttpHelper.streamWriteString(outputStream, json, this.options.charset);
                } else if(JSB.isArray(data)) {
                    this.HttpHelper.streamWriteBytes(outputStream, bytes); // TODO:
                } else {
                    throw Exception('Unsupported data type ' + typeof data);
                }

            } catch (e) {
                this.sendCompleted();
                throw e;
            }
        },
        
        sendArgs: function(data){
        	var argStr = '';
        	function prepareArgs(json){
        		for(var f in json){
        			if(argStr.length > 0){
        				argStr += '&';
        			}
        			argStr += f + '=';
        			if(JSB.isString(json[f])){
        				argStr += encodeURIComponent(json[f]);
        			} else if(JSB.isPlainObject(json[f]) || JSB.isArray(json[f])){
        				argStr += encodeURIComponent(JSON.stringify(json[f]));
        			} else {
        				argStr += json[f];
        			}
        		}
        	}
        	
        	if(JSB.isPlainObject(data)){
        		prepareArgs(data);
        	} else if(JSB.isArray(data)){
        		for(var i = 0; i < data.length; i++){
        			var obj = data[i];
        			prepareArgs(obj);
        		}
        	} else {
        		this.send(data);
        		return;
        	}
        	this.send(argStr);
        },

        sendCompleted: function(){
            var outputStream = this.outputStream;
            if (outputStream) {
                this.outputStream = null;
                try {
                    outputStream.close();
                } finally {}
            }
        },

        isOk: function(){
            var statusCode = this.getResponseCode();
            return statusCode >= 200 && statusCode < 400;
        },

        getResult: function(){
            var result = {
                responseCode:    this.getResponseCode(),
                responseMessage: this.getResponseMessage(),
                error:           this.getError(),
                body:            this.getBody()
            };
            this.disconnect();
            return result;
        },

        getResponseCode: function(){
            this.sendCompleted();
            var code = 0+this.httpConnection.getResponseCode();
//                this.log.trace('getResponseCode() code: ' + code);
            return code;
        },

        getResponseMessage: function(){
            this.sendCompleted();
            var m = ''+this.httpConnection.getResponseMessage();
//                this.log.trace('getResponseMessage() message: ' + m);
            return m;
        },

        getError: function(){
            this.sendCompleted();
            try {
                var error = null;
                if (!this.isOk())  {
                    var errorStream = this.errorStream = this.errorStream || this.httpConnection.getErrorStream();
                    error = this.HttpHelper.streamRead(errorStream, this.options.responseType, -1);
                    if (this.options.responseType === 'json') error = JSON.parse(error); //eval('(' + error + ')');
                }
//                    this.log.trace('getError() error: ', error);
                return error;
            } catch(e) {
//                    this.log.trace('[ERROR] getError(): ' + JSO().stringifyError(e));
                return null;
            }
        },

        getBody: function () {
            return this.read(-1);
        },

        read: function(bytes){
            this.sendCompleted();

            if (!this.isOk()) return null;
            if (JSO().isNull(bytes)) {
                var bytes = -1;
            }

            try {
                var inputStream = this.inputStream = this.inputStream || this.httpConnection.getInputStream();
                var result = this.HttpHelper.streamRead(inputStream, this.options.responseType, bytes);
                if (this.options.responseType === 'json') result = JSON.parse(result); // eval
//                    this.log.trace('read() result: ', result);
                return result;
            } catch(e) {
//                    this.log.trace('[ERROR] read(): ', e);
                return null;
            }
        },

        readLine: function(){
            this.sendCompleted();
            if (this.options.responseType !== 'string') throw new Exception('Only string responseType');

            try {
                var inputStream = this.inputStream = this.inputStream || this.httpConnection.getInputStream();
                var line = this.HttpHelper.streamReadLine(inputStream);
//                    this.log.trace('readLine() line: ', line);
                return line;
            } catch(e) {
//                    this.log.trace('[ERROR] readLine(): ' + JSO().stringifyError(e));
                return null;
            }
        },

        logger: function(id, enableDebug, enableTrace) {
            return {
                debug: function(msg, obj){
                    if (enableDebug) {
                        var s = '';
                        if (obj) s = obj instanceof Error ? JSO().stringifyError(obj) : JSON.stringify(obj);
                        Log.debug('Http ('+id+'): ' + msg + s);
                    }
                },
                trace: function(msg, obj){
                    if(enableTrace) {
                        var s = '';
                        if (obj) s = typeof obj === 'object' && obj instanceof Error ? JSO().stringifyError(obj) : JSON.stringify(obj);
                        Log.debug('Http ('+id+'): [TRACE] ' + msg + s);
                    }
                },
                error: function(msg, e){
                    var s = '';
                    if (obj) s = obj instanceof Error ? JSO().stringifyError(obj) : JSON.stringify(obj);
                    Log.error(!(e instanceof Error), 'Http ('+id+'): [ERROR] ' + msg + s);
                }
            };
        }
    }
});