{
	$name: 'Unimap.Render.Item',
	$parent: 'Unimap.Render.Basic',
	$require: ['JSB.Controls.Checkbox', 'JSB.Controls.Editor', 'JSB.Widgets.ColorEditor'],
	$client: {
	    construct: function(){
	        this.addClass('itemRender');
	        this.loadCss('Item.css');

	        if(this._scheme.optional){
	            this.addClass('optional');

	            this._values.checked = JSB.isDefined(this._values.checked) ? this._values.checked : this._scheme.optional == 'checked';

	            var checkBox = new Checkbox({
	                checked: this._values.checked,
	                onchange: function(b){
	                    $this._values.checked = b;
	                }
	            });

	            this.prepend(checkBox);
	        }

	        var name = this.$('<span class="name">' + this._scheme.name + '</span>');
	        this.append(name);

	        this.createDescription(name);

	        if(this._scheme.multiple){
	            this.multipleContainer = this.$('<div class="multipleContainer"></div>');

                this.multipleContainer.sortable({
                    handle: '.multipleItem',
                    update: function(){
                        $this.reorderValues();
                    }
                });

	            this.multipleBtn = this.$('<i class="multipleBtn fa fa-plus-circle"></i>');
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
	            this.addItem(null, 0);
	        }
	    },

	    addItem: function(values, itemIndex){
	        if(!values){
	            values = {};
	            this._values.values.push(values);
	        }

	        var item = this.$('<div class="item"></div>');

	        switch(this._scheme.editor){
	            case 'none':
	                break;
	            case 'color':
	                var editor = new ColorEditor({
                        onChange: function(val){
                            values.value = val;
                        }
	                });
	                editor.setData(values.value);
	                item.append(editor.getElement());
	                break;
                default:
                    var editor = new Editor({
                        type: this._scheme.editor,
                        onchange: function(){
                            values.value = this.getValue();
                        }
                    });
                    editor.setValue(values.value);
                    item.append(editor.getElement());
                    break;
	        }

	        if(this._scheme.multiple){
	            item.addClass('.multipleItem');

	            if(!itemIndex){
	                itemIndex = this.multipleContainer.find('.multipleItem').length;
	            }
	            item.attr('idx', itemIndex);

	            this.multipleBtn.before(item);
	        } else {
	            this.append(item);
	        }
	    }
    }
}