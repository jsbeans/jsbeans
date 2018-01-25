{
	$name: 'Unimap.Render.DataBinding',
	$parent: 'Unimap.Render.Item',
	$require: ['JSB.Controls.Editor'],
	$client: {
	    _editors: [],

	    construct: function(){
	        this.addClass('dataBindingRender');
	        this.loadCss('DataBinding.css');
	        $base();
	    },

	    addItem: function(values, itemIndex){
            if(!values){
                values = {};
                this._values.values.push(values);
            }

            var item = new Editor({
                onchange: function(){
                    values.value = item.getValue();
                }
            });
            this._editors.push(item);

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

	    changeLinkTo: function(values){
	        var dataList = [];
	        for(var i = 0; i < values.values.length; i++){
	            if(!values.values[i].binding){
	                continue;
	            }

	            for(var j in values.values[i].binding.arrayType.record){
	                dataList.push(j); // todo: source name
	            }
	        }

            for(var i = 0; i < this._editors.length; i++){
                this._editors[i].setDataList(dataList);
            }
	    }
	}
}