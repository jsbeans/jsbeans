{
	$name: 'DataCube.Query.Renders.Select',
	$parent: 'DataCube.Query.Renders.Basic',

	$alias: '$select',

	$client: {
	    $require: ['css:Select.css'],

	    $constructor: function(opts){
	        $base(opts);

	        this.addClass('selectRender');

	        this.createHeader(false);

            var values = this.getValues(),
                fieldsArr = Object.keys(values).sort();

            for(var i = 0; i < fieldsArr.length; i++){
                var render = this.createRender({
                    key: fieldsArr[i],
                    renderName: '$selectItem',
                    scope: this.getValues()
                });

                if(render){
                    this.append(render);
                }
            }

            var addBtn = this.$('<i class="addBtn"></i>');
            this.append(addBtn);
            addBtn.click(function(){
                var count = 1,
                    name = 'Столбец',
                    newName = name;

                while(values[newName]){
                    newName = name + '_' + count;
                    count++;
                }

                values[newName] = $this.getDefaultValues();

                var render = $this.createRender({
                    key: newName,
                    renderName: '$selectItem',
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