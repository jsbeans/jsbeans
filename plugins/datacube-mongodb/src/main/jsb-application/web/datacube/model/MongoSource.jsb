/** DataCube - jsBeans extension | jsbeans.org (MIT Licence) | (c) Special Information Systems, LLC */

{
	$name: 'DataCube.Model.MongoSource',
	$parent: 'DataCube.Model.DatabaseSource',
	$require: ['DataCube.Model.MongoCollection'],
	
	$expose: {
		priority:0.5, 
		nodeType:'DataCube.MongoSourceNode',
		create: true,
		move: true,
		remove: true,
		title: 'База данных MongoDB',
		prefix: 'База',
		description: 'Создает подключение к внешней базе данных для использования в аналитике и визуализации',
		icon: 'data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiIHN0YW5kYWxvbmU9Im5vIj8+CjwhLS0gR2VuZXJhdG9yOiBBZG9iZSBJbGx1c3RyYXRvciAxOS4wLjAsIFNWRyBFeHBvcnQgUGx1Zy1JbiAuIFNWRyBWZXJzaW9uOiA2LjAwIEJ1aWxkIDApICAtLT4KCjxzdmcKICAgeG1sbnM6ZGM9Imh0dHA6Ly9wdXJsLm9yZy9kYy9lbGVtZW50cy8xLjEvIgogICB4bWxuczpjYz0iaHR0cDovL2NyZWF0aXZlY29tbW9ucy5vcmcvbnMjIgogICB4bWxuczpyZGY9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkvMDIvMjItcmRmLXN5bnRheC1ucyMiCiAgIHhtbG5zOnN2Zz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciCiAgIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIKICAgeG1sbnM6c29kaXBvZGk9Imh0dHA6Ly9zb2RpcG9kaS5zb3VyY2Vmb3JnZS5uZXQvRFREL3NvZGlwb2RpLTAuZHRkIgogICB4bWxuczppbmtzY2FwZT0iaHR0cDovL3d3dy5pbmtzY2FwZS5vcmcvbmFtZXNwYWNlcy9pbmtzY2FwZSIKICAgdmVyc2lvbj0iMS4xIgogICBpZD0iTGF5ZXJfMSIKICAgeD0iMHB4IgogICB5PSIwcHgiCiAgIHZpZXdCb3g9IjAgMCAyMCAyMCIKICAgeG1sOnNwYWNlPSJwcmVzZXJ2ZSIKICAgaW5rc2NhcGU6dmVyc2lvbj0iMC45MSByMTM3MjUiCiAgIHNvZGlwb2RpOmRvY25hbWU9ImRhdGFiYXNlX21vbmdvLnN2ZyIKICAgd2lkdGg9IjIwIgogICBoZWlnaHQ9IjIwIj48bWV0YWRhdGEKICAgICBpZD0ibWV0YWRhdGEyNyI+PHJkZjpSREY+PGNjOldvcmsKICAgICAgICAgcmRmOmFib3V0PSIiPjxkYzpmb3JtYXQ+aW1hZ2Uvc3ZnK3htbDwvZGM6Zm9ybWF0PjxkYzp0eXBlCiAgICAgICAgICAgcmRmOnJlc291cmNlPSJodHRwOi8vcHVybC5vcmcvZGMvZGNtaXR5cGUvU3RpbGxJbWFnZSIgLz48ZGM6dGl0bGU+PC9kYzp0aXRsZT48L2NjOldvcms+PC9yZGY6UkRGPjwvbWV0YWRhdGE+PGRlZnMKICAgICBpZD0iZGVmczI1IiAvPjxzb2RpcG9kaTpuYW1lZHZpZXcKICAgICBwYWdlY29sb3I9IiNmZmZmZmYiCiAgICAgYm9yZGVyY29sb3I9IiM2NjY2NjYiCiAgICAgYm9yZGVyb3BhY2l0eT0iMSIKICAgICBvYmplY3R0b2xlcmFuY2U9IjEwIgogICAgIGdyaWR0b2xlcmFuY2U9IjEwIgogICAgIGd1aWRldG9sZXJhbmNlPSIxMCIKICAgICBpbmtzY2FwZTpwYWdlb3BhY2l0eT0iMCIKICAgICBpbmtzY2FwZTpwYWdlc2hhZG93PSIyIgogICAgIGlua3NjYXBlOndpbmRvdy13aWR0aD0iMTkyMCIKICAgICBpbmtzY2FwZTp3aW5kb3ctaGVpZ2h0PSIxMTc4IgogICAgIGlkPSJuYW1lZHZpZXcyMyIKICAgICBzaG93Z3JpZD0iZmFsc2UiCiAgICAgaW5rc2NhcGU6em9vbT0iMTkuNjY2NjY3IgogICAgIGlua3NjYXBlOmN4PSIxLjc5NjE0MzQiCiAgICAgaW5rc2NhcGU6Y3k9IjQuMDUxMzE2NiIKICAgICBpbmtzY2FwZTp3aW5kb3cteD0iMTkxMiIKICAgICBpbmtzY2FwZTp3aW5kb3cteT0iLTgiCiAgICAgaW5rc2NhcGU6d2luZG93LW1heGltaXplZD0iMSIKICAgICBpbmtzY2FwZTpjdXJyZW50LWxheWVyPSJMYXllcl8xIgogICAgIHNob3dndWlkZXM9InRydWUiCiAgICAgaW5rc2NhcGU6Z3VpZGUtYmJveD0idHJ1ZSI+PHNvZGlwb2RpOmd1aWRlCiAgICAgICBwb3NpdGlvbj0iMTYuMzIyMDM0LDEuOTgzMDUwOCIKICAgICAgIG9yaWVudGF0aW9uPSIwLDEiCiAgICAgICBpZD0iZ3VpZGU0MTg3IiAvPjxzb2RpcG9kaTpndWlkZQogICAgICAgcG9zaXRpb249IjUuOTk5OTk5OSw4LjY5NDkxNTEiCiAgICAgICBvcmllbnRhdGlvbj0iMSwwIgogICAgICAgaWQ9Imd1aWRlNDE4OSIgLz48L3NvZGlwb2RpOm5hbWVkdmlldz48c3R5bGUKICAgICB0eXBlPSJ0ZXh0L2NzcyIKICAgICBpZD0ic3R5bGUzIj4KCS5zdDB7ZmlsbDojOTVBNUE2O30KCS5zdDF7ZmlsbDojQkRDM0M3O30KCS5zdDJ7ZmlsbDojN0Y4QzhEO30KCS5zdDN7ZmlsbDojRUNGMEYxO30KPC9zdHlsZT48ZwogICAgIGlkPSJYTUxJRF8xXyIKICAgICB0cmFuc2Zvcm09Im1hdHJpeCgwLjMwNjc5NzgsMCwwLDAuMzA2Nzk3OCwtNC43OTM2Nzk4LC00Ljc0OTAyOTcpIj48cGF0aAogICAgICAgaWQ9IlhNTElEXzNfIgogICAgICAgY2xhc3M9InN0MCIKICAgICAgIGQ9Im0gMjEuNCw1Ni45IDAsOC42IDAsMS4yIDAsMC4zIGMgMCwwIDAsMCAwLDAuMyAwLDcuMSAxMS45LDEzLjMgMjYuNiwxMy4zIDE0LjcsMCAyNi42LC02LjIgMjYuNiwtMTMuMyBsIDAsLTAuNiAwLC0wLjkgMCwtOC45IC01My4yLDAgeiIKICAgICAgIGlua3NjYXBlOmNvbm5lY3Rvci1jdXJ2YXR1cmU9IjAiCiAgICAgICBzdHlsZT0iZmlsbDojOTVhNWE2IiAvPjxlbGxpcHNlCiAgICAgICBpZD0iWE1MSURfNF8iCiAgICAgICBjbGFzcz0ic3QxIgogICAgICAgY3g9IjQ4IgogICAgICAgY3k9IjU2LjkwMDAwMiIKICAgICAgIHJ4PSIyNi42IgogICAgICAgcnk9IjExLjgiCiAgICAgICBzdHlsZT0iZmlsbDojYmRjM2M3IiAvPjxwYXRoCiAgICAgICBpZD0iWE1MSURfNV8iCiAgICAgICBjbGFzcz0ic3QyIgogICAgICAgZD0ibSAyMS42LDY3LjIgYyAtMC4xLDAuMyAtMC4yLDAuOSAtMC4yLDEuNSAwLDYuNSAxMS45LDExLjggMjYuNiwxMS44IDE0LjcsMCAyNi42LC01LjMgMjYuNiwtMTEuOCAwLC0wLjYgLTAuMSwtMS4yIC0wLjIsLTEuNSBDIDcyLjgsNzIuOCA2MS42LDc3LjUgNDgsNzcuNSAzNC40LDc3LjUgMjMuMiw3Mi44IDIxLjYsNjcuMiBaIgogICAgICAgaW5rc2NhcGU6Y29ubmVjdG9yLWN1cnZhdHVyZT0iMCIKICAgICAgIHN0eWxlPSJmaWxsOiM3ZjhjOGQiIC8+PHBhdGgKICAgICAgIGlkPSJYTUxJRF82XyIKICAgICAgIGNsYXNzPSJzdDAiCiAgICAgICBkPSJtIDIxLjQsNDIuMSAwLDguNiAwLDEuMiAwLDAuMyBjIDAsMCAwLDAgMCwwLjMgMCw3LjEgMTEuOSwxMy4zIDI2LjYsMTMuMyAxNC43LDAgMjYuNiwtNi4yIDI2LjYsLTEzLjMgbCAwLC0wLjYgMCwtMC45IDAsLTguOSAtNTMuMiwwIHoiCiAgICAgICBpbmtzY2FwZTpjb25uZWN0b3ItY3VydmF0dXJlPSIwIgogICAgICAgc3R5bGU9ImZpbGw6Izk1YTVhNiIgLz48ZWxsaXBzZQogICAgICAgaWQ9IlhNTElEXzdfIgogICAgICAgY2xhc3M9InN0MSIKICAgICAgIGN4PSI0OCIKICAgICAgIGN5PSI0Mi4wOTk5OTgiCiAgICAgICByeD0iMjYuNiIKICAgICAgIHJ5PSIxMS44IgogICAgICAgc3R5bGU9ImZpbGw6I2JkYzNjNyIgLz48cGF0aAogICAgICAgaWQ9IlhNTElEXzhfIgogICAgICAgY2xhc3M9InN0MiIKICAgICAgIGQ9Im0gMjEuNiw1Mi40IGMgLTAuMSwwLjMgLTAuMiwwLjkgLTAuMiwxLjUgMCw2LjUgMTEuOSwxMS44IDI2LjYsMTEuOCAxNC43LDAgMjYuNiwtNS4zIDI2LjYsLTExLjggMCwtMC42IC0wLjEsLTEuMiAtMC4yLC0xLjUgQyA3Mi44LDU4IDYxLjYsNjIuOCA0OCw2Mi44IDM0LjQsNjIuOCAyMy4yLDU4IDIxLjYsNTIuNCBaIgogICAgICAgaW5rc2NhcGU6Y29ubmVjdG9yLWN1cnZhdHVyZT0iMCIKICAgICAgIHN0eWxlPSJmaWxsOiM3ZjhjOGQiIC8+PHBhdGgKICAgICAgIGlkPSJYTUxJRF85XyIKICAgICAgIGNsYXNzPSJzdDAiCiAgICAgICBkPSJtIDIxLjQsMjcuMyAwLDguNiAwLDEuMiAwLDAuMyBjIDAsMCAwLDAgMCwwLjMgMCw3LjEgMTEuOSwxMy4zIDI2LjYsMTMuMyAxNC43LDAgMjYuNiwtNi4yIDI2LjYsLTEzLjMgbCAwLC0wLjYgMCwtMC45IDAsLTguOSAtNTMuMiwwIHoiCiAgICAgICBpbmtzY2FwZTpjb25uZWN0b3ItY3VydmF0dXJlPSIwIgogICAgICAgc3R5bGU9ImZpbGw6Izk1YTVhNiIgLz48cGF0aAogICAgICAgaWQ9IlhNTElEXzEwXyIKICAgICAgIGNsYXNzPSJzdDIiCiAgICAgICBkPSJNIDIxLjYsMzcuNyBDIDIxLjUsMzggMjEuNCwzOC42IDIxLjQsMzkuMiAyMS40LDQ1LjYgMzMuMyw1MSA0OCw1MSA2Mi43LDUxIDc0LjYsNDUuNyA3NC42LDM5LjIgNzQuNiwzOC42IDc0LjUsMzggNzQuNCwzNy43IDcyLjgsNDMuMyA2MS42LDQ4IDQ4LDQ4IDM0LjQsNDggMjMuMiw0My4zIDIxLjYsMzcuNyBaIgogICAgICAgaW5rc2NhcGU6Y29ubmVjdG9yLWN1cnZhdHVyZT0iMCIKICAgICAgIHN0eWxlPSJmaWxsOiM3ZjhjOGQiIC8+PHBhdGgKICAgICAgIGlkPSJYTUxJRF8xMV8iCiAgICAgICBjbGFzcz0ic3QxIgogICAgICAgZD0ibSA0OCw1Ni45IDAsMjMuNiBjIDE0LjcsMCAyNi42LC02LjIgMjYuNiwtMTMuMyBsIDAsLTAuNiAwLC0wLjkgMCwtOC45IC0yNi42LDAgeiIKICAgICAgIGlua3NjYXBlOmNvbm5lY3Rvci1jdXJ2YXR1cmU9IjAiCiAgICAgICBzdHlsZT0iZmlsbDojYmRjM2M3IiAvPjxwYXRoCiAgICAgICBpZD0iWE1MSURfMTJfIgogICAgICAgY2xhc3M9InN0MyIKICAgICAgIGQ9Im0gNDgsNDUgMCwyMy42IEMgNjIuNyw2OC42IDc0LjYsNjMuMyA3NC42LDU2LjggNzQuNiw1MC4zIDYyLjcsNDUgNDgsNDUgWiIKICAgICAgIGlua3NjYXBlOmNvbm5lY3Rvci1jdXJ2YXR1cmU9IjAiCiAgICAgICBzdHlsZT0iZmlsbDojZWNmMGYxIiAvPjxwYXRoCiAgICAgICBpZD0iWE1MSURfMTNfIgogICAgICAgY2xhc3M9InN0MSIKICAgICAgIGQ9Im0gNDgsNDIuMSAwLDIzLjYgYyAxNC43LDAgMjYuNiwtNiAyNi42LC0xMy4zIGwgMCwtMC42IDAsLTAuOCAwLC04LjkgLTI2LjYsMCB6IgogICAgICAgaW5rc2NhcGU6Y29ubmVjdG9yLWN1cnZhdHVyZT0iMCIKICAgICAgIHN0eWxlPSJmaWxsOiNiZGMzYzciIC8+PHBhdGgKICAgICAgIGlkPSJYTUxJRF8xNF8iCiAgICAgICBjbGFzcz0ic3QwIgogICAgICAgZD0iTSA3NC40LDUyLjQgQyA3Mi44LDU4LjMgNjEuNiw2Mi44IDQ4LDYyLjggbCAwLDMgYyAxNC43LDAgMjYuNiwtNS4zIDI2LjYsLTExLjggMCwtMC42IC0wLjEsLTEuMSAtMC4yLC0xLjYgeiIKICAgICAgIGlua3NjYXBlOmNvbm5lY3Rvci1jdXJ2YXR1cmU9IjAiCiAgICAgICBzdHlsZT0iZmlsbDojOTVhNWE2IiAvPjxwYXRoCiAgICAgICBpZD0iWE1MSURfMTVfIgogICAgICAgY2xhc3M9InN0MyIKICAgICAgIGQ9Im0gNDgsMzAuMyAwLDIzLjYgQyA2Mi43LDUzLjkgNzQuNiw0OC42IDc0LjYsNDIuMSA3NC42LDM1LjYgNjIuNywzMC4zIDQ4LDMwLjMgWiIKICAgICAgIGlua3NjYXBlOmNvbm5lY3Rvci1jdXJ2YXR1cmU9IjAiCiAgICAgICBzdHlsZT0iZmlsbDojZWNmMGYxIiAvPjxwYXRoCiAgICAgICBpZD0iWE1MSURfMTZfIgogICAgICAgY2xhc3M9InN0MSIKICAgICAgIGQ9Ik0gNDgsMjcuMyA0OCw1MSBjIDE0LjcsMCAyNi42LC02IDI2LjYsLTEzLjMgbCAwLC0wLjYgMCwtMC45IDAsLTguOSAtMjYuNiwwIHoiCiAgICAgICBpbmtzY2FwZTpjb25uZWN0b3ItY3VydmF0dXJlPSIwIgogICAgICAgc3R5bGU9ImZpbGw6I2JkYzNjNyIgLz48cGF0aAogICAgICAgaWQ9IlhNTElEXzE3XyIKICAgICAgIGNsYXNzPSJzdDAiCiAgICAgICBkPSJNIDc0LjQsMzcuNyBDIDcyLjgsNDMuNSA2MS42LDQ4IDQ4LDQ4IGwgMCwzIGMgMTQuNywwIDI2LjYsLTUuMyAyNi42LC0xMS44IDAsLTAuNiAtMC4xLC0xLjEgLTAuMiwtMS41IHoiCiAgICAgICBpbmtzY2FwZTpjb25uZWN0b3ItY3VydmF0dXJlPSIwIgogICAgICAgc3R5bGU9ImZpbGw6Izk1YTVhNiIgLz48cGF0aAogICAgICAgaWQ9IlhNTElEXzE4XyIKICAgICAgIGNsYXNzPSJzdDAiCiAgICAgICBkPSJNIDc0LjQsNjcuMiBDIDcyLjgsNzIuOCA2MS42LDc3LjUgNDgsNzcuNSBsIDAsMyBjIDE0LjcsMCAyNi42LC01LjMgMjYuNiwtMTEuOCAwLC0wLjYgLTAuMSwtMS4yIC0wLjIsLTEuNSB6IgogICAgICAgaW5rc2NhcGU6Y29ubmVjdG9yLWN1cnZhdHVyZT0iMCIKICAgICAgIHN0eWxlPSJmaWxsOiM5NWE1YTYiIC8+PGVsbGlwc2UKICAgICAgIGlkPSJYTUxJRF8xOV8iCiAgICAgICBjbGFzcz0ic3QxIgogICAgICAgY3g9IjQ4IgogICAgICAgY3k9IjI3LjI5OTk5OSIKICAgICAgIHJ4PSIyNi42IgogICAgICAgcnk9IjExLjgiCiAgICAgICBzdHlsZT0iZmlsbDojYmRjM2M3IiAvPjwvZz48ZwogICAgIHRyYW5zZm9ybT0ibWF0cml4KDAuMDk3MzM3NzIsMC4wOTg5ODM2MSwtMC4wOTg5ODM2MSwwLjA5NzMzNzcyLDE1Ljk1MTgxNSwxLjI4MDY5NDMpIgogICAgIGlkPSJnMTMiPjxwYXRoCiAgICAgICBjbGFzcz0ic3QyIgogICAgICAgZD0ibSA1MCwxMzkuMSAtMy42LC0xLjIgYyAwLDAgMC40LC0xOC4yIC02LjEsLTE5LjUgLTQuMywtNSAwLjcsLTIxMy45IDE2LjMsLTAuNyAwLDAgLTUuNCwyLjcgLTYuMyw3LjMgLTEsNC41IC0wLjMsMTQuMSAtMC4zLDE0LjEgbCAwLDAgMCwwIHoiCiAgICAgICBpZD0icGF0aDE1IgogICAgICAgaW5rc2NhcGU6Y29ubmVjdG9yLWN1cnZhdHVyZT0iMCIKICAgICAgIHN0eWxlPSJmaWxsOiNmZmZmZmYiIC8+PHBhdGgKICAgICAgIGNsYXNzPSJzdDMiCiAgICAgICBkPSJtIDUwLDEzOS4xIC0zLjYsLTEuMiBjIDAsMCAwLjQsLTE4LjIgLTYuMSwtMTkuNSAtNC4zLC01IDAuNywtMjEzLjkgMTYuMywtMC43IDAsMCAtNS40LDIuNyAtNi4zLDcuMyAtMSw0LjUgLTAuMywxNC4xIC0wLjMsMTQuMSBsIDAsMCAwLDAgeiIKICAgICAgIGlkPSJwYXRoMTciCiAgICAgICBpbmtzY2FwZTpjb25uZWN0b3ItY3VydmF0dXJlPSIwIgogICAgICAgc3R5bGU9ImZpbGw6I2E2YTM4NSIgLz48cGF0aAogICAgICAgY2xhc3M9InN0MiIKICAgICAgIGQ9Im0gNTEuOSwxMjEuNSBjIDAsMCAzMS4yLC0yMC41IDIzLjksLTYzLjIgLTcsLTMxIC0yMy43LC00MS4yIC0yNS41LC00NS4xIC0yLC0yLjggLTMuOSwtNy43IC0zLjksLTcuNyBsIDEuMyw4Ni4zIGMgMC4xLDAuMiAtMi42LDI2LjUgNC4yLDI5LjciCiAgICAgICBpZD0icGF0aDE5IgogICAgICAgaW5rc2NhcGU6Y29ubmVjdG9yLWN1cnZhdHVyZT0iMCIKICAgICAgIHN0eWxlPSJmaWxsOiNmZmZmZmYiIC8+PHBhdGgKICAgICAgIGNsYXNzPSJzdDQiCiAgICAgICBkPSJtIDUxLjksMTIxLjUgYyAwLDAgMzEuMiwtMjAuNSAyMy45LC02My4yIC03LC0zMSAtMjMuNywtNDEuMiAtMjUuNSwtNDUuMSAtMiwtMi44IC0zLjksLTcuNyAtMy45LC03LjcgbCAxLjMsODYuMyBjIDAuMSwwLjIgLTIuNiwyNi41IDQuMiwyOS43IgogICAgICAgaWQ9InBhdGgyMSIKICAgICAgIGlua3NjYXBlOmNvbm5lY3Rvci1jdXJ2YXR1cmU9IjAiCiAgICAgICBzdHlsZT0iZmlsbDojNDk5ZDRhIiAvPjxwYXRoCiAgICAgICBjbGFzcz0ic3QyIgogICAgICAgZD0ibSA0NC42LDEyMi43IGMgMCwwIC0yOS4zLC0yMCAtMjcuNiwtNTUuMiBDIDE4LjcsMzIuMyAzOS4zLDE1IDQzLjMsMTEuOCA0Niw5IDQ2LjEsOCA0Ni4zLDUuMiBjIDEuOCwzLjkgMS41LDU4LjUgMS43LDY1IDAuOCwyNC43IC0xLjQsNDcuOCAtMy40LDUyLjUgbCAwLDAgMCwwIHoiCiAgICAgICBpZD0icGF0aDIzIgogICAgICAgaW5rc2NhcGU6Y29ubmVjdG9yLWN1cnZhdHVyZT0iMCIKICAgICAgIHN0eWxlPSJmaWxsOiNmZmZmZmYiIC8+PHBhdGgKICAgICAgIGNsYXNzPSJzdDUiCiAgICAgICBkPSJtIDQ0LjYsMTIyLjcgYyAwLDAgLTI5LjMsLTIwIC0yNy42LC01NS4yIEMgMTguNywzMi4zIDM5LjMsMTUgNDMuMywxMS44IDQ2LDkgNDYuMSw4IDQ2LjMsNS4yIGMgMS44LDMuOSAxLjUsNTguNSAxLjcsNjUgMC44LDI0LjcgLTEuNCw0Ny44IC0zLjQsNTIuNSBsIDAsMCAwLDAgeiIKICAgICAgIGlkPSJwYXRoMjUiCiAgICAgICBpbmtzY2FwZTpjb25uZWN0b3ItY3VydmF0dXJlPSIwIgogICAgICAgc3R5bGU9ImZpbGw6IzU4YWE1MCIgLz48L2c+PC9zdmc+',
		order: 15
	},
	
	details: null,
	
	getDetails: function(){
		return this.details;
	},
	
	$server: {
		$require: ['JSB.Workspace.WorkspaceController',
		           'JSB.Store.StoreManager',
		           'JSB.Crypt.MD5'],
		
		settings: null,
		
		$constructor: function(id, workspace, opts){
			$base(id, workspace);
			this.settings = this.property('settings');
			this.details = this.property('details');
			
			if(opts && opts.name){
				this.setName(opts.name);
			}
			if(opts && opts.url){
				this.updateSettings({url: opts.url});
			}
		},
		
		getSettings: function(){
			return this.settings;
		},
		
		updateSettings: function(settings){
			this.settings = JSB.merge({
				name: $this.getId(),
				type: 'JSB.Store.Mongodb.MongodbStore',
				url: '',
				dbName: '',
				useAuth: false,
				properties: {}
			}, settings);
			if(!this.settings.properties.db){
				this.settings.properties.db = this.settings.dbName;
			}
			this.property('settings', this.settings);
			this.getWorkspace().store();
			this.publish('DataCube.Model.MongoSource.updateSettings');
		},
		
		testConnection: function(settings){
			this.updateSettings(settings);
			
			// test connection
			var store = StoreManager.getStore(this.resolveSettings(this.settings));
			store.getConnection(true).close();
			return true;
		},
		
		getStore: function(){
			return StoreManager.getStore(this.resolveSettings(this.settings));
		},
		
		resolveSettings: function(settings){
			return JSB.merge({}, settings, {url: this.resolveEntryTemplate(settings.url)});
		},
		
		loadAffectedCubes: function(){
			// temp: load all cubes
			var it = this.getWorkspace().search(function(eDesc){
				var eJsb = JSB.get(eDesc.eType);
				if(!eJsb){
					return false;
				}
				return eJsb.isSubclassOf('DataCube.Model.Cube');
			});
			
			while(it.hasNext()){
				var e = it.next();
				e.load();
			}
			
			// TODO: load only affected cubes
			
		},
		
		fuxupAffectedCubes: function(){
			var it = this.getWorkspace().search(function(eDesc){
				var eJsb = JSB.get(eDesc.eType);
				if(!eJsb){
					return false;
				}
				return eJsb.isSubclassOf('DataCube.Model.Cube');

			});
			
			while(it.hasNext()){
				var e = it.next();
				e.load();
			}
		},
/*		
		clearCache: function(){
			this.loadAffectedCubes();
			$this.publish('DataCube.Model.SqlSource.clearCache');
		},
		
		updateCache: function(){
			this.loadAffectedCubes();
			$this.publish('DataCube.Model.SqlSource.updateCache');
		},
*/		
		extractScheme: function(){
			var mtx = 'DataCube.Model.MongoSource.extractScheme.' + this.getId();
			JSB.getLocker().lock(mtx);
			try {
				$this.publish('DataCube.Model.MongoSource.extractScheme', {status: 'Соединение с базой данных', success: true}, {session: true});
				var store = this.getStore();
				var lastPP = -1;
				$this.publish('DataCube.Model.MongoSource.extractScheme', {status: 'Получение списка коллекций', success: true}, {session: true});
				var schema = store.extractSchema(function(idx, total){
					var pp = Math.round(idx * 100 / total);
	            	if(pp > lastPP){
	            		$this.publish('DataCube.Model.MongoSource.extractScheme', {status: 'Обновление схемы ' + pp + '%', success: true}, {session: true});
	            		lastPP = pp;
	            	}
				}, this.settings.filter);
				$this.publish('DataCube.Model.MongoSource.extractScheme', {status: 'Сохранение схемы', success: true}, {session: true});
				
				// update entries
				var existedTables = JSB.clone(this.getChildren());
				for(var cName in schema.collections){
					var cDesc = schema.collections[cName];
					var tId = MD5.md5(this.getId() + '|' + cName);
					if(existedTables[tId]){
						// already exists
						existedTables[tId].updateDescriptor(cDesc);
						if(existedTables[tId].isMissing()){
							existedTables[tId].setMissing(false);
							existedTables[tId].doSync();
						}
						delete existedTables[tId];
						continue;
					}
					var tEntry = new MongoCollection(tId, this.getWorkspace(), cDesc, this);
					this.addChildEntry(tEntry);
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
					collections: 0,
					indexes: 0,
					items: 0
				};
				for(var cName in schema.collections){
					details.collections++;
					var cDesc = schema.collections[cName];
					details.indexes += Object.keys(cDesc.indexes).length;
					details.items += cDesc.count;
				}
				this.details = details;
				this.property('details', this.details);
				$this.publish('DataCube.Model.MongoSource.schemeUpdated');
			} finally {
				JSB.getLocker().unlock(mtx);
			}
			this.getWorkspace().store();
			
			return details;
		}
	}
}