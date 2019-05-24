/** DataCube - jsBeans extension | jsbeans.org (MIT Licence) | (c) Special Information Systems, LLC */

{
	$name: 'DataCube.Query.SchemeController',
	$parent: 'JSB.Controls.Control',
	$require: ['JSB.Widgets.ToolManager',
	           'DataCube.Query.Syntax',
	           'DataCube.Query.MenuTool',
	           'DataCube.Query.SchemeTool',
	           'DataCube.Query.RenderRepository',
	           'css:Controller.css'],

	$client: {
	    _contextMap: {},
	    _data: {},
	    _menu: null,
	    _query: null,
	    _queryRender: null,
	    _rendersMap: {},
	    _slice: null,

	    $constructor: function(opts){
	        $base(opts);
            this.addClass('queryController');

            Syntax.ensureReady(function(){
                $this.setTrigger('Syntax_initialized');
            });

            RenderRepository.ensureReady(function(){
                $this.setTrigger('RenderRepository_initialized');
            });

            if(opts && opts.data && opts.values){
                this.refresh(opts);
            }
	    },

	    options: {
	        onChange: undefined
	    },

	    clear: function(){
            for(var i in this._rendersMap){
                this._rendersMap[i].render.destroy();
            }
	    },

	    /**
	    * Создаёт рендер
	    *
	    * @param {object} options
	    * @param {string} options.key - ключ из запроса ($from, $add).
	    * @param {string} [options.renderName] - имя рендера. При отсутствии имя рендера берётся из схемы по ключу.
	    * @param {object} options.scope - скоп значений.
	    *
	    * @return {object|undefined} Объект, если существует подходящий рендер
	    */
        createRender: function(options, parent){
            if(options.key === '$context' || options.key === '$sourceContext'){
                return;
            }

            var scheme = Syntax.getScheme(options.key);

            if(!options.renderName && !scheme) {
                if(JSB.isString(options.scope)) {
                    var regexp = /\{(.*?)\}/;

                    if(options.scope.match(regexp)) {    // param
                        options.renderName = '$param';
                    } else {    // view
                        options.renderName = '$text';
                    }
                } else {
                    return;
                }
            }

            var render = RenderRepository.createRender(JSB.merge(options, {
                controller: this,
                parent: parent,
                renderName: options.renderName || scheme.render,
                scheme: scheme
            }));

            return render;
        },

        destroy: function(){
            this.clear();

            $base();
        },

        ensureComponentsInitialized: function(callback){
            this.ensureTrigger(['Syntax_initialized', 'RenderRepository_initialized'], callback);
        },

        generateContext: function(){
            var contextBase = 'subContext',
                context = contextBase,
                cnt = 1;

            while(this._contextMap[context]){
                context = contextBase + '_' + cnt;
                cnt++;
            }

            this._contextMap[context] = true;

            return context;
        },

        getData: function(key){
            if(key){
                return this._data[key];
            }

            return this._data;
        },

        getQuery: function(){
            return this._queryRender.getScope();
        },

        getRenderById: function(id){
            return this._rendersMap[id];
        },

        getSlice: function(){
            return this._slice;
        },

        getValues: function() {
            return this._query;
        },

        hideMenu: function(){
            if(this._menu){
                this._menu.close();
                this._menu = null;
            }
        },

        onChange: function(){
            if(this.options.onChange){
                this.options.onChange.call(this, this.getValues());
            }
        },

        refresh: function(opts){
            this.getElement().loader();

            this.ensureComponentsInitialized(function(){
                if($this._queryRender){
                    $this._queryRender.destroy();
                }

                $this._contextMap = {};

                if(opts.data){
                    $this.setData(opts.data);
                }

                if(opts.slice){
                    $this._slice = opts.slice
                }

                var queryOpts = {
                    renderName: '$query',
                    scope: opts.values
                };

                if(JSB.isDefined(opts.queryOpts)){
                    JSB.merge(queryOpts, opts.queryOpts);
                }

                var query = $this.createRender(queryOpts);

                if(query){
                    $this.append(query);
                    $this._query = opts.values;
                    $this._queryRender = query;
                }

                if($this.options.extendControllers) {
                    for(var i in $this.options.extendControllers) {
                        $this.options.extendControllers[i].refresh({
                            data: $this.getData(),
                            slice: $this.getSlice(),
                            query: $this.getQuery(),
                            onChange: function(type, options) {
                                var query = $this.getQuery();

                                switch(type) {
                                    case 'add':
                                        if(!query[options.alias]) {
                                            query[options.alias] = {};
                                        }

                                        query[options.alias][options.name] = options.values;
                                        break;
                                    case 'change':
                                        query[options.alias][options.name] = options.values;
                                        break;
                                    case 'rename':
                                        var oldValues = query[options.alias][options.oldName];

                                        query[options.alias][options.newName] = oldValues;

                                        delete query[options.alias][options.oldName];
                                        break;
                                    case 'remove':
                                        delete query[options.alias][options.name];
                                        break;
                                }

                                $this.onChange();
                            }
                        });
                    }
                }

                this.getElement().loader('hide');
            });
        },

        registerContext: function(context){
            this._contextMap[context] = true;
        },

        registerRender: function(render){
            var renderId = render.getId();

            this._rendersMap[renderId] = {
                children: {},
                render: render
            };

            if(render.getParent()){
                this._rendersMap[render.getParent().getId()].children[renderId] = render;
            }
        },

        setData: function(data){
            this._data = data;
        },

        showMenu: function(opts){
            if(this._menu){
                if(this._menu.getTool().getElementId() === opts.id){
                    if(this._menu.isVisible()){
                        return;
                    }
                } else {
                    this._menu.close();
                }
            }

			this._menu = ToolManager.activate({
				id: 'queryMenuTool',
				cmd: 'show',
				data: opts,
				scope: null,
				target: {
					selector: opts.element,
					dock: 'top',
					offsetVert: -1
				},
				callback: function(act, clickEvt){
				    switch(act){
				        case 'edit':
                            if(opts.editCallback){
                                opts.editCallback.call(opts.caller, clickEvt);
                                return;
                            }

                            $this.showTool(opts);
                            break;
                        case 'delete':
                            if(opts.deleteCallback){
                                opts.deleteCallback.call(opts.caller, clickEvt);
                                return;
                            }

                            opts.caller.remove();
                            break;
                        case 'wrap':
                            $this.showTool(JSB.merge(opts, {
                                callback: function(desc){
                                    opts.caller.wrap(desc, opts);
                                }
                            }));
                            break;
				    }
				}
			});
        },

        showTool: function(opts) {
			ToolManager.activate({
				id: 'querySchemeTool',
				cmd: 'show',
				data: JSB.merge(opts, {
				    data: this.getData(),
				    extendControllers: this.options.extendControllers,
				    sliceId: this.getSlice().getFullId()
				}),
				scope: null,
				target: {
					selector: opts.element,
					dock: 'bottom'
				},
				callback: opts.callback || function(desc) {
                    if(opts.editToolCallback){
                        opts.editToolCallback.call($this, desc);
                    } else {
                        opts.caller.changeTo(desc.schemeKey, desc.value, desc, opts);
                    }
				}
			});
        },

        unregisterRender: function(render){
            var renderId = render.getId(),
                parent = render.getParent();

            if(parent){
                var parentId = parent.getId();

                if(this._rendersMap[parentId]){
                    if(this._rendersMap[parentId].children[renderId]){
                        delete this._rendersMap[parentId].children[renderId];
                    }
                }
            }

            delete this._rendersMap[renderId];
        }
    }
}