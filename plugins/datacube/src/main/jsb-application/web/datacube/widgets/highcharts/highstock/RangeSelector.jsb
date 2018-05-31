{
	$name: 'DataCube.Widgets.RangeSelector',
	$parent: 'DataCube.Widgets.HighstockAxis',
	$expose: {
		name: 'Временной диапазон',
		description: '',
		category: 'Диаграммы',
		icon: `data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiIHN0YW5kYWxvbmU9Im5vIj8+DQo8c3ZnDQogICB4bWxuczpkYz0iaHR0cDovL3B1cmwub3JnL2RjL2VsZW1lbnRzLzEuMS8iDQogICB4bWxuczpjYz0iaHR0cDovL2NyZWF0aXZlY29tbW9ucy5vcmcvbnMjIg0KICAgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIg0KICAgeG1sbnM6c3ZnPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyINCiAgIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyINCiAgIHhtbG5zOnNvZGlwb2RpPSJodHRwOi8vc29kaXBvZGkuc291cmNlZm9yZ2UubmV0L0RURC9zb2RpcG9kaS0wLmR0ZCINCiAgIHhtbG5zOmlua3NjYXBlPSJodHRwOi8vd3d3Lmlua3NjYXBlLm9yZy9uYW1lc3BhY2VzL2lua3NjYXBlIg0KICAgaWQ9IkxheWVyXzEiDQogICB2ZXJzaW9uPSIxLjEiDQogICB2aWV3Qm94PSIwIDAgMjAgMjAiDQogICB4bWw6c3BhY2U9InByZXNlcnZlIg0KICAgaW5rc2NhcGU6dmVyc2lvbj0iMC45MSByMTM3MjUiDQogICBzb2RpcG9kaTpkb2NuYW1lPSJpZl8zM18yMTI4NDQ1LnN2ZyINCiAgIHdpZHRoPSIyMCINCiAgIGhlaWdodD0iMjAiPjxtZXRhZGF0YQ0KICAgICBpZD0ibWV0YWRhdGEzMSI+PHJkZjpSREY+PGNjOldvcmsNCiAgICAgICAgIHJkZjphYm91dD0iIj48ZGM6Zm9ybWF0PmltYWdlL3N2Zyt4bWw8L2RjOmZvcm1hdD48ZGM6dHlwZQ0KICAgICAgICAgICByZGY6cmVzb3VyY2U9Imh0dHA6Ly9wdXJsLm9yZy9kYy9kY21pdHlwZS9TdGlsbEltYWdlIiAvPjxkYzp0aXRsZT48L2RjOnRpdGxlPjwvY2M6V29yaz48L3JkZjpSREY+PC9tZXRhZGF0YT48ZGVmcw0KICAgICBpZD0iZGVmczI5IiAvPjxzb2RpcG9kaTpuYW1lZHZpZXcNCiAgICAgcGFnZWNvbG9yPSIjZmZmZmZmIg0KICAgICBib3JkZXJjb2xvcj0iIzY2NjY2NiINCiAgICAgYm9yZGVyb3BhY2l0eT0iMSINCiAgICAgb2JqZWN0dG9sZXJhbmNlPSIxMCINCiAgICAgZ3JpZHRvbGVyYW5jZT0iMTAiDQogICAgIGd1aWRldG9sZXJhbmNlPSIxMCINCiAgICAgaW5rc2NhcGU6cGFnZW9wYWNpdHk9IjAiDQogICAgIGlua3NjYXBlOnBhZ2VzaGFkb3c9IjIiDQogICAgIGlua3NjYXBlOndpbmRvdy13aWR0aD0iMTkyMCINCiAgICAgaW5rc2NhcGU6d2luZG93LWhlaWdodD0iMTE3OCINCiAgICAgaWQ9Im5hbWVkdmlldzI3Ig0KICAgICBzaG93Z3JpZD0iZmFsc2UiDQogICAgIGlua3NjYXBlOnpvb209IjI5LjUiDQogICAgIGlua3NjYXBlOmN4PSIxMS4yOTI2NjgiDQogICAgIGlua3NjYXBlOmN5PSI4LjAyMjEwNzIiDQogICAgIGlua3NjYXBlOndpbmRvdy14PSIxOTEyIg0KICAgICBpbmtzY2FwZTp3aW5kb3cteT0iLTgiDQogICAgIGlua3NjYXBlOndpbmRvdy1tYXhpbWl6ZWQ9IjEiDQogICAgIGlua3NjYXBlOmN1cnJlbnQtbGF5ZXI9IkxheWVyXzEiDQogICAgIHNob3dndWlkZXM9InRydWUiDQogICAgIGlua3NjYXBlOmd1aWRlLWJib3g9InRydWUiPjxzb2RpcG9kaTpndWlkZQ0KICAgICAgIHBvc2l0aW9uPSIxMiwxOC45NDkxNTMiDQogICAgICAgb3JpZW50YXRpb249IjAsMSINCiAgICAgICBpZD0iZ3VpZGU0MTg4IiAvPjxzb2RpcG9kaTpndWlkZQ0KICAgICAgIHBvc2l0aW9uPSIxNi40NzQ1NzYsMTQuOTgzMDUxIg0KICAgICAgIG9yaWVudGF0aW9uPSIwLDEiDQogICAgICAgaWQ9Imd1aWRlNDE5MCIgLz48c29kaXBvZGk6Z3VpZGUNCiAgICAgICBwb3NpdGlvbj0iMTUuNzI4ODE0LDE0Ig0KICAgICAgIG9yaWVudGF0aW9uPSIwLDEiDQogICAgICAgaWQ9Imd1aWRlNDE5MiIgLz48c29kaXBvZGk6Z3VpZGUNCiAgICAgICBwb3NpdGlvbj0iMTQuNzQ1NzYzLDEwIg0KICAgICAgIG9yaWVudGF0aW9uPSIwLDEiDQogICAgICAgaWQ9Imd1aWRlNDE5NCIgLz48c29kaXBvZGk6Z3VpZGUNCiAgICAgICBwb3NpdGlvbj0iMTUuNzI4ODE0LDguOTgzMDUwOSINCiAgICAgICBvcmllbnRhdGlvbj0iMCwxIg0KICAgICAgIGlkPSJndWlkZTQyMDYiIC8+PHNvZGlwb2RpOmd1aWRlDQogICAgICAgcG9zaXRpb249IjE2LjE2OTQ5Miw0Ljk4MzA1MDkiDQogICAgICAgb3JpZW50YXRpb249IjAsMSINCiAgICAgICBpZD0iZ3VpZGU0MjA4IiAvPjxzb2RpcG9kaTpndWlkZQ0KICAgICAgIHBvc2l0aW9uPSIxNy40NTc2MjcsNCINCiAgICAgICBvcmllbnRhdGlvbj0iMCwxIg0KICAgICAgIGlkPSJndWlkZTQyMTAiIC8+PC9zb2RpcG9kaTpuYW1lZHZpZXc+PHBhdGgNCiAgICAgZD0ibSAzLjE3MzE3NCwxLjA2MDU4MzYgLTMuMTgyOTY3MDcsMCAwLDMuOTUwMTQzNyAzLjE4Mjk2NzA3LDAgTCA0LjkxNTY0NDQsMy4wMzU2NTU0IDMuMTczMTc0LDEuMDYwNTgzNiBaIG0gLTAuOTM0NDg2NSwyLjU3OTAxOTQgLTAuMjM2NjgyMiwwIDAsLTAuOTc5Mzc0NSAtMC4yNDQ4NDM2LDAgMCwtMC4xODM2MzI3IDAuNDgxNTI1OCwtMC4wNDA4MDcgMCwxLjIwMzgxNDQgeiINCiAgICAgaWQ9InBhdGg3Ig0KICAgICBpbmtzY2FwZTpjb25uZWN0b3ItY3VydmF0dXJlPSIwIg0KICAgICBzdHlsZT0iZmlsbDojNTAyZDE2IiAvPjxwYXRoDQogICAgIGQ9Im0gOC4zMDY3Mjg2LDYuMDEwMTgyMSAtMy4xODI5NjcxLDAgMCwzLjk1MDE0MzggMy4xODI5NjcxLDAgTCAxMC4wNDkxOTksNy45ODUyNTQgOC4zMDY3Mjg2LDYuMDEwMTgyMSBaIG0gLTAuNTkxNzA1NSwyLjYwMzUwMzkgLTAuNzk1NzQxNywwIDAsLTAuMTU1MDY3NyAwLjM2NzI2NTQsLTAuNDE2MjM0MSBjIDAuMDUzMDUsLTAuMDY1MjkyIDAuMDkzODU3LC0wLjExODM0MTEgMC4xMTgzNDExLC0wLjE2MzIyOTEgMC4wMjQ0ODQsLTAuMDQ0ODg4IDAuMDMyNjQ2LC0wLjA4NTY5NSAwLjAzMjY0NiwtMC4xMjI0MjE4IDAsLTAuMDQ4OTY5IC0wLjAxMjI0MiwtMC4wODk3NzYgLTAuMDM2NzI3LC0wLjExODM0MTEgLTAuMDI0NDg0LC0wLjAyODU2NSAtMC4wNjEyMTEsLTAuMDQ0ODg4IC0wLjExMDE3OTcsLTAuMDQ0ODg4IC0wLjA1MzA0OSwwIC0wLjA4OTc3NiwwLjAyMDQwNCAtMC4xMTgzNDEsMC4wNTcxMyAtMC4wMjg1NjUsMC4wMzY3MjYgLTAuMDQwODA3LDAuMDg1Njk1IC0wLjA0MDgwNywwLjE0MjgyNTQgbCAtMC4yMzI2MDE1LDAgMCwtMC4wMDQwOCBDIDYuODk0Nzk3Nyw3LjY4MzI4MDcgNi45MzE1MjM3LDcuNTkzNTA0NyA3LjAwNDk3NjYsNy41MjAwNTE2IDcuMDc4NDI5Niw3LjQ0NjU5ODYgNy4xNzIyODY1LDcuNDA5ODcyIDcuMjk0NzA4Myw3LjQwOTg3MiBjIDAuMTIyNDIxOCwwIDAuMjE2Mjc4NSwwLjAzMjY0NiAwLjI4NTY1MDksMC4wOTM4NTcgMC4wNjkzNzIsMC4wNjEyMTEgMC4xMDIwMTgxLDAuMTQ2OTA2MiAwLjEwMjAxODEsMC4yNDg5MjQ0IDAsMC4wNjkzNzIgLTAuMDIwNDA0LDAuMTM0NjY0IC0wLjA1NzEzLDAuMTk1ODc0OSAtMC4wMzY3MjcsMC4wNTcxMyAtMC4xMDIwMTgxLDAuMTM4NzQ0NyAtMC4xOTU4NzQ4LDAuMjQ0ODQzNiBsIC0wLjE5NTg3NDksMC4yMzY2ODIxIDAsMC4wMDQwOCAwLjQ4NTYwNjUsMCAwLDAuMTc5NTUyIHoiDQogICAgIGlkPSJwYXRoOSINCiAgICAgaW5rc2NhcGU6Y29ubmVjdG9yLWN1cnZhdHVyZT0iMCINCiAgICAgc3R5bGU9ImZpbGw6IzE2NTA0NCIgLz48cGF0aA0KICAgICBkPSJtIDMuMTczMTc0LDExLjAyNzU3NSAtMy4xODI5NjcwNywwIDAsMy45NTAxNDQgMy4xODI5NjcwNywwIDEuNzQyNDcwNCwtMS45NzUwNzIgLTEuNzQyNDcwNCwtMS45NzUwNzIgeiBtIC0xLjI0ODcwMjUsMi41ODcxODEgYyAtMC4wNzc1MzQsMC4wNjEyMSAtMC4xNzU0NzEyLDAuMDkzODYgLTAuMjk3ODkzLDAuMDkzODYgLTAuMTA2MDk4OSwwIC0wLjE5OTk1NTcsLTAuMDI4NTcgLTAuMjgxNTcwMiwtMC4wODU3IC0wLjA4MTYxNCwtMC4wNTcxMyAtMC4xMTgzNDExLC0wLjEzODc0NCAtMC4xMTQyNjA0LC0wLjI0NDg0MyBsIDAsLTAuMDA0MSAwLjIyODUyMDgsMCBjIDAsMC4wNDQ4OSAwLjAxNjMyMywwLjA4MTYxIDAuMDQ0ODg4LDAuMTEwMTggMC4wMzI2NDYsMC4wMjg1NyAwLjA2OTM3MiwwLjA0NDg5IDAuMTE4MzQxMSwwLjA0NDg5IDAuMDUzMDQ5LDAgMC4wOTc5MzgsLTAuMDE2MzIgMC4xMzA1ODMzLC0wLjA0ODk3IDAuMDMyNjQ2LC0wLjAzMjY1IDAuMDQ4OTY5LC0wLjA3MzQ1IDAuMDQ4OTY5LC0wLjExODM0MSAwLC0wLjA2MTIxIC0wLjAxNjMyMywtMC4xMDYwOTkgLTAuMDQ0ODg4LC0wLjEzODc0NSAtMC4wMzI2NDYsLTAuMDI4NTcgLTAuMDc3NTM0LC0wLjA0NDg5IC0wLjEzNDY2NCwtMC4wNDQ4OSBsIC0wLjEzMDU4MzIsMCAwLC0wLjE3NTQ3MSAwLjEzMDU4MzIsMCBjIDAuMDU3MTMsMCAwLjA5NzkzOCwtMC4wMTYzMiAwLjEyMjQyMTgsLTAuMDQ0ODkgMC4wMjg1NjUsLTAuMDI4NTYgMC4wNDA4MDcsLTAuMDY5MzcgMC4wNDA4MDcsLTAuMTIyNDIyIDAsLTAuMDQ0ODkgLTAuMDEyMjQyLC0wLjA4MTYxIC0wLjA0MDgwNywtMC4xMTAxOCAtMC4wMjg1NjUsLTAuMDI4NTcgLTAuMDY5MzcyLC0wLjA0NDg5IC0wLjExODM0MSwtMC4wNDQ4OSAtMC4wNDQ4ODgsMCAtMC4wNzc1MzQsMC4wMTIyNCAtMC4xMDYwOTg5LDAuMDQwODEgLTAuMDI4NTY1LDAuMDI0NDggLTAuMDQ0ODg4LDAuMDYxMjEgLTAuMDQ0ODg4LDAuMTAyMDE4IGwgLTAuMjI4NTIwOCwwIDAsLTAuMDA0MSBjIC0wLjAwNDA4LC0wLjA4OTc4IDAuMDMyNjQ2LC0wLjE2NzMxIDAuMTA2MDk4OSwtMC4yMjg1MjEgMC4wNzM0NTMsLTAuMDYxMjEgMC4xNjMyMjkxLC0wLjA4OTc4IDAuMjczNDA4OCwtMC4wODk3OCAwLjEyMjQyMTgsMCAwLjIxNjI3ODUsMC4wMjg1NyAwLjI4OTczMTYsMC4wODU3IDAuMDY5MzcyLDAuMDU3MTMgMC4xMDYwOTg5LDAuMTM4NzQ0IDAuMTA2MDk4OSwwLjI0NDg0MyAwLDAuMDUzMDUgLTAuMDE2MzIzLDAuMTAyMDE4IC0wLjA0NDg4OCwwLjE0NjkwNiAtMC4wMzI2NDYsMC4wNDQ4OSAtMC4wNzM0NTMsMC4wODE2MiAtMC4xMjY1MDI2LDAuMTA2MDk5IDAuMDYxMjExLDAuMDI0NDkgMC4xMTAxNzk3LDAuMDU3MTMgMC4xNDI4MjU1LDAuMTA2MDk5IDAuMDMyNjQ2LDAuMDQ0ODkgMC4wNDg5NjksMC4xMDIwMTggMC4wNDg5NjksMC4xNzEzOTEgLTAuMDA0MDgsMC4xMDYwOTkgLTAuMDQwODA3LDAuMTkxNzk0IC0wLjExODM0MTEsMC4yNTMwMDUgeiINCiAgICAgaWQ9InBhdGgxMSINCiAgICAgaW5rc2NhcGU6Y29ubmVjdG9yLWN1cnZhdHVyZT0iMCINCiAgICAgc3R5bGU9ImZpbGw6IzE2NDQ1MCIgLz48Zw0KICAgICBpZD0iZzEzIg0KICAgICBzdHlsZT0iZmlsbDojNDg0NTM3Ig0KICAgICB0cmFuc2Zvcm09Im1hdHJpeCgwLjA0MDgwNzI3LDAsMCwwLjA0MDgwNzI3LC0wLjQ1ODY3MzA0LDAuMjY3NjI5NTQpIj48cG9seWdvbg0KICAgICAgIHBvaW50cz0iMTkwLjUsNDI5LjcgMTg5LjksNDMxLjEgMTgzLjcsNDQwLjUgMTkwLjYsNDQwLjUgMTkwLjYsNDI5LjggIg0KICAgICAgIGlkPSJwb2x5Z29uMTUiDQogICAgICAgc3R5bGU9ImZpbGw6IzQ4NDUzNyIgLz48cGF0aA0KICAgICAgIGQ9Im0gMjE0LjgsMzg1LjcgLTc4LDAgMCw5Ni44IDc4LDAgNDIuNywtNDguNCAtNDIuNywtNDguNCB6IG0gLTE0LjksNTkuNCAtMy4zLDAgMCw2LjQgLTUuOSwwIDAsLTYuNCAtMTIsMCAtMC4zLC0zLjUgMTIuMiwtMTkuNiA2LDAgMCwxOC41IDMuMywwIDAsNC42IHoiDQogICAgICAgaWQ9InBhdGgxNyINCiAgICAgICBpbmtzY2FwZTpjb25uZWN0b3ItY3VydmF0dXJlPSIwIg0KICAgICAgIHN0eWxlPSJmaWxsOiM0ODQ1MzciIC8+PC9nPjxwb2x5Z29uDQogICAgIGlkPSJwb2x5Z29uMTkiDQogICAgIHBvaW50cz0iMzc1LjIsMTI2LjMgMzc1LjIsMjkuNCAxMDIuNCwyOS40IDE0NS4xLDc3LjggMTAyLjQsMTI2LjMgIg0KICAgICBzdHlsZT0iZmlsbDojYTA1YTJjIg0KICAgICB0cmFuc2Zvcm09Im1hdHJpeCgwLjA0MDgwNzI3LDAsMCwwLjA0MDgwNzI3LC0wLjQ1ODY3MzA0LC0wLjEzOTE1MDE4KSIgLz48cG9seWdvbg0KICAgICBpZD0icG9seWdvbjIxIg0KICAgICBwb2ludHM9IjUwMSwyNDUgNTAxLDE0OC4yIDIyOC4xLDE0OC4yIDI3MC45LDE5Ni42IDIyOC4xLDI0NSAiDQogICAgIHN0eWxlPSJmaWxsOiMyMTc4NjciDQogICAgIHRyYW5zZm9ybT0ibWF0cml4KDAuMDQwODA3MjcsMCwwLDAuMDQwODA3MjcsLTAuNDU4NjczMDQsLTAuMDM3NDU1MjUpIiAvPjxwb2x5Z29uDQogICAgIGlkPSJwb2x5Z29uMjMiDQogICAgIHBvaW50cz0iMTQ1LjEsMzE1LjQgMTAyLjQsMzYzLjggMzc1LjIsMzYzLjggMzc1LjIsMjY3IDEwMi40LDI2NyAiDQogICAgIHN0eWxlPSJmaWxsOiMyMTY3NzgiDQogICAgIHRyYW5zZm9ybT0ibWF0cml4KDAuMDQwODA3MjcsMCwwLDAuMDQwODA3MjcsLTAuNDU4NjczMDQsMC4xMzIwMzYzKSIgLz48cG9seWdvbg0KICAgICBpZD0icG9seWdvbjI1Ig0KICAgICBwb2ludHM9IjIyOC4xLDQ4Mi42IDUwMSw0ODIuNiA1MDEsMzg1LjcgMjI4LjEsMzg1LjcgMjcwLjksNDM0LjIgIg0KICAgICBzdHlsZT0iZmlsbDojNmM2NzUzIg0KICAgICB0cmFuc2Zvcm09Im1hdHJpeCgwLjA0MDgwNzI3LDAsMCwwLjA0MDgwNzI3LC0wLjQ1ODY3MzA0LDAuMjY3NjI5NTQpIiAvPjwvc3ZnPg==`,
		thumb: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGQAAABACAYAAADs39J0AAAABGdBTUEAALGPC/xhBQAAAAlwSFlzAAAOwgAADsIBFShKgAAACcJJREFUeF7tXPlz28YZ1d+e/tJ2mnTSJE2PND1+6LQZp5nWsRsn1n1SokRSlMRbPMWbIAkQF0np9Xsr0pZt6LJoC3LxZr4BsPvtfsfbXSwASnPj8RiB+Efm8EBg6F0Mx2fQNA2m0UepciJluqprNWrQBxbO1NU5DMM4P+oGTkcubHeIs7NTDIyBKvcrHgwhy8+fYDO8j6+//Axrq+tYDoURDYdV3c7GGuYXnmFvP45IJIbd3V0sL8yjUKmhUytgYXkdsXgc8WgEPzz+D2KHaeyFt7G2uIiV1TWsbIRUP37AgyGkUCggHtlBvaVhbWkFzimwt70F2xmiXi1gZ3cHR6kUDg+TODo8QDKZQDZXlJZnCG3v4DiXQSqZxF5oS4iNSX95ZOU6GouidFI7N+IDPBhC/l8QEOIzBIT4DAEhPkNAiM8QEOIzBIT4DAEhPkNAiM8wNxqNEIh/JJghPkNAiM8QEOIzBIT4DAEhPkNAiM8QEOIzBIT4DAEhgsWMBYPfhH2AgBDBb9d6aA3Gk6v3j9MLP5cJXp2IfLHaRb3neta9D/l4UUPPPLcfzBDBfc+QTxa7GLjnS2ZAiCAgxGcICPEZHjwhffsUo4tbgweO+yJkOWsh1x5eTchofHatc3/a7KPSG02uHi5OJIZU0703Qr7bNxCvuoqQttjfytuYI0tT1PQxyt0Rfrfem5R4ww+EcILao7vN0nDJwZPDgS8IYT5/s9zF3K+XukjUXWRbQ3wliY5UHN8R4sqsLWqv2uP1X0L9ydXtQCIZp28JmU+ZWD+2b03IZbcRRwLmfWZWYLKYtIuYErIiM3w193KWX4Yz8ZVCdMwxPl/p3oiQP2xcnYu3gfo7F/PUm5BP5Cnxp4SB1ayJP4rxcNHEl2vdF0+R1f4IzvDVJ8uvRK/YcfDRs84r5VOJVSw8iuiedddJtevgeWoAyxnCndjlUzSfpg9rttg9f6I9bjn481YPC6K7mB6oxA3s4St9XRTqUNfkny/0HHy2rGG7YOJxXFd9V8UGk2LYI7SMl+0++sE7xrsIc8ccfhvVES1b6kmdZZ8uaZfPkCNZxjiCyFpD7i3P0y9H4XSGkBAvHNRcfBsz1M5hLBPlNrOl0Bnir9t9fBMx1FJKTGcIRzN9WpJZQf84Q5Yyltqt/HJegz28/J5CHeqyDWN8fYYwnl8815RN2t4q2OiIXRKSbg6xKdezAm0xh7dasujQj0lTKVH5Y2nEAFjvRQj1S7Ih4HFKyNdbfbVJYFCcpr0bEHMTQj6XEU0/3iUh9IG+0PfdsoPvRY+7Ms0aq/OboiNLEwfPRcyMkAWZJVyvLxLCZNHRf+zpqu2vFjRPQvIS3N92ZBmTGw/vPUzQ+LWbEG/edyGkpo/w911dbWXpX6oxVPczYhaEPIoaqu3PRY8+7Z84ars6teGFlMwu5uYiaOudERISvR8S5o0J+afoJRuuCop6TMgU1LsLIfTpi9Uenh4NsFOy1XnTGKMkG4BZE8IYGAtjYmwDj+8pv5c8RoU05oarB5d+9klbviSE+gxyCi9CPhX/aOttCWEZ6941IdTThRQmeArmgvrMDXPEXP1MckZbvibkiSRwT869CGGSaOshEMJYGXOoeH4/fbCEMFgG/aEQwtiZg4AQ0QsICQgJCPmgCUnXHVS7Luq9IXJNB83+EIkTCw25PtFcsL5nyp5+olfruUqPZUdVW+lVRK/QPm+bqtuoyXWp7eKYeoNzva4c8y1H6XWMIZI1W+kXRa8s+jyf6vG1SFb6aevnerSVbTjKDvUycs4j+1c+iUz1WJdvil8TPZaxjjrUZZuLfbBP9j3Vo036lK5Zyhf6RD36yHKeU48xMBbGNNVjrOyfsbOfg7Kl9KlHO8xVgnpiizksdVy0RI+5ZRlz7fmBynHv9ubzru2Ju/Rx3/aneJs+XhAyHjlYWdtU59FoFMeZJPLFirq+KfL5PKKhTRjOCOVSAalUBrFY7JX/0nMdRq6FTDavXs1GozFEI5FJzfWg/VQirv4fSrVSRjaVQrZQntTeDAcHccQjIfQtiaGYQzKdQ7lyMqm9HsfiQzmbRE/aNyoFrIfCKOWzSGQKE42r8coMsW0bjm1JMstotlowretfa18E22vtFixbpme9jnq9gW63O6m9GYaOhY7WhWkOUJFENFveLzC9QPsDvQ/dMNFoNNBs1DGwbvdSsNPpQBNx3aHEUFMx2LYzqb0e9KHf1VQOHMeB3u+i1azjKJWdaFyNt/qmHuDdISDEZwgI8RnmuOZxzX0bMQamWjO9xJL7j1f5u5T7sEmZpV01Q5LHLcTSnVtL8URTrHqBnyqJ4Wh239avw9Tm+8Ys7c4NBgPEDnOeCb9K9hINpLJF2U2c72J2Ey11nGLq5Hqsro7vAx8EIS3Z3u6E97AaqXkm/jLZihaQy+WwvptDPNvBfzdKcIdjHMj56emZcnI0PsXKXnVi6u4Yj69+ormYGPrwvjBTQhLZMvbjB/j3UgHz2yd4slbC9kHzReIjyfYLsp5tlBFJtfFss4wnS0mUy2WEYnn8FKrgu8U8DnMaloWAUt1AutjF0/US9pItHB1rKkHV5kDVncpDn2ENVV89w0W9ffnzDtsTKemPfkxRbZmTs5eYJqbds5EsXP78cx2xt8WsCOGvRue03gDbsZwEW8dzIWRjvyHJLeCpEPN4pYh/LTDhJ/hxs4LvV0syE8rqelP0ood5SaiNTt9BW2Q1WkPfHEpdHdmyhrQ8ce/EUkjlyupY7Vgo1oSsUk/IaGFgjxBNt5GQ5LFsP9NRsy1X0RWJvKZsH8oAybRVknOVvqoPHTSQr+pCVA+Hosv28YzM9v08NvZS4lsW0UQR8UROkVdrm8p2VAYB21ZkcLDt8Ykuy+5IkWiI730ZICTMlLJ9sclBlhedVtdW9nhPdIenqEssLGtqFrS+hf2jPNZ29pGQWBPJY9Uv++NAZH8xiYM22NZ2x3BkNeFvCjo9R/kWliWfsc8xKfvphgTdulJCHmXpQlsl9XXpDVx0+wYqtTZKJw20uzpqjTZ0603dy0SXGcRZ5FU3ldfru7qFWrONelNDq9NFo9NHWXzQdFcNGg6W/uC8TVcSb4g/tJOT5GXKotsYKPKYzJKcsw112KYpye/ojtLNyqAoCLksq0oyS3W5LjfU/wkuVTuoVNtSZ6nVgP1ysDSEOOqzHYmljUy5h6LosG5K8JyuG4gfHCK8u/eGrG9sYX5hybOOkkimwPbeonuUvWu5D5uU2dkVQnTE43GEw+E3ZH5+Ho8ePfKsoyQSCemEzgQyK5lzXRfcadXVy8DbCV/EsX0gs5Pg1YnPMGeaJgLxi5j4H8LGs7paWCGzAAAAAElFTkSuQmCC'
	},
	$scheme: {
        series: {
            items: {
                seriesItem: {
                    items: {
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
                                approximation: {
                                    render: 'select',
                                    name: 'Аппроксимация',
                                    items: {
                                        none: {
                                            name: 'По умолчанию'
                                        },
                                        average: {
                                            name: 'average'
                                        },
                                        averages: {
                                            name: 'averages'
                                        },
                                        open: {
                                            name: 'open'
                                        },
                                        high: {
                                            name: 'high'
                                        },
                                        low: {
                                            name: 'low'
                                        },
                                        close: {
                                            name: 'close'
                                        },
                                        sum: {
                                            name: 'sum'
                                        }
                                    }
                                },
                                forced: {
                                    render: 'item',
                                    name: 'Принудительно',
                                    optional: 'checked',
                                    editor: 'none'
                                },
                                groupAll: {
                                    render: 'item',
                                    name: 'Группировать все',
                                    optional: true,
                                    editor: 'none'
                                },
                                smoothed: {
                                    render: 'item',
                                    name: 'Сгладить границы',
                                    optional: true,
                                    editor: 'none'
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
                                        month: {
                                            name: 'Месяц'
                                        },
                                        year: {
                                            name: 'Год'
                                        }
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

	    refresh: function(opts){
            if(!$base(opts)){
                return;
            }

            if(!this._schemeOpts){
                this._schemeOpts = {
                    dateContext: this.getContext().find('xAxis xAxisDate'),
                    seriesContext: this.getContext().find('series').values(),
                    seriesTypes: []
                };
            }

            if(!this._resolveFilters(this._schemeOpts.dateContext.binding())){
                return;
            }

            this.getElement().loader();

            var seriesData = [];

            try {
                function fetch(isReset){
                    $this.fetchBinding($this._dataSource, { fetchSize: 100, reset: isReset }, function(res){
                        if(res.length === 0){
                            resultProcessing();
                            return;
                        }

                        while($this._dataSource.next()){
                            // series data
                            for(var i = 0; i < $this._schemeOpts.seriesContext.length; i++){
                                if(!seriesData[i]){
                                    seriesData[i] = [];
                                }

                                var x = $this._schemeOpts.dateContext.value();

                                if(!$this._schemeOpts.seriesTypes[i]){
                                    var type = 'number';

                                    if(JSB.isDate(x)){
                                        type = 'date';
                                    }

                                    $this._schemeOpts.seriesTypes[i] = type;
                                }

                                if($this._schemeOpts.seriesTypes[i] === 'date'){
                                    x = x.getTime();
                                }

                                seriesData[i].push({
                                    x: x,
                                    y: $this._schemeOpts.seriesContext[i].find('data').value()
                                });
                            }
                        }

                        fetch();
                    });
                }

                function resultProcessing(){
                    for(var i = 0; i < seriesData.length; i++){
                        seriesData[i].sort(function(a, b){
                            return a.x < b.x ? -1 : 1;
                        });
                    }

                    if(opts && opts.isCacheMod){
                        $this.storeCache({
                            data: seriesData
                        });
                    }

                    $this.buildChart({
                        data: seriesData
                    });

                    $this.getElement().loader('hide');
                }

                fetch(true);
            } catch(ex){
                console.log('RangeSelectorChart load data exception');
                console.log(ex);
                $this.getElement().loader('hide');
            }
	    },

	    _buildChart: function(data){
	        var baseChartOpts;

	        try{
                function includeData(chartOpts, seriesData){
                    chartOpts = JSB.clone(chartOpts);

                    var seriesContext = $this.getContext().find('series').values();

                    for(var j = 0; j < seriesData.length; j++){
                        //var yAxis = chartOpts.yAxisNames.indexOf(seriesContext[seriesData[j].index].find('yAxis').value());

                        var series = {
                            data: seriesData[j],
                            datacube: {
                                binding: $this._schemeOpts.dateContext.binding(),
                                filterData: $this._addFilterData(),
                                valueType: $this._schemeOpts.seriesTypes[j]
                            },
                            type: seriesContext[j].find('type').value(),
                            color: seriesContext[j].find('color').value(),
                            stack: seriesContext[j].find('stack').value(),
                            step: $this.isNone(seriesContext[j].find('step').value()),
                            //yAxis: yAxis > -1 ? yAxis : undefined
                        };

                        JSB.merge(true, chartOpts.series[j], series);
                    }

                    return chartOpts;
                }

                if(this._styles){
                    baseChartOpts = includeData(this._styles, data.data);
                } else {
                    baseChartOpts = $base();
                    var dataGroupingPlotOptionsContext = this.getContext().find('plotOptions series dataGrouping'),
                        dataGrouping;

                    if(dataGroupingPlotOptionsContext.checked()){
                        var units = dataGroupingPlotOptionsContext.find('groupUnits').value();

                        dataGrouping = {
                            approximation: $this.isNone(dataGroupingPlotOptionsContext.find('approximation').value()),
                            forced: dataGroupingPlotOptionsContext.find('forced').checked(),
                            groupAll: dataGroupingPlotOptionsContext.find('groupAll').checked(),
                            smoothed: dataGroupingPlotOptionsContext.find('smoothed').checked(),
                            units: [[dataGroupingPlotOptionsContext.find('groupBy').value(), units ? units.split(',') : 1]]
                        }
                    }

                    var chartOpts = {
                        plotOptions: {
                            series: {
                                dataGrouping: dataGrouping
                            }
                        }
                    }

                    JSB.merge(true, baseChartOpts, chartOpts);

                    this._styles = baseChartOpts;

                    baseChartOpts = includeData(baseChartOpts, data.data, data.xAxisData);
                }
	        } catch(ex){
                console.log('RangeSelectorChart build chart exception');
                console.log(ex);
	        } finally{
	            return baseChartOpts;
	        }
	    }
	}
}