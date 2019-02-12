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

            this.installMenuEvents(operator, this.getId() + '_operator', {
                removable: false,
                editToolCallback: function(desc){
                    debugger;
                }
            });

	        this.append('<div class="separator"></div>');

	        this.value = this.$('<div class="value">' + this.getValues() + '</div>');
	        this.append(this.value);

	        this.installValueMenu();

	        this.value.click(function(){
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
                    callback: function(desc){
debugger;
                        switch(desc.key){
                            case 'number':
                                var curVal = $this.getValues(),
                                    newVal = 0;

                                if(typeof curVal === 'number'){
                                    newVal = curVal;
                                }
                                break;
                            case 'string':
                                var curVal = $this.getValues();
                                break;
                            case 'boolTrue':
                                $this.setValues(true);
                                break;
                            case 'boolFalse':
                                $this.setValues(false);
                                break;
                            case 'null':
                                $this.setValues(null);
                        }

                        $this.value.attr('valType', desc.key);
                    }
                });
	        });
	    },

	    createInput: function(value){
            var input = $this.$('<input type="text" value="' + value + '" />');
            $this.value.append(input);

            input.change(function(){
                var newVal = input.val();

                if(newVal !== value){
                    $this.setValues(newVal);
                    input.remove();
                    $this.value.text(newVal);

                    $this.onChange();
                }
            });

            $this.$(window).on('click.changeConstInput', function(){
                input.remove();
                $this.$(window).off('click.changeConstInput');
            });
            input.click(function(evt){
                evt.stopPropagation();
            });

            input.focus();
	    },

	    installValueMenu: function(){
	        var value = this.getValues();

	        this.value.off('hover');

	        if(typeof value === 'string' || typeof value === 'number'){
                this.installMenuEvents(this.value, this.getId() + '_value', {
                    removable: false,
                    editCallback: function(){
                        $this.createInput(value);
                    }
                });
	        }
	    }
	}
}