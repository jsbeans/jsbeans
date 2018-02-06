{
	$name: 'Unimap.Render.DataBinding',
	$parent: 'Unimap.Render.Item',
	$require: ['JSB.Controls.Editor', 'JSB.Controls.Select'],
	$client: {
	    _editors: [],

	    construct: function(){
	        this.addClass('dataBindingRender');
	        this.loadCss('DataBinding.css');
	        $base();

            this.changeLinkTo(this.getValueByKey(this._scheme.linkTo));
	    },

	    addItem: function(values, itemIndex){
            if(!values){
                values = {};
                this._values.values.push(values);
            }

            switch(this._scheme.editor){
                case 'input':
                default:
                    var item = new Editor({
                        cssClass: 'editor',
                        value: values.value,
                        onchange: function(){
                            var val = item.getValue();
                            values.value = val;

                            // todo: add slice id

                            if($this._dataList.indexOf(val) > -1){
                                values.binding = val;
                            } else {
                                values.binding = undefined;
                            }
                        }
                    });
                    break;
                /*
                case 'select':
                default:
                    var item = new Select({
                        cssClass: 'editor',
                        value: values.value,
                        onchange: function(){
                            var val = item.getValue();
                            values.value = val;

                            // todo: add slice id

                            if($this._dataList.indexOf(val) > -1){
                                values.binding = val;
                            } else {
                                values.binding = undefined;
                            }
                        }
                    });
                */
            }

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
	        this._dataList = dataList;

            for(var i = 0; i < this._editors.length; i++){
                switch(this._scheme.editor){
                    case 'input':
                    default:
                        this._editors[i].setDataList(dataList);
                        break;
                    /*
                    case 'select':
                    default:
                        this._editors[i].setOptions(dataList, true);
                    */
                }
            }
	    }
	}
}