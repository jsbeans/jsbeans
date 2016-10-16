
/** Trait-враппер для работы с артефактом, точнее с его json представлением
*/
function Wrapper(artifact){

    /** Инициализация массива с историей действий
    */
    artifact.historyOperations = artifact.historyOperations || [];

    /** Сохранить в истории операцию, пользователя и информацию для восстановления
    */
    this.logop = function (op, data) {
        artifact.historyOperations.push({
            id: artifact.historyOperations.length,
            operation: op,
            data: data,
            user: utils.user(),
            timestamp: utils.timestamp()
        });
    }


    /** Контролируемое извлечение объекта из рабочего пространства по заданному пути - get('a.b.c')
    */
    this.get = function (path) {
        var obj = artifact;
        path = path.split('.');
        for (var i = 0; i < path.length; i++) {
            if(typeof obj[path[i]] === 'object' || i === path.length - 1) {
                obj = obj[path[i]];
            } else {
                return;
            }
        }
        return obj;
    };

    /** Контролируемая запись объекта в рабочее пространство по заданному пути - set('a.b.c', 123)
    */
    this.set = function (path, value) {
        var obj = artifact;
        path = path.split('.');
        for (var i = 0; i < path.length-1; i++) {
            if(typeof obj[path[i]] === 'object') {
                obj = obj[path[i]];
            } else {
                obj = obj[path[i]] = {}
            }
        }
        this.logop('set', {
            path: path,
            current: obj[path[path.length-1]],
            value: value
        });
        obj[path[path.length-1]] = value;
    };

    this.history = function(){
        return artifact.historyOperations.slice();
    };
}

/** Trait базовых опций объектов рабочего пространства
*/
function Item(workspace, pref, id, init){

    /** Если объекта нет, то необходимо инициализировать
    */
    if (!workspace.get(pref)) {
        var json = typeof init === 'function' ? json = init.call(this) : {};
        json.id = id;
        json.owner = utils.user();
        json.createdTimestamp = utils.timestamp();
        json.category = '';
        workspace.set(pref, json);
    }

    /** Получить значение именованного свойства
    */
    this.getProperty = function (name) {
        return workspace.get(pref + '.' + name);
    };

    /** Записать значение именованного свойства
    */
    this.setProperty = function (name, value) {
        return workspace.set(pref + '.' + name, value);
    };

    /** Получить идентификатор
    */
    this.id = function () {
        return this.getProperty('id');
    };

    /** Получить создателя
    */
    this.owner = function () {
        return this.getProperty('owner');
    };

    /** Получить время создания
    */
    this.createdTimestamp = function () {
        return this.getProperty('createdTimestamp');
    };

    /** Получить или записать категорию в виде пути к папке - category('/developed/1.0')
    */
    this.category = function (newCategory) {
        if (newCategory || newCategory === null || newCategory === '') {
            this.setProperty('category', newCategory);
        } else {
            return this.getProperty('category');
        }
    };
}

/** Trait реализует из объекта контейнер для хранения дочерних.
*   Далее он встраивается в объекты рабочего пространства.
*/
function Aggregator(workspace, pref, Item){

    this.checkType = function(){
        if (typeof Item !== 'function') {
            throw new Error('Invalid child type ' + typeof Item);
        }
    };

    /** Создать новый пустой Child
    */
    this.create = function(){
        var id = Item.name + '-' + this.ids().length;
        return this.createById(id);
    };
    /** Создать новый пустой Child по id
    */
    this.createById = function(id){
        this.checkType();
        return new Item(workspace, pref + '.' + id, id);
    };

    /** Извлечь Child по его id, если не существует возвращается null
    */
    this.get = function (id){
        this.checkType();
        var data = workspace.get(pref + '.' + id);
        if (!data) return null;
        return this.createById(id);
    };

    /** Удалить Child по его идентификатору
    */
    this.remove = function (id){
        workspace.set(pref + '.' + id, null);
    };

    /** Получить массив с идентификаторами проектов рабочего пространства
    */
    this.ids = function(){
        var ids = [];
        var obj = workspace.get(pref);
        for (var i in obj) if (obj.hasOwnProperty(i) && obj[i]) {
            ids.push(i);
        }
        return ids;
    };

    /** Получить массив с Child
    */
    this.all = function(){
        var all = [];
        var obj = workspace.get(pref);
        for (var id in obj) if (obj.hasOwnProperty(id) && obj[id]) {
            all.push(this.createById(id));
        }
        return all;
    };
}

/** Враппер для работы с внешним артефактом
*/
function ExternalArtifact(workspace, name, version, extension){

    /** Вычисляет путь к артефакту
    */
    this.path = function() {
        return utils.artifactPathOrURL(workspace.name() + Packages.java.io.File.separator + name + '.' + version + '.' + extension);
    }

    /** Извлечь артефакт в виде строки
    */
    this.load = function() {
        return utils.loadTextFile(this.path());
    }

    /** Сохранить строку с артефактом
    */
    this.store = function(content) {
        if (content && content.length > 0) {
            workspace.logop('store', {path: this.path()});
            utils.storeTextFile(this.path(), content);
        }
    };

    /** Удалить артефакт c онтологией
    */
    this.remove = function (){
        this.logop('remove', {path: this.path()});
        utils.markAsDeleted(this.path());
    };
}