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
	    },

	    constructHead: function(){
	        var scheme = this.getScheme(),
	            desc = this.getKey() + '\n' + scheme.desc;

	        var operator = this.$('<div class="operator" title="' + desc + '">' + scheme.displayName + '</div>');
            this.append(operator);

            this.installMenuEvents(operator, this.getId() + '_operator', {
                removable: this.isAllowDelete(),
                deleteCallback: function(){
                    $this.getDeleteCallback().call($this);
                }
            });

            this.append(this.createSeparator(this.isMultiple() || scheme.parameters));
	    },

	    constructValues: function(){
	        var values = this.getValues();

            if(this.isMultiple()){
                var variables = this.$('<div class="variables"></div>');
                this.append(variables);

                function createItem(index, hideChangeEvt){
                    var item = this.$('<div class="variable" idx="' + index + '"></div>');

                    var sortableHandle = this.$(`
                        <div class="sortableHandle">
                            <div></div>
                            <div></div>
                            <div></div>
                        </div>
                    `);
                    item.append(sortableHandle);

                    variables.append(item);

                    for(var j in values[index]){
                        var render = $this.createRender({
                            allowDelete: true,
                            deleteCallback: function(){
                                $this.removeItem(variables.find('> .variable'), item);
                            },
                            key: j,
                            scope: values[index]
                        });

                        if(render){
                            item.append(render);
                        }
                    }

                    if(!hideChangeEvt){
                        $this.onChange();
                    }
                }

                for(var i = 0; i < values.length; i++){
                    createItem(i, true);
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
                    var index = $this.getValues().push($this.getDefaultAddValues()) - 1;

                    createItem(index);
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

	    replaceValue: function(newKey, newValue){
	        if(!JSB.isDefined(newValue)){
	            newValue = this.getScope()[this.getKey()];
	        }

            var isNewValMultiple = Syntax.getSchema(newKey).multiple,
                isCurrentValMultiple = this.isMultiple();

            if(isNewValMultiple && !isCurrentValMultiple){
                newValue = [newValue];
            }

            if(isCurrentValMultiple && !isNewValMultiple){
                newValue = newValue[0];
            }

	        delete this.getScope()[this.getKey()];

	        this._scope[newKey] = newValue;
	    }
	}
}