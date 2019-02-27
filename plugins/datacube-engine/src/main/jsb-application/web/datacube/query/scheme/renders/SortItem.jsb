{
	$name: 'DataCube.Query.Renders.SortItem',
	$parent: 'DataCube.Query.Renders.Basic',

	$alias: '$sortItem',

	$client: {
	    $require: ['JSB.Controls.Selectize'],

	    _dirOptions: [
	    {
	        id: -1,
	        name: 'По убыванию'
	    },
	    {
	        id: 1,
	        name: 'По возрастанию'
	    }
	    ],

	    $constructor: function(opts){
	        $base(opts);

	        this.addClass('sortItemRender');

	        var values = this.getScope()[this.getOption('index')];

            // выражение
            var expr = this.$('<div class="expr"></div>');
            this.append(expr);

            var exprName = this.$('<div class="exprName">Выражение</div>');
            expr.append(exprName);

            expr.append(this.createSeparator());

            for(var i in values.$expr){
                var render = this.createRender({
                    key: i,
                    scope: values.$expr
                });

                if(render){
                    expr.append(render);
                }
            }

            // направление сортировки
            var dir = this.$('<div class="dir"></div>');
            this.append(dir);

            var dirName = this.$('<div class="dirName">Направление</div>');
            dir.append(dirName);

            dir.append(this.createSeparator());

	        var selectize = new Selectize({
	            cssClass: 'queryEditor-selectInput',
	            labelField: 'name',
	            onlySelect: true,
	            options: this._dirOptions,
	            searchField: 'name',
	            value: values.$type,
	            onChange: function(val){
	                values.$type = val;

	                $this.onChange();
	            }
	        });

	        dir.append(selectize);
	    }
	}
}