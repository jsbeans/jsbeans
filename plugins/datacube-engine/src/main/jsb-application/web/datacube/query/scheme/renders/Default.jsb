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

	        var scheme = this.getScheme(),
	            values = this.getValues(),
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

            function appendRender(appendTo, render){
                if(render){
                    if(scheme.valueName){
                        var valueItem = $this.$('<div class="valueItem"></div>');
                        valueItem.append('<div class="valueName">' + scheme.valueName + '</div>');
                        valueItem.append($this.createSeparator());
                        valueItem.append(render);
                        appendTo.append(valueItem);
                    } else {
                        appendTo.append(render);
                    }
                }
            }

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
                                $this.removeItem(variables, item);
                            },
                            key: j,
                            scope: values[index]
                        });

                        appendRender(item, render);
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

                    appendRender(this, render);
                }
            }

            if(scheme.parameters){
                var isNeedChangeEvt = false;

                for(var i in scheme.parameters){
                    var parameter = this.$('<div class="param"></div>');
                    parameter.append('<div class="paramName">' + scheme.parameters[i].displayName + '</div>');
                    parameter.append(this.createSeparator());

                    var paramValue;

                    if(JSB.isDefined(values[i])){
                        paramValue = values[i];
                    } else {
                        values[i] = scheme.parameters[i].defaultValue;
                        isNeedChangeEvt = true;

                        if(scheme.parameters[i].type === 'text'){
                            paramValue = '"' + scheme.parameters[i].defaultValue + '"';
                        } else {
                            paramValue = scheme.parameters[i].defaultValue;
                        }
                    }

                    var value = this.$('<div class="paramValue">' + paramValue + '</div>');
                    parameter.append(value);

                    (function(value, type, paramName){
                        value.click(function(evt){
                            evt.stopPropagation();

                            $this.createInput(value, type, function(newVal){
                                values[paramName] = newVal;
                            });
                        });
                    })(value, scheme.parameters[i].type, i);

                    this.append(parameter);
                }

                if(isNeedChangeEvt){
                    this.onChange();
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