{
	$name: 'JSB.DataCube.GridView',
	$parent: 'JSB.Widgets.Widget',
	$require: ['Table'],
	$client: {
		$constructor: function(opts){
			$base(opts);

			this.loadCss('GridView.css');

            this.table = new Table({
                table: {
                    readOnly: true,

                    manualRowMove: false
                },
                callbacks: {
                    createHeader: function(i) { debugger; return i + 1; },
                    preLoader: function(rowCount){ $this.preLoader(rowCount); }
                }
            });
            this.append($this.table);

/*
			JSB().defer(function(){
                $this.table = new Table({
                    table: {
                        //data: [['kino']]
                    },
                    callbacks: {
                        createHeader: function() {},
                        preLoader: function(){ $this.preLoader(); }
                    }
                });
                $this.append($this.table);
			}, 1500);
			*/
		},

		preLoader: function(rowCount){

		}
	}
}