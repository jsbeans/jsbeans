package org.jsbeans.tests;

import org.jsbeans.utils.JsonJava;
import org.junit.Test;

public class JsonTest {

    @Test
    public void testToJson() {
        Object json = null;

        json = JsonJava.unwrapToJson("string");
        assert (json.toString().equals("string"));

        json = JsonJava.unwrapToJson(123);
        assert (((Number) json).intValue() == 123);

        json = JsonJava.unwrapToJson(new Object[]{"", 123});
        assert (json instanceof Collection);
        assert (((Collection) json).size() == 2);


        CC obj = new CC();
        Object map = JsonJava.unwrapToJson(obj);
        Object res = JsonJava.wrapToJava(map);
    }

    @Test
    public void test() {

    }

    interface I1 {
        int i1 = 1;
    }

    interface I2 {
        Collection<Object> i2col = new ArrayList<Object>() {{
            add("str");
            add(new CC());
        }};
    }

    interface I3 {

    }

    static class C implements I1 {
        static final double stat = 123.123;
        String ss = "ss";
    }

    static class CC extends C implements I2, I3 {
        transient int ignored = 123;

        Map<String, Object> map = new HashMap<String, Object>() {{
            put("int", 1);
            put("col", new ArrayList<Object>() {{
                add("str");
                add(new C());
            }});
            put("map", new HashMap<String, Object>() {{
                put("int", 1);
                put("cc", new C());
            }});
            put("cc", new C());
        }};
    }
}
