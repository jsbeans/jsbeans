{
	$name: 'JSB.Controls.Grid',
	$parent: 'JSB.Controls.Control',

	$require: ['JsonView',
	           'jQuery.UI.Draggable',
	           'css:Grid.css'],

	$client: {
	    _dataScheme: null,

		$constructor: function(opts){
			$base(opts);

			var yPos = 0;

			this.addClass('jsb-grid');

			this._masterContainer = this.$('<div class="grid-master"></div>');
			this.append(this._masterContainer);

			this._masterTable = this.$('<table cellspacing="0" cellpadding="0"></table>');
			this._masterContainer.append(this._masterTable);

			this._topContainer = this.$('<div class="grid-top"></div>');
			this.append(this._topContainer);

			//if(this.options.colHeader){
                this._topTable = this.$('<table cellspacing="0" cellpadding="0"></table>');
                this._topContainer.append(this._topTable);
			//}

			if(this.options.resizeColumns){
			    this._colResizeHandleContainer = this.$('<div class="grid-column-resize-handles"></div>');
			    this.append(this._colResizeHandleContainer);
			}

		    if(!opts.headerRenderer){
		        this.options.headerRenderer = function(th, index){
		            return $this._defaultHeaderRenderer(th, index);
		        }
		    }

		    this._masterContainer.scroll(function(evt){
		        evt.stopPropagation();

		        // todo: только при горизонтальном скроле
		        // header
		        $this._topContainer.get(0).style.left = -evt.target.scrollLeft + 'px';
		        $this._topContainer.width($this._masterContainer.get(0).clientWidth + evt.target.scrollLeft);

		        // resize container
		        $this._colResizeHandleContainer.get(0).style.left = -evt.target.scrollLeft + 'px';
		        $this._colResizeHandleContainer.width($this._masterContainer.get(0).clientWidth + evt.target.scrollLeft);

		        // preload
		        if($this.options.preloader){
                    var scrollTop = evt.target.scrollTop,
                        scrollHeight = evt.target.scrollHeight,
                        clientHeight = evt.target.clientHeight;

                    if(scrollTop > yPos && scrollHeight - scrollTop <= 2 * clientHeight) {
                        JSB().defer(function(){
                            $this.options.preloader.call($this, evt);
                        }, 300, 'jsb-grid.preload|' + $this.getId());
                    }

                    yPos = scrollTop;
                }
		    });

		    if(!opts.cellRenderer){
		        this.options.cellRenderer = function(td, value){
		            return $this._defaultRenderer(td, value);
		        };
		    }

		    if(this.options.data){
		        this.setData(this.options.data);
		    }
        },

        options: {
            // options
            colHeader: true,
            columns: null,
            maxColWidth: 300,
            minColWidth: 100,
            noDataMessage: 'Нет данных',
            resizeColumns: true,
            //resizeRows: true, todo
            //rowHeader: true, todo
            rowClass: null,

            // renderers
            headerRenderer: null,
            // td, value, rowIndex, colIndex, rowData
            cellRenderer: null,
            rowRenderer: null,

            // callbacks
            preloader: null
        },

        addArray: function(data, rowIndex){
            var newRows = [],
                dataType = 'array';

            function createRow(rowData, rowIndex) {
                var row = $this.$('<tr class="grid-row"></tr>');

                row.addClass($this.options.rowClass);

                if($this.options.rowRenderer) {
                    $this.options.rowRenderer.call($this, row, rowData);
                }

                if($this.options.columns) {
                    for(var j = 0; j < $this.options.columns.length; j++) {
                        if(JSB.isObject($this.options.columns[j])) {
                            // todo
                        } else {
                            createCell(row, rowData[$this.options.columns[j]], rowIndex, $this.options.columns[j], rowData);
                        }
                    }
                } else {
                    if($this._dataScheme.type === 'object') {
                        for(var j in $this._dataScheme.scheme) {
                            createCell(row, rowData[$this._dataScheme.scheme[j]], rowIndex, $this._dataScheme.scheme[j], rowData);
                        }
                    } else {
                        // todo arrays
                    }
                }

                newRows.push(row);
            }

            function createCell(row, data, rowIndex, colIndex, rowData){
                var td = this.$('<td class="grid-cell"></td>');

                td.attr('colKey', colIndex);

                $this.options.cellRenderer.call($this, td, data, rowIndex, colIndex, rowData);

                row.append(td);
            }

            function createDataScheme(data) {
                if(JSB.isObject(data)) {
                    $this._dataScheme = {
                        scheme: Object.keys(data),
                        type: 'object'
                    }
                } else {
                    $this._dataScheme = {
                        type: 'array'
                    }
                }
            }

            if(JSB.isArray(data)) {  // array
                for(var i = 0; i < data.length; i++) {
                    if(!this._dataScheme){
                        createDataScheme(data[i]);
                    }

                    createRow(data[i], i);
                }
            } else {
                for(var i in data) { // object
                    if(!this._dataScheme) {
                        createDataScheme(data[i]);
                    }

                    createRow(data[i], i);
                }
            }

            if(JSB.isDefined(rowIndex)){
                // todo
                //this._masterTable.child('tr:nth-child(' + rowIndex + ')');
            } else {
                this._masterTable.append(newRows);
            }
        },

        clear: function(){
            this._dataScheme = null;

            this._masterTable.empty();

            //if(this._topTable){
                this._topTable.empty();
            //}

            if(this._colResizeHandleContainer){
                this._colResizeHandleContainer.empty();
            }
        },

        setData: function(data){
            function resizeColumnHandles(startIndex, widthDifferent, isSum){
                startIndex = startIndex || 0;

                var resizeHandles = $this._colResizeHandleContainer.children('.col-resize-handle');

                for(var i = startIndex; i < resizeHandles.length; i++){
                    if(isSum){
                        resizeHandles[i].style.left = +resizeHandles[i].style.left.replace('px', '') + (i + 1) * widthDifferent + 'px';
                    } else {
                        resizeHandles[i].style.left = +resizeHandles[i].style.left.replace('px', '') + widthDifferent + 'px';
                    }
                }
            }

            this.clear();

            if(!data || data.length == 0){
            	return;
            }
            this.addArray(data);

            var firstRow = this._masterTable.find("tr:first-child > td"),
                masterColGroup = this.$('<colgroup></colgroup>'),
                topColGroup = this.$('<colgroup></colgroup>'),
                tableWidth = 0,
                headerTR = this.$('<tr class="grid-header-row"></tr>');

            this._masterTable.prepend(masterColGroup);
            this._topTable.prepend(topColGroup);

            for(var i = 0; i < firstRow.length; i++){
                var col = this.$(firstRow[i]),
                    colWidth = col.width(),
                    colKey = col.attr('colKey'),
                    style;

                if(colWidth > this.options.maxColWidth){
                    style = this.options.maxColWidth;
                } else if(colWidth < this.options.minColWidth){
                    style = this.options.minColWidth;
                } else {
                    style = colWidth;
                }

                var col = '<col colKey="' + colKey + '" style="width: ' + Math.ceil(style) + 'px">',
                    masterCol = this.$(col),
                    topCol = this.$(col);

                tableWidth += style;

                masterColGroup.append(masterCol);
                topColGroup.append(topCol);

                if(this.options.colHeader){
                    var th = this.$('<th class="grid-header-col"></th>');

                    this.options.headerRenderer(th, colKey);

                    headerTR.append(th);
                }

                if(this.options.resizeColumns){
                    var resizeHandle = this.$('<div class="col-resize-handle"></div>');
                    this._colResizeHandleContainer.append(resizeHandle);

                    resizeHandle.get(0).style.left = tableWidth + 'px';

                    (function(resizeHandle, masterCol, topCol, index){
                        resizeHandle.draggable({
                            addClasses: false,
                            axis: 'x',
                            classes: {
                                'ui-draggable-dragging': 'active'
                            },
                            stop: function(evt, ui){
                                var widthDif = ui.position.left - ui.originalPosition.left,
                                    newColWidth = masterCol.width() + widthDif;

                                masterCol.get(0).style.width = newColWidth + 'px';
                                topCol.get(0).style.width = newColWidth + 'px';

                                resizeColumnHandles(index + 1, widthDif);
                            }
                        });
                    })(resizeHandle, masterCol, topCol, i);
                }
            }

            if(this.options.colHeader){
                this._topTable.append(headerTR);
            }

            this._updateSizes();

            var masterContainerClientWidth = this._masterContainer.get(0).clientWidth;
            if(this._masterTable.width() < masterContainerClientWidth){
                var dif = (masterContainerClientWidth - this._masterTable.width() - (this._masterTable.width() - this._masterTable.innerWidth())) / firstRow.length;

                function increaseCols(cols, dif){
                    for(var i = 0; i < cols.length; i++){
                        var col = $this.$(cols[i]);

                        col.width(col.width() + dif);
                    }
                }

                increaseCols(masterColGroup.children('col'), dif);
                increaseCols(topColGroup.children('col'), dif);

                resizeColumnHandles(0, dif, true);

                this._updateSizes();
            }

            if(this.options.preloader && this._masterTable.height() < this.getElement().height()){
                this.options.preloader.call(this);
            }
        },

        sort: function(){
            // todo
        },

        _defaultHeaderRenderer: function(th, index){
            th.append(index);
        },

        _defaultRenderer: function(td, value){
            function detectType(val){
                if(!JSB.isDefined(val)){
                    return 'undefined';
                }

                if(JSB.isNull(val)){
                    return 'null';
                }
                
                if(JSB.isString(val)){
                    return 'string';
                }

                if(JSB.isInteger(val)){
                    return 'integer';
                }

                if(JSB.isDouble(val)){
                    return 'double';
                }
                
                if(JSB.isNumber(val)){
                    return 'number';
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
                    return 'date';
                }

                return 'undefined';
            }

            var valueType = detectType(value);

            this.$(td).empty();
            this.$(td).attr('type', valueType);

            // object or array
            if(valueType === 'object' || valueType === 'array'){
                var jvInst = new JsonView({collapsed:true});

                if(valueType === 'array' && value.length > $this.options.jsonArrayLimit){
                    jvInst.setData(value.slice(0, $this.options.jsonArrayLimit));
                } else {
                    jvInst.setData(value);
                }

                this.$(td).append(jvInst.getElement());
            } else if(valueType == 'boolean'){
                this.$(td).attr('val', value);
            } else {
                this.$(td).text(String(value));
            }
        },

        _setResizeHandle: function(element, opts){
            //
        },

        _updateSizes: function(){
            this.getElement().width(this.getElement().width());

            this._topContainer.width(this._masterContainer.get(0).clientWidth);

            this._masterTable.get(0).style['margin-top'] = this._topTable.height() + 'px';

            this._colResizeHandleContainer.get(0).style['margin-top'] = -this._masterContainer.height() + 'px';

            this._colResizeHandleContainer.children('.col-resize-handle').height(this._masterContainer.get(0).clientHeight);
        }
    }
}