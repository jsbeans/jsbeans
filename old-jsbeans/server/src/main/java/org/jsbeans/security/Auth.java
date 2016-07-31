package org.jsbeans.security;

@Target(ElementType.TYPE)
@Retention(RetentionPolicy.RUNTIME)
@Inherited
public @interface Auth {
    Class<? extends Authenticator> auth();
}
