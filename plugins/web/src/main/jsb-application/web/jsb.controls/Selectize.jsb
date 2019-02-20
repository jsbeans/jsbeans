{
	$name: 'JSB.Controls.Selectize',
	$parent: 'JSB.Controls.Control',
    $client: {
    	$require: ['css:Selectize.css'],

        $constructor: function(opts) {
            $base(opts);

            this._select = this.$('<select></select>');
            this.append(this._select);

            JSB.loadScript('tpl/selectizejs/js/selectize.min.js', function(){
                JSB.loadScript('tpl/selectizejs/js/plugins.js', function(){
                    $this._init();
                });
            });

            this.addClass('jsb-selectize');
        },

	    options: {
	        // options
	        label: undefined,
	        labelField: 'id',
	        maxItems: undefined,
	        onlySelect: false,
	        options: [],
	        searchField: 'id',
	        valueField: 'id',

	        // events
	        onChange: null
	    },

	    clear: function() {
	    },

	    getValue: function() {
	        return this._value;
	    },

	    setLabel: function(label){
	        if(!this._label){
	            this._label = this.$('<label></label>');
	            this.prepend(this._label);
	        }

	        this._label.text(label);
	    },

	    setOptions: function(options){
	        this.ensureTrigger('_initialized', function(){
                // todo: recreate selectize when options is array of strings or change labelField/searchField/valueField
                $this._select[0].selectize.clear();
                $this._select[0].selectize.clearOptions();

                if(options.length !== 0){
                    $this._select[0].selectize.addOption($this._checkOptions(options));
                    $this._select[0].selectize.refreshOptions();
                }
	        });
	    },

	    setValue: function(value, hEvt) {
	        this.ensureTrigger('_initialized', function(){
	            $this._select[0].selectize.setValue($this.options.value, hEvt);
	        });
	    },

	    _checkOptions: function(options){
	        if(!JSB.isArray(options)){
	            throw new Error('Options must be array');
	        }

	        if(options.length === 0){
	            return;
	        }

	        if(!JSB.isObject(options[0])){
	            var opts = [];

	            for(var i = 0; i < options.length; i++){
	                opts.push({
	                    id: options[i]
	                });
	            }

	            options = opts;
	            this.options.labelField = 'id';
	            this.options.searchField = 'id';
	            this.options.valueField = 'id';
	        }

	        return options;
	    },

	    _init: function() {
	        var options = this._checkOptions(this.options.options || []);

	        this._select.selectize({
	            labelField: this.options.labelField,
	            maxItems: this.options.maxItems,
	            plugins: this.options.onlySelect ? ['hidden_textfield'] : undefined,
	            options: options,
	            searchField: this.options.searchField,
	            valueField: this.options.valueField,

	            onChange: this.options.onChange
	        });

	        if(this.options.value){
	            this.setValue(this.options.value, true);
	        }

	        if(this.options.label){
	            this.setLabel(this.options.label);
	        }

	        this.setTrigger('_initialized');
	    }
    }
}