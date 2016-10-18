
/** Базовая конфигурация
*/
var config = {
    artifactsBaseURL: Packages.java.lang.System.getProperty("user.dir") + '/ws-artifacts'
};

/** Хелпер для работы с артефактами (файлами и URL)
*/
var utils = {
    Logger: Packages.org.slf4j.LoggerFactory.getLogger(
                    Packages.ru.avicomp.ontoed.owlapi.OntologyUtils._class),

    System: Packages.java.lang.System,
    String: Packages.java.lang.String,
    File: Packages.java.io.File,
    Scanner: Packages.java.util.Scanner,
    ByteArrayOutputStream: Packages.java.io.ByteArrayOutputStream,
    Predicate: Packages.java.util.function.Predicate,

    wrapMethods: function (obj, wrapFunc) {
        for(var name in obj) if (obj.hasOwnProperty(name) && typeof obj[name] === 'function') {
            obj[name] = wrapFunc.call(null, name, obj[name]);
        }
        return obj;
    },

    wrapMethodsWithLogger: function(obj, logPrefix) {
        var logPrefix = logPrefix || 'Call method ';
        return this.wrapMethods(obj, function(name, func){
            return function() {
                utils.Logger.debug(logPrefix + '{}', name)
                return func.apply(this, arguments);
            };
        });
        return obj;
    },

    defaultOption: function (value, defval) {
        return typeof value === 'undefined' ? defval : value;
    },

    user: function(){
        return ''+utils.System.getProperty("user.name");
    },

    timestamp: function(){
        return 0+Date.now();
    },

    throwException: function(msg) {
        var error = new Packages.java.lang.RuntimeException(msg);
        this.Logger.error(error);
        throw error;
    },

    throwIllegalArgumentException: function(msg) {
        var error = new Packages.java.lang.IllegalArgumentException(msg);
        this.Logger.error(error);
        throw error;
    },

    loadTextFile: function(path){
         var File = utils.File;
         var Scanner = utils.Scanner;

         var file = new File(path);
         if (!file.exists()) {
             throw new Error('File is not exists ' + path);
         }

        return '' + new Scanner(file).useDelimiter("\\Z").next();
    },

    loadTextResource: function(path, hostClass) {
        var Object = Packages.java.lang.Object;
        var String = Packages.java.lang.String;
        var Scanner = Packages.java.util.Scanner;
        var InputStream = Packages.java.io.InputStream
        var FileNotFoundException = Packages.java.io.FileNotFoundException;

        var hostClass = hostClass || new Object().getClass();
        var iStream = hostClass.getResourceAsStream(path);
        if(iStream == null){
            throw new FileNotFoundException(String.format("Unable to locate resource %s", path));
        }
        try {
            return new Scanner(iStream).useDelimiter("\\Z").next();
        } finally {
            iStream.close();
        }
    },

    pathExists: function(path) {
         var File = Packages.java.io.File;
         return new File(path).exists();
    },

    storeTextFile: function(path, content){
         var File = Packages.java.io.File;
        var BufferedWriter = Packages.java.io.BufferedWriter;
        var FileWriter = Packages.java.io.FileWriter;
        var writer = null;
        try {
            var file = new File(path);
            file.getParentFile().mkdirs();
            writer = new BufferedWriter(new FileWriter(file));
            writer.write(content);
        } finally {
            try {
                if (writer != null)
                writer.close();
            } catch (e) { }
        }
    },

    remove: function(directory) {
        function deletePath(path) {
            if (path.isDirectory()) {
                var children = path.list();
                for (var i in children) {
                    var success = deletePath(new File(path, children[i]));
                    if (!success) {
                        return false;
                    }
                }
            }
            return path.delete(); // The directory is empty now and can be deleted.
        }

        var File = Packages.java.io.File;
        return deletePath(new File(directory));
    },

    artifactPathOrURL: function(name) {
        var base = config.artifactsBaseURL;
        return ''+base + '/' + this.user() + '/' + name;
    },

    println: function(str){
        if (typeof console !== 'undefined') {
            console.log(''+str);
        } else {
            Packages.java.lang.System.out.println(''+str);
        }
    },

    /** Convert Map, Collection, String, Number to JSON
    */
    javaToJson: function (map, convertor) {
        var convertor = convertor || function (v){
            if (v instanceof Packages.java.util.Map) {
                var json = {};
                var entries = v.entrySet();
                for (var iterator = entries.iterator(); iterator.hasNext();) {
                    var entry = iterator.next();
                    json[''+entry.getKey()] = convertor(entry.getValue());
                }
                return json;
            } else if (v instanceof Packages.java.lang.Iterable) {
                var array = [];
                var entries = v;
                for (var iterator = entries.iterator(); iterator.hasNext();) {
                  array.push(convertor(iterator.next()));
                }
                return array;
            } else if (v instanceof Packages.java.lang.Object) {
                if (v.getClass().isArray()) {
                    var entries = v;
                    for (var i = 0; i < v.length; i++) {
                      v[i]= convertor(v[i]);
                    }
                    return v;
                } else if (v instanceof Packages.java.lang.String) {
                    return '' + v;
                } else if (v instanceof Packages.java.lang.Number) {
                    if (v instanceof Packages.java.lang.Float || v instanceof Packages.java.lang.Double) {
                        return parseFloat(v);
                    }
                    return parseInt(v);
                } else if (v instanceof Packages.java.lang.Boolean) {
                    return !!v.booleanValue();
                }
                return '' + v;
            }
            return v;
        };
        return convertor(map, convertor);
    },

    jsonToJava: function (map, convertor) {
        var convertor = convertor || function (v){
            if (Object.prototype.toString.call(v) === "[object Array]") {
            	var value = new Packages.java.util.ArrayList();
                for(var i = 0; i < v.length; i++){
                	value.add(convertor(v[i]));
                }
                return value;
            } else if (typeof v === 'number' || v instanceof Packages.java.lang.Number) {
                return new java.lang.Double(v.doubleValue && v.doubleValue() || parseFloat(v));
            } else if (typeof v === 'boolean' || v instanceof Packages.java.lang.Boolean) {
                return new java.lang.Boolean(v.booleanValue && v.booleanValue() || !!v);
            } else if (Object.prototype.toString.call(v) === "[object String]" || v instanceof Packages.java.lang.String) {
                return new java.lang.String(v);
            } else if (Object.prototype.toString.call(v) === "[object Object]") {
                var ids = Object.keys(v);
                var value = new Packages.java.util.HashMap(ids.length);
                for(var i in ids){
                    var p = ids[i];
                    value.put(p, convertor(v[p]));
                }
                return value;
            }
            return v;
        };
        return convertor(map, convertor);
    },

    installLogAppender: function(appenderName, loggerName, logCallback) {
        var LoggerFactory = Packages.org.slf4j.LoggerFactory;
        if (LoggerFactory.getILoggerFactory().getClass().getName().startsWith('ch.qos.logback.classic')) {
            utils.Logger.debug('Install Logback appender - logger events handler');
            var {LoggerContext, Logger} =  Packages.ch.qos.logback.classic;
            var {AppenderBase} = Packages.ch.qos.logback.core;

            var context = LoggerFactory.getILoggerFactory();
            var rootLogger = context.getLogger(loggerName);
            if (!rootLogger.getAppender(appenderName)) {
                var appender = new AppenderBase() {
                    append: function(logEvent) {
                        logCallback(logEvent);
                    }
                };
                appender.setContext(context);
                appender.setName("name");
                appender.start();
                //appender.setLayout(new PatternLayout("[%-5p] [t] [%c]: %m%n"));
                rootLogger.detachAppender(appenderName);
                rootLogger.addAppender(appender);
            }
        } else {
            utils.Logger.debug('Install Log4j appender - logger events handler');
            var {Logger, AppenderSkeleton, ConsoleAppender, PatternLayout} = Packages.org.apache.log4j;
            // log4j appender
            var rootLogger = Logger.getLogger(loggerName);
            if (!rootLogger.getAppender(appenderName)) {
                var appender = new AppenderSkeleton() {
                    append: logCallback,
                    close: function(logEvent) {
                        logCallback(logEvent);
                    },
                    requiresLayout: function () {
                        return false;
                    }
                };
                appender.setName(appenderName);
                appender.setLayout(new PatternLayout("[%-5p] [t] [%c]: %m%n"));
                if(!rootLogger.getAllAppenders().hasMoreElements()) {
                    utils.Logger.debug('Install Log4j console appender');
                    // if Log4j not configured install simple console appender
                    var ca = new ConsoleAppender(new PatternLayout(PatternLayout.TTCC_CONVERSION_PATTERN));
                    ca.setName(ca.getClass().getName());
                    rootLogger.addAppender(ca);
                }
                rootLogger.removeAppender(appenderName);
                rootLogger.addAppender(appender);
            }
        }
    },

    timeMills: function(){
        return Packages.java.lang.System.currentTimeMillis()
    }
};
