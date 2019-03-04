{
	$name: 'DataCube.Query.Renders.Basic',
	$parent: 'JSB.Controls.Control',

	$alias: '$basic',

	$client: {
		$require: ['DataCube.Query.Syntax',
		           'css:Basic.css'],

	    /**
	    * @constructor
	    *
	    * @param {object} opts - опции передаются из функции createRender контроллера
	    * @see DataCube.Query.SchemeController.createRender
	    *
	    * @param {boolean} [opts.allowDelete] - возможность удаления. Если не задана, то false
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
	    $constructor: function(opts){
	        $base(opts);

	        this.addClass('basicQueryRender');

            if(opts.scheme && JSB.isDefined(opts.scheme.allowOutputFields)){
                this._allowOutputFields = opts.scheme.allowOutputFields;
            } else {
                this._allowOutputFields = JSB.isDefined(opts.allowOutputFields) ? opts.allowOutputFields : true;
            }

            if(opts.scheme && JSB.isDefined(opts.scheme.allowSourceFields)){
                this._allowSourceFields = opts.scheme.allowSourceFields;
            } else {
                this._allowSourceFields = JSB.isDefined(opts.allowSourceFields) ? opts.allowSourceFields : true;
            }

	        this._allowDelete = JSB.isDefined(opts.allowDelete) ? opts.allowDelete : false;
	        this._controller = opts.controller;
	        this._deleteCallback = opts.deleteCallback;
	        this._key = opts.key;
	        this._parent = opts.parent;
	        this._renderName = opts.renderName;
	        this._scheme = opts.scheme;
	        this._scope = opts.scope;

	        if(JSB.isDefined(this.getValues())){
	            this.checkValues();
	        } else {
	            if(this.getDefaultValues()){
	                this.setValues(this.getDefaultValues());
	            }
	        }

	        this.getController().registerRender(this);
	    },

        /**
        * Заменяет текущее значение в скопе новым, создаёт новый рендер
        * @param {string} newKey - новый ключ. Если не указан, то берётся текущий ключ
        * @param {*} [newValue] - новое значение. Если не указано, то берётся старое значение
        * @param {string} [context] - контекст. Не добавляется, если не указан
        */
	    changeTo: function(newKey, newValue, context){
	        if(JSB.isNull(newKey)){
	            newKey = this.getKey();
	        }

	        this.replaceValue(newKey, newValue);

	        if(context){
	            //this.setContext(context);
	        }

	        var render = this.createRender({
	            // поля, заданные родителем
                allowOutputFields: this.isAllowOutputFields(),
                allowSourceFields: this.isAllowSourceFields(),
                allowDelete: this.isAllowDelete(),
                deleteCallback: this.getDeleteCallback(),

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
        * Вызывается в конструкторе для проверки соответствия типа значения данному рендеру
        */
	    checkValues: function(){
	        // todo
	    },

        /**
        * Создаёт заголовок
        * @param {boolean} [hasMenu] - создавать меню при наведении
        */
	    createHeader: function(hasMenu){
            var header = this.$('<header>' + this._scheme.displayName + '</header>');
            this.append(header);

            var scheme = this.getScheme();

            if(hasMenu){
                this.installMenuEvents({
                    element: header
                });
            }

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

        /**
        * Создаёт рендер
        * @see DataCube.Query.SchemeController.createRender
        */
	    createRender: function(options, parent){
	        if(!options){
	            options = {};
	        }

	        options.allowOutputFields = this.isAllowOutputFields();
	        options.allowSourceFields = this.isAllowSourceFields();

	        return this.getController().createRender(options, parent || this);
	    },

        /**
        * Создаёт разделитель
        * @param {boolean} [isCollapsible] - является ли разделитель элементом для сворачивания
        */
	    createSeparator: function(isCollapsible){
            var separator = this.$('<div class="separator"></div>');

            if(isCollapsible){
                separator.addClass('collapsible');

                separator.click(function(){
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
        * Возвращает контроллер
        * @return {object} контроллер
        */
	    getController: function(){
	        return this._controller;
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
	        return this._deleteCallback;
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
	        return this._scheme || {};
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
        * Возвращает возможность удаления. Флаг задаётся при создании рендера родительским рендером
        * @return {boolean} флаг возможности удаления
        */
	    isAllowDelete: function(){
	        return JSB.isDefined(this._allowDelete) ? this._allowDelete : this.getScheme().removable;
	    },

        /**
        * Можно ли дочерним рендерам использовать выходные поля текущего запроса. Разрешено, если родителем не указано иное
        * @return {boolean}
        */
	    isAllowOutputFields: function(){
	        return this._allowOutputFields;
	    },

        /**
        * Можно ли дочерним рендерам использовать выходные поля текущего запроса. Разрешено, если родителем не указано иное
        * @return {boolean}
        */
	    isAllowSourceFields: function(){
	        return this._allowSourceFields;
	    },

        /**
        * Рендер с фиксированным количеством значений?
        * @return {boolean}
        */
	    isFixedFieldCount: function(){
	        return this.getScheme().fixedFieldCount;
	    },

        /**
        * Рендер с множеством значений?
        * @return {boolean} множество значений/одно значение
        */
	    isMultiple: function(){
	        return this.getScheme().multiple;
	    },

	    isSortable: function(){
	        return JSB.isDefined(this.getScheme().sortable) ? this.getScheme().sortable : true;
	    },

        /**
        * Прикрепляет к элементу всплывающее меню
        * @param {jQuery} menuOpts - опции для меню @see showMenu
        */
	    installMenuEvents: function(menuOpts, hoverElement){
	        menuOpts = this._expandOptions(menuOpts);

	        hoverElement = hoverElement || this.getElement();

            menuOpts.element.hover(function(evt){
                evt.stopPropagation();

                hoverElement.addClass('hover');

                JSB.cancelDefer('DataCube.Query.hideMenu' + menuOpts.id);

                JSB.defer(function(){
                    $this.showMenu(menuOpts);
                }, 300, 'DataCube.Query.showMenu' + menuOpts.id);
            }, function(evt){
                evt.stopPropagation();

                hoverElement.removeClass('hover');

                JSB.cancelDefer('DataCube.Query.showMenu' + menuOpts.id);

                JSB.defer(function(){
                    $this.hideMenu(menuOpts);
                }, 300, 'DataCube.Query.hideMenu' + menuOpts.id);
            });

            if(menuOpts.edit){
                menuOpts.element.click(function(){
                    $this.showTool(menuOpts);
                });
            }
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
        *
        * Удаляет значение (для multiple элементов)
        * @param {array} items - массив элементов
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
        * @param {array} items - массив элементов
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

        /**
        * Заменяет текущее значение в скопе новым
        * @param {string} newKey - новый ключ
        * @param {*} [newValue] - новое значение. Если не указано, то берётся старое значение
        */
	    replaceValue: function(newKey, newValue){
            var isNewValMultiple = Syntax.getSchema(newKey).multiple,
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
        * Устанавливает новый контекст
        * @param {string} context - новый контекст
        */
	    setContext: function(context){
	        this._scope.$context = context;
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
        * @param {object} options - объект с опциями для показа тултипа
        * @param {jQuery} options.element - элемент jQuery, к которому будут привязан тултип
        * @param {function} options.callback - функция обратного вызова при выборе нового элемента
        */
	    showTool: function(options){
	        return this.getController().showTool(JSB.merge({
	            key: this.getKey()
	        }, options));
	    },

	    _expandOptions: function(options){
	        return JSB.merge({
	            caller: this,
	            id: this.getId(),
	            key: this.getKey(),

	            // buttons
	            edit: this.getScheme().replaceable,
	            remove: this.isAllowDelete(),

	            // callbacks
	            deleteCallback: this.getDeleteCallback()
	        }, options);
	    }
	},

	$server: {
	    $require: ['DataCube.Query.RenderRepository']
	}
}