/*
 * This file is the part of jsBeans, high-level JavaScript client-server framework.
 * The contents of this file are subject to the MIT License (MIT).
 * (c) aa@sis.ru, da@sis.ru, Special Information Systems, LLC, 2011-2019
 *
 * Настоящий файл является частью клиент-сервеной JavaScript платформы.
 * Условия использования и распространения содержимого данного файла соответствуют программному обеспечению с открытыми исходными кодами и равнозначно MIT License (MIT).
 * Авторские права принадлежат aa@sis.ru, da@sis.ru, ООО СИС, 2011-2019гг.
 */

package org.jsbeans.scripting;

import org.jsbeans.messages.AbstractMessage;

public class RemoveScopeMessage extends AbstractMessage<String> {
	private static final long serialVersionUID = -7045480862887556876L;
	private String scopePath = null;

    public RemoveScopeMessage(String scopePath) {
        this.scopePath = scopePath;
    }

    public String getScopePath() {
        return this.scopePath;
    }

}
