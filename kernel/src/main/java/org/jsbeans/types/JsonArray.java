/*
 * This file is the part of jsBeans, high-level JavaScript client-server framework.
 * The contents of this file are subject to the MIT License (MIT).
 * (c) aa@sis.ru, da@sis.ru, Special Information Systems, LLC, 2011-2016
 *
 * Настоящий файл является частью клиент-сервеной JavaScript платформы.
 * Условия использования и распространения содержимого данного файла соответствуют программному обеспечению с открытыми исходными кодами и равнозначно MIT License (MIT).
 * Авторские права принадлежат aa@sis.ru, da@sis.ru, ООО СИС, 2011-2016гг.
 */

package org.jsbeans.types;

import org.jsbeans.serialization.GsonWrapper;

import java.util.*;

public class JsonArray extends ArrayList<Object> implements JsonElement {
    private static final long serialVersionUID = 4358411297898200776L;

    private static transient Set<Class<?>> acceptedTypes = new HashSet<Class<?>>();

    static {
        acceptedTypes.add(JsonArray.class);
        acceptedTypes.add(Object[].class);
        acceptedTypes.add(List.class);
        acceptedTypes.add(Set.class);
    }

    public static boolean isAccepted(Object value) {
        for (Class<?> cl : acceptedTypes) {
            if (cl.isAssignableFrom(value.getClass())) {
                return true;
            }
        }

        return false;
    }

    @Override
    public boolean isJsonArray() {
        return true;
    }

    @Override
    public boolean isJsonObject() {
        return false;
    }

    @Override
    public boolean isJsonPrimitive() {
        return false;
    }

    @Override
    public boolean isJsonNull() {
        return false;
    }


    @Override
    public JsonObject getAsJsonObject() {
        throw new UnsupportedOperationException(getClass().getSimpleName());
    }

    @Override
    public JsonArray getAsJsonArray() {
        return this;
    }

    @Override
    public JsonPrimitive getAsJsonPrimitive() {
        throw new UnsupportedOperationException(getClass().getSimpleName());
    }

    @Override
    public boolean contains(Object o) {
        JsonElement.Helper.checkAccepted(o);
        return super.contains(o);
    }

    @Override
    public Object get(int index) {
        // TODO Auto-generated method stub
        return super.get(index);
    }

    public JsonElement getElement(int index) {
        Object obj = get(index);
        return JsonElement.Helper.getElement(obj);
    }


    @Override
    public Object set(int index, Object element) {
        return super.set(index, JsonElement.Helper.prepareToAdd(element));
    }

    @Override
    public boolean add(Object e) {
        return super.add(JsonElement.Helper.prepareToAdd(e));
    }

    @Override
    public void add(int index, Object element) {
        super.add(index, JsonElement.Helper.prepareToAdd(element));
    }

    @Override
    public boolean addAll(Collection<? extends Object> c) {
        boolean bChanged = false;
        for (Object e : c) {
            if (this.add(e)) {
                bChanged = true;
            }
        }
        return bChanged;
    }

    public boolean addAll_(Collection<?> c) {
        return this.addAll(c);
    }

    public JsonArray addAndGet(Object o) {
        add(o);
        return this;
    }

    public JsonArray addAllAndGet(Collection<?> c) {
        this.addAll(c);
        return this;
    }

    @Override
    public boolean addAll(int index, Collection<? extends Object> c) {
        boolean bChanged = false;
        for (Object e : c) {
            this.add(index++, e);
            bChanged = true;
        }
        return bChanged;
    }

    @Override
    public String toString() {
        return GsonWrapper.toJson(this);
    }

}
