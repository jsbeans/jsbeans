{
	$name: 'Unimap.Render.Switch',
	$parent: 'Unimap.Render.Basic',
	$require: ['JSB.Controls.Switch'],
	$client: {
	    construct: function(){
	        this.addClass('switchRender');
	        $jsb.loadCss('Switch.css');

	        this._values.checked = JSB.isDefined(this._values.checked) ? this._values.checked : this._scheme.optional == 'checked';

	        this.switchEl = new Switch({
	            checked: this._values.checked,
	            label: this._scheme.name,
	            onchange: function(b){
	                $this._values.checked = b;

	                if(b){
	                    $this.createScheme();
	                } else {
	                    $this.removeScheme();
	                }
	            }
	        });
	        this.append(this.switchEl);

	        this.createDescription(this.switchEl);

	        if(this._values.checked){
	            this.createScheme();
	        }
	    },

	    createScheme: function(){
	        var values = this._values.values[0];

	        if(!values){
	            values = {};

	            this._values.values.push(values);

	            for(var i in this._scheme.items){
	                values[i] = {};
	            }
	        }

	        this.schemeEl = this.$('<div class="schemeEl"></div>');
	        this.append(this.schemeEl);

            for(var i in this._scheme.items){
                if(!this._scheme.items[i].render){
                    continue;
                }

                if(!values[i]){
                    values[i] = {};
                }

                var render = this.createRender(i, this._scheme.items[i], values[i]);
                if(render){
                    this.schemeEl.append(render.getElement());
                }
            }
	    },

	    destroy: function(){
	        this.switchEl.destroy();

	        $base();
	    },

	    removeScheme: function(){
	        this.schemeEl.remove();
	    }
	}
}