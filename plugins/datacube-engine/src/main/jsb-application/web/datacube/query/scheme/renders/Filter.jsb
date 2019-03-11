{
	$name: 'DataCube.Query.Renders.Filter',
	$parent: 'DataCube.Query.Renders.Basic',

	$alias: '$filter',

	$client: {
	    $require: ['DataCube.Query.Syntax',
	               'JSB.Widgets.ToolManager',
                   'DataCube.Query.SimpleSelectTool'],

	    $constructor: function(opts){
	        $base(opts);

	        this.addClass('filterRender');

	        var replacements = Syntax.getReplacementGroup('$filter');

	        for(var i = 0; i < replacements.length; i++){
	            this._menuItems.push(JSB.merge({}, Syntax.getScheme(replacements[i]), {key: replacements[i]}));
	        }

	        if(opts.parent.getRenderName() === '$query'){
	            this._isQueryElement = true;

	            this.createHeader(true);

	            this.addClass('queryElements');
	        } else {
	            this.constructHead()
	        }

	        this.createAddButton();

	        this.constructValues();
	    },

	    _isQueryElement: false,
	    _menuItems: [],

	    changeValue: function(oldDesc){
	        // todo
	        this.setValues({});
	    },

	    checkValues: function(){
	        var values = this.getValues(),
	            filter = Syntax.getReplacementGroup('$filter');

            for(var i in values){
                if(filter.indexOf(i) === -1){
                    delete values[i];
                }
            }

            if(Object.keys(values).length === 0){
                this.setValues(this.getDefaultValues());
            }
	    },

	    constructHead: function(){
	        var scheme = this.getScheme(),
	            desc = this.getKey() + '\n' + scheme.desc;

	        var operator = this.$('<div class="operator" title="' + desc + '">' + scheme.displayName + '</div>');
            this.append(operator);

            this.installMenuEvents({
                element: operator,
                id: this.getId() + '_operator',
                wrap: this.isAllowWrap(),
                deleteCallback: function(){
                    $this.getDeleteCallback().call($this);
                }
            });

            this.append(this.createSeparator(this.isMultiple() || scheme.parameters));
	    },

	    constructValues: function(){
	        var values = this.getValues();

            for(var i in values){
                var render = $this.createRender({
                    key: i,
                    scope: values
                });

                if(render){
                    this.addBtn.before(render);
                }
            }
	    },

	    createAddButton: function(){
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
                            scope: $this.getValues()
                        });

                        if(render){
                            $this.addBtn.before(render);

                            $this.updateMenuItems();

                            $this.onChange();
                        }
                    }
                });
            });

            this.updateMenuItems();
	    },

	    createRender: function(options, parent){
	        JSB.merge(options, {
	            allowDelete: true,
	            deleteCallback: function(){
	                $this._menuItems.push(JSB.merge({}, this.getScheme(), {key: this.getKey()}));

	                this.remove();

	                $this.updateMenuItems();

	                $this.onChange();
	            }
	        });

	        return $base(options, parent);
	    },

	    remove: function(){
	        if(this._isQueryElement){
	            this.getParent().addMenuItem(JSB.merge({}, this.getScheme(), {key: this.getKey()}));
            }

	        $base();
	    },

	    updateMenuItems: function(){
	        for(var i in this.getValues()){
                for(var j = 0; j < this._menuItems.length; j++){
                    if(this._menuItems[j].key === i){
                        this._menuItems.splice(j, 1);

                        break;
                    }
                }
	        }

            if($this._menuItems.length === 0){
                this.addBtn.addClass('hidden');
            } else {
                this.addBtn.removeClass('hidden');
            }
	    }
	}
}