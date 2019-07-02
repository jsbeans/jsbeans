/*
 * This file is the part of jsBeans, high-level JavaScript client-server framework.
 * The contents of this file are subject to the MIT License (MIT).
 * (c) aa@sis.ru, da@sis.ru, Special Information Systems, LLC, 2011-2019
 *
 * Настоящий файл является частью клиент-серверной JavaScript платформы.
 * Условия использования и распространения содержимого данного файла соответствуют программному обеспечению с открытыми исходными кодами и равнозначно MIT License (MIT).
 * Авторские права принадлежат aa@sis.ru, da@sis.ru, ООО СИС, 2011-2019гг.
 */

{
	$name: 'JSB.Controls.MultitypeEditor',
	$parent: 'JSB.Controls.Control',
	$client: {
		$require: ['JSB.Controls.Editor',
		           'JSB.Controls.Checkbox',
		           'css:MultitypeEditor.css'],

        $constructor: function(opts) {
            $base(opts);

            this.addClass('jsb-multitypeEditor');

            if(this.options.label) {
                this.setLabel(this.options.label);
            }

            this.setEditor();
        },

        options: {
	        defaultValue: null,
	        label: undefined,
	        placeholder: undefined,
	        readonly: false,
	        // bool, null
	        // (5) - только в HTML5
            // html types: color(5), date(5), datetime-local(5), email(5),
            // month(5), number(5), password, range(5), search(5), tel(5), text,
            // time(5), url(5), week(5)
            // todo: object, array
	        type: 'text',
	        value: null,

	        // number attributes
	        min: undefined,
	        max: undefined,
	        step: undefined,
	        //

	        validator: null,

	        // events
	        onChange: null,
	        onEditComplete: null
        },

	    destroy: function() {
	        if(this.options.type !== 'null') {
	            this._editor.destroy();
            }

	        $base();
	    },

	    getType: function() {
	        return this.options.type;
	    },

	    getValue: function() {
	        return this.options.value;
	    },

	    setEditor: function() {
	        var hasOnChangeFunc = JSB.isFunction(this.options.onChange),
	            hasOnEditCompleteFunc = JSB.isFunction(this.options.onEditComplete);

            if(this._editor) {
                if(JSB.isInstanceOf(this._editor, 'JSB.Controls.Control')) {
                    this._editor.destroy();
                } else {
                    this._editor.remove();
                }
            }

            switch(this.options.type) {
                case 'null':
                    this.options.value = null;

                    this._editor = this.$('<span class="value">null</span>');

                    this.append(this._editor);
                    break;
                case 'bool':
                    this._editor = new Checkbox({
                        checked: this.options.value,
                        onChange: function(val) {
                            $this.options.value = val;

                            if(hasOnEditCompleteFunc) {
                                $this.options.onEditComplete.call($this, val);
                            }
                        }
                    });
                    this.append(this._editor);
                    break;
                default:
                    this._editor = this.$('<span class="value"></span>');
                    this.append(this._editor);

                    if(this.options.type === 'date') {
                        var date = new Date(this.options.value);
                        this._editor.text(date.toLocaleDateString());
                    } else {
                        this._editor.text(this.options.value);
                    }

                    this._editor.click(function(evt) {
                        evt.stopPropagation();

                        var curVal = $this.getValue(),
                            input = new Editor({
                                type: $this.options.type,
                                value: $this.options.value,
                                onEditComplete: function(newVal, isValid) {
                                    if(isValid) {
                                        if(newVal !== curVal) {
                                            if($this.options.type === 'date') {
                                                var date = new Date(newVal);
                                                $this._editor.text(date.toLocaleDateString());
                                            } else {
                                                $this._editor.text(newVal);
                                            }

                                            $this.options.value = newVal;

                                            if(hasOnEditCompleteFunc) {
                                                $this.options.onEditComplete.call($this, newVal);
                                            }
                                        }

                                        input.destroy();

                                        $this._editor.removeClass('hidden');
                                    }
                                }
                            });

                        $this._editor.addClass('hidden');
                        $this.append(input);

                        input.select();
                    });
                    break;
            }

            this.getElement().attr('valType', this.options.type);
	    },

	    setLabel: function(label) {
	        if(!this._label){
	            this._label = this.$('<label></label>');
	            this.prepend(this._label);
	        }

	        this._label.text(label);
	    },

	    setType: function(type, hideEvent) {
	        this.options.type = type;

	        switch(type) {
	            case 'null':
	                this.options.value = null;
	                break;
	            case 'bool':
	                this.options.value = true;
	                break;
	            case 'text':
	                this.options.value = String(this.options.value);
	                break;
	            case 'number':
	                var number = Number(this.options.value);

	                if(isNaN(number)) {
	                    this.options.value = 0;
	                } else {
	                    this.options.value = number;
	                }
	                break;
	            case 'date':
	                var date = Date.parse(this.options.value);

	                if(isNaN(date)) {
	                    this.options.value = 0;
	                } else {
	                    this.options.value = date;
	                }
	                break;
	        }

	        this.setEditor();

            if(!hideEvent && JSB.isFunction(this.options.onEditComplete)) {
                $this.options.onEditComplete.call($this, this.getValue());
            }
	    },

	    setValue: function(value) {
	        if(JSB.isDefined(value)) {
	            this.options.value = value;

	            if(this.options.type === 'bool') {
	                this._editor.setValue(value);
	            }
	        }
	    }
    }
}