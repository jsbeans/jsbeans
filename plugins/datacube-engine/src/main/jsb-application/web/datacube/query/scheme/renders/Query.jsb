{
	$name: 'DataCube.Query.Renders.Query',
	$parent: 'DataCube.Query.Renders.Basic',

	$alias: '$query',

	$client: {
	    $require: ['DataCube.Query.Syntax',
	               'JSB.Widgets.ToolManager',
	               'DataCube.Query.SimpleSelectTool',
	               'css:Query.css'],

        _menuItems: [],

	    $constructor: function(opts){
	        $base(opts);

	        this.addClass('queryRender');

	        var sourceKeys = Syntax.getSourceKeys();

	        this.construct();
	    },

	    addMenuItem: function(item){
	        this._menuItems.push(item);

	        this.addBtn.removeClass('hidden');
	    },

	    construct: function(){
            var descriptions = [],
                order = 0;

            for(var i in this.getScope()){
                descriptions.push({
                    key: i,
                    order: order++,
                    scheme: Syntax.getSchema(i) || {}
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
                var render = this.createRender({
                    key: descriptions[i].key,
                    scope: this.getScope(),
                    queryBean: this
                });

                if(render){
                    this.append(render);
                }
            }
/*
            // todo: не всегда успевает синхронизироваться клиент с сервером??
            // функция не возвращает элементы
            this._menuItems = Syntax.getQueryElements();

            this.updateQueryItems();

            this.addBtn = this.$('<i class="addBtn"></i>');
            this.append(this.addBtn);
            this.addBtn.click(function(){
                ToolManager.activate({
                    id: 'simpleSelectTool',
                    cmd: 'show',
                    data: {
                        key: JSB.generateUid(),
                        values: $this._menuItems
                    },
                    scope: null,
                    target: {
                        selector: $this.getElement(),
                        dock: 'bottom'
                    },
                    callback: function(desc){
                        var render = $this.createRender({
                            key: desc.key,
                            scope: $this.getScope(),
                            queryBean: $this
                        });

                        if(render){
                            $this.addBtn.before(render);

                            $this.updateQueryItems();

                            if($this._menuItems.length === 0){
                                $this.addBtn.addClass('hidden');
                            }
                        }

                        $this.onChange();
                    }
                });
            });

            if(this._menuItems.length === 0){
                this.addBtn.addClass('hidden');
            }
*/
	    },

	    getSourceFields: function(callback){
	        var children = this.getChildren(),
	            sourceKeys = Syntax.getSourceKeys();

	        for(var i in children){
	            if(sourceKeys[children[i].getKey()]){
	                children[i].getSourceFields(callback);

	                return;
	            }
	        }
	    },

	    updateQueryItems: function(){
            for(var i in this.getScope()){
                for(var j = 0; j < this._menuItems.length; j++){
                    if(this._menuItems[j].key === i){
                        this._menuItems.splice(j, 1);

                        break;
                    }
                }
            }
	    }
	}
}