/** DataCube - jsBeans extension | jsbeans.org (MIT Licence) | (c) Special Information Systems, LLC */

{
	$name: 'DataCube.Query.Renders.MultiField',
	$parent: 'DataCube.Query.Renders.Basic',

	$alias: '$multiField',

	$client: {
	    $require: ['DataCube.Query.Syntax',
	               'JSB.Controls.Checkbox',
	               'DataCube.Query.Controls.AddMenu',
	               'css:MultiField.css'],

	    $constructor: function(opts){
	        $base(opts);

	        this.addClass('multiFieldRender');

	        var scheme = this.getScheme(),
	            values = this.getValues(),
	            desc = this.getKey() + '\n' + scheme.desc,
	            isNeedChangeEvt = false;

	        var operator = this.$('<div class="operator" title="' + desc + '">' + scheme.displayName + '</div>');
            this.append(operator);

            this.bindMenu(this.createMainMenuOptions());

            this.append(this.createSeparator(true));

            this.fields = this.$('<div class="fields"></div>');
            this.append(this.fields);

            for(var i in scheme.values){
                if(scheme.values[i].optional){
                    if(JSB.isDefined(values[i])){
                        isNeedChangeEvt = this.create(i, true) || isNeedChangeEvt;
                    } else {
                        this.createAddMenu();
                        this.addMenu.addItem(JSB.merge({key: i}, scheme.values[i]));
                    }
                } else {
                    this.create(i);
                }
            }

            if(isNeedChangeEvt){
                this.onChange();
            }
	    },

	    changeValue: function(oldDesc){
	        var schemeValues = this.getScheme().values,
	            oldValues = this.getValues(),
	            newVal = {};

	        switch(oldDesc.render){
	            case '$field':
	            case '$default':
	            case '$const':
	                for(var i in schemeValues){
	                    if(!schemeValues[i].parameter){
	                        newVal[i] = oldValues;
	                        break;
	                    }
	                }
	                break;
                case '$multiField':
                    var oldScheme = Syntax.getScheme(oldDesc.key);

                    for(var i in oldValues){
                        if(oldScheme.values[i].parameter){
                            for(var j in schemeValues){
                                if(schemeValues[j].parameter){
                                    newVal[j] = oldValues[i];
                                }
                            }
                        }
                    }
                    break;
	        }

	        this.setValues(newVal);
	    },

	    create: function(name, removable){
	        var scheme = this.getScheme().values[name],
	            field = this.createField(name, scheme, removable);

	        if(scheme.parameter){
	            return this.createParameter(field, name);
	        } else {
	            return this.createValue(field, name);
	        }
	    },

	    createAddMenu: function(){
	        if(this.addMenu){
	            return;
	        }

	        this.addMenu = new AddMenu({
	            callback: function(desc){
                    $this.create(desc.key, true);

                    $this.onChange();
	            }
	        });
	        this.append(this.addMenu);
	    },

	    createField: function(name, scheme, removable){
            var field = this.$('<div class="field"></div>');
            this.fields.append(field);

            var valueName = this.$('<div class="valueName">' + scheme.displayName + '</div>');
            field.append(valueName);

            if(removable){
                this.bindMenu({
                    element: valueName,
                    id: this.getId() + '_value_' + name,
                    edit: false,
                    remove: true,
                    noClickEdit: true,
                    deleteCallback: function(){
                        delete $this.getValues()[name];

                        field.remove();

                        $this.addMenu.addItem(JSB.merge({key: name}, scheme));

                        $this.onChange();
                    }
                });
            }

            field.append(this.createSeparator());

            return field;
	    },

	    createParameter: function(field, name){
	        var scheme = this.getScheme().values[name],
	            value = this.getValues()[name],
	            isNeedChangeEvt = false,
	            paramValue;

            if(!JSB.isDefined(value)){
                this.getValues()[name] = scheme.defaultValues;
                value = this.getValues()[name];

                isNeedChangeEvt = true;
            }

            switch(scheme.type){
                case 'text':
                    value = '"' + value + '"';
                case 'number':
                    var paramValueElement = this.$('<div class="paramValue">' + value + '</div>');
                    field.append(paramValueElement);

                    paramValueElement.click(function(evt){
                        evt.stopPropagation();

                        $this.createInput(paramValueElement, scheme.type, function(newVal){
                            $this.getValues()[name] = newVal;
                        });
                    });
                    break;
                case 'enum':
                    break;
                case 'boolean':
                    var checkbox = new Checkbox({
                        checked: value,
                        onChange: function(b){
                            $this.getValues()[name] = b;

                            $this.onChange();
                        }
                    });
                    field.append(checkbox);
                    break;
            }

            return isNeedChangeEvt;
	    },

	    createValue: function(field, name){
	        var scheme = this.getScheme().values[name];

            if(scheme.scopeValue){
                var render = this.createRender({
                    allowDelete: false,
                    allowWrap: scheme.wrap,
                    key: name,
                    renderName: scheme.renderName ? scheme.renderName : undefined,
                    scope: this.getValues()
                });

                if(render){
                    field.append(render);
                }
            } else {
                if(!this.getValues()[name]){
                    this.getValues()[name] = scheme.defaultValues;
                }

                var render = this.createRenderFromValues({
                    allowDelete: false,
                    allowWrap: scheme.wrap,
                    renderName: scheme.renderName ? scheme.renderName : undefined,
                    scope: this.getValues()[name]
                });

                if(render){
                    field.append(render);
                }
            }
	    }
	}
}