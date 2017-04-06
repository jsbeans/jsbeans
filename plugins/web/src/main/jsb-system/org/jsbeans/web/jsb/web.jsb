{
	$name:'Web',
	$require: ['Log'],
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
		$constructor: function(){
			JSB().onLoad(function(){
				// remove jso from the web cache
				Packages.org.jsbeans.web.WebCache.remove(this.$name);
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
				jsbData = Packages.org.jsbeans.helpers.FileHelper.readStringFromResource(jsoPath);
				if(!Config.get('web.debug')){
					jsbData = '' + Packages.org.jsbeans.web.JsMinifier.minify(jsbData, false);
				}
			} else {
				jsbData = 'JSB(' + Packages.org.jsbeans.web.JsbServlet.getJsbCode(name, Kernel.session(), Kernel.clientAddr(), Kernel.user(), Kernel.clientRequestId(), Kernel.userToken()) + ');';
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
		}
	}
}