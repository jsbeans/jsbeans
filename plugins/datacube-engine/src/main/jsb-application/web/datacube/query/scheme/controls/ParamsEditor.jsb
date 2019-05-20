{
	$name: 'DataCube.Query.Controls.ParamsEditor',
	$parent: 'DataCube.Query.Controls.ExtendEditor',

	$alias: '$params',

	$client: {
	    $require: ['DataCube.Query.Helper',
	               'JSB.Controls.Editor',
	               'JSB.Controls.Selectize',
	               'css:ParamsEditor.css'],

	    $constructor: function(opts) {
	        $base(opts);
// todo: inherited params
	        this.addClass('paramsEditor');
	    },

	    create: function(values, name, isInherit) {
	        if(name) {
	            name = this.unwrapName(name);
	        } else {
                name = Helper.createName(this._descs, 'Параметр');
            }

            var isNew = false;

            if(!values) {
                values = {
                    $defaultValue: 0,
                    $type: 'number'
                };

                isNew = true;
            }

            var types = [
            {
                name: 'Числовой',
                value: 'number'
            },
            {
                name: 'Строковый',
                value: 'string'
            }
            ];

            function valueType(type) {
                switch(type) {
                    case 'string':
                        return 'text';
                    case 'number':
                        return 'number';
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
	                    name: $this.wrapName(name),
	                    values: values
	                });
	            }
	        });

            var valueEditor = new Editor({
                label: 'Значение',
                type: valueType(values.$type),
                value: values.$defaultValue,
                onEditComplete: function(val) {
                    values.$defaultValue = val;

	                $this.onChange('change', {
	                    name: $this.wrapName(name),
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
                    name: this.wrapName(name),
                    values: values
                });
            }
	    },

	    refresh: function(opts) {
	        $base(opts);
	    },

	    wrapName: function(name) {  // "${param name}"
	        return '${' + name + '}';
	    },

	    unwrapName: function(name) {
	        var regexp = /\{(.*?)\}/;
	        return name.match(regexp)[1];
	    }
	},

	$server: {
	    $require: ['DataCube.Query.Extractors.ExtractUtils'],

	    getInheritParams: function(query) {
	        return ExtractUtils.extractAllowedParams(query, query);
	    }
	}
}