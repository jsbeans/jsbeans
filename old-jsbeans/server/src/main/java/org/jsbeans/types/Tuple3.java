package org.jsbeans.types;

public class Tuple3<A, B, C> {
    private final A a;
    private final B b;
    private final C c;

    public Tuple3(A a, B b, C c) {
        this.a = a;
        this.b = b;
        this.c = c;
    }

    public static <A, B, C> Tuple3<A, B, C> create(A a, B b, C c) {
        return new Tuple3<A, B, C>(a, b, c);
    }

    public A get0() {
        return a;
    }

    public B get1() {
        return b;
    }

    public C get2() {
        return c;
    }
} 