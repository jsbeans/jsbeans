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
	$name: 'JSB.JsbRepository',
	$http: true,
	$fixedId: true,
	$singleton: true,
	
	$server: {
		$require: ['java:org.jsbeans.Starter',
		           'java:java.lang.Byte',
		           'java:java.lang.reflect.Array',
		           'java:java.io.File',
		           'java:java.io.PrintWriter',
		           'java:java.io.FileInputStream',
		           'java:java.util.Arrays',
		           'JSB.System.Config',
		           'JSB.System.Kernel',
		           'JSB.Auth',
                   'JSB.Web',
                   'java:java.util.Base64',
		           'java:org.jsbeans.web.JsMinifier',
		           'java:org.jsbeans.scripting.jsb.JsbRegistryService',
		           'java:org.jsbeans.scripting.jsb.Beans.ZippedProvider',
		           'java:org.jsbeans.scripting.jsb.Beans.EncoderDecoder',
		           'java:org.jsbeans.scripting.jsb.Beans.FileProvider'
               ],
		
		cachedContent: {},
		
		$constructor: function(){
		},

		get: function(params){
			var request = Web.getContext().getRequest();
			var response = Web.getContext().getResponse();
            response.setCharacterEncoding('UTF-8');
            response.setContentType('application/zip');

            if(params.hasOwnProperty('system')) {
                if(Config.has('kernel.jsb.repo.beans.system.path')) {
                    var fileBeans = new FileProvider(Config.get('kernel.jsb.repo.beans.system.path'));
                } else {
                    var internalBeans = JsbRegistryService.system;
                }
            } else if(params.hasOwnProperty('server')) {
                if(Config.has('kernel.jsb.repo.beans.server.path')) {
                    var fileBeans = new FileProvider(Config.get('kernel.jsb.repo.beans.server.path'));
                } else {
                    var internalBeans = JsbRegistryService.server;
                }
            } else if(params.hasOwnProperty('application')) {
                if(Config.has('kernel.jsb.repo.beans.application.path')) {
                    var fileBeans = new FileProvider(Config.get('kernel.jsb.repo.beans.application.path'));
                } else {
                    var internalBeans = JsbRegistryService.application;
                }
            } else if(params.hasOwnProperty('redirect_uri')) {
                var url = params.redirect_uri;
                response.sendRedirect(url);
                return;
            }

            if (!params.key || !JSB.isString(params.key)) {
                throw new JSB.Error('Invalid user key');
            }
            Log.debug('jsbrepo user = ' + Kernel.user());
            try {
                // TODO check permission
                // TODO store launch user stats (user,ip,time...)
                var key = Base64.getDecoder().decode(params.key);
                var out = EncoderDecoder.encoder(key).apply(response.getOutputStream());
                ZippedProvider.writeAsZip(internalBeans||fileBeans, out);
            }finally{
                if(fileBeans) {
                    fileBeans.close();
                }
            }
		},

	}
}