{
	$name: 'DataCube.Widgets.Table',
	$parent: 'DataCube.Widgets.Widget',
	$expose: {
		name: 'Таблица',
		description: '',
		category: 'Основные',
		icon: `data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiIHN0YW5kYWxvbmU9Im5vIj8+DQo8c3ZnDQogICB4bWxuczpkYz0iaHR0cDovL3B1cmwub3JnL2RjL2VsZW1lbnRzLzEuMS8iDQogICB4bWxuczpjYz0iaHR0cDovL2NyZWF0aXZlY29tbW9ucy5vcmcvbnMjIg0KICAgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIg0KICAgeG1sbnM6c3ZnPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyINCiAgIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyINCiAgIHhtbG5zOnNvZGlwb2RpPSJodHRwOi8vc29kaXBvZGkuc291cmNlZm9yZ2UubmV0L0RURC9zb2RpcG9kaS0wLmR0ZCINCiAgIHhtbG5zOmlua3NjYXBlPSJodHRwOi8vd3d3Lmlua3NjYXBlLm9yZy9uYW1lc3BhY2VzL2lua3NjYXBlIg0KICAgdmlld0JveD0iMCAwIDIwIDIwIg0KICAgaWQ9InN2ZzIiDQogICB2ZXJzaW9uPSIxLjEiDQogICBpbmtzY2FwZTp2ZXJzaW9uPSIwLjkxIHIxMzcyNSINCiAgIHNvZGlwb2RpOmRvY25hbWU9InRhYmxlX2ljb24uc3ZnIg0KICAgd2lkdGg9IjIwIg0KICAgaGVpZ2h0PSIyMCINCiAgIHN0eWxlPSJjbGlwLXJ1bGU6ZXZlbm9kZDtmaWxsLXJ1bGU6ZXZlbm9kZDtpbWFnZS1yZW5kZXJpbmc6b3B0aW1pemVRdWFsaXR5O3NoYXBlLXJlbmRlcmluZzpnZW9tZXRyaWNQcmVjaXNpb247dGV4dC1yZW5kZXJpbmc6Z2VvbWV0cmljUHJlY2lzaW9uIj4NCiAgPG1ldGFkYXRhDQogICAgIGlkPSJtZXRhZGF0YTM2Ij4NCiAgICA8cmRmOlJERj4NCiAgICAgIDxjYzpXb3JrDQogICAgICAgICByZGY6YWJvdXQ9IiI+DQogICAgICAgIDxkYzpmb3JtYXQ+aW1hZ2Uvc3ZnK3htbDwvZGM6Zm9ybWF0Pg0KICAgICAgICA8ZGM6dHlwZQ0KICAgICAgICAgICByZGY6cmVzb3VyY2U9Imh0dHA6Ly9wdXJsLm9yZy9kYy9kY21pdHlwZS9TdGlsbEltYWdlIiAvPg0KICAgICAgICA8ZGM6dGl0bGU+PC9kYzp0aXRsZT4NCiAgICAgIDwvY2M6V29yaz4NCiAgICA8L3JkZjpSREY+DQogIDwvbWV0YWRhdGE+DQogIDxzb2RpcG9kaTpuYW1lZHZpZXcNCiAgICAgcGFnZWNvbG9yPSIjZmZmZmZmIg0KICAgICBib3JkZXJjb2xvcj0iIzY2NjY2NiINCiAgICAgYm9yZGVyb3BhY2l0eT0iMSINCiAgICAgb2JqZWN0dG9sZXJhbmNlPSIxMCINCiAgICAgZ3JpZHRvbGVyYW5jZT0iMTAiDQogICAgIGd1aWRldG9sZXJhbmNlPSIxMCINCiAgICAgaW5rc2NhcGU6cGFnZW9wYWNpdHk9IjAiDQogICAgIGlua3NjYXBlOnBhZ2VzaGFkb3c9IjIiDQogICAgIGlua3NjYXBlOndpbmRvdy13aWR0aD0iMTkyMCINCiAgICAgaW5rc2NhcGU6d2luZG93LWhlaWdodD0iMTE3OCINCiAgICAgaWQ9Im5hbWVkdmlldzM0Ig0KICAgICBzaG93Z3JpZD0iZmFsc2UiDQogICAgIHNob3dndWlkZXM9InRydWUiDQogICAgIGlua3NjYXBlOmd1aWRlLWJib3g9InRydWUiDQogICAgIGlua3NjYXBlOnpvb209IjYwLjQxNiINCiAgICAgaW5rc2NhcGU6Y3g9IjQuOTIzMTA0OCINCiAgICAgaW5rc2NhcGU6Y3k9IjExLjA5NjYzMiINCiAgICAgaW5rc2NhcGU6d2luZG93LXg9IjE5MTIiDQogICAgIGlua3NjYXBlOndpbmRvdy15PSItOCINCiAgICAgaW5rc2NhcGU6d2luZG93LW1heGltaXplZD0iMSINCiAgICAgaW5rc2NhcGU6Y3VycmVudC1sYXllcj0ic3ZnMiI+DQogICAgPHNvZGlwb2RpOmd1aWRlDQogICAgICAgcG9zaXRpb249IjAsMy4xMzY2NjI4Ig0KICAgICAgIG9yaWVudGF0aW9uPSIxLDAiDQogICAgICAgaWQ9Imd1aWRlNDE2NCIgLz4NCiAgICA8c29kaXBvZGk6Z3VpZGUNCiAgICAgICBwb3NpdGlvbj0iMC45ODMxMzMxMSwtMi42Njg1MDQxIg0KICAgICAgIG9yaWVudGF0aW9uPSIxLDAiDQogICAgICAgaWQ9Imd1aWRlNDE2NiIgLz4NCiAgICA8c29kaXBvZGk6Z3VpZGUNCiAgICAgICBwb3NpdGlvbj0iMTkuMDA3MjQsOC43MDc3NTA0Ig0KICAgICAgIG9yaWVudGF0aW9uPSIxLDAiDQogICAgICAgaWQ9Imd1aWRlNDE2OCIgLz4NCiAgICA8c29kaXBvZGk6Z3VpZGUNCiAgICAgICBwb3NpdGlvbj0iNS4wMTUyMjc4LDE1LjAxMjU4Ig0KICAgICAgIG9yaWVudGF0aW9uPSIwLDEiDQogICAgICAgaWQ9Imd1aWRlNDE4MCIgLz4NCiAgICA8c29kaXBvZGk6Z3VpZGUNCiAgICAgICBwb3NpdGlvbj0iMTMuMjQ4ODg5LDEzLjk5Nzk0MyINCiAgICAgICBvcmllbnRhdGlvbj0iMCwxIg0KICAgICAgIGlkPSJndWlkZTQxODIiIC8+DQogICAgPHNvZGlwb2RpOmd1aWRlDQogICAgICAgcG9zaXRpb249IjEyLjY0MDI4MywxMy4wMTQ4MSINCiAgICAgICBvcmllbnRhdGlvbj0iMCwxIg0KICAgICAgIGlkPSJndWlkZTQxODQiIC8+DQogICAgPHNvZGlwb2RpOmd1aWRlDQogICAgICAgcG9zaXRpb249IjEzLjc2Mzg2MywxMi4wMzE2NzciDQogICAgICAgb3JpZW50YXRpb249IjAsMSINCiAgICAgICBpZD0iZ3VpZGU0MTg2IiAvPg0KICAgIDxzb2RpcG9kaTpndWlkZQ0KICAgICAgIHBvc2l0aW9uPSIxMy4wNjE2MjYsMTEuMDAxNzI4Ig0KICAgICAgIG9yaWVudGF0aW9uPSIwLDEiDQogICAgICAgaWQ9Imd1aWRlNDE4OCIgLz4NCiAgICA8c29kaXBvZGk6Z3VpZGUNCiAgICAgICBwb3NpdGlvbj0iMi45OTU4OTUxLDguMDI3Njc0OCINCiAgICAgICBvcmllbnRhdGlvbj0iMSwwIg0KICAgICAgIGlkPSJndWlkZTQxOTAiIC8+DQogICAgPHNvZGlwb2RpOmd1aWRlDQogICAgICAgcG9zaXRpb249IjcuMDAxNDU2NiwxNS42MjUiDQogICAgICAgb3JpZW50YXRpb249IjEsMCINCiAgICAgICBpZD0iZ3VpZGU0MTkyIiAvPg0KICAgIDxzb2RpcG9kaTpndWlkZQ0KICAgICAgIHBvc2l0aW9uPSIxNi45OTg4MDgsNC4xMDQ4NzI5Ig0KICAgICAgIG9yaWVudGF0aW9uPSIxLDAiDQogICAgICAgaWQ9Imd1aWRlNDE5NCIgLz4NCiAgICA8c29kaXBvZGk6Z3VpZGUNCiAgICAgICBwb3NpdGlvbj0iNS4wMTUyMjc4LDExLjc2ODQwNiINCiAgICAgICBvcmllbnRhdGlvbj0iMSwwIg0KICAgICAgIGlkPSJndWlkZTQxOTYiIC8+DQogICAgPHNvZGlwb2RpOmd1aWRlDQogICAgICAgcG9zaXRpb249IjguNDkxMTI4Miw5LjAwNDIzNzMiDQogICAgICAgb3JpZW50YXRpb249IjAsMSINCiAgICAgICBpZD0iZ3VpZGU0MTk4IiAvPg0KICAgIDxzb2RpcG9kaTpndWlkZQ0KICAgICAgIHBvc2l0aW9uPSI3LjI2NjI4NzEsNi45ODQ5MDQ3Ig0KICAgICAgIG9yaWVudGF0aW9uPSIwLDEiDQogICAgICAgaWQ9Imd1aWRlNDIwMCIgLz4NCiAgICA8c29kaXBvZGk6Z3VpZGUNCiAgICAgICBwb3NpdGlvbj0iOC4xMjY5ODYzLDQuOTk4Njc1OSINCiAgICAgICBvcmllbnRhdGlvbj0iMCwxIg0KICAgICAgIGlkPSJndWlkZTQyMDIiIC8+DQogICAgPHNvZGlwb2RpOmd1aWRlDQogICAgICAgcG9zaXRpb249IjguNTI0MjMyLDIuOTk1ODk1MSINCiAgICAgICBvcmllbnRhdGlvbj0iMCwxIg0KICAgICAgIGlkPSJndWlkZTQyMDQiIC8+DQogICAgPHNvZGlwb2RpOmd1aWRlDQogICAgICAgcG9zaXRpb249IjkuMzY4Mzc5MywxNy4wMTUzNiINCiAgICAgICBvcmllbnRhdGlvbj0iMCwxIg0KICAgICAgIGlkPSJndWlkZTQyMDYiIC8+DQogICAgPHNvZGlwb2RpOmd1aWRlDQogICAgICAgcG9zaXRpb249IjkuNTE3MzQ2NCwxLjAwOTY2NjMiDQogICAgICAgb3JpZW50YXRpb249IjAsMSINCiAgICAgICBpZD0iZ3VpZGU0MjA4IiAvPg0KICA8L3NvZGlwb2RpOm5hbWVkdmlldz4NCiAgPGRlZnMNCiAgICAgaWQ9ImRlZnM0Ij4NCiAgICA8aW5rc2NhcGU6cGF0aC1lZmZlY3QNCiAgICAgICBlZmZlY3Q9ImJlbmRfcGF0aCINCiAgICAgICBpZD0icGF0aC1lZmZlY3Q0MjExIg0KICAgICAgIGlzX3Zpc2libGU9InRydWUiDQogICAgICAgYmVuZHBhdGg9Im0gMy4wMDIxNTM0LDcuMDA3MDI4NyAyLjAyNjUxMjksMCINCiAgICAgICBwcm9wX3NjYWxlPSIxLjE2Ig0KICAgICAgIHNjYWxlX3lfcmVsPSJmYWxzZSINCiAgICAgICB2ZXJ0aWNhbD0iZmFsc2UiIC8+DQogICAgPHN0eWxlDQogICAgICAgdHlwZT0idGV4dC9jc3MiDQogICAgICAgaWQ9InN0eWxlNiI+PCFbQ0RBVEFbDQogICAgLnN0cjAge3N0cm9rZTojNDM0MjQyO3N0cm9rZS13aWR0aDoxMH0NCiAgICAuZmlsMiB7ZmlsbDojNDM0MjQyfQ0KICAgIC5maWwxIHtmaWxsOiNGRkZGRkZ9DQogICAgLmZpbDAge2ZpbGw6dXJsKCNpZDApfQ0KICAgXV0+PC9zdHlsZT4NCiAgICA8bGluZWFyR3JhZGllbnQNCiAgICAgICBncmFkaWVudFVuaXRzPSJ1c2VyU3BhY2VPblVzZSINCiAgICAgICBpZD0iaWQwIg0KICAgICAgIHgxPSI0NDkuOTk3OTkiDQogICAgICAgeDI9IjUwIg0KICAgICAgIHkxPSIyNTAiDQogICAgICAgeTI9IjI1MCINCiAgICAgICBncmFkaWVudFRyYW5zZm9ybT0ibWF0cml4KDAuMDQ4NzkxNiwwLDAsMC4wNDY0Nzk0MywtMi4xOTE0OTM4LC0xLjYwMDM4MDUpIj4NCiAgICAgIDxzdG9wDQogICAgICAgICBvZmZzZXQ9IjAiDQogICAgICAgICBzdG9wLWNvbG9yPSIjMDA4QkZGIg0KICAgICAgICAgaWQ9InN0b3A5IiAvPg0KICAgICAgPHN0b3ANCiAgICAgICAgIG9mZnNldD0iMSINCiAgICAgICAgIHN0b3AtY29sb3I9IiMwYWYiDQogICAgICAgICBpZD0ic3RvcDExIiAvPg0KICAgIDwvbGluZWFyR3JhZGllbnQ+DQogIDwvZGVmcz4NCiAgPHJlY3QNCiAgICAgc3R5bGU9ImZpbGw6dXJsKCNpZDApO3N0cm9rZTojNDM0MjQyO3N0cm9rZS13aWR0aDowLjQ3NjIxNDg2Ig0KICAgICBpZD0icmVjdDE0Ig0KICAgICB5PSIwLjI1ODc5NjY5Ig0KICAgICB4PSIwLjI0ODA4NjIiDQogICAgIHdpZHRoPSIxOS41MTY2NCINCiAgICAgcnk9IjAuOTI5NTg4NjIiDQogICAgIHJ4PSIwLjk3NTgzMTk5Ig0KICAgICBoZWlnaHQ9IjE5LjUyMTM2Ig0KICAgICBjbGFzcz0iZmlsMCBzdHIwIiAvPg0KICA8cGF0aA0KICAgICBzdHlsZT0iZmlsbDojZmZmZmZmO3N0cm9rZTojNDM0MjQyO3N0cm9rZS13aWR0aDowLjQ3NTQ3NjIxIg0KICAgICBpbmtzY2FwZTpjb25uZWN0b3ItY3VydmF0dXJlPSIwIg0KICAgICBpZD0icGF0aDE2Ig0KICAgICBkPSJtIDEuNzExNDg1NCwzLjIyOTkzNDcgMTYuNTg5ODQxNiwwIGMgMC4yOTI3NjIsMCAwLjQ4NzkzNiwwLjIzMTY2NyAwLjQ4NzkzNiwwLjQ2MzMzNDEgbCAwLDE0LjU5NTAyMzIgYyAwLDAuMjMxNjY4IC0wLjE5NTE3NCwwLjQ2MzMzNSAtMC40ODc5MzYsMC40NjMzMzUgbCAtMTYuNTg5ODQxNiwwIGMgLTAuMjkyNzYxOSwwIC0wLjQ4NzkzNjUsLTAuMTg1MzM0IC0wLjQ4NzkzNjUsLTAuNDYzMzM1IGwgMCwtMTQuNTk1MDIzMiBjIDAsLTAuMjMxNjY3MSAwLjE5NTE3NDYsLTAuNDYzMzM0MSAwLjQ4NzkzNjUsLTAuNDYzMzM0MSB6Ig0KICAgICBjbGFzcz0iZmlsMSBzdHIwIiAvPg0KICA8cGF0aA0KICAgICBzdHlsZT0iZmlsbDojNDM0MjQyIg0KICAgICBkPSJtIDMuMDAyMTUzNCw2LjAwNTUzNDIgMi4wMjY1MTI5LDAgMCwyLjAwMjk4OSAtMi4wMjY1MTI5LDAgeiINCiAgICAgaWQ9InJlY3QxOCIgLz4NCiAgPHJlY3QNCiAgICAgc3R5bGU9ImZpbGw6IzQzNDI0MiINCiAgICAgaWQ9InJlY3QyMCINCiAgICAgeT0iNi4wMTEyMTM4Ig0KICAgICB4PSI3LjAwNTUyMjciDQogICAgIHdpZHRoPSIxMC4wMDUwODkiDQogICAgIGhlaWdodD0iMS45OTAyNTE1Ig0KICAgICBjbGFzcz0iZmlsMiIgLz4NCiAgPHJlY3QNCiAgICAgc3R5bGU9ImZpbGw6IzQzNDI0MiINCiAgICAgaWQ9InJlY3QyMiINCiAgICAgeT0iOS45OTQ0MzkxIg0KICAgICB4PSIzLjAwMjE1MzYiDQogICAgIHdpZHRoPSIyLjAwOTk2MDkiDQogICAgIGhlaWdodD0iMi4wMDY4MDM1Ig0KICAgICBjbGFzcz0iZmlsMiIgLz4NCiAgPHJlY3QNCiAgICAgc3R5bGU9ImZpbGw6IzQzNDI0MiINCiAgICAgaWQ9InJlY3QyNCINCiAgICAgeT0iOS45OTQ0MzgyIg0KICAgICB4PSI3LjAwNTUyMjciDQogICAgIHdpZHRoPSIxMC4wMDUwODkiDQogICAgIGhlaWdodD0iMi4wMDY4MDM1Ig0KICAgICBjbGFzcz0iZmlsMiIgLz4NCiAgPHJlY3QNCiAgICAgc3R5bGU9ImZpbGw6IzQzNDI0MiINCiAgICAgaWQ9InJlY3QyNiINCiAgICAgeT0iMTQuMDI3Mjc5Ig0KICAgICB4PSIzLjAwMjE1MjQiDQogICAgIHdpZHRoPSIyLjAwOTk2MDkiDQogICAgIGhlaWdodD0iMS45ODE5NzU3Ig0KICAgICBjbGFzcz0iZmlsMiIgLz4NCiAgPHJlY3QNCiAgICAgc3R5bGU9ImZpbGw6IzQzNDI0MiINCiAgICAgaWQ9InJlY3QyOCINCiAgICAgeT0iMTQuMDI3Mjc5Ig0KICAgICB4PSI3LjAwNTUyMjciDQogICAgIHdpZHRoPSIxMC4wMDUwODkiDQogICAgIGhlaWdodD0iMS45NzM2OTk3Ig0KICAgICBjbGFzcz0iZmlsMiIgLz4NCjwvc3ZnPg0K`,
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
			name: 'Источник',
			binding: 'array',
			key: 'rows',
			items: [{
				name: 'Строки',
				type: 'group',
				key: 'rowSettings',
				collapsable: true,
				items:[{
					name: 'Поля идентификации строк',
					type: 'item',
					multiple: true,
					key: 'rowKey',
					binding: 'field',
					editor: 'none'
				},{
					name: 'Фильтрующие поля',
					type: 'item',
					multiple: true,
					key: 'rowFilter',
					binding: 'field',
					editor: 'none'
				},{
					type: 'item',
					key: 'preserveFilteredRows',
					name: 'Не скрывать отфильтрованные строки',
					optional: true,
					editor: 'none'
				},{
					type: 'item',
					key: 'hoverFilteredRows',
					name: 'Обновлять данные при наведении мышкой',
					optional: true,
					editor: 'none'
				},{
					name: 'Отображать первый столбец в виде дерева',
					type: 'group',
					optional: true,
					key: 'useTree',
					items:[{
						name: 'Поля идентификации родительских строк',
						type: 'item',
						multiple: true,
						key: 'parentRowKey',
						binding: 'field',
						editor: 'none'
					}]
				}]
			},{
				name: 'Столбцы',
				type: 'group',
				multiple: 'auto',
				key: 'columns',
				collapsable: true,
				items: [{
					name: 'Название',
					key: 'title',
					type: 'item',
					itemValue: '$field'
				},{
					name: 'Отображение ячейки',
					type: 'select',
					key: 'view',
					items:[{
						name: 'Текст',
						type: 'group',
						key: 'textGroup',
						items:[{
							type: 'item',
							name: 'Значение',
							key: 'text',
							binding: 'field'
						},{
							type: 'item',
							key: 'textSort',
							name: 'Использовать сортировку',
							optional: 'checked',
							editor: 'none'
						},{
							type: 'group',
							key: 'contextFilter',
							name: 'Использовать контексный фильтр',
							optional: true,
							items: [{
								type: 'item',
								key: 'contextFilterFixed',
								name: 'Всегда показывать фильтр',
								optional: true,
								editor: 'none'
							}]
						},{
							type: 'item',
							key: 'textFormat',
							name: 'Форматировать числа',
							optional: true,
							itemValue: '0,0.[00]'
						}]
					},{
						name: 'Встроенный виджет',
						type: 'group',
						key: 'widgetGroup',
						items: [{
							name: 'Виджет',
							key: 'widget',
							type: 'widget',
							collapsable: true
						},{
							type: 'item',
							key: 'widgetSort',
							name: 'Использовать сортировку',
							optional: true,
							multiple: true,
							binding: 'field',
							editor: 'none'
						},{
							type: 'group',
							key: 'widgetContextFilter',
							name: 'Использовать контексный фильтр',
							optional: true,
							items: [{
								type: 'item',
								key: 'widgetContextFilterField',
								name: 'Фильтровать по полю',
								binding: 'field',
								editor: 'none'
							},{
								type: 'item',
								key: 'widgetСontextFilterFixed',
								name: 'Всегда показывать фильтр',
								optional: true,
								editor: 'none'
							}]
						}]
					}]
				},{
					name: 'Отображать в строке статуса сводный показатель',
					type: 'group',
					optional: true,
					multiple: true,
					key: 'summary',
					items: [{
						name: 'Операция',
						type: 'select',
						key: 'summaryOp',
						items: [{
							type: 'item',
							name: 'Количество',
							key: 'summaryOpCount',
							itemValue: 'count',
							editor: 'none'
						},{
							type: 'item',
							name: 'Сумма',
							key: 'summaryOpSum',
							itemValue: 'sum',
							editor: 'none'
						},{
							type: 'item',
							name: 'Минимум',
							key: 'summaryOpMin',
							itemValue: 'min',
							editor: 'none'
						},{
							type: 'item',
							name: 'Максимум',
							key: 'summaryOpMax',
							itemValue: 'max',
							editor: 'none'
						},{
							type: 'item',
							name: 'Среднее',
							key: 'summaryOpAvg',
							itemValue: 'avg',
							editor: 'none'
						}]
					},{
						type: 'item',
						name: 'Префикс',
						key: 'summaryPrefix',
						itemValue: 'Итого'
					},{
						type: 'item',
						name: 'Суффикс',
						key: 'summaryPostfix'
					}]
				},{
					name: 'Стиль ячейки',
					type: 'group',
		            collapsable: true,
		            collapsed: true,
					key: 'cellAlign',
					items:[{
						name: 'Горизонтальное выравнивание',
						type: 'select',
						key: 'alignHorz',
						items: [{
							type: 'item',
							name: 'По левому краю',
							key: 'left',
							itemValue: 'left',
							editor: 'none'
						},{
							type: 'item',
							name: 'Посередине',
							key: 'center',
							itemValue: 'center',
							editor: 'none'
						},{
							type: 'item',
							name: 'По правому краю',
							key: 'right',
							itemValue: 'right',
							editor: 'none'
						}]
					},{
						name: 'Вертикальное выравнивание',
						type: 'select',
						key: 'alignVert',
						items: [{
							type: 'item',
							name: 'Сверху',
							key: 'top',
							itemValue: 'top',
							editor: 'none'
						},{
							type: 'item',
							name: 'Посередине',
							key: 'middle',
							itemValue: 'middle',
							editor: 'none'
						},{
							type: 'item',
							name: 'Снизу',
							key: 'bottom',
							itemValue: 'bottom',
							editor: 'none'
						}]
					},{
						name: 'CSS стиль ячейки',
						type: 'item',
						optional: true,
						itemValue: `/* Заполните объект CSS значениями */
{
	font-family: 'arial';
}`,
						key: 'css',
						editor: 'JSB.Widgets.MultiEditor',
						options: {
							valueType: 'org.jsbeans.types.Css'
						}
					}]
					
				},{
					name: 'Стиль заголовка',
					type: 'group',
		            collapsable: true,
		            collapsed: true,
					key: 'headerAlign',
					items:[{
						name: 'Горизонтальное выравнивание',
						type: 'select',
						key: 'hAlignHorz',
						items: [{
							type: 'item',
							name: 'По левому краю',
							key: 'left',
							itemValue: 'left',
							editor: 'none'
						},{
							type: 'item',
							name: 'Посередине',
							key: 'center',
							itemValue: 'center',
							editor: 'none'
						},{
							type: 'item',
							name: 'По правому краю',
							key: 'right',
							itemValue: 'right',
							editor: 'none'
						}]
					},{
						name: 'Вертикальное выравнивание',
						type: 'select',
						key: 'hAlignVert',
						items: [{
							type: 'item',
							name: 'Сверху',
							key: 'top',
							itemValue: 'top',
							editor: 'none'
						},{
							type: 'item',
							name: 'Посередине',
							key: 'middle',
							itemValue: 'middle',
							editor: 'none'
						},{
							type: 'item',
							name: 'Снизу',
							key: 'bottom',
							itemValue: 'bottom',
							editor: 'none'
						}]
					},{
						name: 'CSS стиль заголовка',
						type: 'item',
						optional: true,
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
					
				},{
					name: 'Ширина столбца',
					type: 'item',
					itemValue: 'auto',
					key: 'colWidth'
				}]
			}]
		}]
	},
	
	$client: {
		$require: ['JSB.Widgets.ScrollBox', 
		           'JSB.Crypt.MD5',
		           'DataCube.Controls.SortSelector',
		           'DataCube.Controls.FilterEntry',
		           'JSB.Numeral',
		           'JQuery.UI.Loader'],
		
		ready: false,
		headerDesc: [],
		colDesc: [],
		rows: [],
		rowKeyMap: {},
		rowFilterFields: [],
		widgetMap: {},
		blockFetch: true,
		rowAppending: false,
		preFetching: false,
		stopPreFetch: false,
		scrollHeight: 0,
		paneHeight: 0,
		
		$constructor: function(opts){
			$base(opts);
			
			this.addClass('tableWidget');
			this.loadCss('Table.css');
			Numeral.setLocale('ru');
			
			this.messageBox = this.$('<div class="message hidden"></div>');
			this.append(this.messageBox);
			
			
			this.header = this.$('<table class="header" cellpadding="0" cellspacing="0"><colgroup></colgroup><thead><tr></tr></thead></table>');
			this.append(this.header);
			
			this.scroll = new ScrollBox({
				onScroll: function(){
					var scrollY = $this.scroll.getScrollPosition().y;
					if( $this.paneHeight - ($this.scrollHeight - scrollY) > 0.3 * $this.scrollHeight){
						return;
					}
					
					$this.appendRows();
				}
			});
			this.scroll.addClass('pane');
			this.append(this.scroll);
			
			this.status = this.$('<table class="status" cellpadding="0" cellspacing="0"><colgroup></colgroup><tfoot><tr></tr></tfoot></table>');
			this.append(this.status);

			
			this.append('<div class="noDataMessage">Нет данных</div>');
			
			JSB.loadScript('tpl/d3/d3.min.js', function(){
				$this.scroll.ensureTrigger('ready', function(){
					$this.scroll.append('<table class="rows" cellpadding="0" cellspacing="0"><colgroup></colgroup><tbody></tbody></table>');

					$this.rowFilterTool = this.$('<div class="rowFilterTool hidden"><div class="and">И</div><div class="or">ИЛИ</div><div class="not">НЕ</div></div>');
					$this.scroll.append($this.rowFilterTool);
					$this.rowFilterTool.on({
						'mouseover': function(evt){
							$this.onRowFilterOver(evt);
						},
						'mouseout': function(evt){
							$this.onRowFilterOut(evt);
						}
					});
					
					$this.rowFilterTool.find('> div.and').click(function(){
						$this.onFilterClick($this.highlightedRowData, '$and', '$eq');
					});

					$this.rowFilterTool.find('> div.or').click(function(){
						$this.onFilterClick($this.highlightedRowData, '$or', '$eq');
					});

					$this.rowFilterTool.find('> div.not').click(function(){
						$this.onFilterClick($this.highlightedRowData, '$and', '$ne');
					});

					$this.header.resize(function(){
						if(!$this.getElement().is(':visible')){
							return;
						}
						$this.updateHeaderSize();
					});
					
					$this.status.resize(function(){
						if(!$this.getElement().is(':visible')){
							return;
						}
						$this.updateStatusSize();
					});

					$this.scroll.getElement().resize(function(){
						if(!$this.getElement().is(':visible')){
							return;
						}
						$this.scrollHeight = $this.scroll.getElement().height();
						$this.appendRows();
					});
					
					$this.scroll.getPane().resize(function(){
						if(!$this.getElement().is(':visible')){
							return;
						}
						$this.paneHeight = $this.scroll.getPane().height();
						$this.header.width($this.scroll.getPane().width());
						$this.status.width($this.scroll.getPane().width());
					});
/*					
					if(!$this.scrollHeight){
						JSB.deferUntil(function(){
							$this.scrollHeight = $this.scroll.getElement().height();
						}, function(){
							return $this.scroll.getElement().height() > 0;
						});
					}
*/
					$this.ready = true;
					$this.setInitialized();
				});
			});
			
		},
		
		updateHeaderSize: function(){
			if($this.header.is(':visible')){
				$this.scroll.getPane().css('padding-top', $this.header.height());
			} else {
				$this.scroll.getPane().css('padding-top', 0);
			}
		},
		
		updateStatusSize: function(){
			if($this.status.is(':visible')){
				$this.scroll.getPane().css('padding-bottom', $this.status.height());
			} else {
				$this.scroll.getPane().css('padding-bottom', 0);
			}
		},

		
		getColumnNames: function(){
			var names = [];
			this.getContext().find('title').each(function(){
				names.push(this.value());
			});
			return names;
		},
		
		appendRows: function(bRefresh){
			if(!$this.ready || this.rowAppending || $this.blockFetch || !$this.scroll.getElement().is(':visible')){
				return;
			}
			this.rowAppending = true;
			var fetchSize = 10;
			
			if(bRefresh){
				if(this.rows.length > 0){
					fetchSize = this.rows.length;
				}
				this.rows = [];
				this.rowKeyMap = {};
			} else {
				// check scroll
				var scrollPos = $this.scroll.getScrollPosition();
				if(!scrollPos){
					this.rowAppending = false;
					return;
				}
				var scrollY = scrollPos.y;
				if( $this.paneHeight - ($this.scrollHeight - scrollY) > 0.3 * $this.scrollHeight){
					this.rowAppending = false;
					return;
				}
			}
			
			this.fetchRowsBatch(fetchSize, function(rows, fail){
				if(fail){
					JSB.getLogger().error(fail);
					$this.rowAppending = false;
					return;
				}
				if(!rows || $this.blockFetch){
					$this.rowAppending = false;
					return;
				}
				
				// prepare rows
				var pRows = [];
				var idxOffset = $this.rows.length;
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
					rowDesc.position = idxOffset + pRows.length;
					pRows.push(rowDesc);
					$this.rowKeyMap[key] = rowDesc;
					
					// proceed widgets
					for(var j = 0; j < $this.colDesc.length; j++){
						row[j].rowKey = key;
						if($this.colDesc[j].widget){
							var colName = $this.colDesc[j].title;
							if($this.widgetMap[key] && $this.widgetMap[key][colName] && $this.widgetMap[key][colName].getJsb().$name == $this.colDesc[j].widget.jsb){
								$this.widgetMap[key][colName].setWrapper($this.getWrapper(), row[j].value);
								$this.widgetMap[key][colName].refresh();
							} else {
								var WidgetCls = $this.colDesc[j].widget.cls;
								if(WidgetCls){
									var widget = new WidgetCls();
									widget.setWrapper($this.getWrapper(), row[j].value);
									widget.refresh();
									if(!$this.widgetMap[key]){
										$this.widgetMap[key] = {};
									}
									$this.widgetMap[key][colName] = widget;
								}
							}
						}
					}
				}
				
				if(pRows.length == 0 && !bRefresh){
					$this.rowAppending = false;
					return;
				}
				
				$this.rows = $this.rows.concat(pRows);
				
				// accociate with DOM
				var tbody = d3.select($this.scroll.getElement().get(0)).select('._dwp_scrollPane > table').select('tbody');
				var rowsSel = tbody.selectAll('tr.row');
				var rowsSelData = rowsSel.data($this.rows, function(d){ return d ? d.key : $this.$(this).attr('key');});
				rowsSelData.each(function(d){
					d3.select(this)
						.classed('main', !!d.flags.main)
						.classed('back', !!d.flags.back)
						.classed('hover', !!d.flags.hover)
						.classed('rowFilter', d.filter && d.filter.length > 0)
						.attr('pos', function(d){return d.position;})
						/*.on('click',function(d){
							if(!d.filter || d.filter.length == 0){
								return;
							}
							$this.onRowClick(d);
						})
						.on('mouseover', function(d){
							if(!d.filter || d.filter.length == 0){
								return;
							}
							$this.onRowHover(d, $this.$(this));
						})
						.on('mouseout', function(d){
							if(!d.filter || d.filter.length == 0){
								return;
							}
							$this.onRowOut(d, $this.$(this));
						})*/;
				});
				rowsSelData.order();

				
				var rowsSelDataColData = rowsSelData.selectAll('td.col').data(function(d){ return d.row; }, function(d){ return d ? d.key: $this.$(this).attr('key')});
				
				rowsSelDataColData
					.attr('style', function(d){ return $this.colDesc[d.colIdx].style.cssStyle})
					.attr('type', function(d){return $this.colDesc[d.colIdx].widget ? 'widget':'text'})
					.style('text-align', function(d){ return $this.colDesc[d.colIdx].style.alignHorz})
					.style('vertical-align', function(d){ return $this.colDesc[d.colIdx].style.alignVert});
			
				rowsSelDataColData.each(function(d){
					var tdCell = d3.select(this);
					var cell = tdCell.select('div.cell');
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
						var val = null;
						var mainVal = d.value.main;
						var backVal = d.value.back;
						var hoverVal = d.value.hover;
						
						if(JSB.isDefined(mainVal)){
							val = mainVal;
						} else if(JSB.isDefined(backVal)){
							if(JSB.isNumber(backVal)){
								val = 0;
							} else {
								val = backVal;
							}
						}
						
						var fVal = val;
						if(JSB.isNumber(val) && $this.colDesc[d.colIdx].format){
							fVal = Numeral.format(val, $this.colDesc[d.colIdx].format)
						}
						cellEl.text(fVal);
						cellEl.attr('title', val);
						
						if(cellEl.attr('widget')){
							cellEl.removeAttr('widget');
						}
						
						// destroy previously created widget
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
					.attr('type', function(d){ return $this.colDesc[d.colIdx].widget ? 'widget':'text'})
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
									var val = null;
									var mainVal = d.value.main;
									var backVal = d.value.back;
									var hoverVal = d.value.hover;
									
									if(JSB.isDefined(mainVal)){
										val = mainVal;
									} else if(JSB.isDefined(backVal)){
										if(JSB.isNumber(backVal)){
											val = 0;
										} else {
											val = backVal;
										}
									}
									
									var fVal = val;
									if(JSB.isNumber(val) && $this.colDesc[d.colIdx].format){
										fVal = Numeral.format(val, $this.colDesc[d.colIdx].format)
									}
									
									cellEl.attr('title', val);
									cellEl.text(fVal);
								}
							});
					
				
				
				

				// destroy widgets
				rowsSelData.exit()
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
						
				rowsSelData.exit()
					.remove();
				
				rowsSelData
					.enter()
						.append('tr')
							.classed('row', true)
							.classed('main', function(d){return !!d.flags.main;})
							.classed('back', function(d){return !!d.flags.back;})
							.classed('hover', function(d){return !!d.flags.hover;})
							.attr('pos', function(d){return d.position;})
							.classed('rowFilter', function(d){return d.filter && d.filter.length > 0})
							.on('click',function(d){
								if(!d.filter || d.filter.length == 0){
									return;
								}
								$this.onRowClick(d);
							})
							.on('mouseover', function(d){
								if(!d.filter || d.filter.length == 0){
									return;
								}
								$this.onRowHover(d, $this.$(this));
							})
							.on('mouseout', function(d){
								if(!d.filter || d.filter.length == 0){
									return;
								}
								$this.onRowOut(d, $this.$(this));
							})
							.attr('key', function(d){ return d.key;})
							.selectAll('td.col').data(function(d){ return d.row; }, function(d){ return d ? d.key: $this.$(this).attr('key')})
							.enter()
								.append('td')
									.classed('col', true)
									.attr('key', function(d){ return d.key;})
									.attr('style', function(d){ return $this.colDesc[d.colIdx].style.cssStyle})
									.attr('type', function(d){ return $this.colDesc[d.colIdx].widget ? 'widget':'text'})
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
												var val = null;
												var mainVal = d.value.main;
												var backVal = d.value.back;
												var hoverVal = d.value.hover;
												
												if(JSB.isDefined(mainVal)){
													val = mainVal;
												} else if(JSB.isDefined(backVal)){
													if(JSB.isNumber(backVal)){
														val = 0;
													} else {
														val = backVal;
													}
												}
												
												var fVal = val;
												if(JSB.isNumber(val) && $this.colDesc[d.colIdx].format){
													fVal = Numeral.format(val, $this.colDesc[d.colIdx].format)
												}
												
												cellEl.text(fVal);
												cellEl.attr('title', val);
											}
										});

				$this.rowAppending = false;
				if(pRows.length > 0){
					var lastRow = $this.rows[$this.rows.length - 1];
					var lastRowElt = $this.find('.row[key="'+lastRow.key+'"]');
					JSB.deferUntil(function(){
						$this.appendRows();	
					}, function(){
						if(!$this.getElement().is(':visible')){
							return true;
						}
						return lastRowElt.width() > 0 && lastRowElt.height() > 0;
					});
				}
				$this.classed('noData', $this.rows.length == 0);
			});
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
			var rowFilterSelector = this.getContext().find('rowFilter');
			var rowFilterBinding = rowFilterSelector.binding();
			var gArr = this.getContext().find('columns').values();
			for(var i = 0; i < gArr.length; i++){
				var valueSelector = gArr[i].get(1).value();
				var colType = valueSelector.key();
				cols.push({
					colName: $this.colDesc[i].title,
					colKey: $this.colDesc[i].key,
					colType: colType,
					valueSelector: valueSelector,
					textSelector: $this.colDesc[i].textSelector
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
					var rowFlags = {};
					// construct key
					var rowKey = null;
					var keyValsMain = rowKeySelector.values();
					var keyValsBack = rowKeySelector.values('back');
					for(var i = 0; i < Math.max(keyValsMain.length, keyValsBack.length); i++){
						var keyVal = keyValsMain[i];
						if(!JSB.isDefined(keyVal)){
							keyVal = keyValsBack[i];
						}
						if(!keyVal){
							continue;
						}
						if(!rowKey){
							rowKey = '';
						}
						rowKey += MD5.md5('' + keyVal);
					}	
					// construct row filter
					var rowFilter = [];
					var rowFilterValsMain = rowFilterSelector.values();
					var rowFilterValsBack = rowFilterSelector.values('back');
					for(var i = 0; i < Math.max(rowFilterValsMain.length, rowFilterValsBack.length); i++){
						if(rowFilterBinding[i]){
							var val = rowFilterValsMain[i];
							if(!val){
								val = rowFilterValsBack[i];
							}
							rowFilter.push({field: rowFilterBinding[i], value: val});
						}
					}
					
					// iterate by cells
					for(var i = 0; i < gArr.length; i++){
						var rDesc = {
							key: cols[i].colKey,
							column: cols[i].colName,
							colIdx: i
						};
						if(cols[i].colType == 'textGroup'){
							var colSel = cols[i].textSelector;
							var mainValue = colSel.value();
							var backValue = colSel.value('back');
							var hoverValue = colSel.value('hover');
							if(JSB.isDefined(mainValue)){
								rowFlags.main = true;
							}
							if(JSB.isDefined(backValue)){
								rowFlags.back = true;
							}
							if(JSB.isDefined(hoverValue)){
								rowFlags.hover = true;
							}
							rDesc.value = {main: mainValue, back: backValue, hover: hoverValue};
						} else if(cols[i].colType == 'widgetGroup'){
							var vals = JSB.clone($this.colDesc[i].widget.values.unwrap());
							rDesc.value = vals;
						}
						
						row.push(rDesc);	// push cell
					}
					rows.push({row: row, key: rowKey, filter: rowFilter, flags: rowFlags});
					if(rows.length >= batchSize){
						$this.stopPreFetch = false;
						
						preFetch();
						
						callback.call($this, rows);
						return;
					}
				}
				if(rowsContext.isReset()){
					$this.setDeferredLoader();
				}
				rowsContext.fetch({batchSize: batchSize - rows.length},function(data, fail){
					$this.cancelDeferredLoader();
					if(data && data.length){
						iterateRows();
					} else {
						$this.stopPreFetch = false;
						callback.call($this, rows, fail);
					}
				});
			}
			
			iterateRows();
		},
		
		setDeferredLoader: function(){
			JSB.defer(function(){
				$this.getElement().loader();
				$this.deferredLoader = true;
			}, 600, 'deferredLoader_' + $this.getId());
		},
		
		cancelDeferredLoader: function(){
			if($this.deferredLoader){
				$this.deferredLoader = false;
				$this.getElement().loader('hide');
			} else {
				JSB.cancelDefer('deferredLoader_' + $this.getId());
			}
		},
		
		onRowClick: function(d){
			// remove all filters with
			var filters = this.getFilters();
			var idsToRemove = [];
			for(var i = 0; i < d.filter.length; i++){
				var fName = d.filter[i].field;
				for(var fId in filters){
					if(filters[fId].field == fName){
						idsToRemove.push(fId);
					}
				}
			}
			for(var i = 0; i < idsToRemove.length; i++){
				this.removeFilter(idsToRemove[i], true);
			}
			$this.onFilterClick(d, '$and', '$eq');
		},
		
		onFilterClick: function(d, type, op){
			var binding = this.getContext().find('rows').binding();
			if(!binding.source){
				return;
			}
			var bNeedRefresh = false;
			for(var i = 0; i < d.filter.length; i++){
				var fDesc = {
					sourceId: binding.source,
					type: type,
					op: op,
					field: d.filter[i].field,
					value: d.filter[i].value
				};
				if(!this.hasFilter(fDesc)){
					this.addFilter(fDesc);
					bNeedRefresh = true;
				}
			}
			if(bNeedRefresh){
				this.refreshAll();
			}
		},
		
		onRowFilterOver: function(){
			$this.rowfilterOver = true;
			var deferRowKey = 'rowOut' + $this.highlightedRowKey + $this.getId();
			JSB.cancelDefer(deferRowKey);
		},
		
		onRowFilterOut: function(){
			$this.rowfilterOver = false;
			var deferRowKey = 'rowOut' + $this.highlightedRowKey + $this.getId();
			var rowElt = $this.scroll.find('tr.row[key="'+$this.highlightedRowKey+'"]');
			JSB.defer(function(){
				rowElt.removeClass('highlight');
				$this.rowFilterTool.addClass('hidden');
				$this.highlightedRowKey = null;
			}, 100, deferRowKey);
		},
		
		onRowOut: function(d, rowElt){
			var rowKey = rowElt.attr('key');
			if(rowKey != $this.highlightedRowKey && !$this.rowfilterOver){
				return;
			}
			var deferRowKey = 'rowOut' + rowKey + $this.getId();
			JSB.defer(function(){
				rowElt.removeClass('highlight');
				$this.rowFilterTool.addClass('hidden');
				$this.highlightedRowKey = null;
			}, 100, deferRowKey);
		},
		
		onRowHover: function(d, rowElt){
			var rowKey = rowElt.attr('key');
			if($this.highlightedRowKey){
				var existedDeferKey = 'rowOut' + $this.highlightedRowKey + $this.getId();
				JSB.cancelDefer(existedDeferKey);
			}
			if(rowKey == $this.highlightedRowKey){
				return;
			}
			if($this.highlightedRowKey){
				var oldRowElt = $this.scroll.find('tr.row[key="'+$this.highlightedRowKey+'"]');
				oldRowElt.removeClass('highlight');
			}

			rowElt.addClass('highlight');
			$this.highlightedRowKey = rowKey;
			$this.highlightedRowData = d;
			
			// prepare tool buttons
			var bRowExisted = !!d.flags.main;
			
			// check if filter has already been applied for the fields
			var sameFieldMap = {};
			var otherFieldMap = {};
			for(var i = 0; i < d.filter.length; i++){
				sameFieldMap[d.filter[i].field] = d.filter[i].value;
				otherFieldMap[d.filter[i].field] = d.filter[i].value;
			}
			var filters = this.getFilters();
			for(var fId in filters){
				var fDesc = filters[fId];
				
				if(JSB.isDefined(sameFieldMap[fDesc.field]) && sameFieldMap[fDesc.field] == fDesc.value){
					delete sameFieldMap[fDesc.field];
				}
				if(JSB.isDefined(otherFieldMap[fDesc.field]) && otherFieldMap[fDesc.field] != fDesc.value){
					delete otherFieldMap[fDesc.field];
				}
			}
			var bSameApplied = (Object.keys(sameFieldMap).length == 0);
			var bOtherApplied = (Object.keys(otherFieldMap).length == 0);
			
			var bAnd = bOtherApplied && !bSameApplied && bRowExisted;
			var bOr = !bRowExisted && !bSameApplied;
			var bNot = bRowExisted && !bSameApplied;
			
			if(!bAnd && !bOr && !bNot){
				$this.rowFilterTool.addClass('hidden');
				return;
			}
			
			$this.rowFilterTool.attr('and', bAnd);
			$this.rowFilterTool.attr('or', bOr);
			$this.rowFilterTool.attr('not', bNot);
			
			var scrollPane = $this.scroll.find('> ._dwp_scrollPane');
			var offset = scrollPane.css('padding-top');
			if(offset && offset.length > 0){
				offset = parseInt(offset);
				if(JSB.isNaN(offset)){
					offset = 0;
				}
			}
			var paneRc = scrollPane.get(0).getBoundingClientRect();
			var rowRc = rowElt.get(0).getBoundingClientRect();
			var scrollRc = $this.scroll.getElement().get(0).getBoundingClientRect();
			var pX = rowRc.left - paneRc.left;
			var pY = rowRc.top - paneRc.top;
			var vAlign = 'top';
			
			if(rowRc.top - scrollRc.top < offset + 20){
				pY = rowRc.bottom - paneRc.top - 1;
				vAlign = 'bottom';
			}
			
			$this.rowFilterTool.removeClass('hidden');
			$this.rowFilterTool.attr('valign', vAlign);

			$this.rowFilterTool.css({left: pX, top: pY});
		},
		
		updateRows: function(){
			this.blockFetch = true;
			var rowsContext = this.getContext().find('rows');
			if($this.preFetching || $this.rowAppending){
				$this.stopPreFetch = true;
				JSB.deferUntil(function(){
					$this.updateRows();
				}, function(){
					return !$this.preFetching && !$this.rowAppending;
				});
				return;
			}
			rowsContext.reset();
			
			var colGroup = d3.select($this.scroll.getElement().get(0)).select('._dwp_scrollPane > table').select('colgroup');
			var colGroupData = colGroup.selectAll('col').data($this.colDesc, function(d){ return d ? d.key : this.attr('key')});
			
			colGroupData.enter()
				.append('col')
					.attr('key', function(d){return d.key;})
					.style('width', function(d){ return '' + d.size + '%'});
			
			colGroupData.exit().remove();
			colGroupData.each(function(d){
				d3.select(this).style('width', function(d){ return '' + d.size + '%'});
			});
			colGroupData.order();
			this.blockFetch = false;
			this.appendRows(true);
		},
		
		updateStatus: function(){
			var useStatus = false;
			for(var j = 0; j < $this.colDesc.length; j++){
				if($this.colDesc[j].status){
					useStatus = true;
					break;
				}
			}
			if(useStatus){
				this.addClass('hasStatus');
			} else {
				this.removeClass('hasStatus');
				return;
			}
			
			var statusTable = d3.select($this.status.get(0));
			var colGroup = statusTable.select('colgroup').selectAll('col');

			var dataColGroup = colGroup.data($this.colDesc, function(d){ return d ? d.key : this.attr('key')});
			dataColGroup.enter()
				.append('col')
					.attr('key', function(d){ return d.key;})
					.style('width', function(d){ return '' + d.size + '%'});
			dataColGroup.exit()
				.remove();
			dataColGroup.each(function(d){
				d3.select(this).style('width', function(d){ return '' + d.size + '%'});
			});
			dataColGroup.order();

			var rowsBody = statusTable.select('tfoot').select('tr');
			var colData = rowsBody.selectAll('td.col').data($this.colDesc, function(d){ return d ? d.key : this.attr('key')});
			
			function injectStatusEntries(container, statusArr){
				if(statusArr && statusArr.length > 0){
					for(var i = 0; i < statusArr.length; i++){
						var statusDesc = statusArr[i];
						var sEntry = $this.$('<div class="sEntry"></div>');
						container.append(sEntry);
						if(statusDesc.summaryPrefix && statusDesc.summaryPrefix.length > 0){
							sEntry.append($this.$('<div class="prefix"></div>').text(statusDesc.summaryPrefix));
						}
						sEntry.append($this.$('<div class="value"></div>').text(0));
						if(statusDesc.summaryPostfix && statusDesc.summaryPostfix.length > 0){
							sEntry.append($this.$('<div class="postfix"></div>').text(statusDesc.summaryPostfix));
						}
					}
				}
			}

			colData
				.each(function(d){
					var elt = $this.$(this);
					elt.empty();
					injectStatusEntries(elt, d.status);
				});
				
			colData.enter()
				.append('td')
					.classed('col', true)
					.attr('key', function(d){ return d.key;})
					.each(function(d){
						var elt = $this.$(this);
						injectStatusEntries(elt, d.status);
					});
			
			colData.exit()
				.remove();
			
			colData.order();

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
					dataColGroup.each(function(d){
						d3.select(this).style('width', function(d){ return '' + d.size + '%'});
					});
					dataColGroup.order();

					var rowsBody = headerTable.select('thead').select('tr');
					var colData = rowsBody.selectAll('th.col').data($this.colDesc, function(d){ return d ? d.key : this.attr('key')});

					colData
						.attr('style', function(d){ return d.hStyle.cssStyle})
						.style('text-align', function(d){ return d.hStyle.alignHorz})
						.style('vertical-align', function(d){ return d.hStyle.alignVert})
						.each(function(d){
							var elt = $this.$(this);
							var hWrapper = elt.find('> .hWrapper');
							elt.find('> .hWrapper > .text').text(d.title);
							
							// sort
							var sortSelector = hWrapper.find('> .sortSelector').jsb();
							if(d.sortFields && d.sortFields.length > 0){
								if(!sortSelector){
									sortSelector = new SortSelector({
										onChange: function(q){
											$this.updateOrder(this, q);
										}
									});
									hWrapper.append(sortSelector.getElement());
								}
								sortSelector.setFields(d.sortFields);
								elt.addClass('sortable');
							} else {
								if(sortSelector){
									sortSelector.destroy();
								}
								elt.removeClass('sortable');
							}
							
							// filter
							var filterEntry = elt.find('> .filterEntry').jsb();
							var filterButtonElt = hWrapper.find('> .filterButton');
							if(d.contextFilterField && d.contextFilterFieldType){
								elt.addClass('contextFilter');
								if(!filterEntry){
									filterEntry = new FilterEntry({
										onChange: function(filter){
											$this.updateContextFilter(filter);
										}
									});
									elt.append(filterEntry.getElement());
								}
								if(d.contextFilterFixed){
									elt.addClass('contextFilterFixed');
									if(filterButtonElt.length > 0){
										filterButtonElt.remove();
									}
								} else {
									elt.removeClass('contextFilterFixed');
									if(filterButtonElt.length == 0){
										filterButtonElt = $this.$('<div class="filterButton"></div>');
										hWrapper.append(filterButtonElt);
										filterButtonElt.click(function(){
											elt.toggleClass('filtered');
											if(elt.hasClass('filtered')){
												var filter = filterEntry.getFilter();
												$this.updateContextFilter(filter);
												filterEntry.setFocus();
											} else {
												// clear field filter
												var filter = {};
												filter[d.contextFilterField] = null;
												$this.updateContextFilter(filter);
											}
										});
									}
								}
								filterEntry.setField(d.contextFilterField, d.contextFilterFieldType);
							} else {
								elt.removeClass('contextFilter');
								if(filterEntry){
									filterEntry.destroy();
								}
								if(filterButtonElt.length > 0){
									filterButtonElt.remove();
								}
							}
						});
						
					colData.enter()
						.append('th')
							.classed('col', true)
							.attr('key', function(d){ return d.key;})
							.attr('style', function(d){ return d.hStyle.cssStyle})
							.style('text-align', function(d){ return d.hStyle.alignHorz})
							.style('vertical-align', function(d){ return d.hStyle.alignVert})
							.each(function(d){
								var elt = $this.$(this);
								var hWrapper = $this.$('<div class="hWrapper"></div>');
								elt.append(hWrapper);
								hWrapper.append($this.$('<div class="text"></div>').text(d.title));
								
								// sort
								if(d.sortFields && d.sortFields.length > 0){
									elt.addClass('sortable');
									var sortSelector = new SortSelector({
										onChange: function(q){
											$this.updateOrder(this, q);
										}
									});
									hWrapper.append(sortSelector.getElement());
									sortSelector.setFields(d.sortFields);
								}
								
								// filter
								if(d.contextFilterField && d.contextFilterFieldType){
									elt.addClass('contextFilter');
									var filterEntry = new FilterEntry({
										onChange: function(filter){
											$this.updateContextFilter(filter);
										}
									});
									elt.append(filterEntry.getElement());
									
									if(d.contextFilterFixed){
										elt.addClass('contextFilterFixed');
									} else {
										var filterButtonElt = $this.$('<div class="filterButton"></div>');
										hWrapper.append(filterButtonElt);
										filterButtonElt.click(function(){
											elt.toggleClass('filtered');
											if(elt.hasClass('filtered')){
												var filter = filterEntry.getFilter();
												$this.updateContextFilter(filter);
												filterEntry.setFocus();
												filterEntry.setFocus();
											} else {
												var filter = {};
												filter[d.contextFilterField] = null;
												$this.updateContextFilter(filter);
											}
										});
									}
									filterEntry.setField(d.contextFilterField, d.contextFilterFieldType);
								}
							});
					
					colData.exit()
						.remove();
					
					colData.order();
				}
				
			} else {
				this.removeClass('hasHeader');
			}
			$this.updateHeaderSize();
		},
		
		updateOrder: function(sortSelector, sortQuery){
			var sortSels = this.header.find('.sortSelector');
			sortSels.each(function(){
				var curSel = $this.$(this).jsb();
				if(curSel != sortSelector){
					curSel.clear();
				}
			});
			this.setSort(sortQuery);
			this.refresh();
		},
		
		updateContextFilter: function(q){
			var curFilter = this.getContextFilter();
			var bChanged = false;
			for(var f in q){
				if(q[f] && Object.keys(q[f]).length > 0){
					curFilter[f] = q[f];
					bChanged = true;
				} else {
					if(curFilter[f]){
						delete curFilter[f];
						bChanged = true;
					}
				}
			}
			if(bChanged){
				this.setContextFilter(curFilter);
				this.refresh();
			}
		},
		
		showMessage: function(txt){
			this.messageBox.empty();
			this.messageBox.append(txt);
			this.messageBox.removeClass('hidden');
		},
		
		hideMessage: function(){
			this.messageBox.addClass('hidden');
		},
		
		refresh: function(opts){
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
			
			$base();
			this.hideMessage();
			$this.rowFilterTool.addClass('hidden');
			$this.highlightedRowKey = null;

			// update col sizes
			var colSizes = [];
			var fixedSize = 0;
			var fixedCount = 0;
			var gArr = this.getContext().find('columns').values();
			for(var i = 0; i < gArr.length; i++){
				var colSize = gArr[i].find('colWidth').value();
				if(colSize && colSize != 'auto' || !isNaN(parseFloat(colSize))){
					colSize = parseFloat(colSize);
					fixedSize += colSize;
					fixedCount++;
					colSizes.push(colSize);
				} else {
					colSizes.push(0);
				}
			}
			var colSzPrc = 0;
			if(gArr.length - fixedCount > 0){
				colSzPrc = (100.0 - fixedSize) / (gArr.length - fixedCount);
			}
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
			
			// check rowKey
			var rowKeySelector = this.getContext().find('rowKey');
			var rowKeyFields = [];
			if(rowKeySelector.used()){
				rowKeyFields = rowKeySelector.binding();
			}
			for(var i = rowKeyFields.length - 1; i >= 0; i--){
				if(!rowKeyFields[i]){
					rowKeyFields.splice(i, 1);
				}
			}
			if(rowKeyFields.length == 0){
				this.showMessage('<strong>Внимание!</strong><br />Не назначены ключевые поля для идентификации строк таблицы.<br />Пожалуйста выберите в настройках виджета одно или несколько полей, сочетание которых будет определять уникальность каждой строки таблицы.');
			} else {
				this.setKeyColumns(rowKeyFields);
			}
			
			for(var i = 0; i < gArr.length; i++){
				var colTitle = gArr[i].find('title').value();
				var colSize = colSizes[i];
				if(colSize == 0){
					colSize = colSzPrc;
				}
				
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
				var hAlignVertSelector = gArr[i].find('hAlignVert');
				if(hAlignVertSelector.used()){
					hAlignVert = hAlignVertSelector.value().value();
				}
				
				var hCssStyle = '';
				var hCssSelector = gArr[i].find('hCss');
				if(hCssSelector.used()){
					hCssStyle = prepareCss(hCssSelector.value());
				}

				var desc = {
					key: MD5.md5('' + colTitle),
					title: colTitle,
					size: colSize,
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
					widget: null,
					textSelector: null,
					format: null,
					sortFields: null,
					status: null,
					contextFilterField: null,
					contextFilterFixed: false
				};
				
				// check for status
				var summarySelector = gArr[i].find('summary');
				if(summarySelector.used()){
					var summaryElts = summarySelector.values();
					for(var j = 0; j < summaryElts.length; j++){
						var summaryOp = summaryElts[j].find('summaryOp').value();
						if(summaryOp){
							var statusDesc = {};
							statusDesc.summaryOp = summaryOp.value();
							statusDesc.summaryPrefix = summaryElts[j].find('summaryPrefix').value();
							statusDesc.summaryPostfix = summaryElts[j].find('summaryPostfix').value();
							if(!desc.status){
								desc.status = [];
							}
							desc.status.push(statusDesc);
						}
					}
				}
				
				
				// check for widget
				var viewSelector = gArr[i].find('view').value();
				if(viewSelector.key() == 'widgetGroup'){
					// embedded widget
					var widgetSelector = viewSelector.find('widget');
					var wType = widgetSelector.unwrap().widget.jsb;
					var wName = widgetSelector.unwrap().widget.name;
					widgetTypes.push(wType);
					desc.widget = {
						jsb: wType,
						name: wName,
						values: widgetSelector.value()
					};
					var sortSelector = viewSelector.find('widgetSort');
					if(sortSelector.used()){
						desc.sortFields = sortSelector.binding();
					}
					var widgetContextFilterSelector = viewSelector.find('widgetContextFilter');
					if(widgetContextFilterSelector.used()){
						if(widgetContextFilterSelector.find('widgetСontextFilterFixed').used()){
							desc.contextFilterFixed = true;
						}
						var widgetContextFilterFieldSelector = widgetContextFilterSelector.find('widgetContextFilterField');
						if(widgetContextFilterFieldSelector.used()){
							desc.contextFilterField = widgetContextFilterFieldSelector.binding()[0];
							desc.contextFilterFieldType = widgetContextFilterFieldSelector.bindingType()[0];
						}
					}

				} else {
					// simple text
					var textSelector = viewSelector.find('text');
					desc.textSelector = textSelector;
					var sortSelector = viewSelector.find('textSort');
					if(sortSelector.used()){
						desc.sortFields = textSelector.binding();
					}
					var contextFilterSelector = viewSelector.find('contextFilter');
					if(contextFilterSelector.used()){
						if(contextFilterSelector.find('contextFilterFixed').used()){
							desc.contextFilterFixed = true;
						}
						desc.contextFilterField = textSelector.binding()[0];
						desc.contextFilterFieldType = textSelector.bindingType()[0];
					}
					var formatSelector = viewSelector.find('textFormat');
					if(formatSelector.used()){
						desc.format = formatSelector.value();
					}
				}
				
				this.colDesc.push(desc);

			}
			
			// update row filters
			this.preserveFilteredRows = this.getContext().find('preserveFilteredRows').used();
			this.setFilterLayer({back: this.preserveFilteredRows});

			this.hoverFilteredRows = this.getContext().find('hoverFilteredRows').used();
			this.setFilterLayer({hover: this.hoverFilteredRows});

			// update grid
			if(this.getContext().find('showGrid').used()){
				this.addClass('hasBorder');
			} else {
				this.removeClass('hasBorder');
			}
			
			// update header
			this.updateHeader();

			// update header
			this.updateStatus();

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