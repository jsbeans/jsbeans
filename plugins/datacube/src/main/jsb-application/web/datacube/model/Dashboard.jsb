{
	$name: 'DataCube.Model.Dashboard',
	$parent: 'JSB.Workspace.Entry',
	
	getWidgetCount: function(){
		return this.widgetCount;
	},
	
	widgetCount: 0,
	lastUpdated: null,
	
	$client: {
		enumWidgets: function(callback){
			$this.server().getWrappers(callback);
		}
	},
	
	$server: {
		layout: null,
		wrappers: {},
		
		$require: ['JSB.Workspace.WorkspaceController',
		           'DataCube.Model.Widget'],
		
		loaded: false,
		
		$bootstrap: function(){
			WorkspaceController.registerExplorerNode(null, this, {
				priority: 0.5, 
				nodeType:'DataCube.DashboardNode',
				create: true,
				move: true,
				remove: true,
				title: 'Визуализация',
				description: 'Позволяет связать несколько виджетов в интерактивный слайд с возможностью публикации на сторонних сайтах',
				icon: 'data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiIHN0YW5kYWxvbmU9Im5vIj8+DQo8IS0tIFN2ZyBWZWN0b3IgSWNvbnMgOiBodHRwOi8vd3d3Lm9ubGluZXdlYmZvbnRzLmNvbS9pY29uIC0tPg0KDQo8c3ZnDQogICB4bWxuczpkYz0iaHR0cDovL3B1cmwub3JnL2RjL2VsZW1lbnRzLzEuMS8iDQogICB4bWxuczpjYz0iaHR0cDovL2NyZWF0aXZlY29tbW9ucy5vcmcvbnMjIg0KICAgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIg0KICAgeG1sbnM6c3ZnPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyINCiAgIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyINCiAgIHhtbG5zOnNvZGlwb2RpPSJodHRwOi8vc29kaXBvZGkuc291cmNlZm9yZ2UubmV0L0RURC9zb2RpcG9kaS0wLmR0ZCINCiAgIHhtbG5zOmlua3NjYXBlPSJodHRwOi8vd3d3Lmlua3NjYXBlLm9yZy9uYW1lc3BhY2VzL2lua3NjYXBlIg0KICAgdmVyc2lvbj0iMS4xIg0KICAgeD0iMHB4Ig0KICAgeT0iMHB4Ig0KICAgdmlld0JveD0iMCAwIDIwIDIwIg0KICAgZW5hYmxlLWJhY2tncm91bmQ9Im5ldyAwIDAgMTAwMCAxMDAwIg0KICAgeG1sOnNwYWNlPSJwcmVzZXJ2ZSINCiAgIGlkPSJzdmcyIg0KICAgaW5rc2NhcGU6dmVyc2lvbj0iMC45MSByMTM3MjUiDQogICBzb2RpcG9kaTpkb2NuYW1lPSJkYXNoYm9hcmQuc3ZnIg0KICAgd2lkdGg9IjIwIg0KICAgaGVpZ2h0PSIyMCI+PGRlZnMNCiAgICAgaWQ9ImRlZnMxMiIgLz48c29kaXBvZGk6bmFtZWR2aWV3DQogICAgIHBhZ2Vjb2xvcj0iI2ZmZmZmZiINCiAgICAgYm9yZGVyY29sb3I9IiM2NjY2NjYiDQogICAgIGJvcmRlcm9wYWNpdHk9IjEiDQogICAgIG9iamVjdHRvbGVyYW5jZT0iMTAiDQogICAgIGdyaWR0b2xlcmFuY2U9IjEwIg0KICAgICBndWlkZXRvbGVyYW5jZT0iMTAiDQogICAgIGlua3NjYXBlOnBhZ2VvcGFjaXR5PSIwIg0KICAgICBpbmtzY2FwZTpwYWdlc2hhZG93PSIyIg0KICAgICBpbmtzY2FwZTp3aW5kb3ctd2lkdGg9IjE5MjAiDQogICAgIGlua3NjYXBlOndpbmRvdy1oZWlnaHQ9IjExMzgiDQogICAgIGlkPSJuYW1lZHZpZXcxMCINCiAgICAgc2hvd2dyaWQ9ImZhbHNlIg0KICAgICBpbmtzY2FwZTp6b29tPSIxMS4zMTM3MDkiDQogICAgIGlua3NjYXBlOmN4PSItMTQuNTIyMzYiDQogICAgIGlua3NjYXBlOmN5PSIxNi4wMzM1NzMiDQogICAgIGlua3NjYXBlOndpbmRvdy14PSItOCINCiAgICAgaW5rc2NhcGU6d2luZG93LXk9Ii04Ig0KICAgICBpbmtzY2FwZTp3aW5kb3ctbWF4aW1pemVkPSIxIg0KICAgICBpbmtzY2FwZTpjdXJyZW50LWxheWVyPSJzdmcyIg0KICAgICBzaG93Z3VpZGVzPSJ0cnVlIg0KICAgICBpbmtzY2FwZTpndWlkZS1iYm94PSJ0cnVlIj48c29kaXBvZGk6Z3VpZGUNCiAgICAgICBwb3NpdGlvbj0iMC45OTMxMTQ0MSwxNC40NjYzNjciDQogICAgICAgb3JpZW50YXRpb249IjEsMCINCiAgICAgICBpZD0iZ3VpZGU0MjU2IiAvPjxzb2RpcG9kaTpndWlkZQ0KICAgICAgIHBvc2l0aW9uPSI2LjkxODY5NywyMC42MDcxMjQiDQogICAgICAgb3JpZW50YXRpb249IjAsMSINCiAgICAgICBpZD0iZ3VpZGU0MjU4IiAvPjxzb2RpcG9kaTpndWlkZQ0KICAgICAgIHBvc2l0aW9uPSIyLjAwMTM3ODEsMTguMDAwNjk5Ig0KICAgICAgIG9yaWVudGF0aW9uPSIwLDEiDQogICAgICAgaWQ9Imd1aWRlNDI2MCIgLz48c29kaXBvZGk6Z3VpZGUNCiAgICAgICBwb3NpdGlvbj0iMS41NTY2Mjc0LDE2Ljk5NDE1OCINCiAgICAgICBvcmllbnRhdGlvbj0iMCwxIg0KICAgICAgIGlkPSJndWlkZTQyNjIiIC8+PHNvZGlwb2RpOmd1aWRlDQogICAgICAgcG9zaXRpb249IjIwLjAwMjA3NywxNy4xNDYzMSINCiAgICAgICBvcmllbnRhdGlvbj0iMSwwIg0KICAgICAgIGlkPSJndWlkZTQyNjQiIC8+PHNvZGlwb2RpOmd1aWRlDQogICAgICAgcG9zaXRpb249IjE4Ljk5NTUzNiwxNC44MTcyMiINCiAgICAgICBvcmllbnRhdGlvbj0iMSwwIg0KICAgICAgIGlkPSJndWlkZTQyNjYiIC8+PHNvZGlwb2RpOmd1aWRlDQogICAgICAgcG9zaXRpb249Ii0wLjUyOTY2MTAyLDMuOTg5MDA5NSINCiAgICAgICBvcmllbnRhdGlvbj0iMCwxIg0KICAgICAgIGlkPSJndWlkZTQyNjgiIC8+PHNvZGlwb2RpOmd1aWRlDQogICAgICAgcG9zaXRpb249IjQuOTg1ODg5Myw0Ljk4NTg4OTMiDQogICAgICAgb3JpZW50YXRpb249IjAsMSINCiAgICAgICBpZD0iZ3VpZGU0MjcwIiAvPjwvc29kaXBvZGk6bmFtZWR2aWV3PjxtZXRhZGF0YQ0KICAgICBpZD0ibWV0YWRhdGE0Ij4gU3ZnIFZlY3RvciBJY29ucyA6IGh0dHA6Ly93d3cub25saW5ld2ViZm9udHMuY29tL2ljb24gPHJkZjpSREY+PGNjOldvcmsNCiAgICAgcmRmOmFib3V0PSIiPjxkYzpmb3JtYXQ+aW1hZ2Uvc3ZnK3htbDwvZGM6Zm9ybWF0PjxkYzp0eXBlDQogICAgICAgcmRmOnJlc291cmNlPSJodHRwOi8vcHVybC5vcmcvZGMvZGNtaXR5cGUvU3RpbGxJbWFnZSIgLz48ZGM6dGl0bGUgLz48L2NjOldvcms+PC9yZGY6UkRGPjwvbWV0YWRhdGE+PHJlY3QNCiAgICAgc3R5bGU9ImZpbGw6I2ZmZmZmZjtmaWxsLW9wYWNpdHk6MTtzdHJva2U6bm9uZTtzdHJva2Utd2lkdGg6MTtzdHJva2UtbGluZWNhcDpyb3VuZDtzdHJva2UtbGluZWpvaW46cm91bmQ7c3Ryb2tlLW1pdGVybGltaXQ6NDtzdHJva2UtZGFzaGFycmF5Om5vbmU7c3Ryb2tlLW9wYWNpdHk6MSINCiAgICAgaWQ9InJlY3Q0MTQwIg0KICAgICB3aWR0aD0iMTguODY5MTczIg0KICAgICBoZWlnaHQ9IjExLjQ4NzAyMyINCiAgICAgeD0iMC40OTY1NTcyMSINCiAgICAgeT0iMi44ODI2MzExIiAvPjxwYXRoDQogICAgIGlua3NjYXBlOmNvbm5lY3Rvci1jdXJ2YXR1cmU9IjAiDQogICAgIGlkPSJwYXRoOCINCiAgICAgZD0ibSAxOS4xNzM2MDMsMTYuMDI3NTM4IGMgLTIuMzE0MDIyLC0wLjAxMDE5IC00LjYzMDA4MywtMC4wMDYxIC02Ljk0NDEwNSwtMC4wMDYxIGwgLTAuMzY2OTgyLDAgYyAwLjAwNzgsMC4yNDc1MDkgMC4wMzQwNiwwLjQwOTY0IDAuMDkzNzgsMC42NzE5MDQgMC4wMjQ0NywwLjU4MzA5MyAwLjI5NzY2MywwLjk5MDg1IDAuODA1MzIxLDEuMjYyMDA4IDAuMjA1OTE3LDAuMTEwMDk1IDAuNDAzNjc5LDAuMjM2NSAwLjYwMTQ0MiwwLjM2MDg2NiAwLjA1OTEyLDAuMDM2NyAwLjEyMjMyNywwLjA3OTUxIDAuMTYzMTAyLDAuMTM0NTU5IDAuMTEyMTM0LDAuMTU0OTQ4IDAuMDM4NzQsMC4yOTc2NjMgLTAuMTU0OTQ3LDAuMzAxNzQxIC0wLjI5OTcwMiwwLjAwNjEgLTAuNTk3MzY1LDAuMDAyIC0wLjg5NzA2NiwwLjAwMiAtMS45MjQ2MTQsMCAtMy44NDkyMjgxLDAgLTUuNzczODQyLC0wLjAwMiAtMC4xMTIxMzMzLDAgLTAuMjU0ODQ4MywwLjAzNDY2IC0wLjI5MzU4NTIsLTAuMTE4MjUgLTAuMDM2Njk4LC0wLjE0ODgzMSAwLjA2NTI0MSwtMC4yNDA1NzcgMC4xODM0OTA3LC0wLjMwOTg5NSAwLjI1Njg4NywtMC4xNTI5MDkgMC41MTM3NzQxLC0wLjMwNTgxOCAwLjc2ODYyMjMsLTAuNDYwNzY2IDAuMzkzNDg1NywtMC4yNDA1NzcgMC42MDk1OTcsLTAuNTkxMjQ4IDAuNjQ0MjU2NCwtMS4wNTIwMTQgMC4wMzY2OTgsLTAuNDg1MjMxIDAuMDczMzk2LC0wLjI3MDI2MiAwLjExMjEzMzIsLTAuNzg4MTE0IGwgLTAuMjUyODA5NCwwIC03LjExOTQ0MDc0LDAgYyAtMC41MTc4NTE2NCwwIC0wLjc0NjE5NTY4LC0wLjIyODM0NCAtMC43NDYxOTU2OCwtMC43NTAyNzMgbCAwLC0xMi41NTU3NDAyIGMgMCwtMC40Njg5MjA3IDAuMjQwNTc2NzUsLTAuNzE1NjEzOCAwLjcwMzM4MTE3LC0wLjcxNTYxMzggNi4xNTcxMzM3NSwwIDEyLjMxNDI2NzI1LDAuMDAyMDQgMTguNDcxNDAxMjUsLTAuMDA2MTIgMC4zODMyOTIsMCAwLjY3NTg0OCwwLjExODI0OTYgMC44Mjg3NTgsMC40NzI5OTg0IGwgMCwxMi44NTc1OTY2IGMgMC4wMDE4LDAuMzc2MTE4IC0wLjQ0MzQyOCwwLjcwMzI2NCAtMC44MjY3MTksMC43MDEyMjUgeiBtIC0wLjE3Nzg1OCwtMTIuNjU5NzE3NCAtMTcuOTk2MjIxMywwIDAsMTEuNjQ0MTY5NCAxNy45OTYyMjEzLDAgeiINCiAgICAgc3R5bGU9ImZpbGw6IzY4M2QwMDtmaWxsLW9wYWNpdHk6MSINCiAgICAgc29kaXBvZGk6bm9kZXR5cGVzPSJjc2NjY2NjY3NjY2NjY2Njc3Nzc2NjY2NjY2NjY2MiIC8+PGcNCiAgICAgaWQ9Imc0MjE2Ig0KICAgICB0cmFuc2Zvcm09InRyYW5zbGF0ZSgwLjUxNDk3NDQ4LC0xOC42OTEyMzQpIj48cGF0aA0KICAgICAgIHNvZGlwb2RpOm5vZGV0eXBlcz0iY2NjYyINCiAgICAgICBzdHlsZT0iZmlsbDojNDQ3ODIxO2ZpbGwtb3BhY2l0eToxIg0KICAgICAgIGQ9Im0gNy42OTA2MDUsMjUuNTUxOTYgYyAtMC44MTk1OTIsMC42MTM2NzUgLTEuNjI4OTksMS4yMjEyMzMgLTIuNDYyODU0LDEuODQ1MTAxIGwgMCwtMy4xNjIxNTcgYyAwLjc0NjE5NiwtMC4wNzM0IDIuMDI2NTUzLDAuNjA1NTIgMi40NjI4NTQsMS4zMTcwNTYgeiINCiAgICAgICBpZD0icGF0aDgtNy0yIg0KICAgICAgIGlua3NjYXBlOmNvbm5lY3Rvci1jdXJ2YXR1cmU9IjAiIC8+PHBhdGgNCiAgICAgICBzb2RpcG9kaTpub2RldHlwZXM9ImNjY2NjY2NjYyINCiAgICAgICBzdHlsZT0iZmlsbDojMDA2NjgwO2ZpbGwtb3BhY2l0eToxIg0KICAgICAgIGQ9Im0gNC43MjMwNjYzLDI0LjUwMDI0NCAwLDEuODY1NDg5IGMgMCwwLjM4OTQwOCAtMC4wMDYxLDAuNzgwODU1IDAuMDA0MSwxLjE3MDI2MyAwLjAwMiwwLjA5Nzg2IDAuMDMwNTgsMC4yMDU5MTggMC4wODM1OSwwLjI4NzQ2OSAwLjQ4MzE5MywwLjc2MjUwNiAwLjk3NjU3OSwxLjUxODg5NiAxLjQ2Mzg0OSwyLjI3NzMyNCBsIDAuMTc3Mzc0LDAuMjc1MjM2IGMgLTAuODY4NTIzLDAuNTUyNTExIC0yLjI3OTM2MywwLjYxNTcxNCAtMy4zNzIxNTIsLTAuMTc1MzM1IC0xLjExMTE2LC0wLjgwMzI4MiAtMS41ODIxMiwtMi4yMTYxNjEgLTEuMTcwMjg1LC0zLjUxMDc5IDAuMzk1NTI0LC0xLjI0OTc3NiAxLjU3Mzk0MywtMi4xNzMzNDYgMi44MTM1MjQsLTIuMTg5NjU2IHoiDQogICAgICAgaWQ9InBhdGg4LTctMi05Ig0KICAgICAgIGlua3NjYXBlOmNvbm5lY3Rvci1jdXJ2YXR1cmU9IjAiIC8+PHBhdGgNCiAgICAgICBzb2RpcG9kaTpub2RldHlwZXM9ImNjY2MiDQogICAgICAgc3R5bGU9ImZpbGw6I2FhNDQwMDtmaWxsLW9wYWNpdHk6MSINCiAgICAgICBkPSJtIDcuMDIxMTk5NiwzMC40MDIzODMgYyAtMC41NDQzNTYsLTAuODQ0MDU3IC0xLjA4ODcxMiwtMS42ODgxMTUgLTEuNjQxMjIzLC0yLjU0MjM2NiAwLjg1ODMyOSwtMC42NDIyMTggMS43MDIzODcsLTEuMjc0MjQxIDIuNTQ4NDgzLC0xLjkwODMwNCAwLjg2MDM2OCwxLjI4NjQ3NCAwLjU5NTMyNSwzLjQwMDY5NSAtMC45MDcyNiw0LjQ1MDY3IHoiDQogICAgICAgaWQ9InBhdGg4LTctMi01Ig0KICAgICAgIGlua3NjYXBlOmNvbm5lY3Rvci1jdXJ2YXR1cmU9IjAiIC8+PC9nPjxnDQogICAgIGlkPSJnNDIyMSINCiAgICAgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoLTQuNDQ3NTA2OSwtMTguNDEwMzM5KSI+PHBhdGgNCiAgICAgICBzb2RpcG9kaTpub2RldHlwZXM9ImNjY2NzY2Njc2NjY2NzY2NjY2NjY2NjY2NjIg0KICAgICAgIHN0eWxlPSJmaWxsOiNhYTQ0MDA7ZmlsbC1vcGFjaXR5OjEiDQogICAgICAgZD0ibSAxOS40MDA0NzEsMjYuMjgyOTYxIGMgMC42MDk1OTcsLTAuNjkzMTg3IDEuMjEzMDc4LC0xLjM3ODIxOSAxLjg1MTIxOCwtMi4xMDE5ODggLTAuMjgxMzUyLDAgLTAuNTExNzM1LC0wLjAwNDEgLTAuNzQyMTE4LDAuMDAyIC0wLjE1NDk0OCwwLjAwNDEgLTAuMjc1MjM2LC0wLjAzODc0IC0wLjI4OTUwOCwtMC4yMTQwNzQgLTAuMDEyMjMsLTAuMTQwNjc2IDAuMTAxOTQsLTAuMjIyMjI3IDAuMjk5NzAyLC0wLjIyMjIyNyAwLjM4MzI5MiwwIDAuNzY2NTgzLC0wLjAwMiAxLjE0OTg3NSwwIDAuMjI0MjY3LDAuMDAyIDAuMjkxNTQ3LDAuMDY1MjQgMC4yOTE1NDcsMC4yODk1MDcgMC4wMDIsMC4zOTU1MjUgLTAuMDAyLDAuNzkzMDg4IDAuMDAyLDEuMTg4NjEyIDAuMDAyLDAuMTUyOTA5IC0wLjA1OTEzLDAuMjY1MDQzIC0wLjIxNjExMiwwLjI2NTA0MyAtMC4xNTY5ODYsMCAtMC4yMjIyMjcsLTAuMTA4MDU2IC0wLjIyMDE4OSwtMC4yNjMwMDQgMC4wMDIsLTAuMjEyMDM0IDAsLTAuNDI0MDY3IDAsLTAuNjg5MTA5IC0wLjA5Mzc5LDAuMTAxOTM5IC0wLjE1OTAyNiwwLjE2OTIxOSAtMC4yMjAxOSwwLjI0MDU3NiAtMC41NTA0NzIsMC42MjM4NjkgLTEuMDk4OTA1LDEuMjQ5Nzc2IC0xLjY0OTM3OCwxLjg3MTYwNiAtMC4xNzMyOTYsMC4xOTU3MjMgLTAuMjQ4NzMxLDAuMjAxODQgLTAuNDU2Njg4LDAuMDM2NyAtMC41NTQ1NDksLTAuNDQwMzc4IC0xLjEwNzA2LC0wLjg4Mjc5NCAtMS42NzE4MDQsLTEuMzM1NDA1IC0wLjA1MzAxLDAuMDQ2ODkgLTAuMTA2MDE3LDAuMDg5NzEgLTAuMTU2OTg3LDAuMTM4NjM4IC0wLjYzNDA2MiwwLjU5NzM2NCAtMS4yNjgxMjUsMS4xOTI2ODkgLTEuOTAyMTg3LDEuNzkwMDU0IC0wLjA0Njg5LDAuMDQ0ODUgLTAuMDkxNzQsMC4wOTE3NCAtMC4xNDQ3NTQsMC4xMzA0ODIgLTAuMTAzOTc4LDAuMDc1NDMgLTAuMjI4MzQ0LDAuMDc3NDcgLTAuMjg5NTA3LC0wLjAzMDU4IC0wLjA0MDc4LC0wLjA3MTM2IC0wLjAyMDM5LC0wLjE4NzU2OCAtMC4wMDIsLTAuMjc5MzE0IDAuMDEwMTksLTAuMDQ2ODkgMC4wNzc0NywtMC4wODM1OSAwLjEyMDI4OCwtMC4xMjQzNjYgMC43MDk0OTgsLTAuNjY4NzIxIDEuNDE4OTk1LC0xLjMzNzQ0MyAyLjEyODQ5MywtMi4wMDQxMjYgMC4xODk2MDcsLTAuMTc3Mzc1IDAuMjQ2NjkzLC0wLjE3OTQxMyAwLjQ0ODUzMywtMC4wMTgzNSBsIDEuNDkyMzkxLDEuMTkyNjkgYyAwLjA1NzA5LDAuMDQ0ODUgMC4xMTQxNzIsMC4wODc2NyAwLjE3NzM3NCwwLjEzNjU5OCB6Ig0KICAgICAgIGlkPSJwYXRoOC03Ig0KICAgICAgIGlua3NjYXBlOmNvbm5lY3Rvci1jdXJ2YXR1cmU9IjAiIC8+PHBhdGgNCiAgICAgICBzb2RpcG9kaTpub2RldHlwZXM9ImNjc2NjY2NjY2NjY3NjY2NjY2NjY3NzY2NjY2NjY2Njc2NjY2NjY2NjY2NjIg0KICAgICAgIHN0eWxlPSJmaWxsOiMwMDY2ODA7ZmlsbC1vcGFjaXR5OjEiDQogICAgICAgZD0ibSAxNC45NzY2NzQsMjkuNTY2NTg3IGMgMCwtMC4yMzI0MjIgMC4wMDIsLTAuNDY2ODgyIDAsLTAuNzAxMzQzIC0wLjAwMiwtMC4xNzUzMzUgMC4wNzU0MywtMC4yNjkxMTkgMC4yNTQ4NDgsLTAuMjY5MTE5IDAuMjY1MDQzLDAgMC41MzIxMjQsMC4wMDIgMC43OTcxNjYsMCAwLjE3OTQxMywtMC4wMDIgMC4yNjA5NjQsMC4wOTM3OCAwLjI2MzAwMywwLjI2NTA0MiAwLjAwMiwwLjQ3OTExNSAwLjAwMiwwLjk2MDI2OCAwLDEuNDM5MzgzIDAsMC4xNzMyOTcgLTAuMDg1NjMsMC4yNjMwMDMgLTAuMjY1MDQyLDAuMjYwOTY0IC0wLjI1ODkyNiwtMC4wMDIgLTAuNTE5ODksMC4wMDIgLTAuNzc4ODE2LC0wLjAwMiAtMC4xOTM2ODUsLTAuMDAyIC0wLjI2NzA4MSwtMC4wNzk1MSAtMC4yNjkxMiwtMC4yNzUyMzYgLTAuMDA0MSwtMC4yMzg1MzggLTAuMDAyLC0wLjQ3OTExNSAtMC4wMDIsLTAuNzE3NjUzIGwgMCwwIHogTSAxOC43NjI3LDI5LjIzNDI2NSBjIDAsLTAuMzM4NDM5IC0wLjAwMiwtMC42NzQ4MzggMCwtMS4wMTMyNzcgMC4wMDIsLTAuMjA3OTU2IDAuMDcxMzYsLTAuMjc3Mjc1IDAuMjgxMzUyLC0wLjI3OTMxNCAwLjI1MjgxLC0wLjAwMiAwLjUwNTYxOSwtMC4wMDIgMC43NjA0NjcsMCAwLjE5NTcyNCwwLjAwMiAwLjI3MzE5OCwwLjA3MzQgMC4yNzMxOTgsMC4yNzExNTkgMC4wMDQxLDAuNjk1MjI2IDAuMDAyLDEuMzg4NDEzIDAsMi4wODM2MzkgMCwwLjE3MTI1OCAtMC4wODU2MywwLjI2NTA0MiAtMC4yNjUwNDIsMC4yNjMwMDQgLTAuMjU4OTI2LC0wLjAwMiAtMC41MTk4OTEsMC4wMDIgLTAuNzc4ODE3LC0wLjAwMiAtMC4xOTM2ODQsLTAuMDAyIC0wLjI2OTExOSwtMC4wNzk1MSAtMC4yNzExNTgsLTAuMjczMTk3IC0wLjAwMiwtMC4zNDg2MzMgMCwtMC42OTkzMDQgMCwtMS4wNDk5NzUgeiBtIC0wLjU4MzA5MywtMC4zMTM5NzMgYyAwLDAuNDQ4NTMzIDAuMDAyLDAuODk3MDY2IDAsMS4zNDM1NiAwLDAuMjI2MzA1IC0wLjA2NTI0LDAuMjkxNTQ2IC0wLjI4NzQ2OSwwLjI5NTYyNCAtMC4yNDY2OTMsMC4wMDIgLTAuNDkzMzg2LDAuMDAyIC0wLjc0MDA3OSwwIC0wLjIwMTg0LC0wLjAwMiAtMC4yNzcyNzUsLTAuMDY3MjggLTAuMjc5MzE0LC0wLjI2MzAwNCAtMC4wMDQxLC0wLjkxNTQxNSAtMC4wMDQxLC0xLjgzMDgzIDAsLTIuNzQ4MjgzIDAsLTAuMTk3NzYzIDAuMDc1NDMsLTAuMjYzMDA0IDAuMjc3Mjc1LC0wLjI2NTA0MyAwLjI1MjgxLC0wLjAwMiAwLjUwNzY1OCwtMC4wMDIgMC43NjA0NjcsMCAwLjE5NTcyNCwwLjAwMiAwLjI2NzA4MSwwLjA3NTQzIDAuMjY3MDgxLDAuMjczMTk4IDAuMDA0MSwwLjQ1NDY0OSAwLjAwMiwwLjkwOTI5OCAwLjAwMiwxLjM2Mzk0OCB6IG0gMi40NzkxNjQsLTAuMzA5ODk2IDAsLTEuNjU3NTMzIGMgMCwtMC4yNjkxMiAwLjA2MzIsLTAuMzI4MjQ0IDAuMzM0MzYxLC0wLjMzMDI4MyAwLjIyODM0NCwwIDAuNDU0NjQ5LC0wLjAwMiAwLjY4Mjk5MywwIDAuMjA5OTk1LDAuMDAyIDAuMjg3NDY5LDAuMDczNCAwLjI4NzQ2OSwwLjI3NTIzNiAwLjAwMiwxLjEzMTUyNiAwLjAwMiwyLjI2MTAxNCAwLDMuMzkyNTQgMCwwLjE5MzY4NSAtMC4wNzc0NywwLjI2NTA0MiAtMC4yNzUyMzYsMC4yNjkxMiAtMC4yNTI4MSwwLjAwNDEgLTAuNTA3NjU4LDAuMDAyIC0wLjc2MDQ2NywwIC0wLjE5MzY4NSwtMC4wMDIgLTAuMjY3MDgxLC0wLjA3MzQgLTAuMjY5MTIsLTAuMjczMTk4IDAsLTAuNTU4NjI3IDAuMDAyLC0xLjExNzI1NCAwLC0xLjY3NTg4MiB6Ig0KICAgICAgIGlkPSJwYXRoOC03LTIzIg0KICAgICAgIGlua3NjYXBlOmNvbm5lY3Rvci1jdXJ2YXR1cmU9IjAiIC8+PC9nPjwvc3ZnPg==',
				order: 30
			});
		},

		$constructor: function(id, workspace, opts){
			$base(id, workspace);
			if(this.property('widgets')){
				this.widgetCount = this.property('widgets');
			}
			if(this.property('lastUpdated')){
				this.lastUpdated = this.property('lastUpdated');
			}
		},
		
		destroy: function(){
			if(this.existsArtifact('.dashboard')){
				this.removeArtifact('.dashboard');
			}
			$base();
		},
		
		updateLayout: function(layout){
			this.load();
			// check layout to be stored
			function checkLayoutFailed(lEntry){
				if(lEntry && lEntry.widgets){
					for(var i = 0; i < lEntry.widgets.length; i++){
						var wServerId = lEntry.widgets[i];
						if(!$this.wrappers[wServerId]){
							return wServerId;
						}
					}
				} 
				if(lEntry && lEntry.containers){
					for(var i = 0; i < lEntry.containers.length; i++){
						var failId = checkLayoutFailed(lEntry.containers[i]);
						if(failId){
							return failId;
						}
					}
				}
				
				return false;
			}
			
			var failId = checkLayoutFailed(layout);
			if(failId){
				JSB.getLogger().warn('Wrong layout: Unable to find widget entry for: ' + failId);
				return;
			}
			
			this.layout = layout;
			JSB.getLogger().info('Layout saved: ' + JSON.stringify(layout, null, 4));
			this.updateUnusedWrappers();
			this.store();
			this.doSync();
		},
		
		createWidgetWrapper: function(wType, wName){
			this.load();
			var wwId = JSB.generateUid();
			var wWrapper = new Widget(wwId, this.getWorkspace(), this, wName, wType);
			this.wrappers[wwId] = wWrapper;
			this.widgetCount = Object.keys(this.wrappers).length;
			this.addChildEntry(wWrapper);
			this.store();
			this.doSync();
			return wWrapper;
		},
		
		removeWidgetWrapper: function(wwId){
			this.load();
			if(!this.wrappers[wwId]){
				throw new Error('Failed to find widget wrapper with id: ' + wwId);
			}
			delete this.wrappers[wwId];
			this.fixupLayout();
			this.widgetCount = Object.keys(this.wrappers).length;
			
			var cEntry = this.removeChildEntry(wwId);
			if(cEntry){
				cEntry.remove();
			}
			this.store();
			this.doSync();
			return true;
		},
		
		checkWrapperRelation: function(wwId){
			if(this.hasChildEntry(wwId)){
				return true;
			}
			return false;
		},
		
		fixupLayout: function(){},
		
		store: function(){
			this.load();
			var mtxName = 'store_' + this.getId();
			JSB.getLocker().lock(mtxName);
			try {
				var desc = {
					layout: this.layout,
					//wrappers: {}
				}
				/*
				for(var wId in this.wrappers){
					var wWrapper = this.wrappers[wId];
					desc.wrappers[wId] = {
						jsb: wWrapper.getWidgetType(),
						name: wWrapper.getName(),
						values: wWrapper.getValues(),
						sourcesIds: wWrapper.getSourcesIds()
					}
				}
				*/
				this.widgetCount = Object.keys(this.wrappers).length;
				this.lastUpdated = Date.now();
				this.property('widgets', this.widgetCount);
				this.property('lastUpdated', this.lastUpdated);
				this.storeArtifact('.dashboard', desc);
			} finally {
				JSB.getLocker().unlock(mtxName);	
			}
			this.getWorkspace().store();
		},
		
		load: function(){
			var bNeedStore = false;
			if(!this.loaded){
				var mtxName = 'load_' + this.getId();
				JSB.getLocker().lock(mtxName);
				try {
					if(!this.loaded) {
						if(this.existsArtifact('.dashboard')){
							// read layout
							var snapshot = this.loadArtifact('.dashboard');
							this.layout = snapshot.layout;
	
							// read wrappers
							this.wrappers = this.getChildren();

							/*
							for(var wId in snapshot.wrappers){
								var wDesc = snapshot.wrappers[wId];
								
								if(!this.wrappers[wId]){
									var wWrapper = this.getWorkspace().entry(wId);
									if(!wWrapper){
										bNeedStore = true;
										wWrapper = new Widget(wId, this.getWorkspace(), this, wDesc.name, wDesc.jsb, wDesc.values);
										this.addChildEntry(wWrapper);
									}
									
									this.wrappers[wId] = wWrapper;
								}
							}
							*/
							
							this.updateUnusedWrappers();
/*							
							for(var wId in unusedWrappers){
								bNeedStore = true;
								var cEntry = this.removeChildEntry(wId);
								if(cEntry){
									cEntry.remove();
								}
								delete this.wrappers[wId];
							}
*/							
						}
						this.loaded = true;
						this.widgetCount = Object.keys(this.wrappers).length;
					}
				} finally {
					JSB.getLocker().unlock(mtxName);	
				}
			}
			
			if(bNeedStore){
				this.store();
				this.doSync();
			}
			
			return {
				layout: this.layout,
				wrappers: this.wrappers
			}
		},
		
		updateUnusedWrappers: function(){
			var unusedWrappers = JSB.clone(this.wrappers);
			function performLayoutEntry(lEntry){
				if(lEntry && lEntry.widgets){
					for(var i = 0; i < lEntry.widgets.length; i++){
						var wServerId = lEntry.widgets[i];
						if(unusedWrappers[wServerId]){
							if(unusedWrappers[wServerId].unused){
								unusedWrappers[wServerId].unused = false;
								unusedWrappers[wServerId].property('unused', false);
								unusedWrappers[wServerId].doSync();
							}
							delete unusedWrappers[wServerId];
						} else {
							// missing entry
						}
					}
				} 
				if(lEntry && lEntry.containers){
					for(var i = 0; i < lEntry.containers.length; i++){
						performLayoutEntry(lEntry.containers[i]);
					}
				} 
			}
			
			performLayoutEntry(this.layout);
			
			if(Object.keys(unusedWrappers).length == 0){
				return;
			}
			for(var wId in unusedWrappers){
				unusedWrappers[wId].unused = true;
				unusedWrappers[wId].property('unused', true);
				unusedWrappers[wId].doSync();
			}
		},
	
		getSources: function(){
			var sources = {};
			this.load();
			
			for(var wId in this.wrappers){
				var wWrapper = this.wrappers[wId];
				var srcMap = wWrapper.getSourceMap();
				for(var srcId in srcMap){
					if(!sources[srcId]){
						sources[srcId] = this.getWorkspace().entry(srcId);
					}
					var srcArr = srcMap[srcId];
					for(var i = 0; i < srcArr.length; i++){
						var srcArrId = srcArr[i];
						if(!sources[srcArrId]){
							sources[srcArrId] = this.getWorkspace().entry(srcArrId);
						}
					}
				}
			}
			
			return sources;
		},
		
		getWrappers: function(){
			$this.load();
			return $this.wrappers;
		}
	}
}