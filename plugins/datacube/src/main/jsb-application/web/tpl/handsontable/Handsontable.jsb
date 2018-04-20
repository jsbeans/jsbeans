{
	$name: 'Handsontable',
	$parent: 'JSB.Widgets.Control',
	$require: ['JsonView'],
	$client: {
        _oldScroll:{
            y: 0
        },
        
        data: [],

		$constructor: function(opts){
			$base(opts);

			this.loadCss('Handsontable.jsb.css');
			this.addClass('tableControl');

            this.noData = this.$('<div class="noData hidden"></div>').text((opts && opts.noDataMessage)||'Нет данных');
            this.append(this.noData);

			this.table = this.$('<div></div>');
			this.append(this.table);

            //callbacks
            this.callbacks = opts.callbacks;

			this.handsontable_options = JSB().merge(this.handsontable_options, opts.table);

			if(this.callbacks.createHeader) // if undefined will set default header
			    this.handsontable_options.colHeaders = function(i){ return $this._createHeaderCellCallback(i); };

            this.loadCss('handsontable.min.css');
            this.loadScript('handsontable.min.js', function(){    //tpl/handsontable/handsontable.min.js
                // custom render for all cells
                function customRenderer(hotInstance, td, row, column, prop, value, cellProperties){
                    // include default renderer
                    Handsontable.renderers.BaseRenderer.apply(this, arguments);

                    $this.customRenderer(hotInstance, td, row, column, prop, value, cellProperties);
                }
                Handsontable.renderers.registerRenderer('customRenderer', customRenderer);

                $this.handsontable = new Handsontable($this.table.get(0), this.handsontable_options);

                $this.table.resize(function(){
                	$this.deferredRender();
                });

                $this.options.isInit = true;

                $this.find('.ht_master.handsontable > div.wtHolder').scroll(function(evt){
                    var scrollHeight = evt.target.scrollHeight,
                      scrollTop = evt.target.scrollTop,
                      clientHeight = evt.target.clientHeight;

                    // for content preloader
                    if(scrollTop !== 0 && scrollTop > $this._oldScroll.y && scrollHeight - scrollTop <= 2 * clientHeight){
                        $this.preLoad(evt);
                    }

                    $this._oldScroll.y = scrollTop;
                });
            });
		},

		callbacks: {
		    // createHeader: null,
		    // preLoader: null
		},

		columns: [],
		dataUpdate: {},

        handsontable_options: {
            rowHeaders: true,
            colHeaders: true,

            manualColumnResize: true,
            manualRowResize: true,

            manualColumnMove: true,
            manualRowMove: true,

            autoRowSize: true,

            // empty table if no data
            startRows: 10,
            startCols: 10,

            renderAllRows: true,
            contextMenu: false,

            allowEmpty: true,

            stretchH: 'all',    // "last" or "all" or "none",
/*
            cells: function (row, col, prop) {
                return {
                    allowHtml: true,
                    allowEmpty: true,
                    renderer: "customRenderer"
                };
            }*/
        },

		options: {
		    isInit: false,
		    preLoadItems: 10
		},
		
		deferredRender: function(){
            JSB().defer(function(){
                $this.handsontable.render();
            }, 300, 'handsontable.deferredRender.' + $this.getId())
		},

		addCell: function(row, col, data){
		    this.handsontable.setDataAtCell(row, col, data);
		},

		// change this.columns mechanism
/*
		addColumn: function(alias, index){
		    this.handsontable.alter('insert_col', index);

		    if(!index){
		        this.columns.push(alias);
		    } else {
		        this.columns.splice(index, 0, alias);
		    }
		},
*/
		addRow: function(row, input){
			input = this.prepareData(input);
			this.data.splice(row, 0, input);
			this.columns = this.prepareColumns(this.data);
			this.handsontable.updateSettings(JSB.merge({}, this.handsontable_options, {data:this.data, columns: this.columns}));
		    this.deferredRender();
/*		    
		    this.handsontable.alter('insert_row', row);
		    for(var j = 0; j < input.length; j++){
                this.handsontable.setDataAtCell(row, j, input[j]);
            }
*/            
		},

		addArray: function(row, input){
/*			
		    if(JSB().isArray(input)) this.data = this.data.concat(JSB().clone(input));
            if(JSB().isObject(input)) this.data = Object.assign(this.data, JSB().clone(input));
*/
		    input = this.prepareData(input);
		    for(var i = 0; i < input.length; i++){
		    	this.data.splice(row + i, 0, input[i]);
		    }
		    this.columns = this.prepareColumns(this.data);
		    this.handsontable.updateSettings(JSB.merge({}, this.handsontable_options, {data:this.data, columns: this.columns}));
		    this.deferredRender();
/*
            this.handsontable.alter('insert_row', row, input.length);

            for(var i = 0; i < input.length; i++){
                for(var j = 0; j < input[i].length; j++){
                    this.handsontable.setDataAtCell(row + i, j, input[i][j]);
                }
            }
*/            
		},

		_createHeaderCellCallback: function(i){
            return this.callbacks.createHeader.call(this, i, this.columns[i].data);
		},

		clear: function(){
            if(this.handsontable) this.handsontable.loadData([[], [], [], [], []]);
            this.noData.removeClass('hidden');
            this.table.addClass('hidden');
		},

		customRenderer: function(hotInstance, td, row, column, prop, value, cellProperties){
		    if(!this.data || !this.data[row]) return td;
		    if(typeof prop === 'number') return td;

//		    var val = this.data[row][prop];
		    var val = value;

            // empty object or array
            if((JSB.isObject(val) && Object.keys(val).length === 0) || (JSB.isArray(val) && val.length === 0)){
            	$this.$(td).empty();
            	$this.$(td).append('<div class="tableCell"> </div>');
                return td;
            }

            // object or array
            if(JSB.isObject(val) || JSB.isArray(val)){
            	JSB.lookup('JsonView', function(jvcls){
            		var jvInst = new jvcls({collapsed:true});
            		jvInst.setData(val);
            		$this.$(td).empty();
            		$this.$(td).append(jvInst.getElement());
/*            		
            		jvInst.getElement().resize(function(){
            			$this.deferredRender();
            		});
*/            		
            	});
                return td;
            }

            // basic types
            $this.$(td).empty();
            $this.$(td).append($this.$('<div class="tableCell"></div>').text(val));
            return td;
		},

		getColumnCount: function(){
		    return this.handsontable.countCols();
		},

		getRowCount: function(){
		    return this.handsontable.countRows();
		},

		isInit: function(){
		    return this.options.isInit;
		},
		
		detectType: function(val){
			if(!JSB.isDefined(val)){
				return 'undefined';
			}
			if(JSB.isNull(val)){
				return 'null';
			}
			if(JSB.isNumber(val)){
				return 'number';
			}
			if(JSB.isString(val)){
				return 'string';
			}
			if(JSB.isObject(val)){
				return 'object';
			}
			if(JSB.isArray(val)){
				return 'array';
			}
			if(JSB.isBoolean(val)){
				return 'boolean';
			}
			if(JSB.isDate(val)){
				return 'datetime';
			}
			return 'undefined';
		},
		
		prepareColumns: function(data){
			var cols = [];
			var colMap = {};
			for(var i = 0; i < data.length; i++){
				var row = data[i];
				var idx = 0;
				for(var f in row){
					var val = row[f];
					var type = this.detectType(val);
					if(!colMap[f]){
						var colDesc = {data: f, readOnly:true, copyable:true};
						switch(type){
						case 'number':
//							colDesc.type = 'numeric';
							break;
						case 'boolean':
							colDesc.type = 'checkbox';
							break;
						case 'datetime':
							colDesc.type = 'date';
							break;
						case 'object':
						case 'array':
							colDesc.renderer = 'customRenderer';
							break;
						}
						cols.splice(idx, 0, colDesc);
						colMap[f] = true;
					}
					idx++;
				}
			}
			return cols;
		},

		loadData: function(data){
		    if(!data){
                this.noData.removeClass('hidden');
                this.table.addClass('hidden');
                return;
		    }
		    this.noData.addClass('hidden');
		    this.table.removeClass('hidden');
		    
		    this.data = JSB().clone(this.prepareData(data));
		    this.columns = this.prepareColumns(this.data);
		    
		    this.handsontable.updateSettings(JSB.merge({}, this.handsontable_options, {data:this.data, columns: this.columns}));
		    this.deferredRender();
		},

		preLoad: function(evt){
		    JSB().defer(function(){
                if(JSB().isFunction($this.callbacks.preLoader)){
                    var rowCount = $this.handsontable.countRows();
                    $this.callbacks.preLoader.call($this, rowCount);
                }
		    }, 300, 'Handsontable.scroll_' + this.getId());
		},

		render: function(){
            this.handsontable.render();
		},

		removeColByIndex: function(indexes){
		    if(!JSB().isArray(indexes)) indexes = [indexes];

		    for(var i in indexes){
		        this.handsontable.alter('remove_col', indexes[i]);
		        delete this.columns[i];
		    }

		    this.columns = this.columns.filter(function(){el
		        return el !== undefined;
		    });
		},

		removeColByName: function(alias){
            if(!JSB().isArray(alias)) alias = [alias];

            for(var i in alias){
                var index = this.columns.indexOf(alias[i]);
                if(index < 0) continue;

                this.handsontable.alter('remove_col', index);
                delete this.columns[index];
            }

            this.columns = this.columns.filter(function(){el
                return el !== undefined;
            });
		},

		removeRow: function(indexes){
            if(!JSB().isArray(indexes)) indexes = [indexes];

            for(var i in indexes)
                this.handsontable.alter('remove_row', indexes[i]);
		},

		// utils
		prepareData: function(data){
		    for(var i in data){
		        for(var j in data[i]){
                    // empty object or array
                    if((JSB.isObject(data[i][j]) && Object.keys(data[i][j]).length === 0) || (JSB.isArray(data[i][j]) && data[i][j].length === 0)){
                        data[i][j] = " ";
                        continue;
                    }

                    if(JSB.isDate(data[i][j])){
                        data[i][j] = data[i][j].toString();
                        continue;
                    }

                    // object or array
                    /*
                    if(JSB.isObject(data[i][j]) || JSB.isArray(data[i][j])){
                        data[i][j] = null;
                    }
                    */
		        }
		    }

		    return data;
		}
	}
}