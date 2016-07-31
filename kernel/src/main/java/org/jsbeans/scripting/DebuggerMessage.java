package org.jsbeans.scripting;

import org.jsbeans.messages.Message;

public class DebuggerMessage implements Message {
    private boolean stop;

    private boolean breakOnStart = false;
    private boolean breakOnEnter = false;
    private boolean breakOnReturn = false;
    private boolean breakOnExceptions = true;

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
