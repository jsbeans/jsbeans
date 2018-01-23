{
	$name: 'JSB.Controls.Select',
	$parent: 'JSB.Controls.Control',
    $client: {
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

            for(var i in this.options){
                if(i.substr(0, 2) === 'on'){
                    this.on(i.substr(2), this.options[i]);
                }
            }
        },

	    options: {
	        multiple: false
	    },

	    clear: function(){
	        var el = this.getElement();
	        el.empty();
	        el.append('<option">Выбрите значение</option>');
	    },

	    enable: function(bool){
            this.options.enable = bool;
            this.getElement().attr('disabled', !bool);
	    },

	    getValue: function(withName){
	        if(withName){
	            return {
	                name: this.getElement().find('option:selected').text(),
	                value: this.getElement().val()
	            }
	        }
	        return this.getElement().val();
	    },

	    setOptions: function(options, clear){
	        if(!JSB.isArray(options)){
	            options = [options];
	        }

	        if(clear){
	            this.clear();
	        }

	        var el = this.getElement();

	        if(JSb.isObject(options[0])){
                for(var i = 0; i < options.length; i++){
                    el.append('<option value="' + options[i].value + '">' + options[i].name + '</option>');
                }
	        } else {
    	        for(var i = 0; i < options.length; i++){
    	            el.append('<option value="' + options[i] + '"">' + options[i] + '</option>');
    	        }
	        }
	    },

	    setGroupOptions: function(groups, clear){
            // todo
	    },

	    setValue: function(val){
	        this.getElement().val(val);
	    }
    }
}