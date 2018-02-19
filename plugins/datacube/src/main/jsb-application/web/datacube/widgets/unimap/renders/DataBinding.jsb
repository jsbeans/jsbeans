{
	$name: 'Unimap.Render.DataBinding',
	$parent: 'Unimap.Render.Item',
	$require: ['JSB.Controls.Button', 'JSB.Controls.Editor', 'JSB.Controls.Select'],
	$client: {
	    _editors: [],

	    construct: function(){
	        this.addClass('dataBindingRender');
	        this.loadCss('DataBinding.css');

	        this.createDataList(this.getValueByKey(this._scheme.linkTo));

	        $base();
	    },

	    addItem: function(values, itemIndex){
            if(!values){
                values = {};
                this._values.values.push(values);

	            if(!itemIndex){
	                itemIndex = this._values.values.length - 1;
	            }
            }

            switch(this._scheme.editor){
                case 'input':
                    var editor = new Editor({
                        cssClass: 'editor',
                        dataList: this._dataList,
                        value: values.value,
                        onchange: function(){
                            var val = editor.getValue();
                            values.value = val;

                            // todo: add slice id

                            if($this._dataList.indexOf(val) > -1){
                                values.binding = val;
                                values.bindingType = $this._bindingsInfo[val].type;
                            } else {
                                values.binding = undefined;
                            }

                            $this.options.onchange.call($this, $this._values);
                        }
                    });
                    break;
                case 'select':
                default:
                    var editor = new Select({
                        cssClass: 'editor',
                        options: this._dataList,
                        value: values.value,
                        onchange: function(){
                            var val = editor.getValue();
                            values.value = val;

                            // todo: add slice id

                            if($this._dataList.indexOf(val) > -1){
                                values.binding = val;
                                values.bindingType = $this._bindingsInfo[val].type;
                            } else {
                                values.binding = undefined;
                            }

                            $this.options.onchange.call($this, $this._values);
                        }
                    });
                    /*
                    if(!values.value){
                        item.setValue(this._dataList[0], true);
                    }
                    */
            }

            this._editors.push(editor);

	        if(this._scheme.multiple){
	            var item = this.$('<div class="multipleItem" idx="' + itemIndex + '"></div>');

	            item.append(editor.getElement());

	            var removeBtn = new Button({
                    hasIcon: true,
                    hasCaption: false,
                    cssClass: 'btnDelete',
                    tooltip: 'Удалить',
                    onclick: function(evt){
                        evt.stopPropagation();
                        $this._values.values.splice(itemIndex, 1);
                        item.remove();
                        editor.destroy();
                        removeBtn.destroy();
                    }
	            });
	            item.append(removeBtn.getElement());

	            this.multipleBtn.before(item);
	        } else {
	            this.append(editor);
	        }
	    },

	    changeLinkTo: function(values){
	        var dataList = this.createDataList(values);

            for(var i = 0; i < this._editors.length; i++){
                switch(this._scheme.editor){
                    case 'input':
                        this._editors[i].setDataList(dataList);
                        break;
                    case 'select':
                    default:
                        var val = this._editors[i].getValue();
                        this._editors[i].setOptions(dataList, true);

                        if(val && this._editors[i].hasOption(val)){
                            this._editors[i].setValue(val);
                        }
                        /*
                        if(!val){
                            this._editors[i].setValue(dataList[0], true);
                        }
                        */
                }
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
	                dataList.push(j); // todo: source name
	                bindingsInfo[j] = values.values[i].binding.arrayType.record[j];
	            }
	        }
	        this._dataList = dataList;
	        this._bindingsInfo = bindingsInfo;

	        return dataList;
	    }
	}
}