/*
 * This file is the part of jsBeans, high-level JavaScript client-server framework.
 * The contents of this file are subject to the MIT Licence (MIT).
 * (c) aa@sis.ru, da@sis.ru, Special Information Systems, LLC, 2011-2019
 *
 * Настоящий файл является частью клиент-сервеной JavaScript платформы.
 * Условия использования и распространения содержимого данного файла соответствуют программному обеспечению с открытыми исходными кодами и равнозначно MIT Licence (MIT).
 * Авторские права принадлежат aa@sis.ru, da@sis.ru, ООО СИС, 2011-2019гг.
 */

package org.jsbeans.helpers;

import org.jsbeans.plugin.PluginActivator;
import org.jsbeans.services.Service;
import org.reflections.Reflections;
import org.reflections.scanners.ResourcesScanner;
import org.reflections.scanners.SubTypesScanner;
import org.reflections.scanners.TypeAnnotationsScanner;
import org.reflections.util.ClasspathHelper;
import org.reflections.util.ConfigurationBuilder;

import java.lang.reflect.Field;
import java.lang.reflect.Modifier;
import java.net.URL;
import java.util.*;
import java.util.stream.Collectors;

public class ReflectionHelper {

    private static ReflectionHelper instance = new ReflectionHelper();

    private static Collection<URL> urls = getClassPath().stream()
                            .filter((url) -> {
                                String u = url.toString();
                                return !u.endsWith(".so") && !u.endsWith(".bin")
                                        && !u.contains("rhino") && !u.endsWith(".pom")
                                        && !u.endsWith("tools-1.4.2.jar");
                            })
                            .collect(Collectors.toList());
    private static Reflections reflections = new Reflections(
            new ConfigurationBuilder()
                    .addScanners(
                            new TypeAnnotationsScanner(),
                            new SubTypesScanner(),
                            new ResourcesScanner())
                    .setUrls(urls)
//                    .setUrls(ClasspathHelper.forPackage(Core.PLATFORM_PACKAGE))
    );

    public static Collection<URL> getClassPath() {
        if(System.getProperty("java.version").startsWith("11.")) {
            Collection<URL> cp = ClasspathHelper.forJavaClassPath();
            if(cp.size() == 1) { // if starts jar with manifest
                return ClasspathHelper.forManifest(cp.iterator().next());
            }
            return cp;
        }
        return ClasspathHelper.forClassLoader();
    }

    public static ReflectionHelper getInstance() {
        return instance;
    }

    public static Reflections getPlatformReflections() {
        return reflections;
    }


    public static <T> Collection<Class<? extends T>> scanSubclasses(Class<T> cls) {
        return reflections.getSubTypesOf(cls);
    }

    public static Collection<Class<? extends Service>> scanServices() {
        return scanSubclasses(Service.class);
    }

    public static Collection<Class<? extends PluginActivator>> scanPluginActivators() {
        return scanSubclasses(PluginActivator.class);
    }

    @SuppressWarnings("unchecked")
    public static <T> T clone(T proto) throws CloneNotSupportedException {
        try {
            T op = (T) proto.getClass().newInstance();
            for (Field f : proto.getClass().getDeclaredFields()) {
                f.setAccessible(true);
                if (!Modifier.isFinal(f.getModifiers())) {
                    f.set(op, f.get(proto));
                }
            }
            return op;
        } catch (Exception e) {
            throw new CloneNotSupportedException(e.getMessage());
        }
    }

    public Class<?> getClassForName(String clsName) {
        try {
            return Class.forName(clsName);
        } catch (Exception e) {
            if (clsName.equals("int")) return Integer.TYPE;
            if (clsName.equals("long")) return Long.TYPE;
            if (clsName.equals("double")) return Double.TYPE;
            if (clsName.equals("float")) return Float.TYPE;
            if (clsName.equals("boolean") || clsName.equals("bool")) return Boolean.TYPE;
            if (clsName.equals("char")) return Character.TYPE;
            if (clsName.equals("byte")) return Byte.TYPE;
            if (clsName.equals("void")) return Void.TYPE;
            if (clsName.equals("short")) return Short.TYPE;
        }
        return null;
    }

    public Map<String, Object> generateTypeInfoDescriptor(Class<?> cls) {
        Map<String, Object> retDesc = new HashMap<String, Object>();
        retDesc.put("name", cls.getName());
        retDesc.put("isAnnotation", cls.isAnnotation());
        retDesc.put("isAnonymousClass", cls.isAnonymousClass());
        retDesc.put("isArray", cls.isArray());
        retDesc.put("isEnum", cls.isEnum());
        retDesc.put("isInterface", cls.isInterface());
        retDesc.put("isLocalClass", cls.isLocalClass());
        retDesc.put("isMemberClass", cls.isMemberClass());
        retDesc.put("isPrimitive", cls.isPrimitive());
        retDesc.put("isSynthetic", cls.isSynthetic());
        boolean isClass = cls.getName().equals(Class.class.getName());
        retDesc.put("isClass", isClass);
        boolean isBox = cls.equals(Boolean.class)
                || cls.equals(Integer.class)
                || cls.equals(Long.class)
                || cls.equals(Float.class)
                || cls.equals(Byte.class)
                || cls.equals(Double.class)
                || cls.equals(Character.class)
                || cls.equals(Short.class);
        retDesc.put("isBox", isBox);

        if (!cls.isPrimitive() && !cls.isEnum() && !isClass && !isBox) {
            Map<String, Map<String, Object>> fields = new HashMap<String, Map<String, Object>>();
            // parse fields
            for (Field f : cls.getDeclaredFields()) {
                fields.put(f.getName(), generateTypeInfoDescriptor(f.getType()));
            }

            retDesc.put("fields", fields);
        }
        if (cls.isEnum()) {
            List<String> enumConstants = new ArrayList<String>();
            for (Object obj : cls.getEnumConstants()) {
                Enum e = (Enum) obj;
                enumConstants.add(e.name());
            }
            retDesc.put("enumConstants", enumConstants);
        }

        return retDesc;

    }
}
