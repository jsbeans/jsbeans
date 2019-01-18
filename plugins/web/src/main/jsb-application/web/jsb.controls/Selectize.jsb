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
                $this._init();
            });

            this.addClass('jsb-selectize');
        },

	    options: {
	        // options
	        label: null,
	        labelField: 'title',
	        maxItems: null,
	        options: [],
	        plugins: ['hidden_textfield'],
	        searchField: null,
	        valueField: null,

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

	    setValue: function(key, hEvt) {
	    },

	    _init: function() {
	        /*
	            Hide textfield plugin
	            https://github.com/selectize/selectize.js/issues/110#issuecomment-167840205
	        */
            Selectize.define('hidden_textfield', function(options) {
                var self = this;
                this.showInput = function() {
                     this.$control.css({cursor: 'pointer'});
                     this.$control_input.css({opacity: 0, position: 'relative', left: self.rtl ? 10000 : -10000 });
                     this.isInputHidden = false;
                 };

                 this.setup_original = this.setup;

                 this.setup = function() {
                      self.setup_original();
                      this.$control_input.prop("disabled","disabled");
                 }
            });

	        this._select.selectize(this.options);
	    }
    }
}