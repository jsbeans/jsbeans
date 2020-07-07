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
	$name: 'JSB.Controls.Editor',
	$parent: 'JSB.Controls.Control',
	$client: {
		$require: ['css:Editor.css'],

	    _value: null,

	    $constructor: function(opts) {
	        $base(opts);

            this.addClass('jsb-editor');

            if(this.options.label) {
                this.setLabel(this.options.label);
            }

            this._editor = this.$('<input />');
            this.append(this._editor);

            if(this.options.type) {
                this.setType(this.options.type);
            }

            if(this.options.type = 'number') {
                this.setNumberOptions(this.options);
            }

            if(this.options.readonly) {
                this.setReadonly(this.options.readonly);
            }

            if(JSB.isDefined(this.options.placeholder)) {
                this.setPlaceholder(this.options.placeholder);
            }

            if(JSB.isDefined(this.options.defaultValue)) {
                this.setDefaultValue(this.options.defaultValue);
            }

            if(JSB.isDefined(this.options.value)) {
                this.setValue(this.options.value);
            }

            if($this.options.contentSize) {
                this._editor.attr('size', this.getValue().length || 1);
            }

            var isOnChangeFunc = JSB.isFunction($this.options.onChange);

            function hasChanges() {
                var curValue = $this.getValue();

                if(curValue === $this._value) {
                    $this._value = curValue;

                    return false;
                } else {
                    return true;
                }
            }

            function onChange() {
                if($this.options.contentSize) {
                    $this._editor.attr('size', $this.getValue().length || 1);
                }

                if(isOnChangeFunc && $this.validate($this.options.validator)) {
                    $this.options.onChange.call($this, $this.getValue());
                }
            }

            function onEditComplete() {
                if(JSB.isFunction($this.options.onEditComplete)) {
                    $this.options.onEditComplete.call($this, $this.getValue(), !$this._editor.hasClass('invalid'));
                }
            }

            this._editor.keyup(function(evt) {
                if(evt.keyCode === 37 || evt.keyCode === 38 || evt.keyCode === 39 || evt.keyCode === 40) {  // arrows
                    return;
                }

                if(hasChanges()) {
                    onChange();
                }

                if(evt.keyCode === 13 || evt.keyCode === 27) {  // enter, escape
                    $this._editor.blur();
                }
            });

            this._editor.focusout(function(evt) {
                if(hasChanges()) {
                    onChange();
                }

                onEditComplete();
            });

            this._editor.click(function(evt) {
                evt.stopPropagation();
            });
	    },

	    options: {
	        contentSize: false,
	        defaultValue: null,
	        label: undefined,
	        placeholder: null,
	        readonly: false,
            // html types: color(5), date(5), datetime-local(5), email(5),
            // month(5), number(5), password, range(5), search(5), tel(5), text,
            // time(5), url(5), week(5)
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
	        var type = this._editor.attr('type');

	        switch(type) {
	            case 'text':
                    this._editor.val('');
                    this._value = '';
	                break;
                case 'number':
                    this._editor.val(0);
                    this._value = 0;
                    break;
	        }
	    },

	    destroy: function() {
	        this.$(window).off('click.closeEditor_' + this.getId());

	        $base();
	    },

	    enable: function(bool) {
            this._editor.attr('disabled', !bool);
	    },

	    focus: function() {
	        this._editor.focus();
	    },

	    getType: function() {
	        return this._editor.attr('type');
	    },

	    getValue: function() {
	        var val = this._editor.val();

	        switch(this.getType()) {
	            case 'number':
	                return Number(val);
                case 'date':
                    return Date.parse(val);
                default:
                    return val;
	        }
	    },

	    select: function() {
	        this._editor.get(0).select();
	    },

	    setDefaultValue: function(defaultValue) {
	        this._editor.attr('defaultValue', defaultValue);
	    },

	    setLabel: function(label){
	        if(!this._label){
	            this._label = this.$('<label></label>');
	            this.prepend(this._label);
	        }

	        this._label.text(label);
	    },

	    setNumberOptions: function(opts) {
	        if(JSB.isDefined(opts.min)) {
	            this._editor.attr('min', opts.min);
	        }

	        if(JSB.isDefined(opts.max)) {
	            this._editor.attr('max', opts.max);
	        }

	        if(JSB.isDefined(opts.step)) {
	            this._editor.attr('step', opts.step);
	        }
	    },

	    setPlaceholder: function(placeholder) {
	        this._editor.attr('placeholder', placeholder);
	    },

	    setReadonly: function(bool) {
	        this._editor.attr('readonly', bool);
	    },

	    setType: function(type) {
            this._editor.attr('type', type);
	    },

	    setValue: function(value) {
	        if(JSB.isDefined(value)) {
	            this._editor.val(value);
	            this._value = value;
	        }
	    },

	    validate: function(validateFunc) {
            if(this.getType === 'number' && isNaN(this.getValue())) {
                return false;
            }

            if(JSB.isFunction(validateFunc)) {
                var validateResult = validateFunc.call(this, this.getValue(), this._value);

                if(validateResult) {
                    this._editor.removeClass('invalid');
                } else {
                    this._editor.addClass('invalid');
                }

                return validateResult;
            } else {
                this._editor.removeClass('invalid');

                return true;
            }
	    }
	}
}