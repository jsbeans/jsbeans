{
	$name: 'JSB.DataCube.GridView',
	$parent: 'JSB.Widgets.Widget',
	$require: ['Handsontable'],
	$client: {
	    allLoaded: false,
	    header: null,

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

            this.subscribe('DataCube.CubeEditor.cubeNodeSelected', function(editor, msg, cube){
            	JSB.defer(function(){
            		$this.updateData(cube);
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
		    if(this.header) return this.header[i];
		    return i + 1;
		},

		// get number of lines
		preLoader: function(rowCount){
		    if(this.allLoaded) return;

		    $this.getElement().loader();
            $this.server().loadMore(function(res){
                $this.getElement().loader('hide');

                if(!res) return;

                $this.table.addArray(rowCount, res.result);

                $this.allLoaded = res.allLoaded;
            });
		},
		
		updateData: function(source){
			if(JSB.isInstanceOf(source, 'JSB.DataCube.Model.Slice')){
				// update data from slice
            	$this.getElement().loader();
            	$this.server().loadSlice(source.cube, source.query, function(res){
            	    $this.getElement().loader('hide');

            	    if(!res) return;

            	    $this.header = Object.keys(res.result[0]);

            	    $this.table.loadData(res.result);

            	    $this.allLoaded = res.allLoaded;
            	})

			} else if(JSB.isInstanceOf(source, 'JSB.DataCube.Providers.DataProvider')){
				// update data from provider
            	debugger;

			} else if(JSB.isInstanceOf(source, 'JSB.DataCube.Model.Cube')){
				// update data from cube
            	debugger;

			} else {
				throw new Error('Unsupported node type: ' + source.getJsb().$name);
			}
		}
	},

	$server: {
	    it: null,

	    loadSlice: function(cube, query){
	        this.it = cube.queryEngine.query(query);
	        this.counter = 0;

	        return this.loadMore();
	    },

	    loadData: function(cube) {

	    },

	    loadMore: function(){
	        var res = [],
	            max = this.counter + 20,
	            allLoaded = false;

	        while(this.counter < max){
	            var el = this.it.next();

	            if(!el) {
	                allLoaded = true;
	                break;
	            }

	            this.counter++;
	            res.push(el);
	        }

	        return {
	            result: res,
	            allLoaded: allLoaded
	        };
	    }
	}
}