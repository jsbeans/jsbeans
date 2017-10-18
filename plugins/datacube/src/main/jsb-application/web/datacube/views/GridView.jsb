{
	$name: 'DataCube.GridView',
	$parent: 'JSB.Widgets.Widget',
	$require: ['Handsontable', 'JQuery.UI.Loader'],
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
            	noDataMessage: 'Выберите объект на диаграмме',
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

            if(!source.query) return;

            this.curLoadId = JSB().generateUid();
            this.curData = source;

            $this.getElement().loader();
            var preparedQuery = source.query;

            $this.server().loadData( { cube: source.cube, query: preparedQuery, queryParams: source.queryParams, provider: source.provider, id: this.curLoadId, type: source.type }, function(res){
                if(res.id !== $this.curLoadId) return;

                $this.getElement().loader('hide');

                if(!res) return;
                if(res.error){
                    $this.errorText.text(res.error.message);
                    $this.error.removeClass('hidden');
                    return;
                }

                if(res.result.length !== 0) {
                    $this.table.loadData(res.result);
                } else {
                    $this.table.loadData(null);
                }

                $this.allLoaded = res.allLoaded;
            });
		}
	},

	$server: {
	    it: null,

	    loadData: function(obj) {
            try{
                if(this.it) this.it.close();

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
                        break;
                    case 'slice':
                        break;
                }

                this.it = obj.cube.executeQuery(obj.query, obj.queryParams, obj.provider);
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
                    //res.push(prepareElement(el));
                    res.push(el);
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