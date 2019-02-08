{
	$name: 'DataCube.Query.Renders.Field',
	$parent: 'DataCube.Query.Renders.Basic',

	$alias: '$field',

	$client: {
	    $constructor: function(opts){
	        $base(opts);

	        this.addClass('cubeFieldIcon sliceField');

	        this.append(this._values);

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

                        $this.getParent().replaceValue($this.getValues(), $this.getValues(), newVal);

                        var render = $this.getController().createRender($this.getParent(), $this.getKey(), desc.item);

                        if(render){
                            $this.getElement().replaceWith(render.getElement());
                            $this.onChange();
                            $this.destroy();
                        }
                    }
                }
            });
	    },

	    defineContext: function(){
	        //
	    }
	}
}