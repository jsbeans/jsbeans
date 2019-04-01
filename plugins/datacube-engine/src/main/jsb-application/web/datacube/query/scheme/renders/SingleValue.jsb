{
	$name: 'DataCube.Query.Renders.SingleValue',
	$parent: 'DataCube.Query.Renders.Default',

	$alias: '$singleValue',

	$client: {
		$require: ['css:SingleValue.css'],

	    $constructor: function(opts){
	        $base(opts);

	        this.addClass('singleValueRender');
	    },

	    constructValues: function(){
	        var operator = this.$('<div class="operator">' + this.getScheme().displayName + '</div>');
	        this.append(operator);

	        this.append('<div class="separator"></div>');

	        var value = this.$('<div class="value">' + this.getValues() + '</div>');
	        this.append(value);

	        var valueType = 'text';
	        if(typeof this.getValues() === 'number'){
	            valueType = 'number';
	        }

	        value.click(function(evt){
	            evt.stopPropagation();

	            $this.createInput(value, valueType, function(newVal){
	                $this.setValues(newVal);
	            });
	        });
	    }
	}
}