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
	    _eventSubscribers: {
	        onRenderCreate: {}
	    },
	    _data: {},
	    _menu: null,
	    _query: null,
	    _renders: [],
	    _slice: null,

	    $constructor: function(opts){
	        $base(opts);
            this.addClass('queryController');

            if(opts && opts.data && opts.values){
                this.refresh(opts);
            }
	    },

	    options: {
	        onChange: undefined
	    },

	    clear: function(){
            for(var i = 0; i < this._renders.length; i++){
                this._renders[i].destroy();
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

            var render = RenderRepository.createRender(JSB.merge(options, {
                controller: this,
                parent: parent,
                renderName: options.renderName || scheme.render,
                scheme: scheme
            }));

            if(render){
                this._renders.push(render);

                this.noticeSubscribers('onRenderCreate', render);
            }

            return render;
        },

        destroy: function(){
            this.clear();

            $base();
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

        noticeSubscribers: function(eventName, desc){
            for(var i in this._eventSubscribers[eventName]){
                this._eventSubscribers[eventName][i].call(this, desc);
            }
        },

        onChange: function(){
            if(this.options.onChange){
                this.options.onChange.call(this, this.getValues());
            }
        },

        refresh: function(opts){
            RenderRepository.ensureReady(function(){
                if($this._query){
                    $this._query.destroy();
                }

                $this._data = opts.data || $this._data;

                $this._slice = opts.slice || $this._slice;

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
				callback: function(act){
				    if(act === 'edit'){
				        if(opts.editCallback){
				            opts.editCallback.call($this);
				            return;
				        }

				        $this.showTool({
				            element: opts.element,
				            key: opts.key,
				            selectedId: opts.key,
				            callback: function(desc){
				                if(opts.editToolCallback){
				                    opts.editToolCallback.call($this, desc);
				                } else {
				                    opts.caller.changeTo(desc.key);
				                }
				            }
				        });
				    } else { // delete
				        if(opts.deleteCallback){
				            opts.deleteCallback.call($this);
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
				    data: this._data,
				    sliceId: this.getSlice().getFullId(),
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

        subscribeTo: function(id, eventName, callback){
            this._eventSubscribers[eventName][id] = callback;
        },

        unsubscribe: function(id){
            for(var i in this._eventSubscribers){
                if(this._eventSubscribers[i][id]){
                    delete this._eventSubscribers[i][id];
                }
            }
        }
    }
}