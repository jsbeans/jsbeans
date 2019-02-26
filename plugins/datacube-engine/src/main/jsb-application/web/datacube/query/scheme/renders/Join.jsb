{
	$name: 'DataCube.Query.Renders.Join',
	$parent: 'DataCube.Query.Renders.Source',

	$alias: '$join',

	$client: {
	    $require: ['JSB.Controls.Selectize',
	               'css:Join.css'],

        $constructor: function(opts){
            $base(opts);

            this.addClass('joinRender');
        },

	    addItem: function(index){
	        var item = this.$('<div class="field"></div>'),
	            sources = this.getData('cubeSlices'),
	            curValue = {
	                compare: '$eq'
	            },
	            value = {},
	            values = this.getValues();

            if(!JSB.isDefined(index)){
                index = values.$filter.$and.length;
            }

            if(values.$filter.$and[index]){
                value = values.$filter.$and[index];

                curValue.compare = Object.keys(values.$filter.$and[index])[0];

                if(curValue.compare){
                    curValue.first = values.$filter.$and[index][curValue.compare][0];
                    curValue.second = values.$filter.$and[index][curValue.compare][1];
                }
            } else {
                values.$filter.$and[index] = value;
            }

	        function updateCurValue(){
	            if(curValue.compare){
	                for(var i in value){
	                    delete value[i];
	                }

	                value[curValue.compare] = [curValue.first, curValue.second];

	                $this.onChange();
	            }
	        }

	        var firstField = new Selectize({
	            cssClass: 'firstField',
	            onChange: function(value){
	                curValue.first = {
	                    $context: values.$left,
	                    $field: value
	                };
	                updateCurValue();
	            }
	        });
	        item.append(firstField);

	        this.extractFields(values.$left, function(res){
	            firstField.setOptions(Object.keys(res));
	            firstField.setValue(curValue.first && curValue.first.$field, true);
	        });

	        var compare = new Selectize({
	            cssClass: 'compare',
	            options: ['$eq', '$gte', '$gt', '$lte', '$lt'],
	            value: curValue.compare,
	            onChange: function(value){
	                curValue.compare = value;
	                updateCurValue();
	            }
	        });
	        item.append(compare);

	        var secondField = new Selectize({
	            cssClass: 'secondField',
	            onChange: function(value){
	                curValue.second = {
	                    $context: values.$right,
	                    $field: value
	                };
	                updateCurValue();
	            }
	        });
	        item.append(secondField);

	        this.extractFields(values.$right, function(res){
	            secondField.setOptions(Object.keys(res));
	            secondField.setValue(curValue.second && curValue.second.$field, true);
	        });

	        var removeBtn = this.$('<div class="removeBtn fas fa-trash-alt"></div>');
	        item.append(removeBtn);
	        removeBtn.click(function(){
	            var index = values.$filter.$and.indexOf(value);
	            values.$filter.$and.splice(index, 1);

	            item.remove();

	            $this.onChange();
	        });

            this.fields.append(item);
	    },

	    construct: function(){
	        function changeSource(name, source){
	            var selectors = $this.fields.find(name),
	                options = Object.keys(source.extractFields());

	            for(var i = 0; i < selectors.length; i++){
	                var sel = $this.$(selectors[i]).jsb();
	                sel.setOptions(options);
	            }

	            $this.onChange();
	        }

	        var values = this.getValues();

	        if(!values.$joinType){
	            values.$joinType = 'inner';
	        }

	        // join type
	        var joinType = new Selectize({
	            cssClass: 'joinType',
	            label: 'JoinType',
	            onlySelect: true,
	            options: ['inner', 'left outer', 'right outer', 'full'],
	            value: values.$joinType,
	            onChange: function(value){
	                values.$joinType = value;
	                $this.onChange();
	            }
	        });
	        this.append(joinType);

	        // source 1
	        var sourceLeft = this.$('<div class="source sourceLeft"></div>');
	        this.append(sourceLeft);
	        this.createSource(values.$left, sourceLeft, function(newSourceType, source){
	            values.$left = source.getFullId();
	            changeSource('.firstField', source);
	        });

	        // source 2
	        var sourceRight = this.$('<div class="source sourceRight"></div>');
	        this.append(sourceRight);
	        this.createSource(values.$right, sourceRight, function(newSourceType, source){
	            values.$right = source.getFullId();
	            changeSource('.secondField', source);
	        });

	        // fields
	        this.fields = this.$('<div class="fields"></div>');
            this.append(this.fields);

            this.addBtn = this.$('<i class="addBtn fas fa-plus-circle"></i>');
            this.addBtn.click(function(){
                $this.addItem();
            });
            this.append(this.addBtn);

	        if(values.$filter && values.$filter.$and){
	            for(var i = 0; i < values.$filter.$and.length; i++){
	                this.addItem(i);
	            }
	        } else {
	            values.$filter = {
	                $and: []
	            };

	            this.addItem(0);
	        }
	    }
	}
}