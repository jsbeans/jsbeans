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
import com.typesafe.config.Config;
import com.typesafe.config.ConfigObject;
import com.typesafe.config.ConfigValue;
import org.eclipse.jetty.http.HttpCookie.SameSite;
import org.eclipse.jetty.server.*;
import org.eclipse.jetty.server.handler.HandlerCollection;
import org.eclipse.jetty.server.handler.RequestLogHandler;
import org.eclipse.jetty.server.handler.gzip.GzipHandler;
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
import scala.concurrent.Await;
import scala.concurrent.Future;

import java.io.IOException;
import java.lang.reflect.InvocationTargetException;
import java.net.ServerSocket;
import java.util.Map;

//import org.eclipse.jetty.server.nio.SelectChannelConnector;

/**
 * @author Alex
 */
@DependsOn({JsHub.class, JsbRegistryService.class})
public class HttpService extends Service {

    public interface WebConfigurator {
        void configure(WebAppContext context, Config config);
    }

    private static final String WEB_MAIN            = "web.http";
    private static final String WEB_FACADES         = "web.http.facades";
    private static final String WEB_CONTEXT_OLD     = "web.config.path"; // deprecated

    private static final String _PORT               = "port";
    private static final String _COOKIE_SECURE      = "cookie.secure";
    private static final String _REQUEST_LOG        = "requestLog";
    private static final String _CONTEXT            = "webContext";
    private static final String _REQUEST_HEADER_SIZE  = "requestHeaderSize";
    private static final String _RESPONSE_BUFFER_SIZE = "responseBufferSize";
    private static final String _CONFIGURATOR         = "configurator";
    private static final String _HASCOMPRESSION		= "compression.enabled";
    private static final String _COMPRESSIONMINSIZE	= "compression.minSize";
    private static final String _COMPRESSIONLEVEL	= "compression.level";
    private static final String _FORWARDEDCONNECTOR	= "forwardedConnector";

    public static int DEFAULT_PORT = 8888;

    public static int findAvailablePort(int startPort, int endPort) throws IOException {
        for (int port = startPort; port <= endPort; startPort++) {
            try {
                ServerSocket s = new ServerSocket(port);
                s.close();
                return port;
            } catch (IOException ex) {
                continue; // try next port
            }
        }
        throw new IOException("No free port found (" + startPort + "-" + endPort + ")");
    }
    
    private final LoggingAdapter log = Logging.getLogger(getContext().system(), this);

    @Override
    protected void onInit() throws PlatformException {

        Core.getActorSystem().eventStream().subscribe(getSelf(), ServiceManagerService.Initialized.class);

        this.completeInitialization();
    }

    private void startJettyServer(String name, Config config) {
        int port = config.hasPath(_PORT) ? config.getInt(_PORT) : DEFAULT_PORT;

        Server server = new Server(port);
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
        try {
            String path = config.hasPath(_CONTEXT) ? config.getString(_CONTEXT) : ConfigHelper.getConfigString(WEB_CONTEXT_OLD);
            String webXml = context.getBaseResource().addPath(path).getURI().toString();
            context.setDescriptor(webXml);
        } catch (IOException e) {
            throw new RuntimeException(e);
        }
        context.setContextPath("/"); // TODO config
        context.getSessionHandler().setSessionCookie("_jsbSession_" + port);
        context.getSessionHandler().setSessionIdPathParameterName("_jsbsession_");
        if(config.hasPath(_COOKIE_SECURE) && config.getBoolean(_COOKIE_SECURE)){
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
        if(config.hasPath(_REQUEST_HEADER_SIZE)){
        	context.setMaxFormContentSize(config.getInt(_REQUEST_HEADER_SIZE));
        	server.setAttribute("org.eclipse.jetty.server.Request.maxFormContentSize", config.getInt(_REQUEST_HEADER_SIZE));
        }
        HandlerCollection handlers = new HandlerCollection();
        
        if(config.hasPath(_REQUEST_LOG+".enabled") && config.getBoolean(_REQUEST_LOG+".enabled")){
	        RequestLogHandler requestLogHandler = new RequestLogHandler();
	        handlers.addHandler(requestLogHandler);
	        String requestLogPath = config.getString(_REQUEST_LOG+".path");
	        NCSARequestLog requestLog = new NCSARequestLog(requestLogPath+"/request" + (name!=null?"-"+name:"") +".log");
	        requestLog.setRetainDays(10);
	        requestLog.setAppend(true);
	        requestLog.setExtended(true);
	        requestLog.setLogTimeZone("GMT");
	        requestLogHandler.setRequestLog(requestLog);
        }
        
        if(config.hasPath(_HASCOMPRESSION) && config.getBoolean(_HASCOMPRESSION)) {
        	GzipHandler gzipHandler = new GzipHandler();
            gzipHandler.setMinGzipSize(config.getInt(_COMPRESSIONMINSIZE));
            gzipHandler.setInflateBufferSize(2048);
            //gzipHandler.setCheckGzExists(false);
            if(config.hasPath(_COMPRESSIONLEVEL)) {
            	gzipHandler.setCompressionLevel(config.getInt(_COMPRESSIONLEVEL));
            }
            gzipHandler.setIncludedMimeTypes("text/html", "text/plain", "text/xml", "application/xhtml+xml", "application/json,", "text/css", "application/javascript", "application/x-javascript", "image/svg+xml", "image/x-icon", "image/gif", "image/jpg", "image/jpeg", "image/png");
            //gzipHandler.setExcludedAgentPatterns(".*MSIE.6\\.0.*");
            gzipHandler.setIncludedMethods("GET", "POST", "PUT", "DELETE");
            gzipHandler.setIncludedPaths("/*");
            gzipHandler.setHandler(context);
            handlers.addHandler(gzipHandler);
        } else {
        	handlers.addHandler(context);	
        }
        
        if(config.hasPath(_CONFIGURATOR) && config.getString(_CONFIGURATOR).trim().length() > 0) {
            try {
                Class<WebConfigurator> configuratorClass = (Class<WebConfigurator>) Class.forName(config.getString(_CONFIGURATOR));
                WebConfigurator configurator = configuratorClass.getConstructor().newInstance();
                configurator.configure(context, config);

            } catch (ClassNotFoundException | NoSuchMethodException | InvocationTargetException |
                     InstantiationException | IllegalAccessException e) {
                throw new RuntimeException(e);
            }
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
        msg.addThreadLocal("__webFacadeName", name);
        Future<Object> future = ActorHelper.futureAsk(ActorHelper.getActorSelection(JsHub.class), msg, timeout);
        try {
			Await.result(future, timeout.duration());
		} catch (Exception e1) {
		}

//        server.setErrorHandler(new ErrorHandler(){
//            @Override
//            protected void writeErrorPageBody(HttpServletRequest request, Writer writer, int code, String message, boolean showStacks) throws IOException{
//                String uri = request.getRequestURI();
//                writeErrorPageMessage(request, writer, code, message, uri);
//            }
//        });

        if(config.hasPath(_FORWARDEDCONNECTOR) && config.getBoolean(_FORWARDEDCONNECTOR)) {
            // Create HTTP Config
            HttpConfiguration httpConfig = new HttpConfiguration();
            // Add support for X-Forwarded headers
            httpConfig.addCustomizer( new org.eclipse.jetty.server.ForwardedRequestCustomizer() );
            // Create the http connector
            HttpConnectionFactory connectionFactory = new HttpConnectionFactory( httpConfig );
            ServerConnector connector = new ServerConnector(server, connectionFactory);
            // Make sure you set the port on the connector, the port in the Server constructor is overridden by the new connector
            connector.setPort( port );
            // Add the connector to the server
            server.setConnectors( new ServerConnector[] { connector } );
        }

        try {
            this.getLog().debug(String.format("Starting Jetty web server at %d", port));
            server.start();
        } catch (Exception e) {
            throw new PlatformException(e);
        }
        this.getLog().info("Web server started - :" + port + (name!=null?" ("+name+")":""));
    }


    @Override
    protected void onMessage(Object msg) throws PlatformException {
        if (msg instanceof ServiceManagerService.Initialized) {
            startJettyServer(null, ConfigHelper.getConfig().getConfig(WEB_MAIN));
            if(ConfigHelper.has(WEB_FACADES) && !(ConfigHelper.getConfig().getAnyRef(WEB_FACADES) instanceof Boolean)) {
                Config facades = ConfigHelper.getConfig().getConfig(WEB_FACADES);
                ConfigObject names = ConfigHelper.getConfig().getObject(WEB_FACADES);
                for(Map.Entry<String, ConfigValue> e: names.entrySet()) {
                    if(facades.getAnyRef(e.getKey()) instanceof Boolean) {
                        continue;
                    }

                    startJettyServer(e.getKey(), facades.getConfig(e.getKey()));
                }
            }
            Core.getActorSystem().eventStream().publish(new Initialized());
        } else {
            unhandled(msg);
        }
    }

    public static class Initialized extends SubjectMessage {
		private static final long serialVersionUID = -618525700041876036L;
    }
}
