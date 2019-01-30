{
	$name: 'DataCube.GridView',
	$parent: 'JSB.Widgets.Widget',
	$require: ['Handsontable', 
	           'JQuery.UI.Loader', 
	           'DataCube.Export.Export',
	           'css:GridView.css'],
	$client: {
	    allLoaded: false,
	    curLoadId: null,
	    curData: null,
	    params: {},

		$constructor: function(opts){
			$base(opts);
			this.addClass('gridView');

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
            this.subscribe('DataCube.CubeEditor.sliceNodeSelected', function(editor, msg, obj){
                $this.updateData(obj.entry);
            });

            this.subscribe('DataCube.CubeEditor.cubeNodeSelected', function(editor, msg, obj){
                $this.updateData(obj.cube, obj.query);
            });

            this.subscribe('DataCube.CubeEditor.dataSourceNodeSelected', function(editor, msg, obj){
                $this.updateData(obj.source, undefined, obj.cube);
            });

            this.subscribe('DataCube.CubeEditor.sliceNodeEdit', function(editor, msg, slice){
                $this.updateData(slice);
            });

            // deselected
            this.subscribe('DataCube.CubeEditor.sliceNodeDeselected', function(editor, msg, obj){
                $this.clear();
            });

            this.subscribe('DataCube.CubeEditor.cubeNodeDeselected', function(editor, msg, obj){
                $this.clear();
            });

            this.subscribe('DataCube.CubeEditor.dataSourceNodeDeselected', function(editor, msg, obj){
                $this.clear();
            });

            // update
            this.subscribe('DataCube.CubeEditor.sliceUpdated', function(editor, msg, obj){
                $this.updateData(obj.slice, obj.query);
            });
		},

		clear: function(){
            if(!this.getElement().is(':visible')){
                return;
            }

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

		exportData: function(key, name, callback){
			this.server().doExport(key, name, function(dh, fail){
				callback.call();
				if(dh){
					dh.download();
				}
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
		
		updateData: function(source, query, cube){
            if(!this.getElement().is(':visible')){
                return;
            }

			if(JSB.isInstanceOf(source, 'DataCube.Model.QueryableEntry')){
			    this._updateData({
			    	type: 'queryable',
			    	source: source,
			    	query: query || {}
			    });
			} else if(JSB.isInstanceOf(source, 'DataCube.Model.DatabaseTable')){
			    this._updateData({
			        cube: cube,
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
            
            if(source.type == 'queryable'){
            	qObj.source = source.source;
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
		$require: ['DataCube.Export.ExportManager',
		           'JSB.Web.Download'],
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
                            var fields = obj.cube.extractFields();
                            var q = {};
                            for(var i in fields){
                                q[i] = i;
                            }
                            obj.query = JSB.merge(obj.query, {
                                $select: q
                            });
                        }
                        this.it = obj.cube.executeQuery(obj.query, obj.queryParams, true);
                        break;
                    case 'dataProvider':
                        var fields = obj.provider.extractFields();

                        this.it = obj.cube.executeQuery(obj.provider.createQuery(), obj.queryParams, true);
                        break;
                    case 'queryable':
                    	var qDesc = {
                    		useCache: false,
                    	};
                    	if(Object.keys(obj.query).length > 0){
                    		qDesc.extQuery = obj.query;
                    	}
                    	this.it = obj.source.executeQuery(qDesc);
                    	break;
/*                    case 'slice':
                    	if(JSB.isEqual(obj.query, obj.slice.getQuery())){
                    		this.it = obj.slice.executeQuery({useCache: false});
                    	} else {
                    		this.it = obj.cube.executeQuery(obj.query, obj.queryParams, true);
                    	}
                        break;*/
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
	    
	    doExport: function(format, name){
	    	var fileName = ExportManager.getExportFileName(format, name);
			var ct = ExportManager.getContentType(format);
			var mode = ExportManager.getContentMode(format);
			var encoding = ExportManager.getEncoding(format);
			var dh = new Download(fileName, {mode: mode, contentType: ct, encoding: encoding}, function(stream){
				var exporter = ExportManager.createExporter(format, stream, {name: name, file: fileName});
				// write into download stream
				try {
					exporter.iterate($this.exportObj.cube.executeQuery($this.exportObj.query, $this.exportObj.queryParams, $this.exportObj.provider));
				} finally {
					exporter.destroy();
				}
			});
			
			return dh;
	    }

	}
}