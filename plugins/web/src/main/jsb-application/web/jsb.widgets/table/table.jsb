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

			var options = {
                rowHeaders: true,
                colHeaders: true,
                manualColumnResize: true,
                manualRowResize: true,

                //colHeaders: function(i, c){ debugger; }
			};

			this.handsontable = new Handsontable(this.table.get(0), options);

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

		options: {
		    preLoadItems: 10
		},

		addCell: function(row, col, data){
		    this.handsontable.setDataAtCell(row, col, data);
		},

		addColumn: function(alias, index){
		    this.handsontable.alter('insert_col', index);
		},

		preLoad: function(evt){
		    debugger;
		},

		removeCol: function(indexes){
		    if(!JSB().isArray(indexes)) indexes = [indexes];

		    for(var i in indexes)
		        this.handsontable.alter('remove_col', indexes[i]);
		},

		removeRow: function(indexes){
            if(!JSB().isArray(indexes)) indexes = [indexes];

            for(var i in indexes)
                this.handsontable.alter('remove_row', indexes[i]);
		}
	}
}