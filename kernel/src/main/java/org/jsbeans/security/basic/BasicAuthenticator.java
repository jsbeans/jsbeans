/*
 * This file is the part of jsBeans, high-level JavaScript client-server framework.
 * The contents of this file are subject to the MIT License (MIT).
 * (c) aa@sis.ru, da@sis.ru, Special Information Systems, LLC, 2011-2019
 *
 * Настоящий файл является частью клиент-сервеной JavaScript платформы.
 * Условия использования и распространения содержимого данного файла соответствуют программному обеспечению с открытыми исходными кодами и равнозначно MIT License (MIT).
 * Авторские права принадлежат aa@sis.ru, da@sis.ru, ООО СИС, 2011-2019гг.
 */

package org.jsbeans.security.basic;

import org.jsbeans.helpers.AuthHelper;
import org.jsbeans.security.AuthMessage;
import org.jsbeans.security.Authenticator;
import org.jsbeans.security.UserCredentialsRepository;

public class BasicAuthenticator extends Authenticator {

    public BasicAuthenticator(UserCredentialsRepository repo) {
        super(repo);
    }

    @Override
    public boolean checkAuth(AuthMessage msg) {
        BasicAuthMessage basicMsg = (BasicAuthMessage) msg;
        String pHash = this.getUserCredentialsRepository().getHash(basicMsg.getUserName());

        // generate MD5-based password hash from the source
        String md5hash = AuthHelper.md5(basicMsg.getUserName() + '@' + basicMsg.getPassword());
        if (md5hash == null) {
            return false;
        }
        return md5hash.equalsIgnoreCase(pHash);
    }

}
