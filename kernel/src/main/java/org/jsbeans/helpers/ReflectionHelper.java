package org.jsbeans.helpers;

import org.jsbeans.Core;
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
import java.util.*;

public class ReflectionHelper {

    private static ReflectionHelper instance = new ReflectionHelper();
    private static Reflections reflections = new Reflections(
            new ConfigurationBuilder()
                    .addScanners(new TypeAnnotationsScanner(), new SubTypesScanner(), new ResourcesScanner())
                    .setUrls(ClasspathHelper.forPackage(Core.PLATFORM_PACKAGE))
    );

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
