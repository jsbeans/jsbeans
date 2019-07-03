/*
 * This file is the part of jsBeans, high-level JavaScript client-server framework.
 * The contents of this file are subject to the MIT License (MIT).
 * (c) aa@sis.ru, da@sis.ru, Special Information Systems, LLC, 2011-2019
 *
 * Настоящий файл является частью клиент-сервеной JavaScript платформы.
 * Условия использования и распространения содержимого данного файла соответствуют программному обеспечению с открытыми исходными кодами и равнозначно MIT License (MIT).
 * Авторские права принадлежат aa@sis.ru, da@sis.ru, ООО СИС, 2011-2019гг.
 */

/**
 *
 */
package org.jsbeans.web;

import akka.event.Logging;
import akka.event.LoggingAdapter;

import org.eclipse.jetty.server.Connector;
import org.eclipse.jetty.server.Server;
import org.eclipse.jetty.server.SessionManager;
import org.eclipse.jetty.server.session.SessionHandler;
import org.eclipse.jetty.util.resource.ResourceCollection;
import org.eclipse.jetty.webapp.WebAppContext;
import org.jsbeans.Core;
import org.jsbeans.PlatformException;
import org.jsbeans.helpers.ConfigHelper;
import org.jsbeans.scripting.JsHub;
import org.jsbeans.scripting.jsb.JsbRegistryService;
import org.jsbeans.security.SecurityService;
import org.jsbeans.services.DependsOn;
import org.jsbeans.services.Service;
import org.jsbeans.services.ServiceManagerService;

//import org.eclipse.jetty.server.nio.SelectChannelConnector;

/**
 * @author Alex
 */
@DependsOn({JsHub.class, JsbRegistryService.class, SecurityService.class})
public class HttpService extends Service {
//    private static final String WEB_FOLDER_KEY = "web.folder";
    private static final String WEB_PORT_KEY = "web.http.port";
    private static final String WEB_XML = "web.config";
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

    	String webXml = ConfigHelper.has(WEB_XML)
                ? ConfigHelper.getConfigString(WEB_XML)
                : "WEB-INF/web.xml";

        Server server = new Server(portVal);
        server.setAttribute("org.eclipse.jetty.server.Request.maxFormContentSize", -1);
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

//        context.setDescriptor(webXml);
        context.setContextPath("/");
        SessionManager sm = context.getSessionHandler().getSessionManager();
        sm.getSessionCookieConfig().setName("_jsbSession_" + portVal.toString());
        
        // prevent directory browsing
        context.setInitParameter("org.eclipse.jetty.servlet.Default.dirAllowed", "false");

        server.setHandler(context);
        
        // set requestHeaderSize for long cross-domain GET requests
        if(ConfigHelper.has(WEB_REQUEST_HEADER_SIZE)){
    		int requestHeaderSize = ConfigHelper.getConfigInt(WEB_REQUEST_HEADER_SIZE);
            for (Connector c : server.getConnectors()) {
            	c.setRequestHeaderSize(requestHeaderSize);
            }
    	}
        
        // set responseBufferSize for large response
        if(ConfigHelper.has(WEB_RESPONSE_BUFFER_SIZE)){
    		int responseBufferSize = ConfigHelper.getConfigInt(WEB_RESPONSE_BUFFER_SIZE);
            for (Connector c : server.getConnectors()) {
            	c.setResponseBufferSize(responseBufferSize);
            }
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
        } else {
            unhandled(msg);
        }
    }


}