{
	$name: 'JSB.DataCube.Widgets.Table',
	$parent: 'JSB.DataCube.Widgets.Widget',
	$expose: {
		name: 'Таблица',
		description: '',
		category: 'Основные',
		thumb: `data:image/png;base64,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`
	},
	$scheme: {
		type: 'group',
		items: [{
			type: 'item',
			optional: 'checked',
			key: 'showHeader',
			name: 'Показывать заголовки столбцов',
			editor: 'none'
		},{
			type: 'item',
			optional: 'checked',
			key: 'showGrid',
			name: 'Показывать сетку',
			editor: 'none'
		},{
			type: 'group',
			name: 'Строки',
			binding: 'array',
			key: 'rows',
			items: [{
				name: 'Идентификация',
				type: 'item',
				multiple: true,
				key: 'rowKey',
				binding: 'field',
				editor: 'none'
			},{
				name: 'Столбцы',
				type: 'group',
				multiple: 'auto',
				key: 'columns',
				items: [{
					name: 'Название',
					key: 'title',
					type: 'item',
					itemType: 'string',
					itemValue: '$field'
				},{
					name: 'Отображение ячейки',
					type: 'select',
					key: 'view',
					items:[{
						type: 'item',
						name: 'Текст',
						key: 'text',
						binding: 'field',
						itemType: 'any'
					},{
						name: 'Виджет',
						type: 'widget',
						key: 'widget'
					}]
				},{
					name: 'Выравнивание ячейки',
					type: 'group',
					items:[{
						name: 'По горизонтали',
						type: 'select',
						key: 'alignHorz',
						items: [{
							type: 'item',
							name: 'По левому карю',
							itemValue: 'left',
							editor: 'none'
						},{
							type: 'item',
							name: 'Посередине',
							itemValue: 'center',
							editor: 'none'
						},{
							type: 'item',
							name: 'По правому краю',
							itemValue: 'right',
							editor: 'none'
						}]
					},{
						name: 'По вертикали',
						type: 'select',
						key: 'alignVert',
						items: [{
							type: 'item',
							name: 'Сверху',
							itemValue: 'top',
							editor: 'none'
						},{
							type: 'item',
							name: 'Посередине',
							itemValue: 'middle',
							editor: 'none'
						},{
							type: 'item',
							name: 'Снизу',
							itemValue: 'bottom',
							editor: 'none'
						}]
					}]
					
				},{
					name: 'CSS стиль ячейки',
					type: 'item',
					optional: true,
					itemType: 'string',
					itemValue: `/* Заполните объект CSS значениями */
{
	font-family: 'arial';
}`,
					key: 'css',
					editor: 'JSB.Widgets.MultiEditor',
					options: {
						valueType: 'org.jsbeans.types.Css'
					}
				},{
					name: 'Выравнивание заголовка',
					type: 'group',
					items:[{
						name: 'По горизонтали',
						type: 'select',
						key: 'hAlignHorz',
						items: [{
							type: 'item',
							name: 'По левому карю',
							itemValue: 'left',
							editor: 'none'
						},{
							type: 'item',
							name: 'Посередине',
							itemValue: 'center',
							editor: 'none'
						},{
							type: 'item',
							name: 'По правому краю',
							itemValue: 'right',
							editor: 'none'
						}]
					},{
						name: 'По вертикали',
						type: 'select',
						key: 'hAlignVert',
						items: [{
							type: 'item',
							name: 'Сверху',
							itemValue: 'top',
							editor: 'none'
						},{
							type: 'item',
							name: 'Посередине',
							itemValue: 'middle',
							editor: 'none'
						},{
							type: 'item',
							name: 'Снизу',
							itemValue: 'bottom',
							editor: 'none'
						}]
					}]
					
				},{
					name: 'CSS стиль заголовка',
					type: 'item',
					optional: true,
					itemType: 'string',
					itemValue: `/* Заполните объект CSS значениями */
{
	font-family: 'arial';
}`,
					key: 'hCss',
					editor: 'JSB.Widgets.MultiEditor',
					options: {
						valueType: 'org.jsbeans.types.Css'
					}
				}]
			}]
		}]
	},
	
	$client: {
		$require: ['JSB.Widgets.ScrollBox', 
		           'JSB.Crypt.MD5'],
		
		ready: false,
		headerDesc: [],
		colDesc: [],
		rows: [],
		rowKeyMap: {},
		widgetMap: {},
		appendRowsReady: false,
		preFetching: false,
		stopPreFetch: false,
		scrollHeight: 0,
		paneHeight: 0,
		
		$constructor: function(opts){
			$base(opts);
			
			this.addClass('tableWidget');
			this.loadCss('Table.css');
			
			this.header = this.$('<table class="header" cellpadding="0" cellspacing="0"><colgroup></colgroup><thead><tr></tr></thead></table>');
			this.append(this.header);
			
			this.scroll = new ScrollBox({
				onScroll: function(){
					var scrollY = $this.scroll.getScrollPosition().y;
					if( $this.paneHeight - ($this.scrollHeight - scrollY) > 2 * $this.scrollHeight){
						return;
					}
					
					$this.appendRows();
				}
			});
			this.scroll.append('<table class="rows" cellpadding="0" cellspacing="0"><colgroup></colgroup><tbody></tbody></table>');
			this.scroll.addClass('pane');
			this.append(this.scroll);
			
			JSB.loadScript('tpl/d3/d3.min.js', function(){
				$this.ready = true;
			});
			
			$this.header.resize(function(){
				$this.updateHeaderSize();
			});

			this.scroll.getElement().resize(function(){
				$this.scrollHeight = $this.scroll.getElement().height();
				$this.appendRows();
			});
			
			$this.scroll.getPane().resize(function(){
				$this.paneHeight = $this.scroll.getPane().height();
				$this.header.width($this.scroll.getPane().width());
			});
			
			if(!$this.scrollHeight){
				JSB.deferUntil(function(){
					$this.scrollHeight = $this.scroll.getElement().height();
				}, function(){
					return $this.scroll.getElement().height() > 0;
				});
			}
		},
		
		updateHeaderSize: function(){
			if($this.header.is(':visible')){
				$this.scroll.getElement().css('height', 'calc(100% - ' + $this.header.height() + 'px)');
			} else {
				$this.scroll.getElement().css('height', '100%');
			}
		},
		
		getColumnNames: function(){
			var names = [];
			this.getContext().find('title').each(function(){
				names.push(this.value());
			});
			return names;
		},
		
		appendRows: function(bUseExisting){
			if(!this.appendRowsReady){
				return;
			}
			this.appendRowsReady = false;
			var fetchSize = 10;
			
			if(bUseExisting){
				if(this.rows.length > 0){
					fetchSize = this.rows.length;
				}
				this.rows = [];
				this.rowKeyMap = {};
			} else {
				// check scroll
				var scrollY = $this.scroll.getScrollPosition().y;
				if( $this.paneHeight - ($this.scrollHeight - scrollY) > 2 * $this.scrollHeight){
					this.appendRowsReady = true;
					return;
				}
			}
			
			var tbody = d3.select($this.scroll.getElement().get(0)).select('._dwp_scrollPane > table').select('tbody');
			this.fetchRowsBatch(fetchSize, function(rows){
				if(!rows || rows.length == 0){
					$this.appendRowsReady = true;
					return;
				}

				function constructRowKey(d){
					var key = '';
					for(var i = 0; i < $this.keyIndexes.length; i++){
						key += MD5.md5(d[$this.keyIndexes[i]].value);
					}
					if(key && key.length > 0){
						return key;
					}
				}
				
				// prepare rows
				var pRows = [];
				for(var i = 0; i < rows.length; i++){
					var rowDesc = rows[i];
					var row = rowDesc.row;
					if(!rowDesc.key){
						rowDesc.key = $this.rows.length + i;
					}
					var key = rowDesc.key;
					if($this.rowKeyMap[key]){
						continue;
					}
					pRows.push(rowDesc);
					$this.rowKeyMap[key] = rowDesc;
					
					// proceed widgets
					for(var j = 0; j < $this.colDesc.length; j++){
						row[j].rowKey = key;
						if(!$this.colDesc[j].widget){
							continue;
						}
						var colName = $this.colDesc[j].title;
						if($this.widgetMap[key] && $this.widgetMap[key][colName] && $this.widgetMap[key][colName].getJsb().$name == $this.colDesc[j].widget.jsb){
							$this.widgetMap[key][colName].setWrapper($this.getWrapper(), row[j].value);
						} else {
							var WidgetCls = $this.colDesc[j].widget.cls;
							var widget = new WidgetCls();
							widget.setWrapper($this.getWrapper(),  row[j].value);
							if(!$this.widgetMap[key]){
								$this.widgetMap[key] = {};
							}
							$this.widgetMap[key][colName] = widget;
						}
					}
				}
				
				$this.rows = $this.rows.concat(pRows);
				// accociate with DOM
				var rowsSel = tbody.selectAll('tr.row');
				var rowsSelData = rowsSel.data($this.rows, function(d){ return d ? d.key : $this.$(this).attr('key');});
				var rowsSelDataColData = rowsSelData.selectAll('td.col').data(function(d){ return d.row; }, function(d){ return d ? d.key: $this.$(this).attr('key')});
				
				rowsSelDataColData.exit()
					.each(function(d){
						var cell = d3.select(this).select('div.cell');
						var cellEl = $this.$(cell.node());
						
						if($this.widgetMap[d.rowKey] && $this.widgetMap[d.rowKey][d.column]){
							$this.widgetMap[d.rowKey][d.column].destroy();
							delete $this.widgetMap[d.rowKey][d.column];
							if(Object.keys($this.widgetMap[d.rowKey]).length == 0){
								delete $this.widgetMap[d.rowKey];
							}
						}
					})
					.remove();
					
				rowsSelDataColData.enter()
				.append('td')
					.classed('col', true)
					.attr('key', function(d){ return d.key;})
					.attr('style', function(d){ return $this.colDesc[d.colIdx].style.cssStyle})
					.style('text-align', function(d){ return $this.colDesc[d.colIdx].style.alignHorz})
					.style('vertical-align', function(d){ return $this.colDesc[d.colIdx].style.alignVert})
						.append('div')
							.classed('cell', true)
							.attr('key', function(d){ return d.key;})
							.attr('style', function(d){ return $this.colDesc[d.colIdx].style.cssStyle})
							.each(function(d){
								var cellEl = $this.$(this);
								if($this.colDesc[d.colIdx].widget){
									var widget = $this.widgetMap[d.rowKey][d.column];
									cellEl.append(widget.getElement());
									cellEl.attr('widget', widget.getId());
								} else {
									cellEl.text(d.value);
								}
							});
					
				rowsSelDataColData
					.attr('style', function(d){ return $this.colDesc[d.colIdx].style.cssStyle})
					.style('text-align', function(d){ return $this.colDesc[d.colIdx].style.alignHorz})
					.style('vertical-align', function(d){ return $this.colDesc[d.colIdx].style.alignVert});
				
				rowsSelDataColData.each(function(d){
					var cell = d3.select(this).select('div.cell');
					cell.attr('style', function(d){ return $this.colDesc[d.colIdx].style.cssStyle});
					var cellEl = $this.$(cell.node());
					
					if($this.colDesc[d.colIdx].widget){
						var widget = $this.widgetMap[d.rowKey][d.column];
						var cellWidget = cellEl.attr('widget');
						if(cellWidget){
							if(widget.getId() != cellWidget){
								var oldWidget = JSB.getInstance(cellWidget);
								if(oldWidget){
									oldWidget.destroy();
								}
								cellEl.empty().append(widget.getElement());
								cellEl.attr('widget', widget.getId());
							}
						} else {
							cellEl.empty().append(widget.getElement());
							cellEl.attr('widget', widget.getId());
						}
					} else {
						cellEl.text(d.value);
						if(cellEl.attr('widget')){
							cellEl.removeAttr('widget');
						}
						if($this.widgetMap[d.rowKey] && $this.widgetMap[d.rowKey][d.column]){
							var widget = $this.widgetMap[d.rowKey][d.column];
							widget.destroy();
							delete $this.widgetMap[d.rowKey][d.column];
							if(Object.keys($this.widgetMap[d.rowKey]).length == 0){
								delete $this.widgetMap[d.rowKey];
							}
						}
					}
				});
				
				rowsSelDataColData.order();
				
				rowsSelData
					.enter()
						.append('tr')
							.classed('row', true)
							.attr('key', function(d){ return d.key;})
							.selectAll('td.col').data(function(d){ return d.row; }, function(d){ return d ? d.key: $this.$(this).attr('key')})
							.enter()
								.append('td')
									.classed('col', true)
									.attr('key', function(d){ return d.key;})
									.attr('style', function(d){ return $this.colDesc[d.colIdx].style.cssStyle})
									.style('text-align', function(d){ return $this.colDesc[d.colIdx].style.alignHorz})
									.style('vertical-align', function(d){ return $this.colDesc[d.colIdx].style.alignVert})
									.append('div')
									.classed('cell', true)
										.attr('key', function(d){return d.key})
										.attr('style', function(d){ return $this.colDesc[d.colIdx].style.cssStyle})
										.each(function(d){
											var cellEl = $this.$(this);
											if($this.colDesc[d.colIdx].widget){
												var widget = $this.widgetMap[d.rowKey][d.column];
												cellEl.append(widget.getElement());
												cellEl.attr('widget', widget.getId());
											} else {
												cellEl.text(d.value);
											}
										});

				
				// destroy widgets
				rowsSel.exit()
					.selectAll('td.col').data(function(d){ return d.row; }, function(d){ return d ? d.key: $this.$(this).attr('key')})
						.each(function(d){
							var cell = d3.select(this).select('div.cell');
							var cellEl = $this.$(cell.node());
							
							if($this.widgetMap[d.rowKey] && $this.widgetMap[d.rowKey][d.column]){
								$this.widgetMap[d.rowKey][d.column].destroy();
								delete $this.widgetMap[d.rowKey][d.column];
								if(Object.keys($this.widgetMap[d.rowKey]).length == 0){
									delete $this.widgetMap[d.rowKey];
								}
							}
						});
						
				rowsSel.exit()
					.remove();
				
				$this.appendRowsReady = true;
				JSB.defer(function(){
					$this.appendRows();	
				}, 0);
				
			})
		},
		
		fetchRowsBatch: function(batchSize, callback){
			var preFetchSize = 10;
			this.stopPreFetch = true;
			if(this.preFetching){
				JSB.deferUntil(function(){
					$this.fetchRowsBatch(batchSize, callback);
				}, function(){
					return !$this.preFetching;
				});
				return;
			}
			var rows = [];
			var cols = [];
			var rowsContext = this.getContext().find('rows');
			var rowKeySelector = this.getContext().find('rowKey');
			var gArr = this.getContext().find('columns').values();
			for(var i = 0; i < gArr.length; i++){
				var valueSelector = gArr[i].get(1).value();
				var colType = valueSelector.key();
				cols.push({
					colName: $this.colDesc[i].title,
					colKey: $this.colDesc[i].key,
					colType: colType,
					valueSelector: valueSelector
				});
			}
			function preFetch(){
				if($this.stopPreFetch){
					return;
				}
				$this.preFetching = true;
				var fRes = rowsContext.fetch({batchSize: preFetchSize}, function(data){
					$this.preFetching = false;
					if(!data || data.length == 0){
						return;
					}
					if(rowsContext.data().length - rowsContext.position() > preFetchSize * 5){
						return;
					}
					preFetch();
				});
			}
			function iterateRows(){
				while(rowsContext.next()){
					var row = [];
					// construct key
					var rowKey = null;
					var keyVals = rowKeySelector.values();
					if(keyVals.length > 0){
						rowKey = '';
						for(var i = 0; i < keyVals.length; i++){
							if(!keyVals[i]){
								continue;
							}
							rowKey += MD5.md5(keyVals[i]);
						}	
					}
					
					// iterate by cells
					for(var i = 0; i < gArr.length; i++){
						var rDesc = {
							key: cols[i].colKey,
							column: cols[i].colName,
							colIdx: i
						};
						if(cols[i].colType == 'text'){
							rDesc.value = cols[i].valueSelector.value();
						} else if(cols[i].colType == 'widget'){
							var vals = JSB.clone($this.colDesc[i].widget.values.unwrap());
							rDesc.value = vals;
						}
						
						row.push(rDesc);	// push cell

					}
					rows.push({row: row, key: rowKey});
					if(rows.length >= batchSize){
						$this.stopPreFetch = false;
						
						preFetch();
						
						callback.call($this, rows);
						return;
					}
				}
				rowsContext.fetch({batchSize: batchSize - rows.length},function(data){
					if(data && data.length){
						iterateRows();
					} else {
						$this.stopPreFetch = false;
						callback.call($this, rows);
					}
				})
			}
			
			iterateRows();
		},
		
		updateRows: function(){
			var rowsContext = this.getContext().find('rows');
			rowsContext.reset();
			
			var colGroup = d3.select($this.scroll.getElement().get(0)).select('._dwp_scrollPane > table').select('colgroup');
			var colGroupData = colGroup.selectAll('col').data($this.colDesc, function(d){ return d ? d.key : this.attr('key')});
			
			colGroupData.enter()
				.append('col')
					.attr('key', function(d){return d.key;})
					.style('width', function(d){ return '' + d.size + '%'});
			
			colGroupData.exit().remove();
			colGroupData.order();
			this.appendRowsReady = true;
			
			this.appendRows(true);
		},
		
		updateHeader: function(){
			if(this.getContext().find('showHeader').used()){
				if(this.getContext().find('columns').used()){
					this.addClass('hasHeader');
					var headerTable = d3.select($this.header.get(0));
					var colGroup = headerTable.select('colgroup').selectAll('col');

					var dataColGroup = colGroup.data($this.colDesc, function(d){ return d ? d.key : this.attr('key')});
					dataColGroup.enter()
						.append('col')
							.attr('key', function(d){ return d.key;})
							.style('width', function(d){ return '' + d.size + '%'});
					dataColGroup.exit()
						.remove();
					dataColGroup.order();

					var rowsBody = headerTable.select('thead').select('tr');
					var colData = rowsBody.selectAll('th.col').data($this.colDesc, function(d){ return d ? d.key : this.attr('key')});

					colData
						.attr('style', function(d){ return d.hStyle.cssStyle})
						.style('text-align', function(d){ return d.hStyle.alignHorz})
						.style('vertical-align', function(d){ return d.hStyle.alignVert})
						
					colData.enter()
						.append('th')
							.classed('col', true)
							.attr('key', function(d){ return d.key;})
							.attr('style', function(d){ return d.hStyle.cssStyle})
							.style('text-align', function(d){ return d.hStyle.alignHorz})
							.style('vertical-align', function(d){ return d.hStyle.alignVert})
							.text(function(d){ return d.title});
					
					colData.exit()
						.remove();
					
					colData.order();
				}
				
			} else {
				this.removeClass('hasHeader');
			}
			$this.updateHeaderSize();
		},
		
		refresh: function(){
			if(!this.ready){
				JSB.deferUntil(function(){
					$this.refresh();
				}, function(){
					return $this.ready;
				});
				return;
			}
			
			if(!this.getContext().find('columns').used()){
				return;
			}
			// update col sizes
			var gArr = this.getContext().find('columns').values();
			var colSzPrc = 100.0 / gArr.length;
			this.colDesc = [];
			var widgetTypes = [];
			
			function prepareCss(cssText){
				if(cssText.indexOf('{') >= 0){
					var m = cssText.match(/\{([^\}]*)\}/i);
					if(m && m.length > 1){
						cssText = m[1];
					}
				}
				return cssText.replace(/\r/g,'').replace(/\n/g,'').trim();
			}
			
			for(var i = 0; i < gArr.length; i++){
				var colTitle = gArr[i].find('title').value();
				
				// fill styles
				var alignHorz = 'left';
				var alignHorzSelector = gArr[i].find('alignHorz');
				if(alignHorzSelector.used()){
					alignHorz = alignHorzSelector.value().value();
				}
				
				var alignVert = 'top';
				var alignVertSelector = gArr[i].find('alignVert');
				if(alignVertSelector.used()){
					alignVert = alignVertSelector.value().value();
				}
				
				var cssStyle = '';
				var cssSelector = gArr[i].find('css');
				if(cssSelector.used()){
					cssStyle = prepareCss(cssSelector.value());
				}

				// fill header styles
				var hAlignHorz = 'left';
				var hAlignHorzSelector = gArr[i].find('hAlignHorz');
				if(hAlignHorzSelector.used()){
					hAlignHorz = hAlignHorzSelector.value().value();
				}
				
				var hAlignVert = 'top';
				var hAlignVertSelector = gArr[i].find('alignVert');
				if(hAlignVertSelector.used()){
					hAlignVert = hAlignVertSelector.value().value();
				}
				
				var hCssStyle = '';
				var hCssSelector = gArr[i].find('hCss');
				if(hCssSelector.used()){
					hCssStyle = prepareCss(hCssSelector.value());
				}

				var desc = {
					key: MD5.md5(colTitle),
					title: colTitle,
					size: colSzPrc,
					style: {
						alignHorz: alignHorz,
						alignVert: alignVert,
						cssStyle: cssStyle
					},
					hStyle: {
						alignHorz: hAlignHorz,
						alignVert: hAlignVert,
						cssStyle: hCssStyle
					},
					widget: null
				};
				
				// check for widget
				var viewSelector = gArr[i].find('view').value();
				if(viewSelector.key() == 'widget'){
					var wType = viewSelector.unwrap().widget.jsb;
					var wName = viewSelector.unwrap().widget.name;
					widgetTypes.push(wType);
					desc.widget = {
						jsb: wType,
						name: wName,
						values: viewSelector.value()
					};
				}
				
				this.colDesc.push(desc);

			}
			
			// update grid
			if(this.getContext().find('showGrid').used()){
				this.addClass('hasBorder');
			} else {
				this.removeClass('hasBorder');
			}
			
			// update header
			this.updateHeader();

			// load widgets
			if(widgetTypes.length > 0){
				JSB.chain(this.colDesc, function(d, c){
					if(!d.widget){
						c();
					} else {
						JSB.lookup(d.widget.jsb, function(cls){
							d.widget.cls = cls;
							c();
						})
					}
				}, function(){
					// update rows
					$this.updateRows();
				});
			} else {
				// update rows
				this.updateRows();
			}
		}
	}
}