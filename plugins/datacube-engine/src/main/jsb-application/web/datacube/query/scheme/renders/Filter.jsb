{
	$name: 'DataCube.Query.Renders.Filter',
	$parent: 'DataCube.Query.Renders.Basic',

	$alias: '$filter',

	$client: {
	    $require: ['DataCube.Query.Syntax',
	               'DataCube.Query.Controls.AddMenu',
	               'css:Filter.css'],

	    $constructor: function(opts){
	        $base(opts);

	        this.addClass('filterRender');

	        if(opts.parent.getRenderName() === '$query'){
	            this._isQueryElement = true;

	            this.createHeader(true);

	            this.addClass('queryElements');
	        } else {
	            this.constructHead()
	        }

	        this.constructValues();

	        this.addMenu = new AddMenu({
	            existElements: this.getValues(),
	            menuItems: Syntax.getReplacementGroupItems('$filter'),
	            callback: function(desc){
                    var render = $this.createRender({
                        key: desc.key,
                        scope: $this.getValues()
                    });

                    if(render){
                        $this.addMenu.before(render);

                        $this.onChange();
                    }
	            }
	        });
	        this.append(this.addMenu);
	    },

	    _isQueryElement: false,

	    changeValue: function(oldDesc){
	        // todo
	        this.setValues({});
	    },

	    checkValues: function(){
	        var values = this.getValues(),
	            filter = Syntax.getReplacementGroup('$filter');

            for(var i in values){
                if(filter.indexOf(i) === -1){
                    // совместимость со старым синтаксисом
                    if(JSB.isObject(values[i]) && filter.indexOf(Object.keys(values[i])[0]) !== -1){
                        if(values[Object.keys(values[i])[0]]){
                            if(!values['$and']){
                                values['$and'] = [];
                            }

                            var newVal = {};

                            newVal[Object.keys(values[i])[0]] = [
                            {
                                $field: i
                            },
                            values[i][Object.keys(values[i])[0]]
                            ];

                            values['$and'].push(newVal);
                        } else {
                            values[Object.keys(values[i])[0]] = [
                                {
                                    $field: i
                                },
                                values[i][Object.keys(values[i])[0]]
                            ];
                        }
                    }

                    delete values[i];
                }
            }

            if(Object.keys(values).length === 0){
                this.setValues(this.getDefaultValues());
            }
	    },

	    constructHead: function(){
	        var scheme = this.getScheme(),
	            desc = this.getKey() + '\n' + scheme.desc;

	        var operator = this.$('<div class="operator" title="' + desc + '">' + scheme.displayName + '</div>');
            this.append(operator);

            this.installMenuEvents({
                element: operator,
                id: this.getId() + '_operator',
                wrap: this.isAllowWrap(),
                deleteCallback: function(){
                    $this.getDeleteCallback().call($this);
                }
            });

            this.append(this.createSeparator(this.isMultiple() || scheme.parameters));
	    },

	    constructValues: function(){
	        var values = this.getValues();

            for(var i in values){
                var render = $this.createRender({
                    key: i,
                    scope: values
                });

                if(render){
                    this.append(render);
                }
            }
	    },

	    createRender: function(options, parent){
	        JSB.merge(options, {
	            allowDelete: true,
	            deleteCallback: function(){
	                $this.addMenu.addItem(JSB.merge({}, this.getScheme(), {key: this.getKey()}));

	                this.remove();

	                $this.onChange();
	            }
	        });

	        return $base(options, parent);
	    },

	    remove: function(){
	        if(this._isQueryElement){
	            this.getParent().addMenuItem(JSB.merge({}, this.getScheme(), {key: this.getKey()}));
            }

	        $base();
	    }
	}
}