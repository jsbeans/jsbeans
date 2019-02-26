{
	$name: 'DataCube.Query.Renders.SelectItem',
	$parent: 'DataCube.Query.Renders.Basic',

	$alias: '$selectItem',

	$client: {
		$require: ['JSB.Widgets.ToolManager',
		           'DataCube.Query.SimpleSelectTool',
		           'css:Const.css'],

	    $constructor: function(opts){
	        $base(opts);

	        this.addClass('selectItemRender');

            var fieldName = this.$('<div class="fieldName cubeFieldIcon sliceField">' + this.getKey() + '</div>');
            this.append(fieldName);

            this.append('<div class="separator"></div>');

            this.installMenuEvents(fieldName, JSB.generateUid(), {
                removable: true,
                replaceable: true,
                editCallback: function(){
// todo: change to createInput()
                    var curName = $this.getKey(),
                        input = $this.$('<input type="text" value="' + curName + '" />');
                    fieldName.append(input);

                    input.change(function(){
                        var newVal = input.val();

                        if(newVal !== curName){
                            $this.replaceValue(newVal);
                            $this.setKey(newVal);
                            input.remove();
                            fieldName.text(newVal);

                            $this.onChange();
                        }
                        $this.$(window).off('click.renameQueryFieldInput');
                    });

                    $this.$(window).on('click.renameQueryFieldInput', function(){
                        input.remove();
                        $this.$(window).off('click.renameQueryFieldInput');
                    });
                    input.click(function(evt){
                        evt.stopPropagation();
                    });

                    input.focus();
                }
            });

            for(var i in this.getValues()){
                var render = this.createRender({
                    key: i,
                    scope: this.getValues()
                });

                if(render){
                    this.append(render);
                }
            }
	    }
	}
}