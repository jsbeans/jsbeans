{
	$name: 'JSB.Controls.Switch',
	$parent: 'JSB.Controls.Control',
	$client: {
	    $constructor: function(opts){
	        $base(opts);

	        this.loadCss('switch.css');
            this.addClass('jsb-switch');

            this.checkbox = this.$('<input id="switch_' + $this.getId() + '" type="checkbox" />');
            this.append(this.checkbox);

            this.append(`#dot
                <label for="switch_{{=$this.getId()}}"></label>
            `);

            this.caption = this.$('<span class="caption"></span>');
            if(this.options.leftLabel){
                this.prepend(this.caption);
            } else {
                this.append(this.caption);
            }

            if(this.options.label){
                this.setLabel(this.options.label);
            }

            if(this.options.checked){
                this.find('input').prop("checked", true);
            }

            if(this.options.onchange && JSB.isFunction(this.options.onchange)){
                this.checkbox.change(function(){
                    $this.options.onchange.call($this, $this.$(this).prop("checked"));
                });
            }

            this.getElement().click(function(evt){
                evt.stopPropagation();
                if($this.options.onclick && JSB.isFunction(this.options.onclick)){
                    $this.options.onclick.call($this, $this.$(this).prop("checked"));
                }
            });

            this.caption.click(function(){
                $this.setChecked(!$this.checkbox.prop("checked"));
            });
	    },

	    options: {
	        checked: false,
	        label: null,
	        leftLabel: false
	    },

	    setChecked: function(b, noHandle){
	        this.checkbox.prop("checked", b);

	        if(this.options.onchange && !noHandle){
                this.options.onchange.call(this, b);
            }
	    },

		setLabel: function(str){
			this.caption.text(str);
		}
	}
}