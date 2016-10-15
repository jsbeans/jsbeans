
/** Основной контроллер рабочего пространства пользователя
*/
function Workspace(id) {

    utils.installLogAppender("OntoedWokrspaceAppender", "org.semanticweb.owlapi" , Workspace.logEvent);
    utils.installLogAppender("OntoedWokrspaceAppender", "ru.avicomp" , Workspace.logEvent);

    /** Основной артефакт рабочего пространства
    */
    var workspacePath = utils.artifactPathOrURL(id);
    var artifactPath = utils.artifactPathOrURL(id + '/workspace.json');

    var pref = 'workspace';

    var workspaceArtifact = {};

    function workspaceArtifactBody() {
        return JSON.stringify(workspaceArtifact, null, 2);
    }

    /** Встраивание контроллера артефактов в this
    */
    Wrapper.call(this, workspaceArtifact);

    /** Встраивание базовых свойств объекта в this
    */
    Item.call(this, this, pref, id, function(){
        return {
            id: id,
            name: id,
            users: {},
            projects: {},
            ontologies: {},
            datasources: {},
            datastores: {}
        };
    });

    /** Public API:
    */

    this.workspaceArtifact = function(){
        return JSON.parse(JSON.stringify(workspaceArtifact));
    };

    /** Загрузить сохраненную ранее версию
    */
    this.load = function (){
        if (utils.pathExists(artifactPath)) {
            workspaceArtifact = JSON.parse(utils.loadTextFile(artifactPath));
            Wrapper.call(this, workspaceArtifact);
        }
        this.clean();
        this.logop('load', {workspacePath:workspacePath});
    };

    this.clean = function(){
        if (utils.pathExists(artifactPath)) {
            // TODO remove/archive old artifacts
        } else if (utils.pathExists(workspacePath)){
            utils.remove(workspacePath);
        }
        this.logop('clean', {workspacePath:workspacePath});
    };

    /** Сохранить в файл или на сервере через PUT/POST запрос по URL
    */
    this.store = function (){
        this.commit();
        this.logop('store', {workspacePath: workspacePath});
        utils.storeTextFile(artifactPath, workspaceArtifactBody());
    };

    /** Удалить артефакт
    */
    this.remove = function (){
        this.commit();
        utils.storeTextFile(artifactPath, workspaceArtifactBody());
        utils.remove(workspacePath);
        this.logop('remove', {workspacePath: workspacePath});
    };

    /** Подтвердить изменения
    */
    this.commit = function(){
        this.set('lastCommit', {
            user: utils.user(),
            timestamp: utils.timestamp()
        });
    };

    /** Получить или изменить название рабочего пространства
    */
    this.name = function(newName) {
        if (newName || newName === null) {
            this.set(pref + '.name', newName);
        } else {
            return this.get(pref + '.name');
        }
    };

    var users = new Users(this, pref + '.users');
    var projects = new Projects(this, pref + '.projects');
    var ontologies = new Ontologies(this, pref + '.ontologies');
    var datasources = new Datasources(this, pref + '.datasources');
    var datastores = new Datastores(this, pref + '.datastores');

    /** Профиль пользователей, которые изменяют объекты рабочего пространства
    */
    this.users = function () {
        return users;
    };

    /** Проекты пользователя с правилами отображения
    */
    this.projects = function () {
        return projects;
    };

    /** Онтологии во всех проектах рабочего пространства или пока еще не используемые "на вырост"
    */
    this.ontologies = function () {
        return ontologies;
    };

    /** Источники данных во всех проектах рабочего пространства или пока еще не используемые "на вырост"
    */
    this.datasources = function () {
        return datasources;
    };

    /** БД хранилищ во всех проектах рабочего пространства или пока еще не используемые "на вырост"
    */
    this.datastores = function () {
        return datastores;
    };
}

Workspace.logEvent = function(logEvent) {
    var logJson = {};
    if (logEvent.getClass().getName().equals("org.apache.log4j.spi.LoggingEvent")) {
        logJson = {
            timestamp: logEvent.getTimeStamp(),
            level: ''+logEvent.getLevel(),
            logger: ''+logEvent.getLoggerName(),
            message: ''+logEvent.getRenderedMessage(),
//            properties: utils.javaToJson(logEvent.getProperties()),
            throwable: utils.javaToJson(logEvent.getThrowableStrRep())
        };
    } else if (logEvent.getClass().getName().equals("ch.qos.logback.classic.spi.LoggingEvent")) {
        function throwableToString(throwableProxy){
            if (!throwableProxy) return null;
            var CoreConstants = Packages.ch.qos.logback.core.CoreConstants;
            var ThrowableProxyUtil = Packages.ch.qos.logback.classic.spi.ThrowableProxyUtil;

            var builder = new Packages.java.lang.StringBuilder();
            var arr = throwableProxy.getStackTraceElementProxyArray();
            for(var i = 0; i < arr.length; i++) {
                var step = arr[i];
                builder.append('\t').append(step.toString());
                ThrowableProxyUtil.subjoinPackagingData(builder, step);
                builder.append(CoreConstants.LINE_SEPARATOR);
            }
            return builder.toString();
        }

        logJson = {
            timestamp: logEvent.getTimeStamp(),
            level: ''+logEvent.getLevel(),
            logger: ''+logEvent.getLoggerName(),
            message: ''+logEvent.getFormattedMessage(),
//            properties: utils.javaToJson(logEvent.getArgumentArray()),
            throwable: throwableToString(logEvent.getThrowableProxy())
        };
    }
    if (!Workspace.workspaceLogs) {
        Workspace.workspaceLogs = [];
    }
    Workspace.workspaceLogs.push(logJson);
    if (typeof Workspace.logCallback == 'function') {
        try {
            Workspace.logCallback(logJson);
        } catch (e) {
        }
    }
};

Workspace.logs = function(){
    var self = this;
    return {
        all: function(){
            return self.workspaceLogs;
        },

        clear: function(){
            self.workspaceLogs = [];
        },

        setCallback: function(callback) {
            self.logCallback = callback;
        }
    };
}

/** Перечислить существующие рабочие пространства
*/
Workspace.workspaces = function() {
    var path = utils.artifactPathOrURL('');
    var file = new utils.File(path);
    file.mkdirs();
    var files = Packages.java.util.Arrays.asList(file.listFiles());
    var wss = [];
    for (var it = files.iterator(); it.hasNext();) {
        var ws = it.next();
        if (ws.isDirectory()) {
            wss.push(ws.getName());
        }
    }
    return wss;
};


/** Враппер для контролируемой работы со списком пользователей воркспейса
*/
function Users(workspace, pref) {

    Aggregator.call(this, workspace, pref, User);

    /** Создать пользователя по имени
    */
    this.create = function (name){
        return this.createById(name);
    };

    /** Получить текущего пользователя
    */
    this.getCurrent = function (){
        return this.get(utils.user());
    };

    /** Получить массив с именами пользователей
    */
    this.names = function(){
        return this.ids();
    };

    /** если текущего пользователя в воркспейсе нет, то надо создать и добавить
    */
    if (!workspace.get(pref + '.' + utils.user())) {
        this.create(utils.user());
    }
}


/** Враппер для безопасной работы с профилем пользователя
*/
function User(workspace, pref, name) {
    var name = name || utils.user();

    /** Встраивание базовых свойств объекта в this и инициализация пустого пользователя
    */
    Item.call(this, workspace, pref, name, function(){
        return {
            newDetails: null,
            name: name
        };
    });

    /** Получить имя пользователя (менять нельзя, только путем удаления и создания нового)
    */
    this.name = function (newName) {
        return workspace.get(pref + '.name');
    };

    /** Получить или изменить дополниьельную информацию о пользователе
    */
    this.details = function (newDetails) {
        if (newDetails || newDetails === null) {
            workspace.set(pref + '.details', newDetails);
        } else {
            return workspace.get(pref + '.details');
        }
    };
}

/** Враппер для контролируемой работы со списком проектов
*/
function Projects(workspace, pref) {

    /** Интегрировать функции аггрегатора
    */
    Aggregator.call(this, workspace, pref, null /**тип проекта будет определяться динамически*/);

    /** Проекты могут быть разных типов, здесь они регистрируются
    */
    this.types = {
        // TODO: all project types
        Project: Project
    };

    if (typeof D2RQProject === 'function') this.types.D2RQProject = D2RQProject;

    /** Создать новый пустой проект заданного типа
    */
    this.create = function(type){
        /** Инициализация типа аггрегатора
        */
        Aggregator.call(this, workspace, pref, this.types[type]);

        var id = 'Project-' + type + '-' + this.ids().length;
        return this.createById(id);
    };
}

/** Базовый враппер для контролируемой работы с пустым проектом.
* <p> Остальные проекты должны быть унаследованы от текущего и зарегистрированы в Projects.types
* </p>
*/
function Project(workspace, pref, id) {

    /** Встраивание базовых свойств объекта в this и инициализация пустого проекта
    */
    Item.call(this, workspace, pref, id, function(){
        return {
           type: 'Project',
           name: 'Project',
           description: ''
        };
    });

    /** Получить или записать название проекта
    */
    this.name = function (newName) {
        if (newName || newName === null) {
            workspace.set(pref + '.name', newName);
        } else {
            return workspace.get(pref + '.name');
        }
    };

    /** Получить или записать описание проекта
    */
    this.description = function (newDescription) {
        if (newDescription || newDescription === null) {
            workspace.set(pref + '.description', newDescription);
        } else {
            return workspace.get(pref + '.description');
        }
    };

    /** Получить тип проекта
    */
    this.type = function () {
        return workspace.get(pref + '.type');
    };
}

/** Враппер для контролируемой работы со списком источников данных
*/
function Datasources(workspace, pref) {
    /** Инициализация функций аггрегатора
    */
    Aggregator.call(this, workspace, pref, Datasource);
}

/** Враппер для контролируемой работы с источником данных
*/
function Datasource(workspace, pref, id) {

    /** Встраивание базовых свойств объекта в this и инициализация пустого источника
    */
    Item.call(this, workspace, pref, id, function(){
        return {
        };
    });

    // TODO: Datasource fields
}

/** Враппер для контролируемой работы со списком хранилищ результатов отображения
*/
function Datastores(workspace, pref){
    /** Инициализация функций аггрегатора
    */
    Aggregator.call(this, workspace, pref, Datastore);
}

/** Враппер для контролируемой работы с хранилищем результатов отображения
*/
function Datastore(workspace, pref, id) {

    /** Встраивание базовых свойств объекта в this и инициализация пустого источника
    */
    Item.call(this, workspace, pref, id, function(){
        return {
        };
    });

    // TODO: Datastore fields
}

/** Враппер для работы со списком онтологий в рабочем пространстве
*/
function Ontologies(workspace, pref) {

    /** Инициализация функций аггрегатора
    */
    Aggregator.call(this, workspace, pref, Ontology);

    /** найти онтологию по URI
    */
    this.byURI = function(uri){
        uri = '' + uri;
        var ids = this.ids();
        for (var i in ids) {
            var ontology = this.createById(ids[i]);
            if (ontology.uri() == uri){
                return ontology;
            }
        }
        return null;
    };

    /** Сформировать массив с URI онтологий в рабочем пространстве
    */
    this.uris = function(){
        var uris = [];
        var ids = this.ids();
        for (var i in ids) {
            uris.push(this.createById(ids[i]).uri());
        }
        return uris;
    };

    var ontologyReactor = null;
    var spinReactor = null;

    this.reactor = function(reactor) {
        if (ontologyReactor == null && typeof OwlApiReactor !== 'undefined') {
            // TODO вынести зависимость workcpase от OwlApiReactor - устанавливать связь в ontoed-editor
            ontologyReactor = new OwlApiReactor(workspace.ontologies());
            // todo: fix it.
            // spinModelSpec and owlManager should be initialized in one place.
            // the possible way is owlManager=spinModelSpec.getOwlManager().
            // in this case we can fix issue with uploading ontologies
            // which contain sparql-queries with rdf:List (using spinModel as intermediate step).
            spinReactor = new SpinReactor(ontologyReactor);
        }
        return ontologyReactor;
    };

    this.spinReactor = function(reactor) {
        if (spinReactor == null && typeof SpinReactor !== 'undefined') {
            // TODO вынести зависимость workcpase от SpinReactor - устанавливать связь в ontoed-editor
            var ontologyReactor = this.reactor(reactor);
            if (spinReactor == null && ontologyReactor != null) {
                spinReactor = new SpinReactor(ontologyReactor);
            }
        }
        return spinReactor;
    };
}

/** Враппер для контролируемой работы с онтологией, редактирование
    внутренностей онтологии выполняется вне рабочего пространства
*/
function Ontology(workspace, pref, id){

    /** Встраивание базовых свойств объекта в this и инициализация пустой онтологии
    */
    Item.call(this, workspace, pref, id, function(){
        return {
            title: id,
            version: ''+Date.now()
        };
    });

    this.artifact = function(){
        return new ExternalArtifact(workspace, 'ontology.' + id, this.version(), 'rdf');
    }

    /** Получить или записать версию артефакта онтологии
    */
    this.version = function (newVersion) {
        if (newVersion || newVersion === null) {
            this.setProperty('version', newVersion);
        } else {
            return this.getProperty('version');
        }
    };

    /** Увеличить на единицу номер версии артефакта онтологии
    */
    this.nextVersion = function () {
        this.version(''+Date.now());
        return this.version();
    }

    /** Получить или записать URI онтологии
    */
    this.uri = function (newURI) {
        if (newURI || newURI === null) {
            this.setProperty('uri', newURI);
        } else {
            return this.getProperty('uri');
        }
    };

    /** Получить или записать название онтологии - синхронизируется с dc:title
    */
    this.title = function (newTitle) {
        if (newTitle || newTitle === null) {
            this.setProperty('title', newTitle);
        } else {
            return this.getProperty('title');
        }
    };

    /** Получить или записать описание онтологии - синхронизируется с dc:description
    */
    this.description = function (newDescription) {
        if (newDescription || newDescription === null) {
            this.setProperty('description', newDescription);
        } else {
            return this.getProperty('description');
        }
    };

    /** Получить онтологию для редактирования посредством враппера для OWL API
    */
    this.ontologyModel = function() {
        return workspace.ontologies().reactor().ontologyModel(this);
    };

    /** Получить онтологию для редактирования посредством SPIN враппера и одновременно установить соответствующий флаг
    */
    this.spinModel = function() {
        var spin = this.getProperty('spin') || {};
        spin.enabled = true;
        this.setProperty('spin', spin);
        return workspace.ontologies().spinReactor().spinModel(this);
    };
}