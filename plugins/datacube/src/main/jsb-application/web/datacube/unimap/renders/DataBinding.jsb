{
	$name: 'Unimap.Render.DataBinding',
	$parent: 'Unimap.Render.Item',
	$require: ['JSB.Controls.Button', 'JSB.Controls.Select', 'JSB.Controls.ComboEditor', 'DataCube.Controls.SchemeSelector', 'Unimap.Render.DataBindingCache'],
	$client: {
        _dataList: [],
        _cubeFieldList: [],
        _bindingsInfo: {},
	    _editors: [],
	    _errorList: [],

	    construct: function(){
	        this.addClass('dataBindingRender');
	        this.loadCss('DataBinding.css');

	        this._dataList = DataBindingCache.get(this.getContext(), this._scheme.linkTo, 'DataBinding_dataList') || [];
	        this._cubeFieldList = DataBindingCache.get(this.getContext(), this._scheme.linkTo, 'DataBinding_cubeFieldList') || [];
	        this._bindingsInfo = DataBindingCache.get(this.getContext(), this._scheme.linkTo, 'DataBinding_bindingsInfo') || {};

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

            switch(this._scheme.editor){
                case 'input':
                    var dataList = [];
                    for(var i = 0; i < this._dataList.length; i++){
                        dataList.push({
                            key: this._dataList[i].key,
                            value: this._dataList[i].value.clone()
                        })
                    }

                    // todo: ComboEditor like Select

                    var editor = new ComboEditor({
                    	cssClass: 'item',
                        clearBtn: true,
                        options: dataList,
                        value: values.value,
                        valueKey: JSB.isDefined(values.binding) ? values.binding : undefined,
                        onchange: function(val){
                            if(JSB.isDefined(val.key)){
                                values.value = val.key;
                                values.binding = val.key;
                                values.bindingType = $this._bindingsInfo[val.key].type;
                                values.bindingInfo = $this._bindingsInfo[val.key];
                            } else {
                                values.value = val.value;
                                values.binding = undefined;
                                values.bindingType = undefined;
                                values.bindingInfo = undefined;
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
                    var editor = new Select({
                    	cssClass: 'item',
                        clearBtn: !this._scheme.multiple,
                        cloneOptions: true,
                        options: this._dataList,
                        value: values.value,
                        onchange: function(val){
                            values.value = val.key;

                            if(JSB.isDefined(val.key)){
                                values.binding = val.key;
                                values.bindingType = $this._bindingsInfo[val.key].type;
                                values.bindingInfo = $this._bindingsInfo[val.key];
                            } else {
                                values.binding = undefined;
                                values.bindingType = undefined;
                                values.bindingInfo = undefined;
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
                case 'scheme':
                default:
                	var editor = new SchemeSelector({
                		cssClass: 'item',
                		context: this.getContext(),
                		sourceKey: this._scheme.linkTo,
                	    clearBtn: !this._scheme.multiple,
                	    cubeFields: this._scheme.cubeFields,
                		items: this._dataList,
                		cubeItems: this._cubeFieldList,
                		value: values.value,
                		selectNodes: JSB.isDefined(this._scheme.selectNodes) ? this._scheme.selectNodes : true,
                		onChange: function(key, val){
                            if(val && JSB.isDefined(val.key)){
                            	values.value = val.key;
                                values.binding = val.key;
                                values.bindingType = $this._bindingsInfo[val.key].type;
                                values.bindingInfo = $this._bindingsInfo[val.key];
                            } else {
                            	values.value = undefined;
                                values.binding = undefined;
                                values.bindingType = undefined;
                                values.bindingInfo = undefined;
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
            }

	        if(this._scheme.multiple){
	            var item = this.$('<div class="multipleItem" idx="' + itemIndex + '"></div>');

	            item.append(editor.getElement());

                var removeButton = $this.$('<i class="btn btnDelete fas fa-times-circle" title="Удалить"></i>');
                removeButton.click(function(evt){
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
                    removeButton.remove();
                });
                item.append(removeButton);

	            this.multipleBtn.before(item);
	        } else {
	            this.append(editor);
	        }
	    },

	    changeLinkTo: function(values, render, callback){
	        this._dataList = DataBindingCache.get(this.getContext(), this._scheme.linkTo, 'DataBinding_dataList');
	        this._cubeFieldList = DataBindingCache.get(this.getContext(), this._scheme.linkTo, 'DataBinding_cubeFieldList');
	        this._bindingsInfo = DataBindingCache.get(this.getContext(), this._scheme.linkTo, 'DataBinding_bindingsInfo');

            for(var i = 0; i < this._editors.length; i++){
            	if(JSB.isInstanceOf(this._editors[i], 'DataCube.Controls.SchemeSelector')){
            		this._editors[i].setOptions(this._dataList, this._cubeFieldList, render.updateId);
            	} else {
            		this._editors[i].setOptions(this._dataList, true);
            	}
            }

            if(this._values.values[0] && !this._values.values[0].value && this._scheme.autocomplete){
                var val = render.getField(this.getKey());

                if(val){
                    this.setValues([val]);
                }
            }

            this.updateCurrentBindings();
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
	            if(JSB.isDefined(this._values.values[i].value)){
                    if(this._bindingsInfo[this._values.values[i].value]){
                        this._values.values[i].bindingType = this._bindingsInfo[this._values.values[i].value].type;
                    } else {
                        if(!this._scheme.editor === 'input'){
                            this._editors[i].setValue();
                            this._values.values[i].binding = undefined;
                            this._values.values[i].bindingType = undefined;
                            this._values.values[i].value = undefined;
                            this._errorList.push(i);
                        }
                    }
                }
	        }

	        if(this._errorList.length > 0){
	            this.showError('Назначенное поле среза отсутствует!');
	        }
	    }
	}
}