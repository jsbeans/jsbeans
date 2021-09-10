package org.jsbeans.messages;

import javax.security.auth.Subject;
import java.security.AccessControlContext;
import java.security.AccessController;

/** AccessControlContext ans Subject bind message
 * */
public class SubjectMessage implements Message {
    private Subject accessControlSubject = Subject.getSubject(AccessController.getContext());
    private transient AccessControlContext accessControlContext =  AccessController.getContext();

    public Subject getAccessControlSubject() {
        return accessControlSubject;
    }
    public AccessControlContext getAccessControlContext() {
        return accessControlContext;
    }
}
