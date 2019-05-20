{
	$name: 'JSB.Controls.Editor',
	$parent: 'JSB.Controls.Control',
	$client: {
		$require: ['css:Editor.css'],
	    _types: ['text', 'password', 'color', 'search', 'number'],
	    _value: null,

	    $constructor: function(opts){
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

            if(this.options.placeholder) {
                this.setPlaceholder(this.options.placeholder);
            }

            if(this.options.defaultValue) {
                this.setDefaultValue(this.options.defaultValue);
            }

            if(this.options.value) {
                this.setValue(this.options.value);
            }

            function validate() {
                if($this.getValue() === $this._value) {
                    $this._editor.removeClass('invalid');

                    return true;
                }

                if(JSB.isFunction($this.options.validator)) {
                    var validateResult = $this.options.validator.call($this, $this.getValue(), $this._value);

                    if(validateResult) {
                        $this._editor.removeClass('invalid');

                        $this._value = $this.getValue();
                    } else {
                        $this._editor.addClass('invalid');
                    }

                    return validateResult;
                } else {
                    return true;
                }
            }

            function onChange() {
                if(JSB.isFunction($this.options.onChange)){
                    $this.options.onChange.call($this, $this.getValue());
                }
            }

            function onEditComplete() {
                JSB.cancelDefer('jsb-editor.keyUp' + $this.getId());

                if(JSB.isFunction($this.options.onEditComplete)) {
                    $this.options.onEditComplete.call($this, !$this._editor.hasClass('invalid'), $this.getValue());
                }
            }

            function onFocusLose() {
                validate();
                onEditComplete();

                $this.$(window).off('click.closeEditor_' + $this.getId());
            }

            this._editor.keyup(function(evt) {
                if(evt.keyCode === 13) {
                    validate();

                    onEditComplete();
                } else {
                    JSB.defer(function(){
                        if(validate()) {
                            onChange();
                        }
                    }, 500,  'jsb-editor.keyUp' + $this.getId());
                }
            });

            this._editor.focusin(function(evt) {
                $this.$(window).on('click.closeEditor_' + $this.getId(), onFocusLose);
            });

            this._editor.focusout(function() {
                onFocusLose();
            });

            this._editor.click(function(evt) {
                evt.stopPropagation();
            });

            $this.$(window).on('click.closeEditor_' + $this.getId(), onFocusLose);
	    },

	    options: {
	        defaultValue: null,
	        label: undefined,
	        placeholder: null,
	        readonly: false,
	        type: 'text',    // password, color, search, number
	        value: null,

	        // number attributes
	        min: 0,
	        max: 100,
	        step: 1,
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

	    getValue: function() {
	        return this._editor.val();
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
            if(this._types.indexOf(type) < 0){
                throw Error('Invalid input type');
            }

            this._editor.attr('type', type);
	    },

	    setValue: function(value) {
	        if(JSB.isDefined(value)) {
	            this._editor.val(value);
	            this._value = value;
	        }
	    }
	}
}