{
	$name: 'Scheme.Test',
	$parent: 'JSB.Controls.Control',
	$require: ['Scheme.Controller'],
	$client: {
	    $constructor: function(opts){
	        $base(opts);
	        var scheme = {
	            users: {
	                render: 'group',
	                name: 'Users',
	                key: 'users',
	                multiple: true,
	                optional: true,
	                items: {
	                name : {
	                    render: 'item',
	                    name: 'Name',
	                    key: 'name',
	                    options: {}
	                },
	                surname: {
	                    render: 'item',
	                    name: 'Surname',
	                    key: 'surname',
	                    options: {}
	                }
	                }
	            }
	        };

	        var values = {
	            users: {
	                checked: true,
	                values: [
	                {
	                    name: {
	                        values: [{
	                            value: 'Alex'
	                        }]
	                    },
	                    surname: {
	                        values: [{
	                            value: 'Morgan'
	                        }]
	                    }
	                },
	                {
	                    name: {
	                        values: [{
	                            value: 'Gregor'
	                        }]
	                    },
	                    surname: {
	                        values: [{
	                            value: 'Dokins'
	                        }]
	                    }
	                }
	                ]
	            }
	        };

	        var renders = [
	            {
	                name: 'group',
	                render: 'Scheme.GroupRender'
                },
	            {
	                name: 'item',
	                render: 'Scheme.ItemRender'
	            }
	        ];

	        var controller = new Controller({
                 scheme: scheme,
                 values: values,
                 rendersDescription: renders
            });

            this.append(controller);
	    }
	}
}