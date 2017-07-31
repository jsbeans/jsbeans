{
	$name: 'Handsontable',
	$parent: 'JSB.Widgets.Control',
	$require: ['JsonView'],
	$client: {
        _oldScroll:{
            y: 0
        },

		$constructor: function(opts){
			$base(opts);

			this.loadCss('Handsontable.jsb.css');
			this.addClass('tableControl');

            this.noData = this.$('<div class="noData hidden">Нет данных</div>');
            this.append(this.noData);

			this.table = this.$('<div></div>');
			this.append(this.table);

            //callbacks
            this.callbacks = opts.callbacks;

			this.handsontable_options = JSB().merge(this.handsontable_options, opts.table);

			if(this.callbacks.createHeader) // if undefined will set default header
			    this.handsontable_options.colHeaders = function(i){ return $this._createHeaderCellCallback(i); };

            JSB().loadCss('tpl/handsontable/handsontable.min.css');
            JSB().loadScript('tpl/handsontable/handsontable.js', function(){
                // custom render for all cells
                function customRenderer(hotInstance, td, row, column, prop, value, cellProperties){
                    // include default renderer
                    Handsontable.renderers.BaseRenderer.apply(this, arguments);

                    $this.customRenderer(hotInstance, td, row, column, prop, value, cellProperties);
                }
                Handsontable.renderers.registerRenderer('customRenderer', customRenderer);

                $this.handsontable = new Handsontable($this.table.get(0), $this.handsontable_options);

                $this.table.resize(function(){
                    JSB().defer(function(){
                        $this.handsontable.render();
                    }, 300, 'handsontable.resize')
                });

                $this.options.isInit = true;

                $this.find('.ht_master.handsontable > div.wtHolder').scroll(function(evt){
                    var scrollHeight = evt.target.scrollHeight,
                      scrollTop = evt.target.scrollTop,
                      clientHeight = evt.target.clientHeight;

                    // for content preloader
                    if(scrollTop !== 0 && scrollHeight - scrollTop <= 2 * clientHeight)
                      $this.preLoad(evt);

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

            allowEmpty: true,

            stretchH: 'all',    // "last" or "all" or "none",

            cells: function (row, col, prop) {
                return {
                    allowHtml: true,
                    allowEmpty: true,
                    renderer: "customRenderer"
                };
            }
        },

		options: {
		    isInit: false,
		    preLoadItems: 10
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
		    this.handsontable.alter('insert_row', row);
		    for(var j = 0; j < input.length; j++){
                this.handsontable.setDataAtCell(row, j, input[j]);
            }
		},

		addArray: function(row, input){
		    if(JSB().isArray(input)) this.data = this.data.concat(JSB().clone(input));
            if(JSB().isObject(input)) this.data = Object.assign(this.data, JSB().clone(input));

		    input = this.prepareData(input);

            this.handsontable.alter('insert_row', row, input.length);

            for(var i = 0; i < input.length; i++){
                for(var j = 0; j < input[i].length; j++){
                    this.handsontable.setDataAtCell(row + i, j, input[i][j]);
                }
            }
		},

		_createHeaderCellCallback: function(i){
            return this.callbacks.createHeader.call(this, i, this.columns[i]);
		},

		customRenderer: function(hotInstance, td, row, column, prop, value, cellProperties){
		    if(!this.data) return td;
		    if(typeof prop === 'number') return td;

		    var val = this.data[row][prop];

		    // if(prop == 'meta') debugger;

            // empty object or array
            if((JSB.isObject(val) && Object.keys(val).length === 0) || (JSB.isArray(val) && val.length === 0)){
                td.innerHTML = '<div class="tableCell"> </div>';
                return td;
            }

            // object or array
            if(JSB.isObject(val) || JSB.isArray(val)){
                td.innerHTML = `#dot <div jsb="JsonView" collapsed="true"></div>`;

                JSB().deferUntil(function(){
                    var bean = $this.$(td.innerHTML).jsb();
                    if(!bean) return;
                    bean.setData(val);
                }, function(){
                    return $this.isContentReady();
                });

                return td;
            }

            // basic types
            td.innerHTML = '<div class="tableCell">' + val + '</div>';
            return td;
		},

		isInit: function(){
		    return this.options.isInit;
		},

		loadData: function(data){
		    if(!data){
                this.noData.removeClass('hidden');
                this.table.addClass('hidden');
                return;
		    }
		    this.noData.addClass('hidden');
		    this.table.removeClass('hidden');

		    this.data = JSB().clone(data);
		    data = this.prepareData(data);

		    this.columns = Object.keys(data[0]);

		    this.handsontable.loadData(data);
		    this.handsontable.loadData(data);
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

                    // object or array
                    if(JSB.isObject(data[i][j]) || JSB.isArray(data[i][j])){
                        data[i][j] = null;
                    }
		        }
		    }

		    return data;
		}
	}
}