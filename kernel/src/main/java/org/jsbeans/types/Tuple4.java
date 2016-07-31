package org.jsbeans.types;

public class Tuple4<A, B, C, D> {
    private A a;
    private B b;
    private C c;
    private D d;

    public Tuple4(A a, B b, C c, D d) {
        this.a = a;
        this.b = b;
        this.c = c;
        this.d = d;
    }

    public static <A, B, C, D> Tuple4<A, B, C, D> create(A a, B b, C c, D d) {
        return new Tuple4<A, B, C, D>(a, b, c, d);
    }

    public A get0() {
        return a;
    }

    public void set0(A a) {
        this.a = a;
    }

    public B get1() {
        return b;
    }

    public void set1(B b) {
        this.b = b;
    }

    public C get2() {
        return c;
    }

    public void set2(C c) {
        this.c = c;
    }

    public D get3() {
        return d;
    }

    public void set3(D d) {
        this.d = d;
    }
} 