{
	$name: 'DataCube.Query.Renders.Default',
	$parent: 'DataCube.Query.Renders.Basic',

	$alias: '$default',

	$client: {
	    $require: ['css:Default.css'],

	    $constructor: function(opts){
	        $base(opts);

	        this.addClass('defaultRender');

	        var scheme = this.getScheme(),
	            values = this.getValues();

	        var operator = this.$('<div class="operator">' + scheme.displayName + '</div>');
            this.append(operator);

            this.installMenuEvents(operator, this.getId() + '_operator', {
                removable: false
            });

            this.append(this.createSeparator(this.isMultiple()));

            if(this.isMultiple()){
                var variables = this.$('<div class="variables"></div>');
                this.append(variables);

                function createItem(index){
                    var item = this.$('<div class="variable" idx="' + index + '"></div>');

                    var sortableHandle = this.$(`
                        <div class="sortableHandle">
                            <div></div>
                            <div></div>
                            <div></div>
                        </div>
                    `);
                    item.append(sortableHandle);

                    (function(item){
                        $this.installMenuEvents(sortableHandle, JSB.generateUid(), {
                            editable: false,
                            deleteCallback: function(){
                                $this.removeItem(variables, item);
                            }
                        });
                    })(item);

                    variables.append(item);

                    return item;
                }

                for(var i = 0; i < values.length; i++){
                    var item = createItem(i);

                    for(var j in values[i]){
                        var render = this.createRender({
                            key: j,
                            scope: this.getValues()[i]
                        });

                        if(render){
                            item.append(render);
                        }
                    }
                }

                variables.sortable({
                    handle: '.sortableHandle',
                    update: function(){
                        $this.reorderValues(variables.find('> .variable'));
                    }
                });

                var addBtn = this.$('<i class="addBtn"></i>');
                this.append(addBtn);
                addBtn.click(function(){
                    var index = $this.getValues().push({$const: 0}) - 1,
                        item = createItem(index);

                    var render = $this.createRender({
                        key: '$const',
                        scope: $this.getValues()[index]
                    });

                    if(render){
                        item.append(render);

                        $this.onChange();
                    }
                });
            } else {
                for(var j in values){
                    var render = this.createRender({
                        key: j,
                        scope: this.getValues()
                    });

                    if(render){
                        this.append(render);
                    }
                }
            }
	    },

	    changeTo: function(newKey, newValue){
	        // todo: for multiple && not multiple values
	    }
	}
}