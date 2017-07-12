{
	$name: 'JSB.DataCube.GridView',
	$parent: 'JSB.Widgets.Widget',
	$require: ['Handsontable'],
	$client: {
	    allLoaded: false,
	    header: null,
	    curLoadId: null,

		$constructor: function(opts){
			$base(opts);
			this.addClass('gridView');
			this.loadCss('GridView.css');

            this.table = new Handsontable({
                table: {
                    rowHeaders: false,
                    readOnly: true,
                    manualRowMove: false,
                    //colWidths: 300,
                    //stretchH: 'none'
                },
                callbacks: {
                    createHeader: function(i) { return $this.createHeader(i); },
                    preLoader: function(rowCount){ $this.preLoader(rowCount); }
                }
            });
            this.append($this.table);

            this.error = this.$('<div class="errorMessage hidden"></div>');
            this.error.append('<div class="errorIcon"></div><span class="errorTitle">Ошибка!</span>');
            this.errorText = this.$('<span class="errorText"></span>');
            this.error.append(this.errorText);
            this.append(this.error);
            
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

            this.subscribe('DataCube.CubeEditor.sliceNodeEdit', function(editor, msg, slice){
                JSB.defer(function(){
                    $this.updateSlice(slice);
                }, 300, 'sliceNodeEdit' + $this.getId());
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

            this.curLoadId = JSB().generateUid();
		    $this.getElement().loader();
            $this.server().loadMore(this.curLoadId, function(res){
                if(res.id !== $this.curLoadId) return;

                $this.getElement().loader('hide');

                if(!res) return;
                if(res.error){
                    $this.errorText.text(res.error.message);
                    $this.error.removeClass('hidden');
                    return;
                }

                $this.table.addArray(rowCount, res.result);

                $this.allLoaded = res.allLoaded;
            });
		},
		
		updateData: function(source){
			if(JSB.isInstanceOf(source, 'JSB.DataCube.Model.Slice')){
			    this.updateSlice(source);
			} else if(JSB.isInstanceOf(source, 'JSB.DataCube.Providers.DataProvider')){
				// update data from provider
                this.error.addClass('hidden');

                this.curLoadId = JSB().generateUid();

                $this.getElement().loader();
                $this.server().loadData({ cube: source.cube, provider: source, query: { $select: {}}, id: this.curLoadId }, function(res){
                    if(res.id !== $this.curLoadId) return;

                    $this.getElement().loader('hide');

                    if(!res) return;
                    if(res.error){
                        $this.errorText.text(res.error.message);
                        $this.error.removeClass('hidden');
                        return;
                    }

                    $this.header = Object.keys(res.result[0]);

                    $this.table.loadData(res.result);

                    $this.allLoaded = res.allLoaded;
                });
			} else if(JSB.isInstanceOf(source, 'JSB.DataCube.Model.Cube')){
				// update data from cube
            	this.updateSlice({
            	cube: source,
            	query: { $select: {}}
            	});
			} else {
				throw new Error('Unsupported node type: ' + source.getJsb().$name);
			}
		},

		updateSlice: function(source){
            // update data from slice
            this.error.addClass('hidden');

            if(!source.query) return;

            this.curLoadId = JSB().generateUid();

            $this.getElement().loader();
            var preparedQuery = source.query;
            if(!preparedQuery || Object.keys(preparedQuery).length == 0){
            	preparedQuery = { $select: {}};
            }
            $this.server().loadSlice( { cube: source.cube, query: preparedQuery, queryParams: source.queryParams, id: this.curLoadId }, function(res){
                if(res.id !== $this.curLoadId) return;

                $this.getElement().loader('hide');

                if(!res) return;
                if(res.error){
                    $this.errorText.text(res.error.message);
                    $this.error.removeClass('hidden');
                    return;
                }

                if(res.result.length !== 0) $this.header = Object.keys(res.result[0]);

                $this.table.loadData(res.result);

                $this.allLoaded = res.allLoaded;
            });
		}
	},

	$server: {
	    it: null,

	    loadSlice: function(obj){
	        try{
                if(this.it) this.it.close();

                this.it = obj.cube.queryEngine.query(obj.query, obj.queryParams);
                this.counter = 0;

                return this.loadMore(obj.id);
	        } catch(e){
	            JSB().getLogger().error(e);

	            return {
	                result: null,
                    allLoaded: true,
                    error: e,
                    id: obj.id
	            }
	        }
	    },

	    loadData: function(obj) {
            try{
                if(this.it) this.it.close();

                this.it = obj.cube.queryEngine.query(obj.query, null, obj.provider);
                this.counter = 0;

                return this.loadMore(obj.id);
            } catch(e){
                JSB().getLogger().error(e);

                return {
                    result: null,
                    allLoaded: true,
                    error: e,
                    id: obj.id
                }
            }
	    },

	    loadMore: function(id){
	    	function prepareElement(el){
	    		for(var f in el){
	    		    if(el[f] instanceof Date){
	    		        el[f] = el[f].toLocaleString();
	    		    }
	    		}
	    		return el;
	    	}

            try{
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
                    res.push(prepareElement(el));
                    // res.push(el);
                }

                return {
                    result: res,
                    allLoaded: allLoaded,
                    error: null,
                    id: id
                };
            } catch(e){
                JSB().getLogger().error(e);

                return {
                    result: null,
                     allLoaded: true,
                     error: e,
                     id: id
                }
            }
	    }
	}
}