/** DataCube - jsBeans extension | jsbeans.org (MIT Licence) | (c) Special Information Systems, LLC */

{
	$name: 'DataCube.Query.Renders.Basic',
	$parent: 'JSB.Controls.Control',

	$alias: '$basic',

	$client: {
		$require: ['DataCube.Query.Syntax',
		           'css:Basic.css'],

        _properties: {
            allowDelete: {
                isInherit: true,
                isFromScheme: true
            },
            allowOutputFields: {
                isInherit: true,
                isFromScheme: true
            },
            allowReplace: {
                isFromScheme: true
            },
            allowSourceFields: {
                isInherit: true,
                isFromScheme: true
            },
            allowWrap: {
                isFromScheme: true
            },
            deleteCallback: {
                isInherit: true
            }
        },
        _subscribers: {},

	    /**
	    * @constructor
	    *
	    * @param {object} opts - опции передаются из функции createRender контроллера
	    * @see DataCube.Query.SchemeController.createRender
	    *
	    * @param {boolean} [opts.allowDelete] - возможность удаления
	    * @param {boolean} [opts.allowReplace] - возможность замены
        * @param {boolean} [opts.allowOutputFields] - можно ли дочерним элементам использовать поля текущего запроса. Если не задана, то true
	    * @param {boolean} [opts.allowSourceFields] - можно ли дочерним элементам использовать поля источника. Если не задана, то true
	    * @param {object} opts.controller - контроллер схемы
	    * @param {function} [opts.deleteCallback] - функция обратного вызова, если задана возможность удаления
	    * @param {string} opts.key - ключ запроса
	    * @param {object} opts.parent - родительский рендер. При отстутствии текущий рендер является корневым запросом
	    * @param {string} opts.renderName - имя рендера
	    * @param {object} [opts.scheme] - схема. Может отсутствовать у дополнительных рендеров
	    * @param {object} opts.scope - скоп значения
	    */
	    $constructor: function(opts) {
	        $base(opts);

	        this.addClass('basicQueryRender');

	        this._key = opts.key;
	        this._scope = opts.scope;

	        if(opts.changedFrom) {
	            this.changeValue(opts.changedFrom);
	        } else {
                if(JSB.isDefined(this.getValues())) {
                    this.checkValues();
                } else {
                    this.setDefaultValues();
                }
            }

	        this.getController().registerRender(this);
	    },

	    bindMenu: function(menuOpts) {
	        if(!menuOpts.wrap && !menuOpts.edit && !menuOpts.remove) {
	            return;
	        }

	        menuOpts.closeCallback = function() {
	            menuOpts.element.removeClass('hover');
	        }

	        menuOpts.element.addClass('pointer');

	        menuOpts.element.mouseover(function(evt) {
	            evt.stopPropagation();

                menuOpts.element.addClass('hover');

                JSB.cancelDefer('DataCube.Query.hideMenu_' + menuOpts.id);

                JSB.defer(function() {
                    $this.showMenu(menuOpts);
                }, 300, 'DataCube.Query.showMenu_' + menuOpts.id);
	        });

	        menuOpts.element.mouseout(function(evt) {
	            evt.stopPropagation();

                JSB.cancelDefer('DataCube.Query.showMenu_' + menuOpts.id);

                menuOpts.element.removeClass('hover');

                JSB.defer(function() {
                    $this.hideMenu();
                }, 300, 'DataCube.Query.hideMenu_' + menuOpts.id);
	        });

            if(menuOpts.edit && !menuOpts.noClickEdit) {
                menuOpts.element.click(function(evt) {
                    evt.stopPropagation();

                    $this.showTool(menuOpts);
                });
            }

/*
            if(menuOpts.dragDrop) {
                menuOpts.element.droppable({
                    accept: function(d) {
                        var replaceItems = Syntax.getReplacementItems($this.getKey());

                        if()
console.log();
console.log($this);
console.log(Syntax);
console.log(menuOpts);
debugger;
                        //
                    },
                    tolerance: 'pointer',
                    greedy: true,
                    activeClass : 'acceptDraggable',
                    hoverClass: 'hoverDraggable',
                    drop: function(evt, ui) {
console.log($this);
debugger;
                    }
                });

                menuOpts.element.draggable({
                    addClasses: false,
                    classes: {
                        'ui-draggable-dragging': 'active'
                    }
                });
            }
*/
	    },

        /**
        * Заменяет текущее значение в скопе новым, создаёт новый рендер
        * @param {string} newKey - новый ключ. Если не указан, то берётся текущий ключ
        * @param {*} [newValue] - новое значение. Если не указано, то берётся старое значение
        * @param {object} [desc] - описание выбранного элемента (приходит из тултипа)
        */
	    changeTo: function(newKey, newValue, desc){
	        if(JSB.isNull(newKey)){
	            newKey = this.getKey();
	        }

	        var render;

	        if(newKey === '$query'){
	            var newVal = {};
	            this.getParent().setValues(newVal);

                render = this.createRender({
                    changedFrom: {
                        key: this.getKey(),
                        render: this.getRenderName()
                    },
                    key: newKey,
                    scope: newVal
                }, this.getParent());
	        } else {
                this.replaceValue(newKey, newValue);

                if(desc && desc.sourceContext){
                    this.setParameter('$sourceContext', desc.sourceContext);
                }

                render = this.createRender({
                    changedFrom: {
                        key: this.getKey(),
                        render: this.getRenderName()
                    },
                    key: newKey,
                    scope: this.getScope()
                }, this.getParent());
            }

	        if(render){
	            this.getElement().replaceWith(render.getElement());
	            this.onChange();
	            this.destroy();
	        }
	    },

        /**
        * Вызывается для конвертации значений других рендеров в формат текущего
        */
	    changeValue: function(oldDesc){},

        /**
        * Вызывается в конструкторе для проверки соответствия типа значения данному рендеру
        */
	    checkValues: function(){},

        /**
        * Создаёт заголовок
        */
	    createHeader: function(){
            var header = this.$('<header>' + this.getScheme().displayName + '</header>');
            this.append(header);

	        return header;
	    },

        /**
        * Создаёт поле редактирования для изменения значения
        * @param {jQuery} valueEl - элемент, к которому привязывается рдактор. Должен содержать значение внутри себя
        * @param {string} type - тип значения. Может быть text или number
        * @param {function} callback - функция, которая вызывается при изменении значения
        */
	    createInput: function(valueEl, type, callback){
            var oldValue = valueEl.text().replace(new RegExp('^"|"$', 'g'), ''),
                input = this.$('<input class="inputEditor" value="' + oldValue + '" />'); //  type="' + (type || 'text') + '" todo

            valueEl.append(input);

            function change(){
                var newVal = input.val();

                if(type === 'number'){
                    newVal = Number(newVal);
                }

                input.remove();

                if(newVal !== oldValue){
                    callback.call($this, newVal);

                    if(type === 'text'){
                        valueEl.text('"' + newVal + '"');
                    } else {
                        valueEl.text(newVal);
                    }

                    $this.onChange();
                }

                $this.$(window).off('click.changeInput');
            }

            input.change(change);

            $this.$(window).on('click.changeInput', change);

            input.click(function(evt){
                evt.stopPropagation();
            });

            input.focus();
	    },

	    createMainMenuOptions: function(options) {
	        return JSB.merge({
	            caller: this,
	            element: this.getElement(),
	            id: this.getId(),
	            key: this.getKey(),

	            // buttons
	            edit: this.getProperty('allowReplace'),
	            remove: this.getProperty('allowDelete'),
	            wrap: this.getProperty('allowWrap'),

	            // callbacks
	            deleteCallback: this.getProperty('deleteCallback')
	        }, options);
	    },

        /**
        * Создаёт рендер
        * @see DataCube.Query.SchemeController.createRender
        */
	    createRender: function(options, parent){
	        if(!options){
	            options = {};
	        }

	        for(var i in this._properties) {
	            if(!JSB.isDefined(options[i]) && this._properties[i].isInherit) {
	                options[i] = this.getProperty(i);
	            }
	        }

	        return this.getController().createRender(options, parent || this);
	    },

	    createRenderFromValues: function(renderOpts){
	        // check if query
	        if(renderOpts.scope.$select){
	            return this.createRender(JSB.merge(renderOpts, {
	                renderName: '$query'
	            }));
	        }

	        if(JSB.isObject(renderOpts.scope)) {
    	        for(var i in renderOpts.scope){
    	            if(i === '$context' || i === '$sourceContext'){
    	                continue;
    	            }

    	            return this.createRender(JSB.merge(renderOpts, {
    	                key: i
    	            }));
    	        }
	        } else if(JSB.isString(renderOpts.scope)) { // views
                return this.createRender(JSB.merge(renderOpts, {
                    key: '$text'
                }));
	        }
	    },

        /**
        * Создаёт разделитель
        * @param {boolean} [isCollapsible] - является ли разделитель элементом для сворачивания
        */
	    createSeparator: function(isCollapsible){
            var separator = this.$('<div class="separator"></div>');

            if(isCollapsible){
                separator.addClass('collapsible');

                separator.click(function(evt){
                    evt.stopPropagation();

                    separator.toggleClass('collapsed');
                });
            }

            return separator;
	    },

	    destroy: function(){
	        this.getController().unregisterRender(this);

	        $base();
	    },

        /**
        * Возвращает карту дочерних рендеров
        * @return {object} объект-карта с дочерними рендерами
        */
	    getChildren: function(){
	        return this.getController().getRenderById(this.getId()).children;
	    },

        /**
        * Возвращает контекст текущего запроса
        * @return {string} контекст
        */
	    getContext: function(){
	        if(this.getParent()){
	            return this.getParent().getContext();
	        }
	    },

        /**
        * Возвращает контроллер
        * @return {object} контроллер
        */
	    getController: function(){
	        return this.options.controller;
	    },

        /**
        * Возвращает данные, переданные контроллеру при обновлении
        * @param {string} [key] - ключ для объекта данных
        *
        * @return {*} данные по ключу или весь объект данных, если ключ не указан
        */
	    getData: function(key){
	        return this.getController().getData(key);
	    },

        /**
        * Возвращает значение по умолчанию
        * @return {*} значение по умолчанию
        */
	    getDefaultValues: function(){
	        if(!this.getScheme()){
	            return;
	        }

	        var defaultValues = this.getScheme().defaultValues;

	        if(JSB.isDefined(defaultValues)){
	            return JSB.clone(defaultValues);
	        }
	    },

        /**
        * Возвращает значение по умолчанию для новых элементов (для multiple элементов)
        * @return {*} значение по умолчанию
        */
	    getDefaultAddValues: function(){
	        if(!this.getScheme()){
	            return {$const: 0};
	        }

	        var defaultValues = this.getScheme().defaultAddValues;

	        if(JSB.isDefined(defaultValues)){
	            return JSB.clone(defaultValues)
	        } else {
	            return {$const: 0};
            }
	    },

        /**
        * Возвращает функцию обратного вызова при удалении элемента. Задаётся родителем
        * @return {function} функция, которую необходимо вызвать при удалении
        */
	    getDeleteCallback: function(){
	        return this.options.deleteCallback;
	    },

        /**
        * Возвращает ключ из синтаксиса запроса
        * @return {string} ключ
        */
	    getKey: function(){
	        return this._key;
	    },

        /**
        * Возвращает выходные поля основного запроса
        * @return {string[]} выходные поля
        */
	    getOutputFields: function(){
	        return this.getParent().getOutputFields();
	    },

        /**
        * Возвращает родительский рендер, если существует
        * @return {object|undefined} объект рендера
        */
	    getParent: function(){
	        return this.options.parent;
	    },

	    getProperty: function(propertyName) {
	        if(JSB.isDefined(this.options[propertyName])) {
	            return this.options[propertyName];
	        } else if(this._properties[propertyName] && this._properties[propertyName].isFromScheme) {
	            return this.getSchemeProperty(propertyName);
	        }
	    },

        /**
        * Возвращает основной запрос
        * @return {object} запрос
        */
	    getQuery: function(){
	        return this.getController().getQuery();
	    },

        /**
        * Возвращает имя рендера
        * @return {string} имя рендера
        */
	    getRenderName: function(){
	        return this.options.renderName;
	    },

        /**
        * Возвращает схему, описанную в синтаксисе
        * @see DataCube.Query.Syntax
        * @return {object} объект схемы
        */
	    getScheme: function(){
	        return this.options.scheme || Syntax.getScheme(this.getRenderName()) || {};
	    },

        /**
        * Возвращает свойство схемы
        * @return {*} свойство
        */
	    getSchemeProperty: function(propertyName) {
	        return this.getScheme()[propertyName];
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

        /**
        * Возвращает текущий срез
        * @return {JSB} бин среза
        */
	    getSlice: function(){
	        return this.getController().getSlice();
	    },

        /**
        * Возвращает объект подписанных на изменения рендера
        * @return {object} объект типа id: callback
        */
	    getSubscribers: function(){
	        return this._subscribers;
	    },

        /**
        * Возвращает значения из скопа для текущего рендера
        * @return {object} значения
        */
	    getValues: function(){
	        return this._scope[this.getKey()];
	    },

	    getViews: function() {
	        return this.getParent().getViews();
	    },

	    hideMenu: function() {
	        return this.getController().hideMenu();
	    },

        /**
        * Рендер с множеством значений?
        * @return {boolean} множество значений/одно значение
        */
	    isMultiple: function(){
	        return this.getScheme().multiple;
	    },

	    onChange: function(changeDesc){
	        for(var i in this._subscribers){
	            this._subscribers[i].call(this, changeDesc);
	        }

	        this.getController().onChange();
	    },

        /**
        * Удаляет текущее значение из скопа и уничтожает рендер
        * @param {boolean} hideEvent - не порождать событие удаления
        */
	    remove: function(hideEvent){
	        delete this._scope[this.getKey()];

            if(!hideEvent){
                $this.onChange({
                    name: 'removeItem',
                    item: this
                });
	        }

	        this.destroy();
	    },

        /**
        *
        * Удаляет значение (для multiple элементов)
        * @param {jQuery[]} items - массив элементов
        * @param {jQuery} item - удаляемый элемент
        */
	    removeItem: function(items, item){
	        var itemIndex = Number(item.attr('idx'));

	        for(var i = 0; i < items.length; i++){
	            if(i === itemIndex){
	                items[i].remove();
	                this.getValues().splice(i, 1);
	                continue;
	            }

	            if(i > itemIndex){
	                this.$(items[i]).attr('idx', i - 1);
	            }
	        }

	        $this.onChange();
	    },

        /**
        *
        * Изменяет порядок значений (для multiple элементов)
        * @param {jQuery[]} items - массив элементов
        */
	    reorderValues: function(items){
	        for(var i = 0; i < items.length; i++){
	            var idx = Number(this.$(items[i]).attr('idx'));
	            if(idx !== i){
	                this.$(items[i]).attr('idx', i);

	                if(idx > i){
	                    var el = this.getValues().splice(idx, 1);
	                    this.getValues().splice(i, 0, el[0]);
	                }
	            }
	        }

	        this.onChange();
	    },

	    replaceContexts: function(value, oldContext, newContext, contextName, newContextName){
	        if(!contextName){
	            contextName = '$context';
	        }

	        function replace(value){
	            for(var i in value){
	                if(i === contextName && value[i] === oldContext){
	                    if(newContextName){
	                        value[newContextName] = newContext;
	                    } else {
	                        value[i] = newContext;
                        }
	                } else if(JSB.isObject(value[i])) { // isObject
	                    replace(value[i]);
	                } else if(JSB.isArray(value[i])){   // isArray
	                    for(var j = 0; j < value[i].length; j++){
	                        replace(value[i][j]);
	                    }
	                }
	            }
	        }

	        replace(value);
	    },

        /**
        * Заменяет текущее значение в скопе новым
        * @param {string} newKey - новый ключ
        * @param {*} [newValue] - новое значение. Если не указано, то берётся старое значение
        */
	    replaceValue: function(newKey, newValue){
            var isNewValMultiple = Syntax.getScheme(newKey).multiple,
                isCurrentValMultiple = this.isMultiple();

	        if(JSB.isDefined(newValue)){
	            if(isNewValMultiple){
	                newValue = [newValue];
	            }
	        } else {
	            newValue = this.getScope()[this.getKey()];

                if(isNewValMultiple && !isCurrentValMultiple){
                    newValue = [newValue];
                }

                if(isCurrentValMultiple && !isNewValMultiple){
                    newValue = newValue[0];
                }
	        }

            if(this.getScope().hasOwnProperty(this.getKey())){
	            delete this.getScope()[this.getKey()];
            }

	        this._scope[newKey] = newValue;
	    },

        /**
        * Устанавливает значения по умолчанию (при наличии)
        */
	    setDefaultValues: function() {
            //constructDefaultValues
	        var defValues = Syntax.constructDefaultValues(this.options);

	        if(JSB.isDefined(defValues)) {
	            this.setValues(defValues[this.getKey()]);
	        }
	    },

        /**
        * Устанавливает новый ключ
        * @param {string} key - новый ключ
        */
	    setKey: function(key){
	        this._key = key;
	    },

        /**
        * Устанавливает значение параметра
        * @param {string} paramName - имя параметра
        * @param {*} value - значение параметра
        */
	    setParameter: function(paramName, value){
	        this._scope[paramName] = value;
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
        * @param {object} options - объект с опциями для показа меню
        * @param {jQuery} options.element - элемент jQuery, к которому будут привязаны меню и тултип
        * @param {string} [options.id] - уникальный идентификатор меню. Если не указан, то берётся id текущего бина
        *
        * @param {boolean} [opts.remove] - отображение кнопки удаления
        * @param {boolean} [opts.edit] - отображение кнопки редактирования
        *
        * @param {function} [opts.editCallback] - функция обратного вызова при нажатии кнопки редактирования
        * @param {function} [opts.deleteCallback] - функция обратного вызова при нажатии кнопки удаления
        * @param {function} [opts.editToolCallback] - функция обратного вызова при выборе нового элемента в окне редактирования
        */
	    showMenu: function(options){
	        options = options || {};

	        return this.getController().showMenu(options);
	    },

        /**
        * Отображает тултип в заменами для элемента
        * @param {object} options - объект с опциями показа тултипа
        * @param {jQuery} options.element - элемент jQuery, к которому будут привязан тултип
        * @param {function} options.callback - функция обратного вызова при выборе нового элемента
        */
	    showTool: function(options){
	        return this.getController().showTool(JSB.merge({
	            caller: this,
	            key: this.getKey()
	        }, options));
	    },

	    subscribeToChanges: function(id, callback){
	        this._subscribers[id] = callback;
	    },

	    unsubscribe: function(id){
	        if(this._subscribers[id]){
	            delete this._subscribers[id];
	        }
	    },

	    wrap: function(desc, options){
	        var oldVal = {},
                isCurrentValMultiple = this.isMultiple();

            oldVal[this.getKey()] = this.getValues();

            if(desc.multiple){
	            this._scope[desc.key] = [oldVal];
            } else {
                this._scope[desc.key] = oldVal;
            }

            if(this.getScope().hasOwnProperty(this.getKey())){
	            delete this.getScope()[this.getKey()];
            }

	        var render = this.createRender({
	            key: desc.key,
	            scope: this.getScope()
	        }, this.getParent());

	        if(render){
	            this.getElement().replaceWith(render.getElement());
	            this.destroy();
	            this.onChange();
	        }
	    }
	},

	$server: {
	    $require: ['DataCube.Query.RenderRepository']
	}
}