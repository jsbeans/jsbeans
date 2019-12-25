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
	$name: 'JSB.Web',
	$singleton: true,
	
	$client: {
		getCookie: function(name){
			var matches = document.cookie.match(new RegExp("(?:^|; )" + name.replace(/([\.$?*|{}\(\)\[\]\\\/\+^])/g, '\\$1') + "=([^;]*)"));
			return matches ? decodeURIComponent(matches[1]) : undefined;
		},
		
		setCookie: function(name, value, options){
			options = options || {};

			var expires = options.expires;

			if (typeof expires == "number" && expires) {
				var d = new Date();
				d.setTime(d.getTime() + expires * 1000);
				expires = options.expires = d;
			}
			if (expires && expires.toUTCString) {
				options.expires = expires.toUTCString();
			}

			value = encodeURIComponent(value);

			var updatedCookie = name + "=" + value;

			for (var propName in options) {
				updatedCookie += "; " + propName;
				var propValue = options[propName];
				if (propValue !== true) {
					updatedCookie += "=" + propValue;
				}
			}

			document.cookie = updatedCookie;
		}
	},
	$server: {
		$require: ['JSB.System.Kernel',
		           'JSB.System.Log',
		           'JSB.System.Config',
		           'java:org.jsbeans.helpers.FileHelper',
		           'java:org.jsbeans.web.JsMinifier',
		           'java:org.jsbeans.web.JsbServlet',
		           'java:org.jsbeans.web.WebCache'],
		           
		_appContext: null,

		$constructor: function(){
			JSB().onLoad(function(){
				// remove jso from the web cache
				WebCache.remove(this.$name);
			});
		},

		Response: function(data, opts){
			this.data = data;
			this.opts = opts;
		},

		getJsbCode: function(name){
			var jsbData = null;
			if(!name){
				// return bootstrap code
				var jsoPath = Config.get("kernel.jsb.jsbEngineResource");
				jsbData = FileHelper.readStringFromResource(jsoPath);
				if(!Config.get('web.debug')){
					jsbData = '' + JsMinifier.minify(jsbData, false);
				}
			} else {
				jsbData = 'JSB(' + JsbServlet.getJsbCode(name, Kernel.session(), Kernel.clientAddr(), Kernel.user(), Kernel.clientRequestId(), Kernel.userToken()) + ');';
			}
			return jsbData;
		},
		
		getRequestHeaders: function(){
			var h = Kernel.clientRequestId();
			if(h && h.length > 0){
				return eval('(' + h + ')');
			}
			return null;
		},
		
		response: function(data, opts){
			return new this.Response(data, opts);
		},
		
		getRequest: function(){
			return (function(){return this;}).call(null)['__request'];
		},
		
		getResponse: function(){
			return (function(){return this;}).call(null)['__response'];
		},
		
		_setAppContext: function(ctx){
			this._appContext = ctx;
		},

		getCookieName: function(){
			return '' + this._appContext.getSessionHandler().getSessionManager().getSessionCookieConfig().getName();
		},
		
		getSessionIdPathParameterName: function(){
			return '' + this._appContext.getSessionHandler().getSessionManager().getSessionIdPathParameterName();
		}
	}
}