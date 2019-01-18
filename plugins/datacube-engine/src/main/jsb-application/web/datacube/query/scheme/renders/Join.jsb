{
	$name: 'DataCube.Query.Renders.Join',
	$parent: 'DataCube.Query.Renders.Basic',

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
	            //
	        });

debugger;

	        this.append(joinType);
	        this._beans[joinType.getId()] = joinType;

	        // source 1

	        // source 2

	        // fields
	        this.fields = this.$('<div class="fields"></div>');

            this.addBtn = this.$('<i class="btn fas fa-plus-circle"></i>');
            this.addBtn.click(function(){
                //$this.onMultipleBtnClick();
            });
            this.fields.append(this.addBtn);
            this.append(this.fields);

	        //this.addItem();
	    }
	}
}