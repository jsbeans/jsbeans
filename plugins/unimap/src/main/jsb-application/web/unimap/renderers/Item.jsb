{
	$name: 'Unimap.Render.Item',
	$parent: 'Unimap.Render.Basic',
	$require: ['JSB.Controls.Checkbox', 'JSB.Controls.Editor'],
	$client: {
	    construct: function(){
	        this.addClass('itemRender');
	        this.loadCss('Item.css');

	        if(this._scheme.optional){
	            this.addClass('optional');

	            this._values.checked = JSB.isDefined(this._values.checked) ? this._values.checked : this._scheme.optional == 'checked';

	            var checkBox = new Checkbox({
	                checked: this._values.checked,
	                label: this._scheme.name,
	                onchange: function(b){
	                    $this._values.checked = b;

	                    $this.options.onchange.call($this, $this._values);
	                }
	            });

	            this.prepend(checkBox);

	            this.createRequireDesc(checkBox);
	            this.createDescription(checkBox);
	        } else {
                var name = this.$('<span class="name">' + this._scheme.name + '</span>');
                this.append(name);

                this.createRequireDesc(name);
                this.createDescription(name);
	        }

	        if(this._scheme.multiple){
	            this.multipleContainer = this.$('<div class="multipleContainer"></div>');

                this.multipleContainer.sortable({
                    handle: '.multipleItem',
                    update: function(){
                        $this.reorderValues();
                    }
                });

	            this.multipleBtn = this.$('<i class="multipleBtn fas fa-plus-circle"></i>');
	            this.multipleBtn.click(function(){
	                $this.addItem();
	            });
	            this.multipleContainer.append(this.multipleBtn);
	            this.append(this.multipleContainer);
	        }

	        if(this._values.values.length > 0){
	            for(var i = 0; i < this._values.values.length; i++){
	                this.addItem(this._values.values[i], i);
	            }
	        } else {
	            if(!this._scheme.multiple){
	                this.addItem(null, 0);
                }
	        }
	    },

	    addItem: function(values, itemIndex){
	        if(!values){
	            values = {};
	            this._values.values.push(values);

	            if(!itemIndex){
	                itemIndex = this._values.values.length - 1;
	            }
	        }

	        var item = this.$('<div class="item"></div>');

	        if(this._scheme.editor){
                switch(this._scheme.editor){
                    case 'none':
                        this.addClass('noEditor');
                        return;
                    default:
                        var onChangeFunc = function(val){
                            values.value = val;

                            $this.onchange();
                        },
                        opts = this._scheme.editorOpts ? JSB.merge(this._scheme.editorOpts, { value: values.value, onChange: onChangeFunc, onchange: onChangeFunc }) : { value: values.value, onChange: onChangeFunc, onchange: onChangeFunc };

                        JSB.lookup(this._scheme.editor, function(cls){
                            var editor = new cls(opts);
                            item.append(editor.getElement());
                        });
                }
            } else {
                var editor = new Editor({
                    type: this._scheme.editorOpts && this._scheme.editorOpts.type ? this._scheme.editorOpts.type : undefined,
                    value: values.value,
                    onchange: function(){
                        values.value = this.getValue();

                        $this.onchange();
                    }
                });
                item.append(editor.getElement());
            }

	        if(this._scheme.multiple){
	            item.addClass('multipleItem');

	            item.attr('idx', itemIndex);

	            this.multipleBtn.before(item);
	        } else {
	            this.append(item);
	        }
	    }
    }
}