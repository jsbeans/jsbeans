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
	    rows: {
	        render: 'sourceBinding',
	        name: 'Источник'
	    },
	    showHeader: {
	        render: 'item',
	        name: 'Показывать заголовки столбцов',
	        optional: 'checked',
	        editor: 'none'
	    },
	    showGrid: {
            render: 'item',
            name: 'Показывать сетку',
	        optional: 'checked',
	        editor: 'none'
	    },
	    rowSettings: {
	        render: 'group',
	        name: 'Строки',
	        collapsible: true,
	        items: {
	            rowKey: {
	                render: 'dataBinding',
	                name: 'Поля идентификации строк',
	                linkTo: 'rows',
	                multiple: true
	            },
	            rowFilter: {
	                render: 'dataBinding',
	                name: 'Фильтрующие поля',
	                linkTo: 'rows',
	                multiple: true
	            },
	            
	            preserveFilteredRows: {
	                render: 'item',
	                name: 'Не скрывать отфильтрованные строки',
					optional: true,
					editor: 'none'
	            },
	            
	            showSortIcon: {
	                render: 'item',
	                name: 'Не скрывать значок сортировки',
					optional: 'checked',
					editor: 'none'
	            },
	            useTree: {
	                render: 'switch',
	                name: 'Формировать дерево',
	                items: {
                        parentRowKey: {
                            render: 'dataBinding',
                            name: 'Полe идентификации родительских строк',
                            linkTo: 'rows'
                        },
                        rootRowKeyValue: {
                        	render: 'item',
                        	name: 'Значение поля у корневых строк',
                        	optional: true
                        },
                        childIdent: {
                        	render: 'item',
                        	name: 'Размер отступа у дочерних строк',
                        	value: '15px'
                        },
                        childCount: {
                        	render: 'item',
                        	name: 'Отображать количество дочерних строк',
                        	editor: 'none',
                        	optional: 'checked'
                        }
	                }
	            },
	            rowClick: {
	            	render: 'group',
	            	name: 'Действия при клике',
	            	items: {
	            		useFilterOnClick: {
	    	            	render: 'item',
	    	                name: 'Использовать глобальную фильтрацию',
	    					optional: true,
	    					editor: 'none'
	    	            },
	    	            callApiOnClick: {
	    	            	render: 'switch',
	    	            	name: 'Уведомлять API-окружение',
	    	            	items: {
	    	            		rowClickParams: {
	    	    	                render: 'dataBinding',
	    	    	                name: 'Поля аргументов',
	    	    	                linkTo: 'rows',
	    	    	                multiple: true
	    	    	            },
	    	            	}
	    	            },
	    	            useDrillDownOnClick: {
	    	            	render: 'switch',
	    	            	name: 'Переходить на другой виджет',
	    	            	items: {
	    	            		drillDownWidget: {
                                    render: 'completeWidget',
                                    name: 'Виджет'
                                }
	    	            	}
	    	            }
	    	            
	            	}
	            },
	            rowHover: {
	            	render: 'group',
	            	name: 'Действия при наведении',
	            	items: {
	            		hoverFilteredRows: {
	    	                render: 'item',
	    	                name: 'Обновлять данные',
	    					optional: true,
	    					editor: 'none'
	    	            },
	    	            showRowToolTip: {
	    	            	render: 'switch',
	    	            	name: 'Показывать виджет в выноске',
	    	            	items: {
	    	            		toolWidgetType: {
	    	            			render: 'select',
	    	            			name: 'Тип виджета',
	    	            			items: {
	    	            				toolNewWidget: {
	    	            					name: 'Встроенный виджет',
	    	            					items: {
	    	            						widget: {
	    	    	            					render: 'embeddedWidget',
	    	    	                                name: 'Виджет'
	    	            						}
	    	            					}
	    	            				},
	    	            				toolExistedWidget: {
	    	                                name: 'Существующий виджет',
	    	                                items: {
	    	                                	widget: {
	    	    	            					render: 'completeWidget',
	    	    	                                name: 'Виджет'
	    	            						}
	    	                                }
	    	            				}
	    	            			}
	    	            		}
	    	            	}
	    	            }
	            	}
	            },
	    	    usePrefetch: {
	    	    	render: 'item',
	                name: 'Использовать упреждающую загрузку данных',
	                optional: true,
	                editor: 'none'
	    	    },
	    	    useAnimation: {
	    	    	render: 'item',
	                name: 'Анимация',
	                optional: 'checked',
	                editor: 'none'
	    	    }

	        }
	    },
	    columns: {
	        render: 'autocompleteGroup',
	        name: 'Столбцы',
	        collapsible: true,
	        multiple: true,
	        linkTo: 'rows',
	        linkedFields: {
	            title: {
	                type: 'any',
	                repeat: true
	            },
	            text: {
	                type: 'any',
	                repeat: true
	            }
	        },
	        items: {
	            title: {
                    render: 'item',
                    name: 'Название'
	            },
	            view: {
	                render: 'select',
	                name: 'Отображение ячейки',
	                items: {
	                    textGroup: {
	                        name: 'Текст',
	                        items: {
	                            text: {
	                                render: 'dataBinding',
	                                name: 'Значение',
	                                linkTo: 'rows'
	                            },
	                            textSort: {
	                                render: 'item',
	                                name: 'Использовать сортировку',
                                    optional: 'checked',
                                    editor: 'none'
	                            },
	                            contextFilter: {
                                    render: 'switch',
                                    name: 'Использовать контексный фильтр',
                                    items: {
                                        contextFilterFixed: {
                                            render: 'item',
                                            name: 'Всегда показывать фильтр',
                                            optional: true,
                                            editor: 'none'
                                        },
                                        contextFilterValue: {
                                        	render: 'item',
                                            name: 'Значение по умолчанию'
                                        },
                                        contextFilterOp: {
                                            render: 'select',
                                            name: 'Условие по умолчанию (для численных значений)',
                                            items: {
                                            	'$eq': {
                                                    name: '=',
                                                    value: '$eq'
                                                },
                                                '$lt': {
                                                    name: '<',
                                                    value: '$lt'
                                                },
                                                '$lte': {
                                                    name: '&le;',
                                                    value: '$lte'
                                                },
                                                '$gt': {
                                                    name: '>',
                                                    value: '$gt'
                                                },
                                                '$gte': {
                                                    name: '&ge;',
                                                    value: '$gte'
                                                },
                                                '$ne': {
                                                    name: '&ne;',
                                                    value: '$ne'
                                                }
                                            }
                                        }

                                    }
	                            },
	                            textFormat: {
                                    render: 'switch',
                                    name: 'Форматировать числа',
	                                items: {
	                                    formatter: {
                                            render: 'formatter',
                                            name: 'Формат',
                                            formatterOpts: {
                                                basicSettings: {
                                                    type: 'number',
                                                    value: 'y'
                                                },
                                                variables: [
                                                    {
                                                        alias: 'Значение',
                                                        type: 'number',
                                                        value: 'y'
                                                    }
                                                ]
                                            },
                                            valueType: 'string',
                                            defaultValue: '{y:,.2f}'
	                                    }
	                                }
	                            }
	                        }
	                    },
	                    widgetGroup: {
	                        name: 'Встроенный виджет',
	                        items: {
	                            widget: {
	                                render: 'embeddedWidget',
	                                name: 'Виджет'
	                            },
	                            widgetSort: {
                                    render: 'switch',
                                    name: 'Использовать сортировку',
	                                items: {
	                                    widgetSortFields: {
                                            render: 'dataBinding',
                                            name: 'Поля сортировки',
                                            linkTo: 'rows',
                                            multiple: true
	                                    }
	                                }
	                            },
	                            widgetContextFilter: {
                                    render: 'switch',
                                    name: 'Использовать контексный фильтр',
                                    items: {
                                        widgetContextFilterField: {
                                            render: 'dataBinding',
                                            name: 'Фильтровать по полю',
                                            linkTo: 'rows'
                                        },
                                        widgetСontextFilterFixed: {
                                            render: 'item',
                                            name: 'Всегда показывать фильтр',
                                            optional: true,
                                            editor: 'none'
                                        },
                                        widgetContextFilterValue: {
                                        	render: 'item',
                                            name: 'Значение по умолчанию'
                                        },
                                        widgetContextFilterOp: {
                                            render: 'select',
                                            name: 'Условие по умолчанию (для численных значений)',
                                            items: {
                                            	'$eq': {
                                                    name: '=',
                                                    value: '$eq'
                                                },
                                                '$lt': {
                                                    name: '<',
                                                    value: '$lt'
                                                },
                                                '$lte': {
                                                    name: '&le;',
                                                    value: '$lte'
                                                },
                                                '$gt': {
                                                    name: '>',
                                                    value: '$gt'
                                                },
                                                '$gte': {
                                                    name: '&ge;',
                                                    value: '$gte'
                                                },
                                                '$ne': {
                                                    name: '&ne;',
                                                    value: '$ne'
                                                }
                                            }
                                        }
                                    }
	                            }
	                        }
	                    }
	                }
	            },
	            cellSpan: {
                    render: 'item',
                    name: 'Объединять ячейки с одинаковыми значениями',
                    editor: 'none',
                    optional: true
                },
                summary: {
                    render: 'switch',
                    name: 'Отображать в строке статуса сводный показатель',
                    items: {
                        summaryOpts: {
                            render: 'group',
                            name: 'Сводные показатели',
                            multiple: true,
                            items: {
                                summaryOp: {
                                    render: 'select',
                                    name: 'Операция',
                                    items: {
                                        summaryOpCount: {
                                            name: 'Количество'
                                        },
                                        summaryOpSum: {
                                            name: 'Сумма'
                                        },
                                        summaryOpMin: {
                                            name: 'Минимум'
                                        },
                                        summaryOpMax: {
                                            name: 'Максимум'
                                        },
                                        summaryOpAvg: {
                                            name: 'Среднее'
                                        }
                                    }
                                },
                                summaryField: {
                                	render: 'dataBinding',
                                    name: 'Поле',
                                    linkTo: 'rows'
                                },
	                            summaryFormat: {
                                    render: 'switch',
                                    name: 'Использовать форматирование',
	                                items: {
	                                    format: {
                                            render: 'formatter',
                                            name: 'Формат',
                                            formatterOpts: {
                                                basicSettings: {
                                                    type: 'number',
                                                    value: 'y'
                                                },
                                                variables: [
                                                    {
                                                        alias: 'Значение',
                                                        type: 'number',
                                                        value: 'y'
                                                    }
                                                ]
                                            },
                                            valueType: 'string',
                                            defaultValue: '{y:,.2f}'
	                                    }
	                                }
	                            },
                                summaryPrefix: {
                                    render: 'item',
                                    name: 'Префикс',
                                    value: 'Итого'
                                },
                                summaryPostfix: {
                                    render: 'item',
                                    name: 'Суффикс'
                                }
                            }
                        }
                    }
                },
                cellAlign: {
                    render: 'group',
                    name: 'Стиль ячейки',
		            collapsible: true,
		            collapsed: true,
		            items: {
		                alignHorz: {
                            render: 'select',
                            name: 'Горизонтальное выравнивание',
                            items: {
                                left: {
                                    name: 'По левому краю'
                                },
                                center: {
                                    name: 'По центру'
                                },
                                right: {
                                    name: 'По правому краю'
                                }
                            }
		                },
		                alignVert: {
                            render: 'select',
                            name: 'Вертикальное выравнивание',
                            items: {
                                top: {
                                    name: 'По верхнему краю'
                                },
                                middle: {
                                    name: 'По центру'
                                },
                                bottom: {
                                    name: 'По нижнему краю'
                                }
                            }
		                },
		                css: {
		                    render: 'switch',
		                    name: 'Использовать CSS-стиль ячейки',
		                    items: {
		                        cssValue: {
		                            render: 'item',
                                    name: 'CSS-стиль',
                                    editor: 'JSB.Widgets.MultiEditor',
                                    editorOpts: {
                                        valueType: 'org.jsbeans.types.Css'
                                    },
                                    value: `/* Заполните объект CSS значениями */
{
    font-family: 'arial';
}`
		                        }
		                    }

		                }
		            }
                },
                headerAlign: {
                    render: 'group',
                    name: 'Стиль заголовка',
		            collapsible: true,
		            collapsed: true,
		            items: {
		                hAlignHorz: {
                            render: 'select',
                            name: 'Горизонтальное выравнивание',
                            items: {
                                center: {
                                    name: 'По центру'
                                },
                                left: {
                                    name: 'По левому краю'
                                },
                                right: {
                                    name: 'По правому краю'
                                }
                            }
		                },
		                hAlignVert: {
                            render: 'select',
                            name: 'Вертикальное выравнивание',
                            items: {
                                top: {
                                    name: 'По верхнему краю'
                                },
                                middle: {
                                    name: 'По центру'
                                },
                                bottom: {
                                    name: 'По нижнему краю'
                                }
                            }
		                },
		                hCss: {
		                    render: 'switch',
		                    name: 'Использовать CSS-стиль заголовка',
		                    items: {
		                        hCssValue: {
		                            render: 'item',
                                    name: 'CSS-стиль',
                                    editor: 'JSB.Widgets.MultiEditor',
                                    editorOpts: {
                                        valueType: 'org.jsbeans.types.Css'
                                    },
                                    value: `/* Заполните объект CSS значениями */
{
    font-family: 'arial';
}`
		                        }
		                    }
		                }
		            }
                },
                colWidth: {
                    render: 'item',
                    name: 'Ширина столбца',
                    value: 'auto'
                }
                

	        }
	    }
	},
	$client: {
		$require: ['JSB.Widgets.ScrollBox', 
		           'JSB.Crypt.MD5',
		           'DataCube.Controls.SortSelector',
		           'DataCube.Controls.FilterEntry',
		           'JSB.Utils.Formatter'],
		
		ready: false,
		headerDesc: [],
		colDesc: [],
		rows: [],
		rowKeyMap: {},
		expandedKeys: {},
		collapsedKeys: {},
		rowFilterFields: [],
		widgetMap: {},
		blockFetch: true,
		rowAppending: false,
		preFetching: false,
		stopPreFetch: false,
		scrollHeight: 0,
		paneHeight: 0,
		embeddedBindings: [],
		refreshOrdered: false,
		refreshOrderedOpts: null,
		
		$constructor: function(opts){
			$base(opts);
			
			this.addClass('tableWidget');
			this.loadCss('Table.css');
/*			
			this.messageBox = this.$('<div class="message hidden"></div>');
			this.append(this.messageBox);
*/			
			
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
					
					$this.getElement().visible(function(evt, isVisible){
						if(!isVisible){
							return;
						}
						if($this.refreshOrdered){
							$this.refresh($this.refreshOrderedOpts);
						}
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
		
		toggleRowExpansion: function(rowKey){
			var rowElt = this.find('.row[key="'+rowKey+'"]');
			if(rowElt.length > 0){
				// extract row id
				var rowDesc = $this.rowKeyMap[rowKey];
				var rowKeyVal = rowDesc.rowKeyVal;
				if(rowElt.hasClass('expanded')){
					// collapse
					if(JSB.isDefined($this.expandedKeys[rowKey])){
						delete $this.expandedKeys[rowKey];
					} 
					$this.collapsedKeys[rowKey] = {rowKeyVal: rowDesc.rowKeyVal, pRowKeyVal: rowDesc.pRowKeyVal, pKey: rowDesc.pKey};
					rowElt.removeClass('expanded');
				} else {
					// expand
					if(JSB.isDefined($this.collapsedKeys[rowKey])){
						delete $this.collapsedKeys[rowKey];
					}
					$this.expandedKeys[rowKey] = {rowKeyVal: rowDesc.rowKeyVal, pRowKeyVal: rowDesc.pRowKeyVal, pKey: rowDesc.pKey};
					rowElt.addClass('expanded');
				}
				
				this.refresh();
			}
		},
		
		resolveDescendants: function(rowDesc, callback){
			if(!$this.descendantsMap){
				$this.descendantsMap = {};
			}
			if(JSB.isDefined($this.descendantsMap[rowDesc.key])){
				callback.call($this, $this.descendantsMap[rowDesc.key]);
				return;
			}
			
			var source = this.rowsContext.binding().source;
			var wrapQuery = {$select:{'cnt':{$count: 1}}, $filter:{}};
			wrapQuery.$filter[$this.parentRowKeySelector.binding()] = {$eq:{$const:rowDesc.rowKeyVal}};
			
			$this.server().executeQuery(source, $this.getEntry(), {extQuery: {}, wrapQuery: wrapQuery}, function(res){
				if(res.length > 0 && JSB.isDefined(res[0].cnt)){
					$this.descendantsMap[rowDesc.key] = res[0].cnt;
				} else {
					$this.descendantsMap[rowDesc.key] = 0;
				}
				callback.call($this, $this.descendantsMap[rowDesc.key]);
			});
		},
		
		drawRows: function(){
			function updateColl(d){
				if(!$this.useTree){
					return;
				}
				var collEl = $this.$(this);
				if(d.colIdx > 0){
					// remove toggle if existed
					var toggleElt = collEl.find('> .toggle');
					collEl.css('padding-left', 0);
					if(toggleElt.length > 0){
						toggleElt.remove();
					}
				} else {
					// add toggle if not existed
					var toggleElt = collEl.find('> .toggle');
					var rowDesc = $this.rowKeyMap[d.rowKey];
					collEl.css('padding-left', 'calc('+$this.childIdent+' * '+rowDesc.depth+')');
					if(toggleElt.length == 0){
						toggleElt = $this.$('<div class="toggle"></div>');
						collEl.prepend(toggleElt);
						toggleElt.click(function(evt){
							evt.stopPropagation();
							$this.toggleRowExpansion(d.rowKey);
						});

					}
					
					var childCountElt = collEl.find('.childCount');
					if($this.showChildCount){
						if(childCountElt.length == 0){
							childCountElt = $this.$('<div class="childCount"></div>');
							collEl.append(childCountElt);
						}
					} else {
						if(childCountElt.length > 0){
							// remove
							childCountElt.remove();
						}
					}
					
					toggleElt.addClass('resolvingDescendants');
					$this.resolveDescendants(rowDesc, function(descendantsCount){
						toggleElt.removeClass('resolvingDescendants');
						if(descendantsCount > 0){
							toggleElt.addClass('hasDescendants');
							collEl.addClass('hasDescendants');
							if($this.showChildCount){
								childCountElt.text(descendantsCount);
							}
						} else {
							toggleElt.removeClass('hasDescendants');
							collEl.removeClass('hasDescendants');
						}
					});
					
				}
			}
			
			function updateCell(d){
				var cellEl = $this.$(this);
				var cell = d3.select(this);
				cell.attr('style', function(d){ return $this.colDesc[d.colIdx].style.cssStyle});
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
					widget.refresh();
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
						fVal = Formatter.format($this.colDesc[d.colIdx].format, {y: val});
					}
					cellEl.text(fVal !== null ? fVal : '');
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
			}

			// accociate with DOM
			var tbody = d3.select($this.scroll.getElement().get(0)).select('._dwp_scrollPane > table').select('tbody');
			var rowsSel = tbody.selectAll('tr.row');
			var rowsSelData = rowsSel.data($this.rows, function(d){ return d ? d.key : $this.$(this).attr('key');});

			rowsSelData.each(function(d){
				if($this.highlightedRowKey == d.key){
					$this.highlightedRowKey = null;
					$this.rowFilterTool.addClass('hidden');
				}
				d3.select(this)
					.classed('highlight', false)
					.classed('main', !!d.flags.main)
					.classed('back', !!d.flags.back)
					.classed('hover', !!d.flags.hover)
					.classed('rowFilter', d.filter && d.filter.length > 0)
					.classed('expanded', d.expanded)
					.attr('pos', function(d){return d.position;})
					.attr('depth', function(d){return d.depth;});
			});
			
			// columns
			var rowsSelDataColData = rowsSelData.selectAll('td.col').data(function(d){ return d.row; }, function(d){ return d ? d.key: $this.$(this).attr('key')});
			
			if($this.rowsDrawn === 0){ // updating after refresh
				rowsSelDataColData.order();
				
				rowsSelDataColData
					.attr('style', function(d){ return $this.colDesc[d.colIdx].style.cssStyle;})
					.attr('type', function(d){return $this.colDesc[d.colIdx].widget ? 'widget':'text';})
					.attr('rowspan', function(d){return JSB.isDefined(d.spanCount) ? d.spanCount : null;})
					.classed('spanned', function(d){return JSB.isDefined(d.spanFrom);})
					.style('text-align', function(d){ return $this.colDesc[d.colIdx].style.alignHorz;})
					.style('vertical-align', function(d){ return $this.colDesc[d.colIdx].style.alignVert;});
			
				rowsSelDataColData.each(function(d){
					var coll = d3.select(this);
					updateColl.call(coll.node(), d);
					var cell = coll.select('div.cell');
					updateCell.call(cell.node(), d)
				});
			}
			
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
					.attr('rowspan', function(d){return JSB.isDefined(d.spanCount) ? d.spanCount : null;})
					.classed('spanned', function(d){return JSB.isDefined(d.spanFrom);})
					.style('text-align', function(d){ return $this.colDesc[d.colIdx].style.alignHorz})
					.style('vertical-align', function(d){ return $this.colDesc[d.colIdx].style.alignVert})
					.each(function(d){
						updateColl.call(this, d);
					})
					.append('div')
						.classed('cell', true)
						.attr('key', function(d){ return d.key;})
						.attr('style', function(d){ return $this.colDesc[d.colIdx].style.cssStyle})
						.each(function(d){
							updateCell.call(this, d);
						});
				
			
			
			function _removeRows(){
				var removedRowsSel = rowsSelData.exit();
				
				// destroy widgets
				removedRowsSel
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
				
				// destroy rows
				removedRowsSel.remove();
			}
			
			function _appendRows(){
				rowsSelData.order();
				var newRowsSel = rowsSelData.enter();
				newRowsSel
					.append('tr')
						.classed('row', true)
						.classed('main', function(d){return !!d.flags.main;})
						.classed('back', function(d){return !!d.flags.back;})
						.classed('hover', function(d){return !!d.flags.hover;})
						.attr('pos', function(d){return d.position;})
						.attr('depth', function(d){return d.depth;})
						.classed('rowFilter', function(d){return d.filter && d.filter.length > 0;})
						.classed('expanded', function(d){return d.expanded;})
						.style('transform', function(d){return $this.useAnimation ? (d.depth > 0 ? 'scale(0,0)':'translate(-'+$this.getElement().width()+'px,0)') : null;})
						.style('opacity', function(d){return $this.useAnimation ? 0 : null;})
						.on('click',function(d){
							$this.onRowClick(d);
						})
						.on('mouseover', function(d){
							$this.onRowHover(d, $this.$(this));
						})
						.on('mouseout', function(d){
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
								.attr('rowspan', function(d){return JSB.isDefined(d.spanCount) ? d.spanCount : null;})
								.classed('spanned', function(d){return JSB.isDefined(d.spanFrom);})
								.style('text-align', function(d){ return $this.colDesc[d.colIdx].style.alignHorz})
								.style('vertical-align', function(d){ return $this.colDesc[d.colIdx].style.alignVert})
								.each(function(d){
									updateColl.call(this, d);
								})
								.append('div')
								.classed('cell', true)
									.attr('key', function(d){return d.key})
									.attr('style', function(d){ return $this.colDesc[d.colIdx].style.cssStyle})
									.each(function(d){
										updateCell.call(this, d);
									});
				if($this.useAnimation){
					newRowsSel.selectAll('tr.row')
						.transition().duration(800)
							.style('opacity', 1)
							.style('transform', function(d){return d.depth > 0 ? 'scale(1,1)':'translate(0,0)'});
				}

			}

			// rows		
			if($this.useAnimation){
				var removedRowsSel = rowsSelData.exit();
				if(removedRowsSel.size() > 0){
					var rKeyMap = {};
					removedRowsSel.each(function(d){
						rKeyMap[d.key] = true;
					});
					
					removedRowsSel
						.style('transform', 'scale(1,1)')
						.style('opacity', 1);
				
					removedRowsSel.transition()
						.duration(800)
						.style('transform', 'scale(0,0)')
						.style('opacity', 0)
						.on('end', function(d){
							if(rKeyMap[d.key]){
								delete rKeyMap[d.key];
							}
							if(Object.keys(rKeyMap).length == 0){
								_removeRows();
								_appendRows();
							}
						});
				} else {
					_removeRows();
					_appendRows();
				}
			} else {
				_removeRows();
				_appendRows();
			}
			

		},
		
		appendRows: function(bRefresh){
			if(!$this.ready || $this.rowAppending || $this.blockFetch){
				return;
			}
			this.rowAppending = true;
			var fetchSize = 30;
			
			if(bRefresh){
				if(this.rows.length > fetchSize){
					fetchSize = this.rows.length;
				}
				this.rows = [];
				$this.rowKeyMap = {};
				this.rowsDrawn = 0;
				
				// row block chain for tree
				this.treeKeyMap = {};
				this.treePKeyMap = {};
				
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
					rowDesc.depth = 0;
					rowDesc.position = idxOffset + pRows.length;
					pRows.push(rowDesc);
					$this.rowKeyMap[key] = rowDesc;
					
					// proceed cells
					for(var j = 0; j < $this.colDesc.length; j++){
						row[j].rowKey = key;
						
						// check for cellSpan
						if($this.colDesc[j].cellSpan){
							var prevDesc = null;
							if(i > 0){
								prevDesc = rows[i-1].row[j];
							} else {
								if(idxOffset > 0){
									prevDesc = $this.rows[idxOffset-1].row[j];
								}
							}
							if(prevDesc && JSB.isEqual(row[j].value, prevDesc.value)){
								
								if(JSB.isDefined(prevDesc.spanFrom)){
									row[j].spanFrom = prevDesc.spanFrom;
								} else {
									row[j].spanFrom = idxOffset + i - 1;
								}
								if(row[j].spanFrom >= idxOffset){
									rows[row[j].spanFrom - idxOffset].row[j].spanCount = (rows[row[j].spanFrom - idxOffset].row[j].spanCount || 1) + 1;
								} else {
									$this.rows[row[j].spanFrom].row[j].spanCount = ($this.rows[row[j].spanFrom].row[j].spanCount || 1) + 1;
								}
							}
						}
						
						// perform widgets
						if($this.colDesc[j].widget){
							var colName = $this.colDesc[j].title;
							if($this.widgetMap[key] && $this.widgetMap[key][colName] && $this.widgetMap[key][colName].getJsb().$name == $this.colDesc[j].widget.jsb){
								$this.widgetMap[key][colName].updateValues({ values: row[j].value });
							} else {
								var WidgetCls = $this.colDesc[j].widget.cls;
								if(WidgetCls){
									var widget = new WidgetCls();
									widget.setWrapper($this.getWrapper(), { values: row[j].value });
									if(!$this.widgetMap[key]){
										$this.widgetMap[key] = {};
									}
									$this.widgetMap[key][colName] = widget;
								}
							}
						}
					}
					
					if($this.useTree){
						// update row chain
						var node = {children:[], rowDesc: rowDesc};
						var pKey = rowDesc.pKey;
						$this.treeKeyMap[key] = node;
						if($this.treeKeyMap[pKey]){
							// insert
							$this.treeKeyMap[pKey].children.push(node);
							$this.treeKeyMap[pKey].rowDesc.expanded = true;
						} else {
							// append to unsorted
							if(!$this.treePKeyMap[pKey]){
								$this.treePKeyMap[pKey] = [];
							}
							$this.treePKeyMap[pKey].push(node);
						}
						// dock children if existed
						if($this.treePKeyMap[key]){
							node.children = $this.treePKeyMap[key];
							node.rowDesc.expanded = true;
							delete $this.treePKeyMap[key];
						}
					}
					
				}
				
				if(pRows.length == 0 && !bRefresh){
					$this.rowAppending = false;
					return;
				}
				
				$this.rowsDrawn = $this.rows.length;
				if($this.useTree){
					$this.rows = [];
					// serialize tree
					function serializeNode(node, depth){
						node.rowDesc.depth = depth;
						$this.rows.push(node.rowDesc);
						for(var c = 0; c < node.children.length; c++){
							serializeNode(node.children[c], depth + 1);
						}
					}
					for(var pk in $this.treePKeyMap){
						var pkArr = $this.treePKeyMap[pk];
						for(var pi = 0; pi < pkArr.length; pi++){
							serializeNode(pkArr[pi], 0);
						}
					}
				} else {
					$this.rows = $this.rows.concat(pRows);
				}
				
				$this.drawRows();
				
				$this.rowAppending = false;
				if(!$this.useTree && pRows.length > 0){
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
			var rowsContext = this.rowsContext;
			var rowKeySelector = this.rowKeySelector;
			var rowFilterSelector = this.rowFilterSelector;
			var rowClickParamsSelector = this.rowClickParamsSelector;
			var rowFilterBinding = rowFilterSelector.bindings(true);
			var rowClickParamsBinding = rowClickParamsSelector && rowClickParamsSelector.bindings(true);

			var gArr = this.columnsSelector.values();
			for(var i = 0; i < gArr.length; i++){
				cols.push({
					colName: $this.colDesc[i].title,
					colKey: $this.colDesc[i].key,
					colType: $this.colDesc[i].type,
					textSelector: $this.colDesc[i].textSelector
				});
			}
			
			// setup tree filters
			if($this.useTree){
				var expandedVals = [];
				var collapsedVals = [];
				// generate parentId context filter
				var parentField = $this.parentRowKeySelector.binding();
				var idField = $this.rowKeySelector.binding();
				
				// add expanded keys
				for(var expKey in $this.expandedKeys){
					var val = $this.expandedKeys[expKey].rowKeyVal;
					expandedVals.push(val);
				}
				
				// add collapsed keys
				for(var collKey in $this.collapsedKeys){
					var val = $this.collapsedKeys[collKey].rowKeyVal;
					collapsedVals.push(val);
				}
				
				$this.treeOpts = {
					rootRowKeyValue: $this.rootRowKeyValue,
					parentField: parentField,
					idField: idField,
					expanded: expandedVals,
					collapsed: collapsedVals
				};
			}
			
			var preCallback = function(rows, fail){
				return callback.call($this, rows, fail);
			};
			
			function preFetch(){
				if($this.stopPreFetch){
					return;
				}
				$this.preFetching = true;
				var fRes = $this.fetch(rowsContext, {batchSize: preFetchSize}, function(data, fail){
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
				while(rowsContext.next({embeddedBindings: $this.embeddedBindings})){
					var row = [];
					var rowFlags = {};
					// construct key
					var rowKey = null, rowKeyVal = null;
					var keyValsMain = rowKeySelector.values('main', true);
					var keyValsBack = rowKeySelector.values('back', true);
					var keyValsHover = rowKeySelector.values('hover', true);
					
					if(keyValsMain.length > 0){
						rowFlags.main = true;
					}
					if(keyValsBack.length > 0){
						rowFlags.back = true;
					}
					if(keyValsHover.length > 0){
						rowFlags.hover = true;
					}

					for(var i = 0; i < Math.max(keyValsMain.length, keyValsBack.length); i++){
						var keyVal = keyValsMain[i];
						if(!JSB.isDefined(keyVal)){
							keyVal = keyValsBack[i];
						}
						if(!keyVal){
							continue;
						}
						if(!rowKeyVal){
							rowKeyVal = keyVal;
						}
						if(!rowKey){
							rowKey = '';
						}
						rowKey += MD5.md5('' + keyVal);
					}
					
					var parentRowKey = null, parentRowKeyVal = null;
					if($this.useTree){
						var pKeyValMain = $this.parentRowKeySelector.value('main');
						var pKeyValBack = $this.parentRowKeySelector.value('back');
						var pKeyValHover = $this.parentRowKeySelector.value('hover');
						var pKeyVal = pKeyValMain;
						if(!JSB.isDefined(pKeyVal)){
							pKeyVal = pKeyValBack;
						}
						if(!JSB.isDefined(pKeyVal)){
							pKeyVal = '';
						}
						if(!parentRowKeyVal){
							parentRowKeyVal = pKeyVal;
						}
						parentRowKey = MD5.md5('' + pKeyVal);
					}
					
					// construct row filter
					var rowFilter = [];
					var rowFilterValsMain = rowFilterSelector.values('main', true);
					var rowFilterValsBack = rowFilterSelector.values('back', true);
					var rowFilterValsHover = rowFilterSelector.values('hover', true);
					
					if(rowFilterValsMain.length > 0){
						rowFlags.main = true;
					}
					if(rowFilterValsBack.length > 0){
						rowFlags.back = true;
					}
					if(rowFilterValsHover.length > 0){
						rowFlags.hover = true;
					}
					
					for(var i = 0; i < rowFilterBinding.length; i++){
						if(rowFilterBinding[i]){
							var val = rowFilterValsMain[i];
							if(!JSB.isDefined(val)){
								val = rowFilterValsBack[i];
							}
							rowFilter.push({field: rowFilterBinding[i], value: val});
						}
					}
					
					// construct rowClickParams
					var rowClickParams = [];
					if(rowClickParamsSelector){
						var rowClickParamsValsMain = rowClickParamsSelector.values('main', true);
						var rowClickParamsValsBack = rowClickParamsSelector.values('back', true);
						var rowClickParamsValsHover = rowClickParamsSelector.values('hover', true);
						
						for(var i = 0; i < Math.max(rowClickParamsValsMain.length, rowClickParamsValsBack.length); i++){
							if(rowClickParamsBinding[i]){
								var val = rowClickParamsValsMain[i];
								if(!val){
									val = rowClickParamsValsBack[i];
								}
								rowClickParams.push({field: rowClickParamsBinding[i], value: val});
							}
						}
					}
					
					
					// iterate by cells
					for(var i = 0; i < gArr.length; i++){
						var cDesc = {
							key: cols[i].colKey,
							column: cols[i].colName,
							colIdx: i
						};
						if(cols[i].colType == 'textGroup'){
							var colSel = cols[i].textSelector;
							var mainValue = colSel.value();
							var backValue = colSel.value('back');
							var hoverValue = colSel.value('hover');
							cDesc.value = {main: mainValue, back: backValue, hover: hoverValue};
						} else if(cols[i].colType == 'widgetGroup'){
						    if($this.colDesc[i].widget){
						        cDesc.value = JSB.clone($this.colDesc[i].widget.widgetSelector.getFullValues());
						    } else {
						        cDesc.value = {};
						    }
						}
						
						row.push(cDesc);	// push cell
					}
					
					var rDesc = {row: row, key: rowKey, rowKeyVal: rowKeyVal, pRowKeyVal: parentRowKeyVal, filter: rowFilter, flags: rowFlags, clickParams: rowClickParams};
					if($this.useTree){
						rDesc.pKey = parentRowKey;
					}
					rows.push(rDesc);
					
					if(rows.length >= batchSize && !$this.useTree){
						if($this.usePrefetch){
							$this.stopPreFetch = false;
							preFetch();
						}
						$this.cancelDeferredLoader();
						preCallback.call($this, rows);
						return;
					}
				}

				if(rowsContext.isReset()){
					$this.setDeferredLoader();
				}
				
				var fetchOpts = {batchSize: batchSize - rows.length};
				if($this.useTree){
					fetchOpts.batchSize = batchSize;
					fetchOpts.treeOpts = $this.treeOpts;
				}
				$this.fetch(rowsContext, fetchOpts, function(data, fail){
					if(fail){
						$this.stopPreFetch = false;
						$this.cancelDeferredLoader();
						preCallback.call($this, [], fail);
						return;
					}
					if(data && data.length){
						iterateRows();
					} else {
						$this.stopPreFetch = false;
						$this.cancelDeferredLoader();
						preCallback.call($this, rows, fail);
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
			if(this.useFilterOnClick && d.filter && d.filter.length > 0){
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
			}
			if(this.callApiOnClick){
				// construct param object
				var p = {};
				if(d.clickParams && d.clickParams.length > 0){
					for(var i = 0; i < d.clickParams.length; i++){
						var col = d.clickParams[i].field;
						var val = d.clickParams[i].value;
						p[col] = val;
					}
				}
				$this.publish('DataCube.Widget.eventFired', {
					message: 'DataCube.Widgets.Table.rowClick',
					data: p
				});
			}
			if(this.useDrillDownOnClick){
				var widget = this.getContext().find('drillDownWidget').value();
				var filterOpts = {};
				if(!this.useFilterOnClick && d.filter && d.filter.length > 0){
					for(var i = 0; i < d.filter.length; i++){
						var cubeField = this.getCubeField(d.filter[i].field);
						if(cubeField){
							filterOpts[cubeField] = {$eq:{$const:d.filter[i].value}};
						}
					}
				}
				$this.addDrilldownElement({
                    filterOpts: filterOpts,
                    widget: widget
                });
			}
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
			if((!d.filter || d.filter.length == 0) && !this.callApiOnClick && !this.useDrillDownOnClick){
				return;
			}

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
			if((!d.filter || d.filter.length == 0) && !this.callApiOnClick && !this.useDrillDownOnClick){
				return;
			}
			
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
			if(this.useFilterOnClick || this.callApiOnClick || this.useDrillDownOnClick){
				rowElt.addClass('useClick');
			} else {
				rowElt.removeClass('useClick');
			}
			$this.highlightedRowKey = rowKey;
			$this.highlightedRowData = d;
			
			// prepare tool buttons
			if(d.filter && d.filter.length > 0){
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
				
				var bAnd = /*bOtherApplied &&*/ !bSameApplied && (bOtherApplied || bRowExisted) /*&& bRowExisted*/;
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
			}
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
						(function(statusDesc){
							var sEntry = $this.$('<div class="sEntry"></div>');
							container.append(sEntry);
							if(statusDesc.summaryPrefix && statusDesc.summaryPrefix.length > 0){
								sEntry.append($this.$('<div class="prefix"></div>').text(statusDesc.summaryPrefix));
							}
							sEntry.append($this.$('<div class="value loading"></div>'));
							if(statusDesc.summaryPostfix && statusDesc.summaryPostfix.length > 0){
								sEntry.append($this.$('<div class="postfix"></div>').text(statusDesc.summaryPostfix));
							}
							
							sEntry.find('> .value').addClass
							$this.executeSummaryOp(statusDesc, function(val){
								var elt = sEntry.find('> .value');
								elt.text(val);
								elt.removeClass('loading');
							});
						})(statusDesc);
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
		
		executeSummaryOp: function(statusDesc, callback){
			// construct status query
			if(!statusDesc.summaryFieldSelector){
				callback.call(this, 0);
				return;
			}
			var sourceSelector = statusDesc.summaryFieldSelector.getLinkToSelector();
			var fieldName = statusDesc.summaryFieldSelector.binding();
			if(!fieldName){
				callback.call(this, 0);
				return;
			}

			var source = sourceSelector.binding().source;
			var mainQuery = this.getLayerQuery('main', source);
			var valQ = {};
			switch(statusDesc.summaryOp){
			case 'summaryOpCount':
				valQ['$count'] = fieldName;
				break;
			case 'summaryOpSum':
				valQ['$sum'] = fieldName;
				break;
			case 'summaryOpMin':
				valQ['$min'] = fieldName;
				break;
			case 'summaryOpMax':
				valQ['$max'] = fieldName;
				break;
			case 'summaryOpAvg':
				valQ['$avg'] = fieldName;
				break;
			default:
				callback.call(this, 0);
				return;
			}
			var wrapQuery = {$select:{'val':valQ}};
			this.server().executeQuery(source, $this.getEntry(), {extQuery: mainQuery, wrapQuery: wrapQuery}, function(res){
				if(res && res.length > 0 && JSB.isDefined(res[0].val)){
					var val = res[0].val;
					if(statusDesc.summaryFormat && JSB.isNumber(val) && statusDesc.summaryFormat.length > 0){
						val = Formatter.format(statusDesc.summaryFormat, {y: val});
					}
					callback.call(this, val);
				} else {
					callback.call(this, 0);
				}
			})
			
		},
		
		updateHeader: function(){
			if(this.getContext().find('showHeader').checked()){
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
				
				function updateHeaderItem(d, bAppend){
					var elt = $this.$(this);
					
					var hWrapper = elt.find('> .hWrapper');
					if(hWrapper.length == 0){
						hWrapper = $this.$('<div class="hWrapper"></div>');
						elt.append(hWrapper);
						hWrapper.append($this.$('<div class="text"></div>').text(d.title).attr('title',d.title));
					} else {
						elt.find('> .hWrapper > .text').text(d.title).attr('title', d.title);
					}
					
					// sort
					function _updateSortOrder(order){
						if(order == 'asc'){
							elt.addClass('sortAsc');
							elt.removeClass('sortDesc');
						} else if(order == 'desc'){
							elt.addClass('sortDesc');
							elt.removeClass('sortAsc');
						} else {
							elt.removeClass('sortAsc');
							elt.removeClass('sortDesc');
						}
					}
					
					var sortSelector = hWrapper.find('> .sortSelector').jsb();
					if(d.sortFields && d.sortFields.length > 0){
						if(!sortSelector){
							sortSelector = new SortSelector({
								onChange: function(q){
									$this.updateOrder(this, q);
									_updateSortOrder(this.getCurrentOrder());
								}
							});
							hWrapper.append(sortSelector.getElement());
							elt.find('> .hWrapper > .text').on('click.sort', function(){
								sortSelector.toggleOrder();
							});
						}
						sortSelector.setFields(d.sortFields);
						elt.addClass('sortable');
						if($this.showSortIcon){
							elt.addClass('showSortIcon');
						} else {
							elt.removeClass('showSortIcon');
						}
						_updateSortOrder(sortSelector.getCurrentOrder());
					} else {
						if(sortSelector){
							sortSelector.destroy();
							elt.find('> .hWrapper > .text').off('click.sort');
						}
						elt.removeClass('sortable');
						elt.removeClass('showSortIcon');
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
						filterEntry.setField(d.contextFilterField, d.contextFilterFieldType, d.contextFilterValue, d.contextFilterOp);
						
						if(d.contextFilterFixed){
							elt.addClass('contextFilterFixed');
							if(filterButtonElt.length > 0){
								filterButtonElt.remove();
							}
							$this.updateContextFilter(filterEntry.getFilter(), true);
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
						
						
					} else {
						elt.removeClass('contextFilter');
						if(filterEntry){
							filterEntry.destroy();
						}
						if(filterButtonElt.length > 0){
							filterButtonElt.remove();
						}
					}
				}

				colData
					.attr('style', function(d){ return d.hStyle.cssStyle})
					.style('text-align', function(d){ return d.hStyle.alignHorz})
					.style('vertical-align', function(d){ return d.hStyle.alignVert})
					.each(function(d){
						updateHeaderItem.call(this, d, false);
					});
					
				colData.enter()
					.append('th')
						.classed('col', true)
						.attr('key', function(d){ return d.key;})
						.attr('style', function(d){ return d.hStyle.cssStyle})
						.style('text-align', function(d){ return d.hStyle.alignHorz})
						.style('vertical-align', function(d){ return d.hStyle.alignVert})
						.each(function(d){
							updateHeaderItem.call(this, d, true);
						});
				
				colData.exit()
					.remove();
				
				colData.order();
				
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
		
		updateContextFilter: function(q, dontRefresh){
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
				if(!dontRefresh){
					this.refresh();
				}
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
		    this.onRefresh(opts);
		},
		
		onRefresh: function(opts){
			if(!this.ready){
				this.ensureInitialized(function(){
					$this.refresh(opts);
				});
				return;
			}
			
			if(!$this.getElement().is(':visible')){
				$this.refreshOrdered = true;
				$this.refreshOrderedOpts = opts;
				return;
			}
			
			$this.refreshOrdered = false;

            var dataSource = this.getContext().find('rows');
            if(!dataSource.hasBinding || !dataSource.hasBinding()){
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
			this.columnsSelector = this.getContext().find('columns');
			var gArr = this.columnsSelector.values();
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
			this.embeddedBindings = [];
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

			// rows
			var rowKeySelector = this.getContext().find('rowKey');
			this.rowKeySelector = rowKeySelector;
			var rowKeyFields = rowKeySelector.bindings();
			this.rowsContext = dataSource;
			this.rowFilterSelector = this.getContext().find('rowFilter');
			
			this.useFilterOnClick = this.getContext().find('useFilterOnClick').checked();
			this.showSortIcon = this.getContext().find('showSortIcon').checked();
			this.callApiOnClick = this.getContext().find('callApiOnClick').checked();
			this.useDrillDownOnClick = this.getContext().find('useDrillDownOnClick').checked();
			this.usePrefetch = this.getContext().find('usePrefetch').checked();
			this.useAnimation = this.getContext().find('useAnimation').checked();
			
			this.rowClickParamsSelector = this.callApiOnClick ? this.getContext().find('rowClickParams') : null;

			
			// update row filters
			this.preserveFilteredRows = this.getContext().find('preserveFilteredRows').checked();
			this.setFilterLayer({back: this.preserveFilteredRows});

			this.hoverFilteredRows = this.getContext().find('hoverFilteredRows').checked();
			this.setFilterLayer({hover: this.hoverFilteredRows});
			
			// tree options
			this.useTree = this.getContext().find('useTree').checked();
			if(this.useTree){
				this.addClass('useTree');
				this.parentRowKeySelector = this.getContext().find('parentRowKey');
				if(this.getContext().find('rootRowKeyValue').checked()){
					this.rootRowKeyValue = this.getContext().find('rootRowKeyValue').value() || '';
				} else {
					this.rootRowKeyValue = null;
				}
				this.childIdent = this.getContext().find('childIdent').value();
				this.showChildCount = this.getContext().find('childCount').checked();
				if(this.showChildCount){
					this.addClass('showChildCount');
				} else {
					this.removeClass('showChildCount');
				}
			} else {
				this.removeClass('useTree');
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
			
			// columns
			for(var i = 0; i < gArr.length; i++){
				var colTitle = gArr[i].find('title').value();
				var colSize = colSizes[i];
				if(colSize == 0){
					colSize = colSzPrc;
				}
				
				// fill styles
				var alignHorz = 'left';
				var alignHorzSelector = gArr[i].find('alignHorz');
				alignHorz = alignHorzSelector.value();

				var alignVert = 'top';
				var alignVertSelector = gArr[i].find('alignVert');
				alignVert = alignVertSelector.value();

				var cssStyle = '';
				var cssSelector = gArr[i].find('css');
				if(cssSelector.checked()){
					cssStyle = prepareCss(cssSelector.find('cssValue').value());
				}

				// fill header styles
				var hAlignHorz = 'left';
				var hAlignHorzSelector = gArr[i].find('hAlignHorz');
				hAlignHorz = hAlignHorzSelector.value();

				var hAlignVert = 'top';
				var hAlignVertSelector = gArr[i].find('hAlignVert');
				hAlignVert = hAlignVertSelector.value();

				var hCssStyle = '';
				var hCssSelector = gArr[i].find('hCss');
				if(hCssSelector.checked()){
					hCssStyle = prepareCss(hCssSelector.find('hCssValue').value());
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
					type: gArr[i].find('view').value(),
					widget: null,
					textSelector: null,
					format: null,
					sortFields: null,
					status: null,
					contextFilterField: null,
					contextFilterFixed: false,
					contextFilterValue: '',
					cellSpan: gArr[i].find('cellSpan').checked()
				};
				
				// check for status
				var summarySelector = gArr[i].find('summary');
				if(summarySelector.checked()){
					var summaryElts = summarySelector.find('summaryOpts').values();
					for(var j = 0; j < summaryElts.length; j++){
						var summaryOp = summaryElts[j].find('summaryOp').value();
						if(summaryOp){
							var statusDesc = {};
							statusDesc.summaryOp = summaryOp;
							statusDesc.summaryFieldSelector = summaryElts[j].find('summaryField');
							statusDesc.summaryPrefix = summaryElts[j].find('summaryPrefix').value();
							statusDesc.summaryPostfix = summaryElts[j].find('summaryPostfix').value();
							statusDesc.summaryFormat = summaryElts[j].find('summaryFormat').checked() ? summaryElts[j].find('summaryFormat format').value() : undefined;
							if(!desc.status){
								desc.status = [];
							}
							desc.status.push(statusDesc);
						}
					}
				}
				
				
				// check for widget
				var viewSelector = gArr[i].find('view');
				if(viewSelector.value() == 'widgetGroup'){
					// embedded widget
					var widgetSelector = viewSelector.find('widget'),
					    wType = widgetSelector.getWidgetBean();

                    if(wType){
                        widgetTypes.push(wType);
                        desc.widget = {
                            jsb: wType,
                            isValueSkipping: widgetSelector.isValueSkipping(),
                            name: widgetSelector.getWidgetName(),
                            widgetSelector: widgetSelector
                        };

                        if(widgetSelector.isValueSkipping()){
                            this.embeddedBindings = this.embeddedBindings.concat(widgetSelector.findRendersByName('sourceBinding'));
                        }

                        var sortSelector = viewSelector.find('widgetSort');
                        if(sortSelector.checked()){
                            desc.sortFields = sortSelector.find('widgetSortFields').bindings(true);
                        }
                        var widgetContextFilterSelector = viewSelector.find('widgetContextFilter');
                        if(widgetContextFilterSelector.checked()){
                            if(widgetContextFilterSelector.find('widgetСontextFilterFixed').checked()){
                                desc.contextFilterFixed = true;
                            }
                            var widgetContextFilterFieldSelector = widgetContextFilterSelector.find('widgetContextFilterField');
                            if(widgetContextFilterFieldSelector.checked()){
                                desc.contextFilterField = widgetContextFilterFieldSelector.binding();
                                desc.contextFilterFieldType = widgetContextFilterFieldSelector.bindingType();
                            }
                            desc.contextFilterValue = widgetContextFilterSelector.find('widgetContextFilterValue').value() || '';
                            desc.contextFilterOp = widgetContextFilterSelector.find('widgetContextFilterOp').value() || '$eq';
                        }
                    }
				} else {
					// simple text
					var textSelector = viewSelector.find('text');
					desc.textSelector = textSelector;
					var sortSelector = viewSelector.find('textSort');
					if(sortSelector.checked()){
						desc.sortFields = textSelector.bindings(true);
					}
					var contextFilterSelector = viewSelector.find('contextFilter');
					if(contextFilterSelector.checked()){
						if(contextFilterSelector.find('contextFilterFixed').checked()){
							desc.contextFilterFixed = true;
						}
						desc.contextFilterField = textSelector.binding();
						desc.contextFilterFieldType = textSelector.bindingType();
						desc.contextFilterValue = contextFilterSelector.find('contextFilterValue').value() || '';
						desc.contextFilterOp = contextFilterSelector.find('contextFilterOp').value() || '$eq';
					}
					var formatSelector = viewSelector.find('textFormat');
					if(formatSelector.checked()){
						desc.format = formatSelector.find('formatter').value();
					}
				}
				
				this.colDesc.push(desc);
			}
			

			

			// update grid
			if(this.getContext().find('showGrid').checked()){
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
	},
	
	$server: {
		rows: [],
		lastPosition: 0,
		
		fetch: function(sourceId, widgetEntry, opts){
			if(opts.treeOpts){
				var needCompress = opts.compress;
				var batchSize = opts.batchSize || 50;
				opts.compress = false;
				
				if(opts.reset){
					this.rows = [];
					this.lastPosition = 0;
					
					var extQuery = opts.layers.main;
					var hasContextFilter = extQuery.$postFilter && Object.keys(extQuery.$postFilter).length > 0;
					var hasCubeFilter = extQuery.$cubeFilter && Object.keys(extQuery.$cubeFilter).length > 0;
					
					// generate expanded map
					var expandedMap = {};
					for(var i = 0; i < opts.treeOpts.expanded.length; i++){
						expandedMap[opts.treeOpts.expanded[i]] = true;
					}

					// generate collapsed map
					var collapsedMap = {};
					for(var i = 0; i < opts.treeOpts.collapsed.length; i++){
						collapsedMap[opts.treeOpts.collapsed[i]] = true;
					}

					// tree functions
					var idMap = {};
					var pIdMap = {};
					var tree = [];
					function getBindingData(row, binding){
						var val = null;
						var d = row.main || row.back;
						if(binding.indexOf('.') >= 0){
							// dot-split function
							if(d){
								var bParts = binding.split('.');
								var curScope = d;
								for(var i = 0; i < bParts.length; i++){
									curScope = curScope[bParts[i]];
									if(!JSB.isDefined(curScope)){
										break;
									}
								}
								val = curScope;
							}
							
						} else {
							// direct binding
							if(d){
								val = d[binding];
							}
						}
						
						return val;
					}

					function appendToTree(rows){
						for(var i = 0; i < rows.length; i++){
							var row = rows[i];
							var id = getBindingData(row, opts.treeOpts.idField);
							var parentId = getBindingData(row, opts.treeOpts.parentField);
							var node = {
								id: id,
								pId: parentId,
								row: row,
								matched: (row.main ? true : false),
								children: []
							};
							idMap[id] = node;
							if(pIdMap[id]){
								node.children = pIdMap[id];
								delete pIdMap[id];
								if(!node.matched){
									for(var c = 0; c < node.children.length; c++){
										if(node.children[c].matched){
											node.matched = true;
											break;
										}
									}
								}
							}
							if(parentId != opts.treeOpts.rootRowKeyValue){
								if(idMap[parentId]){
									idMap[parentId].children.push(node);
									idMap[parentId].matched = idMap[parentId].matched || node.matched;
								} else {
									if(!pIdMap[parentId]){
										pIdMap[parentId] = [];
									}
									pIdMap[parentId].push(node);
								}
							} else {
								tree.push(node);
							}
							
						}
					}
					
					// construct rows
					function serializeNode(node){
						$this.rows.push(node.row);
						if(!node.matched && !expandedMap[node.id] && !hasContextFilter){
							return;
						}
						if(collapsedMap[node.id]){
							return;
						}
						for(var i = 0; i < node.children.length; i++){
							serializeNode(node.children[i]);
						}
					}
					
					function serializeTree(){
						for(var i = 0; i < tree.length; i++){
							serializeNode(tree[i]);
						}
					}


					// translate tree
					if(hasContextFilter || hasCubeFilter){
	
						
						// combine leafs matching filter
						var allRows = [];
						while(true){
							var rows = $base(sourceId, widgetEntry, opts);
							opts.reset = false;
							if(rows.length == 0){
								break;
							}
							allRows = allRows.concat(rows);
						}
						
						
						
						// collect parent nodes
						var curRows = allRows;
						var parentIds = [];
						while(curRows && curRows.length > 0){
							appendToTree(curRows);
							var pIdArr = Object.keys(pIdMap);
							if(pIdArr.length == 0){
								break;
							}
							
							// load parent nodes
							var q = {$or:[]};
							for(var i = 0; i < pIdArr.length; i++){
								var curQ = {};
								curQ[opts.treeOpts.idField] = {$eq:{$const:pIdArr[i]}};
								q.$or.push(curQ);
							}
							var qOpts = {
								extQuery: {$postFilter:q},
								batchSize: pIdArr.length * 2
							};
							var pRows = $this.executeQuery(sourceId, widgetEntry, qOpts);
							var newRows = [];
							for(var i = 0; i < pRows.length; i++){
								var e = {
									back:pRows[i]
								};
								newRows.push(e);
								
							}
							curRows = newRows;
						}
						
						serializeTree();
						
					} else {
						// open only specified nodes
						var treeFilter = {$or:[]};

						// add top nodes
						var topQ = {};
						topQ[opts.treeOpts.parentField] = {$eq:{$const:opts.treeOpts.rootRowKeyValue}};
						treeFilter.$or.push(topQ);
						
						// add expanded
						for(var i = 0; i < opts.treeOpts.expanded.length; i++){
							var expQ = {};
							expQ[opts.treeOpts.parentField] = {$eq:{$const:opts.treeOpts.expanded[i]}};
							treeFilter.$or.push(expQ);
						}
						
						if(opts.layers.main){
							opts.layers.main.$postFilter = treeFilter;
						}
						if(opts.layers.back){
							opts.layers.back.$postFilter = treeFilter;
						}
						
						opts.reset = true;
						var allRows = [];
						while(true){
							var rows = $base(sourceId, widgetEntry, opts);
							opts.reset = false;
							if(rows.length == 0){
								break;
							}
							allRows = allRows.concat(rows);
						}
						appendToTree(allRows);
						serializeTree();
					}
				}
				
				var retRows = this.rows.slice(this.lastPosition, this.lastPosition + batchSize);
				this.lastPosition += retRows.length;
				
				if(needCompress){
					var encoded = $this.compressData(retRows);
					encoded.widgetOpts = $this.extendWidgetOpts(opts.widgetOpts);
					return encoded;
				} else {
					return retRows;
				}

			} else {
				return $base(sourceId, widgetEntry, opts);
			}
		}
	}
}