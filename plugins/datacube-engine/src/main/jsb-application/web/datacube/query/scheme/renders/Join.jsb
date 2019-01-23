{
	$name: 'DataCube.Query.Renders.Join',
	$parent: 'DataCube.Query.Renders.Source',

	$alias: '$join',

	$client: {
	    $require: ['JSB.Controls.Select',
	               'JSB.Controls.Selectize'],

	    addItem: function(value){
	        var item = this.$('<div class="item"></div>');

	        var sources = this.getData('cubeSlices');

            var firstField = new Select({
                cssClass: 'firstField',
                clearBtn: !this._scheme.multiple,
                cloneOptions: true,
                options: sources,
                onchange: function(val){
                    values.firstField = {
                        $context: val.options.context,
                        $field: val.key
                    }

                    $this.onchange();
                }
            });
            item.append(firstField.getElement());

            var comparison = new Select({
                cssClass: 'comparison',
                cloneOptions: true,
                options: this._comparisonOpts,
                value: values.comparison,
                onchange: function(val){
                    values.comparison = val.key;

                    $this.onchange();
                }
            });
            item.append(comparison.getElement());

            var secondField = new Select({
                cssClass: 'secondField',
                clearBtn: !this._scheme.multiple,
                cloneOptions: true,
                options: sources,
                onchange: function(val){
                    values.secondField = {
                        $context: val.options.context,
                        $field: val.key
                    }

                    $this.onchange();
                }
            });
            item.append(secondField.getElement());

            this.multipleContainer.append(item);
	    },

	    construct: function(){
	        // join type
	        var joinType = new Selectize({
	            label: 'JoinType',
	            onlySelect: true,
	            options: ['left inner', 'left outer'],
	            value: this._values.$joinType
	        });
	        this.append(joinType);

	        // source 1
	        this.createSource(this._values.$left, function(element){
	            joinType.after(element);
	        });

	        // source 2
	        this.createSource(this._values.$right, function(element){
	            joinType.after(element);
	        });

	        // fields
	        this.fields = this.$('<div class="fields"></div>');

            this.addBtn = this.$('<i class="btn fas fa-plus-circle"></i>');
            this.addBtn.click(function(){
                $this.addItem();
            });
            this.fields.append(this.addBtn);
            this.append(this.fields);

	        //this.addItem();
	    }
	}
}