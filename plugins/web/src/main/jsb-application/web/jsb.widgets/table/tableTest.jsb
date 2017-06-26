{
	$name: 'TableTest',
	$parent: 'JSB.Widgets.Widget',
	$require: ['Table'],
	$client: {
		$constructor: function(opts){
			$base(opts);

			this.table = new Table({
			    table: {
                    rowHeaders: true,
                    colHeaders: true,
                    manualColumnResize: true,
                    manualRowResize: true
			    },

			    preLoad: function(){ $this.preLoad(); }
			});
			this.append(this.table);

            this.table.addColumn('test');
		},

		preLoad: function(){

		}
	}
}