{
	$name: 'DataCube.Query.Renders.Query',
	$parent: 'DataCube.Query.Renders.Basic',

	$alias: '$query',

	$client: {
	    $require: ['DataCube.Query.Syntax',
	               'DataCube.Query.Controls.AddMenu',
	               'css:Query.css'],

	    /**
	    * @constructor
	    *
	    * Описание дополнительных опций для рендера $query
	    * Основные опции @see DataCube.Query.Renders.Basic
	    *
	    * @param {boolean} [opts.allowChangeSource] - возможность изменения источника
	    * @param {string[]} [opts.allowChild] - разрешённые для добавления элементы (фильтрация, сортировка и тп)
	    * @param {boolean} [opts.noHeader] - не создавать header при наличии родителя (подзапрос)
	    */
	    $constructor: function(opts){
	        $base(opts);

	        this.addClass('queryRender');

	        if(this.getParent()){
	            this.addClass('subQuery');

                if(!this.getScope().$context){
                    this.getScope().$context = this.getController().generateContext();
                }

	            this.getController().registerContext(this.getContext());

	            if(!this.options.noHeader){
	                this.createHeader();
                }
	        }

	        this.construct();
	    },

	    changeValue: function(){
	        JSB.merge(this.getScope(), this.getDefaultValues());

	        this.getScope().$context = this.getController().generateContext();
	    },

	    construct: function(){
            var allowChangeSource = this.isAllowChangeSource(),
                descriptions = [],
                order = 0,
                sourceKeys = Syntax.getSourceKeys();

            for(var i in this.getScope()){
                descriptions.push({
                    key: i,
                    order: order++,
                    scheme: Syntax.getScheme(i) || {}
                });
            }

            descriptions.sort(function(a, b){
                var aPriority = JSB.isDefined(a.scheme.priority) ? a.scheme.priority : 0.5,
                    bPriority = JSB.isDefined(b.scheme.priority) ? b.scheme.priority : 0.5;

                if(aPriority > bPriority){
                    return -1;
                }

                if(aPriority < bPriority){
                    return 1;
                }

                return a.order - b.order;
            });

            for(var i = 0; i < descriptions.length; i++){
                var allowReplace = undefined;

                if(!allowChangeSource && sourceKeys[descriptions[i].key]){
                    allowReplace = false;
                }

                var render = this.createItem(descriptions[i].key, allowReplace);

                if(render){
                    this.append(render);
                }
            }

	        this.addMenu = new AddMenu({
	            existElements: this.getScope(),
	            menuItems: this.resolveMenuItems(),
	            callback: function(desc){
                    var render = $this.createItem(desc.key);

                    if(render){
                        $this.addMenu.before(render);
                    }

                    $this.onChange();
	            }
	        });
	        this.append(this.addMenu);

	        // footer
	        var footer = this.$('<footer></footer>');
	        this.append(footer);

	        function createFooterElement(name, hasValue, defVal){
	            var value = JSB.isDefined($this.getScope()[name]) ? $this.getScope()[name] : defVal;

                var element = $this.$('<div class="footerEl" title="' + name + '"></div>');
                footer.append(element);

                var icon = $this.$('<div class="icon"></div>');
                icon.attr('key', name);
                element.append(icon);

                if(JSB.isDefined($this.getScope()[name])){
                    element.addClass('enabled');
                }

                icon.click(function(){
                    if(JSB.isDefined($this.getScope()[name])){
                        element.removeClass('enabled');

                        delete $this.getScope()[name];
                    } else {
                        element.addClass('enabled');

                        $this.getScope()[name] = value;
                    }

                    $this.onChange();
                });

                if(hasValue){
                    var valueElement = $this.$('<div class="value">' + value + '</div>');
                    element.append(valueElement);

                    valueElement.click(function(evt){
                        evt.stopPropagation();

                        if(!element.hasClass('enabled')){
                            return;
                        }

                        $this.createInput(valueElement, 'number', function(newVal){
                            $this.getScope()[name] = newVal;
                            value = newVal;
                        });
                    })
                }
	        }

	        // distinct
	        createFooterElement('$distinct', false, true);

	        // limit
	        createFooterElement('$limit', true, 10);

	        // offset
	        createFooterElement('$offset', true, 0);
	    },

	    createHeader: function(){
            var header = this.$('<header></header>');
            this.append(header);

            var displayName = this.$('<div class="operator">' + this.getScheme().displayName + '<div>');
            header.append(displayName);

            header.append('<div class="context">' + this.getContext() + '</div>');

            this.installMenuEvents({
                element: displayName
            });

	        return header;
	    },

	    createItem: function(key, allowReplace){
	        return this.createRender({
	            allowReplace: allowReplace,
                key: key,
                scope: this.getScope(),
                deleteCallback: function(){
                    $this.addMenu.addItem(JSB.merge({}, this.getScheme(), {key: this.getKey()}));

                    this.remove();
                }
	        });
	    },

	    getContext: function(){
	        return this.getScope().$context;
	    },

	    getOutputFields: function(){
	        return Object.keys(this.getScope().$select).sort();
	    },

	    getViews: function() {
	        return this.getScope().$views || {};
	    },

	    isAllowChangeSource: function(){
	        return JSB.isDefined(this.options.allowChangeSource) ? this.options.allowChangeSource : true;
	    },

	    replaceValue: function(newKey, newValue){
	        for(var i in this._scope){
	            delete this._scope[i];
	        }
	    },

	    resolveMenuItems: function(){
	        var child = Syntax.getQueryElements(),
	            allowChild = this.options.allowChild;

            if(allowChild){
                child = child.filter(function(el){
                    if(allowChild.indexOf(el.key) === -1){
                        return false;
                    }

                    return true;
                });
            }

            return child;
	    },

	    // переопределение базового метода
	    setDefaultValues: function(){},

	    updateContexts: function(oldSourceContext, newSourceContext, sourceFields){
	        var sourceKeys = Syntax.getSourceKeys();

	        function update(list, context){
	            for(var i in list){
	                if(sourceKeys[list[i].getKey()]){
	                    continue;
	                }

	                if(list[i].getKey() === '$field' && list[i].getFieldContext() === context && list[i].getSourceContext() === oldSourceContext){
	                    if(sourceFields[list[i].getValues()]){
	                        list[i].setSourceContext(newSourceContext);
	                    } else {
	                        list[i].showError('В новом источнике нет данного поля');
	                    }
	                } else if(list[i].getKey() === '$query'){
	                    update(list[i].getChildren(), context || $this.getContext());
	                } else {
	                    update(list[i].getChildren(), context);
	                }
	            }
	        }

	        update(this.getChildren());
	    }
	}
}