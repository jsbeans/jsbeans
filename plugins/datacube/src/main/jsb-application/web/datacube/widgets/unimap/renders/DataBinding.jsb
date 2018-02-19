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
                    var manualEditor = new Editor({
                        cssClass: 'editor',
                        value: values.binding ? undefined : values.value,
                        onchange: function(){
                            values.value = manualEditor.getValue();

                            $this.options.onchange.call($this, $this._values);
                        }
                    });

                    var editor = new Select({
                        cssClass: 'editor',
                        options: this._dataList,
                        value: values.binding ? values.value : undefined,
                        onchange: function(){
                            var val = editor.getValue();

                            if(val !== null){
                                manualEditor.addClass('hidden');

                                values.value = val;

                                values.binding = val;
                                values.bindingType = $this._bindingsInfo[val].type;
                            } else {
                                manualEditor.removeClass('hidden');

                                values.value = manualEditor.getValue();
                                values.binding = null;
                                values.bindingType = null;
                            }

                            $this.options.onchange.call($this, $this._values);
                        }
                    });
                    this._editors.push(editor);

                    var editorEl = this.$('<div class="twoEditors"></div>');
                    editorEl.append(manualEditor.getElement());
                    editorEl.append(editor.getElement());

                    if(values.binding){
                        manualEditor.addClass('hidden');
                    }
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
                    this._editors.push(editor);

                    var editorEl = editor.getElement();
            }

	        if(this._scheme.multiple){
	            var item = this.$('<div class="multipleItem" idx="' + itemIndex + '"></div>');

	            item.append(editorEl);

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
	            this.append(editorEl);
	        }
	    },

	    changeLinkTo: function(values){
	        var dataList = this.createDataList(values);

            for(var i = 0; i < this._editors.length; i++){
                var val = this._editors[i].getValue();
                this._editors[i].setOptions(dataList, true);

                if(val && this._editors[i].hasOption(val)){
                    this._editors[i].setValue(val);
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