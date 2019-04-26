{
	$name: 'DataCube.Widgets.Table',
	$parent: 'DataCube.Widgets.Widget',
	$expose: {
		name: 'Таблица',
		description: 'Отображает данные в виде таблицы, списка или дерева.\r\nПозволяет вкладывать в ячейки другие виджеты.',
		category: 'Основные',
		icon: `data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiIHN0YW5kYWxvbmU9Im5vIj8+DQo8c3ZnDQogICB4bWxuczpkYz0iaHR0cDovL3B1cmwub3JnL2RjL2VsZW1lbnRzLzEuMS8iDQogICB4bWxuczpjYz0iaHR0cDovL2NyZWF0aXZlY29tbW9ucy5vcmcvbnMjIg0KICAgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIg0KICAgeG1sbnM6c3ZnPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyINCiAgIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyINCiAgIHhtbG5zOnNvZGlwb2RpPSJodHRwOi8vc29kaXBvZGkuc291cmNlZm9yZ2UubmV0L0RURC9zb2RpcG9kaS0wLmR0ZCINCiAgIHhtbG5zOmlua3NjYXBlPSJodHRwOi8vd3d3Lmlua3NjYXBlLm9yZy9uYW1lc3BhY2VzL2lua3NjYXBlIg0KICAgdmlld0JveD0iMCAwIDIwIDIwIg0KICAgaWQ9InN2ZzIiDQogICB2ZXJzaW9uPSIxLjEiDQogICBpbmtzY2FwZTp2ZXJzaW9uPSIwLjkxIHIxMzcyNSINCiAgIHNvZGlwb2RpOmRvY25hbWU9InRhYmxlX2ljb24uc3ZnIg0KICAgd2lkdGg9IjIwIg0KICAgaGVpZ2h0PSIyMCINCiAgIHN0eWxlPSJjbGlwLXJ1bGU6ZXZlbm9kZDtmaWxsLXJ1bGU6ZXZlbm9kZDtpbWFnZS1yZW5kZXJpbmc6b3B0aW1pemVRdWFsaXR5O3NoYXBlLXJlbmRlcmluZzpnZW9tZXRyaWNQcmVjaXNpb247dGV4dC1yZW5kZXJpbmc6Z2VvbWV0cmljUHJlY2lzaW9uIj4NCiAgPG1ldGFkYXRhDQogICAgIGlkPSJtZXRhZGF0YTM2Ij4NCiAgICA8cmRmOlJERj4NCiAgICAgIDxjYzpXb3JrDQogICAgICAgICByZGY6YWJvdXQ9IiI+DQogICAgICAgIDxkYzpmb3JtYXQ+aW1hZ2Uvc3ZnK3htbDwvZGM6Zm9ybWF0Pg0KICAgICAgICA8ZGM6dHlwZQ0KICAgICAgICAgICByZGY6cmVzb3VyY2U9Imh0dHA6Ly9wdXJsLm9yZy9kYy9kY21pdHlwZS9TdGlsbEltYWdlIiAvPg0KICAgICAgICA8ZGM6dGl0bGU+PC9kYzp0aXRsZT4NCiAgICAgIDwvY2M6V29yaz4NCiAgICA8L3JkZjpSREY+DQogIDwvbWV0YWRhdGE+DQogIDxzb2RpcG9kaTpuYW1lZHZpZXcNCiAgICAgcGFnZWNvbG9yPSIjZmZmZmZmIg0KICAgICBib3JkZXJjb2xvcj0iIzY2NjY2NiINCiAgICAgYm9yZGVyb3BhY2l0eT0iMSINCiAgICAgb2JqZWN0dG9sZXJhbmNlPSIxMCINCiAgICAgZ3JpZHRvbGVyYW5jZT0iMTAiDQogICAgIGd1aWRldG9sZXJhbmNlPSIxMCINCiAgICAgaW5rc2NhcGU6cGFnZW9wYWNpdHk9IjAiDQogICAgIGlua3NjYXBlOnBhZ2VzaGFkb3c9IjIiDQogICAgIGlua3NjYXBlOndpbmRvdy13aWR0aD0iMTkyMCINCiAgICAgaW5rc2NhcGU6d2luZG93LWhlaWdodD0iMTE3OCINCiAgICAgaWQ9Im5hbWVkdmlldzM0Ig0KICAgICBzaG93Z3JpZD0iZmFsc2UiDQogICAgIHNob3dndWlkZXM9InRydWUiDQogICAgIGlua3NjYXBlOmd1aWRlLWJib3g9InRydWUiDQogICAgIGlua3NjYXBlOnpvb209IjYwLjQxNiINCiAgICAgaW5rc2NhcGU6Y3g9IjQuOTIzMTA0OCINCiAgICAgaW5rc2NhcGU6Y3k9IjExLjA5NjYzMiINCiAgICAgaW5rc2NhcGU6d2luZG93LXg9IjE5MTIiDQogICAgIGlua3NjYXBlOndpbmRvdy15PSItOCINCiAgICAgaW5rc2NhcGU6d2luZG93LW1heGltaXplZD0iMSINCiAgICAgaW5rc2NhcGU6Y3VycmVudC1sYXllcj0ic3ZnMiI+DQogICAgPHNvZGlwb2RpOmd1aWRlDQogICAgICAgcG9zaXRpb249IjAsMy4xMzY2NjI4Ig0KICAgICAgIG9yaWVudGF0aW9uPSIxLDAiDQogICAgICAgaWQ9Imd1aWRlNDE2NCIgLz4NCiAgICA8c29kaXBvZGk6Z3VpZGUNCiAgICAgICBwb3NpdGlvbj0iMC45ODMxMzMxMSwtMi42Njg1MDQxIg0KICAgICAgIG9yaWVudGF0aW9uPSIxLDAiDQogICAgICAgaWQ9Imd1aWRlNDE2NiIgLz4NCiAgICA8c29kaXBvZGk6Z3VpZGUNCiAgICAgICBwb3NpdGlvbj0iMTkuMDA3MjQsOC43MDc3NTA0Ig0KICAgICAgIG9yaWVudGF0aW9uPSIxLDAiDQogICAgICAgaWQ9Imd1aWRlNDE2OCIgLz4NCiAgICA8c29kaXBvZGk6Z3VpZGUNCiAgICAgICBwb3NpdGlvbj0iNS4wMTUyMjc4LDE1LjAxMjU4Ig0KICAgICAgIG9yaWVudGF0aW9uPSIwLDEiDQogICAgICAgaWQ9Imd1aWRlNDE4MCIgLz4NCiAgICA8c29kaXBvZGk6Z3VpZGUNCiAgICAgICBwb3NpdGlvbj0iMTMuMjQ4ODg5LDEzLjk5Nzk0MyINCiAgICAgICBvcmllbnRhdGlvbj0iMCwxIg0KICAgICAgIGlkPSJndWlkZTQxODIiIC8+DQogICAgPHNvZGlwb2RpOmd1aWRlDQogICAgICAgcG9zaXRpb249IjEyLjY0MDI4MywxMy4wMTQ4MSINCiAgICAgICBvcmllbnRhdGlvbj0iMCwxIg0KICAgICAgIGlkPSJndWlkZTQxODQiIC8+DQogICAgPHNvZGlwb2RpOmd1aWRlDQogICAgICAgcG9zaXRpb249IjEzLjc2Mzg2MywxMi4wMzE2NzciDQogICAgICAgb3JpZW50YXRpb249IjAsMSINCiAgICAgICBpZD0iZ3VpZGU0MTg2IiAvPg0KICAgIDxzb2RpcG9kaTpndWlkZQ0KICAgICAgIHBvc2l0aW9uPSIxMy4wNjE2MjYsMTEuMDAxNzI4Ig0KICAgICAgIG9yaWVudGF0aW9uPSIwLDEiDQogICAgICAgaWQ9Imd1aWRlNDE4OCIgLz4NCiAgICA8c29kaXBvZGk6Z3VpZGUNCiAgICAgICBwb3NpdGlvbj0iMi45OTU4OTUxLDguMDI3Njc0OCINCiAgICAgICBvcmllbnRhdGlvbj0iMSwwIg0KICAgICAgIGlkPSJndWlkZTQxOTAiIC8+DQogICAgPHNvZGlwb2RpOmd1aWRlDQogICAgICAgcG9zaXRpb249IjcuMDAxNDU2NiwxNS42MjUiDQogICAgICAgb3JpZW50YXRpb249IjEsMCINCiAgICAgICBpZD0iZ3VpZGU0MTkyIiAvPg0KICAgIDxzb2RpcG9kaTpndWlkZQ0KICAgICAgIHBvc2l0aW9uPSIxNi45OTg4MDgsNC4xMDQ4NzI5Ig0KICAgICAgIG9yaWVudGF0aW9uPSIxLDAiDQogICAgICAgaWQ9Imd1aWRlNDE5NCIgLz4NCiAgICA8c29kaXBvZGk6Z3VpZGUNCiAgICAgICBwb3NpdGlvbj0iNS4wMTUyMjc4LDExLjc2ODQwNiINCiAgICAgICBvcmllbnRhdGlvbj0iMSwwIg0KICAgICAgIGlkPSJndWlkZTQxOTYiIC8+DQogICAgPHNvZGlwb2RpOmd1aWRlDQogICAgICAgcG9zaXRpb249IjguNDkxMTI4Miw5LjAwNDIzNzMiDQogICAgICAgb3JpZW50YXRpb249IjAsMSINCiAgICAgICBpZD0iZ3VpZGU0MTk4IiAvPg0KICAgIDxzb2RpcG9kaTpndWlkZQ0KICAgICAgIHBvc2l0aW9uPSI3LjI2NjI4NzEsNi45ODQ5MDQ3Ig0KICAgICAgIG9yaWVudGF0aW9uPSIwLDEiDQogICAgICAgaWQ9Imd1aWRlNDIwMCIgLz4NCiAgICA8c29kaXBvZGk6Z3VpZGUNCiAgICAgICBwb3NpdGlvbj0iOC4xMjY5ODYzLDQuOTk4Njc1OSINCiAgICAgICBvcmllbnRhdGlvbj0iMCwxIg0KICAgICAgIGlkPSJndWlkZTQyMDIiIC8+DQogICAgPHNvZGlwb2RpOmd1aWRlDQogICAgICAgcG9zaXRpb249IjguNTI0MjMyLDIuOTk1ODk1MSINCiAgICAgICBvcmllbnRhdGlvbj0iMCwxIg0KICAgICAgIGlkPSJndWlkZTQyMDQiIC8+DQogICAgPHNvZGlwb2RpOmd1aWRlDQogICAgICAgcG9zaXRpb249IjkuMzY4Mzc5MywxNy4wMTUzNiINCiAgICAgICBvcmllbnRhdGlvbj0iMCwxIg0KICAgICAgIGlkPSJndWlkZTQyMDYiIC8+DQogICAgPHNvZGlwb2RpOmd1aWRlDQogICAgICAgcG9zaXRpb249IjkuNTE3MzQ2NCwxLjAwOTY2NjMiDQogICAgICAgb3JpZW50YXRpb249IjAsMSINCiAgICAgICBpZD0iZ3VpZGU0MjA4IiAvPg0KICA8L3NvZGlwb2RpOm5hbWVkdmlldz4NCiAgPGRlZnMNCiAgICAgaWQ9ImRlZnM0Ij4NCiAgICA8aW5rc2NhcGU6cGF0aC1lZmZlY3QNCiAgICAgICBlZmZlY3Q9ImJlbmRfcGF0aCINCiAgICAgICBpZD0icGF0aC1lZmZlY3Q0MjExIg0KICAgICAgIGlzX3Zpc2libGU9InRydWUiDQogICAgICAgYmVuZHBhdGg9Im0gMy4wMDIxNTM0LDcuMDA3MDI4NyAyLjAyNjUxMjksMCINCiAgICAgICBwcm9wX3NjYWxlPSIxLjE2Ig0KICAgICAgIHNjYWxlX3lfcmVsPSJmYWxzZSINCiAgICAgICB2ZXJ0aWNhbD0iZmFsc2UiIC8+DQogICAgPHN0eWxlDQogICAgICAgdHlwZT0idGV4dC9jc3MiDQogICAgICAgaWQ9InN0eWxlNiI+PCFbQ0RBVEFbDQogICAgLnN0cjAge3N0cm9rZTojNDM0MjQyO3N0cm9rZS13aWR0aDoxMH0NCiAgICAuZmlsMiB7ZmlsbDojNDM0MjQyfQ0KICAgIC5maWwxIHtmaWxsOiNGRkZGRkZ9DQogICAgLmZpbDAge2ZpbGw6dXJsKCNpZDApfQ0KICAgXV0+PC9zdHlsZT4NCiAgICA8bGluZWFyR3JhZGllbnQNCiAgICAgICBncmFkaWVudFVuaXRzPSJ1c2VyU3BhY2VPblVzZSINCiAgICAgICBpZD0iaWQwIg0KICAgICAgIHgxPSI0NDkuOTk3OTkiDQogICAgICAgeDI9IjUwIg0KICAgICAgIHkxPSIyNTAiDQogICAgICAgeTI9IjI1MCINCiAgICAgICBncmFkaWVudFRyYW5zZm9ybT0ibWF0cml4KDAuMDQ4NzkxNiwwLDAsMC4wNDY0Nzk0MywtMi4xOTE0OTM4LC0xLjYwMDM4MDUpIj4NCiAgICAgIDxzdG9wDQogICAgICAgICBvZmZzZXQ9IjAiDQogICAgICAgICBzdG9wLWNvbG9yPSIjMDA4QkZGIg0KICAgICAgICAgaWQ9InN0b3A5IiAvPg0KICAgICAgPHN0b3ANCiAgICAgICAgIG9mZnNldD0iMSINCiAgICAgICAgIHN0b3AtY29sb3I9IiMwYWYiDQogICAgICAgICBpZD0ic3RvcDExIiAvPg0KICAgIDwvbGluZWFyR3JhZGllbnQ+DQogIDwvZGVmcz4NCiAgPHJlY3QNCiAgICAgc3R5bGU9ImZpbGw6dXJsKCNpZDApO3N0cm9rZTojNDM0MjQyO3N0cm9rZS13aWR0aDowLjQ3NjIxNDg2Ig0KICAgICBpZD0icmVjdDE0Ig0KICAgICB5PSIwLjI1ODc5NjY5Ig0KICAgICB4PSIwLjI0ODA4NjIiDQogICAgIHdpZHRoPSIxOS41MTY2NCINCiAgICAgcnk9IjAuOTI5NTg4NjIiDQogICAgIHJ4PSIwLjk3NTgzMTk5Ig0KICAgICBoZWlnaHQ9IjE5LjUyMTM2Ig0KICAgICBjbGFzcz0iZmlsMCBzdHIwIiAvPg0KICA8cGF0aA0KICAgICBzdHlsZT0iZmlsbDojZmZmZmZmO3N0cm9rZTojNDM0MjQyO3N0cm9rZS13aWR0aDowLjQ3NTQ3NjIxIg0KICAgICBpbmtzY2FwZTpjb25uZWN0b3ItY3VydmF0dXJlPSIwIg0KICAgICBpZD0icGF0aDE2Ig0KICAgICBkPSJtIDEuNzExNDg1NCwzLjIyOTkzNDcgMTYuNTg5ODQxNiwwIGMgMC4yOTI3NjIsMCAwLjQ4NzkzNiwwLjIzMTY2NyAwLjQ4NzkzNiwwLjQ2MzMzNDEgbCAwLDE0LjU5NTAyMzIgYyAwLDAuMjMxNjY4IC0wLjE5NTE3NCwwLjQ2MzMzNSAtMC40ODc5MzYsMC40NjMzMzUgbCAtMTYuNTg5ODQxNiwwIGMgLTAuMjkyNzYxOSwwIC0wLjQ4NzkzNjUsLTAuMTg1MzM0IC0wLjQ4NzkzNjUsLTAuNDYzMzM1IGwgMCwtMTQuNTk1MDIzMiBjIDAsLTAuMjMxNjY3MSAwLjE5NTE3NDYsLTAuNDYzMzM0MSAwLjQ4NzkzNjUsLTAuNDYzMzM0MSB6Ig0KICAgICBjbGFzcz0iZmlsMSBzdHIwIiAvPg0KICA8cGF0aA0KICAgICBzdHlsZT0iZmlsbDojNDM0MjQyIg0KICAgICBkPSJtIDMuMDAyMTUzNCw2LjAwNTUzNDIgMi4wMjY1MTI5LDAgMCwyLjAwMjk4OSAtMi4wMjY1MTI5LDAgeiINCiAgICAgaWQ9InJlY3QxOCIgLz4NCiAgPHJlY3QNCiAgICAgc3R5bGU9ImZpbGw6IzQzNDI0MiINCiAgICAgaWQ9InJlY3QyMCINCiAgICAgeT0iNi4wMTEyMTM4Ig0KICAgICB4PSI3LjAwNTUyMjciDQogICAgIHdpZHRoPSIxMC4wMDUwODkiDQogICAgIGhlaWdodD0iMS45OTAyNTE1Ig0KICAgICBjbGFzcz0iZmlsMiIgLz4NCiAgPHJlY3QNCiAgICAgc3R5bGU9ImZpbGw6IzQzNDI0MiINCiAgICAgaWQ9InJlY3QyMiINCiAgICAgeT0iOS45OTQ0MzkxIg0KICAgICB4PSIzLjAwMjE1MzYiDQogICAgIHdpZHRoPSIyLjAwOTk2MDkiDQogICAgIGhlaWdodD0iMi4wMDY4MDM1Ig0KICAgICBjbGFzcz0iZmlsMiIgLz4NCiAgPHJlY3QNCiAgICAgc3R5bGU9ImZpbGw6IzQzNDI0MiINCiAgICAgaWQ9InJlY3QyNCINCiAgICAgeT0iOS45OTQ0MzgyIg0KICAgICB4PSI3LjAwNTUyMjciDQogICAgIHdpZHRoPSIxMC4wMDUwODkiDQogICAgIGhlaWdodD0iMi4wMDY4MDM1Ig0KICAgICBjbGFzcz0iZmlsMiIgLz4NCiAgPHJlY3QNCiAgICAgc3R5bGU9ImZpbGw6IzQzNDI0MiINCiAgICAgaWQ9InJlY3QyNiINCiAgICAgeT0iMTQuMDI3Mjc5Ig0KICAgICB4PSIzLjAwMjE1MjQiDQogICAgIHdpZHRoPSIyLjAwOTk2MDkiDQogICAgIGhlaWdodD0iMS45ODE5NzU3Ig0KICAgICBjbGFzcz0iZmlsMiIgLz4NCiAgPHJlY3QNCiAgICAgc3R5bGU9ImZpbGw6IzQzNDI0MiINCiAgICAgaWQ9InJlY3QyOCINCiAgICAgeT0iMTQuMDI3Mjc5Ig0KICAgICB4PSI3LjAwNTUyMjciDQogICAgIHdpZHRoPSIxMC4wMDUwODkiDQogICAgIGhlaWdodD0iMS45NzM2OTk3Ig0KICAgICBjbGFzcz0iZmlsMiIgLz4NCjwvc3ZnPg0K`
	},
	$scheme: {
		common: {
			items: {
				showHeader: {
			        render: 'item',
			        name: 'Отображать заголовок',
			        optional: 'checked',
			        editor: 'none'
			    },
			    showGrid: {
		            render: 'item',
		            name: 'Отображать сетку',
			        optional: 'checked',
			        editor: 'none'
			    },
			    showSortIcon: {
	                render: 'item',
	                name: 'Отображать значок сортировки',
					optional: 'checked',
					editor: 'none'
	            },
	            useGroupOperations: {
	            	render: 'item',
	                name: 'Разрешить групповые операции',
					optional: 'checked',
					editor: 'none'
	            },
	    	    usePrefetch: {
	    	    	render: 'item',
	                name: 'Использовать упреждающую загрузку данных',
	                optional: true,
	                editor: 'none'
	    	    },
	    	    preserveScrollPosition: {
	    	    	render: 'item',
	                name: 'Сохранять положение прокрутки при обновлении',
	                optional: true,
	                editor: 'none'
	    	    },
	    	    useAnimation: {
	    	    	render: 'switch',
	                name: 'Анимация',
	                optional: 'checked',
	                items: {
	                	animationDuration: {
	                		render: 'item',
	    	                name: 'Продолжительность анимации (ms)',
	    	                value: 1000,
	    	                valueType: 'number'
	                	}
	                }
	    	    }
			}
		},
	    rows: {
	        render: 'sourceBinding',
	        name: 'Источник'
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
	            	render: 'group',
	            	name: 'Фильтрация',
	            	multiple: true,
	            	items: {
	            		filterField: {
	    	                render: 'dataBinding',
	    	                name: 'Фильтрующее значение',
	    	                linkTo: 'rows'
	            		},
	            		cubeField: {
	            			render: 'dataBinding',
	            			name: 'Задать поле куба',
	            			cubeFields: true,
	            			linkTo: 'rows',
	            			optional: true
	            		}
	            	}
	                
	            },
	            
	            preserveFilteredRows: {
	                render: 'item',
	                name: 'Не скрывать отфильтрованные строки',
					optional: true,
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
                        },
                        treeState: {
                        	render: 'select',
                        	name: 'Начальное состояние',
                        	items: {
                        		stateCollapsed: {
                        			name: 'Свернутое',
                        			items: {
                        				expandWithContextFilter: {
                            				render: 'item',
                            				name: 'Разворачивать при контекстном поиске',
                            				optional: 'checked',
                            				editor: 'none'
                        				},
                        				expandWithGlobalFilter: {
                            				render: 'item',
                            				name: 'Разворачивать при глобальной фильтрации',
                            				optional: true,
                            				editor: 'none'
                        				},
                        			}
                        		},
                        		stateExpanded: {
                        			render: 'item',
                                	name: 'Развернутое'
                        		}
                        	}
                        }
	                }
	            },
	            rowClick: {
	            	render: 'group',
	            	name: 'Действия при клике',
	            	items: {
	            		useFilterOnClick: {
	    	            	render: 'select',
	    	                name: 'Использовать глобальную фильтрацию',
	    					optional: true,
	    					items: {
	    						filterOnClickAnd: {
	    							render: 'item',
	    							name: 'И'
	    						},
	    						filterOnClickOr: {
	    							render: 'item',
	    							name: 'ИЛИ'
	    						},
	    						filterOnClickNot: {
	    							render: 'item',
	    							name: 'НЕ'
	    						}
	    					}
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
	    	            	name: 'Отображать виджет в выноске',
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
                                            //linkTo: 'rows',
                                            formatterOpts: {
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
                                        widgetContextFilterFixed: {
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
/*                useForCompare: {
                	render: 'switch',
                    name: 'Использовать для сравнения',
                    items: {
                    	
                    }
                },*/
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
                                            //linkTo: 'rows',
                                            formatterOpts: {
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
		           'JSB.Utils.Formatter',
		           'DataCube.Widgets.WidgetTool',
		           'JSB.Widgets.ToolManager',
		           'css:Table.css'],
		
		_ready: false,
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
		widgetTool: null,
		
		$constructor: function(opts){
			$base(opts);
			
			this.addClass('tableWidget');
/*			
			this.messageBox = this.$('<div class="message hidden"></div>');
			this.append(this.messageBox);
*/			
			
			this.header = this.$('<table class="header" cellpadding="0" cellspacing="0"><colgroup></colgroup><thead><tr></tr></thead></table>');
			this.append(this.header);
			
			this.scroll = new ScrollBox({
				onScroll: function(){
					if(!$this.getElement().is(':visible')){
						return;
					}
					if($this.useTooltipOnHover && $this.widgetTool){
						$this.widgetTool.close();
						$this.widgetTool = null;
					}
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
					$this.rowsTable = $this.$('<table class="rows" cellpadding="0" cellspacing="0"><colgroup></colgroup><tbody></tbody></table>');
					$this.scroll.append($this.rowsTable);

					$this.rowFilterTool = this.$('<div class="rowFilterTool hidden"><div class="mark">&#10004;</div><div class="and">И</div><div class="or">ИЛИ</div><div class="not">НЕ</div></div>');
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
						$this.onFilterClick($this.highlightedRowData, '$not', '$eq');
					});
					
					$this.rowFilterTool.find('> div.mark').click(function(){
						$this.toggleRowSelection($this.highlightedRowData.key);
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
					
					$this.subscribe('DataCube.Widgets.Widget.toolbar', function(sender, msg, bEnabled){
						if(sender != $this){
							return;
						}
						$this.enableMultiselect(bEnabled);
					});
					
					$this.subscribe('DataCube.Widgets.Widget.selection', function(sender, msg, params){
						if(sender != $this){
							return;
						}
						$this.synchronizeSelection(params);
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
					$this._ready = true;
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
				
				this.refresh({preserveSelection:true});
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
			
			$this.server().executeQuery(source, $this.getEntry(), {extQuery: {}, wrapQuery: wrapQuery}, function(res, fail){
				if(fail){
					JSB.getLogger().error(fail);
                    $this.showMessage('<strong>Ошибка!</strong><br /> ' + fail.message);
                    $this.descendantsMap[rowDesc.key] = 0;
				} else {
					if(res && res.length > 0 && JSB.isDefined(res[0].cnt)){
						$this.descendantsMap[rowDesc.key] = res[0].cnt;
					} else {
						$this.descendantsMap[rowDesc.key] = 0;
					}
				}
				callback.call($this, $this.descendantsMap[rowDesc.key]);
			});
		},
		
		drawRows: function(bRefresh){
			function updateColl(d){
				if($this.useTree){
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
				
				if($this.useGroupOperations){
					var collEl = $this.$(this);
					var selectElt = collEl.find('> .select');
					if(d.colIdx > 0){
						// remove select if existed
						if(selectElt.length > 0){
							selectElt.remove();
						}
					} else {
						if(selectElt.length == 0){
							selectElt = $this.$('<div class="select"></div>');
							collEl.prepend(selectElt);
							
							selectElt.click(function(evt){
								evt.stopPropagation();
								$this.toggleRowSelection(d.rowKey);
							});
						}	
					}
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
					JSB.defer(function(){
						widget.refresh();
					}, 0);
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
					if($this.colDesc[d.colIdx].format && JSB.isNumber(val)){
						fVal = Formatter.format($this.colDesc[d.colIdx].format, {y: val});
					}
					cellEl.text(fVal !== null ? fVal : '');
					cellEl.attr('title', val);
					
					// destroy previously created widget
					if($this.widgetMap[d.rowKey] && $this.widgetMap[d.rowKey][d.column]){
						if(cellEl.attr('widget')){
							cellEl.removeAttr('widget');
						}
						var widget = $this.widgetMap[d.rowKey][d.column];
						JSB.defer(function(){
							widget.destroy();	
						},0);
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
			
/*			if($this.rowsDrawn === 0){ // updating after refresh */
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
/*			} */
			
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
				
			
			// rows	
			function _removeRows(){
				var removedRowsSel = rowsSelData.exit();
				
				// destroy highlights
				removedRowsSel
					.each(function(d){
						if($this.highlightedRowKey == d.key){
							$this.highlightedRowKey = null;
							$this.rowFilterTool.addClass('hidden');
						}
					});
				
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
				
				// sort existed rows
				rowsSelData.order();
				
				// append new rows
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
						.style('transform', function(d){return bRefresh && $this.useAnimation ? (d.depth > 0 ? 'scale(0,0)':'translate(-'+$this.getElement().width()+'px,0)') : null;})
						.style('opacity', function(d){return bRefresh && $this.useAnimation ? 0 : null;})
						.on('click',function(d){
							$this.onRowClick(d, $this.$(this), d3.event);
						})
						.on('mouseover', function(d){
							$this.onRowHover(d, $this.$(this), d3.event);
						})
						.on('mouseout', function(d){
							$this.onRowOut(d, $this.$(this), d3.event);
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
					// fixup new row positions
					var visibleAreaTop = -$this.scroll.getScrollPosition().y;
					var visibleAreaBottom = visibleAreaTop + $this.scrollHeight;
					rowsSelData.each(function(rd){
						var newPos = this.offsetTop;
						var dif = rd.vPos - newPos;
						if(dif == 0){
							return;
						}
						var rowHeight = this.offsetHeight;
						if((newPos + rowHeight < visibleAreaTop || newPos > visibleAreaBottom) && (rd.vPos + rowHeight < visibleAreaTop || rd.vPos > visibleAreaBottom)){
							return;
						}
						var curSel = d3.select(this);
						curSel.style('transform', 'translate(0, '+dif+'px)');
						curSel.transition()
							.duration($this.animationDuration || 800)
							.style('transform', 'translate(0,0)')
							.on('end', function(d){
								d3.select(this).style('transform', null);
							});
					});
					
					if(bRefresh){
						// dont animate when scrolling 
						newRowsSel.selectAll('tr.row')
							.transition().duration($this.animationDuration || 800)
								.style('opacity', 1)
								.style('transform', function(d){return d.depth > 0 ? 'scale(1,1)':'translate(0,0)'})
								.on('end', function(d){
									d3.select(this).style('transform', null);
								});
					}
				}

			}

				
			if($this.useAnimation){
				// store row positions before update
				rowsSelData.each(function(rd){
					rd.vPos = this.offsetTop;
				});
				
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
						.duration($this.animationDuration || 800)
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
			if(!$this._ready || $this.rowAppending || $this.blockFetch){
				return;
			}
			this.rowAppending = true;
			var fetchSize = 50;
			
			if(bRefresh){
				if(!this.preserveScrollPosition && !this.useTree){
					this.scroll.scrollTo(0, 0);
				} else if(this.rows.length > fetchSize){
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
				if(!$this.getElement().is(':visible')){
					this.rowAppending = false;
					return;
				}
				var scrollPos = $this.scroll.getScrollPosition();
				if(!scrollPos){
					this.rowAppending = false;
					return;
				}
				var scrollY = scrollPos.y;
				if($this.paneHeight - ($this.scrollHeight - scrollY) > 0.3 * $this.scrollHeight){
					this.rowAppending = false;
					return;
				}
			}
			
			this.fetchRowsBatch(fetchSize, function(rows, fail){
				try {
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
										var widget = new WidgetCls({
											noUpdateDispatcher: true,
											noSelection: true
										});
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
					
					$this.drawRows(bRefresh);
					
					if($this.useGroupOperations){
						$this.synchronizeSelection();
					}
					
					$this.rowAppending = false;
					if(/*!$this.useTree &&*/ pRows.length > 0){
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
				} finally {
					$this.rowAppending = false;
				}
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
			var rowClickParamsSelector = this.rowClickParamsSelector;
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
					collapsed: collapsedVals,
					openExpanded: $this.openExpanded,
					expandByContextFilter: $this.expandByContextFilter,
					expandByGlobalFilter: $this.expandByGlobalFilter
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
					for(var i = 0; i < $this.rowFilters.length; i++){
						var fDesc = $this.rowFilters[i];
						var filterFieldValMain = fDesc.filterFieldSelector.value('main');
						var filterFieldValBack = fDesc.filterFieldSelector.value('back');
						var filterFieldValHover = fDesc.filterFieldSelector.value('hover');
						
						var val = filterFieldValMain;

						if(filterFieldValMain !== undefined){
							rowFlags.main = true;
						}
						if(filterFieldValBack !== undefined){
							rowFlags.back = true;
						}
						if(filterFieldValHover !== undefined){
							rowFlags.hover = true;
						}

						if(val === undefined){
							val = filterFieldValBack;
						}
						
						var fEntry = {
							value: val,
							field: fDesc.filterFieldName
						};
						
						if(fDesc.cubeFieldName){
							fEntry.cubeField = fDesc.cubeFieldName;
						} else if(fDesc.cubeFieldSelector){
							var cubeFieldValMain = fDesc.cubeFieldSelector.value('main');
							var cubeFieldValBack = fDesc.cubeFieldSelector.value('back');
							var cubeFieldValHover = fDesc.cubeFieldSelector.value('hover');
							if(cubeFieldValMain !== undefined){
								fEntry.cubeField = cubeFieldValMain;
							} else if(cubeFieldValBack !== undefined){
								fEntry.cubeField = cubeFieldValBack;
							} else if(cubeFieldValHover !== undefined){
								fEntry.cubeField = cubeFieldValHover;
							}
						}
						
						rowFilter.push(fEntry);
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
					
					if(rows.length >= batchSize /*&& !$this.useTree*/){
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
		
		enableMultiselect: function(bEnabled){
			if(!this.useGroupOperations){
				return;
			}
			$this.multiselect = bEnabled;
			if(bEnabled){
				$this.addClass('multiselect');	
			} else {
				$this.removeClass('multiselect');
			}
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
		
		constructRowSelection: function(rowKey){
			var binding = this.getContext().find('rows').binding();
			var rowDesc = $this.rowKeyMap[rowKey];
			
			var filters = [];
			
			for(var i = 0; i < rowDesc.filter.length; i++){
				var fDesc = {
					sourceId: binding.source,
					op: '$eq',
					field: rowDesc.filter[i].field,
					value: rowDesc.filter[i].value
				};
				if(rowDesc.filter[i].cubeField){
					fDesc.cubeField = rowDesc.filter[i].cubeField;
				}
				filters.push(fDesc);
			}
			
			return {
				filter: filters
			};
		},
		
		combineRowsBetweenKeys: function(sourceKey, targetKey){
			var sourceElt = $this.scroll.find('tr.row[key="'+sourceKey+'"]');
			var upElt = sourceElt, downElt = sourceElt;
			var upKeys = [], downKeys = [], resKeys = [];
			while(upElt.length > 0 || downElt.length > 0){
				if(upElt.length > 0){
					upElt = upElt.prev();
				}
				if(downElt.length > 0){
					downElt = downElt.next();
				}
				if(upElt.length > 0){
					var upKey = upElt.attr('key');
					if(upKey == targetKey){
						resKeys = upKeys;
						break;
					}
					upKeys.push(upKey);
				}
				if(downElt.length > 0){
					var downKey = downElt.attr('key');
					if(downKey == targetKey){
						resKeys = downKeys;
						break;
					}
					downKeys.push(downKey);
				}
			}
			return resKeys;
		},
		
		onRowClick: function(d, rowElt, evt){
			if($this.multiselect || ($this.useGroupOperations && evt.ctrlKey)){
				if(evt.ctrlKey){
					// toggle
					$this.toggleRowSelection(d.key);
				} else if(evt.shiftKey && $this.getSelection().getLastSelectedKey()){
					var keys = $this.combineRowsBetweenKeys(d.key, $this.getSelection().getLastSelectedKey());
					for(var i = 0; i < keys.length; i++){
						$this.getSelection().add(keys[i], $this.constructRowSelection(keys[i]));
					}
					$this.getSelection().add(d.key, $this.constructRowSelection(d.key));
				} else  {
					// change
					$this.getSelection().clear();
					$this.getSelection().add(d.key, $this.constructRowSelection(d.key));
				}
			} else {
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
					var filterOnClickType = '$and';
					var filterOnClickOp = '$eq';
					switch($this.filterOnClickType){
					case 'filterOnClickAnd':
						break;
					case 'filterOnClickOr':
						filterOnClickType = '$or';
						break;
					case 'filterOnClickNot':
						filterOnClickOp = '$ne';
						break;
					}
					$this.onFilterClick(d, filterOnClickType, filterOnClickOp);
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
			}
		},
		
		onFilterClick: function(d, type, op){
			var binding = this.getContext().find('rows').binding();
			if(!binding.source){
				return;
			}
			var bNeedRefresh = false;
			if(d.filter.length > 0){
				if(d.filter.length == 1){
					var fDesc = {
						sourceId: binding.source,
						type: type,
						op: op,
						field: d.filter[0].field,
						value: d.filter[0].value
					};
					if(d.filter[0].cubeField){
						fDesc.cubeField = d.filter[0].cubeField;
					}
					if(type == '$not' && op == '$eq'){
						fDesc.type = '$and';
						fDesc.op = '$ne';
					}
					if(!this.hasFilter(fDesc)){
						this.addFilter(fDesc);
						bNeedRefresh = true;
					}
				} else {
					var fDesc = {
						sourceId: binding.source,
						type: type,
						op: '$group',
						items: []
					}
					for(var i = 0; i < d.filter.length; i++){
						var cDesc = {
							type: '$and',
							op: op,
							field: d.filter[i].field,
							value: d.filter[i].value
						};
						if(d.filter[i].cubeField){
							cDesc.cubeField = d.filter[i].cubeField;
						}
						fDesc.items.push(cDesc);
					}
					if(!this.hasFilter(fDesc)){
						this.addFilter(fDesc);
						bNeedRefresh = true;
					}
				}
			}
			if(bNeedRefresh){
				this.refreshAll();
			}
		},
		
		toggleRowSelection: function(rowKey){
			if(this.getSelection().isSelected(rowKey)){
				this.getSelection().remove(rowKey);
			} else {
				this.getSelection().add(rowKey, $this.constructRowSelection(rowKey));
			}
		},
		
		synchronizeSelection: function(params){
			if(params && params.type == 'add'){
				var rowElt = $this.scroll.find('tr.row[key="'+params.item+'"]');
				if(rowElt && rowElt.length > 0){
					rowElt.addClass('select');
				}
			} else if(params && params.type == 'remove'){
				var rowElt = $this.scroll.find('tr.row[key="'+params.item+'"]');
				if(rowElt && rowElt.length > 0){
					rowElt.removeClass('select');
				}
			} else {
				// synchronize add
				if(this.selection.count() > 0){
					var rowElts = $this.scroll.find('table.rows > tbody > tr.row:not(.select)');
					for(var i = 0; i < rowElts.length; i++){
						var rowElt = $this.$(rowElts[i]);
						var rowKey = rowElt.attr('key');
						if(this.selection.isSelected(rowKey)){
							rowElt.addClass('select');
						}
					}
				}
				
				// synchronize remove
				var rowElts = $this.scroll.find('table.rows > tbody > tr.row.select');
				for(var i = 0; i < rowElts.length; i++){
					var rowElt = $this.$(rowElts[i]);
					var rowKey = rowElt.attr('key');
					if(!this.selection.isSelected(rowKey)){
						rowElt.removeClass('select');
					}
				}
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
		
		onRowOut: function(d, rowElt, evt){
			if((!d.filter || d.filter.length == 0) 
				&& !this.callApiOnClick 
				&& !this.useDrillDownOnClick 
				&& !$this.useGroupOperations
				&& !$this.useTooltipOnHover){
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
				if($this.useTooltipOnHover){
					JSB.cancelDefer('widgetTool_' + $this.getId());
					if($this.widgetTool){
						$this.widgetTool.close();
						$this.widgetTool = null;
					}
				}
			}, 100, deferRowKey);
		},
		
		onRowHover: function(d, rowElt, evt){
			if((!d.filter || d.filter.length == 0) 
				&& !$this.callApiOnClick 
				&& !$this.useDrillDownOnClick 
				&& !$this.useGroupOperations
				&& !$this.useTooltipOnHover){
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
				if($this.useTooltipOnHover){
					JSB.cancelDefer('widgetTool_' + $this.getId());
					if($this.widgetTool){
						$this.widgetTool.close();
						$this.widgetTool = null;
					}
				}
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
			var bAnd = false;
			var bOr = false;
			var bNot = false;
			var bMark = $this.useGroupOperations;
			
			if(d.filter && d.filter.length > 0){
				var bRowExisted = !!d.flags.main;
				
				// check if filter has already been applied for the fields
				var sameFieldMap = {};
				var otherFieldMap = {};
				for(var i = 0; i < d.filter.length; i++){
					sameFieldMap[d.filter[i].cubeField || d.filter[i].field] = d.filter[i].value;
					otherFieldMap[d.filter[i].cubeField || d.filter[i].field] = d.filter[i].value;
				}
				var filters = this.getFilters();
				for(var fId in filters){
					var fDesc = filters[fId];
					
					if(JSB.isDefined(sameFieldMap[fDesc.cubeField || fDesc.field]) && sameFieldMap[fDesc.cubeField || fDesc.field] == fDesc.value){
						delete sameFieldMap[fDesc.cubeField || fDesc.field];
					}
					if(JSB.isDefined(otherFieldMap[fDesc.cubeField || fDesc.field]) && otherFieldMap[fDesc.cubeField || fDesc.field] != fDesc.value){
						delete otherFieldMap[fDesc.cubeField || fDesc.field];
					}
				}
				var bSameApplied = (Object.keys(sameFieldMap).length == 0);
				var bOtherApplied = (Object.keys(otherFieldMap).length == 0);
				
				bAnd = /*bOtherApplied &&*/ !bSameApplied && (bOtherApplied || bRowExisted) /*&& bRowExisted*/;
				bOr = !bRowExisted && !bSameApplied;
				bNot = bRowExisted && !bSameApplied;
			}
			
			// check for hover tooltip
			if($this.useTooltipOnHover && d.filter && d.filter.length > 0){
				JSB.defer(function(){
					$this.showWidgetTip(d, rowElt);	
				}, 600, 'widgetTool_' + $this.getId());
			}
			
			if(!bAnd && !bOr && !bNot && !bMark){
				$this.rowFilterTool.addClass('hidden');
				return;
			}
			
			$this.rowFilterTool.attr('and', bAnd);
			$this.rowFilterTool.attr('or', bOr);
			$this.rowFilterTool.attr('not', bNot);
			$this.rowFilterTool.attr('mark', bMark);
			
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
		
		showWidgetTip: function(d, rowElt){
			var filterOpts = {};
			for(var i = 0; i < d.filter.length; i++){
				var cubeField = this.getCubeField(d.filter[i].field);
				if(cubeField){
					filterOpts[cubeField] = {$eq:{$const:d.filter[i].value}};
				}
			}
			
			
			var widgetType = this.getContext().find('toolWidgetType').value();
			if(widgetType == 'toolNewWidget'){
				var widget = this.getContext().find('toolWidgetType widget').value();
				// TODO: 
				debugger;
			} else if(widgetType == 'toolExistedWidget'){
				var widgetDesc = this.getContext().find('toolWidgetType widget').value();
				$this.getWrapper().server().getWidgetEntry(widgetDesc.widgetWsid, widgetDesc.widgetWid, function(wEntry){
					if($this.widgetTool){
						$this.widgetTool.close();
					}
					$this.widgetTool = ToolManager.activate({
						id: 'widgetTool',
						cmd: 'show',
						data: {
							widgetEntry: wEntry,
							filter: filterOpts
						},
						scope: $this.getElement(),
						target: {
							selector: rowElt,
						},
						constraints: [{
							selector: rowElt,
							weight: 10.0
						},{
							selector: $this.getElement(),
							weight: 1.0
						}],
						callback: function(){
							
						}
					})
				});
				
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
							var bIgnoreFilter = false;
							filterEntry = new FilterEntry({
								onChange: function(filter){
									if(!bIgnoreFilter){
										$this.updateContextFilter(filter);
									}
								},
								onFix: function(filter){
									var filterId = $this.globalizeContextFilter(filter);
									var fDesc = $this.getFilter(filterId);
									bIgnoreFilter = true;
									filterEntry.clear();
									bIgnoreFilter = false;
//									filterEntry.addFixedFilter(fDesc);
								}
							});
							elt.append(filterEntry.getElement());
						}
						filterEntry.setField(d.contextFilterField, d.contextFilterFieldType, d.contextFilterValue, d.contextFilterOp);
						filterEntry.allowFix(false);
						if($this.filterManager){
						    var sourceArr = $this.getSourceIds();
							if(sourceArr && sourceArr.length > 0){
								var source = $this.sources[sourceArr[0]];
								var cubeField = $this.filterManager.extractCubeField(source, d.contextFilterField);
								if(cubeField){
									filterEntry.allowFix(true);
								}
							}
							
						}
						
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
			this.refresh({preserveSelection:true});
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
					this.refresh({preserveSelection:true});
				}
			}
		},
		
		globalizeContextFilter: function(q){
			if(!q || Object.keys(q).length == 0){
				return;
			}
			
			var field = Object.keys(q)[0];
			var op = Object.keys(q[field])[0];
			var val = q[field][op][Object.keys(q[field][op])[0]];
			
			var fDesc = {
				type: '$and',
				op: op,
				field: field,
				value: val
			};
			var cubeField = this.getCubeField(field);
			if(cubeField){
				fDesc.cubeField = cubeField;
			}
			
			var filterId = this.addFilter(fDesc);
			
			this.refreshAll();
			
			return filterId;
		},
		
		refresh: function(opts){
		    this.onRefresh(opts);
		},
		
		onRefresh: function(opts){
			if(!this._ready){
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

			$base(opts);
			
			if(!opts || !opts.preserveSelection){
				this.getSelection().clear();
			}
			
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
			
			// filters
			this.rowFilters = [];
			var rowFilters = this.getContext().find('rowFilter').values();
			for(var i = 0; i < rowFilters.length; i++){
				var filterFieldSelector = rowFilters[i].find('filterField');
				var fieldName = filterFieldSelector.binding();
				if(!fieldName || fieldName.length == 0){
					continue;
				}
				var fDesc = {
					filterFieldSelector: filterFieldSelector,
					filterFieldName: fieldName
				};
				var cubeFieldSelector = rowFilters[i].find('cubeField');
				if(cubeFieldSelector.checked() && cubeFieldSelector.binding()){
					fDesc.cubeFieldSelector = cubeFieldSelector;
					var bInfo = cubeFieldSelector.bindingInfo();
					if(bInfo && bInfo.cubeField){
						fDesc.cubeFieldName = bInfo.field;
					}
				}
				
				this.rowFilters.push(fDesc);
			}
			
			this.useFilterOnClick = this.getContext().find('useFilterOnClick').checked();
			if(this.useFilterOnClick){
				this.filterOnClickType = this.getContext().find('useFilterOnClick').value();
			}
			this.showSortIcon = this.getContext().find('showSortIcon').checked();
			this.callApiOnClick = this.getContext().find('callApiOnClick').checked();
			this.useDrillDownOnClick = this.getContext().find('useDrillDownOnClick').checked();
			this.useTooltipOnHover = this.getContext().find('showRowToolTip').checked();
			this.usePrefetch = this.getContext().find('usePrefetch').checked();
			this.useAnimation = this.getContext().find('useAnimation').checked();
			this.preserveScrollPosition = this.getContext().find('preserveScrollPosition').checked();
			if(this.useAnimation){
				this.animationDuration = this.getContext().find('animationDuration').value();
			}
			
			this.useGroupOperations = this.getContext().find('useGroupOperations').checked();
			
			if(this.useGroupOperations){
				this.addClass('useGroup');
			} else {
				this.removeClass('useGroup');
			}
			
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
				this.openExpanded = this.getContext().find('treeState').value() == 'stateExpanded';
				this.expandByContextFilter = this.getContext().find('expandWithContextFilter').checked();
				this.expandByGlobalFilter = this.getContext().find('expandWithGlobalFilter').checked();
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
                            if(widgetContextFilterSelector.find('widgetContextFilterFixed').checked()){
                                desc.contextFilterFixed = true;
                            }
                            var widgetContextFilterFieldSelector = widgetContextFilterSelector.find('widgetContextFilterField');
                            desc.contextFilterField = widgetContextFilterFieldSelector.binding();
                            desc.contextFilterFieldType = widgetContextFilterFieldSelector.bindingType();
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
/*								
								if(!node.matched){
									for(var c = 0; c < node.children.length; c++){
										if(node.children[c].matched){
											node.matched = true;
											break;
										}
									}
								}
*/								
							}
							if(parentId != opts.treeOpts.rootRowKeyValue){
								if(idMap[parentId]){
									idMap[parentId].children.push(node);
//									idMap[parentId].matched = idMap[parentId].matched || node.matched;
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
						
						if(collapsedMap[node.id]){
							return;
						}
						
						if(!node.matched 
							&& !expandedMap[node.id] 
							&& !opts.treeOpts.openExpanded 
							&& (!opts.treeOpts.expandByContextFilter || !hasContextFilter)
							&& (!opts.treeOpts.expandByGlobalFilter || !hasCubeFilter)){
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
					if(opts.treeOpts.openExpanded || hasContextFilter || hasCubeFilter){ // expanded
						
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
						
					} else {	// collapsed
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