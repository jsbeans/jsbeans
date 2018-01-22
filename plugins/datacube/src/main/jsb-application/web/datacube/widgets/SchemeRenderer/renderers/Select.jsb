{
	$name: 'Scheme.Render.Select',
	$parent: 'Scheme.Render.Basic',
	$require: ['JSB.Controls.Select'],
	$client: {
	    construct: function(){
	        this.addClass('selectRender');
	        //this.loadCss('Select.css');

	        if(this._scheme.optional){
	            this.addClass('optional');

	            var checkBox = new Checkbox({
	                checked: this._values.checked,
	                onChange: function(b){
	                    $this._values.checked = b;
	                }
	            });

	            this.prepend(checkBox);
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
	            this.append(this.multipleContainer);
	        }

	        this.createOptionsList();

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

            var select = new Select({
                options: this._optionsList,
                onchange: function(){
                    var val = select.getValue();
                    values.value = val;
                    $this.createInnerScheme(item, val, itemIndex);
                }
            });
            item.append(select.getElement());

            if(values.value){
                this.createInnerScheme(item, values.value, itemIndex);
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

	    createOptionsList: function(){
	        var opList = [];

	        for(var i in this._scheme.items){
	            opList.push({
	                name: this._scheme.items[i].name,
	                value: i
	            });
	        }

	        this._optionsList = opList;
	    },

	    createInnerScheme: function(item, value, itemIndex){
	        var innerScheme = item.find('.innerScheme');

	        if(innerScheme.length == 0){
	            innerScheme = this.$('<div class="innerScheme"></div>');
	        }

            if(!this._values[itemIndex].items){
                this._values[itemIndex].items = {};
            }

	        for(var i in this._scheme.items[value]){
	            if(!this._values[itemIndex].items[i]){
	                this._values[itemIndex].items[i] = {};
	            }

                this.append(this.createRender(this._scheme.items[value][i].render, this._scheme.items[value][i], this._values[itemIndex].items[i]));
	        }
	    }
	}
}