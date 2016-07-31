package org.jsbeans.security;

public interface TokenRepository {
    Token getToken(String tokenString);

    void saveToken(Token t);

    void removeToken(String tokenString);

    void loadAllTokens(TokenIterable r);
}
