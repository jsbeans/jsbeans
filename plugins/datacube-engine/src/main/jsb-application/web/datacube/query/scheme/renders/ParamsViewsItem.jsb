/** DataCube - jsBeans extension | jsbeans.org (MIT Licence) | (c) Special Information Systems, LLC */

{
	$name: 'DataCube.Query.Renders.ParamsViewsItem',
	$parent: 'DataCube.Query.Renders.Basic',

	$alias: '$paramsViewsItem',

	$client: {
		$require: ['JSB.Controls.Editor',
		           'css:ParamsViewsItem.css'],

		options: {
		    allowDelete: true,
		    allowReplace: true  // rename
		},

	    $constructor: function(opts){
	        $base(opts);

	        this.addClass('paramsViewsItemRender');

            this.fieldName = this.$('<div class="fieldName">' + this.getKey() + '</div>');
            this.append(this.fieldName);

            this.append('<div class="separator"></div>');

            this.bindMenu(this.createMainMenuOptions({
                noClickEdit: true,
                editCallback: function(evt){
                    evt.stopPropagation();

                    var curName = $this.getKey(),
                        isParam = $this.getOption('category') === '$param';

                    if(isParam) {
                        curName = $this.unwrapName(curName);
                    }

                    var editor = new Editor({
                            value: curName,
                            validator: function(newVal, oldVal) {
                                if($this.getValues()[newVal]) {
                                    return false;
                                } else {
                                    return true;
                                }
                            },
                            onEditComplete: function(newVal, isValid) {
                                if(isValid) {
                                    editor.destroy();

                                    if(isValid) {
                                        if(isParam) {
                                            newVal = $this.wrapName(newVal);
                                        }

                                        if(curName !== newVal) {
                                            return;
                                        }

                                        $this.rename(newVal);

                                        $this.onChange();
                                    }
                                }
                            }
                        });
                    $this.fieldName.append(editor);

                    editor.focus();
                }
            }));

            var render = this.createRender({
                allowDelete: false,
                allowReplace: false,
                allowWrap: false,
                key: this.getKey(),
                renderName: this.getOption('category') + 'Item',
                scope: this.getScope()
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