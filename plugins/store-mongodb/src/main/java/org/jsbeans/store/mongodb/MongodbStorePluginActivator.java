package org.jsbeans.store.mongodb;

import com.mongodb.*;
import com.mongodb.internal.connection.ServerAddressHelper;
import org.bson.BsonDocument;
import org.bson.conversions.Bson;
import org.jsbeans.helpers.ConfigHelper;
import org.jsbeans.plugin.DependsOn;
import org.jsbeans.plugin.KernelPluginActivator;
import org.jsbeans.plugin.PluginActivator;
import org.jsbeans.store.StorePluginActivator;

import java.util.Collections;

@DependsOn({KernelPluginActivator.class, StorePluginActivator.class})
public class MongodbStorePluginActivator implements PluginActivator {
    public void init() {
        String folder = ConfigHelper.getConfigString("store.folder");
        if (folder == null) {
            folder = "web";
        }
        String ff = ConfigHelper.getPluginHomeFolder(this) + "/" + folder;

        ConfigHelper.addJssFolder(ff);
        ConfigHelper.addWebFolder(ff);
    }

//    private static void foo(){
//
//        Collections.singletonList();
//        String url = "";
//
//        new MongoClient(
//                ServerAddressHelper.createServerAddress(url),
//                new MongoCredential(AuthenticationMechanism.valueOf("MONGODB-CR"), username, db, password, null),
//                MongoClientOptions.builder().build(),
//                MongoDriverInformation.builder().build()
//        ).getDatabase("").runCommand()
//    }
}
