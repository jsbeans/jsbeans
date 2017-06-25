{
	$name: 'TableTest',
	$parent: 'JSB.Widgets.Widget',
	$require: ['Table'],
	$client: {
		$constructor: function(opts){
			$base(opts);

			JSB().defer(function(){
                $this.table = new Table({
                    callbacks: {
                        createHeader: function() {},
                        preLoader: function(){ $this.preLoader(); }
                    }
                });
                $this.append($this.table);

                $this.table.addColumn('test');
			}, 500);
		},

		preLoader: function(){

		}
	}
}