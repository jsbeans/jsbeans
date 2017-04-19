package org.jsbeans;

import org.jsbeans.helpers.ConfigHelper;
import org.jsbeans.plugin.PluginActivator;
import org.jsbeans.sharedresource.LockRequest;
import org.jsbeans.sharedresource.SharedResourceManager;
import org.jsbeans.sharedresource.SharedResourceManagerFactory;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.time.Duration;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

public class WorkerPluginActivator implements PluginActivator {
    private final Logger logger = LoggerFactory.getLogger(this.getClass());

    @Override @SuppressWarnings("unchecked")
    public void init() {
        List<Map<String, Object>> descritors  = ConfigHelper.getConfig()
                .getList("jsbeans.worker.descriptors").unwrapped()
                .stream().map(o -> (Map<String, Object>) o).collect(Collectors.toList());

        SharedResourceManagerFactory.load(descritors);
        logger.info("Initialized " + descritors.size() + " resources");

        test();
    }

    private void test() {
        SharedResourceManager man = SharedResourceManagerFactory.getInstance();
        LockRequest req = LockRequest.all(Duration.ofSeconds(60));
        man.lock(req, (lock, err) -> {
            if (err != null) {
                logger.error("Lock error: " + err);
            } else {
                logger.info("Locked: " + lock);

                man.release(lock);
            }
        });
    }

}
