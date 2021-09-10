/*
 * This file is the part of jsBeans, high-level JavaScript client-server framework.
 * The contents of this file are subject to the MIT Licence (MIT).
 * (c) aa@sis.ru, da@sis.ru, Special Information Systems, LLC, 2011-2019
 *
 * Настоящий файл является частью клиент-сервеной JavaScript платформы.
 * Условия использования и распространения содержимого данного файла соответствуют программному обеспечению с открытыми исходными кодами и равнозначно MIT Licence (MIT).
 * Авторские права принадлежат aa@sis.ru, da@sis.ru, ООО СИС, 2011-2019гг.
 */

/**
 *
 */
package org.jsbeans.web;

import akka.event.Logging;
import akka.event.LoggingAdapter;
import akka.util.Timeout;
import org.eclipse.jetty.util.resource.Resource;
import scala.concurrent.Await;
import scala.concurrent.Future;
import org.eclipse.jetty.http.HttpCookie.SameSite;
import org.eclipse.jetty.server.Connector;
import org.eclipse.jetty.server.Handler;
import org.eclipse.jetty.server.NCSARequestLog;
import org.eclipse.jetty.server.Server;
import org.eclipse.jetty.server.handler.ContextHandlerCollection;
import org.eclipse.jetty.server.handler.DefaultHandler;
import org.eclipse.jetty.server.handler.HandlerCollection;
import org.eclipse.jetty.server.handler.RequestLogHandler;
import org.eclipse.jetty.util.resource.ResourceCollection;
import org.eclipse.jetty.webapp.WebAppContext;
import org.jsbeans.Core;
import org.jsbeans.PlatformException;
import org.jsbeans.helpers.ActorHelper;
import org.jsbeans.helpers.ConfigHelper;
import org.jsbeans.messages.SubjectMessage;
import org.jsbeans.scripting.ExecuteScriptMessage;
import org.jsbeans.scripting.JsHub;
import org.jsbeans.scripting.jsb.JsbRegistryService;
import org.jsbeans.services.DependsOn;
import org.jsbeans.services.Service;
import org.jsbeans.services.ServiceManagerService;

import java.io.IOException;

//import org.eclipse.jetty.server.nio.SelectChannelConnector;

/**
 * @author Alex
 */
@DependsOn({JsHub.class, JsbRegistryService.class})
public class HttpService extends Service {
//    private static final String WEB_FOLDER_KEY = "web.folder";
    private static final String WEB_PORT_KEY = "web.http.port";
    private static final String WEB_SECURE_KEY = "web.secure";
    private static final String WEB_REQUEST_LOG = "web.writerequestlog";
    private static final String WEB_XML = "web.config.path";
    private static final String WEB_REQUEST_HEADER_SIZE = "web.http.requestHeaderSize";
    private static final String WEB_RESPONSE_BUFFER_SIZE = "web.http.responseBufferSize";

    public static final int DEFAULT_PORT = 8888;
    
    private final LoggingAdapter log = Logging.getLogger(getContext().system(), this);

    @Override
    protected void onInit() throws PlatformException {

        Core.getActorSystem().eventStream().subscribe(getSelf(), ServiceManagerService.Initialized.class);

        this.completeInitialization();
    }

    private void startJettyServer() {
    	Integer portVal = DEFAULT_PORT;
    	if(ConfigHelper.has(WEB_PORT_KEY)){
    		portVal = ConfigHelper.getConfigInt(WEB_PORT_KEY);
    	}

        Server server = new Server(portVal);
        
/*		
        SelectChannelConnector c = new SelectChannelConnector();
		c.setForwarded(true);
		server.addConnector(c);
*/
        WebAppContext context = new WebAppContext();
/*
		String folder = ConfigHelper.getConfigString(WEB_FOLDER_KEY);
		if(folder == null){
			folder = "web";
		}
    	String ff = ConfigHelper.getRootFolder() + folder;
    	log.info(String.format("Setting web folder: '%s'", ff));
		ConfigHelper.addWebFolder(ff);
*/
        ResourceCollection resources = new ResourceCollection(ConfigHelper.getWebFolders().toArray(new String[0]));

//        context.setResourceBase(ConfigHelper.getWebFolder());
        context.setBaseResource(resources);
        if (ConfigHelper.has(WEB_XML)) {
            String webXml = null;
            try {
                webXml = context.getBaseResource().addPath(ConfigHelper.getConfigString(WEB_XML)).getURI().toString();
                context.setDescriptor(webXml);
            } catch (IOException e) {
            }
        }
        context.setContextPath("/");
        context.getSessionHandler().setSessionCookie("_jsbSession_" + portVal.toString());
        context.getSessionHandler().setSessionIdPathParameterName("_jsbsession_");
        
        if(ConfigHelper.has(WEB_SECURE_KEY) && ConfigHelper.getConfigBoolean(WEB_SECURE_KEY)){
            context.getSessionHandler().setSameSite(SameSite.NONE);
            context.getSessionHandler().getSessionCookieConfig().setSecure(true);
        }
        
        
        
/*        
        Set<SessionTrackingMode> hs = new HashSet<SessionTrackingMode>();
        hs.add(SessionTrackingMode.SSL);
        sm.setSessionTrackingModes(hs);
*/        
/*        
        Set<SessionTrackingMode> ss = sm.getDefaultSessionTrackingModes();
        Set<SessionTrackingMode> ss2 = sm.getEffectiveSessionTrackingModes();
*/
        
        // prevent directory browsing
        context.setInitParameter("org.eclipse.jetty.servlet.Default.dirAllowed", "false");
        
        // set requestHeaderSize for long POST-requests
        if(ConfigHelper.has(WEB_REQUEST_HEADER_SIZE)){
        	context.setMaxFormContentSize(ConfigHelper.getConfigInt(WEB_REQUEST_HEADER_SIZE));
        	server.setAttribute("org.eclipse.jetty.server.Request.maxFormContentSize", ConfigHelper.getConfigInt(WEB_REQUEST_HEADER_SIZE));
        }
        
        HandlerCollection handlers = new HandlerCollection();
        handlers.addHandler(context);
        
        if(ConfigHelper.has(WEB_REQUEST_LOG) && ConfigHelper.getConfigBoolean(WEB_REQUEST_LOG)){
	        RequestLogHandler requestLogHandler = new RequestLogHandler();
	        handlers.addHandler(requestLogHandler);
	        NCSARequestLog requestLog = new NCSARequestLog("./logs/request.log");
	        requestLog.setRetainDays(10);
	        requestLog.setAppend(true);
	        requestLog.setExtended(true);
	        requestLog.setLogTimeZone("GMT");
	        requestLogHandler.setRequestLog(requestLog);
        }

        server.setHandler(handlers);
//        server.setHandler(context);
        
        
/*        
        // set requestHeaderSize for long cross-domain GET requests
        if(ConfigHelper.has(WEB_REQUEST_HEADER_SIZE)){
    		int requestHeaderSize = ConfigHelper.getConfigInt(WEB_REQUEST_HEADER_SIZE);
            for (Connector c : server.getConnectors()) {
            	c.setRequestHeaderSize(requestHeaderSize);
            }
    	}
/*        
        // set responseBufferSize for large response
        if(ConfigHelper.has(WEB_RESPONSE_BUFFER_SIZE)){
    		int responseBufferSize = ConfigHelper.getConfigInt(WEB_RESPONSE_BUFFER_SIZE);
            for (Connector c : server.getConnectors()) {
            	c.setResponseBufferSize(responseBufferSize);
            }
    	}
*/
        
        Timeout timeout = ActorHelper.getServiceCommTimeout();
        ExecuteScriptMessage msg = new ExecuteScriptMessage("JSB.getInstance('JSB.Web')._setAppContext(JSB.getThreadLocal().get('__appContext'));", false);
        msg.addThreadLocal("__appContext", context);
        Future<Object> future = ActorHelper.futureAsk(ActorHelper.getActorSelection(JsHub.class), msg, timeout);
        try {
			Await.result(future, timeout.duration());
		} catch (Exception e1) {
		}
        
        try {
            this.getLog().debug(String.format("Starting Jetty web server at %d", portVal.intValue()));
            server.start();
        } catch (Exception e) {
            throw new PlatformException(e);
        }
        this.getLog().debug("Web server started");
        
    }


    @Override
    protected void onMessage(Object msg) throws PlatformException {
        if (msg instanceof ServiceManagerService.Initialized) {
            startJettyServer();
            Core.getActorSystem().eventStream().publish(new Initialized());
        } else {
            unhandled(msg);
        }
    }

    public static class Initialized extends SubjectMessage {
		private static final long serialVersionUID = -618525700041876036L;
    }
}
