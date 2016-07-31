package org.jsbeans.services;

import org.jsbeans.messages.Message;

import java.util.ArrayList;
import java.util.Collection;
import java.util.List;

public class ServiceMessage implements Message {
    private static final long serialVersionUID = 3189832890701743099L;

    private List<String> services = new ArrayList<>();

    public Collection<String> getCollection() {
        return services;
    }
}
