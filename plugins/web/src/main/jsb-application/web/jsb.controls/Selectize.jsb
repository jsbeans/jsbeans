{
	$name: 'JSB.Controls.Selectize',
	$parent: 'JSB.Controls.Control',
    $client: {
    	$require: ['css:Selectize.css'],

        $constructor: function(opts) {
            $base(opts);

            JSB.loadScript('tpl/selectize.js/selectize.min.js', function(){
                $this._init();
            });

            this.addClass('jsb-selectize');
        },

	    options: {
	        // options
	        labelField: 'title',
	        maxItems: null,
	        options: [],
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

	    hasOption: function(key) {
	    },

	    setOptions: function(options, isClear, isCloneElements) {
	    },

	    setValue: function(key, hEvt) {
	    },

	    _init: function() {
	        this.getElement().selectize(this.options);
	    }
    }
}