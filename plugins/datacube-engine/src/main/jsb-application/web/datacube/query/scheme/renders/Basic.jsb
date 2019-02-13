{
	$name: 'DataCube.Query.Renders.Basic',
	$parent: 'JSB.Controls.Control',

	$alias: '$basic',

	$client: {
		$require: ['DataCube.Query.RenderRepository',
    	           'css:Basic.css'],

	    /**
	    * @constructor
	    *
	    * @param {object} opts - опции передаются из функции createRender контроллера
	    * @see DataCube.Query.SchemeController.createRender
	    *
	    * @param {object} opts.controller - контроллер схемы
	    * @param {string} opts.key - ключ запроса
	    * @param {object} opts.parent - родительский рендер. При отстутствии текущий рендер является корневым запросом
	    * @param {string} opts.renderName - имя рендера
	    * @param {object} [opts.scheme] - схема. Может отсутствовать у дополнительных рендеров
	    * @param {object} opts.scope - скоп значения
	    */
	    $constructor: function(opts){
	        $base(opts);

	        this.addClass('queryRender');

	        this._controller = opts.controller;
	        this._key = opts.key;
	        this._parent = opts.parent;
	        this._renderName = opts.renderName;
	        this._scheme = opts.scheme;
	        this._scope = opts.scope;

	        if(!this.getValues() && this.getDefaultValues()){
	            this.setValues(this.getDefaultValues());
	        }
	    },

        /**
        * Заменяет текущее значение в скопе новым, создаёт новый рендер
        * @param {string} newKey - новый ключ. Если не указан, то берётся текущий ключ
        * @param {*} [newValue] - новое значение. Если не указано, то берётся старое значение
        */
	    changeTo: function(newKey, newValue){
	        if(JSB.isNull(newKey)){
	            newKey = this.getKey();
	        }

	        this.replaceValue(newKey, newValue);

	        var render = this.getController().createRender({
	            key: newKey,
	            scope: this.getScope()
	        }, this.getParent());

	        if(render){
	            this.getElement().replaceWith(render.getElement());
	            this.onChange();
	            this.destroy();
	        }
	    },

        /**
        * Создаёт заголовок
        */
	    createHeader: function(){
            var header = this.$('<header>' + this._scheme.displayName + '</header>');
            this.append(header);

            var scheme = this.getScheme();

            if(!scheme.replaceable && !scheme.removable){
                return header;
            }

            this.installMenuEvents(header);

	        return header;
	    },

        /**
        * Создаёт рендер
        * @see DataCube.Query.SchemeController.createRender
        */
	    createRender: function(options, parent){
	        return this.getController().createRender(options, parent || this);
	    },

        /**
        * Возвращает контроллер
        * @return {object} контроллер
        */
	    getController: function(){
	        return this._controller;
	    },

	    getData: function(key){
	        return this.getController().getData(key);
	    },

        /**
        * Возвращает значение по умолчанию для новых элементов
        * @return {*} значение по умолчанию
        */
	    getDefaultValues: function(){
	        return this.getScheme().defaultValues;
	    },

        /**
        * Возвращает ключ из синтаксиса запроса
        * @return {string} ключ
        */
	    getKey: function(){
	        return this._key;
	    },

        /**
        * Возвращает родительский рендер, если существует
        * @return {object|undefined} объект рендера
        */
	    getParent: function(){
	        return this._parent;
	    },

        /**
        * Возвращает имя рендера
        * @return {string} имя рендера
        */
	    getRenderName: function(){
	        return this._renderName;
	    },

        /**
        * Возвращает схему, описанную в синтаксисе
        * @see DataCube.Query.Syntax
        * @return {object} объект схемы
        */
	    getScheme: function(){
	        return this._scheme;
	    },

        /**
        * Возвращает часть скопа значений по ключу или скоп целиком, если ключ не указан
        * @param {string} key - ключ
        *
        * @return {object} скоп значений
        */
	    getScope: function(key){
	        if(key){
	            return this._scope[key];
	        }

	        return this._scope;
	    },

	    getSlice: function(){
	        return this.getController().getSlice();
	    },

        /**
        * Возвращает значения из скопа для текущего рендера
        * @return {object} значения
        */
	    getValues: function(){
	        return this._scope[this.getKey()];
	    },

	    hideMenu: function(){
	        return this.getController().hideMenu();
	    },

        /**
        * Прикрепляет к элементу всплывающее меню
        * @param {jQuery} element - элемент, над которым появится меню
        * @param {string} [id] - уникальный идентификатор меню. Если не указан, то берётся id текущего бина
        * @param {object} [menuOpts] - список опций @see showMenu
        */
	    installMenuEvents: function(element, id, menuOpts){
	        id = id || this.getId();

            element.hover(function(evt){
                evt.stopPropagation();

                JSB.cancelDefer('DataCube.Query.hideMenu' + id);

                JSB.defer(function(){
                    $this.showMenu(element, id, menuOpts);
                }, 300, 'DataCube.Query.showMenu' + id);
            }, function(evt){
                evt.stopPropagation();

                JSB.cancelDefer('DataCube.Query.showMenu' + id);

                JSB.defer(function(){
                    $this.hideMenu(element, id, menuOpts);
                }, 300, 'DataCube.Query.hideMenu' + id);
            });
	    },

	    isMultiple: function(){
	        return this.getScheme().multiple;
	    },

	    onChange: function(){
	        this.getController().onChange();
	    },

        /**
        * Удаляет текущее значение из скопа и уничтожает рендер
        */
	    remove: function(){
	        delete this._scope[this.getKey()];

	        this.destroy();
	    },

        /**
        * Заменяет текущее значение в скопе новым
        * @param {string} newKey - новый ключ
        * @param {*} [newValue] - новое значение. Если не указано, то берётся старое значение
        */
	    replaceValue: function(newKey, newValue){
	        if(!JSB.isDefined(newValue)){
	            newValue = this.getScope()[this.getKey()];
	        }

	        delete this.getScope()[this.getKey()];

	        this._scope[newKey] = newValue;
	    },

        /**
        * Устанавливает новый ключ
        * @param {string} key - новый ключ
        */
	    setKey: function(key){
	        this._key = key;
	    },

        /**
        * Устанавливает новое значение для текущего ключа
        * @param {*} val - новое значение
        */
	    setValues: function(val){
	        this._scope[this.getKey()] = val;
	    },

        /**
        * Отображает меню с кнопками редактирования и удаления
        * @param {jQuery} element - элемент, над которым появится меню
        * @param {string} [id] - уникальный идентификатор меню. Если не указан, то берётся id текущего бина
        * @param {object} [opts] - список опций
        * @param {boolean} [opts.removable] - отображение кнопки удаления
        * @param {boolean} [opts.replaceable] - отображение кнопки редактирования
        * @param {function} [opts.editCallback] - функция обратного вызова при нажатии кнопки редактирования
        * @param {function} [opts.deleteCallback] - функция обратного вызова при нажатии кнопки удаления
        * @param {function} [opts.editToolCallback] - функция обратного вызова при выборе нового элемента в окне редактирования
        */
	    showMenu: function(element, id, opts){
	        opts = opts || {};

	        return this.getController().showMenu(JSB.merge({
	            caller: this,
	            element: element,
	            elementId: id || this.getId(),
	            key: this.getKey(),
	            removable: JSB.isDefined(opts.removable) ? opts.removable : this.getScheme().removable,
	            replaceable: JSB.isDefined(opts.replaceable) ? opts.replaceable : this.getScheme().replaceable
	        }, opts));
	    },

	    showTool: function(opts){   //element, selectedId, callback
	        return this.getController().showTool(JSB.merge(opts, {
	            key: opts.key || this.getKey()
	        }));
	    },

	    subscribeTo: function(eventName, callback){
	        this.getController().subscribeTo(this.getId(), eventName, callback);
	    },

	    unsubscribe: function(){
	        this.getController().unsubscribe(this.getId());
	    }
	}
}