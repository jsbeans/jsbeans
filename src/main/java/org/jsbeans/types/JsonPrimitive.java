/*
 * This file is the part of jsBeans, high-level JavaScript client-server framework.
 * The contents of this file are subject to the MIT License (MIT).
 * (c) aa@sis.ru, da@sis.ru, Special Information Systems, LLC, 2011-2019
 *
 * Настоящий файл является частью клиент-сервеной JavaScript платформы.
 * Условия использования и распространения содержимого данного файла соответствуют программному обеспечению с открытыми исходными кодами и равнозначно MIT License (MIT).
 * Авторские права принадлежат aa@sis.ru, da@sis.ru, ООО СИС, 2011-2019гг.
 */

package org.jsbeans.types;

import com.google.gson.internal.LazilyParsedNumber;
import org.jsbeans.serialization.GsonWrapper;

import java.math.BigDecimal;
import java.math.BigInteger;
import java.util.HashSet;
import java.util.Set;

public final class JsonPrimitive implements JsonElement {
    private static final long serialVersionUID = -3891280991794556515L;
    private static transient Null NULL = new Null();
    private static transient Set<Class<?>> acceptedTypes = new HashSet<Class<?>>();

    static {
        // add primitive types
        acceptedTypes.add(JsonPrimitive.class);
        acceptedTypes.add(Boolean.class);
        acceptedTypes.add(Byte.class);
        acceptedTypes.add(Short.class);
        acceptedTypes.add(Integer.class);
        acceptedTypes.add(Long.class);
        acceptedTypes.add(Float.class);
        acceptedTypes.add(Double.class);
        acceptedTypes.add(Character.class);
        acceptedTypes.add(String.class);
        acceptedTypes.add(Number.class);
        acceptedTypes.add(Null.class); // equivalent for js null
    }

    private transient Object value;

    public JsonPrimitive(Boolean bool) {
        this.setValue(bool);
    }

    public JsonPrimitive(Number number) {
        this.setValue(number);
    }

    public JsonPrimitive(String string) {
        this.setValue(string);
    }

    public JsonPrimitive(Character c) {
        this.setValue(c);
    }

    public JsonPrimitive(Object primitive) {
        this.setValue(primitive);
    }

    public static boolean isAccepted(Object value) {
        for (Class<?> cl : acceptedTypes) {
            if (cl.isAssignableFrom(value.getClass())) {
                return true;
            }
        }

        return false;
    }

    private static boolean isIntegral(JsonPrimitive primitive) {
        if (primitive.value instanceof Number) {
            Number number = (Number) primitive.value;
            return number instanceof BigInteger || number instanceof Long || number instanceof Integer
                    || number instanceof Short || number instanceof Byte;
        }
        return false;
    }

    public Object getValue() {
        return this.value;
    }

    void setValue(Object primitive) {
        if (primitive instanceof Character) {
            // convert characters to strings since in JSON, characters are represented as a single
            // character string
            char c = ((Character) primitive).charValue();
            this.value = String.valueOf(c);
        } else {
            if (!isAccepted(primitive)) {
                throw new IllegalArgumentException("Unsupported value type " + primitive.getClass());
            }
            this.value = primitive;
        }
    }

    @Override
    public boolean isJsonArray() {
        return false;
    }

    @Override
    public boolean isJsonNull() {
        return this.value instanceof Null;
    }

    @Override
    public boolean isJsonObject() {
        return false;
    }

    @Override
    public boolean isJsonPrimitive() {
        return true;
    }

    @Override
    public JsonObject getAsJsonObject() {
        throw new UnsupportedOperationException(getClass().getSimpleName());
    }

    @Override
    public JsonArray getAsJsonArray() {
        throw new UnsupportedOperationException(getClass().getSimpleName());
    }

    @Override
    public JsonPrimitive getAsJsonPrimitive() {
        return this;
    }

    public boolean isBoolean() {
        return this.value instanceof Boolean;
    }

    private Boolean getAsBooleanWrapper() {
        return (Boolean) this.value;
    }

    public boolean getAsBoolean() {
        if (this.isBoolean()) {
            return this.getAsBooleanWrapper().booleanValue();
        } else {
            // Check to see if the value as a String is "true" in any case.
            return Boolean.parseBoolean(this.getAsString());
        }
    }

    public boolean isNumber() {
        return this.value instanceof Number;
    }

    public Number getAsNumber() {
        return this.value instanceof String ? new LazilyParsedNumber((String) this.value) : (Number) this.value;
    }

    public boolean isString() {
        return this.value instanceof String;
    }

    public String getAsString() {
        if (this.isNumber()) {
            return this.getAsNumber().toString();
        } else if (this.isBoolean()) {
            return this.getAsBooleanWrapper().toString();
        } else {
            return (String) this.value;
        }
    }

    public double getAsDouble() {
        return this.isNumber() ? this.getAsNumber().doubleValue() : Double.parseDouble(this.getAsString());
    }

    public float getAsFloat() {
        return this.isNumber() ? this.getAsNumber().floatValue() : Float.parseFloat(this.getAsString());
    }

    public BigDecimal getAsBigDecimal() {
        return value instanceof BigDecimal ? (BigDecimal) value : new BigDecimal(value.toString());
    }

    public BigInteger getAsBigInteger() {
        return value instanceof BigInteger ? (BigInteger) value : new BigInteger(value.toString());
    }


    public long getAsLong() {
        return isNumber() ? getAsNumber().longValue() : Long.parseLong(getAsString());
    }

    public short getAsShort() {
        return isNumber() ? getAsNumber().shortValue() : Short.parseShort(getAsString());
    }

    public int getAsInt() {
        return isNumber() ? getAsNumber().intValue() : Integer.parseInt(getAsString());
    }

    public byte getAsByte() {
        return isNumber() ? getAsNumber().byteValue() : Byte.parseByte(getAsString());
    }

    public char getAsCharacter() {
        return getAsString().charAt(0);
    }

    @Override
    public boolean equals(Object obj) {
        if (this == obj) {
            return true;
        }
        if (obj == null || getClass() != obj.getClass()) {
            return false;
        }
        JsonPrimitive other = (JsonPrimitive) obj;
        if (value == null) {
            return other.value == null;
        }
        if (isIntegral(this) && isIntegral(other)) {
            return getAsNumber().longValue() == other.getAsNumber().longValue();
        }
        if (value instanceof Number && other.value instanceof Number) {
            double a = getAsNumber().doubleValue();
            // Java standard types other than double return true for two NaN. So, need
            // special handling for double.
            double b = other.getAsNumber().doubleValue();
            return a == b || (Double.isNaN(a) && Double.isNaN(b));
        }
        return value.equals(other.value);
    }

    @Override
    public int hashCode() {
        if (value == null) {
            return 31;
        }
        // Using recommended hashing algorithm from Effective Java for longs and doubles
        if (isIntegral(this)) {
            long value = getAsNumber().longValue();
            return (int) (value ^ (value >>> 32));
        }
        if (value instanceof Number) {
            long value = Double.doubleToLongBits(getAsNumber().doubleValue());
            return (int) (value ^ (value >>> 32));
        }
        return value.hashCode();
    }

    @Override
    public String toString() {
        return GsonWrapper.toJson(this.getValue());
    }

    public static final class Null {
        private Null() {
        }

        public static Null get() {
            return NULL;
        }
    }

}
