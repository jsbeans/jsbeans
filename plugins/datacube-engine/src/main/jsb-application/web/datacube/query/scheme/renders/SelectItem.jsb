{
	$name: 'DataCube.Query.Renders.SelectItem',
	$parent: 'DataCube.Query.Renders.Basic',

	$alias: '$selectItem',

	$client: {
		$require: ['css:Const.css'],

	    $constructor: function(opts){
	        $base(opts);

	        this.addClass('selectItemRender');

            var fieldName = this.$('<div class="fieldName cubeFieldIcon sliceField">' + this.getKey() + '</div>');
            this.append(fieldName);

            this.append('<div class="separator"></div>');

            this.installMenuEvents({
                element: fieldName,
                id: JSB.generateUid(),
                edit: true,
                remove: true,
                editCallback: function(evt){
                    evt.stopPropagation();

                    var curName = $this.getKey(),
                        input = $this.$('<input type="text" value="' + curName + '" />');
                    fieldName.append(input);

                    input.change(function(){
                        var newVal = input.val();

                        if(newVal !== curName){
                            $this.rename(newVal);
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

            var render = this.createRenderFromValues({
                allowDelete: false,
                scope: this.getValues()
            });

            if(render){
                this.append(render);
            }
	    },

	    rename: function(newName){
	        var value = this.getValues();

	        this._scope[newName] = value;
	        delete this._scope[this.getKey()];

	        this.setKey(newName);
	    }
	}
}