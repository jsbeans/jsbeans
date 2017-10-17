{
	$name: 'JSB.Controls.Switch',
	$parent: 'JSB.Controls.Control',
	$client: {
	    $constructor: function(opts){
	        $base(opts);

	        this.loadCss('switch.css');
            this.addClass('jsb-switch');

            this.append(`#dot
                <input id="switch_{{=$this.getId()}}" type="checkbox" />
                <label for="switch_{{=$this.getId()}}"></label>
            `);

            if(this.options.checked){
                this.find('input').prop("checked", true);
            }

            if(this.options.onchange && JSB.isFunction(this.options.onchange)){
                this.find('input').change(function(){
                    $this.options.onchange.call($this, $this.$(this).prop("checked"));
                });
            }
	    },

	    options: {
	        checked: false
	    },

	    setChecked: function(b, noHandle){
	        this.find('input').prop("checked", b);

	        if(this.options.onchange && !noHandle){
                this.options.onchange.call(this, b);
            }
	    }
	}
}