package org.jsbeans.security;

import org.jsbeans.types.JsonObject;

public interface UserCredentialsRepository {

    String getHash(String user);

    void addUser(String user, String hash);

    void deleteUser(String user);

    JsonObject getUserCredentials(String user);

    void setUserCredentials(String user, JsonObject json);
}
