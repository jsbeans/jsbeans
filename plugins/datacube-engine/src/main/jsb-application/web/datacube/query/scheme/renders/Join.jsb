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
	        var item = this.$('<div class="item"></div>'),
	            sources = this.getData('cubeSlices'),
	            curValue = {};

            if(this._values.$filter.$and[index]){
                curValue.compare = Object.keys(this._values.$filter.$and[index])[0];

                if(curValue.compare){
                    curValue.first = this._values.$filter.$and[index][curValue.compare][0];
                    curValue.second = this._values.$filter.$and[index][curValue.compare][1];
                }
            }

	        function updateCurValue(){
	            if(curValue.compare){
	                $this._values.$filter.$and[index] = {};
	                $this._values.$filter.$and[index][curValue.compare] = [curValue.first, curValue.second];
	            }
	        }

	        var firstField = new Selectize({
	            options: Object.keys(sources[this._values.$left].extractFields()),
	            value: curValue.first.$field,
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
	            options: ['$eq', ''],
	            value: curValue.compare,
	            onChange: function(value){
	                curValue.compare = value;
	                updateCurValue();
	            }
	        });
	        item.append(compare);

	        var secondField = new Selectize({
	            options: Object.keys(sources[this._values.$right].extractFields()),
	            value: curValue.second.$field,
	            onChange: function(value){
	                curValue.second = {
	                    $context: $this._values.$right,
	                    $field: value
	                };
	                updateCurValue();
	            }
	        });
	        item.append(secondField);

	        // add remove btn

            this.fields.append(item);
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
console.log(this._values.$joinType);
	        // source 1
	        var sourceLeft = this.$('<div class="sourceLeft"></div>');
	        this.append(sourceLeft);
	        this.createSource(this._values.$left, sourceLeft, function(){
	            //
	        });

	        // source 2
	        var sourceRight = this.$('<div class="sourceRight"></div>');
	        this.append(sourceRight);
	        this.createSource(this._values.$right, sourceRight, function(){
	            //
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