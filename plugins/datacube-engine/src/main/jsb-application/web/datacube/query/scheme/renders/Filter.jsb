{
	$name: 'DataCube.Query.Renders.Filter',
	$parent: 'DataCube.Query.Renders.QueryElements',

	$alias: '$filter',

	$client: {
	    $constructor: function(opts){
	        $base(opts);

	        this.addClass('filterRender');
	    },

	    constructValues: function(){
            var values = this.getValues();

            for(var i in values){
                for(var j = 0; j < values[i].length; j++){
                    var render = this.createRender({
                        index: j,
                        key: values[i],
                        renderName: '$filterItem',
                        scope: this.getValues()
                    });

                    if(render){
                        this.append(render);
                    }
                }
            }

            var addBtn = this.$('<i class="addBtn"></i>');
            this.append(addBtn);
            addBtn.click(function(){
                if(!values.$and){
                    values.$and = [];
                }

                var index = values.$and.push($this.getDefaultAddValues()) - 1;    // {$eq: [{$const: 0}, {$const: 0}]}

                var render = $this.createRender({
                    index: index,
                    key: '$and',
                    renderName: '$filterItem',
                    scope: $this.getValues()
                });

                if(render){
                    addBtn.before(render);

                    $this.onChange();
                }
            });
	    }
	}
}