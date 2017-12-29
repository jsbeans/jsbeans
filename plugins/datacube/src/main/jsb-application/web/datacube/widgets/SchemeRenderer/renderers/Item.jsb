{
	$name: 'Scheme.Render.Item',
	$parent: 'Scheme.Render.Basic',
	$require: ['JSB.Controls.Checkbox', 'JSB.Widgets.PrimitiveEditor'],
	$client: {
	    construct: function(){
	        this.addClass('itemRender');

	        if(this._scheme.optional){
	            this.addClass('optional');

	            var checkBox = new Checkbox({
	                checked: this._values.checked,
	                onChange: function(b){
	                    $this._values.checked = b;
	                }
	            });

	            this.group.prepend(checkBox);
	        }

	        this.append('<span class="name">' + this._scheme.name + '</span>');

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
	        }

	        if(this._values.values.length > 0){
	            this.addItem(this._values.values[0], i);
	        }
	    },

	    addItem: function(values, itemIndex){
	        if(!values){
	            values = {};
	            this._values.values.push(values);
	        }

	        var item = this.$('<div></div>');

	        switch(this._scheme.options.editor){
                default:
                    var editor = new PrimitiveEditor({
                        onChange: function(val){
                            values.value = val;
                        }
                    });
                    item.append(editor);
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
	    },

	    setBinding: function(){

	    }
    }
}