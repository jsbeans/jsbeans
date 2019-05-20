{
	$name: 'DataCube.Query.Controls.ViewsEditor',
	$parent: 'DataCube.Query.Controls.ExtendEditor',

	$alias: '$views',

	$client: {
	    $require: ['DataCube.Query.SchemeController',
	               'DataCube.Query.Syntax',
	               'DataCube.Query.Helper'],

	    $constructor: function(opts) {
	        $base(opts);

	        this.addClass('viewEditor');
	    },

	    create: function(values, name) {
            name = name || Helper.createName(this._descs, 'Именованный подзапрос');

            var isNew = false;

            if(!values) {
                values = Syntax.constructDefaultValues({key: '$query'});

                isNew = true;
            }

            var controller = new SchemeController({
                data: this._controllerOptions.data,
                slice: this._controllerOptions.slice,
                values: values,
                onChange: function() {
                    this.onChange('change', {
                        name: name,
                        values: values
                    });
                }
            });

            var item = this.createItem(name, function() {
                controller.destroy();
            });
            item.append(controller);

            if(isNew) {
                this.onChange('add', {
                    name: name,
                    values: values
                });
            }
	    }
	}
}