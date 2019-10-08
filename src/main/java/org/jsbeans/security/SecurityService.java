/*
 * This file is the part of jsBeans, high-level JavaScript client-server framework.
 * The contents of this file are subject to the MIT Licence (MIT).
 * (c) aa@sis.ru, da@sis.ru, Special Information Systems, LLC, 2011-2019
 *
 * Настоящий файл является частью клиент-сервеной JavaScript платформы.
 * Условия использования и распространения содержимого данного файла соответствуют программному обеспечению с открытыми исходными кодами и равнозначно MIT Licence (MIT).
 * Авторские права принадлежат aa@sis.ru, da@sis.ru, ООО СИС, 2011-2019гг.
 */

package org.jsbeans.security;

import org.jsbeans.Core;
import org.jsbeans.PlatformException;
import org.jsbeans.helpers.AuthHelper;
import org.jsbeans.helpers.ConfigHelper;
import org.jsbeans.messages.Message;
import org.jsbeans.security.AuthMessage.Target;
import org.jsbeans.services.Service;
import org.jsbeans.types.JsonArray;
import org.jsbeans.types.JsonObject;
import scala.concurrent.duration.Duration;

import javax.naming.AuthenticationException;
import java.util.ArrayList;
import java.util.Iterator;
import java.util.List;
import java.util.Map;
import java.util.Map.Entry;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.TimeUnit;

public class SecurityService extends Service {
    private long tokenUpdateInterval = 300000;    // 5 mins
    private Map<String, Token> tokenMap = new ConcurrentHashMap<String, Token>();
    private UserCredentialsRepository userCredRepo = null;
    private TokenRepository tokenRepo = null;
    private PermissionsRepository permissionsRepo = null;
    private Boolean enabled = true;


    @SuppressWarnings("unchecked")
    @Override
    protected void onInit() throws PlatformException {
        // initialize user credentials repository
        this.enabled = ConfigHelper.getConfigBoolean("kernel.security.enabled");

        if (this.enabled) {
            this.tokenUpdateInterval = ConfigHelper.getConfigInt("kernel.security.tokenUpdateInterval");
            String userRepoClassName = ConfigHelper.getConfigString("kernel.security.userCredentialsRepository");
            String tokenRepoClassName = ConfigHelper.getConfigString("kernel.security.tokenRepository");
            String permissionsRepositoryClassName = ConfigHelper.getConfigString("kernel.security.permissionsRepository");

            try {
                // create user credentials repo
                Class<? extends UserCredentialsRepository> userRepoClass = (Class<? extends UserCredentialsRepository>) Class.forName(userRepoClassName);
                userCredRepo = userRepoClass.newInstance();

                // add root user
                String adminUser = ConfigHelper.getConfigString("kernel.security.admin.user");
                String adminPassword = ConfigHelper.getConfigString("kernel.security.admin.password");
                String hash = AuthHelper.md5(adminUser + "@" + adminPassword);
                userCredRepo.addUser(adminUser, hash);

                // create token repo
                Class<? extends TokenRepository> tokenRepoClass = (Class<? extends TokenRepository>) Class.forName(tokenRepoClassName);
                if (tokenRepoClass.equals(userRepoClass)) {
                    tokenRepo = (TokenRepository) userCredRepo;
                } else {
                    tokenRepo = tokenRepoClass.newInstance();
                }

                // create permissions repo
                Class<? extends PermissionsRepository> permissionsRepoClass = (Class<? extends PermissionsRepository>) Class.forName(permissionsRepositoryClassName);
                if (permissionsRepoClass.equals(userRepoClass)) {
                    permissionsRepo = (PermissionsRepository) userCredRepo;
                } else if (permissionsRepoClass.equals(tokenRepoClass)) {
                	permissionsRepo = (PermissionsRepository) tokenRepo;
                } else {
                    permissionsRepo = permissionsRepoClass.newInstance();
                }

                // load all tokens from the repo
                this.tokenRepo.loadAllTokens(new TokenIterable() {
                    @Override
                    public void run() {
                        Token t = this.getToken();
                        tokenMap.put(t.getToken(), t);
                    }
                });
            } catch (Exception e) {
                throw new PlatformException(e);
            }

            // Run garbage collection timer to avoid old sessions
            Core.getActorSystem().scheduler().schedule(
                    Duration.Zero(),
                    Duration.create(this.tokenUpdateInterval, TimeUnit.MILLISECONDS),
                    getSelf(),
                    Message.TICK,
                    Core.getActorSystem().dispatcher(),
                    getSelf());
        }
        super.onInit();
    }


    @Override
    protected void onMessage(Object msg) throws PlatformException {

        if (msg.equals(Message.TICK)) {
            this.updateTokens();
        } else if (msg instanceof AuthMessage) {
            this.doAuth((AuthMessage) msg);
        } else if (msg instanceof GetTokenMessage) {
            this.handleGetToken((GetTokenMessage) msg);
        } else if (msg instanceof RemoveTokenMessage) {
            this.handleRemoveToken((RemoveTokenMessage) msg);
        } else if (msg instanceof GetUserCredentialsMessage) {
            this.handleGetUserCredentials((GetUserCredentialsMessage) msg);
        } else if (msg instanceof SetUserCredentialsMessage) {
            this.handleSetUserCredentials((SetUserCredentialsMessage) msg);
        } else if (msg instanceof CreateUserMessage) {
            this.handleCreateUserMessage((CreateUserMessage) msg);
        } else if (msg instanceof DeleteUserMessage) {
            this.handleDeleteUserMessage((DeleteUserMessage) msg);
        } else if (msg instanceof CheckPermissionMessage) {
            this.handleCheckPermissionMessage((CheckPermissionMessage) msg);
        } else if (msg instanceof AddPermissionsMessage) {
            this.handleAddPermissionsMessage((AddPermissionsMessage) msg);
        } else if (msg instanceof RemovePermissionsMessage) {
            this.handleRemovePermissionsMessage((RemovePermissionsMessage) msg);
        } else {
            unhandled(msg);
        }
    }

    private boolean isAdmin(PrincipalMessage<?> msg) {
        if (!this.enabled) {
            return true;
        }
        if (msg.getUserPrincipal() == null) {
            return false;
        }
        return msg.getUserPrincipal().equals(ConfigHelper.getConfigString("kernel.security.admin.user"));
    }

    private void handleDeleteUserMessage(DeleteUserMessage msg) {
        if (!this.enabled) {
            getSender().tell(msg.createResponse(false), getSelf());
            return;
        }
        if (!this.isAdmin(msg)) {
            getSender().tell(msg.createError(new AuthenticationException("Admininstrator privileges required to delete user")), getSelf());
            getLog().error("Admininstrator privileges required to delete user");
            return;
        }
        if (msg.getUserName().equals(ConfigHelper.getConfigString("kernel.security.admin.user"))) {
            getSender().tell(msg.createError(new AuthenticationException("Admininstrator user can't be deleted")), getSelf());
            getLog().error("Admininstrator user can't be deleted");
            return;
        }

        JsonObject credentials = this.userCredRepo.getUserCredentials(msg.getUserName());
        if (credentials != null) {
            JsonArray keys = credentials.getAsArray("permissions");
            if (keys != null) {
                for (Object key : keys) {
                    this.permissionsRepo.removePermissions(msg.getUserName(), key.toString(), null);
                }
            }
            this.userCredRepo.deleteUser(msg.getUserName());
        }

        getLog().info("User '" + msg.getUserName() + "' has been successfully removed with permissions by " + msg.getUserPrincipal());
        getSender().tell(msg.createResponse(true), getSelf());
    }


    private void handleCreateUserMessage(CreateUserMessage msg) {
        if (!this.enabled) {
            getSender().tell(msg.createResponse(false), getSelf());
            return;
        }
        if (!this.isAdmin(msg)) {
            getLog().error("Admininstrator privileges required to create user");
            getSender().tell(msg.createError(new AuthenticationException("Admininstrator privileges required to create user")), getSelf());
            return;
        }
        String hash = AuthHelper.md5(msg.getUserName() + "@" + msg.getPassword());
        this.userCredRepo.addUser(msg.getUserName(), hash);
        getLog().info("User '" + msg.getUserName() + "' has been successfully created by " + msg.getUserPrincipal());
        getSender().tell(msg.createResponse(true), getSelf());
    }


    private void handleGetUserCredentials(GetUserCredentialsMessage msg) {
        if (!this.enabled) {
            getSender().tell(msg.createResponse(null), getSelf());
            return;
        }

        String userName = msg.getUserName();
        if (userName == null) {
            userName = msg.getUserPrincipal();
        }
        if (!this.isAdmin(msg) && userName.compareTo(msg.getUserPrincipal()) != 0) {
            getLog().error("Admininstrator privileges required to get user credentials");
            getSender().tell(msg.createError(new AuthenticationException("Admininstrator privileges required to get user credentials")), getSelf());
            return;
        }
        JsonObject cred = this.userCredRepo.getUserCredentials(userName);
        getSender().tell(msg.createResponse(cred), getSelf());
    }

    private void handleSetUserCredentials(SetUserCredentialsMessage msg) {
        if (!this.enabled) {
            getSender().tell(msg.createResponse(false), getSelf());
            return;
        }

        String userName = msg.getUserName();
        if (userName == null) {
            userName = msg.getUserPrincipal();
        }
        if (!this.isAdmin(msg) && userName.compareTo(msg.getUserPrincipal()) != 0) {
            getLog().error("Admininstrator privileges required to set user credentials");
            getSender().tell(msg.createError(new AuthenticationException("Admininstrator privileges required to set user credentials")), getSelf());
            return;
        }

        this.userCredRepo.setUserCredentials(userName, msg.getCredentials());
        getLog().info("Credentials of user '" + msg.getUserName() + "' has been successfully updated by " + msg.getUserPrincipal());
        getSender().tell(msg.createResponse(true), getSelf());
    }

    private void handleRemoveToken(RemoveTokenMessage msg) {
        if (!this.enabled) {
            getSender().tell(msg.createResponse(false), getSelf());
            return;
        }

        if (this.tokenMap.containsKey(msg.getToken())) {
            this.getLog().info("User '" + this.tokenMap.get(msg.getToken()).getUserName() + "' has logged out");
            this.removeToken(msg.getToken());
            getSender().tell(msg.createResponse(true), getSelf());
        } else {
            getSender().tell(msg.createResponse(false), getSelf());
        }
    }

    private void removeToken(String tokenStr) {
        // remove from local map
        if (this.tokenMap.containsKey(tokenStr)) {
            this.tokenMap.remove(tokenStr);
        }

        // remove from token repo
        this.tokenRepo.removeToken(tokenStr);
    }


    private void handleGetToken(GetTokenMessage msg) {
        if (!this.enabled) {
            getSender().tell(msg.createResponse(new FullAccessToken("admin")), getSelf());
            return;
        }

        Token t = null;
        if (!this.tokenMap.containsKey(msg.getToken())) {
            // try to get from token repo
            t = this.tokenRepo.getToken(msg.getToken());
            if (t == null) {
                this.getLog().error("Requested token: " + msg.getToken() + " is missing or expired");
                getSender().tell(msg.createError(new PlatformException("Missing or expired")), getSelf());
                return;
            } else {
                this.tokenMap.put(t.getToken(), t);
            }
        } else {
            t = this.tokenMap.get(msg.getToken());
        }

        if (t == null) {
            throw new PlatformException("handleGetToken internal error");
        }

        // check token actual
        if (t.isExpired()) {
            // remove token
            this.getLog().info("User's '" + t.getUserName() + "' token has expired");
            this.removeToken(t.getToken());
            getSender().tell(msg.createError(new PlatformException("Token expired")), getSelf());
            return;
        }

        getSender().tell(msg.createResponse(t), getSelf());
    }


    private void doAuth(AuthMessage msg) throws PlatformException {

        if (!this.enabled) {
            this.getLog().warn("Security disabled");
            getSender().tell(msg.createResponse(null), getSelf());
            return;
        }

        Auth annot = msg.getClass().getAnnotation(Auth.class);
        Class<? extends Authenticator> authenticatorCls = annot.auth();
        Token token = null;
        try {
            Authenticator auth = authenticatorCls.getDeclaredConstructor(UserCredentialsRepository.class).newInstance(this.userCredRepo);
            if (auth.checkAuth(msg)) {
                // create token indicates that the user has successfully been logged in
                if (msg.getTarget() == Target.API) {
                    token = new ApiToken(msg.getUserName());
                } else if (msg.getTarget() == null || msg.getTarget() == Target.WEB) {
                    token = new WebToken(msg.getUserName());
                } else {
                    throw new PlatformException("Unexpected target type: " + msg.getTarget().toString());
                }
                if (!msg.isTemporary()) {
                    tokenMap.put(token.getToken(), token);
                    this.tokenRepo.saveToken(token);
                }
                getSender().tell(msg.createResponse(token.getToken()), getSelf());
                this.getLog().info("User '" + msg.getUserName() + "' has successfully been logged in with token: " + token.getToken());
            } else {
                throw new PlatformException("User '" + msg.getUserName() + "' not authorized");
            }
        } catch (PlatformException e) {
            getSender().tell(msg.createError(e), getSelf());
            throw e;
        } catch (Exception e) {
            getSender().tell(msg.createError(new PlatformException(e)), getSelf());
            throw new PlatformException(e);
        }

    }

    private void updateTokens() {
        List<String> tokensToRemove = null;
        Iterator<Entry<String, Token>> itr = this.tokenMap.entrySet().iterator();
        while (itr.hasNext()) {
            Entry<String, Token> entry = itr.next();
            Token t = entry.getValue();
            if (t.isExpired()) {
                if (tokensToRemove == null) {
                    tokensToRemove = new ArrayList<String>();
                }
                tokensToRemove.add(entry.getKey());
            }

        }
        if (tokensToRemove != null) {
            for (String s : tokensToRemove) {
                this.getLog().info("User's '" + this.tokenMap.get(s).getUserName() + "' token: " + s + " has been expired");
                this.removeToken(s);
            }
        }
    }

    private void handleRemovePermissionsMessage(RemovePermissionsMessage msg) {
        if (!this.enabled) {
            getSender().tell(msg.createResponse(null), getSelf());
            return;
        }

        if (!this.isAdmin(msg)) {
            getLog().error("Admininstrator privileges required to remove user`s permissions");
            getSender().tell(msg.createError(new AuthenticationException("Admininstrator privileges required to remove user`s permissions")), getSelf());
            return;
        }

        int count = this.permissionsRepo.removePermissions(msg.getUserName(), msg.getPermissionKey(), msg.getPermission());
        getSender().tell(msg.createResponse(count), getSelf());
    }

    private void handleAddPermissionsMessage(AddPermissionsMessage msg) {
        if (!this.enabled) {
            getSender().tell(msg.createResponse(false), getSelf());
            return;
        }

        if (!this.isAdmin(msg)) {
            getLog().error("Admininstrator privileges required to add user`s permissions");
            getSender().tell(msg.createError(new AuthenticationException("Admininstrator privileges required to add user`s permissions")), getSelf());
            return;
        }

        this.permissionsRepo.addPermissions(msg.getUserName(), msg.getPermissionKey(), msg.getPermissions());
        getSender().tell(msg.createResponse(true), getSelf());
    }

    private void handleCheckPermissionMessage(CheckPermissionMessage msg) {
        if (!this.enabled) {
            getSender().tell(msg.createResponse(null), getSelf());
            return;
        }

        String userName = msg.getUserName();
        if (userName == null) {
            userName = msg.getUserPrincipal();
        }

        JsonObject attrs = this.permissionsRepo.checkPermission(userName, msg.getPermission(), msg.getUse());
        getSender().tell(msg.createResponse(attrs), getSelf());
    }

}
