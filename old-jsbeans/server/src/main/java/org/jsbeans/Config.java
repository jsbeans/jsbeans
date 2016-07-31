package org.jsbeans;

import org.jsbeans.utils.JsonUtils;

import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.Map;
import java.util.Optional;

/**
 * Config contains static and instance methods. Static {@link #gett} use thread local config.
 */
public interface Config {
    String configPathSeparator = ".";

    Class<?> resourceHostClass = Config.class;

    Path homePath = Paths.get(System.getProperty("user.dir"));
    String configPath = Optional
            .ofNullable(System.getProperty("jsbeans.config"))
            .orElse("config/jsbeans.conf.json");

    ThreadLocal<Config> localConfig = new ThreadLocal<>();

    static Config local() {
        if (localConfig.get() == null) {
            throw new IllegalStateException("Thread not configured - " + Thread.currentThread().getName());
        }
        return localConfig.get();
    }

    /**
     * Read JSON file or resource {@link #load(Map)} and merge with Json
     */
    @SuppressWarnings("unchecked")
    static Config load(Map<String, Object> override) {
        return new Config() {
            final Map<String, Object> json;

            {
                json = JsonUtils.readJson(configPath);
                JsonUtils.resolveImports(json, JsonUtils::readJson);
                JsonUtils.unwrapKeys(json);
                if (override != null) {
                    JsonUtils.merge(json, override);
                    JsonUtils.resolveImports(json, JsonUtils::readJson);
                    JsonUtils.unwrapKeys(json);
                }

                localConfig.set(this);
            }

            @Override
            public <T> Optional<T> get(String path) {
                return Optional.ofNullable((T) JsonUtils.getByPath(json, path));
            }
        };
    }

    /**
     * Read JSON file or resource {@link #configPath},
     * merge with JSON files or resources from '__imports__' array field
     * and resolve long field name paths with '.' delimiter
     * (<code>{"a.b":123}</code> to <code>{"ab":{"b":123}}</code>)
     */
    static Config load() {
        return load(null);
    }

    static Path absolutePath(String relativeOrAbsolutePath) {
        return homePath.resolve(relativeOrAbsolutePath);
    }

    static <T> Optional<T> gett(Class<?> configDomainClass, String localPath) {
        return localConfig.get().get(configDomainClass.getCanonicalName() + configPathSeparator + localPath);
    }

    static <T> Optional<T> gett(Class<?> configDomainClass, String localPath, Class<T> type) {
        return localConfig.get().get(configDomainClass.getCanonicalName() + configPathSeparator + localPath, type);
    }

    static <T> Optional<T> gett(Object self, String localPath) {
        return gett(self.getClass(), localPath);
    }

    static <T> Optional<T> gett(Object self, String localPath, Class<T> type) {
        return gett(self.getClass(), localPath, type);
    }

    static <T> Optional<T> gett(String path, Class<T> type) {
        return localConfig.get().get(path);
    }

    static <T> Optional<T> gett(String path) {
        return localConfig.get().get(path);
    }


    default String nodeName() {
        return get(JsBeans.class, "name", String.class).orElse("jsbeans-unnamed");
    }

    default <T> Optional<T> get(Class<?> configDomainClass, String localPath) {
        return get(configDomainClass.getCanonicalName() + configPathSeparator + localPath);
    }

    default <T> Optional<T> get(Object self, String localPath) {
        return get(self.getClass(), localPath);
    }

    default <T> Optional<T> get(Object self, String localPath, Class<T> type) {
        return get(self.getClass(), localPath, type);
    }

    default <T> Optional<T> get(Class<?> configDomainClass, String localPath, Class<T> type) {
        return get(configDomainClass.getCanonicalName() + configPathSeparator + localPath, type);
    }

    default <T> Optional<T> get(String path, Class<T> type) {
        return get(path);
    }

    <T> Optional<T> get(String path);
}
