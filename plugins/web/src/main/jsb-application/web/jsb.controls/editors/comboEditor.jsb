{
	$name: 'JSB.Controls.ComboEditor',
	$parent: 'JSB.Controls.Control',
	$client: {
	    _optionsList: {},
	    _value: {
	        key: null,
	        value: null
	    },
	    _valueChanged: false,

	    $constructor: function(opts){
	        $base(opts);

            this.loadCss('comboEditor.css');
            this.loadCss('../fonts/fa/fontawesome-all.min.css');
            this.addClass('jsb-comboEditor');

            this.currentVal = this.$('<div class="curVal"></div>');
            this.append(this.currentVal);

            this.dropDownBtn = this.$('<i class="dropDownBtn"></i>');
            this.append(this.dropDownBtn);

            if(this.options.clearBtn){
                this.clearBtn = this.$('<i class="clearBtn fas fa-times hidden"></i>');
                this.append(this.clearBtn);

                this.clearBtn.click(function(){
                    $this.setValue();
                });
            }

            this.dropDown = this.$('<ul class="dropDown hidden"></ul>');
            this.append(this.dropDown);

            if(this.options.options){
                this.setOptions(this.options.options, true);
            }

	        if(this.options.value){
	            this.setValue(this.options.value, this.options.valueKey, true);
	        }

	        this.currentVal.click(function(){
	            if(!$this.editor){
	                $this.createEditor();
	            }
	        });

            this.dropDownBtn.click(function(evt){
                evt.stopPropagation();

                if($this.dropDown.hasClass('hidden')){
                    $this.dropDown.removeClass('hidden');

                    var top = $this.getElement().offset().top,
                        elementHeight = $this.getElement().height(),
                        ddHeight = $this.dropDown.outerHeight(),
                        bodyHeight = $this.$(window).height();

                    if(bodyHeight <= top + elementHeight + ddHeight){
                        $this.dropDown.css('top', 'initial');
                        $this.dropDown.css('bottom', elementHeight);
                    } else {
                        $this.dropDown.css('top', elementHeight);
                        $this.dropDown.css('bottom', 'initial');
                    }

                    $this.$(document).on('click.comboEditor_closeDD', function(evt){
                        if(!$this.dropDown.is(evt.target) && $this.dropDown.has(evt.target).length === 0){
                            $this.dropDown.addClass('hidden');
                            $this.$(document).off('click.comboEditor_closeDD');
                        }
                    });

                    return;
                }

                $this.dropDown.addClass('hidden');
            });
	    },

	    options: {
	        clearBtn: false
	    },

	    clear: function(){
	        this._value = {
	            key: null,
                value: null
            };

            this._optionsList = {};
            this.currentVal.empty();
	    },

	    createEditor: function(){
	        this.editor = this.$('<input />');
	        this.currentVal.append(this.editor);

	        if(!this._value.key){
	            this.editor.val(this._value.value);
	        }

	        this.editor.keyup(function(evt){
	            // enter: 13 key code
	            if(evt.keyCode === 13){
	                $this.setValue($this.editor.val());
                    $this._valueChanged = false;
                    $this.editor.remove();
                    $this.editor = null;
	            } else {
	                var val = $this.editor.val();

	                if(val !== $this._value.value){
	                    $this._valueChanged = true;
	                }
	            }
	        });

	        this.editor.focusout(function(){
                if($this._valueChanged){
                    $this.setValue($this.editor.val());
                }
                $this._valueChanged = false;
	            $this.editor.remove();
	            $this.editor = null;
	        });

	        this.editor.focus();
	    },

	    getValue: function(){
            return this._value;
	    },

	    hasOption: function(key){
	        return Object.keys(this._optionsList).indexOf(key) > -1;
	    },

	    setOptions: function(options, clear){
	        if(clear){
                this._optionsList = {};
                this.dropDown.empty();
	        }

	        if(JSB.isObject(options)){
	            for(var i in options){
	                var el = this.$('<li key="' + i + '"></li>');
	                el.append(options[i]);

                    (function(key, val){
                        el.click(function(){
                            $this.dropDown.addClass('hidden');
                            $this.$(document).off('click.comboEditor_closeDD');
                            $this.setValue(val, key);
                        });
                    })(i, options[i])

                    this._optionsList[key] = el;
	                this.dropDown.append(el);
	            }
	        } else {
                if(!JSB.isArray(options)){
                    options = [options];
                }

                for(var i = 0; i < options.length; i++){
                    var el, val, key;

                    if(JSB.isObject(options[i])){
                        el = this.$('<li key="' + options[i].key + '"></li>');
                        el.append(options[i].value);
                        key = options[i].key;
                        val = options[i].value;
                    } else {
                        el = this.$('<li key="' + options[i] + '"">' + options[i] + '</li>');
                        key = options[i];
                        val = options[i];
                    }

                    (function(key, val){
                        el.click(function(){
                            $this.dropDown.addClass('hidden');
                            $this.$(document).off('click.comboEditor_closeDD');
                            $this.setValue(val, key);
                        });
                    })(key, val)

                    this._optionsList[key] = el;
                    this.dropDown.append(el);
                }
	        }
	    },

	    setValue: function(val, key, hEvt){
	        this._value = {
                key: key,
                value: val
            };

            this.currentVal.empty();
	        this.dropDown.find('li').removeClass('selected');

	        if(JSB.isDefined(key)){  // select
	            this.currentVal.append(this._optionsList[key].html());
	            this._optionsList[key].addClass('selected');
	        } else {
                if(JSB.isDefined(val)){    // edit
                    this.currentVal.append('<div class="simpleValue">' + val + '</div>');
                }
	        }

	        if(this.clearBtn){
                if(JSB.isDefined(val) || JSB.isDefined(key)){
                    this.clearBtn.removeClass('hidden');
                } else {
                    this.clearBtn.addClass('hidden');
                }
	        }

	        if(!hEvt && JSB.isFunction(this.options.onchange)){
	            this.options.onchange.call(this, {
	                key: key,
	                value: val
	            });
	        }
	    }
	}
}