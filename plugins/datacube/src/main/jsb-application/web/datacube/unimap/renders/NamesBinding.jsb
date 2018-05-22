{
	$name: 'Unimap.Render.NamesBinding',
	$parent: 'Unimap.Render.Item',
	$require: ['JSB.Controls.ComboEditor'],
	$client: {
	    construct: function(){
	        this.addClass('namesBinding');
	        this.loadCss('NamesBinding.css');

	        this.createDataList(this.getValueByKey(this._scheme.linkTo));

	        $base();
	    },

	    addItem: function(values, itemIndex){
	        if(!values){
	            values = {};
	            this._values.values.push(values);
	        }

	        var item = this.$('<div class="item"></div>');

            var editor = new ComboEditor({
                clearBtn: true,
                editSelectValues: true,
                options: this._dataList,
                value: values.value,
                onchange: function(val){
                    values.value = val.value;

                    $this.onchange();
                }
            });
            item.append(editor.getElement());

            this._editors.push(editor);

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

            if(values.value){
                this.createInnerScheme(item, values.value, itemIndex);
            }
	    },

	    changeLinkTo: function(values){
	        this.createDataList(values);

            for(var i = 0; i < this._editors.length; i++){
                this._editors[i].setOptions(this._dataList, true);
            }
	    },

	    createDataList: function(values){
	        var dataList = [],
	            bindingsInfo = {};

	        for(var i = 0; i < values.values.length; i++){
	            if(!values.values[i].binding){
	                continue;
	            }

	            for(var j in values.values[i].binding.arrayType.record){
	                dataList.push({
	                    key: j,
	                    value: j
	                });

	                bindingsInfo[j] = values.values[i].binding.arrayType.record[j];
	            }
	        }
	        this._dataList = dataList;
	        this._bindingsInfo = bindingsInfo;

	        return dataList;
	    }
	}
}