{
	$name: 'JSB.Controls.ComboEditor',
	$parent: 'JSB.Controls.Control',
	$client: {
	    _value: {
	        value: null,
	        fromSelect: false
	    },

	    $constructor: function(opts){
	        $base(opts);

            this.loadCss('comboEditor.css');
            this.addClass('jsb-comboEditor');

            this.select = this.$('<select tabIndex="-1"></select>');
            this.append(this.select);

	        this.editor = this.$('<input type="text" />');
	        this.append(this.editor);

            this.select.change(function(){
                var val = $this.select.val();
                if(val === 'null'){
                    val = null;
                }

                $this._value = {
                    value: val,
                    fromSelect: true
                };

                $this.editor.val(val);

	            JSB.defer(function(){
                    if(JSB.isFunction($this.options.onchange)){
                        $this.options.onchange.call($this, $this._value);
                    }
	            }, 500, 'comdoEditor.change_' + $this.getId());
            });

	        this.editor.change(function(){
                $this._value = {
                    value: $this.editor.val(),
                    fromSelect: false
                };

	            JSB.defer(function(){
                    if(JSB.isFunction($this.options.onchange)){
                        $this.options.onchange.call($this, $this._value);
                    }
	            }, 500, 'comdoEditor.change_' + $this.getId());
	        });

            if(this.options.options){
                this.setOptions(this.options.options, true);
            }

	        if(this.options.value){
	            this.setValue(this.options.value);
	        }
	    },

	    options: {
	        emptyStartValue: true
	    },

	    clear: function(){
	        this._value = {
                value: null,
                fromSelect: false
            };

            this._optionsList = null;

            this.select.empty();
            this.select.append('<option value="null" hidden></option>');

            this.editor.val(null);
	    },

	    getValue: function(isFull){
	        if(isFull){
	            return this._value;
	        } else {
	            return this._value.value;
	        }
	    },

	    hasOption: function(option){
	        if(!this._optionsList){
	            return;
	        }

	        if(JSB.isObject(this._optionsList[0])){
	            for(var i = 0; i < this._optionsList.length; i++){
	                if(this._optionsList[i].value === option){
	                    return true;
	                }
	            }
	        } else {
	            for(var i = 0; i < this._optionsList.length; i++){
	                if(this._optionsList[i] === option){
	                    return true;
	                }
	            }
	        }

	        return false;
	    },

	    setOptions: function(options, clear){
	        if(!JSB.isArray(options)){
	            options = [options];
	        }

	        if(clear){
	            this.clear();
	        }

	        if(JSB.isObject(options[0])){
                for(var i = 0; i < options.length; i++){
                    this.select.append('<option value="' + options[i].value + '">' + options[i].name + '</option>');
                }
	        } else {
    	        for(var i = 0; i < options.length; i++){
    	            this.select.append('<option value="' + options[i] + '"">' + options[i] + '</option>');
    	        }
	        }

	        this._optionsList = options;
	    },

	    setValue: function(val, fromSelect){
	        this._value = {
                value: val,
                fromSelect: fromSelect
            };

            this.editor.val(val);
debugger;
            this.editor.attr('value', val);

            if(this.hasOption(val)){
                this.select.val(val);
            }
	    }
	}
}