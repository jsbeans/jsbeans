{
	$name: 'Unimap.Render.DataBinding',
	$parent: 'Unimap.Render.Item',
	$require: ['JSB.Controls.Button', 'JSB.Controls.Select', 'JSB.Controls.ComboEditor'],
	$client: {
	    _editors: [],
	    _errorList: [],

	    construct: function(){
	        this.addClass('dataBindingRender');
	        this.loadCss('DataBinding.css');

	        this.createDataList(this.getValueByKey(this._scheme.linkTo));

	        $base();

	        this.createErrorDesc(this._name);
	    },

	    addItem: function(values, itemIndex){
            if(!values){
                values = {};
                this._values.values.push(values);

	            if(!itemIndex){
	                itemIndex = this._values.values.length - 1;
	            }
            }

            var dataList = [];
            for(var i = 0; i < this._dataList.length; i++){
                dataList.push({
                    key: this._dataList[i].key,
                    value: this._dataList[i].value.clone()
                })
            }

            switch(this._scheme.editor){
                case 'input':
                    var editor = new ComboEditor({
                        clearBtn: true,
                        options: dataList,
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

                            var errIndex = $this._errorList.indexOf(itemIndex);
                            if(errIndex > -1){
                                $this._errorList.splice(errIndex, 1);

                                if($this._errorList.length === 0){
                                    $this.hideError();
                                }
                            }

                            $this.onchange();
                        }
                    });

                    this._editors.push(editor);
                    break;
                case 'select':
                default:
                    var editor = new Select({
                        clearBtn: !this._scheme.multiple,
                        options: dataList,
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

                            var errIndex = $this._errorList.indexOf(itemIndex);
                            if(errIndex > -1){
                                $this._errorList.splice(errIndex, 1);

                                if($this._errorList.length === 0){
                                    $this.hideError();
                                }
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

                        var errIndex = $this._errorList.indexOf(itemIndex);
                        if(errIndex > -1){
                            $this._errorList.splice(errIndex, 1);

                            if($this._errorList.length === 0){
                                $this.hideError();
                            }
                        }

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
	        this.createDataList(values);

            for(var i = 0; i < this._editors.length; i++){
                var dataList = [];
                for(var j = 0; j < this._dataList.length; j++){
                    dataList.push({
                        key: this._dataList[j].key,
                        value: this._dataList[j].value.clone()
                    })
                }

                this._editors[i].setOptions(dataList, true);
            }

            this.updateCurrentBindings();
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
	    },

	    updateCurrentBindings: function(){
	        this._errorList = [];

	        for(var i = 0; i < this._values.values.length; i++){
	            if(this._bindingsInfo[this._values.values[i].value]){
	                this._values.values[i].bindingType = this._bindingsInfo[this._values.values[i].value].type;
	            } else {
	                this._editors[i].setValue();
                    this._values.values[i].binding = undefined;
                    this._values.values[i].bindingType = undefined;
                    this._values.values[i].value = undefined;
                    this._errorList.push(i);
	            }
	        }

	        if(this._errorList.length > 0){
	            this.showError('Назначенное поле среза отсутствует!');
	        }
	    }
	}
}