/**
 *
 */
package org.jsbeans.web;

import akka.event.Logging;
import akka.event.LoggingAdapter;
import org.eclipse.jetty.server.Server;
import org.eclipse.jetty.util.resource.ResourceCollection;
import org.eclipse.jetty.webapp.WebAppContext;
import org.jsbeans.Core;
import org.jsbeans.PlatformException;
import org.jsbeans.helpers.ConfigHelper;
import org.jsbeans.scripting.JsHub;
import org.jsbeans.scripting.jso.JsoRegistryService;
import org.jsbeans.security.SecurityService;
import org.jsbeans.services.DependsOn;
import org.jsbeans.services.Service;
import org.jsbeans.services.ServiceManagerService;

//import org.eclipse.jetty.server.nio.SelectChannelConnector;

/**
 * @author Alex
 */
@DependsOn({JsHub.class, JsoRegistryService.class, SecurityService.class})
public class HttpService extends Service {
    private static final String WEB_FOLDER_KEY = "web.folder";
    private static final String WEB_PORT_KEY = "web.http-port";
    private final LoggingAdapter log = Logging.getLogger(getContext().system(), this);

    @Override
    protected void onInit() throws PlatformException {

        Core.getActorSystem().eventStream().subscribe(getSelf(), ServiceManagerService.Initialized.class);

        this.completeInitialization();
    }

    private void startJettyServer() {
        Integer portVal = ConfigHelper.getConfigInt(WEB_PORT_KEY);
        if (portVal == null) {
            portVal = 8888;
        }

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

        context.setDescriptor("WEB-INF/web.xml");
        context.setContextPath("/");
        server.setHandler(context);
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
