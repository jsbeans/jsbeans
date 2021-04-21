{
	$name: 'JSB.Controls.ComboEditorTreeView',
	$parent: 'JSB.Controls.Control',

	$client: {
		$require: ['JSB.Widgets.TreeView',
		           'css:comboEditorTreeView.css'],

	    _dropDownElement: null,
	    _options: [],
	    _value: null,
	    _values: {},

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
            }

            if(this.options.options){
                this.setOptions(this.options.options, true);
            }

	        if(JSB.isDefined(this.options.value)){
	            this.setValue(this.options.value, this.options.valueKey, true);
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

                if(!this._dropDownElement) {
                    this.constructDropDown();
                }

                if(this.getElement().has(this._dropDownElement.get(0)).length) {
                    this._dropDownElement.detach();
                } else {
                    this.append(this._dropDownElement);

                    let top = this.getElement().offset().top,
                        elementHeight = this.getElement().height(),
                        ddHeight = this._dropDownElement.outerHeight(),
                        bodyHeight = this.$(window).height();

                    if(bodyHeight <= top + elementHeight + ddHeight){
                        this._dropDownElement.css('top', 'initial');
                        this._dropDownElement.css('bottom', elementHeight);
                    } else {
                        this._dropDownElement.css('top', elementHeight);
                        this._dropDownElement.css('bottom', 'initial');
                    }

                    this.$(document).on('click.comboEditor_closeDD', evt => {
                        if(!this._dropDownElement.is(evt.target) && this._dropDownElement.has(evt.target).length === 0) {

                            this._dropDownElement.detach();

                            this.$(document).off('click.comboEditor_closeDD');
                        }
                    });
                }
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

	    constructDropDown: function() {
	        this._dropDownElement = this.$('<div class="dropDown"></div>');

	        let tree = new TreeView({
	            onSelectionChanged: (key, item, evt) => {
	                this._dropDownElement.detach();

	                this.setValue(item.value);
	            }
	        });

	        function createNodes(arr, parentKey) {
	            arr.forEach(item => {
	                if(!item.key) {
	                    item.key = JSB.generateUid();
	                }

	                if(!item.element) {
                        if($this.options.itemRender) {
                            item.element = $this.options.itemRender.call($this, item);
                        } else {
                            item.element = item.value || item.key;
                        }
                    }

	                tree.addNode(item, parentKey);

	                $this._values[item.value] = item;

	                if(item.children) {
	                    createNodes(item.children, item.key);
	                }
	            });
	        }

	        createNodes(this._options);

	        this._dropDownElement.append(tree);
	    },

	    getValue: function() {
            return this._value;
	    },

	    setOptions: function(options) {
            this._dropDownElement && this._dropDownElement.remove();
            this._options = options;

	        if(options.length) {
	            this.dropDownBtn.removeClass('hidden');
	        } else {
	            this.dropDownBtn.addClass('hidden');
	        }
	    },

	    setValue: function(val, hEvt) {
	        this._value = val;

            this.currentVal.empty();

            if(JSB.isDefined(val)) {    // edit
                if(this._values[val]) {
                    if(this.options.itemRender) {
                        this.currentVal.append(this.options.itemRender.call(this, this._values[val]));
                    } else {
                        this.currentVal.append(this._values[val].element);
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
	            this.options.onChange.call(this, val, this._values[val]);
	        }
	    }
	}
}