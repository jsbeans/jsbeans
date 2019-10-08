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
    $name:'JSB.Net.HttpConnection',

    $server: {
    	$require: ['JSB.System.Log', 'JSB.IO.Stream'],
    	
        $constructor: function(options){
            this.URL = Packages.java.net.URL;
            this.Proxy = Packages.java.net.Proxy;
            this.Authenticator = Packages.java.net.Authenticator;
            this.HttpURLConnection = Packages.java.net.HttpURLConnection;
            this.InetSocketAddress = Packages.java.net.InetSocketAddress;
            this.HttpHelper = Packages.org.jsbeans.helpers.HttpHelper;

            this.options = JSB().merge(true, {}, this.defaultOptions, options);
            this.log = this.logger(this.options.id, this.options.debug, this.options.trace);
        },

        defaultOptions: {
            debug: true,
            trace: true,

            connectTimeout: 15000, // remote machine does not answer
            socketTimeout: 120000,// connection interrupted
            method: 'GET',
            charset: 'utf-8',
            useCaches: false,
            delimiter: '\n',
            responseType: 'string', // HttpHelper.ResultType: string, bytes, base64, json
            requestProperties: {
                "Accept": "*/*",
                "User-Agent": "Wget/1.12",
                "Content-Type": "application/x-www-form-urlencoded"
            },
        },

        connect: function(){
//                this.log.trace('connect(): ', this.options);

            var options = this.options;
            // check for user and password in url
            var rx = /^(http[s]?)\:\/\/([^\:]+)\:([^@]+)@(.+)$/i;
            if(rx.test(options.url)){
            	var m = options.url.match(rx);
            	var proto = m[1];
            	options.user = m[2];
            	options.password = m[3];
            	options.url = proto + '://' + m[4];
            }
            
            var url = new this.URL(options.url)

            var proxyHost = options.proxy_host || options.proxyHost || options.proxy && options.proxy.host;
            if (proxyHost) {
                if (this.options.spnego) {
                    throw new Error('Connection with proxy and SPNEGO not inplemented yet');
                }

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
                if (this.options.spnego) {
                    var SpnegoHttpURLConnection = Packages.net.sourceforge.spnego.SpnegoHttpURLConnection;
                    if (this.options.spnego.loginModule) {
                        this.spnego = new SpnegoHttpURLConnection(this.options.spnego.loginModule);
                    } else if (this.options.spnego.gssCredential) {
                        this.spnego = new SpnegoHttpURLConnection(this.options.spnego.gssCredential);
                    } else {
                        throw new Error('Spnego options are not defined');
                    }
                    this.httpConnection = this.spnego.connect(url);
                } else {
                    this.httpConnection = url.openConnection();
                }
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
            if (this.spnego) {
                this.spnego.disconnect();
            } else {
                this.httpConnection.disconnect();
            }
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
                } else if(JSB.isInstanceOf(data, 'JSB.IO.Stream')) {
                	var outStream = new Stream(outputStream);
                	data.copy(outStream);
                	outStream.destroy();
                } else if(JSB.isPlainObject(data)) {
                    var json = JSON.stringify(data) + this.options.delimiter;
                    this.HttpHelper.streamWriteString(outputStream, json, this.options.charset);
                } else if(JSB.isArray(data)) {
                    this.HttpHelper.streamWriteBytes(outputStream, bytes); // TODO:
                } else {
                    throw new Error('Unsupported data type ' + typeof data);
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
//                    this.log.trace('[ERROR] getError(): ' + JSB().stringifyError(e));
                return null;
            }
        },

        getBody: function () {
            return this.read(-1);
        },

        read: function(bytes){
            this.sendCompleted();

            if (!this.isOk()) return null;
            if (JSB().isNull(bytes)) {
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
//                    this.log.trace('[ERROR] readLine(): ' + JSB().stringifyError(e));
                return null;
            }
        },

        logger: function(id, enableDebug, enableTrace) {
            return {
                debug: function(msg, obj){
                    if (enableDebug) {
                        var s = '';
                        if (obj) s = obj instanceof Error ? JSB().stringifyError(obj) : JSON.stringify(obj);
                        Log.debug('Http ('+id+'): ' + msg + s);
                    }
                },
                trace: function(msg, obj){
                    if(enableTrace) {
                        var s = '';
                        if (obj) s = typeof obj === 'object' && obj instanceof Error ? JSB().stringifyError(obj) : JSON.stringify(obj);
                        Log.debug('Http ('+id+'): [TRACE] ' + msg + s);
                    }
                },
                error: function(msg, e){
                    var s = '';
                    if (obj) s = obj instanceof Error ? JSB().stringifyError(obj) : JSON.stringify(obj);
                    Log.error(!(e instanceof Error), 'Http ('+id+'): [ERROR] ' + msg + s);
                }
            };
        }
    }
}