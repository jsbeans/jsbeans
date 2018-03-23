{
	$name: 'Unimap.Render.ResourceItem',
	$parent: 'Unimap.Render.Item',
	$require: ['JSB.Controls.Select'],
	$client: {
	    _selectors: [],

	    construct: function(){
	        this.addClass('selectRender');
	        this.loadCss('Select.css');

	        this.loadOptions();

	        $base();
	    },

	    addItem: function(values, itemIndex){
	        if(!values){
	            values = {};
	            this._values.values.push(values);
	        }

	        values.value = values.value ? values.value : this._optionsList && this._optionsList.length > 0 ? this._optionsList[0].key : undefined;

	        var item = this.$('<div class="item"></div>');

            var select = new Select({
                options: this._optionsList,
                value: values.value,
                onchange: function(val){
                    values.value = val.key;
                    $this.onchange();
                }
            });
            item.append(select.getElement());

            this._selectors.push(select);

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

	    loadOptions: function(){
	        // load resource
	    }
	}
}