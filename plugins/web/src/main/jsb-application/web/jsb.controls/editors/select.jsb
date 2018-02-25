{
	$name: 'JSB.Controls.Select',
	$parent: 'JSB.Controls.Control',
    $client: {
        _optionsList: null,

        $constructor: function(opts){
            $base(opts);

            this.loadCss('select.css');
            this.loadCss('../fonts/fa/font-awesome.min.css');
            this.addClass('jsb-select');

            this.currentVal = this.$('<div class="curVal"></div>');
            this.append(this.currentVal);

            this.dropDownBtn = this.$('<i class="dropDownBtn"></i>');
            this.append(this.dropDownBtn);

            if(this.options.clearBtn){
                this.clearBtn = this.$('<i class="clearBtn fa fa-close hidden"></i>');
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
                this.setValue(this.options.value, true);
            }

            function ddToggle(evt){
                evt.stopPropagation();

                if($this.dropDown.hasClass('hidden')){
                    $this.$(document).on('click.comboEditor_closeDD', function(evt){
                        if(!$this.dropDown.is(evt.target) && $this.dropDown.has(evt.target).length === 0){
                            $this.dropDown.addClass('hidden');
                            $this.$(document).off('click.comboEditor_closeDD');
                        }
                    });
                }

                $this.dropDown.toggleClass('hidden');
            }

            this.dropDownBtn.click(ddToggle);
            this.currentVal.click(ddToggle);
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
                    })(i)

                    this._optionsList[key] = el;
	                this.dropDown.append(el);
	            }
	        } else {
                if(!JSB.isArray(options)){
                    options = [options];
                }

                for(var i = 0; i < options.length; i++){
                    var el, key;

                    if(JSB.isObject(options[i])){
                        el = this.$('<li key="' + options[i].key + '"></li>');
                        el.append(options[i].value);
                        key = options[i].key;
                    } else {
                        el = this.$('<li key="' + options[i] + '"">' + options[i] + '</li>');
                        key = options[i];
                    }

                    (function(key){
                        el.click(function(){
                            $this.dropDown.addClass('hidden');
                            $this.$(document).off('click.comboEditor_closeDD');
                            $this.setValue(key);
                        });
                    })(key)

                    this._optionsList[key] = el;
                    this.dropDown.append(el);
                }
	        }
	    },

	    setValue: function(key, hEvt){
	        this._value = {
                key: key,
                value: this._optionsList[key]
            };

            this.currentVal.empty();
	        this.dropDown.find('li').removeClass('selected');

	        if(JSB.isDefined(key)){  // select
	            this.currentVal.append(this._optionsList[key].html());
	            this._optionsList[key].addClass('selected');
	        }

	        if(this.clearBtn){
                if(JSB.isDefined(key)){
                    this.clearBtn.removeClass('hidden');
                } else {
                    this.clearBtn.addClass('hidden');
                }
	        }

	        if(!hEvt && JSB.isFunction(this.options.onchange)){
	            this.options.onchange.call(this, this._value);
	        }
	    }
    }
}