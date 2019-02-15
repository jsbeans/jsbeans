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
                removable: false
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

                        appendRender(item, render);
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