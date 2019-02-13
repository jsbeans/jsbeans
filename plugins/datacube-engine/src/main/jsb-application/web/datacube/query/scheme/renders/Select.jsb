{
	$name: 'DataCube.Query.Renders.Select',
	$parent: 'DataCube.Query.Renders.Basic',

	$alias: '$select',

	$client: {
	    $require: ['css:Select.css'],

	    $constructor: function(opts){
	        $base(opts);

	        this.addClass('selectRender');

	        this.createHeader();

            var values = this.getValues(),
                fieldsArr = Object.keys(values).sort();

            for(var i = 0; i < fieldsArr.length; i++){
                for(var j in values[fieldsArr[i]]){
                    var render = this.createRender({
                        key: fieldsArr[i],
                        renderName: '$selectItem',
                        scope: this.getValues()
                    });

                    if(render){
                        this.append(render);
                    }
                }
            }

            // add field btn
	    },

	    sort: function(){}
	}
}