{
	$name: 'Unimap.Render.DataBinding',
	$parent: 'Unimap.Render.Item',
	$require: ['JSB.Controls.Button', 'JSB.Controls.Select', /*'JSB.Widgets.ComboBox'*/ 'JSB.Controls.ComboEditor'],
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
                    var editor = new ComboEditor({
                        clearBtn: true,
                        options: this._dataList,
                        value: values.value,
                        valueKey: JSB.isDefined(values.binding) ? values.binding : undefined,
                        onchange: function(val){
                            if(JSB.isDefined(val.key)){
                                values.value = val.key;
                                values.binding = val.key;
                                values.bindingType = $this._bindingsInfo[val.key].type;
                            } else {
                                values.value = val.value;
                                values.binding = undefined;
                                values.bindingType = undefined;
                            }

                            $this.onchange();
                        }
                    });

                    this._editors.push(editor);
                    break;
                case 'select':
                default:
                    var editor = new Select({
                        clearBtn: true,
                        options: this._dataList,
                        value: values.value,
                        onchange: function(val){
                            values.value = val.key;

                            if(JSB.isDefined(val.key)){
                                values.binding = val.key;
                                values.bindingType = $this._bindingsInfo[val.key].type;
                            } else {
                                values.binding = undefined;
                                values.bindingType = undefined;
                            }

                            $this.onchange();
                        }
                    });
                    this._editors.push(editor);
            }

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
                this._editors[i].setOptions(dataList, true);
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
	                    value: this.$('<div class="sliceRender">' + j + '</div>')
	                });

	                bindingsInfo[j] = values.values[i].binding.arrayType.record[j];
	            }
	        }
	        this._dataList = dataList;
	        this._bindingsInfo = bindingsInfo;

	        return dataList;
	    },

	    destroy: function(){
	        for(var i = 0; i < this._editors.length; i++){
	            this._editors[i].destroy();
	        }

	        $base();
	    },

	    setValues: function(values){
	        for(var i = 0; i < values.length; i++){
	            if(!this._values.values[i]){
	                this.addItem(values[i]);
	            } else {
	                this._editors[i].setValue(values[i]);
	            }
	        }
	    }
	}
}