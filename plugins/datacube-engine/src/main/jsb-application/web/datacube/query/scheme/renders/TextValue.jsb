/** DataCube - jsBeans extension | jsbeans.org (MIT Licence) | (c) Special Information Systems, LLC */

{
	$name: 'DataCube.Query.Renders.TextValue',
	$parent: 'DataCube.Query.Renders.Basic',

	$alias: '$text',

	$client: {
	    options: {
	        allowDelete: true,
	        allowReplace: true,
	        allowWrap: true
	    },

	    $constructor: function(opts){
	        $base(opts);

	        this.addClass('textValue');

	        this.createValue();

	        this.bindMenu(this.createMainMenuOptions());
	    },

	    createValue: function() {
	        this.append(this.getScope());
	    },

	    changeValue: function() {
	        var value = this.getValues();

	        this.getParent().setValues(value);

	        this.setScope(value)
	    },

	    replaceValue: function(newKey, newValue) {
	        if(!JSB.isDefined(newValue)) {
	            newValue = this.getScope();
	        }

	        var newScope = {};

	        this.getParent().getScope()[this.getParent().getKey()] = newScope;
	        this._scope = newScope;

	        $base(newKey, newValue);
	    },

	    setScope: function(scope) {
	        this._scope = scope;
	    },

	    wrap: function(desc, options) {
	        var newScope = {},
	            oldVal = this.getScope();

	        this.getParent().getScope()[this.getParent().getKey()] = newScope;
	        this._scope = newScope;

            if(desc.multiple){
	            this._scope[desc.key] = [oldVal];
            } else {
                this._scope[desc.key] = oldVal;
            }

	        var render = this.createRender({
	            key: desc.key,
	            scope: this.getScope()
	        }, this.getParent());

	        if(render){
	            this.getElement().replaceWith(render.getElement());
	            this.destroy();
	            this.onChange();
	        }
	    }
	}
}