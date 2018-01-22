{
	$name: 'Scheme.Test',
	$parent: 'JSB.Controls.Control',
	$require: ['Scheme.Controller', 'JSB.Controls.Button'],
	$client: {
	    $constructor: function(opts){
	        $base(opts);
	        var scheme = {
	            sources: {
	                render: 'sourceBinding',
	                name: 'Sources',
	                key: 'sources'
	            },
	            dataBindings: {
	                render: 'dataBinding',
                    name: 'DataBinding',
	                key: 'dataBindings',
	                linkTo: 'sources'
	            },
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
	            },
	            select: {
	                render: 'select',
	                name: 'Select',
	                key: select,
	                items: {
	                    sel1: {
	                        name: 'Select_1',
	                        key: 'sel1',
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
	                }
	            }
	        };

	        var values = {
	        /*
	            sources: {
	                values: [
	                {
	                    binding: {}
	                }
	                ]
	            },
            */
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
	                render: 'Scheme.Render.Group'
                },
	            {
	                name: 'item',
	                render: 'Scheme.Render.Item'
	            },
	            {
	                name: 'sourceBinding',
	                render: "Scheme.Render.SourceBinding"
	            },
	            {
	                name: 'dataBinding',
	                render: "Scheme.Render.DataBinding"
	            }
	        ];

	        var controller = new Controller({
                 scheme: scheme,
                 values: values,
                 rendersDescription: renders
            });

            this.append(controller);

            var valuesBtn = new Button({
                caption: 'Получить значения',
                onclick: function(){
                    console.log(controller.getValues());
                    debugger;
                }
            });
            this.append(valuesBtn);
	    }
	}
}