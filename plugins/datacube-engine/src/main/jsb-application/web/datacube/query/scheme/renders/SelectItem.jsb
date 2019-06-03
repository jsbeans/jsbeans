/** DataCube - jsBeans extension | jsbeans.org (MIT Licence) | (c) Special Information Systems, LLC */

{
	$name: 'DataCube.Query.Renders.SelectItem',
	$parent: 'DataCube.Query.Renders.Basic',

	$alias: '$selectItem',

	$client: {
		$require: ['css:Const.css'],

		options: {
		    allowDelete: true,
		    allowReplace: true  // rename
		},

	    $constructor: function(opts){
	        $base(opts);

	        this.addClass('selectItemRender');

            this.fieldName = this.$('<div class="fieldName cubeFieldIcon sliceField">' + this.getKey() + '</div>');
            this.append(this.fieldName);

            this.append('<div class="separator"></div>');

            this.bindMenu(this.createMainMenuOptions({
                noClickEdit: true,
                editCallback: function(evt){
                    evt.stopPropagation();

                    var curName = $this.getKey(),
                        input = $this.$('<input type="text" value="' + curName + '" />');
                    $this.fieldName.append(input);

                    input.change(function(){
                        var newVal = input.val();

                        if(newVal !== curName && !input.hasClass('error')){
                            $this.rename(newVal);
                            input.remove();

                            $this.onChange({
                                name: 'renameField',
                                oldName: curName,
                                newName: newVal
                            });
                        }

                        $this.$(window).off('click.renameQueryFieldInput');
                    });

                    input.keyup(function(evt){
                        var newVal = input.val();

                        if(newVal !== curName && $this.getScope()[newVal]){
                            input.addClass('error');
                        } else {
                            input.removeClass('error');
                        }
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
            }));

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

	        this.fieldName.text(newName);
	    }
	}
}