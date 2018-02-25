{
	$name: 'Unimap.Render.Group',
	$parent: 'Unimap.Render.Basic',
	$require: ['JSB.Controls.Button', 'JSB.Controls.Panel', 'JSB.Controls.Checkbox'],
	$client: {
	    construct: function(){
	        this.addClass('groupRender');
	        this.loadCss('Group.css');

	        this.group = new Panel({
	        	toolbarPosition: 'left',
	            title: this._scheme.name,
                collapseBtn: this._scheme.collapsable,
                collapsed: this._scheme.collapsed
	        });
	        this.append(this.group);

	        var name = this.group.find('.header h1');
	        this.createDescription(name);

	        if(this._scheme.optional){
	            this.addClass('optional');

	            this._values.checked = JSB.isDefined(this._values.checked) ? this._values.checked : this._scheme.optional == 'checked';

	            var checkBox = new Checkbox({
	                checked: this._values.checked,
	                onchange: function(b){
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

	            this.multipleBtn = this.$('<i class="multipleBtn fas fa-plus-circle"></i>');
	            this.multipleBtn.click(function(){
	                $this.addItem();
	            });
	            this.group.appendContent(this.multipleBtn);
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

	            for(var i in this._scheme.items){
	                values[i] = {};
	            }

	            this._values.values.push(values);

	            if(!itemIndex){
	                itemIndex = this._values.values.length - 1;
	            }
	        }

	        if(this._scheme.multiple){
	            var item = this.$('<div class="multipleItem"></div>');

	            item.attr('idx', itemIndex);

	            item.append(`#dot
                    <div class="sortableHandle">
                        <div></div>
                        <div></div>
                        <div></div>
                    </div>
                `);

                for(var i in this._scheme.items){
                    if(!values[i]){
                        values[i] = {};
                    }

                    item.append(this.createRender(i, this._scheme.items[i], values[i]).getElement());
                }

                item.append(new Button({
                    cssClass: 'dltBtn fas fa-times',
                    hasCaption: false,
                    onclick: function(){
                        $this.removeItem(itemIndex);
                    }
                }).getElement());

                this.multipleBtn.before(item);
	        } else {
                for(var i in this._scheme.items){
                    if(!values[i]){
                        values[i] = {};
                    }

                    this.group.appendContent(this.createRender(i, this._scheme.items[i], values[i]));
                }
	        }
	    },

	    removeItem: function(itemIndex){
	        var items = this.group.getElement().find('.multipleItem');
	        for(var i = 0; i < items.length; i++){
	            var idx = Number(this.$(items[i]).attr('idx'));

	            if(idx === itemIndex){
	                items[i].remove();
	                this._values.values.splice(idx, 1);
	                continue;
	            }

	            if(idx > itemIndex){
	                this.$(items[i]).attr('idx', idx - 1);
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