package org.jsbeans.utils;

import jdk.nashorn.api.scripting.NashornScriptEngineFactory;
import jdk.nashorn.api.scripting.ScriptObjectMirror;

import static org.jsbeans.utils.MD5.md5;

public class ScriptUtils {

    public static final String scriptEngine = "nashorn";

    public static ScriptEngine getEngine() {
        ScriptEngine engine = new NashornScriptEngineFactory().getScriptEngine(className -> true);
        if (engine == null) {
            throw new IllegalArgumentException(String.format("Get script engine %s failed", engine));
        }
        //new SimpleScriptContext().setBindings(engine.getContext().getBindings(ScriptContext.ENGINE_SCOPE), ScriptContext.ENGINE_SCOPE);
        return engine;
    }

    public static ScriptObjectMirror evalJson(String json) {
        try {
            return eval(getEngine(), new ScriptSource("Java.asJSONCompatible(" + json + ")", "JSON"));
        } catch (Exception e) {
            throw ExceptionUtils.runtime("Parse JSON content error", e);
        }
    }

    public static <T> T eval(ScriptEngine engine, ScriptSource script) {
        try {
            engine.getContext().setAttribute("script", script.getScript(), ScriptContext.ENGINE_SCOPE);
            engine.getContext().setAttribute("scriptName", script.getName(), ScriptContext.ENGINE_SCOPE);
            return (T) engine.eval("load({ script: script, name: scriptName})");

//            return (T) engine.eval(script.getScript());
        } catch (ScriptException e) {
            throw ExceptionUtils.runtime("Eval script failed", e);
        }
    }

    public static <T> T eval(ScriptEngine engine, ScriptSource script, ScriptContext context) {
        try {
            context.setAttribute("script", script.getScript(), ScriptContext.ENGINE_SCOPE);
            context.setAttribute("scriptName", script.getName(), ScriptContext.ENGINE_SCOPE);
            return (T) engine.eval("load({ script: script, name: scriptName})", context);
//            return (T) engine.eval(script.getScript(), context);
        } catch (ScriptException e) {
            throw ExceptionUtils.runtime("Eval script failed", e);
        }
    }

    public static <T> T eval(ScriptEngine engine, ScriptSource script, Class<T> type) {
        return (T) eval(engine, script);
    }

//    public static <T> T eval(ScriptEngine engine, ScriptSource script, Bindings attributes) {
//        try {
//            return (T) engine.eval(script.getScript(), attributes);
//        } catch (ScriptException e) {
//            throw ExceptionUtils.runtime("Eval script failed", e);
//        }
//    }

    public static class ScriptSource {
        private final String script;
        private String name;
        private String md5;

        public ScriptSource(String script, String name) {
            this.script = script;
            this.name = name;
            this.md5 = md5(script);
        }

        public String getScript() {
            return script;
        }

        public String getName() {
            return name;
        }

        public String getMd5() {
            return md5;
        }
    }
}
