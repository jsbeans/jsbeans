{
	$name: 'JSB.DataCube.Widgets.Table',
	$parent: 'JSB.DataCube.Widgets.Widget',
	$expose: {
		name: 'Таблица',
		description: '',
		category: 'Основные',
		thumb: 'data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiIHN0YW5kYWxvbmU9Im5vIj8+DQo8c3ZnDQogICB4bWxuczpkYz0iaHR0cDovL3B1cmwub3JnL2RjL2VsZW1lbnRzLzEuMS8iDQogICB4bWxuczpjYz0iaHR0cDovL2NyZWF0aXZlY29tbW9ucy5vcmcvbnMjIg0KICAgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIg0KICAgeG1sbnM6c3ZnPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyINCiAgIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyINCiAgIHhtbG5zOnNvZGlwb2RpPSJodHRwOi8vc29kaXBvZGkuc291cmNlZm9yZ2UubmV0L0RURC9zb2RpcG9kaS0wLmR0ZCINCiAgIHhtbG5zOmlua3NjYXBlPSJodHRwOi8vd3d3Lmlua3NjYXBlLm9yZy9uYW1lc3BhY2VzL2lua3NjYXBlIg0KICAgdmVyc2lvbj0iMS4xIg0KICAgdmlld0JveD0iMCAwIDEwMCA2NCINCiAgIGlkPSJzdmcyIg0KICAgaW5rc2NhcGU6dmVyc2lvbj0iMC45MSByMTM3MjUiDQogICBzb2RpcG9kaTpkb2NuYW1lPSJ0YWJsZV90aHVtYi5zdmciDQogICB3aWR0aD0iMTAwIg0KICAgaGVpZ2h0PSI2NCI+DQogIDxtZXRhZGF0YQ0KICAgICBpZD0ibWV0YWRhdGE0MSI+DQogICAgPHJkZjpSREY+DQogICAgICA8Y2M6V29yaw0KICAgICAgICAgcmRmOmFib3V0PSIiPg0KICAgICAgICA8ZGM6Zm9ybWF0PmltYWdlL3N2Zyt4bWw8L2RjOmZvcm1hdD4NCiAgICAgICAgPGRjOnR5cGUNCiAgICAgICAgICAgcmRmOnJlc291cmNlPSJodHRwOi8vcHVybC5vcmcvZGMvZGNtaXR5cGUvU3RpbGxJbWFnZSIgLz4NCiAgICAgICAgPGRjOnRpdGxlPjwvZGM6dGl0bGU+DQogICAgICA8L2NjOldvcms+DQogICAgPC9yZGY6UkRGPg0KICA8L21ldGFkYXRhPg0KICA8c29kaXBvZGk6bmFtZWR2aWV3DQogICAgIHBhZ2Vjb2xvcj0iI2ZmZmZmZiINCiAgICAgYm9yZGVyY29sb3I9IiM2NjY2NjYiDQogICAgIGJvcmRlcm9wYWNpdHk9IjEiDQogICAgIG9iamVjdHRvbGVyYW5jZT0iMTAiDQogICAgIGdyaWR0b2xlcmFuY2U9IjEwIg0KICAgICBndWlkZXRvbGVyYW5jZT0iMTAiDQogICAgIGlua3NjYXBlOnBhZ2VvcGFjaXR5PSIwIg0KICAgICBpbmtzY2FwZTpwYWdlc2hhZG93PSIyIg0KICAgICBpbmtzY2FwZTp3aW5kb3ctd2lkdGg9IjE5MjAiDQogICAgIGlua3NjYXBlOndpbmRvdy1oZWlnaHQ9IjExNzgiDQogICAgIGlkPSJuYW1lZHZpZXczOSINCiAgICAgc2hvd2dyaWQ9ImZhbHNlIg0KICAgICBpbmtzY2FwZTp6b29tPSI0LjkxNjY2NjciDQogICAgIGlua3NjYXBlOmN4PSI2Mi43ODgyODgiDQogICAgIGlua3NjYXBlOmN5PSI2MC40MTg2NTEiDQogICAgIGlua3NjYXBlOndpbmRvdy14PSIxOTEyIg0KICAgICBpbmtzY2FwZTp3aW5kb3cteT0iLTgiDQogICAgIGlua3NjYXBlOndpbmRvdy1tYXhpbWl6ZWQ9IjEiDQogICAgIGlua3NjYXBlOmN1cnJlbnQtbGF5ZXI9InN2ZzIiIC8+DQogIDxkZWZzDQogICAgIGlkPSJkZWZzNCI+DQogICAgPGxpbmVhckdyYWRpZW50DQogICAgICAgaWQ9ImRlZjAiDQogICAgICAgeDE9IjU1LjIyODI2OCINCiAgICAgICB4Mj0iNTUuMjI4MjY4Ig0KICAgICAgIHkxPSIxLjU0NTExNjgiDQogICAgICAgeTI9IjEwOS43MDI2MSINCiAgICAgICBncmFkaWVudFRyYW5zZm9ybT0ic2NhbGUoMS4xNTg4MTg1LDAuODYyOTQ3ODkpIg0KICAgICAgIGdyYWRpZW50VW5pdHM9InVzZXJTcGFjZU9uVXNlIj4NCiAgICAgIDxzdG9wDQogICAgICAgICBvZmZzZXQ9IjAiDQogICAgICAgICBzdG9wLWNvbG9yPSIjQjNFMkZGIg0KICAgICAgICAgaWQ9InN0b3A3IiAvPg0KICAgICAgPHN0b3ANCiAgICAgICAgIG9mZnNldD0iMSINCiAgICAgICAgIHN0b3AtY29sb3I9IiM5OUNDRkYiDQogICAgICAgICBpZD0ic3RvcDkiIC8+DQogICAgPC9saW5lYXJHcmFkaWVudD4NCiAgPC9kZWZzPg0KICA8Zw0KICAgICBpZD0iZzExIg0KICAgICB0cmFuc2Zvcm09Im1hdHJpeCgwLjcwNDg1NjgxLDAsMCwwLjYwMjIwODk5LDUuMDg0NzQ1OCwzLjU0Mzg2OTcpIj4NCiAgICA8cGF0aA0KICAgICAgIGQ9Ik0gMTI4LDk2IDAsOTYgMCwwIGwgMTI4LDAgMCw5NiB6Ig0KICAgICAgIGlkPSJwYXRoMTMiDQogICAgICAgaW5rc2NhcGU6Y29ubmVjdG9yLWN1cnZhdHVyZT0iMCINCiAgICAgICBzdHlsZT0iZmlsbDojMDA5OWZmIiAvPg0KICAgIDxwYXRoDQogICAgICAgZD0ibSAxLjMzMzMzLDEuMzMzMzQgMTI1LjMzMzY3LDAgMCw5My4zMzMzNiAtMTI1LjMzMzY3LDAgMCwtOTMuMzMzMzYgeiINCiAgICAgICBpZD0icGF0aDE1Ig0KICAgICAgIGlua3NjYXBlOmNvbm5lY3Rvci1jdXJ2YXR1cmU9IjAiDQogICAgICAgc3R5bGU9ImZpbGw6dXJsKCNkZWYwKSIgLz4NCiAgICA8cGF0aA0KICAgICAgIGQ9Im0gMi42NjY2NywyLjY2NjY2IDEyMi42NjYzMywwIDAsOTAuNjY2NjQgLTEyMi42NjYzMywwIDAsLTkwLjY2NjY0IHoiDQogICAgICAgaWQ9InBhdGgxNyINCiAgICAgICBpbmtzY2FwZTpjb25uZWN0b3ItY3VydmF0dXJlPSIwIg0KICAgICAgIHN0eWxlPSJmaWxsOiNmZmZmZmYiIC8+DQogICAgPHBhdGgNCiAgICAgICBkPSJtIDEyNS4zMzMsMTQuNjY2NyAtMTIyLjY2NjMzLDAgMCwtMTIuMDAwMDQgMTIyLjY2NjMzLDAgMCwxMi4wMDAwNCB6Ig0KICAgICAgIGlkPSJwYXRoMTkiDQogICAgICAgaW5rc2NhcGU6Y29ubmVjdG9yLWN1cnZhdHVyZT0iMCINCiAgICAgICBzdHlsZT0iZmlsbDojZGVmZmZmIiAvPg0KICAgIDxwYXRoDQogICAgICAgZD0ibSAyLjY2NjY3LDE0LjY2NjcgMTIyLjY2NjMzLDAgMCwtMS4zMzM0IC0xMjIuNjY2MzMsMCAwLDEuMzMzNCB6Ig0KICAgICAgIGlkPSJwYXRoMjEiDQogICAgICAgaW5rc2NhcGU6Y29ubmVjdG9yLWN1cnZhdHVyZT0iMCINCiAgICAgICBzdHlsZT0iZmlsbDojYjRlMmZmIiAvPg0KICAgIDxwYXRoDQogICAgICAgZD0ibSA0MCw5My4zMzMzIDEuMzMzMywwIDAsLTkwLjY2NjY0IC0xLjMzMzMsMCAwLDkwLjY2NjY0IHoiDQogICAgICAgaWQ9InBhdGgyMyINCiAgICAgICBpbmtzY2FwZTpjb25uZWN0b3ItY3VydmF0dXJlPSIwIg0KICAgICAgIHN0eWxlPSJmaWxsOiNiNGUyZmYiIC8+DQogICAgPHBhdGgNCiAgICAgICBkPSJtIDg2LjY2NjcsOTMuMzMzMyAxLjMzMzMsMCAwLC05MC42NjY2NCAtMS4zMzMzLDAgMCw5MC42NjY2NCB6Ig0KICAgICAgIGlkPSJwYXRoMjUiDQogICAgICAgaW5rc2NhcGU6Y29ubmVjdG9yLWN1cnZhdHVyZT0iMCINCiAgICAgICBzdHlsZT0iZmlsbDojYjRlMmZmIiAvPg0KICAgIDxwYXRoDQogICAgICAgZD0ibSAyLjY2NjY3LDI4IDEyMi42NjYzMywwIDAsLTEuMzMzMyAtMTIyLjY2NjMzLDAgMCwxLjMzMzMgeiINCiAgICAgICBpZD0icGF0aDI3Ig0KICAgICAgIGlua3NjYXBlOmNvbm5lY3Rvci1jdXJ2YXR1cmU9IjAiDQogICAgICAgc3R5bGU9ImZpbGw6I2I0ZTJmZiIgLz4NCiAgICA8cGF0aA0KICAgICAgIGQ9Im0gMi42NjY2Nyw0MS4zMzMzIDEyMi42NjYzMywwIDAsLTEuMzMzMyAtMTIyLjY2NjMzLDAgMCwxLjMzMzMgeiINCiAgICAgICBpZD0icGF0aDI5Ig0KICAgICAgIGlua3NjYXBlOmNvbm5lY3Rvci1jdXJ2YXR1cmU9IjAiDQogICAgICAgc3R5bGU9ImZpbGw6I2I0ZTJmZiIgLz4NCiAgICA8cGF0aA0KICAgICAgIGQ9Im0gMi42NjY2Nyw1NC42NjY3IDEyMi42NjYzMywwIDAsLTEuMzMzNCAtMTIyLjY2NjMzLDAgMCwxLjMzMzQgeiINCiAgICAgICBpZD0icGF0aDMxIg0KICAgICAgIGlua3NjYXBlOmNvbm5lY3Rvci1jdXJ2YXR1cmU9IjAiDQogICAgICAgc3R5bGU9ImZpbGw6I2I0ZTJmZiIgLz4NCiAgICA8cGF0aA0KICAgICAgIGQ9Im0gMi42NjY2Nyw2OCAxMjIuNjY2MzMsMCAwLC0xLjMzNDcgLTEyMi42NjYzMywwIDAsMS4zMzQ3IHoiDQogICAgICAgaWQ9InBhdGgzMyINCiAgICAgICBpbmtzY2FwZTpjb25uZWN0b3ItY3VydmF0dXJlPSIwIg0KICAgICAgIHN0eWxlPSJmaWxsOiNiNGUyZmYiIC8+DQogICAgPHBhdGgNCiAgICAgICBkPSJtIDIuNjY2NjcsODEuMzMzMyAxMjIuNjY2MzMsMCAwLC0xLjMzMzMgLTEyMi42NjYzMywwIDAsMS4zMzMzIHoiDQogICAgICAgaWQ9InBhdGgzNSINCiAgICAgICBpbmtzY2FwZTpjb25uZWN0b3ItY3VydmF0dXJlPSIwIg0KICAgICAgIHN0eWxlPSJmaWxsOiNiNGUyZmYiIC8+DQogICAgPHBhdGgNCiAgICAgICBkPSJtIDkwLjY2NjcsMzcuMzMzMyAtNTMuMzMzNCwwIDAsMjAgNTMuMzMzNCwwIG0gLTQsLTQgLTQ1LjMzMzQsMCAwLC0xMiA0NS4zMzM0LDAgMCwxMiB6Ig0KICAgICAgIGlkPSJwYXRoMzciDQogICAgICAgaW5rc2NhcGU6Y29ubmVjdG9yLWN1cnZhdHVyZT0iMCINCiAgICAgICBzdHlsZT0iZmlsbDojZmZjYzAwIiAvPg0KICA8L2c+DQo8L3N2Zz4NCg=='
	},
	$scheme: {
		type: 'group',
		items: [{
			type: 'item',
			optional: 'checked',
			key: 'showHeader',
			name: 'Показывать заголовок'
		},{
			type: 'item',
			optional: 'checked',
			key: 'showGrid',
			name: 'Показывать сетку'
		},{
			type: 'group',
			name: 'Строки',
			binding: 'array',
			key: 'rows',
			items: [{
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
					name: 'Отображение',
					type: 'select',
					key: 'view',
					items:[{
						type: 'group',
						name: 'Текст',
						key: 'text',
						items:[{
							name: 'Значение',
							type: 'item',
							binding: 'field',
							itemType: 'any'
						},{
							name: 'Выравнивание',
							type: 'group',
							items:[{
								name: 'По горизонтали',
								type: 'select',
								key: 'alignHorz',
								items: [{
									type: 'item',
									name: 'По левому карю',
									itemValue: 'left'
								},{
									type: 'item',
									name: 'Посередине',
									itemValue: 'center'
								},{
									type: 'item',
									name: 'По правому краю',
									itemValue: 'right'
								}]
							},{
								name: 'По вертикали',
								type: 'select',
								key: 'alignVert',
								items: [{
									type: 'item',
									name: 'Сверху',
									itemValue: 'top'
								},{
									type: 'item',
									name: 'Посередине',
									itemValue: 'middle'
								},{
									type: 'item',
									name: 'Снизу',
									itemValue: 'bottom'
								}]
							}]
							
						}]
					},{
						name: 'Виджет',
						type: 'widget',
						key: 'widget'
					}]
				}]
			}]
		}]
	},
	
	$client: {
		$require: ['JSB.Widgets.ScrollBox'],
		
		ready: false,
		headerDesc: [],
		colSizes: [],
		
		$constructor: function(opts){
			$base(opts);
			
			this.addClass('tableWidget');
			this.loadCss('Table.css');
			
			this.header = this.$('<table class="header" cellpadding="0" cellspacing="0"><colgroup></colgroup><thead><tr></tr></thead></table>');
			this.append(this.header);
			
			this.scroll = new ScrollBox();
			this.scroll.append('<table class="rows" cellpadding="0" cellspacing="0"><colgroup></colgroup><tbody></tbody></table>');
			this.scroll.addClass('pane');
			this.append(this.scroll);
			
			JSB.loadScript('tpl/d3/d3.min.js', function(){
				$this.ready = true;
			});
			
			$this.header.resize(function(){
				$this.updateHeaderSize();
			});

		},
		
		updateHeaderSize: function(){
			$this.scroll.getElement().css('height', 'calc(100% - ' + $this.header.height() + 'px)');
		},
		
		getColumnNames: function(){
			var names = [];
			this.getContext().find('title').each(function(){
				names.push(this.value());
			});
			return names;
		},
		
		updateRows: function(){
			var rowsContext = this.getContext().find('rows');
			rowsContext.reset();
			var gArr = this.getContext().find('columns').values();
			var rows = [];
			
			var colGroup = d3.select($this.scroll.getElement().get(0)).select('._dwp_scrollPane > table').select('colgroup');
			var colGroupData = colGroup.selectAll('col').data($this.colSizes);
			
			colGroupData.enter()
				.append('col')
					.style('width', function(d){ return '' + d.size + '%'});
			
			colGroupData.exit().remove();
			
			function iterateRows(){
				while(rowsContext.next()){
					var row = [];
					// iterate by cells
					for(var i = 0; i < gArr.length; i++){
						var title = gArr[i].get(0).value();
						var view = gArr[i].get(1).value();
						if(view.key() == 'text'){
							var value = view.value().get(0).value();
							row.push({
								column: title,
								value: value
							});	// push cell
						}
					}
					rows.push(row);
				}
				
				if(rows.length > 0){
					// accociate with DOM
					var tbody = d3.select($this.scroll.getElement().get(0)).select('._dwp_scrollPane > table').select('tbody');
					var rowsSel = tbody.selectAll('tr.row');
					var rowsSelData = rowsSel.data(rows);
					var rowsSelDataColData = rowsSelData.selectAll('td.col').data(function(d){ return d; });
					rowsSelDataColData.enter()
						.append('td')
							.classed('col', true)
							.text(function(d){ return d.value});
					
					rowsSelDataColData.exit().remove();
					
					rowsSelData
						.enter()
							.append('tr')
								.classed('row', true)
								.selectAll('td.col')
								.data(function(d){ return d; })
								.enter()
									.append('td')
										.classed('col', true)
										.text(function(d){ return d.value});
					rowsSel
						.exit()
							.remove();
					
					return;
				}
				rowsContext.fetch(function(data){
					if(data && data.length){
						iterateRows();
					}
				})
			}
			
			iterateRows();
		},
		
		updateHeader: function(){
			if(this.getContext().find('showHeader').used()){
				if(this.getContext().find('columns').used()){
					this.addClass('hasHeader');

					var headerTable = d3.select($this.header.get(0));
					var colGroup = headerTable.select('colgroup').selectAll('col');

					var dataColGroup = colGroup.data($this.colSizes, function(d){ return d.title});
					dataColGroup.enter()
						.append('col')
							.style('width', function(d){ return '' + d.size + '%'});
					dataColGroup.exit()
						.remove();
					
					var rowsBody = headerTable.select('thead').select('tr');
					var colData = rowsBody.selectAll('th.col').data($this.colSizes);
					colData.enter()
						.append('th')
							.classed('col', true)
							.text(function(d){ return d.title});
					colData.exit()
						.remove();
						
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
			
			// update col sizes
			var gArr = this.getContext().find('columns').values();
			var colSzPrc = 100.0 / gArr.length;
			this.colSizes = [];
			for(var i = 0; i < gArr.length; i++){
				var colTitle = gArr[i].find('title').value();
				this.colSizes.push({
					title: colTitle,
					size: colSzPrc
				});
			}
			
			// update grid
			if(this.getContext().find('showGrid').used()){
				this.addClass('hasBorder');
			} else {
				this.removeClass('hasBorder');
			}
			
			// update header
			this.updateHeader();
			
			// update rows
			this.updateRows();
		}
	}
}