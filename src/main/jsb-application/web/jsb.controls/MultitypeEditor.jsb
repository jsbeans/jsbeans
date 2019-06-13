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

            this.setEditor(this.options);
        },

        options: {
	        defaultValue: null,
	        label: undefined,
	        placeholder: undefined,
	        readonly: false,
	        // bool
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

	    clear: function() {
	        this._editor.clear();
	    },

	    destroy: function() {
	        this._editor.destroy();

	        $base();
	    },

	    enable: function(isEnable) {
            this._editor.enable(isEnable);
	    },

	    focus: function() {
	        this._editor.focus();
	    },

	    getType: function() {
	        if(this._editor) {
	            if(JSB.isInstanceOf(this._editor, 'JSB.Controls.Editor')) {
	                return this._editor.getType();
                } else {
                    return 'bool';
                }
	        }
	    },

	    getValue: function() {
            if(JSB.isInstanceOf(this._editor, 'JSB.Controls.Editor')) {
                return this._editor.getValue();
            } else {
                return this._editor.isChecked();
            }
	    },

	    setDefaultValue: function(defaultValue) {
	        this._editor.setDefaultValue(defaultValue);
	    },

	    setEditor: function(options) {
	        var hasOnChangeFunc = JSB.isFunction(this.options.onChange),
	            hasOnEditCompleteFunc = JSB.isFunction(this.options.onEditComplete);

            if(options.type === 'bool') {
                if(this._editor && JSB.isInstanceOf(this._editor, 'JSB.Controls.Editor')) {
                    this._editor.destroy();
                }

                this._editor = new Checkbox({
                    checked: options.value,
                    onChange: function(val) {
                        if(hasOnEditCompleteFunc) {
                            $this.options.onEditComplete.call($this, val);
                        }
                    }
                });
                this.append(this._editor);
            } else {
                if(this._editor && JSB.isInstanceOf(this._editor, 'JSB.Controls.Checkbox')) {
                    this._editor.destroy();
                }

                this._editor = new Editor(JSB.merge(options, {
                    label: null
                }));
                this.append(this._editor);
            }
	    },

	    setLabel: function(label) {
	        if(!this._label){
	            this._label = this.$('<label></label>');
	            this.prepend(this._label);
	        }

	        this._label.text(label);
	    },

	    setNumberOptions: function(opts) {
	        // todo
	        /*
	        if(JSB.isDefined(opts.min)) {
	            this._editor.attr('min', opts.min);
	        }

	        if(JSB.isDefined(opts.max)) {
	            this._editor.attr('max', opts.max);
	        }

	        if(JSB.isDefined(opts.step)) {
	            this._editor.attr('step', opts.step);
	        }
	        */
	    },

	    setPlaceholder: function(placeholder) {
	        if(JSB.isInstanceOf(this._editor, 'JSB.Controls.Editor')) {
	            this._editor.setPlaceholder(placeholder);
	        }
	    },

	    setReadonly: function(isReadOnly) {
	        // todo: readonly in checkbox
	        //this._editor.attr('readonly', bool);
	    },

	    setType: function(type, hideEvent) {
            if(type === 'bool') {
                if(JSB.isInstanceOf(this._editor, 'JSB.Controls.Editor')) {
                    var options = this._editor.getOption();
                    options.type = type;
                    this.setEditor(options);
                }
            } else {
                if(JSB.isInstanceOf(this._editor, 'JSB.Controls.Checkbox')) {
                    var options = this.options;
                    options.type = type;
                    this.setEditor(options);
                } else {
                    this._editor.setType(type);
                }
            }

            if(!hideEvent && JSB.isFunction(this.options.onEditComplete)) {
                $this.options.onEditComplete.call($this, this.getValue());
            }
	    },

	    setValue: function(value) {
	        if(JSB.isDefined(value)) {
	            this._editor.setValue(value);
	        }
	    }
    }
}