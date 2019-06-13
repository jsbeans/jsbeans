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
	$name:'Auth',
//		initSHA: function(){
//			/*
//			 A JavaScript implementation of the SHA family of hashes, as
//			 defined in FIPS PUB 180-2 as well as the corresponding HMAC implementation
//			 as defined in FIPS PUB 198a
//
//			 Copyright Brian Turek 2008-2015
//			 Distributed under the BSD License
//			 See http://caligatio.github.com/jsSHA/ for more information
//
//			 Several functions taken from Paul Johnston
//			*/
//			'use strict';(function(D){function n(c,b,g){var a=0,d=[0],e="",f=null,e=g||"UTF8";if("UTF8"!==e&&"UTF16BE"!==e&&"UTF16LE"!==e)throw"encoding must be UTF8, UTF16BE, or UTF16LE";if("HEX"===b){if(0!==c.length%2)throw"srcString of HEX type must be in byte increments";f=v(c);a=f.binLen;d=f.value}else if("TEXT"===b||"ASCII"===b)f=w(c,e),a=f.binLen,d=f.value;else if("B64"===b)f=x(c),a=f.binLen,d=f.value;else if("BYTES"===b)f=y(c),a=f.binLen,d=f.value;else throw"inputFormat must be HEX, TEXT, ASCII, B64, or BYTES";
//			this.getHash=function(c,b,e,g){var f=null,h=d.slice(),m=a,p;3===arguments.length?"number"!==typeof e&&(g=e,e=1):2===arguments.length&&(e=1);if(e!==parseInt(e,10)||1>e)throw"numRounds must a integer >= 1";switch(b){case "HEX":f=z;break;case "B64":f=A;break;case "BYTES":f=B;break;default:throw"format must be HEX, B64, or BYTES";}if("SHA-1"===c)for(p=0;p<e;p+=1)h=t(h,m),m=160;else throw"Chosen SHA variant is not supported";return f(h,C(g))};this.getHMAC=function(c,b,f,g,r){var h,m,p,s,n=[],u=[];h=null;
//			switch(g){case "HEX":g=z;break;case "B64":g=A;break;case "BYTES":g=B;break;default:throw"outputFormat must be HEX, B64, or BYTES";}if("SHA-1"===f)m=64,s=160;else throw"Chosen SHA variant is not supported";if("HEX"===b)h=v(c),p=h.binLen,h=h.value;else if("TEXT"===b||"ASCII"===b)h=w(c,e),p=h.binLen,h=h.value;else if("B64"===b)h=x(c),p=h.binLen,h=h.value;else if("BYTES"===b)h=y(c),p=h.binLen,h=h.value;else throw"inputFormat must be HEX, TEXT, ASCII, B64, or BYTES";c=8*m;b=m/4-1;if(m<p/8){if("SHA-1"===
//			f)h=t(h,p);else throw"Unexpected error in HMAC implementation";for(;h.length<=b;)h.push(0);h[b]&=4294967040}else if(m>p/8){for(;h.length<=b;)h.push(0);h[b]&=4294967040}for(m=0;m<=b;m+=1)n[m]=h[m]^909522486,u[m]=h[m]^1549556828;if("SHA-1"===f)f=t(u.concat(t(n.concat(d),c+a)),c+s);else throw"Unexpected error in HMAC implementation";return g(f,C(r))}}function w(c,b){var g=[],a,d=[],e=0,f,k,q;if("UTF8"===b)for(f=0;f<c.length;f+=1)for(a=c.charCodeAt(f),d=[],128>a?d.push(a):2048>a?(d.push(192|a>>>6),d.push(128|
//			a&63)):55296>a||57344<=a?d.push(224|a>>>12,128|a>>>6&63,128|a&63):(f+=1,a=65536+((a&1023)<<10|c.charCodeAt(f)&1023),d.push(240|a>>>18,128|a>>>12&63,128|a>>>6&63,128|a&63)),k=0;k<d.length;k+=1){for(q=e>>>2;g.length<=q;)g.push(0);g[q]|=d[k]<<24-e%4*8;e+=1}else if("UTF16BE"===b||"UTF16LE"===b)for(f=0;f<c.length;f+=1){a=c.charCodeAt(f);"UTF16LE"===b&&(k=a&255,a=k<<8|a>>8);for(q=e>>>2;g.length<=q;)g.push(0);g[q]|=a<<16-e%4*8;e+=2}return{value:g,binLen:8*e}}function v(c){var b=[],g=c.length,a,d,e;if(0!==
//			g%2)throw"String of HEX type must be in byte increments";for(a=0;a<g;a+=2){d=parseInt(c.substr(a,2),16);if(isNaN(d))throw"String of HEX type contains invalid characters";for(e=a>>>3;b.length<=e;)b.push(0);b[a>>>3]|=d<<24-a%8*4}return{value:b,binLen:4*g}}function y(c){var b=[],g,a,d;for(a=0;a<c.length;a+=1)g=c.charCodeAt(a),d=a>>>2,b.length<=d&&b.push(0),b[d]|=g<<24-a%4*8;return{value:b,binLen:8*c.length}}function x(c){var b=[],g=0,a,d,e,f,k;if(-1===c.search(/^[a-zA-Z0-9=+\/]+$/))throw"Invalid character in base-64 string";
//			d=c.indexOf("=");c=c.replace(/\=/g,"");if(-1!==d&&d<c.length)throw"Invalid '=' found in base-64 string";for(d=0;d<c.length;d+=4){k=c.substr(d,4);for(e=f=0;e<k.length;e+=1)a="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/".indexOf(k[e]),f|=a<<18-6*e;for(e=0;e<k.length-1;e+=1){for(a=g>>>2;b.length<=a;)b.push(0);b[a]|=(f>>>16-8*e&255)<<24-g%4*8;g+=1}}return{value:b,binLen:8*g}}function z(c,b){var g="",a=4*c.length,d,e;for(d=0;d<a;d+=1)e=c[d>>>2]>>>8*(3-d%4),g+="0123456789abcdef".charAt(e>>>
//			4&15)+"0123456789abcdef".charAt(e&15);return b.outputUpper?g.toUpperCase():g}function A(c,b){var g="",a=4*c.length,d,e,f;for(d=0;d<a;d+=3)for(f=d+1>>>2,e=c.length<=f?0:c[f],f=d+2>>>2,f=c.length<=f?0:c[f],f=(c[d>>>2]>>>8*(3-d%4)&255)<<16|(e>>>8*(3-(d+1)%4)&255)<<8|f>>>8*(3-(d+2)%4)&255,e=0;4>e;e+=1)g=8*d+6*e<=32*c.length?g+"ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/".charAt(f>>>6*(3-e)&63):g+b.b64Pad;return g}function B(c){var b="",g=4*c.length,a,d;for(a=0;a<g;a+=1)d=c[a>>>2]>>>
//			8*(3-a%4)&255,b+=String.fromCharCode(d);return b}function C(c){var b={outputUpper:!1,b64Pad:"="};try{c.hasOwnProperty("outputUpper")&&(b.outputUpper=c.outputUpper),c.hasOwnProperty("b64Pad")&&(b.b64Pad=c.b64Pad)}catch(g){}if("boolean"!==typeof b.outputUpper)throw"Invalid outputUpper formatting option";if("string"!==typeof b.b64Pad)throw"Invalid b64Pad formatting option";return b}function r(c,b){return c<<b|c>>>32-b}function s(c,b){var g=(c&65535)+(b&65535);return((c>>>16)+(b>>>16)+(g>>>16)&65535)<<
//			16|g&65535}function u(c,b,g,a,d){var e=(c&65535)+(b&65535)+(g&65535)+(a&65535)+(d&65535);return((c>>>16)+(b>>>16)+(g>>>16)+(a>>>16)+(d>>>16)+(e>>>16)&65535)<<16|e&65535}function t(c,b){var g=[],a,d,e,f,k,q,n,l,t,h=[1732584193,4023233417,2562383102,271733878,3285377520];for(a=(b+65>>>9<<4)+15;c.length<=a;)c.push(0);c[b>>>5]|=128<<24-b%32;c[a]=b;t=c.length;for(n=0;n<t;n+=16){a=h[0];d=h[1];e=h[2];f=h[3];k=h[4];for(l=0;80>l;l+=1)g[l]=16>l?c[l+n]:r(g[l-3]^g[l-8]^g[l-14]^g[l-16],1),q=20>l?u(r(a,5),d&e^
//			~d&f,k,1518500249,g[l]):40>l?u(r(a,5),d^e^f,k,1859775393,g[l]):60>l?u(r(a,5),d&e^d&f^e&f,k,2400959708,g[l]):u(r(a,5),d^e^f,k,3395469782,g[l]),k=f,f=e,e=r(d,30),d=a,a=q;h[0]=s(a,h[0]);h[1]=s(d,h[1]);h[2]=s(e,h[2]);h[3]=s(f,h[3]);h[4]=s(k,h[4])}return h}"function"===typeof define&&define.amd?define(function(){return n}):"undefined"!==typeof exports?"undefined"!==typeof module&&module.exports?module.exports=exports=n:exports=n:D.jsSHA=n})(this);
//
//		},
//
//		getOtp: function(userName, password){
//			var self = this;
//
//			// generate secret key
//			var key = JSB().MD5.md5(userName + '@' + password);
//
//			function dec2hex(s) { return (s < 15.5 ? '0' : '') + Math.round(s).toString(16); }
//		    function hex2dec(s) { return parseInt(s, 16); }
//
//		    function base32tohex(base32) {
//		        var base32chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ234567";
//		        var bits = "";
//		        var hex = "";
//
//		        for (var i = 0; i < base32.length; i++) {
//		            var val = base32chars.indexOf(base32.charAt(i).toUpperCase());
//		            bits += leftpad(val.toString(2), 5, '0');
//		        }
//
//		        for (var i = 0; i+4 <= bits.length; i+=4) {
//		            var chunk = bits.substr(i, 4);
//		            hex = hex + parseInt(chunk, 2).toString(16) ;
//		        }
//		        return hex;
//
//		    }
//
//		    function leftpad(str, len, pad) {
//		        if (len + 1 >= str.length) {
//		            str = Array(len + 1 - str.length).join(pad) + str;
//		        }
//		        return str;
//		    }
//
////		    var key = base32tohex(secret);
//	        var epoch = Math.round(new Date().getTime() / 1000.0);
//	        var time = leftpad(dec2hex(Math.floor(epoch / 30)), 16, '0');
//
//	        var hmacObj = new self.jsSHA(time, 'HEX');
//	        var hmac = hmacObj.getHMAC(key, 'HEX', 'SHA-1', "HEX");
//
//	        var offset = hex2dec(hmac.substring(hmac.length - 1));
//
//	        var otp = (hex2dec(hmac.substr(offset * 2, 8)) & hex2dec('7fffffff')) + '';
//	        otp = (otp).substr(otp.length - 6, 6);
//
//	        return otp;
//		}
	
	$client: {
		$singleton: true,
		$globalize: true,
		$constructor: function(){
//			this.initSHA();
		},
	},
	$server: {
		$require: 'JSB.System.Kernel',
		
		$singleton: true,
		$globalize: true,
		
		
		$constructor: function(){
//			this.initSHA();
		},
		isSecurityEnabled: function(){
			return Config.get('kernel.security.enabled');
		},
		
		getUserPrincipal: function(token){
			return Kernel.user();
		},
		
		getUserTokenInfo: function(token){
			if(!token){
				token = Kernel.userToken();
			}
			var res = Kernel.ask('SecurityService', 'GetTokenMessage', {
				token: token
			});
			if(!res.success){
				throw res.errorMsg;
			}
			var tokenObj = res.result.response;
			var tokenUser = '' + tokenObj.userName;
			if(!Kernel.isAdmin() && tokenUser != Kernel.user()){
				throw 'Operation is not permitted with foreign tokens';
			}
			return tokenObj;
		},
		
		createUser: function(user, pass){
			return Kernel.ask('SecurityService', 'CreateUserMessage', {
				userName: user,
				password: pass
			});
		},
		
		deleteUser: function(user){
			return Kernel.ask('SecurityService', 'DeleteUserMessage', {
				userName: user
			});
		},
		
		getUserCredentials: function(user){
			return Kernel.ask('SecurityService', 'GetUserCredentialsMessage', {
				userName: user || null
			});
		},

		setUserCredentials: function(user, json){
			return Kernel.ask('SecurityService', 'SetUserCredentialsMessage', {
				userName: user || null,
				credentials: json
			});
		},
		
		generatePassword: function(count) {
			var count = count || 10;

			var pwd = '';
			var symbols = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

			for(var i=0; i < count; i++) {
				pwd += symbols.charAt(Math.floor(Math.random() * symbols.length));
			}
			return pwd;
		},

		permitted: function(permission, func){
			var permissionAttributes = this.usePermission(permission);
			func.call(permissionAttributes, permissionAttributes);
		},

		/**
		* Возвращает объект с атрибутами разрешения, если у принципала есть указанное разрешение
		*/
		hasPermission: function(permission, user) {
			// TODO: кэшировать на какое-то небольшое время для частых запросов
			var result = Kernel.ask('SecurityService', 'CheckPermissionMessage', {
				userName: user||this.getUserPrincipal(),
				permission: permission
			});
			Log.debug('checkPermission: ' + JSON.stringify(result));
			return result.success && result.result && result.result.response;
		},

		/**
        * Почти как #hasPermission, но разрешение как бы "используется", что подразумевает:
        * <br/> * если используется ограничение по числу раз использования, то
        * в отличии от checkPermission число уменьшается на единицу, пока не достигнет 0
        * <br/> * в случае отсуствия разрешения или по достижению лимита выбрасывается исключение
        */
        usePermission: function(permission){
        	var result = Kernel.ask('SecurityService', 'CheckPermissionMessage', {
				userName: this.getUserPrincipal(),
				permission: permission,
				use: true
			});
			Log.debug('usePermission: ' + JSON.stringify(result), true);
			var attrs = result.success && result.result && result.result.response;
			if (!attrs) throw 'Has no permission: ' + permission;
			return attrs;
        },

        addPermissions: function(user, permissionKey, permissions) {
			return Kernel.ask('SecurityService', 'AddPermissionsMessage', {
				userName: user,
				permissionKey: permissionKey||null,
				permissions: permissions
			});
			return result.success && result.result && result.result.response;
		},

		removePermissions: function(user, permissionKey, permission) {
			return Kernel.ask('SecurityService', 'RemovePermissionsMessage', {
				userName: user,
				permissionKey: permissionKey,
				permission: permission
			});
			return result.success && result.result && result.result.response;
		}

	}
}