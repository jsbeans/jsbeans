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
            
            this.subscribe('DataCube.CubeEditor.sliceNodeSelected', function(editor, msg, slice){
            	JSB.defer(function(){
            		$this.updateData(slice);
            	}, 300, 'updateData_' + $this.getId());
            });
            
            this.subscribe('DataCube.CubeEditor.providerNodeSelected', function(editor, msg, provider){
            	JSB.defer(function(){
            		$this.updateData(provider);
            	}, 300, 'updateData_' + $this.getId());
            });
		},

		// get column number; return header cell content
		createHeader: function(i){
		    return i + 1;
		},

		// get number of lines
		preLoader: function(rowCount){

		},
		
		updateData: function(source){
			if(JSB.isInstanceOf(source, 'JSB.DataCube.Model.Slice')){
				// update data from slice
            	debugger;

			} else if(JSB.isInstanceOf(source, 'JSB.DataCube.Providers.DataProvider')){
				// update data from provider
            	debugger;

			} else {
				throw new Error('Unsupported node type: ' + source.getJsb().$name);
			}
		}
	}
}