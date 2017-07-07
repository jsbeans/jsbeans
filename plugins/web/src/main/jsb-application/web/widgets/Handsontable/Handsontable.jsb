{
	$name: 'Handsontable',
	$parent: 'JSB.Widgets.Control',
	$client: {
        _oldScroll:{
            y: 0
        },

		$constructor: function(opts){
			$base(opts);

			this.loadCss('Handsontable.css');
			this.addClass('tableControl');

			this.table = this.$('<div></div>');
			this.append(this.table);

            //callbacks
            this.callbacks = opts.callbacks;

			this.handsontable_options = JSB().merge(this.handsontable_options, opts.table);

			if(this.callbacks.createHeader) // if undefined will set default header
			    this.handsontable_options.colHeaders = function(i){ return $this._createHeaderCellCallback(i); };

            JSB().loadCss('tpl/handsontable/handsontable.min.css');
            JSB().loadScript('tpl/handsontable/handsontable.js', function(){
                $this.handsontable = new Handsontable($this.table.get(0), $this.handsontable_options);

                // hooks
                $this.handsontable.addHook('afterColumnMove', function(columns, target){ $this._afterColumnMove(columns, target); });

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

        handsontable_options: {
            //data: [[]],
            rowHeaders: true,
            colHeaders: true,

            manualColumnResize: true,
            manualRowResize: true,

            manualColumnMove: true,
            manualRowMove: true,

            // empty table if no data
            startRows: 10,
            startCols: 10,

            renderAllRows: true,

            stretchH: 'all',    // "last" or "all" or "none"
        },

		options: {
		    isInit: false,
		    preLoadItems: 10
		},

		addCell: function(row, col, data){
		    this.handsontable.setDataAtCell(row, col, data);
		},

		addColumn: function(alias, index){
		    this.handsontable.alter('insert_col', index);

		    if(!index){
		        this.columns.push(alias);
		    } else {
		        this.columns.splice(index, 0, alias);
		    }
		},

		addRow: function(row, input){
		    this.handsontable.alter('insert_row', row);
		    for(var j = 0; j < input.length; j++){
                this.handsontable.setDataAtCell(row, j, input[j]);
            }
		},

		addArray: function(row, input){
            if(!JSB().isArray(input[0])){
                input = this.restructArray(input);
            }

            this.handsontable.alter('insert_row', row, input.length);
            for(var i = 0; i < input.length; i++){
                for(var j = 0; j < input[i].length; j++){
                    this.handsontable.setDataAtCell(row + i, j, input[i][j]);
                }
            }
		},

		_createHeaderCellCallback: function(i){
		    if(JSB().isFunction(this.callbacks.createHeader)){
		        return this.callbacks.createHeader.call(this, i, this.columns[i]);
		    } else {
		        return i + 1;
		    }
		},

		isInit: function(){
		    return this.options.isInit;
		},

		loadData: function(data){
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

		// hooks
		_afterColumnMove: function(columns, target){
		    this.columns = this.columns.splice(target, 0, this.columns.slice(columns[0], columns.length));
		},

		// utils
		restructArray: function(arr){
		    var newArr = [];

		    for(var i in arr){
		        newArr.push([]);
		        for(var j in arr[i]){
		            newArr[i].push(arr[i][j]);
		        }
		    }

		    return newArr;
		}
	}
}