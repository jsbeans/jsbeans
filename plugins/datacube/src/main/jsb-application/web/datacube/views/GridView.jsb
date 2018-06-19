{
	$name: 'DataCube.GridView',
	$parent: 'JSB.Widgets.Widget',
	$require: ['Handsontable', 'JQuery.UI.Loader', 'DataCube.Export.Export'],
	$client: {
	    allLoaded: false,
	    curLoadId: null,
	    curData: null,
	    params: {},

		$constructor: function(opts){
			$base(opts);
			this.addClass('gridView');
			this.loadCss('GridView.css');

            this.table = new Handsontable({
            	noDataMessage: opts && opts.noDataMessage || 'Нет данных',
                table: {
                    rowHeaders: false,
                    readOnly: false,
                    manualRowMove: false,
                    //colWidths: 300,
                    //stretchH: 'none'
                },
                callbacks: {
                    createHeader: function(i, header) { return $this.createHeader(i, header); },
                    preLoader: function(rowCount){ $this.preLoader(rowCount); }
                }
            });
            this.append($this.table);

            this.error = this.$('<div class="errorMessage hidden"></div>');
            this.error.append('<div class="errorIcon"></div><span class="errorTitle">Ошибка!</span>');
            this.errorText = this.$('<span class="errorText"></span>');
            this.error.append(this.errorText);
            this.append(this.error);
            // selected
            this.subscribe('DataCube.CubeEditor.sliceNodeSelected', function(editor, msg, slice){
                $this.updateData(slice);
            });

            this.subscribe('DataCube.CubeEditor.cubeNodeSelected', function(editor, msg, obj){
                $this.updateData(obj.cube, obj.query);
            });

            this.subscribe('DataCube.CubeEditor.providerNodeSelected', function(editor, msg, provider){
                $this.updateData(provider);
            });

            this.subscribe('DataCube.CubeEditor.sliceNodeEdit', function(editor, msg, slice){
                $this._updateData(slice);
            });

            // deselected
            this.subscribe('DataCube.CubeEditor.sliceNodeDeselected', function(editor, msg, slice){
                $this.clear();
            });

            this.subscribe('DataCube.CubeEditor.cubeNodeDeselected', function(editor, msg, slice){
                $this.clear();
            });

            this.subscribe('DataCube.CubeEditor.providerNodeDeselected', function(editor, msg, slice){
                $this.clear();
            });
		},

		clear: function(){
		    this.error.addClass('hidden');
            this.table.clear();
            // this.server().clearIterator();
            // this.curData = null;
            // this.curLoadId = null;
            // this.params = {};
            // this.allLoaded = false;
		},

		// get column number; return header cell content
		createHeader: function(i, header){
		    if(!header) return i + 1;

		    var cssClass = "btnSort upSort";

		    if(this.curSortCol && this.curSortCol.column === i) cssClass = this.curSortCol.direction === 1 ? "btnSort downSort" : "btnSort upSort";

		    var sortButton = `#dot <div
                                        jsb="JSB.Widgets.Button"
                                        class="{{=cssClass}}"
                                        onclick="{{=$this.callbackAttr(function(evt){ $this.sortButtonClick(evt, { column: i, header: header }); })}}" >
                                    </div>`;
		    return '<div>' + header + sortButton + '</div>';
		},

		exportData: function(key, fileName, callback){
		    this.server().loadExportData(function(res){
		        callback.call();
		        if(res.error){
		            return;
		        }

                Export.exportData(key, res.result, fileName);
		    });
		},
		
		// get number of lines
		preLoader: function(rowCount){
		    if(this.allLoaded) return;

//		    $this.getElement().loader();
            this.curLoadId = JSB().generateUid();
            var storedLoadId = this.curLoadId;
            $this.server().loadMore(function(res){
                if(storedLoadId !== $this.curLoadId) return;

//                $this.getElement().loader('hide');

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

		sortButtonClick: function(evt, obj){
		    if(this.$(evt.target).hasClass('upSort')){
		        this.$(evt.target).removeClass('upSort').addClass('downSort');

		        var q = {
		            $sort: [{}]
		        };
		        q.$sort[0][obj.header] = 1;

                this.curData.query = JSB().merge(this.curData.query, q);
                this.curSortCol = {
                    column: obj.column,
                    direction: 1
                };
		    } else {
		        this.$(evt.target).removeClass('downSort').addClass('upSort');

                var q = {
                    $sort: [{}]
                };
                q.$sort[0][obj.header] = -1;

                this.curData.query = JSB().merge(this.curData.query, q);
                this.curSortCol = {
                    column: obj.column,
                    direction: -1
                };
		    }

            this._updateData(this.curData, true);
		},
		
		updateData: function(source, query){
			if(JSB.isInstanceOf(source, 'DataCube.Model.Slice')){
			    this._updateData({
			    	cube: source.getCube(),
			    	query: query || source.getQuery(),
			    	slice: source,
			    	type: 'slice'
			    });
			} else if(JSB.isInstanceOf(source, 'DataCube.Providers.DataProvider')){
			    this._updateData({
			        cube: source.cube,
			        provider: source,
                    query: query,
                    type: 'dataProvider'
			    });
			} else if(JSB.isInstanceOf(source, 'DataCube.Model.Cube')){
            	this._updateData({
                    cube: source,
                    query: query,
                    type: 'cube'
            	});
			} else {
				throw new Error('Unsupported node type: ' + source.getJsb().$name);
			}
		},

		_updateData: function(source, isSort){
		    if(this.curData === source && !isSort) return;

            this.error.addClass('hidden');

            this.curData = source;

            $this.getElement().loader();
            var preparedQuery = source.query;
            this.curLoadId = JSB().generateUid();
            var storedLoadId = this.curLoadId;
            
            var qObj = { 
            	cube: source.cube, 
            	query: preparedQuery, 
            	queryParams: source.queryParams, 
            	provider: source.provider, 
            	type: source.type 
            };
            
            if(source.type == 'slice'){
            	qObj.slice = source.slice;
            }

            $this.server().loadData( qObj, function(res){
                if(storedLoadId !== $this.curLoadId) return;

                $this.getElement().loader('hide');
                if(!res) return;
                if(res.error){
                    $this.errorText.text(res.error.message);
                    $this.error.removeClass('hidden');
                    return;
                }

                if(res.result.length !== 0) {
                    $this.table.loadData(res.result);
                    
                    if(!res.allLoaded && $this.table.getElement().height() >= $this.table.getElement().find('.ht_master.handsontable > div.wtHolder').height()){
                        $this.preLoader($this.table.getRowCount());
                    }
                    
                } else {
                    $this.table.loadData(null);
                }

                $this.allLoaded = res.allLoaded;
            });
		}
	},

	$server: {
	    it: null,
	    exportQuery: null,
	    
	    destroy: function(){
	    	this.clearIterator();
	    	$base();
	    },
	    
	    clearIterator: function(){
	    	if(this.it) {
	    		try {
	    			this.it.close();
	    		} catch(e){}
	    		this.it = null;
	    	}
	    },

	    loadData: function(obj) {
            try{
            	this.clearIterator();

                switch(obj.type){
                    case 'cube':
                        if(!obj.query.$select){
                            var fields = obj.cube.getFields();
                            var q = {};
                            for(var i in fields){
                                q[i] = i;
                            }
                            obj.query = JSB.merge(obj.query, {
                                $select: q
                            });
                        }
                        this.it = obj.cube.executeQuery(obj.query, obj.queryParams, obj.provider, true);
                        break;
                    case 'dataProvider':
                        var fields = obj.provider.extractFields();
                        var q = {};
                        for(var i in fields){
                            q[i] = i;
                        }
                        obj.query = JSB.merge(obj.query, {
                            $select: q
                        });
                        this.it = obj.cube.executeQuery(obj.query, obj.queryParams, obj.provider, true);
                        break;
                    case 'slice':
                    	if(JSB.isEqual(obj.query, obj.slice.getQuery())){
                    		this.it = obj.slice.executeQuery({useCache: true});
                    	} else {
                    		this.it = obj.cube.executeQuery(obj.query, obj.queryParams, obj.provider, true);
                    	}
                        break;
                    default:
                    	throw new Error('DataCube.GridView.loadData error: unknown type "' + obj.type + '"');
                }

                this.exportObj = obj;

                this.counter = 0;

                return this.loadMore();
            } catch(e){
            	this.clearIterator();
                JSB().getLogger().error(e);

                return {
                    result: null,
                    allLoaded: true,
                    error: e
                }
            }
	    },

	    loadMore: function(){
            try{
                var res = [],
                    max = this.counter + 20,
                    allLoaded = false;

                while(this.counter < max && this.it){
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
                    allLoaded: allLoaded,
                    error: null
                };
            } catch(e){
            	this.clearIterator();
                JSB().getLogger().error(e);

                return {
                    result: null,
                    allLoaded: true,
                    error: e
                }
            }
	    },

	    loadExportData: function(){
	        function createArrEl(el){
                var e = [];

                for(var i in el){
                    e.push(el[i]);
                }

                return e;
	        }
	        
	        var it = null;

            try{
                it = this.exportObj.cube.executeQuery(this.exportObj.query, this.exportObj.queryParams, this.exportObj.provider);

                var res = [];

                var el = it.next();
                res.push(Object.keys(el));
                res.push(createArrEl(el));

                while(true){
                    var el = it.next();

                    if(!el) {
                        break;
                    }

                    res.push(createArrEl(el));
                }

                return {
                    result: res,
                    error: null
                };
            } catch(e){
                JSB().getLogger().error(e);

                return {
                    result: null,
                    error: e
                }
            } finally {
            	if(it){
            		try {
            			it.close();
            		} catch(e){}
            	}
            }
	    }
	}
}