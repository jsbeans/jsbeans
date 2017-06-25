{
	$name: 'Table',
	$parent: 'JSB.Widgets.Control',
	$require: ['handsontable'],
	$client: {
        _oldScroll:{
            x: 0,
            y: 0
        },

		$constructor: function(opts){
			$base(opts);

			this.table = this.$('<div></div>');
			this.append(this.table);

			this.handsontable_options = JSB().merge(this.handsontable_options, opts.table);
			this.handsontable_options.colHeaders = function(i){ return $this._createHeaderCellCallback(i); };

			this.handsontable = new Handsontable(this.table.get(0), this.handsontable_options);


			this.table.scroll(function(evt){
                var scrollHeight = evt.target.scrollHeight,
                    scrollTop = evt.target.scrollTop,
                    clientHeight = evt.target.clientHeight;

                // for content preloader
                if(scrollHeight - scrollTop <= 2 * clientHeight && JSB().isFunction($this.events.preLoad))
                    $this.preLoad(evt);

                $this._oldScroll.x = scrollLeft;
                $this._oldScroll.y = scrollTop;
            });
		},

		callbacks: {
		    createHeader: null,
		    preLoader: null
		},

		columns: [],

        handsontable_options: {
            //data: [],
            rowHeaders: true,
            colHeaders: true,
            manualColumnResize: true,
            manualRowResize: true,

            // empty table if no data
            startRows: 0,
            startCols: 0,

            // ??
            //colHeaders: function(i){ return $this._createHeaderCellCallback(i); }
        },

		options: {
		    preLoadItems: 10
		},

		addCell: function(row, col, data){
		    this.handsontable.setDataAtCell(row, col, data);
		},

		addColumn: function(alias, index){
		    this.handsontable.alter('insert_col', index);
debugger;
		    if(!index){
		        this.columns.push(alias);
		    } else {
		        this.columns.splice(index, 0, alias);
		    }
		},

		_createHeaderCellCallback: function(i){
		debugger;
		    if(JSB().isFunction(this.callbacks.createHeader)){
		        return this.callbacks.createHeader.call(i, this.columns[i]);
		    } else {
		        console.log(i + " : " + this.columns[i]);
		        return i;
		    }
		},

		preLoad: function(evt){
		    if(JSB().isFunction(this.callbacks.preLoader)){
		        var rowCount = this.handsontable.countRows();
		        this.callbacks.preLoader.call(rowCount);
		    }
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
		}
	}
}