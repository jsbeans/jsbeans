/*
 * This file is the part of jsBeans, high-level JavaScript client-server framework.
 * The contents of this file are subject to the MIT Licence (MIT).
 * (c) aa@sis.ru, da@sis.ru, Special Information Systems, LLC, 2011-2019
 *
 * Настоящий файл является частью клиент-серверной JavaScript платформы.
 * Условия использования и распространения содержимого данного файла соответствуют программному обеспечению с открытыми исходными кодами и равнозначно MIT Licence (MIT).
 * Авторские права принадлежат aa@sis.ru, da@sis.ru, ООО СИС, 2011-2019гг.
 */

{
	$name: 'JSB.Controls.Grid',
	$parent: 'JSB.Controls.Control',

	$require: ['JsonView',
	           'jQuery.UI.Draggable',
	           'css:Grid.css'],

	$client: {
	    _dataScheme: null,
	    _masterColGroup: null,
	    _topColGroup: null,
	    _ctrlMap: {},

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

                this._topTable.resize(function() {
                	$this._updateSizes();
                });
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

		        // resize container
		        $this._colResizeHandleContainer.get(0).style.left = -evt.target.scrollLeft + 'px';
		        $this._colResizeHandleContainer.width($this._masterContainer.get(0).clientWidth + evt.target.scrollLeft);

		        $this.checkPreload();
/*		        // preload
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
                }*/
		    });

		    if(!opts.cellRenderer){
		        this.options.cellRenderer = function(td, value, rowIndex, colIndex, rowData, opts){
		            return $this._defaultRenderer(td, value, opts);
		        };
		    }

		    if(this.options.data){
		        this.setData(this.options.data);
		    }
/*		    
		    this._masterTable.resize(function(){
		    	if($this._masterTable.is(':visible')){
		    		JSB.defer(function(){
		    			$this._updateSizes();
		    		}, 300, '__masterTable_resize.' + $this.getId());
		    	}
		    });
*/
            this.getElement().resize(function() {
                $this._colResizeHandleContainer.get(0).style['margin-top'] = -$this.getElement().height() + 'px';
                $this._colResizeHandleContainer.children('.col-resize-handle').height($this.getElement().find('.grid-top').height());
            });
        },
        
        destroy: function(){
        	this.clear();
        	$base();
        },

        options: {
            // options
            colHeader: true,
            columns: null,
            fixWidth: false,
            jsonArrayLimit: 20,
            //maxColWidth: 300,
            minColWidth: 100,
            noDataMessage: 'Нет данных',
            resizeColumns: true,
            //resizeRows: true, todo
            //rowHeader: true, todo
            rowClass: null,
            stringLimit: 0,
            undefinedAsNull: true,

            // renderers
            headerRenderer: null,
            // td, value, rowIndex, colIndex, rowData
            cellRenderer: null,
            rowRenderer: null,
            columnSizePolicy: null,

            // callbacks
            preloader: null
        },
        
        _updateSizes: function(){
            $this._masterContainer.get(0).style['margin-top'] = $this._topTable.height() + 'px';
            $this._masterContainer.get(0).style['height'] = 'calc(100% - ' + $this._topTable.height() + 'px)';
        },
        
        checkPreload: function(){
        	if($this.options.preloader){
	        	var elt = this._masterContainer.get(0);
	        	var scrollTop = elt.scrollTop,
	            scrollHeight = elt.scrollHeight,
	            clientHeight = elt.clientHeight;
	
		        if(scrollHeight - scrollTop <= 2 * clientHeight) {
		            JSB().defer(function(){
		                $this.options.preloader.call($this);
		            }, 300, 'jsb-grid.preload|' + $this.getId());
		            return true;
		        }
        	}
        	return false;
        },

        addArray: function(data, rowIndex, opts){
            var newRows = [],
                dataType = 'array',
                lastRowCount = this._masterTable.find('> .grid-row').length;

            function createRow(rowData, rowIndex) {
                var row = $this.$('<tr class="grid-row"></tr>');
                row.data('data', rowData);

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
                var td = $this.$('<td class="grid-cell"></td>');

                td.attr('colKey', colIndex);

                $this.options.cellRenderer.call($this, td, data, rowIndex, colIndex, rowData, opts);

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

                $this._createHeader();
            }

            if(JSB.isArray(data)) {  // array
                /*
                if(data.length == 0) {
                    this.showNoDataMsg(true);
                    return;
                }
                */
                for(var i = 0; i < data.length; i++) {
                    if(!this._dataScheme){
                        createDataScheme(data[i]);
                    }

                    createRow(data[i], i+lastRowCount);
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

        addRow: function(rowData, rowIndex) {
            this.addArray([rowData], rowIndex);
        },

        clear: function(bKeepHeader){
        	for(var id in $this._ctrlMap){
        		$this._ctrlMap[id] && $this._ctrlMap[id].destroy();
        	}
        	$this._ctrlMap = {};
            this.showNoDataMsg(false);

            if(bKeepHeader){
            	this._masterTable.find('> .grid-row').remove();
            	return;
            }
            this._masterTable.empty();
            this._dataScheme = null;

            //if(this._topTable){
                this._topTable.empty();
            //}

            if(this._colResizeHandleContainer){
                this._colResizeHandleContainer.empty();
            }
        },

        getRowCount: function() {
            return this._masterTable.children('tr').length;
        },

        search: function(colKey, searchWord, searchFunction) {
		    if(searchWord) {
		        if(searchFunction) {
		            var notSuit = this._masterTable.find('> tr > td[colKey="' + colKey + '"]:not(:icontains("' + searchWord + '"))').closest('tr'),
		                suit = this._masterTable.find('> tr > td[colKey="' + colKey + '"]:icontains("' + searchWord + '")').closest('tr');

                    for(var i = 0; i < suit.length; i++) {
                        searchFunction.call(this, this.$(suit[i]), true);
                    }

                    for(var i = 0; i < notSuit.length; i++) {
                        searchFunction.call(this, this.$(notSuit[i]), false);
                    }
		        } else {
		            this._masterTable.find('> tr > td[colKey="' + colKey + '"]:not(:icontains("' + searchWord + '"))').closest('tr').addClass('hidden');
		            this._masterTable.find('> tr > td[colKey="' + colKey + '"]:icontains("' + searchWord + '")').closest('tr').removeClass('hidden');
                }
            } else {
		        if(searchFunction) {
		            var trs = this._masterTable.children();

                    for(var i = 0; i < trs.length; i++) {
                        searchFunction.call(this, this.$(trs[i]), true);
                    }
		        } else {
		            this._masterTable.children().removeClass('hidden');
                }
            }
        },

        setData: function(data, opts){
            this.clear(opts && opts.keepHeader);

            if(!data || data.length == 0) {
                this.showNoDataMsg(true);
            	return;
            }

            this.addArray(data, undefined, opts);

            if(this.options.preloader && this._masterTable.height() < this.getElement().height()){
                this.options.preloader.call(this);
            }
        },

        showNoDataMsg: function(isShow) {
            if(!this._noDataMessage) {
                this._noDataMessage = this.$('<div class="noDataMessage hidden"><div class="msg">' + this.options.noDataMessage + '</div></div>');
                this.append(this._noDataMessage);
            }

            if(isShow) {
                this._noDataMessage.removeClass('hidden');
            } else {
                this._noDataMessage.addClass('hidden');
            }
        },

        sort: function(colKeyOrSortFunction) {
            var tr = this._masterTable.children();

            if(JSB.isFunction(colKeyOrSortFunction)) {
                tr.sort(colKeyOrSortFunction);
            }

            if(JSB.isString(colKeyOrSortFunction)) {
                // todo
            }

            tr.detach().appendTo(this._masterTable);
        },

        _createHeader: function() {
            var masterColGroup = this.$('<colgroup></colgroup>'),
                topColGroup = this.$('<colgroup></colgroup>'),
                gridWidth = this.getElement().width(),
                headerTR = this.$('<tr class="grid-header-row"></tr>');

            // generate col sizes
            var colSizeMap = {}, totalWeight = 0, reservedSize = 0, reservedCount = 0;
            for(var i = 0; i < this._dataScheme.scheme.length; i++) {
                var colKey = this._dataScheme.scheme[i];
                var defColDesc = this._defaultColumnSizePolicy(colKey);
                var colDesc = JSB.merge(defColDesc, this.options.columnSizePolicy && this.options.columnSizePolicy.call(this, colKey) || {});
                colSizeMap[colKey] = colDesc;
                if(colDesc.size == 'auto'){
                	colDesc.colSize = null;
                } else {
                	colDesc.colSize = Math.floor(colDesc.size * gridWidth);
                	if(colDesc.maxSize && colDesc.colSize > colDesc.maxSize){
                		colDesc.colSize = colDesc.maxSize;
                	}
                	var minSize = colDesc.minSize || this.options.minColWidth;
                	if(colDesc.colSize < minSize){
                		colDesc.colSize = minSize;
                	}
                	reservedSize += colDesc.colSize;
                	reservedCount++;
                }
            }

            // generate auto col-sizes
            for(var colKey in colSizeMap){
            	var colDesc = colSizeMap[colKey];
            	if(colDesc.colSize){
            		continue;
            	}
            	var leftSize = gridWidth - reservedSize;
            	colDesc.colSize = Math.floor(leftSize / (this._dataScheme.scheme.length - reservedCount));
            	if(colDesc.maxSize && colDesc.colSize > colDesc.maxSize){
            		colDesc.colSize = colDesc.maxSize;
            	}
            	var minSize = colDesc.minSize || this.options.minColWidth;
            	if(colDesc.colSize < minSize){
            		colDesc.colSize = minSize;
            	}
            	reservedSize += colDesc.colSize;
            	reservedCount++;
            }

            this._masterTable.prepend(masterColGroup);
            this._topTable.prepend(topColGroup);

            function getColWidth(index) {
                return $this.$(masterColGroup.children()[index]).width();
            }

            function setColWidth(index, width) {
                $this.$(masterColGroup.children()[index]).width(width);
                $this.$(topColGroup.children()[index]).width(width);
            }

            var curResizePos = 0;
            for(var i = 0; i < this._dataScheme.scheme.length; i++) {
                var colKey = this._dataScheme.scheme[i],
                    col = '<col colKey="' + colKey + '" style="width: ' + colSizeMap[colKey].colSize + 'px">',
                    masterCol = this.$(col),
                    topCol = this.$(col);
                curResizePos += colSizeMap[colKey].colSize;

                masterColGroup.append(masterCol);
                topColGroup.append(topCol);

                if(this.options.colHeader){
                    var th = this.$('<th class="grid-header-col"></th>');

                    this.options.headerRenderer(th, colKey);

                    headerTR.append(th);
                }

                if(this.options.resizeColumns) {
                    if(this.options.fixWidth || i === this._dataScheme.scheme.length - 1) {
                        continue;
                    }

                    var resizeHandle = this.$('<div class="col-resize-handle"></div>');
                    this._colResizeHandleContainer.append(resizeHandle);

                    resizeHandle.get(0).style.left = curResizePos + 'px';

                    (function(index) {
                        var curLeft;

                        resizeHandle.draggable({
                            appendTo: $this.getElement(),
                            addClasses: false,
                            axis: 'x',
                            classes: {
                                'ui-draggable-dragging': 'active'
                            },
                            helper: 'clone',
                            start: function(evt, ui) {
                                var left = $this.$(this).css('left');

                                curLeft = Number(left.substr(0, left.length - 2));
                            },
                            drag: function(evt, ui) {
                                $this.$(this).css('left', curLeft + ui.position.left - ui.originalPosition.left);
                            },
                            stop: function(evt, ui) {
                                var widthDif = ui.position.left - ui.originalPosition.left;

                                if(widthDif === 0) {
                                    return;
                                }

                                if($this.options.fixWidth) {
                                    var curWidth = getColWidth(index);

                                    if(widthDif > 0) {
                                        var curDif = widthDif;

                                        for(var i = index + 1; i < masterColGroup.children().length; i++) {
                                            var curColWidth = getColWidth(i);

                                            if(curColWidth - curDif < $this.options.minColWidth) {
                                                curDif -= (curColWidth - $this.options.minColWidth);

                                                setColWidth(i, $this.options.minColWidth);
                                            } else {
                                                setColWidth(i, curColWidth - curDif);

                                                curDif = 0;

                                                break;
                                            }
                                        }

                                        if(curDif > 0) {
                                            setColWidth(index, curWidth + widthDif - curDif);
                                        } else {
                                            setColWidth(index, curWidth + widthDif);
                                        }
                                    } else {
                                        if(curWidth + widthDif < $this.options.minColWidth) {
                                            setColWidth(index + 1, getColWidth(index + 1) + curWidth - $this.options.minColWidth);

                                            setColWidth(index, $this.options.minColWidth);
                                        } else {
                                            setColWidth(index + 1, getColWidth(index + 1) - widthDif);

                                            setColWidth(index, curWidth + widthDif);
                                        }
                                    }
                                } else {
                                    setColWidth(index, getColWidth(index) + widthDif);
                                }

                                $this._resizeColumnHandles();
                            }
                        });
                    })(i);
                }
            }

            if(this.options.colHeader){
                this._topTable.append(headerTR);
            }
        },

        _defaultHeaderRenderer: function(th, index){
            th.append(index);
        },
        
        _defaultColumnSizePolicy: function(colKey){
        	return {
        		size: 'auto',
        		minSize: null,
        		maxSize: null
        	}
        },

        _defaultRenderer: function(td, value, opts){
            function detectType(val){
                if(!JSB.isDefined(val)){
                	if($this.options.undefinedAsNull){
                		return 'null';
                	}
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
            if(valueType === 'object' || valueType === 'array') {
                var jvInst = new JsonView({collapsed:true});
                $this._ctrlMap[jvInst.getId()] = jvInst;

                if(valueType === 'array' && value.length > $this.options.jsonArrayLimit){
                    jvInst.setData(value.slice(0, $this.options.jsonArrayLimit));
                } else {
                    jvInst.setData(value);
                }

                this.$(td).append(jvInst.getElement());
            } else if(valueType == 'boolean'){
                this.$(td).attr('val', value);
                this.$(td).text(String(value));
            } else if(valueType === 'string') {
            	var stringLimit = opts && JSB.isDefined(opts.stringLimit) ? opts.stringLimit : this.options.stringLimit;
                if(stringLimit && value.length > stringLimit) {
                    this.$(td).attr('title', value).text(value.substr(0, stringLimit - 3) + '...');
                } else {
                    this.$(td).attr('title', value).text(value);
                }
            } else if(valueType === 'null'){
            	this.$(td).text('null');
            } else {
                this.$(td).text(String(value));
            }
        },

        _resizeColumnHandles: function() {
            var resizeHandles = $this._colResizeHandleContainer.children('.col-resize-handle'),
                cols = this._masterTable.find('colgroup > col'),
                left = 0;

            for(var i = 0; i < resizeHandles.length; i++) {
                left += this.$(cols[i]).width();
                resizeHandles[i].style.left = left + 'px';
            }
        }
    }
}