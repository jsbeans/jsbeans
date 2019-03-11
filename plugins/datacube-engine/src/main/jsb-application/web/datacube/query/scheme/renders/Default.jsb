{
	$name: 'DataCube.Query.Renders.Default',
	$parent: 'DataCube.Query.Renders.Basic',

	$alias: '$default',

	$client: {
	    $require: ['DataCube.Query.Syntax',
	               'css:Default.css'],

	    $constructor: function(opts){
	        $base(opts);

	        this.addClass('defaultRender');

	        this.constructHead();

	        this.constructValues();

	        if(this.isMultiple() && !this.isFixedFieldCount()){
	            this.createAddButton();
            }
	    },

	    changeValue: function(oldDesc){
	        var schemeValues = this.getScheme().values,
	            oldValues = this.getValues(),
	            newVal = {};

            if(oldDesc.render === '$multiField'){
                var oldScheme = Syntax.getScheme(oldDesc.key),
                    newVal;

                if(this.isMultiple()){
                    oldValues = oldValues[0];
                    newVal = [];

                    for(var i in oldValues){
                        if(!oldScheme.values[i].parameter){
                            newVal.push(oldValues[i]);
                        }
                    }
                } else {
                    newVal = {};

                    for(var i in oldValues){
                        if(!oldScheme[i].parameter){
                            newVal = oldValues[i];
                            break;
                        }
                    }
                }

                this.setValues(newVal);
            }
	    },

	    // совместимость с некоторыми видами синтаксиса
	    checkValues: function(){
	        var curValues = this.getValues();

	        if(this.isMultiple()){
	            for(var i = 0; i < curValues.length; i++){
	                if(JSB.isString(curValues[i])){
	                    curValues[i] = {
	                        $field: curValues[i]
	                    }
	                }
	            }
	        } else {
                if(JSB.isString(curValues)){
                    this.setValues({
                        $field: curValues
                    });
                }
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

            if(this.isMultiple()){
                this.variables = this.$('<div class="variables"></div>');
                this.append(this.variables);

                if(this.isFixedFieldCount()){
                    for(var i = 0; i < this.isFixedFieldCount(); i++){
                        if(!JSB.isDefined(values[i])){
                            values[i] = this.getDefaultAddValues();
                        }

                        this.createItem(i, true);
                    }
                } else {
                    for(var i = 0; i < values.length; i++){
                        this.createItem(i, true);
                    }
                }

                if(this.isSortable()){
                    this.variables.sortable({
                        handle: '.sortableHandle',
                        update: function(){
                            $this.reorderValues($this.variables.find('> .variable'));
                        }
                    });
                }
            } else {
                var render = this.createRenderFromValues({
                    scope: this.getValues()
                });

                if(render){
                    this.append(render);
                }
            }
	    },

	    createAddButton: function(){
            var addBtn = this.$('<i class="addBtn"></i>');
            this.append(addBtn);
            addBtn.click(function(){
                var index = $this.getValues().push($this.getDefaultAddValues()) - 1;

                $this.createItem(index);
            });
	    },

	    createItem: function(index, hideChangeEvt){
	        var values = this.getValues(),
	            item = this.$('<div class="variable" idx="' + index + '"></div>');

            if(this.isSortable()){
                var sortableHandle = $this.$(`
                    <div class="sortableHandle">
                        <div></div>
                        <div></div>
                        <div></div>
                    </div>
                `);
                item.append(sortableHandle);
            }

            this.variables.append(item);

            for(var j in values[index]){
                var render = $this.createRender({
                    allowDelete: !this.isFixedFieldCount(),
                    deleteCallback: function(){
                        $this.removeItem($this.variables.find('> .variable'), item);
                    },
                    key: j,
                    scope: values[index]
                });

                if(render){
                    item.append(render);
                }
            }

            if(!hideChangeEvt){
                this.onChange();
            }
	    }
	}
}