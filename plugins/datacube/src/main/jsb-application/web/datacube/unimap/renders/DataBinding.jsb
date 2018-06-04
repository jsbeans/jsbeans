{
	$name: 'Unimap.Render.DataBinding',
	$parent: 'Unimap.Render.Item',
	$require: ['JSB.Controls.Button', 'JSB.Controls.Select', 'JSB.Controls.ComboEditor', 'DataCube.Controls.SchemeSelector'],
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
                		items: this._dataList,
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

	    changeLinkTo: function(values){
	        this.createDataList(values);

            for(var i = 0; i < this._editors.length; i++){
                this._editors[i].setOptions(this._dataList, true);
            }

            this.updateCurrentBindings();
	    },

	    createDataList: function(values){
	        this._dataList = [];
	        this._bindingsInfo = {};

	        function collectFields(desc, items, path){
	        	if(!desc){
	        		return;
	        	}
	        	if(desc.type == 'array'){
	        		collectFields(desc.arrayType, items, path);
	        	} else if(desc.type == 'object'){
	        		var fieldArr = Object.keys(desc.record);
	        		fieldArr.sort(function(a, b){
	        			return a.toLowerCase().localeCompare(b.toLowerCase());
	        		});
	        		for(var i = 0; i < fieldArr.length; i++){
	        			var f = fieldArr[i];
	        			var rf = desc.record[f];
	        			var curPath = (path ? path + '.' : '') + f;
	        			var schemeRef = JSB.merge({field: f}, rf);
	        			var item = {
                            key: curPath,
                            value: $this.$('<div class="sliceRender">' + f + '</div>'),
                            child: [],
                            scheme: schemeRef,
                            parent: parent
                        };
	        			$this._bindingsInfo[curPath] = schemeRef;
	        			items.push(item);
	        			collectFields(rf, item.child, curPath);
	        		}
	        	}
	        }
	        
            if(values.values && values.values.length > 0 && values.values[0].binding){
            	collectFields(values.values[0].binding, this._dataList, '')
            }
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
                        this._editors[i].setValue();
                        this._values.values[i].binding = undefined;
                        this._values.values[i].bindingType = undefined;
                        this._values.values[i].value = undefined;
                        this._errorList.push(i);
                    }
                }
	        }

	        if(this._errorList.length > 0){
	            this.showError('Назначенное поле среза отсутствует!');
	        }
	    }
	}
}