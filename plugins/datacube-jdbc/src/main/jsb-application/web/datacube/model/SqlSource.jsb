{
	$name: 'DataCube.Model.SqlSource',
	$parent: 'DataCube.Model.DatabaseSource',
	$require: ['DataCube.Model.SqlTable'],
	
	details: null,
	
	getDetails: function(){
		return this.details;
	},
	
	$server: {
		$require: ['JSB.Workspace.WorkspaceController',
		           'JSB.Store.StoreManager',
		           'JSB.Crypt.MD5'],
		
		settings: null,
		
		
		$bootstrap: function(){
			WorkspaceController.registerExplorerNode(null, this, {
				priority:0.5, 
				nodeType:'DataCube.SqlSourceNode',
				create: true,
				move: true,
				remove: true,
				title: 'База данных SQL',
				prefix: 'База',
				description: 'Создает подключение к внешней базе данных для использования в аналитике и визуализации',
				icon: 'data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiIHN0YW5kYWxvbmU9Im5vIj8+CjwhLS0gR2VuZXJhdG9yOiBBZG9iZSBJbGx1c3RyYXRvciAxOS4wLjAsIFNWRyBFeHBvcnQgUGx1Zy1JbiAuIFNWRyBWZXJzaW9uOiA2LjAwIEJ1aWxkIDApICAtLT4KCjxzdmcKICAgeG1sbnM6ZGM9Imh0dHA6Ly9wdXJsLm9yZy9kYy9lbGVtZW50cy8xLjEvIgogICB4bWxuczpjYz0iaHR0cDovL2NyZWF0aXZlY29tbW9ucy5vcmcvbnMjIgogICB4bWxuczpyZGY9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkvMDIvMjItcmRmLXN5bnRheC1ucyMiCiAgIHhtbG5zOnN2Zz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciCiAgIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIKICAgeG1sbnM6c29kaXBvZGk9Imh0dHA6Ly9zb2RpcG9kaS5zb3VyY2Vmb3JnZS5uZXQvRFREL3NvZGlwb2RpLTAuZHRkIgogICB4bWxuczppbmtzY2FwZT0iaHR0cDovL3d3dy5pbmtzY2FwZS5vcmcvbmFtZXNwYWNlcy9pbmtzY2FwZSIKICAgdmVyc2lvbj0iMS4xIgogICBpZD0iTGF5ZXJfMSIKICAgeD0iMHB4IgogICB5PSIwcHgiCiAgIHZpZXdCb3g9IjAgMCAyMCAyMCIKICAgeG1sOnNwYWNlPSJwcmVzZXJ2ZSIKICAgaW5rc2NhcGU6dmVyc2lvbj0iMC45MSByMTM3MjUiCiAgIHNvZGlwb2RpOmRvY25hbWU9ImRhdGFiYXNlX3NxbC5zdmciCiAgIHdpZHRoPSIyMCIKICAgaGVpZ2h0PSIyMCI+PG1ldGFkYXRhCiAgICAgaWQ9Im1ldGFkYXRhMjciPjxyZGY6UkRGPjxjYzpXb3JrCiAgICAgICAgIHJkZjphYm91dD0iIj48ZGM6Zm9ybWF0PmltYWdlL3N2Zyt4bWw8L2RjOmZvcm1hdD48ZGM6dHlwZQogICAgICAgICAgIHJkZjpyZXNvdXJjZT0iaHR0cDovL3B1cmwub3JnL2RjL2RjbWl0eXBlL1N0aWxsSW1hZ2UiIC8+PGRjOnRpdGxlIC8+PC9jYzpXb3JrPjwvcmRmOlJERj48L21ldGFkYXRhPjxkZWZzCiAgICAgaWQ9ImRlZnMyNSIgLz48c29kaXBvZGk6bmFtZWR2aWV3CiAgICAgcGFnZWNvbG9yPSIjZmZmZmZmIgogICAgIGJvcmRlcmNvbG9yPSIjNjY2NjY2IgogICAgIGJvcmRlcm9wYWNpdHk9IjEiCiAgICAgb2JqZWN0dG9sZXJhbmNlPSIxMCIKICAgICBncmlkdG9sZXJhbmNlPSIxMCIKICAgICBndWlkZXRvbGVyYW5jZT0iMTAiCiAgICAgaW5rc2NhcGU6cGFnZW9wYWNpdHk9IjAiCiAgICAgaW5rc2NhcGU6cGFnZXNoYWRvdz0iMiIKICAgICBpbmtzY2FwZTp3aW5kb3ctd2lkdGg9IjE5MjAiCiAgICAgaW5rc2NhcGU6d2luZG93LWhlaWdodD0iMTEzOCIKICAgICBpZD0ibmFtZWR2aWV3MjMiCiAgICAgc2hvd2dyaWQ9ImZhbHNlIgogICAgIGlua3NjYXBlOnpvb209IjE5LjY2NjY2NyIKICAgICBpbmtzY2FwZTpjeD0iLTMuMTc1OTMwNiIKICAgICBpbmtzY2FwZTpjeT0iNC44NzQ0NzE0IgogICAgIGlua3NjYXBlOndpbmRvdy14PSItOCIKICAgICBpbmtzY2FwZTp3aW5kb3cteT0iLTgiCiAgICAgaW5rc2NhcGU6d2luZG93LW1heGltaXplZD0iMSIKICAgICBpbmtzY2FwZTpjdXJyZW50LWxheWVyPSJMYXllcl8xIgogICAgIHNob3dndWlkZXM9InRydWUiCiAgICAgaW5rc2NhcGU6Z3VpZGUtYmJveD0idHJ1ZSI+PHNvZGlwb2RpOmd1aWRlCiAgICAgICBwb3NpdGlvbj0iNS45OTk5OTk5LDI1LjI3MTE4NiIKICAgICAgIG9yaWVudGF0aW9uPSIxLDAiCiAgICAgICBpZD0iZ3VpZGU0MTU2IiAvPjxzb2RpcG9kaTpndWlkZQogICAgICAgcG9zaXRpb249IjE2LjM3Mjg4MSwyLjAzMzg5ODMiCiAgICAgICBvcmllbnRhdGlvbj0iMCwxIgogICAgICAgaWQ9Imd1aWRlNDE1OCIgLz48L3NvZGlwb2RpOm5hbWVkdmlldz48c3R5bGUKICAgICB0eXBlPSJ0ZXh0L2NzcyIKICAgICBpZD0ic3R5bGUzIj4KCS5zdDB7ZmlsbDojOTVBNUE2O30KCS5zdDF7ZmlsbDojQkRDM0M3O30KCS5zdDJ7ZmlsbDojN0Y4QzhEO30KCS5zdDN7ZmlsbDojRUNGMEYxO30KPC9zdHlsZT48ZwogICAgIGlkPSJYTUxJRF8xXyIKICAgICB0cmFuc2Zvcm09Im1hdHJpeCgwLjMwNjc5NzgsMCwwLDAuMzA2Nzk3OCwtNC43OTM2Nzk4LC00Ljc0OTAyOTcpIj48cGF0aAogICAgICAgaWQ9IlhNTElEXzNfIgogICAgICAgY2xhc3M9InN0MCIKICAgICAgIGQ9Im0gMjEuNCw1Ni45IDAsOC42IDAsMS4yIDAsMC4zIGMgMCwwIDAsMCAwLDAuMyAwLDcuMSAxMS45LDEzLjMgMjYuNiwxMy4zIDE0LjcsMCAyNi42LC02LjIgMjYuNiwtMTMuMyBsIDAsLTAuNiAwLC0wLjkgMCwtOC45IC01My4yLDAgeiIKICAgICAgIGlua3NjYXBlOmNvbm5lY3Rvci1jdXJ2YXR1cmU9IjAiCiAgICAgICBzdHlsZT0iZmlsbDojOTVhNWE2IiAvPjxlbGxpcHNlCiAgICAgICBpZD0iWE1MSURfNF8iCiAgICAgICBjbGFzcz0ic3QxIgogICAgICAgY3g9IjQ4IgogICAgICAgY3k9IjU2LjkwMDAwMiIKICAgICAgIHJ4PSIyNi42IgogICAgICAgcnk9IjExLjgiCiAgICAgICBzdHlsZT0iZmlsbDojYmRjM2M3IiAvPjxwYXRoCiAgICAgICBpZD0iWE1MSURfNV8iCiAgICAgICBjbGFzcz0ic3QyIgogICAgICAgZD0ibSAyMS42LDY3LjIgYyAtMC4xLDAuMyAtMC4yLDAuOSAtMC4yLDEuNSAwLDYuNSAxMS45LDExLjggMjYuNiwxMS44IDE0LjcsMCAyNi42LC01LjMgMjYuNiwtMTEuOCAwLC0wLjYgLTAuMSwtMS4yIC0wLjIsLTEuNSBDIDcyLjgsNzIuOCA2MS42LDc3LjUgNDgsNzcuNSAzNC40LDc3LjUgMjMuMiw3Mi44IDIxLjYsNjcuMiBaIgogICAgICAgaW5rc2NhcGU6Y29ubmVjdG9yLWN1cnZhdHVyZT0iMCIKICAgICAgIHN0eWxlPSJmaWxsOiM3ZjhjOGQiIC8+PHBhdGgKICAgICAgIGlkPSJYTUxJRF82XyIKICAgICAgIGNsYXNzPSJzdDAiCiAgICAgICBkPSJtIDIxLjQsNDIuMSAwLDguNiAwLDEuMiAwLDAuMyBjIDAsMCAwLDAgMCwwLjMgMCw3LjEgMTEuOSwxMy4zIDI2LjYsMTMuMyAxNC43LDAgMjYuNiwtNi4yIDI2LjYsLTEzLjMgbCAwLC0wLjYgMCwtMC45IDAsLTguOSAtNTMuMiwwIHoiCiAgICAgICBpbmtzY2FwZTpjb25uZWN0b3ItY3VydmF0dXJlPSIwIgogICAgICAgc3R5bGU9ImZpbGw6Izk1YTVhNiIgLz48ZWxsaXBzZQogICAgICAgaWQ9IlhNTElEXzdfIgogICAgICAgY2xhc3M9InN0MSIKICAgICAgIGN4PSI0OCIKICAgICAgIGN5PSI0Mi4wOTk5OTgiCiAgICAgICByeD0iMjYuNiIKICAgICAgIHJ5PSIxMS44IgogICAgICAgc3R5bGU9ImZpbGw6I2JkYzNjNyIgLz48cGF0aAogICAgICAgaWQ9IlhNTElEXzhfIgogICAgICAgY2xhc3M9InN0MiIKICAgICAgIGQ9Im0gMjEuNiw1Mi40IGMgLTAuMSwwLjMgLTAuMiwwLjkgLTAuMiwxLjUgMCw2LjUgMTEuOSwxMS44IDI2LjYsMTEuOCAxNC43LDAgMjYuNiwtNS4zIDI2LjYsLTExLjggMCwtMC42IC0wLjEsLTEuMiAtMC4yLC0xLjUgQyA3Mi44LDU4IDYxLjYsNjIuOCA0OCw2Mi44IDM0LjQsNjIuOCAyMy4yLDU4IDIxLjYsNTIuNCBaIgogICAgICAgaW5rc2NhcGU6Y29ubmVjdG9yLWN1cnZhdHVyZT0iMCIKICAgICAgIHN0eWxlPSJmaWxsOiM3ZjhjOGQiIC8+PHBhdGgKICAgICAgIGlkPSJYTUxJRF85XyIKICAgICAgIGNsYXNzPSJzdDAiCiAgICAgICBkPSJtIDIxLjQsMjcuMyAwLDguNiAwLDEuMiAwLDAuMyBjIDAsMCAwLDAgMCwwLjMgMCw3LjEgMTEuOSwxMy4zIDI2LjYsMTMuMyAxNC43LDAgMjYuNiwtNi4yIDI2LjYsLTEzLjMgbCAwLC0wLjYgMCwtMC45IDAsLTguOSAtNTMuMiwwIHoiCiAgICAgICBpbmtzY2FwZTpjb25uZWN0b3ItY3VydmF0dXJlPSIwIgogICAgICAgc3R5bGU9ImZpbGw6Izk1YTVhNiIgLz48cGF0aAogICAgICAgaWQ9IlhNTElEXzEwXyIKICAgICAgIGNsYXNzPSJzdDIiCiAgICAgICBkPSJNIDIxLjYsMzcuNyBDIDIxLjUsMzggMjEuNCwzOC42IDIxLjQsMzkuMiAyMS40LDQ1LjYgMzMuMyw1MSA0OCw1MSA2Mi43LDUxIDc0LjYsNDUuNyA3NC42LDM5LjIgNzQuNiwzOC42IDc0LjUsMzggNzQuNCwzNy43IDcyLjgsNDMuMyA2MS42LDQ4IDQ4LDQ4IDM0LjQsNDggMjMuMiw0My4zIDIxLjYsMzcuNyBaIgogICAgICAgaW5rc2NhcGU6Y29ubmVjdG9yLWN1cnZhdHVyZT0iMCIKICAgICAgIHN0eWxlPSJmaWxsOiM3ZjhjOGQiIC8+PHBhdGgKICAgICAgIGlkPSJYTUxJRF8xMV8iCiAgICAgICBjbGFzcz0ic3QxIgogICAgICAgZD0ibSA0OCw1Ni45IDAsMjMuNiBjIDE0LjcsMCAyNi42LC02LjIgMjYuNiwtMTMuMyBsIDAsLTAuNiAwLC0wLjkgMCwtOC45IC0yNi42LDAgeiIKICAgICAgIGlua3NjYXBlOmNvbm5lY3Rvci1jdXJ2YXR1cmU9IjAiCiAgICAgICBzdHlsZT0iZmlsbDojYmRjM2M3IiAvPjxwYXRoCiAgICAgICBpZD0iWE1MSURfMTJfIgogICAgICAgY2xhc3M9InN0MyIKICAgICAgIGQ9Im0gNDgsNDUgMCwyMy42IEMgNjIuNyw2OC42IDc0LjYsNjMuMyA3NC42LDU2LjggNzQuNiw1MC4zIDYyLjcsNDUgNDgsNDUgWiIKICAgICAgIGlua3NjYXBlOmNvbm5lY3Rvci1jdXJ2YXR1cmU9IjAiCiAgICAgICBzdHlsZT0iZmlsbDojZWNmMGYxIiAvPjxwYXRoCiAgICAgICBpZD0iWE1MSURfMTNfIgogICAgICAgY2xhc3M9InN0MSIKICAgICAgIGQ9Im0gNDgsNDIuMSAwLDIzLjYgYyAxNC43LDAgMjYuNiwtNiAyNi42LC0xMy4zIGwgMCwtMC42IDAsLTAuOCAwLC04LjkgLTI2LjYsMCB6IgogICAgICAgaW5rc2NhcGU6Y29ubmVjdG9yLWN1cnZhdHVyZT0iMCIKICAgICAgIHN0eWxlPSJmaWxsOiNiZGMzYzciIC8+PHBhdGgKICAgICAgIGlkPSJYTUxJRF8xNF8iCiAgICAgICBjbGFzcz0ic3QwIgogICAgICAgZD0iTSA3NC40LDUyLjQgQyA3Mi44LDU4LjMgNjEuNiw2Mi44IDQ4LDYyLjggbCAwLDMgYyAxNC43LDAgMjYuNiwtNS4zIDI2LjYsLTExLjggMCwtMC42IC0wLjEsLTEuMSAtMC4yLC0xLjYgeiIKICAgICAgIGlua3NjYXBlOmNvbm5lY3Rvci1jdXJ2YXR1cmU9IjAiCiAgICAgICBzdHlsZT0iZmlsbDojOTVhNWE2IiAvPjxwYXRoCiAgICAgICBpZD0iWE1MSURfMTVfIgogICAgICAgY2xhc3M9InN0MyIKICAgICAgIGQ9Im0gNDgsMzAuMyAwLDIzLjYgQyA2Mi43LDUzLjkgNzQuNiw0OC42IDc0LjYsNDIuMSA3NC42LDM1LjYgNjIuNywzMC4zIDQ4LDMwLjMgWiIKICAgICAgIGlua3NjYXBlOmNvbm5lY3Rvci1jdXJ2YXR1cmU9IjAiCiAgICAgICBzdHlsZT0iZmlsbDojZWNmMGYxIiAvPjxwYXRoCiAgICAgICBpZD0iWE1MSURfMTZfIgogICAgICAgY2xhc3M9InN0MSIKICAgICAgIGQ9Ik0gNDgsMjcuMyA0OCw1MSBjIDE0LjcsMCAyNi42LC02IDI2LjYsLTEzLjMgbCAwLC0wLjYgMCwtMC45IDAsLTguOSAtMjYuNiwwIHoiCiAgICAgICBpbmtzY2FwZTpjb25uZWN0b3ItY3VydmF0dXJlPSIwIgogICAgICAgc3R5bGU9ImZpbGw6I2JkYzNjNyIgLz48cGF0aAogICAgICAgaWQ9IlhNTElEXzE3XyIKICAgICAgIGNsYXNzPSJzdDAiCiAgICAgICBkPSJNIDc0LjQsMzcuNyBDIDcyLjgsNDMuNSA2MS42LDQ4IDQ4LDQ4IGwgMCwzIGMgMTQuNywwIDI2LjYsLTUuMyAyNi42LC0xMS44IDAsLTAuNiAtMC4xLC0xLjEgLTAuMiwtMS41IHoiCiAgICAgICBpbmtzY2FwZTpjb25uZWN0b3ItY3VydmF0dXJlPSIwIgogICAgICAgc3R5bGU9ImZpbGw6Izk1YTVhNiIgLz48cGF0aAogICAgICAgaWQ9IlhNTElEXzE4XyIKICAgICAgIGNsYXNzPSJzdDAiCiAgICAgICBkPSJNIDc0LjQsNjcuMiBDIDcyLjgsNzIuOCA2MS42LDc3LjUgNDgsNzcuNSBsIDAsMyBjIDE0LjcsMCAyNi42LC01LjMgMjYuNiwtMTEuOCAwLC0wLjYgLTAuMSwtMS4yIC0wLjIsLTEuNSB6IgogICAgICAgaW5rc2NhcGU6Y29ubmVjdG9yLWN1cnZhdHVyZT0iMCIKICAgICAgIHN0eWxlPSJmaWxsOiM5NWE1YTYiIC8+PGVsbGlwc2UKICAgICAgIGlkPSJYTUxJRF8xOV8iCiAgICAgICBjbGFzcz0ic3QxIgogICAgICAgY3g9IjQ4IgogICAgICAgY3k9IjI3LjI5OTk5OSIKICAgICAgIHJ4PSIyNi42IgogICAgICAgcnk9IjExLjgiCiAgICAgICBzdHlsZT0iZmlsbDojYmRjM2M3IiAvPjwvZz48ZwogICAgIGlkPSJnNDE2MyIKICAgICB0cmFuc2Zvcm09Im1hdHJpeCgxLjEyNjAxMzIsMCwwLDEuMTI2MDEzMiwtMi41NjcwODc2LC0xLjk3MDIxNzEpIj48cmVjdAogICAgICAgcnk9IjAuNTY0MDc4OTkiCiAgICAgICB5PSIxMS41MDg0NzQiCiAgICAgICB4PSI4LjM4OTgzMDYiCiAgICAgICBoZWlnaHQ9IjUuMzg5ODMwNiIKICAgICAgIHdpZHRoPSIxMC45MzIyMDMiCiAgICAgICBpZD0icmVjdDQxNjEiCiAgICAgICBzdHlsZT0ib3BhY2l0eToxO2ZpbGw6I2ZmZmZmZjtmaWxsLW9wYWNpdHk6MTtzdHJva2U6bm9uZTtzdHJva2Utd2lkdGg6MS4yMjM5OTk5ODtzdHJva2UtbGluZWNhcDpyb3VuZDtzdHJva2UtbGluZWpvaW46cm91bmQ7c3Ryb2tlLW1pdGVybGltaXQ6NDtzdHJva2UtZGFzaGFycmF5Om5vbmU7c3Ryb2tlLW9wYWNpdHk6MSIgLz48ZwogICAgICAgaWQ9IlBhZ2UtMSIKICAgICAgIHN0eWxlPSJmaWxsOm5vbmU7ZmlsbC1ydWxlOmV2ZW5vZGQ7c3Ryb2tlOm5vbmU7c3Ryb2tlLXdpZHRoOjEiCiAgICAgICB0cmFuc2Zvcm09Im1hdHJpeCgwLjUzODQ2MTU1LDAsMCwwLjUzODQ2MTU1LDQuODkxMTM0LDUuMjY3OTI3MSkiPjxnCiAgICAgICAgIGlkPSJpY29uLTI0LWZpbGUtc3FsIgogICAgICAgICBzdHlsZT0iZmlsbDojMTU3ZWZiIj48cGF0aAogICAgICAgICAgIGlkPSJmaWxlLXNxbCIKICAgICAgICAgICBkPSJNIDE3LjY3NTY0NCwxOS44ODI3NTEgQyAxNy40NjMxNjksMTkuOTU4NzI4IDE3LjIzNDAyNCwyMCAxNi45OTUxMTgsMjAgbCAtMC45OTAyMzcsMCBDIDE0Ljg5MzksMjAgMTQsMTkuMTAxOTE5IDE0LDE3Ljk5NDA4MSBsIDAsLTIuOTg4MTYyIEMgMTQsMTMuODg2NTU1IDE0Ljg5NzYxNiwxMyAxNi4wMDQ4ODEsMTMgbCAwLjk5MDIzNywwIEMgMTguMTA2MSwxMyAxOSwxMy44OTgwODEgMTksMTUuMDA1OTE5IGwgMCwyLjk4ODE2MiBjIDAsMC41MDUyNzggLTAuMTgyODk4LDAuOTYzMTIgLTAuNDg1NDE4LDEuMzEzMzk0IGwgMC43NTMxODUsMC43NTMxODUgLTAuNzA3MTA3LDAuNzA3MTA3IC0wLjg4NTAxNiwtMC44ODUwMTYgMCwwIDAsMCB6IE0gMTYuNzkyODkzLDE5IDE1Ljk5ODk1NywxOSBDIDE1LjQ0MjY2LDE5IDE1LDE4LjU1MjM3MSAxNSwxOC4wMDAxOTIgbCAwLC0zLjAwMDM4NSBDIDE1LDE0LjQ0MzcxNyAxNS40NDcyNDgsMTQgMTUuOTk4OTU3LDE0IGwgMS4wMDIwODYsMCBDIDE3LjU1NzM0LDE0IDE4LDE0LjQ0NzYyOSAxOCwxNC45OTk4MDcgbCAwLDMuMDAwMzg1IGMgMCwwLjIyNDQ1NCAtMC4wNzI4NiwwLjQzMDYgLTAuMTk2MDUsMC41OTY2NTEgbCAtMS4zNjQ2MSwtMS4zNjQ2MSAtMC43MDcxMDcsMC43MDcxMDcgMS4wNjA2NiwxLjA2MDY2IDAsMCAwLDAgeiBNIDguMDA2ODQ4MywxMCBDIDYuMzQ2MjExOSwxMCA1LDExLjM0MjI2NCA1LDEyLjk5ODc4NiBsIDAsNy4wMDI0MjggQyA1LDIxLjY1NzM5OCA2LjMzNTk5MTUsMjMgOC4wMDY4NDgzLDIzIEwgMjQuOTkzMTUyLDIzIEMgMjYuNjUzNzg4LDIzIDI4LDIxLjY1NzczNiAyOCwyMC4wMDEyMTQgbCAwLC03LjAwMjQyOCBDIDI4LDExLjM0MjYwMiAyNi42NjQwMDksMTAgMjQuOTkzMTUyLDEwIGwgLTE2Ljk4NjMwMzcsMCAwLDAgeiBtIDEuOTk4MDMzNywzIEMgOC44OTc2MTYsMTMgOCwxMy44ODc3MyA4LDE1IGMgMCwxLjEwNDU2OSAwLjg4NzcyOTYsMiAyLDIgbCAwLjk5MDYzMSwwIEMgMTEuNTQ4MDksMTcgMTIsMTcuNDQzODY1IDEyLDE4IGMgMCwwLjU1MjI4NSAtMC40NDI2NiwxIC0wLjk5ODk1NywxIEwgOS45OTg5NTY2LDE5IEMgOS40NDcyNDgxLDE5IDksMTguNTQzNzE2IDksMTguMDA0NDcxIGwgMCwtMC4wMTEzMSAtMSwwIDAsMC4wMDU4IEMgOCwxOS4xMDQwODYgOC44OTM4OTk4LDIwIDEwLjAwNDg4MiwyMCBsIDAuOTkwMjM3LDAgQyAxMi4xMDIzODQsMjAgMTMsMTkuMTEyMjcgMTMsMTggMTMsMTYuODk1NDMgMTIuMTEyMjcsMTYgMTEsMTYgbCAtMC45OTA2MzEsMCBDIDkuNDUxOTA5OSwxNiA5LDE1LjU1NjEzNSA5LDE1IDksMTQuNDQ3NzE1IDkuNDQyNjYwMywxNCA5Ljk5ODk1NjYsMTQgbCAxLjAwMjA4NjQsMCBDIDExLjU1Mjc1MiwxNCAxMiwxNC40NTMxODYgMTIsMTUgbCAxLDAgYyAwLC0xLjEwNDU2OSAtMC44OTM5LC0yIC0yLjAwNDg4MSwtMiBsIC0wLjk5MDIzNywwIDAsMCB6IE0gMjUsMTkgbCAwLDEgLTUsMCAwLC03IDEsMCAwLDYgNCwwIDAsMCB6IgogICAgICAgICAgIGlua3NjYXBlOmNvbm5lY3Rvci1jdXJ2YXR1cmU9IjAiIC8+PC9nPjwvZz48L2c+PC9zdmc+',
				order: 10
			});
		},

		$constructor: function(id, workspace){
			$base(id, workspace);
			this.settings = this.property('settings');
			this.details = this.property('details');
		},
		
		getSettings: function(){
			return this.settings;
		},
		
		updateSettings: function(settings){
			this.settings = JSB.merge({
				name: $this.getId(),
				type: 'JSB.Store.Sql.SQLStore',
				url: '',
				properties: {}
			}, settings);
			this.property('settings', this.settings);
			this.getWorkspace().store();
			this.publish('DataCube.Model.SqlSource.updateSettings');
		},
		
		testConnection: function(settings){
			this.updateSettings(settings);
			
			// test connection
			var store = StoreManager.getStore(this.settings);
			store.getConnection(true).close();
			return true;
		},
		
		getStore: function(){
			return StoreManager.getStore(this.settings);
		},
		
		loadAffectedCubes: function(){
			// temp: load all cubes
			var it = this.getWorkspace().search(function(eDesc){
				return eDesc.eType == 'DataCube.Model.Cube';
			});
			
			while(it.hasNext()){
				var e = it.next();
				e.load();
			}
			
			// TODO: load only affected cubes
			
		},
		
		fuxupAffectedCubes: function(){
			var it = this.getWorkspace().search(function(eDesc){
				return eDesc.eType == 'DataCube.Model.Cube';
			});
			
			while(it.hasNext()){
				var e = it.next();
				e.load();
				e.fixupProviders();
			}
		},
		
		clearCache: function(){
			this.loadAffectedCubes();
			$this.publish('DataCube.Model.SqlSource.clearCache');
		},
		
		updateCache: function(){
			this.loadAffectedCubes();
			$this.publish('DataCube.Model.SqlSource.updateCache');
		},
		
		extractScheme: function(){
			var mtx = 'DataCube.Model.SqlSource.extractScheme.' + this.getId();
			JSB.getLocker().lock(mtx);
			try {
				$this.publish('DataCube.Model.SqlSource.extractScheme', {status: 'Соединение с базой данных', success: true}, {session: true});
				var store = this.getStore();
				var lastPP = -1;
				$this.publish('DataCube.Model.SqlSource.extractScheme', {status: 'Получение списка таблиц', success: true}, {session: true});
				var schema = store.extractSchema(function(idx, total){
					var pp = Math.round(idx * 100 / total);
	            	if(pp > lastPP){
	            		$this.publish('DataCube.Model.SqlSource.extractScheme', {status: 'Обновление схемы ' + pp + '%', success: true}, {session: true});
	            		lastPP = pp;
	            	}
				}, this.settings.filter);
				$this.publish('DataCube.Model.SqlSource.extractScheme', {status: 'Сохранение схемы', success: true}, {session: true});
	
				// update entries
				var existedTables = JSB.clone(this.getChildren());
				for(var sName in schema){
					var sDesc = schema[sName];
					for(var tName in sDesc.tables){
						var tDesc = sDesc.tables[tName];
						var tId = MD5.md5(this.getId() + '|' + sName + '|' + tName);
						if(existedTables[tId]){
							// already exists
							existedTables[tId].updateDescriptor(tDesc);
							if(existedTables[tId].isMissing()){
								existedTables[tId].setMissing(false);
								existedTables[tId].doSync();
							}
							delete existedTables[tId];
							continue;
						}
						var tEntry = new SqlTable(tId, this.getWorkspace(), tDesc);
						this.addChildEntry(tEntry);
					}
				}
				
				// remove unexisted
				for(var tId in existedTables){
					if(!existedTables[tId].isMissing()){
						existedTables[tId].setMissing(true);
						existedTables[tId].doSync();
					}
/*					var cEntry = this.removeChildEntry(tId);
					if(cEntry){
						cEntry.remove();
					}*/
				}
				
				// construct details
				var details = {
					updated: Date.now(),
					schemes: 0,
					tables: 0,
					columns: 0
				};
				for(var sName in schema){
					details.schemes++;
					var sDesc = schema[sName];
					for(var tName in sDesc.tables){
						details.tables++;
						var tDesc = sDesc.tables[tName];
						for(var cName in tDesc.columns){
							details.columns++;
						}
					}
				}
				this.details = details;
				this.property('details', this.details);
				$this.publish('DataCube.Model.SqlSource.schemeUpdated');
			} finally {
				JSB.getLocker().unlock(mtx);
			}
			this.getWorkspace().store();
			
			return details;
		}
	}
}