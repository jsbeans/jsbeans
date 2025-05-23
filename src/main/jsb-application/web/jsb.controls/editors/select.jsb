/*
 * This file is the part of jsBeans, high-level JavaScript client-server framework.
 * The contents of this file are subject to the MIT Licence (MIT).
 * (c) aa@sis.ru, da@sis.ru, Special Information Systems, LLC, 2011-2019
 *
 * Настоящий файл является частью клиент-серверной JavaScript платформы.
 * Условия использования и распространения содержимого данного файла соответствуют программному обеспечению с открытыми исходными кодами и равнозначно MIT Licence (MIT).
 * Авторские права принадлежат aa@sis.ru, da@sis.ru, ООО СИС, 2011-2019гг.
 */

{
	$name: 'JSB.Controls.Select',
	$parent: 'JSB.Controls.Control',
    $client: {
    	$require: ['css:select.css',
    	           'css:../../fonts/fa/css/all.min.css'],
        _optionsList: {},

        $constructor: function(opts){
            $base(opts);

            this.addClass('jsb-select');

            this.currentVal = this.$('<div class="curVal"></div>');
            this.append(this.currentVal);

            this.dropDownBtn = this.$('<i class="dropDownBtn"></i>');
            this.append(this.dropDownBtn);

            if(this.options.clearBtn){
                this.clearBtn = this.$('<i class="clearBtn fas fa-times hidden"></i>');
                this.append(this.clearBtn);

                this.clearBtn.click(function(evt){
                    evt.stopPropagation();
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
                    $this.dropDown.removeClass('hidden');

                    var top = $this.getElement().offset().top,
                        elementHeight = $this.getElement().outerHeight(),
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
                } else {
                    $this.dropDown.addClass('hidden');
                }
            }

            this.getElement().click(ddToggle);
        },

	    options: {
	        clearBtn: false,
	        cloneOptions: false
	    },

	    clear: function(){
	        this._value = {
	            key: null,
                value: null
            };

            this._optionsList = {};
            this.currentVal.empty();
            this.dropDown.empty();
	    },

	    getValue: function(){
	        return this._value;
	    },

	    hasOption: function(key){
	        return Object.keys(this._optionsList).indexOf(key) > -1;
	    },

	    setOptions: function(options, isClear, isCloneElements){
	        if(!JSB.isDefined(isCloneElements)){
	            isCloneElements = this.options.cloneOptions;
	        }

	        if(isClear){
                this._optionsList = {};
                this.dropDown.empty();
	        }

	        function clickEvt(evt){
                evt.stopPropagation();
                $this.dropDown.addClass('hidden');
                $this.$(document).off('click.comboEditor_closeDD');
                $this.setValue(evt.delegateTarget.getAttribute('key'));
	        }

	        if(JSB.isObject(options)){
	            for(var i in options){
	                var el = this.$('<li key="' + i + '"></li>');
	                el.append(options[i]);

                    el.click(function(evt){
                        clickEvt(evt);
                    });

                    this._optionsList[i] = {
                        element: el,
                        options: options[i]
                    };
	                this.dropDown.append(el);
	            }
	        } else {
                if(!JSB.isArray(options)){
                    options = [options];
                }

                function createOptions(parentElement, options){
                    for(var i = 0; i < options.length; i++){
                        var el, key;

                        if(JSB.isObject(options[i])){
                            el = $this.$('<li key="' + options[i].key + '" title="' + (options[i].title ? options[i].title : '') + '"></li>');

                            var val = $this.$('<div class="selectValue"></div>');
                            el.append(val);

                            if(isCloneElements && options[i].value instanceof jQuery){
                                val.append(options[i].value.clone());
                            } else {
                                val.append(options[i].value);
                            }

                            key = options[i].key;

                            if(options[i].child){
                                var childElement = $this.$('<ul class="childOptions"></ul>');
                                el.append(childElement);

                                // todo: expand icon

                                createOptions(childElement, options[i].child);
                            }
                        } else {
                            el = $this.$('<li key="' + options[i] + '" class="selectValue">' + options[i] + '</li>');
                            key = options[i];
                        }

                        el.click(function(evt){
                            clickEvt(evt);
                        });

                        $this._optionsList[key] = {
                            element: el,
                            options: options[i]
                        };

                        parentElement.append(el);
                    }
                }

                createOptions(this.dropDown, options);
	        }
	    },

	    setValue: function(key, hEvt){
	    	if(key && !JSB.isDefined(this._optionsList[key])){
	    		return;
	    	}
	        this._value = {
                key: key,
                options: key ? this._optionsList[key].options : undefined,
                value: key ? this._optionsList[key].element : undefined
            };

            this.currentVal.empty();
	        this.dropDown.find('.selectValue').removeClass('selected');

	        if(JSB.isDefined(key) && this._optionsList[key] && this._optionsList[key].element){  // select
	            this.currentVal.append(this._optionsList[key].element.html());

	            if(this._optionsList[key].element.hasClass('selectValue')){
	                this._optionsList[key].element.addClass('selected');
	            } else {
	                this._optionsList[key].element.find('> .selectValue').addClass('selected');
                }
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