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
	    _data: {},
	    _menu: null,
	    _query: null,
	    _refreshUid: 0,
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
                this._rendersMap[i].destroy();
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
            var scheme = Syntax.getSchema(options.key);

            if(!options.renderName && !scheme){
                return;
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

        getData: function(key){
            if(key){
                return this._data[key];
            }

            return this._data;
        },

        getQuery: function(){
            return this._query;
        },

        getRenderById: function(id){
            return this._rendersMap[id];
        },

        getSlice: function(){
            return this._slice;
        },

        getSourceFields: function(callback){
            this.getQuery().getSourceFields(callback);
        },

        getValues: function(){
            return this._values;
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
            this.ensureComponentsInitialized(function(){
                if($this._query){
                    $this._query.destroy();
                }

                $this._data = opts.data || $this._data;

                $this._slice = opts.slice || $this._slice;

                $this._refreshUid = JSB.generateUid();

                var query = $this.createRender({
                    renderName: '$query',
                    scope: opts.values
                });

                if(query){
                    $this.append(query);
                    $this._values = opts.values;
                    $this._query = query;
                }
            });
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

        showMenu: function(opts){
            if(this._menu){
                if(this._menu.getTool().getElementId() === opts.elementId){
                    return;
                } else {
                    this._menu.close();
                }
            }

			this._menu = ToolManager.activate({
				id: 'queryMenuTool',
				cmd: 'show',
				data: {
				    controller: this,
				    elementId: opts.elementId,
				    removable: opts.removable,
				    replaceable: opts.replaceable
				},
				scope: null,
				target: {
					selector: opts.element,
					dock: 'top',
					offsetVert: -1
				},
				callback: function(act, clickEvt){
				    if(act === 'edit'){
				        if(opts.editCallback){
				            opts.editCallback.call($this, clickEvt);
				            return;
				        }

				        $this.showTool({
                            allowOutputFields:  opts.allowOutputFields,
                            allowSourceFields: opts.allowSourceFields,
				            element: opts.element,
				            key: opts.key,
				            selectedId: opts.key,
				            caller: opts.caller,
				            callback: function(desc){
				                if(opts.editToolCallback){
				                    opts.editToolCallback.call($this, desc);
				                } else {
				                    opts.caller.changeTo(desc.key, desc.value, desc.context);
				                }
				            }
				        });
				    } else { // delete
				        if(opts.deleteCallback){
				            opts.deleteCallback.call($this, clickEvt);
				            return;
				        }

				        opts.caller.remove();
				        $this.onChange();
				    }
				}
			});
        },

        showTool: function(opts){
			var popupTool = ToolManager.activate({
				id: 'querySchemeTool',
				cmd: 'show',
				data: JSB.merge(opts, {
				    data: this.getData(),
				    sliceId: this._refreshUid,
				    query: this.getQuery()
				}),
				scope: null,
				target: {
					selector: opts.element,
					dock: 'bottom',
					offsetVert: -1
				},
				callback: opts.callback
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
        },
    }
}