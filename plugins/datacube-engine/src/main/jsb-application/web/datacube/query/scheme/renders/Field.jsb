/** DataCube - jsBeans extension | jsbeans.org (MIT Licence) | (c) Special Information Systems, LLC */

{
	$name: 'DataCube.Query.Renders.Field',
	$parent: 'DataCube.Query.Renders.Basic',

	$alias: '$field',

	$client: {
	    $require: ['css:Field.css'],

	    $constructor: function(opts){
	        $base(opts);

	        this.addClass('fieldQueryRender cubeFieldIcon sliceField');

	        this.append(this.getValues());

	        var context = this.getFieldContext();

	        if(context){
	            this.getElement().attr('title', context);
	        }

	        this.bindMenu(this.createMainMenuOptions({
                editToolCallback: function(desc) {
                    if(desc.schemeKey === '$field') {
                        var newVal = {
                                $field: desc.item
                            };

                        if(desc.sourceContext){
                            newVal.$sourceContext = desc.sourceContext;
                        }

                        $this.changeTo(null, newVal);
                    } else {
                        $this.changeTo(desc.schemeKey);
                    }
                }
	        }));
	    },

	    getFieldContext: function(){
	        return this.getScope().$context;
	    },

	    getSourceContext: function(){
	        return this.getScope().$sourceContext;
	    },

	    replaceValue: function(newKey, newValue){
	        if(!JSB.isDefined(newValue)){
	            newValue = {
	                $context: this.getFieldContext(),
	                $field: this.getValues(),
	                $sourceContext: this.getSourceContext()
	            };
	        }

	        delete this.getScope()[this.getKey()];
	        delete this.getScope()['$context'];
	        delete this.getScope()['$sourceContext'];

            if(newKey === this.getKey()){
                JSB.merge(this._scope, newValue);
            } else {
                $base(newKey, newValue);
            }
	    },

	    setSourceContext: function(context){
	        this.getScope().$sourceContext = context;
	    },

	    showError: function(text){
	        this.getElement().attr('title', text);
	        this.addClass('error');
	    },

	    wrap: function(desc, options){
	        var oldVal = {
	                $context: this.getFieldContext(),
	                $field: this.getValues(),
	                $sourceContext: this.getSourceContext()
	            };

            delete this.getScope()[this.getKey()];
            delete this.getScope()['$context'];
            delete this.getScope()['$sourceContext'];

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