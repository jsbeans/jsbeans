/** DataCube - jsBeans extension | jsbeans.org (MIT Licence) | (c) Special Information Systems, LLC */

{
	$name: 'DataCube.Query.Renders.Params',
	$parent: 'DataCube.Query.Renders.ParamsViewsBase',

	$alias: '$params',

    $client: {
	    $require: ['DataCube.Query.Helper',
	               'JSB.Controls.MultitypeEditor',
	               'JSB.Controls.Selectize',
	               'css:Params.css'],

        $constructor: function(opts) {
            $base(opts);

            this.addClass('params');
        },

	    create: function(values, name, isInherit) {
	        if(name) {
	            name = this.unwrapName(name);
	        } else {
                name = Helper.createName(this.getUnwrappedParams(), 'Параметр');
            }

            var isNew = false;

            if(!values) {
                values = {
                    $defaultValue: 0,
                    $type: 'number'
                };

                isNew = true;
            }
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
                name: 'Дата',
                value: 'date'
            },
            {
                name: 'Логический',
                value: 'boolean'
            },
            {
                name: 'Строковый',
                value: 'string'
            },
            {
                name: 'Числовой',
                value: 'number'
            }
            ];

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

	        var typeEditor = new Selectize({
	            label: 'Тип',
	            labelField: 'name',
	            onlySelect: true,
	            options: types,
	            searchField: 'name',
	            value: values.$type,
	            valueField: 'value',
	            onChange: function(val){
	                values.$type = val;

	                valueEditor.setType(valueType(val));

	                $this.onChange('change', {
	                    name: $this.wrapName(item.getTitle()),
	                    values: values
	                });
	            }
	        });

            var valueEditor = new MultitypeEditor({
                label: 'Значение',
                type: valueType(values.$type),
                value: values.$defaultValue,
                onEditComplete: function(val) {
                    values.$defaultValue = val;

	                $this.onChange('change', {
	                    name: $this.wrapName(item.getTitle()),
	                    values: values
	                });
                }
            });

            var item = this.createItem(name, function() {
                typeEditor.destroy();
                valueEditor.destroy();
            }, function(name) {
                return $this.wrapName(name);
            });
            item.append(typeEditor);
            item.append(valueEditor);

            if(isNew) {
                this.onChange('add', {
                    name: this.wrapName(item.getTitle()),
                    values: values
                });
            }
	    },

	    getUnwrappedParams: function() {
	        var values = this.getValues(),
	            params = {};

            for(var i in values) {
                params[this.unwrapName(i)] = true;
            }

            return params;
	    },

	    wrapName: function(name) {  // "${param name}"
	        return '${' + name + '}';
	    },

	    unwrapName: function(name) {
	        var regexp = /\{(.*?)\}/;
	        return name.match(regexp)[1];
	    }
    }
}