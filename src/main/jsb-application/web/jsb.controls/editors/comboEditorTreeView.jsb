{
	$name: 'JSB.Controls.ComboEditorTreeView',
	$parent: 'JSB.Controls.Control',

	$client: {
		$require: ['JSB.Widgets.ToolManager',
		           'JSB.Controls.ComboEditorTreeViewDropDown',
		           'css:comboEditorTreeView.css'],

	    _currentValue: undefined,
	    _dropDownElement: null,
	    _options: {},
	    _value: null,

	    $constructor: function(opts) {
	        $base(opts);

            this.addClass('jsb-comboEditorTreeView');

            this.currentVal = this.$('<div class="curVal"></div>');
            this.append(this.currentVal);

            this.dropDownBtn = this.$('<i class="dropDownBtn"></i>');
            this.append(this.dropDownBtn);

            if(this.options.clearBtn){
                this.clearBtn = this.$('<i class="clearBtn hidden"></i>');
                this.append(this.clearBtn);

                this.clearBtn.click(function(){
                    $this.setValue();
                });

                this.getElement().mouseenter(() => {
                    this.clearBtn.addClass('show');
                });

                this.getElement().mouseleave(() => {
                    this.clearBtn.removeClass('show');
                });
            }

            if(this.options.options){
                this.setOptions(this.options.options);
            }

	        if(JSB.isDefined(this.options.value)){
	            this.setValue(this.options.value, true);
	        }

            if(!this.options.onlySelect) {
                this.currentVal.click(function(){
                    if(!$this.editor){
                        $this.createEditor();
                    }
                });
            }

            this.dropDownBtn.click(evt => {
                evt.stopPropagation();

                this.openDropDown();
            });
	    },

	    options: {
	        clearBtn: false,
	        itemRender: null,
	        onlySelect: false
	    },

	    clear: function() {
	        this._value = null;

            this._optionsList = {};
            this.currentVal.empty();
	    },

	    createEditor: function() {
	        this.editor = this.$('<input />');
	        this.currentVal.append(this.editor);

	        if(this._value){
	            this.editor.val(this._value);
	        }

	        this.editor.keyup(evt => {
	            // enter: 13 key code
	            if(evt.keyCode === 13) {
	                let value = this.editor.val();

	                if(value !== this._value) {
	                    this.setValue(value);
	                }

                    this.editor.remove();
                    this.editor = null;
	            } else if(evt.keyCode === 27) {
                    this.editor.remove();
                    this.editor = null;
	            }
	        });

	        this.editor.focusout(() => {
                let value = this.editor.val();

                if(value !== this._value) {
                    this.setValue(value);
                }

	            this.editor.remove();
	            this.editor = null;
	        });

	        this.editor.focus();
	    },

	    getValue: function() {
            return this._value;
	    },

	    openDropDown: function() {
            ToolManager.activate({
                id: 'ComboEditorTreeViewDropDown',
                cmd: 'show',
                data: {
                    itemRender: this.options.itemRender,
                    options: this._options
                },
                target: {
                    selector: this.getElement(),
                    dock: 'bottom'
                },
                callback: (value) => {
                    this.setValue(value);
                }
            });
	    },

	    setOptions: function(options) {
            function prepareOptions(options, parentKey) {
	            options.forEach(item => {
	                $this._options[item.value] = {
	                    key: item.key || JSB.generateUid(),
	                    originalItem: item,
	                    parentKey: parentKey
	                };

	                if(item.children) {
	                    prepareOptions(item.children, $this._options[item.value].key);
	                }
	            });
            }

            this._dropDownElement && this._dropDownElement.remove();
            this._options = {};

            prepareOptions(options);

            this.setValue(this._currentValue, true);

	        if(options.length) {
	            this.dropDownBtn.removeClass('hidden');
	        } else {
	            this.dropDownBtn.addClass('hidden');
	        }
	    },

	    setValue: function(val, hEvt) {
	        this._value = val;

            this.currentVal.empty();

            this._currentValue = val;

            if(JSB.isDefined(val)) {    // edit
                if(this._options[val]) {
                    if(this.options.itemRender) {
                        this.currentVal.append(this.options.itemRender.call(this, this._options[val]));
                    } else {
                        this.currentVal.append(this._options[val].element.clone());
                    }
                } else {
                    this.currentVal.append('<div class="simpleValue">' + val + '</div>');
                }
            }

	        if(this.clearBtn) {
                if(JSB.isDefined(val)) {
                    this.clearBtn.removeClass('hidden');
                } else {
                    this.clearBtn.addClass('hidden');
                }
	        }

	        if(!hEvt && JSB.isFunction(this.options.onChange)) {
	            this.options.onChange.call(this, val, this._options[val] && this._options[val].originalItem);
	        }
	    }
	}
}