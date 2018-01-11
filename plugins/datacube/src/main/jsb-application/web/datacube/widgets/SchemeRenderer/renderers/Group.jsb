{
	$name: 'Scheme.Render.Group',
	$parent: 'Scheme.Render.Basic',
	$require: ['JSB.Controls.Panel', 'JSB.Controls.Checkbox'],
	$client: {
	    construct: function(){
	        this.addClass('groupRender');
	        this.loadCss('Group.css');

	        this.group = new Panel({
	            title: this._scheme.name
	        });
	        this.append(this.group);

	        if(this._scheme.description){
                var descBtn = this.group.addCustomBtn('descBtn', {
                    after: 'collapseBtn'
                });
	        }

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

	        if(this._scheme.multiple){
                this.group.elements.content.sortable({
                    handle: '.sortableHandle',
                    update: function(){
                        $this.reorderValues();
                    }
                });

	            this.multipleBtn = this.$('<i class="multipleBtn fa fa-plus-circle"></i>');
	            this.multipleBtn.click(function(){
	                $this.addItem();
	            });
	            this.group.appendContent(this.multipleBtn);
	        }

	        if(this._values.values.length > 0){
	            for(var i = 0; i < this._values.values.length; i++){
	                this.addItem(this._values.values[i], i);
	            }
	        }
	    },

	    addItem: function(values, itemIndex){
	        if(!values){
	            values = {};

	            for(var i in this._scheme.items){
	                values[i] = {};
	            }

	            this._values.values.push(values);
	        }

	        if(this._scheme.multiple){
	            var item = this.$('<div class="multipleItem"></div>');

	            if(itemIndex){
	                item.attr('idx', itemIndex);
	            } else {
	                item.attr('idx', this.group.getElement().find('.multipleItem').length);
	            }

	            item.append(`#dot
                    <div class="sortableHandle">
                        <div></div>
                        <div></div>
                        <div></div>
                    </div>
                `);

                for(var i in this._scheme.items){
                    item.append(this.createRender(this._scheme.items[i].render, this._scheme.items[i], values[i]).getElement());
                }

                 this.multipleBtn.before(item);
	        } else {
                for(var i in this._scheme.items){
                    this.group.appendContent(this.createRender(this._scheme.items[i].render, this._scheme.items[i], values[i]));
                }
	        }
	    },

	    reorderValues: function(){
	        var items = this.group.getElement().find('.multipleItem');

	        for(var i = 0; i < items.length; i++){
	            var idx = Number(this.$(items[i]).attr('idx'));
	            if(idx !== i){
	                this.$(items[i]).attr('idx', i);

	                if(idx > i){
	                    var el = this._values.values.splice(idx, 1);
	                    this._values.values.splice(i, 0, el[0]);
	                }
	            }
	        }
	    }
	}
}