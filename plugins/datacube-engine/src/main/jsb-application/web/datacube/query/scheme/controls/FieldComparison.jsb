/** DataCube - jsBeans extension | jsbeans.org (MIT Licence) | (c) Special Information Systems, LLC */

{
	$name: 'DataCube.Query.Controls.FieldComparison',
	$parent: 'JSB.Controls.Control',

	$client: {
		$require: ['JSB.Controls.Selectize',
		           'css:FieldComparison.css'],

        $constructor: function(opts){
            $base(opts);

            this.addClass('fieldComparison');

	        // fields
	        this.fields = this.$('<div class="fields"></div>');
            this.append(this.fields);

            this.addBtn = this.$('<i class="addBtn"></i>');
            this.addBtn.click(function(){
                $this.addItem();
            });
            this.append(this.addBtn);

            if(this.options.fields){
                this.setFields(this.options.fields);
            }

            if(opts.values){
                this.setValues(opts.values);
            }
        },

        addItem: function(index){
	        var item = this.$('<div class="field"></div>'),
	            curValue = {
	                compare: '$eq'
	            },
	            value = {},
	            values = this.getValues();

            if(!JSB.isDefined(index)){
                index = values.$and.length;
            }

            if(values.$and[index]){
                value = values.$and[index];

                curValue.compare = Object.keys(values.$and[index])[0];

                if(curValue.compare){
                    curValue.first = values.$and[index][curValue.compare][0];
                    curValue.second = values.$and[index][curValue.compare][1];
                }
            } else {
                values.$and[index] = value;
            }

	        function updateCurValue(){
	            if(curValue.compare){
	                for(var i in value){
	                    delete value[i];
	                }

	                value[curValue.compare] = [];

	                if(curValue.first){
	                    value[curValue.compare][0] = curValue.first;
	                }

	                if(curValue.second){
	                    value[curValue.compare][1] = curValue.second;
	                }

	                $this.onChange();
	            }
	        }

	        var firstField = new Selectize({
	            cssClass: 'firstField',
	            options: this.getFields(0),
	            value: curValue.first && curValue.first.$field,
	            onChange: function(value){
	                curValue.first = {
	                    $field: value
	                };

	                if($this.options.context){
	                    curValue.first[$this.options.context] = $this.getContext(0);
	                }

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
	            options: this.getFields(1),
	            value: curValue.second && curValue.second.$field,
	            onChange: function(value){
	                curValue.second = {
	                    $field: value
	                };

	                if($this.options.context){
	                    curValue.second[$this.options.context] = $this.getContext(1);
	                }

	                updateCurValue();
	            }
	        });
	        item.append(secondField);

	        var removeBtn = this.$('<div class="removeBtn fas fa-trash-alt"></div>');
	        item.append(removeBtn);
	        removeBtn.click(function(){
	            var index = values.$and.indexOf(value);
	            values.$and.splice(index, 1);

	            item.remove();

	            $this.onChange();
	        });

            this.fields.append(item);
        },

        changeFields: function(index, fields){
            this._fields[index] = fields;

            var name = index === 0 ? '.firstField' : '.secondField';

            var selectors = this.fields.find(name);

            for(var i = 0; i < selectors.length; i++){
                var sel = this.$(selectors[i]).jsb();
                sel.setOptions(fields.fields);
            }
        },

        getContext: function(index){
            return this._fields[index].context;
        },

        getFields: function(index){
            return this._fields[index].fields;
        },

        getValues: function(){
            return this._values;
        },

        onChange: function(){
            this.options.onChange.call(this);
        },

        setFields: function(fields){
            this._fields = fields;
        },

        setValues: function(values){
            this._values = values;

	        if(values.$and){
	            for(var i = 0; i < values.$and.length; i++){
	                this.addItem(i);
	            }
	        } else {
	            values.$and = [];

	            this.addItem(0);
	        }
        }
    }
}