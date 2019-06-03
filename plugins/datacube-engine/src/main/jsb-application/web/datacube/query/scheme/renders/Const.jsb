/** DataCube - jsBeans extension | jsbeans.org (MIT Licence) | (c) Special Information Systems, LLC */

{
	$name: 'DataCube.Query.Renders.Const',
	$parent: 'DataCube.Query.Renders.Basic',

	$alias: '$const',

	$client: {
		$require: ['JSB.Widgets.ToolManager',
		           'DataCube.Query.SimpleSelectTool',
		           'css:Const.css'],

	    $constructor: function(opts){
	        $base(opts);

	        this.addClass('constRender');

	        var scheme = this.getScheme();

	        var operator = this.$('<div class="operator">' + scheme.displayName + '</div>');
	        this.append(operator);

	        this.bindMenu(this.createMainMenuOptions());

	        this.append('<div class="separator"></div>');

	        var value = this.$('<div class="value"></div>');
	        this.append(value);

	        var valueType = 'text';
	        if(typeof this.getValues() === 'number'){
	            valueType = 'number';

	            value.text(this.getValues());
	        } else {
	            value.text('"' + this.getValues() + '"');
	        }

	        this.bindMenu({
	            element: value,
	            id: this.getId() + '_value',
	            noClickEdit: true,
	            edit: true,
	            remove: false,
	            wrap: false,
	            editCallback: function() {
                    ToolManager.activate({
                        id: 'simpleSelectTool',
                        cmd: 'show',
                        data: {
                            key: $this.getKey(),
                            values: $this.getScheme().values
                        },
                        scope: null,
                        target: {
                            selector: $this.getElement(),
                            dock: 'bottom'
                        },
                        callback: function(desc) {
                            switch(desc.key) {
                                case 'number':
                                    var curVal = $this.getValues(),
                                        newVal = 0;

                                    if(typeof curVal === 'number') {
                                        newVal = curVal;
                                    }

                                    value.text(newVal);

                                    $this.setValues(newVal);

                                    $this.createInput(value, 'number', function(val) {
                                        $this.setValues(val);
                                    });
                                    break;
                                case 'string':
                                    var curVal = $this.getValues(),
                                        newVal = '';

                                    if(typeof curVal === 'string') {
                                        newVal = curVal;
                                    }

                                    value.text('"' + newVal + '"');

                                    $this.setValues(newVal);

                                    $this.createInput(value, 'text', function(val) {
                                        $this.setValues(val);
                                    });
                                    break;
                                case 'boolTrue':
                                    $this.setValues(true);
                                    value.text('true');
                                    break;
                                case 'boolFalse':
                                    $this.setValues(false);
                                    value.text('false');
                                    break;
                                case 'null':
                                    $this.setValues(null);
                                    value.text('null');
                            }

                            value.attr('valType', desc.key);

                            $this.onChange();
                        }
                    });
	            }
	        });

	        value.click(function(evt){
	            evt.stopPropagation();

	            $this.createInput(value, valueType, function(newVal){
	                $this.setValues(newVal);
	            });
	        });
	    },

	    changeValue: function(oldDesc){
	        this.setValues(this.getDefaultValues());
	    },

	    checkValues: function(){
	        var values = this.getValues();

	        if(!(JSB.isString(values) || JSB.isNumber(values) || JSB.isBoolean(values) || JSB.isNull(values))){
	            this.setValues(this.getDefaultValues());
	        }
	    },

	    replaceValue: function(newKey, newValue){
	        if(!JSB.isDefined(newValue)){
	            newValue = {
	                $const: this.getValues()
	            }
	        }

	        $base(newKey, newValue);
	    }
	}
}