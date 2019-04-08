{
	$name: 'DataCube.Widgets.RangeSelector',
	$parent: 'DataCube.Widgets.HighstockAxis',
	$expose: {
		name: 'Временной диапазон',
		description: '',
		category: 'Диаграммы',
		icon: `data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiIHN0YW5kYWxvbmU9Im5vIj8+DQo8c3ZnDQogICB4bWxuczpkYz0iaHR0cDovL3B1cmwub3JnL2RjL2VsZW1lbnRzLzEuMS8iDQogICB4bWxuczpjYz0iaHR0cDovL2NyZWF0aXZlY29tbW9ucy5vcmcvbnMjIg0KICAgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIg0KICAgeG1sbnM6c3ZnPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyINCiAgIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyINCiAgIHhtbG5zOnNvZGlwb2RpPSJodHRwOi8vc29kaXBvZGkuc291cmNlZm9yZ2UubmV0L0RURC9zb2RpcG9kaS0wLmR0ZCINCiAgIHhtbG5zOmlua3NjYXBlPSJodHRwOi8vd3d3Lmlua3NjYXBlLm9yZy9uYW1lc3BhY2VzL2lua3NjYXBlIg0KICAgaWQ9IkxheWVyXzEiDQogICB2ZXJzaW9uPSIxLjEiDQogICB2aWV3Qm94PSIwIDAgMjAgMjAiDQogICB4bWw6c3BhY2U9InByZXNlcnZlIg0KICAgaW5rc2NhcGU6dmVyc2lvbj0iMC45MSByMTM3MjUiDQogICBzb2RpcG9kaTpkb2NuYW1lPSJpZl8zM18yMTI4NDQ1LnN2ZyINCiAgIHdpZHRoPSIyMCINCiAgIGhlaWdodD0iMjAiPjxtZXRhZGF0YQ0KICAgICBpZD0ibWV0YWRhdGEzMSI+PHJkZjpSREY+PGNjOldvcmsNCiAgICAgICAgIHJkZjphYm91dD0iIj48ZGM6Zm9ybWF0PmltYWdlL3N2Zyt4bWw8L2RjOmZvcm1hdD48ZGM6dHlwZQ0KICAgICAgICAgICByZGY6cmVzb3VyY2U9Imh0dHA6Ly9wdXJsLm9yZy9kYy9kY21pdHlwZS9TdGlsbEltYWdlIiAvPjxkYzp0aXRsZT48L2RjOnRpdGxlPjwvY2M6V29yaz48L3JkZjpSREY+PC9tZXRhZGF0YT48ZGVmcw0KICAgICBpZD0iZGVmczI5IiAvPjxzb2RpcG9kaTpuYW1lZHZpZXcNCiAgICAgcGFnZWNvbG9yPSIjZmZmZmZmIg0KICAgICBib3JkZXJjb2xvcj0iIzY2NjY2NiINCiAgICAgYm9yZGVyb3BhY2l0eT0iMSINCiAgICAgb2JqZWN0dG9sZXJhbmNlPSIxMCINCiAgICAgZ3JpZHRvbGVyYW5jZT0iMTAiDQogICAgIGd1aWRldG9sZXJhbmNlPSIxMCINCiAgICAgaW5rc2NhcGU6cGFnZW9wYWNpdHk9IjAiDQogICAgIGlua3NjYXBlOnBhZ2VzaGFkb3c9IjIiDQogICAgIGlua3NjYXBlOndpbmRvdy13aWR0aD0iMTkyMCINCiAgICAgaW5rc2NhcGU6d2luZG93LWhlaWdodD0iMTE3OCINCiAgICAgaWQ9Im5hbWVkdmlldzI3Ig0KICAgICBzaG93Z3JpZD0iZmFsc2UiDQogICAgIGlua3NjYXBlOnpvb209IjI5LjUiDQogICAgIGlua3NjYXBlOmN4PSIxMS4yOTI2NjgiDQogICAgIGlua3NjYXBlOmN5PSI4LjAyMjEwNzIiDQogICAgIGlua3NjYXBlOndpbmRvdy14PSIxOTEyIg0KICAgICBpbmtzY2FwZTp3aW5kb3cteT0iLTgiDQogICAgIGlua3NjYXBlOndpbmRvdy1tYXhpbWl6ZWQ9IjEiDQogICAgIGlua3NjYXBlOmN1cnJlbnQtbGF5ZXI9IkxheWVyXzEiDQogICAgIHNob3dndWlkZXM9InRydWUiDQogICAgIGlua3NjYXBlOmd1aWRlLWJib3g9InRydWUiPjxzb2RpcG9kaTpndWlkZQ0KICAgICAgIHBvc2l0aW9uPSIxMiwxOC45NDkxNTMiDQogICAgICAgb3JpZW50YXRpb249IjAsMSINCiAgICAgICBpZD0iZ3VpZGU0MTg4IiAvPjxzb2RpcG9kaTpndWlkZQ0KICAgICAgIHBvc2l0aW9uPSIxNi40NzQ1NzYsMTQuOTgzMDUxIg0KICAgICAgIG9yaWVudGF0aW9uPSIwLDEiDQogICAgICAgaWQ9Imd1aWRlNDE5MCIgLz48c29kaXBvZGk6Z3VpZGUNCiAgICAgICBwb3NpdGlvbj0iMTUuNzI4ODE0LDE0Ig0KICAgICAgIG9yaWVudGF0aW9uPSIwLDEiDQogICAgICAgaWQ9Imd1aWRlNDE5MiIgLz48c29kaXBvZGk6Z3VpZGUNCiAgICAgICBwb3NpdGlvbj0iMTQuNzQ1NzYzLDEwIg0KICAgICAgIG9yaWVudGF0aW9uPSIwLDEiDQogICAgICAgaWQ9Imd1aWRlNDE5NCIgLz48c29kaXBvZGk6Z3VpZGUNCiAgICAgICBwb3NpdGlvbj0iMTUuNzI4ODE0LDguOTgzMDUwOSINCiAgICAgICBvcmllbnRhdGlvbj0iMCwxIg0KICAgICAgIGlkPSJndWlkZTQyMDYiIC8+PHNvZGlwb2RpOmd1aWRlDQogICAgICAgcG9zaXRpb249IjE2LjE2OTQ5Miw0Ljk4MzA1MDkiDQogICAgICAgb3JpZW50YXRpb249IjAsMSINCiAgICAgICBpZD0iZ3VpZGU0MjA4IiAvPjxzb2RpcG9kaTpndWlkZQ0KICAgICAgIHBvc2l0aW9uPSIxNy40NTc2MjcsNCINCiAgICAgICBvcmllbnRhdGlvbj0iMCwxIg0KICAgICAgIGlkPSJndWlkZTQyMTAiIC8+PC9zb2RpcG9kaTpuYW1lZHZpZXc+PHBhdGgNCiAgICAgZD0ibSAzLjE3MzE3NCwxLjA2MDU4MzYgLTMuMTgyOTY3MDcsMCAwLDMuOTUwMTQzNyAzLjE4Mjk2NzA3LDAgTCA0LjkxNTY0NDQsMy4wMzU2NTU0IDMuMTczMTc0LDEuMDYwNTgzNiBaIG0gLTAuOTM0NDg2NSwyLjU3OTAxOTQgLTAuMjM2NjgyMiwwIDAsLTAuOTc5Mzc0NSAtMC4yNDQ4NDM2LDAgMCwtMC4xODM2MzI3IDAuNDgxNTI1OCwtMC4wNDA4MDcgMCwxLjIwMzgxNDQgeiINCiAgICAgaWQ9InBhdGg3Ig0KICAgICBpbmtzY2FwZTpjb25uZWN0b3ItY3VydmF0dXJlPSIwIg0KICAgICBzdHlsZT0iZmlsbDojNTAyZDE2IiAvPjxwYXRoDQogICAgIGQ9Im0gOC4zMDY3Mjg2LDYuMDEwMTgyMSAtMy4xODI5NjcxLDAgMCwzLjk1MDE0MzggMy4xODI5NjcxLDAgTCAxMC4wNDkxOTksNy45ODUyNTQgOC4zMDY3Mjg2LDYuMDEwMTgyMSBaIG0gLTAuNTkxNzA1NSwyLjYwMzUwMzkgLTAuNzk1NzQxNywwIDAsLTAuMTU1MDY3NyAwLjM2NzI2NTQsLTAuNDE2MjM0MSBjIDAuMDUzMDUsLTAuMDY1MjkyIDAuMDkzODU3LC0wLjExODM0MTEgMC4xMTgzNDExLC0wLjE2MzIyOTEgMC4wMjQ0ODQsLTAuMDQ0ODg4IDAuMDMyNjQ2LC0wLjA4NTY5NSAwLjAzMjY0NiwtMC4xMjI0MjE4IDAsLTAuMDQ4OTY5IC0wLjAxMjI0MiwtMC4wODk3NzYgLTAuMDM2NzI3LC0wLjExODM0MTEgLTAuMDI0NDg0LC0wLjAyODU2NSAtMC4wNjEyMTEsLTAuMDQ0ODg4IC0wLjExMDE3OTcsLTAuMDQ0ODg4IC0wLjA1MzA0OSwwIC0wLjA4OTc3NiwwLjAyMDQwNCAtMC4xMTgzNDEsMC4wNTcxMyAtMC4wMjg1NjUsMC4wMzY3MjYgLTAuMDQwODA3LDAuMDg1Njk1IC0wLjA0MDgwNywwLjE0MjgyNTQgbCAtMC4yMzI2MDE1LDAgMCwtMC4wMDQwOCBDIDYuODk0Nzk3Nyw3LjY4MzI4MDcgNi45MzE1MjM3LDcuNTkzNTA0NyA3LjAwNDk3NjYsNy41MjAwNTE2IDcuMDc4NDI5Niw3LjQ0NjU5ODYgNy4xNzIyODY1LDcuNDA5ODcyIDcuMjk0NzA4Myw3LjQwOTg3MiBjIDAuMTIyNDIxOCwwIDAuMjE2Mjc4NSwwLjAzMjY0NiAwLjI4NTY1MDksMC4wOTM4NTcgMC4wNjkzNzIsMC4wNjEyMTEgMC4xMDIwMTgxLDAuMTQ2OTA2MiAwLjEwMjAxODEsMC4yNDg5MjQ0IDAsMC4wNjkzNzIgLTAuMDIwNDA0LDAuMTM0NjY0IC0wLjA1NzEzLDAuMTk1ODc0OSAtMC4wMzY3MjcsMC4wNTcxMyAtMC4xMDIwMTgxLDAuMTM4NzQ0NyAtMC4xOTU4NzQ4LDAuMjQ0ODQzNiBsIC0wLjE5NTg3NDksMC4yMzY2ODIxIDAsMC4wMDQwOCAwLjQ4NTYwNjUsMCAwLDAuMTc5NTUyIHoiDQogICAgIGlkPSJwYXRoOSINCiAgICAgaW5rc2NhcGU6Y29ubmVjdG9yLWN1cnZhdHVyZT0iMCINCiAgICAgc3R5bGU9ImZpbGw6IzE2NTA0NCIgLz48cGF0aA0KICAgICBkPSJtIDMuMTczMTc0LDExLjAyNzU3NSAtMy4xODI5NjcwNywwIDAsMy45NTAxNDQgMy4xODI5NjcwNywwIDEuNzQyNDcwNCwtMS45NzUwNzIgLTEuNzQyNDcwNCwtMS45NzUwNzIgeiBtIC0xLjI0ODcwMjUsMi41ODcxODEgYyAtMC4wNzc1MzQsMC4wNjEyMSAtMC4xNzU0NzEyLDAuMDkzODYgLTAuMjk3ODkzLDAuMDkzODYgLTAuMTA2MDk4OSwwIC0wLjE5OTk1NTcsLTAuMDI4NTcgLTAuMjgxNTcwMiwtMC4wODU3IC0wLjA4MTYxNCwtMC4wNTcxMyAtMC4xMTgzNDExLC0wLjEzODc0NCAtMC4xMTQyNjA0LC0wLjI0NDg0MyBsIDAsLTAuMDA0MSAwLjIyODUyMDgsMCBjIDAsMC4wNDQ4OSAwLjAxNjMyMywwLjA4MTYxIDAuMDQ0ODg4LDAuMTEwMTggMC4wMzI2NDYsMC4wMjg1NyAwLjA2OTM3MiwwLjA0NDg5IDAuMTE4MzQxMSwwLjA0NDg5IDAuMDUzMDQ5LDAgMC4wOTc5MzgsLTAuMDE2MzIgMC4xMzA1ODMzLC0wLjA0ODk3IDAuMDMyNjQ2LC0wLjAzMjY1IDAuMDQ4OTY5LC0wLjA3MzQ1IDAuMDQ4OTY5LC0wLjExODM0MSAwLC0wLjA2MTIxIC0wLjAxNjMyMywtMC4xMDYwOTkgLTAuMDQ0ODg4LC0wLjEzODc0NSAtMC4wMzI2NDYsLTAuMDI4NTcgLTAuMDc3NTM0LC0wLjA0NDg5IC0wLjEzNDY2NCwtMC4wNDQ4OSBsIC0wLjEzMDU4MzIsMCAwLC0wLjE3NTQ3MSAwLjEzMDU4MzIsMCBjIDAuMDU3MTMsMCAwLjA5NzkzOCwtMC4wMTYzMiAwLjEyMjQyMTgsLTAuMDQ0ODkgMC4wMjg1NjUsLTAuMDI4NTYgMC4wNDA4MDcsLTAuMDY5MzcgMC4wNDA4MDcsLTAuMTIyNDIyIDAsLTAuMDQ0ODkgLTAuMDEyMjQyLC0wLjA4MTYxIC0wLjA0MDgwNywtMC4xMTAxOCAtMC4wMjg1NjUsLTAuMDI4NTcgLTAuMDY5MzcyLC0wLjA0NDg5IC0wLjExODM0MSwtMC4wNDQ4OSAtMC4wNDQ4ODgsMCAtMC4wNzc1MzQsMC4wMTIyNCAtMC4xMDYwOTg5LDAuMDQwODEgLTAuMDI4NTY1LDAuMDI0NDggLTAuMDQ0ODg4LDAuMDYxMjEgLTAuMDQ0ODg4LDAuMTAyMDE4IGwgLTAuMjI4NTIwOCwwIDAsLTAuMDA0MSBjIC0wLjAwNDA4LC0wLjA4OTc4IDAuMDMyNjQ2LC0wLjE2NzMxIDAuMTA2MDk4OSwtMC4yMjg1MjEgMC4wNzM0NTMsLTAuMDYxMjEgMC4xNjMyMjkxLC0wLjA4OTc4IDAuMjczNDA4OCwtMC4wODk3OCAwLjEyMjQyMTgsMCAwLjIxNjI3ODUsMC4wMjg1NyAwLjI4OTczMTYsMC4wODU3IDAuMDY5MzcyLDAuMDU3MTMgMC4xMDYwOTg5LDAuMTM4NzQ0IDAuMTA2MDk4OSwwLjI0NDg0MyAwLDAuMDUzMDUgLTAuMDE2MzIzLDAuMTAyMDE4IC0wLjA0NDg4OCwwLjE0NjkwNiAtMC4wMzI2NDYsMC4wNDQ4OSAtMC4wNzM0NTMsMC4wODE2MiAtMC4xMjY1MDI2LDAuMTA2MDk5IDAuMDYxMjExLDAuMDI0NDkgMC4xMTAxNzk3LDAuMDU3MTMgMC4xNDI4MjU1LDAuMTA2MDk5IDAuMDMyNjQ2LDAuMDQ0ODkgMC4wNDg5NjksMC4xMDIwMTggMC4wNDg5NjksMC4xNzEzOTEgLTAuMDA0MDgsMC4xMDYwOTkgLTAuMDQwODA3LDAuMTkxNzk0IC0wLjExODM0MTEsMC4yNTMwMDUgeiINCiAgICAgaWQ9InBhdGgxMSINCiAgICAgaW5rc2NhcGU6Y29ubmVjdG9yLWN1cnZhdHVyZT0iMCINCiAgICAgc3R5bGU9ImZpbGw6IzE2NDQ1MCIgLz48Zw0KICAgICBpZD0iZzEzIg0KICAgICBzdHlsZT0iZmlsbDojNDg0NTM3Ig0KICAgICB0cmFuc2Zvcm09Im1hdHJpeCgwLjA0MDgwNzI3LDAsMCwwLjA0MDgwNzI3LC0wLjQ1ODY3MzA0LDAuMjY3NjI5NTQpIj48cG9seWdvbg0KICAgICAgIHBvaW50cz0iMTkwLjUsNDI5LjcgMTg5LjksNDMxLjEgMTgzLjcsNDQwLjUgMTkwLjYsNDQwLjUgMTkwLjYsNDI5LjggIg0KICAgICAgIGlkPSJwb2x5Z29uMTUiDQogICAgICAgc3R5bGU9ImZpbGw6IzQ4NDUzNyIgLz48cGF0aA0KICAgICAgIGQ9Im0gMjE0LjgsMzg1LjcgLTc4LDAgMCw5Ni44IDc4LDAgNDIuNywtNDguNCAtNDIuNywtNDguNCB6IG0gLTE0LjksNTkuNCAtMy4zLDAgMCw2LjQgLTUuOSwwIDAsLTYuNCAtMTIsMCAtMC4zLC0zLjUgMTIuMiwtMTkuNiA2LDAgMCwxOC41IDMuMywwIDAsNC42IHoiDQogICAgICAgaWQ9InBhdGgxNyINCiAgICAgICBpbmtzY2FwZTpjb25uZWN0b3ItY3VydmF0dXJlPSIwIg0KICAgICAgIHN0eWxlPSJmaWxsOiM0ODQ1MzciIC8+PC9nPjxwb2x5Z29uDQogICAgIGlkPSJwb2x5Z29uMTkiDQogICAgIHBvaW50cz0iMzc1LjIsMTI2LjMgMzc1LjIsMjkuNCAxMDIuNCwyOS40IDE0NS4xLDc3LjggMTAyLjQsMTI2LjMgIg0KICAgICBzdHlsZT0iZmlsbDojYTA1YTJjIg0KICAgICB0cmFuc2Zvcm09Im1hdHJpeCgwLjA0MDgwNzI3LDAsMCwwLjA0MDgwNzI3LC0wLjQ1ODY3MzA0LC0wLjEzOTE1MDE4KSIgLz48cG9seWdvbg0KICAgICBpZD0icG9seWdvbjIxIg0KICAgICBwb2ludHM9IjUwMSwyNDUgNTAxLDE0OC4yIDIyOC4xLDE0OC4yIDI3MC45LDE5Ni42IDIyOC4xLDI0NSAiDQogICAgIHN0eWxlPSJmaWxsOiMyMTc4NjciDQogICAgIHRyYW5zZm9ybT0ibWF0cml4KDAuMDQwODA3MjcsMCwwLDAuMDQwODA3MjcsLTAuNDU4NjczMDQsLTAuMDM3NDU1MjUpIiAvPjxwb2x5Z29uDQogICAgIGlkPSJwb2x5Z29uMjMiDQogICAgIHBvaW50cz0iMTQ1LjEsMzE1LjQgMTAyLjQsMzYzLjggMzc1LjIsMzYzLjggMzc1LjIsMjY3IDEwMi40LDI2NyAiDQogICAgIHN0eWxlPSJmaWxsOiMyMTY3NzgiDQogICAgIHRyYW5zZm9ybT0ibWF0cml4KDAuMDQwODA3MjcsMCwwLDAuMDQwODA3MjcsLTAuNDU4NjczMDQsMC4xMzIwMzYzKSIgLz48cG9seWdvbg0KICAgICBpZD0icG9seWdvbjI1Ig0KICAgICBwb2ludHM9IjIyOC4xLDQ4Mi42IDUwMSw0ODIuNiA1MDEsMzg1LjcgMjI4LjEsMzg1LjcgMjcwLjksNDM0LjIgIg0KICAgICBzdHlsZT0iZmlsbDojNmM2NzUzIg0KICAgICB0cmFuc2Zvcm09Im1hdHJpeCgwLjA0MDgwNzI3LDAsMCwwLjA0MDgwNzI3LC0wLjQ1ODY3MzA0LDAuMjY3NjI5NTQpIiAvPjwvc3ZnPg==`
	},
	$scheme: {
        series: {
	        linkedFields: {
	            data: {
	                type: 'number',
	                repeat: true
	            }
	        },
            items: {
                seriesItem: {
                    items: {
                        name: {
                            render: 'dataBinding',
                            name: 'Группы серий',
                            linkTo: 'source'
                        },
                        data: {
                            render: 'dataBinding',
                            name: 'Данные',
                            linkTo: 'source'
                        },
                        type: {
                            render: 'select',
                            name: 'Тип',
                            items: {
                                area: {
                                    name: 'Area'
                                },
                                line: {
                                    name: 'Line'
                                },
                                column: {
                                    name: 'Column'
                                },
                                spline: {
                                    name: 'Spline'
                                }
                            }
                        },
                        color: {
                            render: 'item',
                            name: 'Цвет',
                            editor: 'JSB.Widgets.ColorEditor'
                        },
                        stack: {
                            render: 'item',
                            name: 'Имя стэка',
                            valueType: 'string'
                        },
                        step: {
                            render: 'select',
                            name: 'Шаговая диаграмма',
                            items: {
                                none: {
                                    name: 'Нет'
                                },
                                left: {
                                    name: 'Левый'
                                },
                                center: {
                                    name: 'Центр'
                                },
                                right: {
                                    name: 'Правый'
                                }
                            }
                        },
                        yAxis: {
                            render: 'select',
                            name: 'Ось Y',
                            commonField: 'yAxisNames'
                        }
                    }
                }
            }
        },

        plotOptions: {
	        render: 'group',
	        name: 'Опции точек',
            collapsible: true,
            collapsed: true,
            items: {
                series: {
                    render: 'group',
                    name: 'Общие',
                    collapsible: true,
                    collapsed: true,
                    items: {
                        dataGrouping: {
                            render: 'switch',
                            name: 'Группировка данных',
                            items: {
                                dataApproximation: {
                                    render: 'select',
                                    name: 'Аппроксимация значений',
                                    items: {
                                        $sum: {
                                            name: '$sum'
                                        },
                                        $any: {
                                            name: '$any'
                                        },
                                        $last: {
                                            name: '$last'
                                        },
                                        $first: {
                                            name: '$first'
                                        },
                                        $count: {
                                            name: '$count'
                                        },
                                        $min: {
                                            name: '$min'
                                        },
                                        $max: {
                                            name: '$max'
                                        },
                                        $avg: {
                                            name: '$avg'
                                        }
                                    }
                                },
                                dateApproximation: {
                                    render: 'select',
                                    name: 'Аппроксимация дат',
                                    items: {
                                        $any: {
                                            name: '$any'
                                        },
                                        $last: {
                                            name: '$last'
                                        },
                                        $first: {
                                            name: '$first'
                                        },
                                        $sum: {
                                            name: '$sum'
                                        },
                                        $count: {
                                            name: '$count'
                                        },
                                        $min: {
                                            name: '$min'
                                        },
                                        $max: {
                                            name: '$max'
                                        },
                                        $avg: {
                                            name: '$avg'
                                        }
                                    }
                                },
                                groupBy: {
                                    render: 'select',
                                    name: 'Группировка по',
                                    items: {
                                        millisecond: {
                                            name: 'Миллисекунда'
                                        },
                                        second: {
                                            name: 'Секунда'
                                        },
                                        minute: {
                                            name: 'Минута'
                                        },
                                        hour: {
                                            name: 'Час'
                                        },
                                        day: {
                                            name: 'День'
                                        },
                                        week: {
                                            name: 'Неделя'
                                        },
                                        /*
                                        month: {
                                            name: 'Месяц'
                                        },
                                        year: {
                                            name: 'Год'
                                        }
                                        */
                                    }
                                },
                                groupUnits: {
                                    render: 'item',
                                    name: 'Единица группировки'
                                }
                            }
                        }
                    }
                }
            }
        }
	},
	$client: {
	    $constructor: function(opts){
	        $base(opts);
	        JSB.loadScript('tpl/highcharts/modules/stock.js', function(){
	            $this.setInitialized();
	        });
	    },

	    onRefresh: function(opts){
            if(!$base(opts)){
                this.ready();
                return;
            }

            if(!this._schemeOpts){
                var dataGroupingPlotOptionsContext = this.getContext().find('plotOptions series dataGrouping'),
                    groupConst,
                    groupBy = dataGroupingPlotOptionsContext.find('groupBy').value(),
                    seriesContext = this.getContext().find('series').values();

                switch(groupBy){
                    case 'millisecond':
                        groupConst = 1;
                        break;
                    case 'second':
                        groupConst = 1000;
                        break;
                    case 'minute':
                        groupConst = 60 * 1000;
                        break;
                    case 'hour':
                        groupConst = 60 * 60 * 1000;
                        break;
                    case 'day':
                        groupConst = 24 * 60 * 60 * 1000;
                        break;
                    case 'week':
                        groupConst = 7 * 24 * 60 * 60 * 1000;
                        break;
                    // todo: 31 days, 366 days

                    /*
                    case 'month':
                        groupConst = 30 * 24 * 60 * 60 * 1000;
                        break;
                    case 'year':
                        groupConst = 365 * 24 * 60 * 60 * 1000;
                        break;
                    */
                }

                this._schemeOpts = {
                    dateContext: this.getContext().find('xAxis xAxisDate'),
                    dataGrouping: {
                        dataApproximation: dataGroupingPlotOptionsContext.find('dataApproximation').value(),    // data
                        dateApproximation: dataGroupingPlotOptionsContext.find('dateApproximation').value(),    // date
                        isGrouped: dataGroupingPlotOptionsContext.checked(),
                        groupBy: groupBy,
                        groupConst: groupConst,
                        units: dataGroupingPlotOptionsContext.find('groupUnits').value()
                    },
                    series: [],
                    seriesTypes: []
                };

                for(var i = 0; i < seriesContext.length; i++){
                    this._schemeOpts.series.push({
                        isSeriesGroups: seriesContext[i].find('name').hasBinding(),
                        seriesGroupsSelector: seriesContext[i].find('name'),
                        dataSelector: seriesContext[i].find('data')
                    });
                }
            }

            if(!this._resolveFilters(this._schemeOpts.dateContext.binding())){
                this.ready();
                return;
            }

            var seriesData = [],
                groupBy = undefined,
                wrapQuery = undefined;

            if(this._schemeOpts.dataGrouping.isGrouped){
                wrapQuery = { $groupBy: [{
                        $toInt: {
                          $div: [
                            {
                              $sub: [
                                this._schemeOpts.dateContext.binding(),
                                {
                                  $const: -(new Date()).getTimezoneOffset()*60 * 1000 // to current locale
                                }
                              ]
                            },
                            {
                              $const: this._schemeOpts.dataGrouping.units * this._schemeOpts.dataGrouping.groupConst
                            }
                          ]
                        }
                      }
                    ],
                    $select: {}
                };

                for(var i = 0; i < this._schemeOpts.series.length; i++){
                    var binding = this._schemeOpts.series[i].dataSelector.binding(),
                        seriesGroupsSelector = this._schemeOpts.series[i].seriesGroupsSelector.hasBinding() ? this._schemeOpts.series[i].seriesGroupsSelector.binding() : undefined,
                        dataApproximation = {};

                    dataApproximation[this._schemeOpts.dataGrouping.dataApproximation] = binding;

                    wrapQuery.$select[binding] = dataApproximation;
                }

                var dateBinding = this._schemeOpts.dateContext.binding();

                wrapQuery.$select[dateBinding] = {};
                wrapQuery.$select[dateBinding][this._schemeOpts.dataGrouping.dateApproximation] = dateBinding;

                if(seriesGroupsSelector){
                    wrapQuery.$groupBy.push(seriesGroupsSelector);
                    wrapQuery.$select[seriesGroupsSelector] = seriesGroupsSelector;
                }
            }

            this.getElement().loader();

            function fetch(isReset){
                $this.fetch($this._dataSource, { batchSize: 1000, reset: isReset, wrapQuery: wrapQuery }, function(res, fail){
                    try {
                    	if(fail){
                            $this.ready();
                            $this.getElement().loader('hide');
                            return;
                        }

                        if(res.length === 0){
                            resultProcessing();
                            return;
                        }

                        while($this._dataSource.next()){
                            // series data
                            for(var i = 0; i < $this._schemeOpts.series.length; i++){
                                if(!seriesData[i]){
                                    seriesData[i] = {};
                                }

                                var x = $this._schemeOpts.dateContext.value(),
                                    seriesGroup = $this._schemeOpts.series[i].isSeriesGroups ? $this._schemeOpts.series[i].seriesGroupsSelector.value() : '$nonSeriesGroupSeries$';

                                if(!$this._schemeOpts.seriesTypes[i]){
                                    var type = 'number';

                                    if(JSB.isDate(x)){
                                        type = 'date';
                                    }

                                    $this._schemeOpts.seriesTypes[i] = type;
                                }

                                if($this._schemeOpts.seriesTypes[i] === 'date' && x !== undefined && x !== null){
                                    x = x.getTime();
                                }

                                if(!seriesData[i][seriesGroup]){
                                    seriesData[i][seriesGroup] = [];
                                }

                                seriesData[i][seriesGroup].push({
                                    x: x,
                                    y: $this._schemeOpts.series[i].dataSelector.value(),
                                    datacube: {
                                        filterData: $this._addFilterData()
                                    }
                                });
                            }
                        }

                        if(seriesData.length <= 3000){
                            fetch();
                        } else {
                            resultProcessing();
                        }
                    } catch(ex){
                        console.log('RangeSelectorChart load data exception');
                        console.log(ex);
                        $this.getElement().loader('hide');
                    } finally {
                    	
                    }
                });
            }

            function resultProcessing(){
                try{
                    var data = [];

                    for(var i = 0; i < seriesData.length; i++){
                        for(var j in seriesData[i]){
                            var item = {
                                seriesIndex: i,
                                seriesName: j,
                                data: seriesData[i][j]
                            };

                            item.data.sort(function(a, b){
                                return a.x < b.x ? -1 : 1;
                            });

                            data.push(item);
                        }
                    }

                    $this.buildChart({
                        data: data
                    });

                    $this.getElement().loader('hide');
                } catch(ex){
                    console.log('RangeSelectorChart processing data exception');
                    console.log(ex);
                    $this.getElement().loader('hide');
                }
            }

            fetch(true);
	    },

	    _buildChart: function(data){
	        var baseChartOpts;

	        try{
                function includeData(chartOpts, data){
                    chartOpts = JSB.clone(chartOpts);

                    var seriesContext = $this.getContext().find('series').values(),
                        chartOptsSeries = JSB.clone(chartOpts.series);

                    for(var j = 0; j < data.length; j++){
                        var seriesIndex = data[j].seriesIndex,
                            yAxis = chartOpts.yAxisNames.indexOf(seriesContext[seriesIndex].find("yAxis").value());

                        var series = {
                            data: data[j].data,
                            datacube: {
                                binding: $this._schemeOpts.dateContext.binding(),
                                valueType: $this._schemeOpts.seriesTypes[seriesIndex]
                            },
                            name: data[j].seriesName === '$nonSeriesGroupSeries$' ? undefined : data[j].seriesName,
                            type: seriesContext[seriesIndex].find('type').value(),
                            color: seriesContext[seriesIndex].find('color').value(),
                            stack: seriesContext[seriesIndex].find('stack').value(),
                            step: $this.isNone(seriesContext[seriesIndex].find('step').value()),
                            yAxis: yAxis > -1 ? yAxis : undefined
                        };

                        chartOpts.series[j] = JSB.clone(chartOptsSeries[seriesIndex]);

                        JSB.merge(true, chartOpts.series[j], series);
                    }

                    return chartOpts;
                }

                if(this._styles){
                    baseChartOpts = includeData(this._styles, data.data);
                } else {
                    baseChartOpts = $base();

                    this._styles = baseChartOpts;

                    baseChartOpts = includeData(baseChartOpts, data.data, data.xAxisData);
                }
	        } catch(ex){
                console.log('RangeSelectorChart build chart exception');
                console.log(ex);
	        } finally{
console.log(baseChartOpts);
debugger;
	            return baseChartOpts;
	        }
	    }
	}
}