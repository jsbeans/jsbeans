{
	$name: 'DataCube.Query.Renders.Math',
	$parent: 'DataCube.Query.Renders.Basic',

	$alias: '$math',

	$client: {
	    $constructor: function(opts){
	        $base(opts);

	        var scheme = this.getScheme();

	        var operator = this.$('<div class="operator">' + scheme.displayName + '</div>');
            this.append(operator);

            if(this.isMultiple()){
                var variables = this.$('<div class="variables"></div>');
                this.append(variables);

                var values = this.getValues();

                for(var i = 0; i < values.length; i++){
                    for(var j in values[i]){
                        var render = this.createRender({
                            key: j,
                            scope: this.getValues()
                        });

                        if(render){
                            variables.append(render);
                        }
                    }
                }

                // add btn
            } else {
                //
            }
	    }
	}
}