{
	$name: 'JSB.Controls.Select',
	$parent: 'JSB.Controls.Control',
    $client: {
        _optionsList: null,

        $constructor: function(opts){
            if(!opts.element) opts.element = '<select></select>';
            $base(opts);

            this.loadCss('select.css');
            this.addClass('jsb-select');

            if(this.options.multiple){
                this.getElement().attr('multiple', 'multiple');
            }

            if(this.options.options){
                this.setOptions(this.options.options, true);
            }

            if(this.options.value){
                this.setValue(this.options.value);
            }

            for(var i in this.options){
                if(i.substr(0, 2) === 'on'){
                    this.on(i, this.options[i]);
                }
            }
        },

	    options: {
	        multiple: false,
	        emptyStartValue: true
	    },

	    clear: function(){
	        var el = this.getElement();
	        el.empty();

	        this._optionsList = null;

	        if(this.options.emptyStartValue){
	            el.append('<option value="null" hidden></option>');
	        }
	    },

	    enable: function(bool){
            this.options.enable = bool;
            this.getElement().attr('disabled', !bool);
	    },

	    getValue: function(withName){
	        var value = this.getElement().val();

	        if(value === 'null'){
	            value = null;
	        }

	        if(withName){
	            return {
	                name: this.getElement().find('option:selected').text(),
	                value: value
	            }
	        }
	        return value;
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

		on: function(eventName, func){
		    if(!JSB().isFunction(func)) return;

		    this.options[eventName] = func;
		    this.getElement().on(eventName.substr(2), function(evt){
		        $this.options[eventName].call($this, evt);
		    });
		},

	    setOptions: function(options, clear){
	        if(!JSB.isArray(options)){
	            options = [options];
	        }

	        if(clear){
	            this.clear();
	        }

	        var el = this.getElement();

	        if(JSB.isObject(options[0])){
                for(var i = 0; i < options.length; i++){
                    el.append('<option value="' + options[i].value + '">' + options[i].name + '</option>');
                }
	        } else {
    	        for(var i = 0; i < options.length; i++){
    	            el.append('<option value="' + options[i] + '"">' + options[i] + '</option>');
    	        }
	        }

	        this._optionsList = options;
	    },

	    setGroupOptions: function(groups, clear){
            // todo
	    },

	    setValue: function(val, b){
	        if(val){
	            this.getElement().val(val);

	            if(b && JSB.isFunction(this.options.onchange)){
	                this.options.onchange.call(this, val);
	            }
	        }
	    }
    }
}