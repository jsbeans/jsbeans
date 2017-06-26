{
	$name: 'JSB.DataCube.GridView',
	$parent: 'JSB.Widgets.Widget',
	$require: ['Handsontable'],
	$client: {
		$constructor: function(opts){
			$base(opts);

			this.loadCss('GridView.css');

            this.table = new Handsontable({
                table: {
                    readOnly: true,

                    manualRowMove: false
                },
                callbacks: {
                    createHeader: function(i) { return $this.createHeader(i); },
                    preLoader: function(rowCount){ $this.preLoader(rowCount); }
                }
            });
            this.append($this.table);
		},

		// get column number; return header cell content
		createHeader: function(i){
		    return i + 1;
		},

		// get number of lines
		preLoader: function(rowCount){

		}
	}
}