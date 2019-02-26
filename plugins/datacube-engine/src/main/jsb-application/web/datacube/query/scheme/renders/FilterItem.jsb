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
                    allowDelete: true,
                    key: i,
                    scope: values
                });

                if(render){
                    this.append(render);
                }
            }
	    },

	    changeLogicType: function(newKey){
            var newIndex = this.getParent().changeLogicType(this.getKey(), newKey, this.getOption('index'));

            this.setOption('index', newIndex);
            this.setKey(newKey);
	    }
	}
}