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

	        var context = this.getContext();

	        if(context){
	            this.getElement().attr('title', context);
	        }

            this.installMenuEvents({
                element: this.getElement(),
                editToolCallback: function(desc){
                    if(desc.category === 'Поля источника' || desc.category === 'Поля среза'){
                        var newVal = {
                                $field: desc.item
                            };

                        if(desc.sourceContext){
                            newVal.$sourceContext = sourceContext;
                        }
/*
                        if(desc.category === 'Поля источника'){
                            newVal['$context'] = desc.context;
                        }
*/
                        $this.changeTo(null, newVal);
                    } else {
                        $this.changeTo(desc.key);
                    }
                }
            });
	    },

	    getContext: function(){
	        return this.getScope().$context;
	    },

	    getSourceContext: function(){
	        return this.getScope().$sourceContext;
	    },

	    replaceValue: function(newKey, newValue){
	        if(!JSB.isDefined(newValue)){
	            newValue = {
	                $context: this.getContext(),
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
	    }
	}
}