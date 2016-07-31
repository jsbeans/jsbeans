package org.jsbeans.monads;

public abstract class Monad<T> {
    private Object[] args;
    private Chain<?, ?> chain = null;

    public Monad() {
    }

    public Monad(Object... args) {
        this.args = args;
    }

    @SuppressWarnings("unchecked")
    protected <X> X getArgument(int idx) {
        return (X) this.args[idx];
    }

    protected int getArgumentCount() {
        return this.args.length;
    }

    public void setChain(Chain<?, ?> task) {
        this.chain = task;
    }

    protected void put(String key, Object value) {
        this.chain.put(key, value);
    }

    protected <X> X get(String key) {
        return this.chain.get(key);
    }

}
