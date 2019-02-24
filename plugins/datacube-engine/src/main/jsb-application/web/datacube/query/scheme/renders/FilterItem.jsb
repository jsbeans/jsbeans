{
	$name: 'DataCube.Query.Renders.FilterItem',
	$parent: 'DataCube.Query.Renders.Basic',

	$alias: '$filterItem',

	$client: {
		$require: [],

	    $constructor: function(opts){
	        $base(opts);

	        var values = this.getValues()[this.getOption('index')];

            for(var i in values){
                var render = this.createRender({
                    key: i,
                    scope: values
                });

                if(render){
                    this.append(render);
                }
            }
	    }
	}
}