package org.jsbeans.security;

import java.lang.annotation.*;

@Target(ElementType.TYPE)
@Retention(RetentionPolicy.RUNTIME)
@Inherited
public @interface Auth {
    Class<? extends Authenticator> auth();
}
