/** DataCube - jsBeans extension | jsbeans.org (MIT Licence) | (c) Special Information Systems, LLC */

{
	$name: 'DataCube.Query.Renders.ParamItem',
	$parent: 'DataCube.Query.Renders.Basic',

	$alias: '$paramItem',

    $client: {
	    $require: ['DataCube.Query.SimpleSelectTool',
	               'JSB.Controls.MultitypeEditor',
	               'JSB.Widgets.ToolManager'],

        $constructor: function(opts) {
            $base(opts);

            this.addClass('paramItem');

/*
			    string: 'string',
			    number: 'number',
			    integer: 'number',
			    uint: 'number',
			    long: 'number',
			    ulong: 'number',
			    boolean: 'boolean',
			    float: 'float',
			    double: 'double',
			    datetime: 'date',
			    date: 'date',
			    time: 'date',
			    timestamp: 'date',
			    array: 'array',
			    object: 'object',
*/
            var types = [
                {
                    key: 'date',
                    displayName: 'Дата'
                },
                {
                    key: 'boolean',
                    displayName: 'Логический'
                },
                {
                    key: 'string',
                    displayName: 'Строковый'
                },
                {
                    key: 'number',
                    displayName: 'Числовой'
                }
                ],
                values = this.getValues();

            function valueType(type) {
                switch(type) {
                    case 'string':
                        return 'text';
                    case 'boolean':
                        return 'bool';
                    default:
                        return type;
                }
            }

            var typeEditor = this.$('<div class="typeEditor"><label>Тип</label></div>');
            this.append(typeEditor);

	        var type = this.$('<div class="type"></div>');
	        typeEditor.append(type);

	        for(var i = 0; i < types.length; i++) {
	            if(types[i].key === values.$type) {
	                type.text(types[i].displayName);
	                break;
	            }
	        }

	        type.click(function(evt) {
	            evt.stopPropagation();

                ToolManager.activate({
                    id: 'simpleSelectTool',
                    cmd: 'show',
                    data: {
                        key: $this.getKey(),
                        values: types
                    },
                    scope: null,
                    target: {
                        selector: $this.getElement(),
                        dock: 'bottom'
                    },
                    callback: function(desc) {
                        if(desc.key !== values.$type) {
                            type.text(desc.item.displayName);

                            values.$type = desc.key;

                            valueEditor.setType(valueType(desc.key));

                            $this.onChange();
                        }
                    }
                });
	        });

            var valueEditor = new MultitypeEditor({
                label: 'Значение',
                type: valueType(values.$type),
                value: values.$defaultValue,
                onEditComplete: function(val) {
                    values.$defaultValue = val;

	                $this.onChange();
                }
            });
            this.append(valueEditor);
        }
    }
}