{
	$name: 'Unimap.Render.Switch',
	$parent: 'Unimap.Render.Basic',
	$require: ['JSB.Controls.Switch'],
	$client: {
	    construct: function(){
	        this.addClass('switchRender');
	        this.loadCss('Switch.css');

	        this._values.checked = JSB.isDefined(this._values.checked) ? this._values.checked : this._scheme.optional == 'checked';

	        var switchEl = new Switch({
	            checked: this._values.checked,
	            onchange: function(b){
	                $this._values.checked = b;

	                if(b){
	                    $this.createScheme();
	                } else {
	                    $this.removeScheme();
	                }
	            }
	        });
	        this.append(switchEl);

	        var name = this.$('<span class="name">' + this._scheme.name + '</span>');
	        this.append(name);

	        this.createDescription(name);

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
                if(!values[i]){
                    values[i] = {};
                }

                this.schemeEl.append(this.createRender(i, this._scheme.items[i], values[i]).getElement());
            }
	    },

	    removeScheme: function(){
	        this.schemeEl.remove();
	    }
	}
}