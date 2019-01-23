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
	        labelField: undefined,
	        maxItems: undefined,
	        onlySelect: false,
	        options: [],
	        searchField: undefined,
	        valueField: undefined,

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

	    setValue: function(value, hEvt) {
	        this._select[0].selectize.setValue(this.options.value, hEvt);
	    },

	    _checkOptions: function(){
	        if(!JSB.isArray(this.options.options)){
	            throw new Error('Options must be array');
	        }

	        if(this.options.options.length === 0){
	            return;
	        }

	        if(!JSB.isObject(this.options.options[0])){
	            var options = [];

	            for(var i = 0; i < this.options.options.length; i++){
	                options.push({
	                    id: this.options.options[i]
	                });
	            }

	            this.options.options = options;
	            this.options.labelField = 'id';
	            this.options.searchField = 'id';
	            this.options.valueField = 'id';
	        }
	    },

	    _init: function() {
	        this._checkOptions();

	        this._select.selectize({
	            labelField: this.options.labelField,
	            maxItems: this.options.maxItems,
	            plugins: this.options.onlySelect ? ['hidden_textfield'] : undefined,
	            options: this.options.options,
	            searchField: this.options.searchField,
	            valueField: this.options.valueField
	        });

	        if(this.options.value){
	            this.setValue(this.options.value, true);
	        }

	        if(this.options.label){
	            this.setLabel(this.options.label);
	        }
	    }
    }
}