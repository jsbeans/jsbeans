{
	$name: 'DataCube.Query.Renders.Join',
	$parent: 'DataCube.Query.Renders.Source',

	$alias: '$join',

	$client: {
	    $require: ['JSB.Controls.Select',
	               'JSB.Controls.Selectize',
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
	            value = {};

            if(!JSB.isDefined(index)){
                index = this._values.$filter.$and.length;
            }

            if(this._values.$filter.$and[index]){
                value = this._values.$filter.$and[index];

                curValue.compare = Object.keys(this._values.$filter.$and[index])[0];

                if(curValue.compare){
                    curValue.first = this._values.$filter.$and[index][curValue.compare][0];
                    curValue.second = this._values.$filter.$and[index][curValue.compare][1];
                }
            } else {
                this._values.$filter.$and[index] = value;
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
	            options: Object.keys(sources[this._values.$left].extractFields()),
	            value: curValue.first && curValue.first.$field,
	            onChange: function(value){
	                curValue.first = {
	                    $context: $this._values.$left,
	                    $field: value
	                };
	                updateCurValue();
	            }
	        });
	        item.append(firstField);

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
	            options: Object.keys(sources[this._values.$right].extractFields()),
	            value: curValue.second && curValue.second.$field,
	            onChange: function(value){
	                curValue.second = {
	                    $context: $this._values.$right,
	                    $field: value
	                };
	                updateCurValue();
	            }
	        });
	        item.append(secondField);

	        var removeBtn = this.$('<div class="removeBtn fas fa-trash-alt"></div>');
	        item.append(removeBtn);
	        removeBtn.click(function(){
	            var index = $this._values.$filter.$and.indexOf(value);
	            $this._values.$filter.$and.splice(index, 1);

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
	        }

	        if(!this._values.$joinType){
	            this._values.$joinType = 'inner';
	        }

	        // join type
	        var joinType = new Selectize({
	            cssClass: 'joinType',
	            label: 'JoinType',
	            onlySelect: true,
	            options: ['inner', 'left outer', 'right outer', 'full'],
	            value: this._values.$joinType,
	            onChange: function(value){
	                $this._values.$joinType = value;
	                $this.onChange();
	            }
	        });
	        this.append(joinType);

	        // source 1
	        var sourceLeft = this.$('<div class="sourceLeft"></div>');
	        this.append(sourceLeft);
	        this.createSource(this._values.$left, sourceLeft, function(newSourceType, source){
	            changeSource('.firstField', source);
	        });

	        // source 2
	        var sourceRight = this.$('<div class="sourceRight"></div>');
	        this.append(sourceRight);
	        this.createSource(this._values.$right, sourceRight, function(newSourceType, source){
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

	        if(this._values.$filter && this._values.$filter.$and){
	            for(var i = 0; i < this._values.$filter.$and.length; i++){
	                this.addItem(i);
	            }
	        } else {
	            this._values.$filter = {
	                $and: []
	            };

	            this.addItem(0);
	        }
	    }
	}
}