{
	$name: 'DataCube.Query.Renders.Field',
	$parent: 'DataCube.Query.Renders.Basic',

	$alias: '$field',

	$client: {
	    $constructor: function(opts){
	        $base(opts);

	        this.addClass('cubeFieldIcon sliceField');

	        this.append(this.getValues());

	        var context = this.getContext();

	        if(context){
	            this.getElement().attr('title', context);
	        }

            this.installMenuEvents(this.getElement(), null, {
                removable: false,
                editToolCallback: function(desc){
                    if(desc.category === 'Поля источника' || desc.category === 'Поля среза'){
                        var newVal = {
                                $field: desc.item
                            };

                        if(desc.category === 'Поля источника'){
                            newVal['$context'] = desc.context;
                        }

                        $this.changeTo($this.getRenderName(), newVal);
                    } else {
                        //
                    }
                }
            });
	    },

	    defineContext: function(){
	        //
	    },

	    getContext: function(){
	        return this.getParent().getValues()['$context'];
	    }
	}
}