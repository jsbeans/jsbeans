package org.jsbeans.types;

public class Tuple<X, Y> {
    private final X x;
    private final Y y;

    public Tuple(X x, Y y) {
        this.x = x;
        this.y = y;
    }

    public static <X, Y> Tuple<X, Y> create(X x, Y y) {
        return new Tuple<X, Y>(x, y);
    }

    public X getFirst() {
        return x;
    }

    public Y getSecond() {
        return y;
    }
} 