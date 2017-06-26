{
	$name: 'TableTest',
	$parent: 'JSB.Widgets.Widget',
	$require: ['Table', 'JSB.Widgets.Button'],
	$client: {
		$constructor: function(opts){
			$base(opts);

			this.loadCss('tableTest.css');

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

                //$this.table.addColumn('test');

                var editBtn = new Button({
                                caption: 'Добавить',
                                onClick: function(evt){
                                    $this.table.addColumn('test');
                                    $this.table.render();
                                }
                            });
                $this.append(editBtn);
			}, 1500);
		},

		preLoader: function(){

		}
	}
}