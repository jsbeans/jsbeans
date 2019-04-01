{
	$name: 'DataCube.ParserView',
	$parent: 'JSB.Workspace.BrowserView',
	
	$expose: {
		priority: 0.3,
		acceptNode: ['DataCube.JsonFileNode','DataCube.ExcelFileNode', 'DataCube.CsvFileNode', 'DataCube.XmlFileNode', 'DataCube.SliceNode'],
		acceptEntry: ['DataCube.Model.JsonFile','DataCube.Model.ExcelFile', 'DataCube.Model.CsvFile', 'DataCube.Model.XmlFile', 'DataCube.Model.Slice'],
		caption: 'Парсер',
		icon: 'data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiIHN0YW5kYWxvbmU9Im5vIj8+DQo8c3ZnDQogICB4bWxuczpkYz0iaHR0cDovL3B1cmwub3JnL2RjL2VsZW1lbnRzLzEuMS8iDQogICB4bWxuczpjYz0iaHR0cDovL2NyZWF0aXZlY29tbW9ucy5vcmcvbnMjIg0KICAgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIg0KICAgeG1sbnM6c3ZnPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyINCiAgIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyINCiAgIHhtbG5zOnNvZGlwb2RpPSJodHRwOi8vc29kaXBvZGkuc291cmNlZm9yZ2UubmV0L0RURC9zb2RpcG9kaS0wLmR0ZCINCiAgIHhtbG5zOmlua3NjYXBlPSJodHRwOi8vd3d3Lmlua3NjYXBlLm9yZy9uYW1lc3BhY2VzL2lua3NjYXBlIg0KICAgZW5hYmxlLWJhY2tncm91bmQ9Im5ldyAwIDAgMTAwIDEwMCINCiAgIGhlaWdodD0iMTAwcHgiDQogICB2ZXJzaW9uPSIxLjEiDQogICB2aWV3Qm94PSIwIDAgMTAwIDEwMCINCiAgIHdpZHRoPSIxMDBweCINCiAgIHhtbDpzcGFjZT0icHJlc2VydmUiDQogICBpZD0ic3ZnMiINCiAgIGlua3NjYXBlOnZlcnNpb249IjAuOTEgcjEzNzI1Ig0KICAgc29kaXBvZGk6ZG9jbmFtZT0iaWZfU3RvcmFnZV9fQ29udGVudF9EZWxpdmVyeV9BV1NfSW1wb3J0X0V4cG9ydF8yNTkyNTAuc3ZnIj48bWV0YWRhdGENCiAgICAgaWQ9Im1ldGFkYXRhMTIxIj48cmRmOlJERj48Y2M6V29yaw0KICAgICAgICAgcmRmOmFib3V0PSIiPjxkYzpmb3JtYXQ+aW1hZ2Uvc3ZnK3htbDwvZGM6Zm9ybWF0PjxkYzp0eXBlDQogICAgICAgICAgIHJkZjpyZXNvdXJjZT0iaHR0cDovL3B1cmwub3JnL2RjL2RjbWl0eXBlL1N0aWxsSW1hZ2UiIC8+PC9jYzpXb3JrPjwvcmRmOlJERj48L21ldGFkYXRhPjxkZWZzDQogICAgIGlkPSJkZWZzMTE5IiAvPjxzb2RpcG9kaTpuYW1lZHZpZXcNCiAgICAgcGFnZWNvbG9yPSIjZmZmZmZmIg0KICAgICBib3JkZXJjb2xvcj0iIzY2NjY2NiINCiAgICAgYm9yZGVyb3BhY2l0eT0iMSINCiAgICAgb2JqZWN0dG9sZXJhbmNlPSIxMCINCiAgICAgZ3JpZHRvbGVyYW5jZT0iMTAiDQogICAgIGd1aWRldG9sZXJhbmNlPSIxMCINCiAgICAgaW5rc2NhcGU6cGFnZW9wYWNpdHk9IjAiDQogICAgIGlua3NjYXBlOnBhZ2VzaGFkb3c9IjIiDQogICAgIGlua3NjYXBlOndpbmRvdy13aWR0aD0iMTU1MyINCiAgICAgaW5rc2NhcGU6d2luZG93LWhlaWdodD0iODQ1Ig0KICAgICBpZD0ibmFtZWR2aWV3MTE3Ig0KICAgICBzaG93Z3JpZD0iZmFsc2UiDQogICAgIGlua3NjYXBlOnpvb209IjIuMzYiDQogICAgIGlua3NjYXBlOmN4PSI1MCINCiAgICAgaW5rc2NhcGU6Y3k9IjUwIg0KICAgICBpbmtzY2FwZTp3aW5kb3cteD0iMCINCiAgICAgaW5rc2NhcGU6d2luZG93LXk9IjAiDQogICAgIGlua3NjYXBlOndpbmRvdy1tYXhpbWl6ZWQ9IjAiDQogICAgIGlua3NjYXBlOmN1cnJlbnQtbGF5ZXI9InN2ZzIiIC8+PGcNCiAgICAgaWQ9IkxheWVyXzEiDQogICAgIHRyYW5zZm9ybT0ibWF0cml4KDEuNzI1OTYwMiwwLDAsMS43MjU5NjAyLC0zNi41MTc5OTMsLTM1LjU1NTg1NykiPjxnDQogICAgICAgaWQ9Imc1Ij48Zw0KICAgICAgICAgZW5hYmxlLWJhY2tncm91bmQ9Im5ldyAgICAiDQogICAgICAgICBpZD0iZzciPjxnDQogICAgICAgICAgIGVuYWJsZS1iYWNrZ3JvdW5kPSJuZXcgICAgIg0KICAgICAgICAgICBpZD0iZzkiPjxkZWZzDQogICAgICAgICAgICAgaWQ9ImRlZnMxMSI+PHBhdGgNCiAgICAgICAgICAgICAgIGQ9Im0gNzcuMDIzLDI3LjM1MiAwLDIuNjE1IGMgMCwzLjIwNyAtMTIuNTA4LDUuNzk1IC0yNy45NTMsNS43OTUgLTE1LjQyNiwwIC0yNy45NTEsLTIuNTg4IC0yNy45NTEsLTUuNzk1IGwgMCwtMi42MTUgYyAwLDMuMjA3IDEyLjUyNSw1Ljc5NSAyNy45NTEsNS43OTUgMTUuNDQ2LC0xMGUtNCAyNy45NTMsLTIuNTg4IDI3Ljk1MywtNS43OTUgeiINCiAgICAgICAgICAgICAgIGVuYWJsZS1iYWNrZ3JvdW5kPSJuZXcgICAgIg0KICAgICAgICAgICAgICAgaWQ9IlNWR0lEXzIzXyINCiAgICAgICAgICAgICAgIGlua3NjYXBlOmNvbm5lY3Rvci1jdXJ2YXR1cmU9IjAiIC8+PC9kZWZzPjxjbGlwUGF0aA0KICAgICAgICAgICAgIGlkPSJTVkdJRF8yXyIgLz48Zw0KICAgICAgICAgICAgIGNsaXAtcGF0aD0idXJsKCNTVkdJRF8yXykiDQogICAgICAgICAgICAgZW5hYmxlLWJhY2tncm91bmQ9Im5ldyAgICAiDQogICAgICAgICAgICAgaWQ9ImcxNSI+PHBhdGgNCiAgICAgICAgICAgICAgIGQ9Im0gNzcuMDIzLDI3LjM1MiAwLDIuNjE1IGMgMCwwLjA3MiAtMC4wMDgsMC4xNDUgLTAuMDIsMC4yMTcgbCAwLC0yLjYxNCBjIDAuMDEzLC0wLjA3NCAwLjAyLC0wLjE0NiAwLjAyLC0wLjIxOCINCiAgICAgICAgICAgICAgIGlkPSJwYXRoMTciDQogICAgICAgICAgICAgICBpbmtzY2FwZTpjb25uZWN0b3ItY3VydmF0dXJlPSIwIg0KICAgICAgICAgICAgICAgc3R5bGU9ImZpbGw6IzhjMzMyMyIgLz48cGF0aA0KICAgICAgICAgICAgICAgZD0ibSA3Ny4wMDQsMjcuNTcgMCwyLjYxMyBjIC0wLjAxNCwwLjA4NCAtMC4wMzcsMC4xNjYgLTAuMDY4LDAuMjQ4IGwgMCwtMi42MTMgYyAwLjAzMSwtMC4wODQgMC4wNTQsLTAuMTY2IDAuMDY4LC0wLjI0OCINCiAgICAgICAgICAgICAgIGlkPSJwYXRoMTkiDQogICAgICAgICAgICAgICBpbmtzY2FwZTpjb25uZWN0b3ItY3VydmF0dXJlPSIwIg0KICAgICAgICAgICAgICAgc3R5bGU9ImZpbGw6IzhjMzMyMyIgLz48cGF0aA0KICAgICAgICAgICAgICAgZD0ibSA3Ni45MzYsMjcuODE4IDAsMi42MTMgYyAtMC4wNDcsMC4xMTkgLTAuMTA5LDAuMjM4IC0wLjE4OSwwLjM1NSBsIDAsLTIuNjE1IGMgMC4wNzksLTAuMTE2IDAuMTQyLC0wLjIzMyAwLjE4OSwtMC4zNTMiDQogICAgICAgICAgICAgICBpZD0icGF0aDIxIg0KICAgICAgICAgICAgICAgaW5rc2NhcGU6Y29ubmVjdG9yLWN1cnZhdHVyZT0iMCINCiAgICAgICAgICAgICAgIHN0eWxlPSJmaWxsOiM4YzMzMjMiIC8+PHBhdGgNCiAgICAgICAgICAgICAgIGQ9Im0gNzYuNzQ2LDI4LjE3MiAwLDIuNjE1IGMgLTEuOTIsMi44MTYgLTEzLjU3Miw0Ljk3NSAtMjcuNjc2LDQuOTc1IC0xNS40MjYsMCAtMjcuOTUxLC0yLjU4OCAtMjcuOTUxLC01Ljc5NSBsIDAsLTIuNjE1IGMgMCwzLjIwNyAxMi41MjUsNS43OTUgMjcuOTUxLDUuNzk1IDE0LjEwNCwtMTBlLTQgMjUuNzU2LC0yLjE1OSAyNy42NzYsLTQuOTc1Ig0KICAgICAgICAgICAgICAgaWQ9InBhdGgyMyINCiAgICAgICAgICAgICAgIGlua3NjYXBlOmNvbm5lY3Rvci1jdXJ2YXR1cmU9IjAiDQogICAgICAgICAgICAgICBzdHlsZT0iZmlsbDojOGMzMzIzIiAvPjwvZz48L2c+PGcNCiAgICAgICAgICAgaWQ9ImcyNSI+PHBhdGgNCiAgICAgICAgICAgICBkPSJtIDQ5LjA3LDIxLjU1OSBjIDE1LjQ0NSwwIDI3Ljk1MywyLjU4NiAyNy45NTMsNS43OTMgMCwzLjIwNyAtMTIuNTA4LDUuNzk1IC0yNy45NTMsNS43OTUgLTE1LjQyNiwwIC0yNy45NTEsLTIuNTg4IC0yNy45NTEsLTUuNzk1IDAsLTMuMjA3IDEyLjUyNiwtNS43OTMgMjcuOTUxLC01Ljc5MyB6Ig0KICAgICAgICAgICAgIGlkPSJwYXRoMjciDQogICAgICAgICAgICAgaW5rc2NhcGU6Y29ubmVjdG9yLWN1cnZhdHVyZT0iMCINCiAgICAgICAgICAgICBzdHlsZT0iZmlsbDojZTE1MzQzIiAvPjwvZz48Zw0KICAgICAgICAgICBpZD0iZzI5Ij48cG9seWdvbg0KICAgICAgICAgICAgIHBvaW50cz0iNDQuNjIzLDQ3LjkzIDQ0LjQ0MSw0NS4xNiA1OS42OTUsNDUuMzE2IDU5LjY5NSw0Ny45MyAiDQogICAgICAgICAgICAgaWQ9InBvbHlnb24zMSINCiAgICAgICAgICAgICBzdHlsZT0iZmlsbDojOGMzMzIzIiAvPjwvZz48Zw0KICAgICAgICAgICBpZD0iZzMzIj48cG9seWdvbg0KICAgICAgICAgICAgIHBvaW50cz0iMzQuMzcxLDQwLjk5IDMzLjkyLDM3LjkzIDQ1LjU0NSw0NS4zMDUgNDQuNjIzLDQ3LjkzICINCiAgICAgICAgICAgICBpZD0icG9seWdvbjM1Ig0KICAgICAgICAgICAgIHN0eWxlPSJmaWxsOiM4YzMzMjMiIC8+PC9nPjxnDQogICAgICAgICAgIGlkPSJnMzciPjxwb2x5Z29uDQogICAgICAgICAgICAgcG9pbnRzPSIyMS4yNzksMzQuNDI4IDIxLjI3OSwzMS44MTIgMjUuNTg2LDQ1LjQ5MiAyNC45ODgsNDguMzQ4ICINCiAgICAgICAgICAgICBpZD0icG9seWdvbjM5Ig0KICAgICAgICAgICAgIHN0eWxlPSJmaWxsOiM4YzMzMjMiIC8+PC9nPjxnDQogICAgICAgICAgIGlkPSJnNDEiPjxyZWN0DQogICAgICAgICAgICAgaGVpZ2h0PSIyLjYxNSINCiAgICAgICAgICAgICB3aWR0aD0iOS4zODMwMDA0Ig0KICAgICAgICAgICAgIHg9IjI0Ljk4ODAwMSINCiAgICAgICAgICAgICB5PSI0NS43MzE5OTgiDQogICAgICAgICAgICAgaWQ9InJlY3Q0MyINCiAgICAgICAgICAgICBzdHlsZT0iZmlsbDojOGMzMzIzIiAvPjwvZz48Zw0KICAgICAgICAgICBpZD0iZzQ1Ij48cG9seWdvbg0KICAgICAgICAgICAgIHBvaW50cz0iNzIuODY3LDQ5LjQ4IDcyLjUyMyw0Ni40OTIgNzYuODYzLDMxLjgxMiA3Ni44NjMsMzQuNDI4ICINCiAgICAgICAgICAgICBpZD0icG9seWdvbjQ3Ig0KICAgICAgICAgICAgIHN0eWxlPSJmaWxsOiM4YzMzMjMiIC8+PC9nPjxnDQogICAgICAgICAgIGlkPSJnNDkiPjxwYXRoDQogICAgICAgICAgICAgZD0ibSA3Ni44NjMsMzEuODEyIC0zLjk5NiwxNS4wNTMgLTEzLjE3MiwtOC45MDggMCw3LjM1OSAtMTUuMDcyLDAgLTEwLjI1MiwtNi45NDEgMCw3LjM1NyAtOS4zODMsMCAtMy43MDksLTEzLjkyIGMgMS41MTYsMi45MTIgMTMuMzgxLDUuMTYgMjcuNzkxLDUuMTYgMTQuNDEyLDEwZS00IDI2LjI3OCwtMi4yNDcgMjcuNzkzLC01LjE2IHoiDQogICAgICAgICAgICAgaWQ9InBhdGg1MSINCiAgICAgICAgICAgICBpbmtzY2FwZTpjb25uZWN0b3ItY3VydmF0dXJlPSIwIg0KICAgICAgICAgICAgIHN0eWxlPSJmaWxsOiNlMTUzNDMiIC8+PC9nPjxnDQogICAgICAgICAgIGlkPSJnNTMiPjxwb2x5Z29uDQogICAgICAgICAgICAgcG9pbnRzPSI1OS42OTUsNDAuNTcyIDU5LjY5NSwzNy45NTcgNzIuODY3LDQ2Ljg2NSA3Mi44NjcsNDkuNDggIg0KICAgICAgICAgICAgIGlkPSJwb2x5Z29uNTUiDQogICAgICAgICAgICAgc3R5bGU9ImZpbGw6IzhjMzMyMyIgLz48L2c+PGcNCiAgICAgICAgICAgaWQ9Imc1NyI+PHBvbHlnb24NCiAgICAgICAgICAgICBwb2ludHM9IjUwLjY2Niw1Mi43MjkgNTAuNjY2LDUwLjExMyA1OC4xNDYsNTUuNjExIDU4LjE0Niw1OC4yMjcgIg0KICAgICAgICAgICAgIGlkPSJwb2x5Z29uNTkiDQogICAgICAgICAgICAgc3R5bGU9ImZpbGw6IzhjMzMyMyIgLz48L2c+PGcNCiAgICAgICAgICAgaWQ9Imc2MSI+PHBvbHlnb24NCiAgICAgICAgICAgICBwb2ludHM9IjUxLjQyNiw2Mi42OTkgNTEuNDI2LDYwLjA4NiA2My44NCw2MC4xMzkgNjMuODQsNjIuNzU0ICINCiAgICAgICAgICAgICBpZD0icG9seWdvbjYzIg0KICAgICAgICAgICAgIHN0eWxlPSJmaWxsOiM4YzMzMjMiIC8+PC9nPjxnDQogICAgICAgICAgIGlkPSJnNjUiPjxwb2x5Z29uDQogICAgICAgICAgICAgcG9pbnRzPSI0NC44NjcsNjIuOTA0IDQ0Ljg2Nyw2MC4yODkgNTEuMzYxLDU1LjY4IDUxLjM2MSw1OC4yOTMgIg0KICAgICAgICAgICAgIGlkPSJwb2x5Z29uNjciDQogICAgICAgICAgICAgc3R5bGU9ImZpbGw6IzhjMzMyMyIgLz48L2c+PGcNCiAgICAgICAgICAgaWQ9Imc2OSI+PHJlY3QNCiAgICAgICAgICAgICBoZWlnaHQ9IjIuNjE1Ig0KICAgICAgICAgICAgIHdpZHRoPSIxMy4wNzIiDQogICAgICAgICAgICAgeD0iMjMuNjk4OTk5Ig0KICAgICAgICAgICAgIHk9IjYwLjU1Njk5OSINCiAgICAgICAgICAgICBpZD0icmVjdDcxIg0KICAgICAgICAgICAgIHN0eWxlPSJmaWxsOiM4YzMzMjMiIC8+PC9nPjxnDQogICAgICAgICAgIGlkPSJnNzMiPjxwb2x5Z29uDQogICAgICAgICAgICAgcG9pbnRzPSI2My44NCw2Ny45MDIgNjMuODQsNjUuMjg3IDc4Ljg4MSw1NS4yMjEgNzguODgxLDU3LjgzNiAiDQogICAgICAgICAgICAgaWQ9InBvbHlnb243NSINCiAgICAgICAgICAgICBzdHlsZT0iZmlsbDojOGMzMzIzIiAvPjwvZz48Zw0KICAgICAgICAgICBpZD0iZzc3Ij48cG9seWdvbg0KICAgICAgICAgICAgIHBvaW50cz0iNjMuODQsNjUuMjg3IDYzLjg0LDYwLjEzOSA1MS40MjYsNjAuMDg2IDU4LjE0Niw1NS42MTEgNTAuNjY2LDUwLjExMyA2My44NCw1MC4xNjggNjMuODQsNDUuMDMzIDc4Ljg4MSw1NS4yMjEgIg0KICAgICAgICAgICAgIGlkPSJwb2x5Z29uNzkiDQogICAgICAgICAgICAgc3R5bGU9ImZpbGw6I2UxNTM0MyIgLz48L2c+PGcNCiAgICAgICAgICAgaWQ9Imc4MSI+PHBvbHlnb24NCiAgICAgICAgICAgICBwb2ludHM9IjUxLjM2MSw1NS42OCA0NC45OTIsNjAuMjA3IDM2Ljc3MSw2NS43MDUgMzYuNzcxLDYwLjU1NyAyMy42OTksNjAuNTU3IDIzLjY5OSw1MC41ODYgMzYuNzcxLDUwLjU4NiAzNi43NzEsNDUuNDUxIDQzLjM1LDQ5Ljg5OCAiDQogICAgICAgICAgICAgaWQ9InBvbHlnb244MyINCiAgICAgICAgICAgICBzdHlsZT0iZmlsbDojZTE1MzQzIiAvPjwvZz48Zw0KICAgICAgICAgICBpZD0iZzg1Ij48cG9seWdvbg0KICAgICAgICAgICAgIHBvaW50cz0iMzYuNzcxLDY4LjMyIDM2Ljc3MSw2NS43MDUgNDQuOTkyLDYwLjIwNyA0NC45OTIsNjIuODIyICINCiAgICAgICAgICAgICBpZD0icG9seWdvbjg3Ig0KICAgICAgICAgICAgIHN0eWxlPSJmaWxsOiM4YzMzMjMiIC8+PC9nPjxnDQogICAgICAgICAgIGlkPSJnODkiPjxwb2x5Z29uDQogICAgICAgICAgICAgcG9pbnRzPSI2Ny42MzksNzQuMzUyIDY3LjQ4Miw3Mi4wNzYgNjguNTU5LDY3LjkwNiA2OC41NTksNzAuNTIxICINCiAgICAgICAgICAgICBpZD0icG9seWdvbjkxIg0KICAgICAgICAgICAgIHN0eWxlPSJmaWxsOiM4YzMzMjMiIC8+PC9nPjxnDQogICAgICAgICAgIGlkPSJnOTMiPjxwb2x5Z29uDQogICAgICAgICAgICAgcG9pbnRzPSIyOC42OTUsNjguMDIzIDI4LjY5NSw2NS40MDggMzEuMDQ1LDcyLjE4IDMwLjQzNiw3NC41NzQgIg0KICAgICAgICAgICAgIGlkPSJwb2x5Z29uOTUiDQogICAgICAgICAgICAgc3R5bGU9ImZpbGw6IzhjMzMyMyIgLz48L2c+PGcNCiAgICAgICAgICAgZW5hYmxlLWJhY2tncm91bmQ9Im5ldyAgICAiDQogICAgICAgICAgIGlkPSJnOTciPjxkZWZzDQogICAgICAgICAgICAgaWQ9ImRlZnM5OSI+PHBhdGgNCiAgICAgICAgICAgICAgIGQ9Im0gNjcuNjM5LDcxLjczNiAwLDIuNjE1IGMgMCwyLjEyOSAtOC4yNjYsNC4wOSAtMTguNTY4LDQuMDkgLTEwLjI5OSwwIC0xOC42MzUsLTEuNzI1IC0xOC42MzUsLTMuODY3IGwgMCwtMi42MTUgYyAwLDIuMTQzIDguMzM2LDMuODY3IDE4LjYzNSwzLjg2NyAxMC4zMDIsMCAxOC41NjgsLTEuOTU5IDE4LjU2OCwtNC4wOSB6Ig0KICAgICAgICAgICAgICAgZW5hYmxlLWJhY2tncm91bmQ9Im5ldyAgICAiDQogICAgICAgICAgICAgICBpZD0iU1ZHSURfMjVfIg0KICAgICAgICAgICAgICAgaW5rc2NhcGU6Y29ubmVjdG9yLWN1cnZhdHVyZT0iMCIgLz48L2RlZnM+PGNsaXBQYXRoDQogICAgICAgICAgICAgaWQ9IlNWR0lEXzRfIiAvPjxnDQogICAgICAgICAgICAgY2xpcC1wYXRoPSJ1cmwoI1NWR0lEXzRfKSINCiAgICAgICAgICAgICBlbmFibGUtYmFja2dyb3VuZD0ibmV3ICAgICINCiAgICAgICAgICAgICBpZD0iZzEwMyI+PHBhdGgNCiAgICAgICAgICAgICAgIGQ9Im0gNjcuNjM5LDcxLjczNiAwLDIuNjE1IGMgMCwwLjAzNyAtMC4wMDQsMC4wNzggLTAuMDEyLDAuMTE1IGwgMCwtMi42MTUgYyAwLjAwOCwtMC4wMzcgMC4wMTIsLTAuMDc2IDAuMDEyLC0wLjExNSINCiAgICAgICAgICAgICAgIGlkPSJwYXRoMTA1Ig0KICAgICAgICAgICAgICAgaW5rc2NhcGU6Y29ubmVjdG9yLWN1cnZhdHVyZT0iMCINCiAgICAgICAgICAgICAgIHN0eWxlPSJmaWxsOiM4YzMzMjMiIC8+PHBhdGgNCiAgICAgICAgICAgICAgIGQ9Im0gNjcuNjI3LDcxLjg1MiAwLDIuNjE1IGMgLTAuMDA4LDAuMDQ1IC0wLjAyMSwwLjA5IC0wLjAzNywwLjEzMyBsIDAsLTIuNjEzIGMgMC4wMTUsLTAuMDQ2IDAuMDI5LC0wLjA4OSAwLjAzNywtMC4xMzUiDQogICAgICAgICAgICAgICBpZD0icGF0aDEwNyINCiAgICAgICAgICAgICAgIGlua3NjYXBlOmNvbm5lY3Rvci1jdXJ2YXR1cmU9IjAiDQogICAgICAgICAgICAgICBzdHlsZT0iZmlsbDojOGMzMzIzIiAvPjxwYXRoDQogICAgICAgICAgICAgICBkPSJtIDY3LjU5LDcxLjk4NiAwLDIuNjE0IGMgLTAuMDI3LDAuMDY2IC0wLjA2NiwwLjEzMyAtMC4xMTEsMC4xOTkgbCAwLC0yLjYxNSBjIDAuMDQ0LC0wLjA2NyAwLjA4MywtMC4xMzEgMC4xMTEsLTAuMTk4Ig0KICAgICAgICAgICAgICAgaWQ9InBhdGgxMDkiDQogICAgICAgICAgICAgICBpbmtzY2FwZTpjb25uZWN0b3ItY3VydmF0dXJlPSIwIg0KICAgICAgICAgICAgICAgc3R5bGU9ImZpbGw6IzhjMzMyMyIgLz48cGF0aA0KICAgICAgICAgICAgICAgZD0ibSA2Ny40NzksNzIuMTg0IDAsMi42MTUgYyAtMS40MDQsMS45OCAtOC44MjYsMy42NDMgLTE4LjQwOCwzLjY0MyAtMTAuMjk5LDAgLTE4LjYzNSwtMS43MjUgLTE4LjYzNSwtMy44NjcgTCAzMC4yOTUsNzAuOTMgYyAwLDIuMTQzIDguNDc3LDQuODk2IDE4Ljc3NSw0Ljg5NiA5LjU4MiwwIDE3LjAwNCwtMS42NiAxOC40MDksLTMuNjQyIg0KICAgICAgICAgICAgICAgaWQ9InBhdGgxMTEiDQogICAgICAgICAgICAgICBpbmtzY2FwZTpjb25uZWN0b3ItY3VydmF0dXJlPSIwIg0KICAgICAgICAgICAgICAgc3R5bGU9ImZpbGw6IzhjMzMyMyIgLz48L2c+PC9nPjxnDQogICAgICAgICAgIGlkPSJnMTEzIj48cGF0aA0KICAgICAgICAgICAgIGQ9Im0gNjIuNTgsNjQuNTIgMCw3LjMzMiA1Ljk3OSwtMy45NDUgLTAuOTIsMy44MyBjIDAsMi4xMzEgLTguMjY2LDQuMDkgLTE4LjU2OCw0LjA5IC0xMC4yOTksMCAtMTguNjM1LC0xLjcyNSAtMTguNjM1LC0zLjg2NyBsIC0xLjc0LC02LjU1MSA1LjY3NiwwIDAsNy4zNDYgMTEuNTc0LC03Ljc2MiAxNi42MzQsLTAuNDczIHoiDQogICAgICAgICAgICAgaWQ9InBhdGgxMTUiDQogICAgICAgICAgICAgaW5rc2NhcGU6Y29ubmVjdG9yLWN1cnZhdHVyZT0iMCINCiAgICAgICAgICAgICBzdHlsZT0iZmlsbDojZTE1MzQzIiAvPjwvZz48L2c+PC9nPjwvZz48L3N2Zz4='
	},
	
	$client: {
	    $require: ['Unimap.Controller',
	               'Unimap.Selector',
	               'JSB.Controls.Select',
	               'DataCube.ParserManager',
                   'JSB.Controls.ScrollBox',
                   'JSB.Widgets.SplitBox',
                   'DataCube.Widgets.WidgetWrapper',
                   'JSB.Widgets.PrimitiveEditor',
                   'JSB.Widgets.Button',
                   'JSB.Widgets.TabView',
                   'JSB.Controls.Grid',
                   'css:ParserView.css'
        ],
        
        logEntries: [],
        previewTables: null,

		$constructor: function(opts){
			$base(opts);
			
			this.addClass('parserView');

            this.titleBlock = this.$('<div class="titleBlock"></div>');
            this.append(this.titleBlock);

            var saveBtn = new Button({
                cssClass: "btnOk",
                caption: "Сохранить настройки",
                onClick: function(){
                	ParserManager.server().storeEntryValues($this.entry, $this.schemeRenderer.getValues());
                }
            });
            this.titleBlock.append(saveBtn.getElement());

            var updateBtn = new Button({
                cssClass: "btnUpdate",
                caption: "Обновить",
                onClick: function(){
                    $this.updatePreview();
                }
            });
            this.titleBlock.append(updateBtn.getElement());
            
			var parserSelectorElt = this.$('<div class="parserSelector"></div>').append('<div class="label">Парсер</div>');
			this.parserSelectorCombo = new Select({
				onchange: function(val){
					$this.setParser(val.key);
				}
			});
			parserSelectorElt.append(this.parserSelectorCombo.getElement());
			this.titleBlock.append(parserSelectorElt);

            
            this.stageCtrl = new TabView({
            	allowCloseTab: false,
				allowNewTab: false,
				onSwitchTab: function(tabId){
					$this.stage = tabId;
					$this.attr('stage', $this.stage);
				}
            });
            this.stageCtrl.addClass('stage');
            
            this.titleBlock.append(this.stageCtrl.getElement());
            
            // add stages
            this.stageCtrl.addTab('<span>1</span>Анализ', $this.$('<div class="stagePage"></div>'), {id: 'analysis'});
            this.stageCtrl.addTab('<span>2</span>Настройка', $this.$('<div class="stagePage"></div>'), {id: 'tables'});
            this.stageCtrl.addTab('<span>3</span>Импорт', $this.$('<div class="stagePage"></div>'), {id: 'import'});
            
            
            var splitBox = new SplitBox({
				type: 'vertical',
				position: 0.33
			});
			this.append(splitBox);

			// scheme
			this.schemeScroll = new ScrollBox();
			this.schemeContainer = this.$('<div class="schemeContainer"></div>');
			this.schemeScroll.append(this.schemeContainer);

			// buttons
			this.buttonBar = this.$('<div class="buttonBar"></div>');
			this.schemeScroll.append(this.buttonBar);
			var analyzeBtn = new Button({
                cssClass: "btnAnalyze",
                caption: "Анализировать",
                onClick: function(){
                	$this.extractStructure();
                }
            });
            this.buttonBar.append(analyzeBtn.getElement());

			var previewBtn = new Button({
                cssClass: "btnPreview",
                caption: "Посмотреть результат",
                onClick: function(){
                	$this.updateTablesPreview();
                }
            });
            this.buttonBar.append(previewBtn.getElement());

			this.importBtn = new Button({
                cssClass: "btnImport",
                caption: "Начать импорт",
                onClick: function(){
                	$this.doImport();
                }
            });
            this.buttonBar.append(this.importBtn.getElement());

			splitBox.append(this.schemeScroll.getElement());
			
			var logSplitBox = new SplitBox({
				type: 'horizontal',
				position: 0.8
			});
			splitBox.append(logSplitBox);
			
			this.tableTabView = new TabView({
				tabPosition: 'bottom',
				allowCloseTab: false,
				allowNewTab: false
			});
			logSplitBox.append(this.tableTabView);
			this.tableTabView.addClass('tablesView');
			
			// log
			this.logScroll = new ScrollBox();
			this.logScroll.addClass('log');
			logSplitBox.append(this.logScroll);
			
			this.sourcePanel = this.$('<div class="source"></div>');
			var sourceScroll = new ScrollBox();
			sourceScroll.append(this.sourcePanel);
			$this.sourceTab = $this.tableTabView.addTab('Источник', sourceScroll, {id:'__source'});
			
	        this.subscribe('ParserManager.statusChanged', function(sender, msg, entry){
	        	if(entry != $this.entry){
	        		return;
	        	}
	        	$this.updateStatus();
	        });
	        
	        this.subscribe('ParserManager.clearLog', function(sender, msg, params){
	        	if(params.entry != $this.entry){
	        		return;
	        	}
	        	$this.logEntries = [];
	        	$this.updateLog();
	        });

	        this.subscribe('ParserManager.appendLog', function(sender, msg, params){
	        	if(params.entry != $this.entry){
	        		return;
	        	}
	        	$this.logEntries.push(params.desc);
	        	$this.updateLog();
	        });

		},
		
		refresh: function(){
			this.entry = this.getCurrentEntry();
			$this.enableStage('analysis', false);
			$this.clearTablesPreview();
			ParserManager.server().logRead(this.entry, function(logEntries){
				$this.logEntries = logEntries;
				$this.updateLog();
			});

			ParserManager.getSupportedParsers(this.entry, function(parsers){
				$this.setParsers(parsers);
				$this.updateStatus();
			});
		},
		
		updateStatus: function(){
			ParserManager.server().getEntryStatus($this.entry, function(info){
				if(info.status != 'importing'){
					$this.applyValues(info.values);
					$this.updateSourcePreview();
				}
				$this.setCurrentStatus(info.status);
			});
		},
		
		setCurrentStatus: function(status){
			if(status == 'analyzing'){
				this.schemeScroll.getElement().loader({
					style:'parser',
					message:`#dot 
							<div class="title">Выполняется анализ структуры файла...</div>
							<div jsb="JSB.Widgets.Button" class="roundButton btn16 btnCancel" caption="Отмена"
								onclick="{{=$this.callbackAttr(function(evt){ $this.cancelAction(); })}}"></div>`
				});
				this.stageCtrl.enableTab('analysis', true);
				this.stageCtrl.enableTab('tables', false);
				this.stageCtrl.enableTab('import', false);
				
				this.stageCtrl.switchTab('analysis');

				
			} else if(status == 'importing'){
				this.schemeScroll.getElement().loader({
					style:'parser',
					message:`#dot 
							<div class="title">Выполняется импорт файла...</div>
							<div jsb="JSB.Widgets.Button" class="roundButton btn16 btnCancel" caption="Отмена"
								onclick="{{=$this.callbackAttr(function(evt){ $this.cancelAction(); })}}"></div>`
				});
				
				this.stageCtrl.enableTab('analysis', false);
				this.stageCtrl.enableTab('tables', false);
				this.stageCtrl.enableTab('import', true);
				
				this.stageCtrl.switchTab('import');

			} else {
				// ready to next
				try {
					this.schemeScroll.getElement().loader('hide');
				}catch(e){}
			}
		},
		
		cancelAction: function(){
			ParserManager.server().cancelAction($this.entry);
		},
		
		setParsers: function(parsers){
			$this.parsers = parsers;
			var comboOpts = {};
			for(var i = 0; i < $this.parsers.length; i++){
				var pDesc = $this.parsers[i];
				comboOpts[pDesc.jsb] = pDesc.name;
			}
			$this.parserSelectorCombo.setOptions(comboOpts);
			if($this.parsers.length > 0){
				var currentParserKey = $this.parsers[0].jsb;
				$this.setParser(currentParserKey);
				$this.parserSelectorCombo.setValue(currentParserKey);
			}
		},
		
		setParser: function(parserKey){
			if($this.currentParser && $this.currentParser == parserKey){
				return;
			}
			for(var i = 0; i < $this.parsers.length; i++){
				var pDesc = $this.parsers[i];
				if(pDesc.jsb == parserKey){
					$this.currentParser = parserKey;
					if($this.schemeRenderer){
						$this.schemeRenderer.destroy();
					}
					(function(pDesc){
						var valSel = new Selector();
						valSel.ensureInitialized(function(){
							var vals = valSel.createDefaultValues(pDesc.scheme);
							
							$this.schemeRenderer = new Controller({
			                    scheme: pDesc.scheme,
			                    values: vals,
			                    context: $this.entry.getId(),
			                    onchange: function(key, values){
			                    	$this.schemeChanged(key, values);
			                    }
			                });
							$this.schemeContainer.append($this.schemeRenderer.getElement());
						});
					})(pDesc);
					return;
				}
			}
		},
		
		extractStructure: function(){
			ParserManager.server().runStructureAnalyzing($this.entry, $this.currentParser, $this.schemeRenderer.getValues());
		},
		
		doImport: function(){
			ParserManager.server().runImport($this.entry, $this.currentParser, $this.schemeRenderer.getValues());
		},
		
		applyValues: function(values){
			if(!values){
				this.switchStage('analysis');
				return;
			}
			var pDesc = null;
			for(var i = 0; i < $this.parsers.length; i++){
				pDesc = $this.parsers[i];
				if(pDesc.jsb == $this.currentParser){
					break;
				}
				pDesc = null;
			}

			var newSchemeRenderer = new Controller({
                scheme: pDesc.scheme,
                values: values,
                context: $this.entry.getId(),
                onchange: function(key, values){
                	$this.schemeChanged(key, values);
                }
            });
			
			if($this.schemeRenderer){
				$this.schemeRenderer.destroy();
			}
			
			$this.schemeRenderer = newSchemeRenderer;
			
			this.schemeContainer.empty();
			this.schemeContainer.append($this.schemeRenderer.getElement());
			this.validateButtons();

			var struct = $this.schemeRenderer.findRenderByKey('structure').getScheme();
			if(struct){
				this.switchStage('tables');
//				this.stageCtrl.enableTab('tables', true);
//				this.stageCtrl.switchTab('tables');
				this.updateTablesPreview();
			} else {
				this.enableStage('tables', false);
//				this.stageCtrl.enableTab('import', false);
//				this.stageCtrl.enableTab('tables', false);
//				this.stageCtrl.switchTab('analysis');
			}
		},
		
		schemeChanged: function(key, values){
			this.validateButtons();
		},
		
		validateButtons: function(){
			// validate buttons
			if($this.schemeRenderer.findRenderByKey('databaseEntry').getValue()){
				this.importBtn.enable(true);
			} else {
				this.importBtn.enable(false);
			}
		},
		
		switchStage: function(stage){
			this.enableStage(stage, true);
			this.stageCtrl.switchTab(stage);
		},
		
		enableStage: function(stage, b){
			var stages = ['analysis', 'tables', 'import'];
			if(b){
				for(var i = 0; i < stages.length; i++){
					var s = stages[i];
					this.stageCtrl.enableTab(s, true);
					if(s == stage){
						break;
					}
				}
			} else {
				var curStage = this.stageCtrl.getCurrentTab().id;
				var needSwitchStage = false;
				for(var i = stages.length - 1; i >= 0; i--){
					var s = stages[i];
					this.stageCtrl.enableTab(s, false);
					if(curStage == s){
						if(i > 0){
							curStage = stages[i - 1];
							needSwitchStage = true;
						} else {
							curStage = null;
							needSwitchStage = false;
						}
					}
					if(s == stage){
						break;
					}
				}
				if(needSwitchStage){
					this.switchStage(curStage);
				}
			}
		},
		
		clearTablesPreview: function(){
			var tabsToRemove = [];
			var tabs = $this.tableTabView.getTabs();
			for(var tabId in tabs){
				if(tabId != '__source'){
					tabsToRemove.push(tabId);
				}
			}
			for(var i = 0; i < tabsToRemove.length; i++){
				$this.tableTabView.removeTab(tabsToRemove[i]);
			}
		},
		
		renderTablesPreview: function(tables){
			var tabsToRemove = [];
			var tabs = $this.tableTabView.getTabs();
			for(var tabId in tabs){
				if(tabId != '__source' && !tables[tabId]){
					tabsToRemove.push(tabId);
				}
			}
			for(var i = 0; i < tabsToRemove.length; i++){
				$this.tableTabView.removeTab(tabsToRemove[i]);
			}
			this.previewTables = tables;
			
			// render
			for(var t in tables){
				(function(t){
					var tableCtrl = null;
					if(!tabs[t]){
						tableCtrl = new Grid({
							table: {
			                    rowHeaders: true,
			                    readOnly: true,
			                    manualRowMove: false,
			                    manualColumnMove: false,
			                    //colWidths: 300,
			                    stretchH: 'none'
			                },
			                callbacks: {
			                    createHeader: function(i, header) {
			                    	if(!header) return i + 1;
			                    	var type = $this.previewTables[t].columns[header].type;
			                    	var comment = $this.previewTables[t].columns[header].comment;
			                    	return '<div class="name" type="'+type+'">' + header + '</div><div class="type">'+type+'</div>';
			                    },
			                    preLoader: function(rowCount){}
			                }
						});
						$this.tableTabView.addTab('Таблица: ' + t, tableCtrl, {id:t});
						tabs = $this.tableTabView.getTabs();
					} else {
						tableCtrl = tabs[t].ctrl;
					}
					
					// fill table
					tableCtrl.ensureInitialized(function(){
						tableCtrl.setData(tables[t].rows);
					});
				})(t);
			}
		},
		
		updateLog: function(){
			// generate logMap
			var logMap = {};
			for(var i = 0; i < this.logEntries.length; i++){
				logMap[this.logEntries[i].key] = this.logEntries[i];
			}
			var logEntries = [];
			for(var key in logMap){
				logEntries.push(logMap[key]);
			}
			logEntries.sort(function(a, b){
				return a.time - b.time;
			});
			
			var curEntries = this.logScroll.find('div.entry');
			var keysToRemove = [];
			curEntries.each(function(){
				var curKey = $this.$(this).attr('key');
				if(!logMap[curKey]){
					keysToRemove.push(curKey);
				}
			});
			for(var i = 0; i < keysToRemove.length; i++){
				this.logScroll.find('div.entry[key="'+keysToRemove[i]+'"]').remove();
			}
			
			for(var i = 0; i < logEntries.length; i++){
				var logEntry = logEntries[i];
				var time = new Date(logEntry.time).toLocaleTimeString();

				var entry = this.logScroll.find('div.entry[key="'+logEntry.key+'"]');
				
				if(entry.length == 0){
					// append new
					entry = $this.$('<div class="entry"><span class="time"></span><span class="text"></span></div>');
					entry.attr('key', logEntry.key);
					entry.attr('type', logEntry.type);
				}
				entry.find('.time').text(time);
				entry.find('.text').text(logEntry.data);
				this.logScroll.append(entry);
				
			}
			if(logEntries.length > 0){
				this.logScroll.scrollToElement('div.entry[key="'+logEntries[logEntries.length - 1].key+'"]', 'bottom');
			}
		},
		
		updatePreview: function(){
			var tab = this.stageCtrl.getCurrentTab();
			switch(tab.id){
			case 'analysis':
				this.updateSourcePreview();
				break;
			case 'tables':
				var struct = $this.schemeRenderer.findRenderByKey('structure').getScheme();
				if(struct){
					this.updateTablesPreview();
				}
				break;
			case 'import':
				break;
			}
		},

		
		updateSourcePreview: function(){
			ParserManager.server().loadSourcePreview($this.entry, $this.currentParser, $this.schemeRenderer.getValues(), function(lines){
				$this.sourcePanel.empty();
				if(!lines){
					$this.tableTabView.showTab($this.sourceTab, false);
				} else {
					$this.tableTabView.showTab($this.sourceTab, true);
					if(JSB.isArray(lines)){
						for(var i = 0; i < lines.length; i++){
							$this.sourcePanel.append($this.$('<div class="line"></div>').text(lines[i]));
						}
					}
				}
			});
		},
		
		updateTablesPreview: function(){
			// TODO: perform validation
			
			$this.tableTabView.getElement().loader();
			ParserManager.server().executePreview($this.entry, $this.currentParser, $this.schemeRenderer.getValues(), function(tables, fail){
				$this.tableTabView.getElement().loader('hide');
				if(fail){
					// TODO: show error message
					
					$this.clearTablesPreview();
					$this.enableStage('import', false);
					return;
				}
				$this.renderTablesPreview(tables);
				$this.enableStage('import', Object.keys(tables).length > 0);
			});
		}
	},
	
	$server: {
		loadSourcePreview: function(entry){
			return 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.';
		}
	}
}