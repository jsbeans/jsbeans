{
	$name: 'DataCube.Query.Renders.FilterItem',
	$parent: 'DataCube.Query.Renders.Basic',

	$alias: '$filterItem',

	$client: {
		$require: ['DataCube.Query.Syntax'],

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
	    },

	    checkValues: function(){
	        var index = this.getOption('index'),
	            values = this.getValues()[index];

	        for(var i in values){
                var scheme = Syntax.getSchema(i);

	            if(!scheme){
	                var newVal = {};

	                newVal[Object.keys(values[i])[0]] = [{
	                    $field: i
	                }, values[i][Object.keys(values[i])[0]]];

	                this.getValues()[index] = newVal;
	            }
	        }
	    }
	}
}