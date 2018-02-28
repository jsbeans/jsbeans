{
	$name: 'DataCube.Widgets.ColumnRangeSelector',
	$parent: 'DataCube.Widgets.Widget',
	/*
	$expose: {
		name: 'Временной диапазон',
		description: '',
		category: 'Диаграммы',
		icon: `data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiIHN0YW5kYWxvbmU9Im5vIj8+DQo8c3ZnDQogICB4bWxuczpkYz0iaHR0cDovL3B1cmwub3JnL2RjL2VsZW1lbnRzLzEuMS8iDQogICB4bWxuczpjYz0iaHR0cDovL2NyZWF0aXZlY29tbW9ucy5vcmcvbnMjIg0KICAgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIg0KICAgeG1sbnM6c3ZnPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyINCiAgIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyINCiAgIHhtbG5zOnNvZGlwb2RpPSJodHRwOi8vc29kaXBvZGkuc291cmNlZm9yZ2UubmV0L0RURC9zb2RpcG9kaS0wLmR0ZCINCiAgIHhtbG5zOmlua3NjYXBlPSJodHRwOi8vd3d3Lmlua3NjYXBlLm9yZy9uYW1lc3BhY2VzL2lua3NjYXBlIg0KICAgaWQ9IkxheWVyXzEiDQogICB2ZXJzaW9uPSIxLjEiDQogICB2aWV3Qm94PSIwIDAgMjAgMjAiDQogICB4bWw6c3BhY2U9InByZXNlcnZlIg0KICAgaW5rc2NhcGU6dmVyc2lvbj0iMC45MSByMTM3MjUiDQogICBzb2RpcG9kaTpkb2NuYW1lPSJpZl8zM18yMTI4NDQ1LnN2ZyINCiAgIHdpZHRoPSIyMCINCiAgIGhlaWdodD0iMjAiPjxtZXRhZGF0YQ0KICAgICBpZD0ibWV0YWRhdGEzMSI+PHJkZjpSREY+PGNjOldvcmsNCiAgICAgICAgIHJkZjphYm91dD0iIj48ZGM6Zm9ybWF0PmltYWdlL3N2Zyt4bWw8L2RjOmZvcm1hdD48ZGM6dHlwZQ0KICAgICAgICAgICByZGY6cmVzb3VyY2U9Imh0dHA6Ly9wdXJsLm9yZy9kYy9kY21pdHlwZS9TdGlsbEltYWdlIiAvPjxkYzp0aXRsZT48L2RjOnRpdGxlPjwvY2M6V29yaz48L3JkZjpSREY+PC9tZXRhZGF0YT48ZGVmcw0KICAgICBpZD0iZGVmczI5IiAvPjxzb2RpcG9kaTpuYW1lZHZpZXcNCiAgICAgcGFnZWNvbG9yPSIjZmZmZmZmIg0KICAgICBib3JkZXJjb2xvcj0iIzY2NjY2NiINCiAgICAgYm9yZGVyb3BhY2l0eT0iMSINCiAgICAgb2JqZWN0dG9sZXJhbmNlPSIxMCINCiAgICAgZ3JpZHRvbGVyYW5jZT0iMTAiDQogICAgIGd1aWRldG9sZXJhbmNlPSIxMCINCiAgICAgaW5rc2NhcGU6cGFnZW9wYWNpdHk9IjAiDQogICAgIGlua3NjYXBlOnBhZ2VzaGFkb3c9IjIiDQogICAgIGlua3NjYXBlOndpbmRvdy13aWR0aD0iMTkyMCINCiAgICAgaW5rc2NhcGU6d2luZG93LWhlaWdodD0iMTE3OCINCiAgICAgaWQ9Im5hbWVkdmlldzI3Ig0KICAgICBzaG93Z3JpZD0iZmFsc2UiDQogICAgIGlua3NjYXBlOnpvb209IjI5LjUiDQogICAgIGlua3NjYXBlOmN4PSIxMS4yOTI2NjgiDQogICAgIGlua3NjYXBlOmN5PSI4LjAyMjEwNzIiDQogICAgIGlua3NjYXBlOndpbmRvdy14PSIxOTEyIg0KICAgICBpbmtzY2FwZTp3aW5kb3cteT0iLTgiDQogICAgIGlua3NjYXBlOndpbmRvdy1tYXhpbWl6ZWQ9IjEiDQogICAgIGlua3NjYXBlOmN1cnJlbnQtbGF5ZXI9IkxheWVyXzEiDQogICAgIHNob3dndWlkZXM9InRydWUiDQogICAgIGlua3NjYXBlOmd1aWRlLWJib3g9InRydWUiPjxzb2RpcG9kaTpndWlkZQ0KICAgICAgIHBvc2l0aW9uPSIxMiwxOC45NDkxNTMiDQogICAgICAgb3JpZW50YXRpb249IjAsMSINCiAgICAgICBpZD0iZ3VpZGU0MTg4IiAvPjxzb2RpcG9kaTpndWlkZQ0KICAgICAgIHBvc2l0aW9uPSIxNi40NzQ1NzYsMTQuOTgzMDUxIg0KICAgICAgIG9yaWVudGF0aW9uPSIwLDEiDQogICAgICAgaWQ9Imd1aWRlNDE5MCIgLz48c29kaXBvZGk6Z3VpZGUNCiAgICAgICBwb3NpdGlvbj0iMTUuNzI4ODE0LDE0Ig0KICAgICAgIG9yaWVudGF0aW9uPSIwLDEiDQogICAgICAgaWQ9Imd1aWRlNDE5MiIgLz48c29kaXBvZGk6Z3VpZGUNCiAgICAgICBwb3NpdGlvbj0iMTQuNzQ1NzYzLDEwIg0KICAgICAgIG9yaWVudGF0aW9uPSIwLDEiDQogICAgICAgaWQ9Imd1aWRlNDE5NCIgLz48c29kaXBvZGk6Z3VpZGUNCiAgICAgICBwb3NpdGlvbj0iMTUuNzI4ODE0LDguOTgzMDUwOSINCiAgICAgICBvcmllbnRhdGlvbj0iMCwxIg0KICAgICAgIGlkPSJndWlkZTQyMDYiIC8+PHNvZGlwb2RpOmd1aWRlDQogICAgICAgcG9zaXRpb249IjE2LjE2OTQ5Miw0Ljk4MzA1MDkiDQogICAgICAgb3JpZW50YXRpb249IjAsMSINCiAgICAgICBpZD0iZ3VpZGU0MjA4IiAvPjxzb2RpcG9kaTpndWlkZQ0KICAgICAgIHBvc2l0aW9uPSIxNy40NTc2MjcsNCINCiAgICAgICBvcmllbnRhdGlvbj0iMCwxIg0KICAgICAgIGlkPSJndWlkZTQyMTAiIC8+PC9zb2RpcG9kaTpuYW1lZHZpZXc+PHBhdGgNCiAgICAgZD0ibSAzLjE3MzE3NCwxLjA2MDU4MzYgLTMuMTgyOTY3MDcsMCAwLDMuOTUwMTQzNyAzLjE4Mjk2NzA3LDAgTCA0LjkxNTY0NDQsMy4wMzU2NTU0IDMuMTczMTc0LDEuMDYwNTgzNiBaIG0gLTAuOTM0NDg2NSwyLjU3OTAxOTQgLTAuMjM2NjgyMiwwIDAsLTAuOTc5Mzc0NSAtMC4yNDQ4NDM2LDAgMCwtMC4xODM2MzI3IDAuNDgxNTI1OCwtMC4wNDA4MDcgMCwxLjIwMzgxNDQgeiINCiAgICAgaWQ9InBhdGg3Ig0KICAgICBpbmtzY2FwZTpjb25uZWN0b3ItY3VydmF0dXJlPSIwIg0KICAgICBzdHlsZT0iZmlsbDojNTAyZDE2IiAvPjxwYXRoDQogICAgIGQ9Im0gOC4zMDY3Mjg2LDYuMDEwMTgyMSAtMy4xODI5NjcxLDAgMCwzLjk1MDE0MzggMy4xODI5NjcxLDAgTCAxMC4wNDkxOTksNy45ODUyNTQgOC4zMDY3Mjg2LDYuMDEwMTgyMSBaIG0gLTAuNTkxNzA1NSwyLjYwMzUwMzkgLTAuNzk1NzQxNywwIDAsLTAuMTU1MDY3NyAwLjM2NzI2NTQsLTAuNDE2MjM0MSBjIDAuMDUzMDUsLTAuMDY1MjkyIDAuMDkzODU3LC0wLjExODM0MTEgMC4xMTgzNDExLC0wLjE2MzIyOTEgMC4wMjQ0ODQsLTAuMDQ0ODg4IDAuMDMyNjQ2LC0wLjA4NTY5NSAwLjAzMjY0NiwtMC4xMjI0MjE4IDAsLTAuMDQ4OTY5IC0wLjAxMjI0MiwtMC4wODk3NzYgLTAuMDM2NzI3LC0wLjExODM0MTEgLTAuMDI0NDg0LC0wLjAyODU2NSAtMC4wNjEyMTEsLTAuMDQ0ODg4IC0wLjExMDE3OTcsLTAuMDQ0ODg4IC0wLjA1MzA0OSwwIC0wLjA4OTc3NiwwLjAyMDQwNCAtMC4xMTgzNDEsMC4wNTcxMyAtMC4wMjg1NjUsMC4wMzY3MjYgLTAuMDQwODA3LDAuMDg1Njk1IC0wLjA0MDgwNywwLjE0MjgyNTQgbCAtMC4yMzI2MDE1LDAgMCwtMC4wMDQwOCBDIDYuODk0Nzk3Nyw3LjY4MzI4MDcgNi45MzE1MjM3LDcuNTkzNTA0NyA3LjAwNDk3NjYsNy41MjAwNTE2IDcuMDc4NDI5Niw3LjQ0NjU5ODYgNy4xNzIyODY1LDcuNDA5ODcyIDcuMjk0NzA4Myw3LjQwOTg3MiBjIDAuMTIyNDIxOCwwIDAuMjE2Mjc4NSwwLjAzMjY0NiAwLjI4NTY1MDksMC4wOTM4NTcgMC4wNjkzNzIsMC4wNjEyMTEgMC4xMDIwMTgxLDAuMTQ2OTA2MiAwLjEwMjAxODEsMC4yNDg5MjQ0IDAsMC4wNjkzNzIgLTAuMDIwNDA0LDAuMTM0NjY0IC0wLjA1NzEzLDAuMTk1ODc0OSAtMC4wMzY3MjcsMC4wNTcxMyAtMC4xMDIwMTgxLDAuMTM4NzQ0NyAtMC4xOTU4NzQ4LDAuMjQ0ODQzNiBsIC0wLjE5NTg3NDksMC4yMzY2ODIxIDAsMC4wMDQwOCAwLjQ4NTYwNjUsMCAwLDAuMTc5NTUyIHoiDQogICAgIGlkPSJwYXRoOSINCiAgICAgaW5rc2NhcGU6Y29ubmVjdG9yLWN1cnZhdHVyZT0iMCINCiAgICAgc3R5bGU9ImZpbGw6IzE2NTA0NCIgLz48cGF0aA0KICAgICBkPSJtIDMuMTczMTc0LDExLjAyNzU3NSAtMy4xODI5NjcwNywwIDAsMy45NTAxNDQgMy4xODI5NjcwNywwIDEuNzQyNDcwNCwtMS45NzUwNzIgLTEuNzQyNDcwNCwtMS45NzUwNzIgeiBtIC0xLjI0ODcwMjUsMi41ODcxODEgYyAtMC4wNzc1MzQsMC4wNjEyMSAtMC4xNzU0NzEyLDAuMDkzODYgLTAuMjk3ODkzLDAuMDkzODYgLTAuMTA2MDk4OSwwIC0wLjE5OTk1NTcsLTAuMDI4NTcgLTAuMjgxNTcwMiwtMC4wODU3IC0wLjA4MTYxNCwtMC4wNTcxMyAtMC4xMTgzNDExLC0wLjEzODc0NCAtMC4xMTQyNjA0LC0wLjI0NDg0MyBsIDAsLTAuMDA0MSAwLjIyODUyMDgsMCBjIDAsMC4wNDQ4OSAwLjAxNjMyMywwLjA4MTYxIDAuMDQ0ODg4LDAuMTEwMTggMC4wMzI2NDYsMC4wMjg1NyAwLjA2OTM3MiwwLjA0NDg5IDAuMTE4MzQxMSwwLjA0NDg5IDAuMDUzMDQ5LDAgMC4wOTc5MzgsLTAuMDE2MzIgMC4xMzA1ODMzLC0wLjA0ODk3IDAuMDMyNjQ2LC0wLjAzMjY1IDAuMDQ4OTY5LC0wLjA3MzQ1IDAuMDQ4OTY5LC0wLjExODM0MSAwLC0wLjA2MTIxIC0wLjAxNjMyMywtMC4xMDYwOTkgLTAuMDQ0ODg4LC0wLjEzODc0NSAtMC4wMzI2NDYsLTAuMDI4NTcgLTAuMDc3NTM0LC0wLjA0NDg5IC0wLjEzNDY2NCwtMC4wNDQ4OSBsIC0wLjEzMDU4MzIsMCAwLC0wLjE3NTQ3MSAwLjEzMDU4MzIsMCBjIDAuMDU3MTMsMCAwLjA5NzkzOCwtMC4wMTYzMiAwLjEyMjQyMTgsLTAuMDQ0ODkgMC4wMjg1NjUsLTAuMDI4NTYgMC4wNDA4MDcsLTAuMDY5MzcgMC4wNDA4MDcsLTAuMTIyNDIyIDAsLTAuMDQ0ODkgLTAuMDEyMjQyLC0wLjA4MTYxIC0wLjA0MDgwNywtMC4xMTAxOCAtMC4wMjg1NjUsLTAuMDI4NTcgLTAuMDY5MzcyLC0wLjA0NDg5IC0wLjExODM0MSwtMC4wNDQ4OSAtMC4wNDQ4ODgsMCAtMC4wNzc1MzQsMC4wMTIyNCAtMC4xMDYwOTg5LDAuMDQwODEgLTAuMDI4NTY1LDAuMDI0NDggLTAuMDQ0ODg4LDAuMDYxMjEgLTAuMDQ0ODg4LDAuMTAyMDE4IGwgLTAuMjI4NTIwOCwwIDAsLTAuMDA0MSBjIC0wLjAwNDA4LC0wLjA4OTc4IDAuMDMyNjQ2LC0wLjE2NzMxIDAuMTA2MDk4OSwtMC4yMjg1MjEgMC4wNzM0NTMsLTAuMDYxMjEgMC4xNjMyMjkxLC0wLjA4OTc4IDAuMjczNDA4OCwtMC4wODk3OCAwLjEyMjQyMTgsMCAwLjIxNjI3ODUsMC4wMjg1NyAwLjI4OTczMTYsMC4wODU3IDAuMDY5MzcyLDAuMDU3MTMgMC4xMDYwOTg5LDAuMTM4NzQ0IDAuMTA2MDk4OSwwLjI0NDg0MyAwLDAuMDUzMDUgLTAuMDE2MzIzLDAuMTAyMDE4IC0wLjA0NDg4OCwwLjE0NjkwNiAtMC4wMzI2NDYsMC4wNDQ4OSAtMC4wNzM0NTMsMC4wODE2MiAtMC4xMjY1MDI2LDAuMTA2MDk5IDAuMDYxMjExLDAuMDI0NDkgMC4xMTAxNzk3LDAuMDU3MTMgMC4xNDI4MjU1LDAuMTA2MDk5IDAuMDMyNjQ2LDAuMDQ0ODkgMC4wNDg5NjksMC4xMDIwMTggMC4wNDg5NjksMC4xNzEzOTEgLTAuMDA0MDgsMC4xMDYwOTkgLTAuMDQwODA3LDAuMTkxNzk0IC0wLjExODM0MTEsMC4yNTMwMDUgeiINCiAgICAgaWQ9InBhdGgxMSINCiAgICAgaW5rc2NhcGU6Y29ubmVjdG9yLWN1cnZhdHVyZT0iMCINCiAgICAgc3R5bGU9ImZpbGw6IzE2NDQ1MCIgLz48Zw0KICAgICBpZD0iZzEzIg0KICAgICBzdHlsZT0iZmlsbDojNDg0NTM3Ig0KICAgICB0cmFuc2Zvcm09Im1hdHJpeCgwLjA0MDgwNzI3LDAsMCwwLjA0MDgwNzI3LC0wLjQ1ODY3MzA0LDAuMjY3NjI5NTQpIj48cG9seWdvbg0KICAgICAgIHBvaW50cz0iMTkwLjUsNDI5LjcgMTg5LjksNDMxLjEgMTgzLjcsNDQwLjUgMTkwLjYsNDQwLjUgMTkwLjYsNDI5LjggIg0KICAgICAgIGlkPSJwb2x5Z29uMTUiDQogICAgICAgc3R5bGU9ImZpbGw6IzQ4NDUzNyIgLz48cGF0aA0KICAgICAgIGQ9Im0gMjE0LjgsMzg1LjcgLTc4LDAgMCw5Ni44IDc4LDAgNDIuNywtNDguNCAtNDIuNywtNDguNCB6IG0gLTE0LjksNTkuNCAtMy4zLDAgMCw2LjQgLTUuOSwwIDAsLTYuNCAtMTIsMCAtMC4zLC0zLjUgMTIuMiwtMTkuNiA2LDAgMCwxOC41IDMuMywwIDAsNC42IHoiDQogICAgICAgaWQ9InBhdGgxNyINCiAgICAgICBpbmtzY2FwZTpjb25uZWN0b3ItY3VydmF0dXJlPSIwIg0KICAgICAgIHN0eWxlPSJmaWxsOiM0ODQ1MzciIC8+PC9nPjxwb2x5Z29uDQogICAgIGlkPSJwb2x5Z29uMTkiDQogICAgIHBvaW50cz0iMzc1LjIsMTI2LjMgMzc1LjIsMjkuNCAxMDIuNCwyOS40IDE0NS4xLDc3LjggMTAyLjQsMTI2LjMgIg0KICAgICBzdHlsZT0iZmlsbDojYTA1YTJjIg0KICAgICB0cmFuc2Zvcm09Im1hdHJpeCgwLjA0MDgwNzI3LDAsMCwwLjA0MDgwNzI3LC0wLjQ1ODY3MzA0LC0wLjEzOTE1MDE4KSIgLz48cG9seWdvbg0KICAgICBpZD0icG9seWdvbjIxIg0KICAgICBwb2ludHM9IjUwMSwyNDUgNTAxLDE0OC4yIDIyOC4xLDE0OC4yIDI3MC45LDE5Ni42IDIyOC4xLDI0NSAiDQogICAgIHN0eWxlPSJmaWxsOiMyMTc4NjciDQogICAgIHRyYW5zZm9ybT0ibWF0cml4KDAuMDQwODA3MjcsMCwwLDAuMDQwODA3MjcsLTAuNDU4NjczMDQsLTAuMDM3NDU1MjUpIiAvPjxwb2x5Z29uDQogICAgIGlkPSJwb2x5Z29uMjMiDQogICAgIHBvaW50cz0iMTQ1LjEsMzE1LjQgMTAyLjQsMzYzLjggMzc1LjIsMzYzLjggMzc1LjIsMjY3IDEwMi40LDI2NyAiDQogICAgIHN0eWxlPSJmaWxsOiMyMTY3NzgiDQogICAgIHRyYW5zZm9ybT0ibWF0cml4KDAuMDQwODA3MjcsMCwwLDAuMDQwODA3MjcsLTAuNDU4NjczMDQsMC4xMzIwMzYzKSIgLz48cG9seWdvbg0KICAgICBpZD0icG9seWdvbjI1Ig0KICAgICBwb2ludHM9IjIyOC4xLDQ4Mi42IDUwMSw0ODIuNiA1MDEsMzg1LjcgMjI4LjEsMzg1LjcgMjcwLjksNDM0LjIgIg0KICAgICBzdHlsZT0iZmlsbDojNmM2NzUzIg0KICAgICB0cmFuc2Zvcm09Im1hdHJpeCgwLjA0MDgwNzI3LDAsMCwwLjA0MDgwNzI3LC0wLjQ1ODY3MzA0LDAuMjY3NjI5NTQpIiAvPjwvc3ZnPg==`,
		thumb: 'data:image/png;base64,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'
	},
	*/
	$scheme: {},
	/*
    $scheme: {
        type: 'group',
        items: [
        {
            name: 'Заголовок',
            type: 'item',
            key: 'title',
            itemValue: ''
        },
        {
            name: 'Подзаголовок',
            type: 'item',
            key: 'subtitle',
            itemValue: ''
        },
        {
            type: 'group',
            name: 'Источник',
            key: 'source',
            binding: 'array',
            items: [
            {
                name: 'Дата',
                type: 'item',
                key: 'date',
                binding: 'field',
                itemValue: '$field',
                description: 'Массив дат в формате Date или String'
            },
            {
                name: 'Количество',
                type: 'item',
                key: 'count',
                binding: 'field',
                itemValue: '$field',
                description: 'Количество значений для каждой даты'
            },
            {
                type: 'item',
                name: 'Автоподсчёт',
                key: 'autoCount',
                optional: true,
                editor: 'none',
                description: 'Автоматический подсчёт количества значений для каждой даты (считается количество одинаковых дат)'
            }
            ]
        },
        {
            type: 'group',
            name: 'Серии',
            key: 'series',
            items: [
            {
                name: 'Имя серии',
                type: 'item',
                key: 'seriesName',
                itemValue: '',
                description: 'Имя серии. Выводится во всплывающей подсказке'
            }
            ]
        },
        {
            type: 'group',
            name: 'Всплывающая подсказка',
            key: 'tooltip',
            description: 'Тултип, всплывающий при наведении на значение',
            items: [
                {
                    name: 'Формат даты',
                    type: 'item',
                    key: 'dateFormat',
                    description: 'Формат даты во всплывающей подсказке (%d - день, %m - месяц, %y - год)'
                }
            ]
        },
        {
            type: 'group',
            name: 'Группировка данных',
            key: 'dataGrouping',
            multiple: 'true',
            optional: true,
            items: [
                {
                    name: 'Единица измерения',
                    type: 'select',
                    key: 'timeUnit',
                    description: 'Группируемая диница измерения',
                    items: [
                    {
                        name: 'Миллисекунда',
                        type: 'item',
                        key: 'millisecond',
                        editor: 'none',
                        itemValue: 'millisecond'
                    },
                    {
                        name: 'Секунда',
                        type: 'item',
                        key: 'second',
                        editor: 'none',
                        itemValue: 'second'
                    },
                    {
                        name: 'Минута',
                        type: 'item',
                        key: 'minute',
                        editor: 'none',
                        itemValue: 'minute'
                    },
                    {
                        name: 'Час',
                        type: 'item',
                        key: 'hour',
                        editor: 'none',
                        itemValue: 'hour'
                    },
                    {
                        name: 'День',
                        type: 'item',
                        key: 'day',
                        editor: 'none',
                        itemValue: 'day'
                    },
                    {
                        name: 'Неделя',
                        type: 'item',
                        key: 'week',
                        editor: 'none',
                        itemValue: 'week'
                    },
                    {
                        name: 'Месяц',
                        type: 'item',
                        key: 'month',
                        editor: 'none',
                        itemValue: 'month'
                    },
                    {
                        name: 'Год',
                        type: 'item',
                        key: 'year',
                        editor: 'none',
                        itemValue: 'year'
                    }
                    ]
                },
                {
                    name: 'Группировка',
                    type: 'item',
                    key: 'grouping',
                    itemValue: '',
                    description: 'Массив допустимых группировок, через запятую (1, 2, 4)'
                }
            ]
        },
        {
            type: 'group',
            name: 'Фиксированное количество столбцов',
            key: 'fixedColumns',
            optional: true,
            items: [
            {
                name: 'Начальная дата',
                type: 'item',
                key: 'startDate'
            },
            {
                name: 'Конечная дата',
                type: 'item',
                key: 'endDate'
            },
            {
                name: 'Число столбцов',
                type: 'item',
                key: 'columnCount'
            }
            ]
        },
        {
            type: 'group',
            name: 'Ось Х',
            key: 'xAxis',
            optional: true,
            items: [
            {
                type: 'group',
                name: 'Формат дат',
                key: 'dateFormat',
                multiple: 'true',
                items: [
                {
                    name: 'Единица измерения',
                    type: 'select',
                    key: 'timeUnit',
                    items: [
                    {
                        name: 'Миллисекунда',
                        type: 'item',
                        key: 'millisecond',
                        editor: 'none',
                        itemValue: 'millisecond'
                    },
                    {
                        name: 'Секунда',
                        type: 'item',
                        key: 'second',
                        editor: 'none',
                        itemValue: 'second'
                    },
                    {
                        name: 'Минута',
                        type: 'item',
                        key: 'minute',
                        editor: 'none',
                        itemValue: 'minute'
                    },
                    {
                        name: 'Час',
                        type: 'item',
                        key: 'hour',
                        editor: 'none',
                        itemValue: 'hour'
                    },
                    {
                        name: 'День',
                        type: 'item',
                        key: 'day',
                        editor: 'none',
                        itemValue: 'day'
                    },
                    {
                        name: 'Неделя',
                        type: 'item',
                        key: 'week',
                        editor: 'none',
                        itemValue: 'week'
                    },
                    {
                        name: 'Месяц',
                        type: 'item',
                        key: 'month',
                        editor: 'none',
                        itemValue: 'month'
                    },
                    {
                        name: 'Год',
                        type: 'item',
                        key: 'year',
                        editor: 'none',
                        itemValue: 'year'
                    }
                    ]
                },
                {
                    name: 'Формат',
                    type: 'item',
                    key: 'format',
                    itemValue: '',
                    description: 'Формат даты'
                }
                ]
            }
            ]
        }
        ]
    },
    */
	$client: {
		$require: ['JQuery.UI.Loader', 'JSB.Tpl.Highcharts'],
		_currentFilters: {
		    min: null,
		    minId: null,
		    max: null,
		    maxId: null,
		    curFilterHash: null
		},
		_filterChanged: false,
		_widgetExtremes: {},
	    
		$constructor: function(opts){
			$base(opts);
			this.getElement().addClass('highchartsWidget');
			$this.init();
		},

		init: function(){
		    this.containerId = JSB().generateUid();
            this.container = this.$('<div class="container" id="' + this.containerId + '"></div>');
            this.append(this.container);

            this.getElement().resize(function(){
                JSB.defer(function(){
                    if(!$this.getElement().is(':visible') || !$this.chart){
                        return;
                    }
                    $this.chart.setSize($this.getElement().width(), $this.getElement().height(), false);
                }, 500, 'hcResize' + $this.getId());
            });

            this.setInitialized();
            $this.isInit = true;
		},

        refresh: function(opts){
return;
            if(opts && this == opts.initiator) {
                return;
            }
            
			$base();

			if(opts && opts.refreshFromCache){
            	JSB().deferUntil(function(){
            		var cache = $this.getCache();
            		if(!cache) return;
            		$this._buildChart(cache);
            	}, function(){
            		return $this.isInit;
            	});
            	return;
            }

            var source = this.getContext().find('source');
            if(!source.hasBinding()) return;

            var fixedColumns = this.getContext().find('fixedColumns');
// filters section
            var globalFilters = source.getFilters(),
                binding = source.value().get(0).binding()[0],
                hasMin = false,
                hasMax = false,
                isReturn = false;

            if(globalFilters){
                var _bNeedExtremesUpdate = false;

                for(var i in globalFilters){
                    var cur = globalFilters[i];

                    if(cur.field === binding){
                        switch(cur.op){
                        case '$eq':     // equal

                            break;
                        case '$gte':    // min filter
                            if(this._currentFilters.min && this._currentFilters.min <= cur.value || !this._currentFilters.min){
                                this._currentFilters.min = cur.value.getTime();
                                this._currentFilters.minId = cur.id;
                                _bNeedExtremesUpdate = true;
                            }
                            hasMin = true;
                            break;
                        case '$lte':    // max filter
                            if(this._currentFilters.max && this._currentFilters.max >= cur.value || !this._currentFilters.max){
                                this._currentFilters.max = cur.value.getTime();
                                this._currentFilters.maxId = cur.id;
                                _bNeedExtremesUpdate = true;
                            }
                            hasMax = true;
                            break;
                        }
                        delete globalFilters[i];
                    }
                }

                if(Object.keys(globalFilters).length === 0) globalFilters = null;

                if(globalFilters && this.createFilterHash(globalFilters) === this._currentFilters.curFilterHash || !globalFilters && !this._currentFilters.curFilterHash){ // update data not require
                    if(_bNeedExtremesUpdate){
                        this._filterChanged = true;

                        var min = this._currentFilters.min ? this._currentFilters.min : this._widgetExtremes.min,
                            max = this._currentFilters.max ? this._currentFilters.max : this._widgetExtremes.max;

                        $this.chart.xAxis[0].setExtremes(min, max);

                        if(fixedColumns.used()){
                            this._loadFixedColumnData(min, max);
                        }
                    }
                    isReturn = true;
                } else {
                    this._currentFilters.curFilterHash = globalFilters ? this.createFilterHash(globalFilters) : undefined;
                }
            }

            if(!hasMin && this._currentFilters.minId){
                this._filterChanged = true;

                this._currentFilters.min = null;
                this._currentFilters.minId = null;

                this.chart.xAxis[0].setExtremes($this._widgetExtremes.min, $this._currentFilters.max ? $this._currentFilters.max : $this._widgetExtremes.max);

                if(fixedColumns.used()){
                    this._loadFixedColumnData($this._widgetExtremes.min, $this._currentFilters.max ? $this._currentFilters.max : $this._widgetExtremes.max);
                }
                isReturn = true;
            }

            if(!hasMax && this._currentFilters.maxId){
                this._filterChanged = true;

                this._currentFilters.max = null;
                this._currentFilters.maxId = null;

                this.chart.xAxis[0].setExtremes($this._currentFilters.min ? $this._currentFilters.min : $this._widgetExtremes.min, $this._widgetExtremes.max);

                if(fixedColumns.used()){
                    this._loadFixedColumnData($this._currentFilters.min ? $this._currentFilters.min : $this._widgetExtremes.min, $this._widgetExtremes.max);
                }
                isReturn = true;
            }
            if(isReturn) return;
// end filters section
            var seriesContext = this.getContext().find('series').value(),
                autoCount = source.value().get(2).used(),
                tooltip = this.getContext().find('tooltip').value(),
                value = source.value().get(0),
                count = source.value().get(1);

            if(fixedColumns.used()){
                var minFix = fixedColumns.value().get(0).value(),
                    maxFix = fixedColumns.value().get(1).value(),
                    columnCount = fixedColumns.value().get(2).value();

                var colWidth = (new Date(maxFix).getTime() - new Date(minFix).getTime()) / 1000 / columnCount;

                var fixedColumnsSelect = {
                    dateIntervalOrder: {
                        $dateIntervalOrder: {
                            $field: value.binding()[0],
                            $seconds: colWidth
                        }
                    },
                    dateCount: {
                        $count: 1
                    }
                };
                var fixedColumnsGroupBy = [
                    {
                        $dateIntervalOrder: {
                            $field: value.binding()[0],
                            $seconds: colWidth
                        }
                    }
                ];
            } else {
                var fixedColumnsSelect = undefined,
                    fixedColumnsGroupBy = undefined;
            }

            $this.getElement().loader();
            JSB().deferUntil(function(){
                source.fetch({readAll: true, reset: true, select: fixedColumnsSelect, groupBy: fixedColumnsGroupBy}, function(queryResult){
                    try{
                        if(fixedColumns.used()){
                            if(!queryResult){
                                if($this.chart && $this.chart.series[0]) $this.chart.series[0].remove();
                                return;
                            }

                            var data = [];

                            for(var i = 0; i < queryResult.length; i++){
                                data.push({
                                    x: queryResult[i].dateIntervalOrder * colWidth * 1000,
                                    y: queryResult[i].dateCount
                                });
                            }
                        } else {
                            var data = [];

                            while(source.next()){
                                var val = value.value();

                                if(JSB().isDate(val)){
                                    var dateValue = val.getTime();
                                    $this._dataFormat = 'datetime';
                                } else {
                                    if(typeof val === 'number'){
                                         var dateValue = val;
                                        $this._dataFormat = 'number';
                                    } else {
                                        return;
                                    }
                                }

                                if(autoCount){
                                    var e = null;
                                    for(var j = 0; j < data.length; j++){
                                        if(data[j].x === dateValue){
                                            e = data[j];
                                            break;
                                        }
                                    }

                                    if(e){
                                        e.y++;
                                    } else {
                                        data.push({ x: dateValue, y: 1 });
                                    }
                                } else {
                                    data.push({ x: dateValue, y: count.value() });
                                }
                            }
                        }

                        if(data.length === 0){
                            console.log('Временной диапазон: нет данных или неверный формат (поддерживается только объект Date)');
                            if($this.chart && $this.chart.series[0]) $this.chart.series[0].remove();
                            return;
                        }

                        data.sort(function(a, b){
                            if(a.x < b.x) return -1;
                            if(a.x > b.x) return 1;
                            return 0;
                        });

                        if(opts && opts.isCacheMod){
                        	$this.storeCache(data);
                        }

                        $this._buildChart(data, _bNeedExtremesUpdate);
                    } catch(e){
                        console.log(e);
                    } finally{
                        $this.getElement().loader('hide');
                    }
                });
            }, function(){
                return $this.isInit;
            });
        },

        _buildChart: function(data, _bNeedExtremesUpdate){
        	var seriesContext = this.getContext().find('series').value(),
        		fixedColumns = this.getContext().find('fixedColumns');
        	
            try{
                var tooltipXDateFormat = this.getContext().find('tooltip').value().get(0).value();
                tooltipXDateFormat = tooltipXDateFormat === null ? undefined : tooltipXDateFormat;

                var dataGrouping = this.getContext().find('dataGrouping');
                if(dataGrouping.used()){
                    var units = [];
                    var values = dataGrouping.values();
                    for(var i = 0; i < values.length; i++){
                        units.push([values[i].get(0).value().get(0).value(), [values[i].get(1).value()]]);
                    }
                }

                var xAxis = this.getContext().find('xAxis');
                if(xAxis.used()){
                    var gr = xAxis.values(),
                        dateTimeLabelFormats = {};

                    for(var i = 0; i < gr.length; i++){
                        dateTimeLabelFormats[gr[i].value().get(0).value().get(0).value()] = gr[i].value().get(1).value();
                    }
                }
                
                if(fixedColumns.used()){
                    var scrollbar = {
                        liveRedraw: false
                    }

                    var rangeSelector = {
                        enabled: false
                    }
                    
                    var navigator = {
                        adaptToUpdatedData: false,
                        series: {
                            data: data
                        }
                    }                    
                }

                var chartOpts = {
                    chart: {
                        renderTo: $this.containerId
                    },

                    xAxis: {
                        type: 'datetime',
                        min: data[0].x,
                        max: data[data.length - 1].x,
                        events: {
                            afterSetExtremes: function(event){ $this._addIntervalFilter(event);}
                        }
                    },

                    title: {
                        text: this.getContext().find('title').value()
                    },

                    subtitle: {
                        text: this.getContext().find('subtitle').value()
                    },

                    tooltip: {
                        xDateFormat: tooltipXDateFormat
                    }
                };

                chartOpts.series = [{
                    type: 'column',
                    name: seriesContext.get(0).value(),
                    data: data,
                    turboThreshold: 0,
                    dataGrouping: {
                        enabled: units !== undefined ? true : false,
                        units: units
                    }
                }];

                if(navigator){
                    chartOpts.navigator = navigator;
                }

                if(scrollbar){
                    chartOpts.scrollbar = scrollbar;
                }

                if(rangeSelector){
                    chartOpts.rangeSelector = rangeSelector;
                }

                if(dateTimeLabelFormats){
                    chartOpts.xAxis.dateTimeLabelFormats = dateTimeLabelFormats;
                }

                // create the chart
                $this.chart = new Highcharts.stockChart(chartOpts);

                var ex = $this.chart.navigator.xAxis.getExtremes();
                $this._widgetExtremes = {
                    min: ex.min,
                    max: ex.max
                };

                if(_bNeedExtremesUpdate){
                    $this.chart.xAxis[0].setExtremes($this._currentFilters.min ? $this._currentFilters.min : ex.dataMin, $this._currentFilters.max ? $this._currentFilters.max : ex.dataMax);
                }

                $this.chart.setSize($this.getElement().width(), $this.getElement().height(), false);
            } catch(ex){
                console.log(ex);
                if($this.chart && $this.chart.series[0]) $this.chart.series[0].remove();
            }
        },

        _addIntervalFilter: function(event){
            if(this._filterChanged){
                this._filterChanged = false;
                return;
            }

            JSB().defer(function(){
                if(event.min === $this._widgetExtremes.min && !$this._currentFilters.min && event.max === $this._widgetExtremes.max && !$this._currentFilters.max) return;

                var context = $this.getContext().find('source').binding();
                if(!context.source) return;

                var field = $this.getContext().find('source').value().get(0).binding(),
                    bNeedRefresh = false;

                // min filter
                if($this._currentFilters.min && $this._currentFilters.min !== event.min || !$this._currentFilters.min && event.min !== $this._widgetExtremes.min){  // change filter
                    if($this._currentFilters.min){
                        $this.removeFilter($this._currentFilters.minId);
                    }

                    var fDesc = {
                        sourceId: context.source,
                        type: '$and',
                        op: '$gte',
                        field: field,
                        value: $this._dataFormat === 'datetime' ? new Date(event.min) : event.min
                    };
                    $this._currentFilters.min = event.min;
                    $this._currentFilters.minId = $this.addFilter(fDesc);

                    bNeedRefresh = true;
                }
                if($this._currentFilters.min && event.min === event.dataMin){   // remove filter
                    $this.removeFilter($this._currentFilters.minId);
                    $this._currentFilters.min = null;
                    $this._currentFilters.minId = null;
                    bNeedRefresh = true;
                }

                // max filter
                if($this._currentFilters.max && $this._currentFilters.max !== event.max || !$this._currentFilters.max && event.max !== $this._widgetExtremes.max){  // change filter
                    if($this._currentFilters.max){
                        $this.removeFilter($this._currentFilters.maxId);
                    }

                    var fDesc = {
                        sourceId: context.source,
                        type: '$and',
                        op: '$lte',
                        field: field,
                        value: $this._dataFormat === 'datetime' ? new Date(event.max) : event.max
                    };
                    $this._currentFilters.max = event.max;
                    $this._currentFilters.maxId = $this.addFilter(fDesc);

                    bNeedRefresh = true;
                }
                if($this._currentFilters.max && event.max === event.dataMax){   // remove filter
                    $this.removeFilter($this._currentFilters.maxId);
                    $this._currentFilters.max = null;
                    $this._currentFilters.maxId = null;
                    bNeedRefresh = true;
                }

                if(bNeedRefresh){
                    $this.refreshAll();

                    var fixedColumns = $this.getContext().find('fixedColumns');
                    if(fixedColumns.used()){
                        $this._loadFixedColumnData(event.min, event.max);
                    }
                }
            }, 700, 'ColumnRangeSelector.xAxisFilterUpdate_' + this.containerId);
        },

        _loadFixedColumnData: function(min, max){
            var columnCount = this.getContext().find('fixedColumns').value().get(2).value(),
                field = this.getContext().find('source').value().get(0).binding()[0];
            var colWidth = Math.floor((max - min) / 1000 / columnCount);

            var fixedColumnsSelect = {
                dateIntervalOrder: {
                    $dateIntervalOrder: {
                        $field: field,
                        $seconds: colWidth
                    }
                },
                dateCount: {
                    $count: 1
                }
            };
            var fixedColumnsGroupBy = [
                {
                    $dateIntervalOrder: {
                        $field: field,
                        $seconds: colWidth
                    }
                }
            ];

            $this.chart.showLoading('Загрузка...');
            $this.getContext().find('source').fetch({readAll: true, reset: true, select: fixedColumnsSelect, groupBy: fixedColumnsGroupBy}, function(queryResult){
                if(!queryResult){
                    $this.chart.hideLoading();
                    return;
                }

                var data = [];

                for(var i = 0; i < queryResult.length; i++){
                    data.push({
                        x: queryResult[i].dateIntervalOrder * colWidth * 1000,
                        y: queryResult[i].dateCount
                    });
                }

                data.sort(function(a, b){
                    if(a.x < b.x) return -1;
                    if(a.x > b.x) return 1;
                    return 0;
                });

                $this.chart.series[0].setData(data);
                $this.chart.hideLoading();
            });
        }
	}
}