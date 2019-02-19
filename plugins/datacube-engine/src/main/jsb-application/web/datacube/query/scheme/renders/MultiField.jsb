{
	$name: 'DataCube.Query.Renders.MultiField',
	$parent: 'DataCube.Query.Renders.Basic',

	$alias: '$multiField',

	$client: {
	    $require: ['DataCube.Query.Syntax',
	               'css:MultiField.css'],

	    $constructor: function(opts){
	        $base(opts);

	        this.addClass('multiFieldRender');

	        var scheme = this.getScheme(),
	            values = this.getValues(),
	            desc = this.getKey() + '\n' + scheme.desc,
	            isNeedChangeEvt = false;

            if(!JSB.isObject(values)){
                this.setValues({});
                values = this.getValues();
            }

            // remove unexisted keys
            for(var i in values){
                if(!scheme.values[i]){
                    delete this._scope[this.getKey()][i];

                    isNeedChangeEvt = true;
                }
            }

	        var operator = this.$('<div class="operator" title="' + desc + '">' + scheme.displayName + '</div>');
            this.append(operator);

            this.installMenuEvents(operator, this.getId() + '_operator', {
                removable: this.isAllowDelete(),
                deleteCallback: this.getDeleteCallback()
            });

            this.append(this.createSeparator(true));

            var fields = this.$('<div class="fields"></div>');
            this.append(fields);

            for(var i in scheme.values){
                var field = this.$('<div class="field"></div>');
                fields.append(field);

                field.append('<div class="valueName">' + scheme.values[i].displayName + '</div>');

                field.append(this.createSeparator());

                if(scheme.values[i].parameter){
                    var paramValue;

                    if(JSB.isDefined(values[i])){
                        paramValue = values[i];
                    } else {
                        values[i] = scheme.values[i].defaultValues;
                        isNeedChangeEvt = true;

                        if(scheme.values[i].type === 'text'){
                            paramValue = '"' + scheme.values[i].defaultValues + '"';
                        } else {
                            paramValue = scheme.values[i].defaultValues;
                        }
                    }

                    var paramValueElement = this.$('<div class="paramValue">' + paramValue + '</div>');
                    field.append(paramValueElement);

                    (function(value, type, paramName){
                        value.click(function(evt){
                            evt.stopPropagation();

                            $this.createInput(value, type, function(newVal){
                                values[paramName] = newVal;
                            });
                        });
                    })(paramValueElement, scheme.values[i].type, i);
                } else {
                    if(!values[i]){
                        values[i] = scheme.values[i].defaultValues;
                    }

                    for(var k in values[i]){
                        var render = this.createRender({
                            key: k,
                            scope: this.getValues()[i]
                        });

                        if(render){
                            field.append(render);
                        }
                    }
                }
            }

            if(isNeedChangeEvt){
                this.onChange();
            }
	    }
	}
}