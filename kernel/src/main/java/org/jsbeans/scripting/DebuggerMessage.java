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

import org.jsbeans.messages.Message;

public class DebuggerMessage implements Message {
	private static final long serialVersionUID = 1691477983144408055L;

	private boolean stop;

    private boolean breakOnStart = false;
    private boolean breakOnEnter = false;
    private boolean breakOnReturn = false;
    private boolean breakOnExceptions = false;

    public DebuggerMessage() {
        this(false);
    }

    public DebuggerMessage(boolean breakOnStart, boolean breakOnEnter, boolean breakOnReturn, boolean breakOnExceptions) {
        this(false);
        this.breakOnStart = breakOnStart;
        this.breakOnEnter = breakOnEnter;
        this.breakOnReturn = breakOnReturn;
        this.breakOnExceptions = breakOnExceptions;
    }

    public DebuggerMessage(boolean stop) {
        this.stop = stop;
    }

    public boolean isStop() {
        return stop;
    }

    public void setStop(boolean stop) {
        this.stop = stop;
    }

    public boolean isBreakOnEnter() {
        return breakOnEnter;
    }

    public void setBreakOnEnter(boolean breakOnEnter) {
        this.breakOnEnter = breakOnEnter;
    }

    public boolean isBreakOnReturn() {
        return breakOnReturn;
    }

    public void setBreakOnReturn(boolean breakOnReturn) {
        this.breakOnReturn = breakOnReturn;
    }

    public boolean isBreakOnExceptions() {
        return breakOnExceptions;
    }

    public void setBreakOnExceptions(boolean breakOnExceptions) {
        this.breakOnExceptions = breakOnExceptions;
    }

    public boolean isBreakOnStart() {
        return breakOnStart;
    }

    public void setBreakOnStart(boolean breakOnStart) {
        this.breakOnStart = breakOnStart;
    }
}
