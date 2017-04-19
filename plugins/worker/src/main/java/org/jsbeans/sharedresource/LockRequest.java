package org.jsbeans.sharedresource;

import java.time.Duration;
import java.util.Arrays;
import java.util.Collection;
import java.util.Collections;
import java.util.Map;
import java.util.stream.Collectors;

public class LockRequest {
    private Collection<SharedResource> templates;
    private Duration reserveDurationTimeout;

    public LockRequest(SharedResource template, Duration reserveDurationTimeout) {
        this.templates = Collections.singleton(template);
        this.reserveDurationTimeout = reserveDurationTimeout;
    }

    public LockRequest(Collection<SharedResource> templates, Duration reserveDurationTimeout) {
        this.templates = templates;
        this.reserveDurationTimeout = reserveDurationTimeout;
    }

    public Collection<SharedResource> getTemplates() {
        return templates;
    }

    public Duration getReserveDurationTimeout() {
        return reserveDurationTimeout;
    }

    public static LockRequest create(Duration timeout, Map<String, Object> ... template) {
        return new LockRequest(
                Arrays.stream(template).map(SharedResource::new)
                    .collect(Collectors.toList()), timeout);
    }

    public static LockRequest create(Map<String, Object> template, Duration timeout) {
        return new LockRequest(new SharedResource(template), timeout);
    }

    public static LockRequest all(Duration timeout) {
        return new LockRequest(new SharedResource(Collections.emptyMap()), timeout);
    }
}
