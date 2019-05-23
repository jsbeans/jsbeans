/** DataCube - jsBeans extension | jsbeans.org (MIT Licence) | (c) Special Information Systems, LLC */

{
	$name: 'DataCube.Query.Renders.Join',
	$parent: 'DataCube.Query.Renders.Source',

	$alias: '$join',

	$client: {
	    $require: ['JSB.Controls.Selectize',
	               'DataCube.Query.Controls.FieldComparison',
	               'css:Join.css'],

        $constructor: function(opts){
            $base(opts);

            this.addClass('joinRender');
        },

	    construct: function(){
	        function changeSource(index, source){
	            var newContext = source.getFullId(),
	                sourceFields = source.extractFields();

	            if(index === 0){
	                $this.getParent().updateContexts(values.$left, newContext, sourceFields);

	                values.$left = newContext;
	            } else {
	                $this.getParent().updateContexts(values.$right, newContext, sourceFields);

	                values.$right = newContext;
	            }

                fieldComparison.changeFields(index, {
                    context: source.getFullId(),
                    fields: Object.keys(sourceFields)
                });

	            $this.onChange();
	        }

	        var values = this.getValues(),
	            fieldComparison;

	        if(!values.$joinType){
	            values.$joinType = 'inner';
	        }

	        if(!values.$filter){
	            values.$filter = {};
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
	            changeSource(0, source);
	        });

	        // source 2
	        var sourceRight = this.$('<div class="source sourceRight"></div>');
	        this.append(sourceRight);
	        this.createSource(values.$right, sourceRight, function(newSourceType, source){
	            changeSource(1, source);
	        });

	        fieldComparison = new FieldComparison({
	            context: '$sourceContext',
	            onChange: function(){
	                $this.onChange();
	            }
	        });
	        this.append(fieldComparison);

	        this.extractFields([values.$left, values.$right], function(sources){
	            var fields = [];

	            for(var i = 0; i < sources.length; i++){
	                fields.push({
	                    context: sources[i].source,
	                    fields: Object.keys(sources[i].fields)
	                });
	            }

	            fieldComparison.setFields(fields);
	            fieldComparison.setValues(values.$filter);
	        });
	    }
	}
}