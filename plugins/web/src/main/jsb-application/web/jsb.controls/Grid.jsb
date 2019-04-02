{
	$name: 'JSB.Controls.Grid',
	$parent: 'JSB.Controls.Control',

	$require: ['JsonView',
	           'jQuery.UI.Resizable',
	           'css:Grid.css'],

	$client: {
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

			this._topTable = this.$('<table cellspacing="0" cellpadding="0"></table>');
			this._topContainer.append(this._topTable);

		    if(!opts.headerRenderer){
		        this.options.headerRenderer = function(th, index){
		            return $this._defaultHeaderRenderer(th, index);
		        }
		    }

		    this._masterContainer.scroll(function(evt){
		        // header
		        $this._topContainer.get(0).style.left = -evt.target.scrollLeft + 'px';
		        $this._topContainer.width($this._masterContainer.get(0).clientWidth + evt.target.scrollLeft);

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

		    if(!opts.renderer){
		        this.options.renderer = function(td, value){
		            return $this._defaultRenderer(td, value);
		        };
		    }

		    if(this.options.data){
		        this.setData(this.options.data);
		    }
        },

        options: {
            // options
            maxColWidth: 300,
            minColWidth: 100,
            noDataMessage: 'Нет данных',

            // renderers
            headerRenderer: null,
            renderer: null,

            // callbacks
            preloader: null
        },

        addArray: function(data, rowIndex){
            var newRows = [],
                dataType = 'array';

            for(var i = 0; i < data.length; i++){ //rows
                var row = this.$('<tr class="grid-row"></tr>');

                for(var j in data[i]){
                    var td = this.$('<td class="grid-cell"></td>');

                    row.append(this.options.renderer(td, data[i][j]));
                }

                newRows.push(row);
            }

            if(JSB.isDefined(rowIndex)){
                // todo
                //this._masterTable.child('tr:nth-child(' + rowIndex + ')');
            } else {
                this._masterTable.append(newRows);
            }

            if(this.options.preloader && this._masterTable.height() < this.getElement().height()){
                this.options.preloader.call(this);
            }
        },

        clear: function(){
            this._masterTable.empty();
            this._topTable.empty();
        },

        setData: function(data){
            this.clear();

            if(!data || data.length == 0){
            	return;
            }
            this.addArray(data);

            var firstRow = this._masterTable.find("tr:first-child > td"),
                masterColGroup = this.$('<colgroup></colgroup>'),
                topColGroup = this.$('<colgroup></colgroup>'),
                tableWidth = 0,
                headerTR = this.$('<tr class="grid-header-row"></tr>'),
                index = 0;

            this._masterTable.prepend(masterColGroup);
            this._topTable.prepend(topColGroup);

            for(var i in data[0]){
                var colWidth = this.$(firstRow[index]).width(),
                    style;

                if(colWidth > this.options.maxColWidth){
                    style = this.options.maxColWidth;
                } else if(colWidth < this.options.minColWidth){
                    style = this.options.minColWidth;
                } else {
                    style = colWidth;
                }

                var col = '<col key="' + i + '" style="width: ' + style + 'px">',
                    masterCol = this.$(col),
                    topCol = this.$(col);

                tableWidth += style;

                masterColGroup.append(masterCol);
                topColGroup.append(topCol);

                var th = this.$('<th class="grid-header-col"></th>');
                headerTR.append(this.options.headerRenderer(th, i));

                (function(masterCol, topCol){
                    th.resizable({
                        handles: "e",
                        helper: "jsb-grid-resizable-helper",
                        start: function(evt, ui){
                            ui.helper.height($this._masterContainer.get(0).clientHeight);
                        },
                        stop: function(evt, ui){
                            masterCol.style.width = ui.size.width + 'px';
                            topCol.style.width = ui.size.width + 'px';
                        }
                    });
                })(masterCol.get(0), topCol.get(0));
            }

            this._topTable.append(headerTR);


            var masterContainerClientWidth = this._masterContainer.get(0).clientWidth;
            if(this._masterTable.width() < masterContainerClientWidth){
                var dif = (masterContainerClientWidth - this._masterTable.width()) / Object.keys(data[0]).length;

                function increaseCols(cols, dif){
                    for(var i = 0; i < cols.length; i++){
                        var col = $this.$(cols[i]);

                        col.width(col.width() + dif);
                    }
                }

                increaseCols(masterColGroup.children('col'), dif);
                increaseCols(topColGroup.children('col'), dif);
            }

            this._masterTable.get(0).style['margin-top'] = this._topTable.height() + 'px';
        },

        _defaultHeaderRenderer: function(th, index){
            th.append(index);

            return th;
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
                /*
                JSB.lookup('JsonView', function(jvcls){
                    var jvInst = new jvcls({collapsed:true});

                    if(valueType === 'array' && value.length > $this.options.jsonArrayLimit){
                        jvInst.setData(value.slice(0, $this.options.jsonArrayLimit));
                    } else {
                        jvInst.setData(value);
                    }

                    $this.$(td).append(jvInst.getElement());
                });
                */
            } else if(valueType == 'boolean'){
                this.$(td).attr('val', value);
            } else {
                this.$(td).text(String(value));
            }

            return td;
        }
    }
}