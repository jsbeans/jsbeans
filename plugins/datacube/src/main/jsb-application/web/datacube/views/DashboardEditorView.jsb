{
	$name: 'DataCube.DashboardEditorView',
	$parent: 'JSB.Workspace.BrowserView',
	
	$client: {
		$require: ['DataCube.DashboardEditor'],
		
		editor: null,
		
		$constructor: function(opts){
			$base(opts);
			
			this.loadCss('DashboardEditorView.css');
			this.addClass('dashboardEditorView');
		},
		
		refresh: function(){
			if(!this.editor){
				this.editor = new DashboardEditor();
				this.append(this.editor);
			}
			this.editor.setCurrentEntry(this.node.getEntry());
		}
		
	},
	
	$server: {
		$require: 'JSB.Workspace.WorkspaceController',
		$bootstrap: function(){
			WorkspaceController.registerBrowserView(this, {
				wmKey: 'datacube',
				priority: 1,
				acceptNode: 'DataCube.DashboardNode',
				caption: 'Редактирование',
				icon: 'data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiIHN0YW5kYWxvbmU9Im5vIj8+DQo8IS0tIFN2ZyBWZWN0b3IgSWNvbnMgOiBodHRwOi8vd3d3Lm9ubGluZXdlYmZvbnRzLmNvbS9pY29uIC0tPg0KDQo8c3ZnDQogICB4bWxuczpkYz0iaHR0cDovL3B1cmwub3JnL2RjL2VsZW1lbnRzLzEuMS8iDQogICB4bWxuczpjYz0iaHR0cDovL2NyZWF0aXZlY29tbW9ucy5vcmcvbnMjIg0KICAgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIg0KICAgeG1sbnM6c3ZnPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyINCiAgIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyINCiAgIHhtbG5zOnhsaW5rPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rIg0KICAgeG1sbnM6c29kaXBvZGk9Imh0dHA6Ly9zb2RpcG9kaS5zb3VyY2Vmb3JnZS5uZXQvRFREL3NvZGlwb2RpLTAuZHRkIg0KICAgeG1sbnM6aW5rc2NhcGU9Imh0dHA6Ly93d3cuaW5rc2NhcGUub3JnL25hbWVzcGFjZXMvaW5rc2NhcGUiDQogICB2ZXJzaW9uPSIxLjEiDQogICB4PSIwcHgiDQogICB5PSIwcHgiDQogICB2aWV3Qm94PSIwIDAgMjAgMjAiDQogICBlbmFibGUtYmFja2dyb3VuZD0ibmV3IDAgMCAxMDAwIDEwMDAiDQogICB4bWw6c3BhY2U9InByZXNlcnZlIg0KICAgaWQ9InN2ZzIiDQogICBpbmtzY2FwZTp2ZXJzaW9uPSIwLjkxIHIxMzcyNSINCiAgIHNvZGlwb2RpOmRvY25hbWU9ImRhc2hib2FyZF9lZGl0LnN2ZyINCiAgIHdpZHRoPSIyMCINCiAgIGhlaWdodD0iMjAiPjxkZWZzDQogICAgIGlkPSJkZWZzMTIiPjxsaW5lYXJHcmFkaWVudA0KICAgICAgIGlkPSJsaW5lYXJHcmFkaWVudDMwNDkiPjxzdG9wDQogICAgICAgICBzdHlsZT0ic3RvcC1jb2xvcjojODg4YTg1O3N0b3Atb3BhY2l0eToxOyINCiAgICAgICAgIG9mZnNldD0iMCINCiAgICAgICAgIGlkPSJzdG9wMzA1MSIgLz48c3RvcA0KICAgICAgICAgc3R5bGU9InN0b3AtY29sb3I6I2QzZDdjZjtzdG9wLW9wYWNpdHk6MTsiDQogICAgICAgICBvZmZzZXQ9IjAuNSINCiAgICAgICAgIGlkPSJzdG9wMjI2MiIgLz48c3RvcA0KICAgICAgICAgc3R5bGU9InN0b3AtY29sb3I6I2VlZWVlYztzdG9wLW9wYWNpdHk6MTsiDQogICAgICAgICBvZmZzZXQ9IjAuNjc2MTI5NTgiDQogICAgICAgICBpZD0ic3RvcDIyNjQiIC8+PHN0b3ANCiAgICAgICAgIHN0eWxlPSJzdG9wLWNvbG9yOiNiYWJkYjY7c3RvcC1vcGFjaXR5OjE7Ig0KICAgICAgICAgb2Zmc2V0PSIwLjg0MDUxNzIyIg0KICAgICAgICAgaWQ9InN0b3AyMjY4IiAvPjxzdG9wDQogICAgICAgICBzdHlsZT0ic3RvcC1jb2xvcjojZDNkN2NmO3N0b3Atb3BhY2l0eToxOyINCiAgICAgICAgIG9mZnNldD0iMC44NzUiDQogICAgICAgICBpZD0ic3RvcDIyNjYiIC8+PHN0b3ANCiAgICAgICAgIHN0eWxlPSJzdG9wLWNvbG9yOiNiYWJkYjY7c3RvcC1vcGFjaXR5OjE7Ig0KICAgICAgICAgb2Zmc2V0PSIxIg0KICAgICAgICAgaWQ9InN0b3AzMDUzIiAvPjwvbGluZWFyR3JhZGllbnQ+PGxpbmVhckdyYWRpZW50DQogICAgICAgaWQ9ImxpbmVhckdyYWRpZW50MzA2MSI+PHN0b3ANCiAgICAgICAgIHN0eWxlPSJzdG9wLWNvbG9yOiNmZmZmZmY7c3RvcC1vcGFjaXR5OjE7Ig0KICAgICAgICAgb2Zmc2V0PSIwIg0KICAgICAgICAgaWQ9InN0b3AzMDYzIiAvPjxzdG9wDQogICAgICAgICBzdHlsZT0ic3RvcC1jb2xvcjojMDAwMDAwO3N0b3Atb3BhY2l0eToxOyINCiAgICAgICAgIG9mZnNldD0iMSINCiAgICAgICAgIGlkPSJzdG9wMzA2NSIgLz48L2xpbmVhckdyYWRpZW50PjxsaW5lYXJHcmFkaWVudA0KICAgICAgIGlkPSJsaW5lYXJHcmFkaWVudDMwNzciPjxzdG9wDQogICAgICAgICBzdHlsZT0ic3RvcC1jb2xvcjojODg4YTg1O3N0b3Atb3BhY2l0eToxOyINCiAgICAgICAgIG9mZnNldD0iMCINCiAgICAgICAgIGlkPSJzdG9wMzA3OSIgLz48c3RvcA0KICAgICAgICAgc3R5bGU9InN0b3AtY29sb3I6I2QzZDdjZjtzdG9wLW9wYWNpdHk6MTsiDQogICAgICAgICBvZmZzZXQ9IjEiDQogICAgICAgICBpZD0ic3RvcDMwODEiIC8+PC9saW5lYXJHcmFkaWVudD48bGluZWFyR3JhZGllbnQNCiAgICAgICBpZD0ibGluZWFyR3JhZGllbnQzMDg3Ij48c3RvcA0KICAgICAgICAgc3R5bGU9InN0b3AtY29sb3I6IzM0NjVhNDtzdG9wLW9wYWNpdHk6MTsiDQogICAgICAgICBvZmZzZXQ9IjAiDQogICAgICAgICBpZD0ic3RvcDMwODkiIC8+PHN0b3ANCiAgICAgICAgIHN0eWxlPSJzdG9wLWNvbG9yOiM5ZmJjZTE7c3RvcC1vcGFjaXR5OjE7Ig0KICAgICAgICAgb2Zmc2V0PSIwIg0KICAgICAgICAgaWQ9InN0b3AzMDk1IiAvPjxzdG9wDQogICAgICAgICBzdHlsZT0ic3RvcC1jb2xvcjojNmI5NWNhO3N0b3Atb3BhY2l0eToxOyINCiAgICAgICAgIG9mZnNldD0iMCINCiAgICAgICAgIGlkPSJzdG9wMjI0MiIgLz48c3RvcA0KICAgICAgICAgc3R5bGU9InN0b3AtY29sb3I6IzNkNmFhNTtzdG9wLW9wYWNpdHk6MTsiDQogICAgICAgICBvZmZzZXQ9IjAuNzUiDQogICAgICAgICBpZD0ic3RvcDIyNDQiIC8+PHN0b3ANCiAgICAgICAgIHN0eWxlPSJzdG9wLWNvbG9yOiMzODZlYjQ7c3RvcC1vcGFjaXR5OjE7Ig0KICAgICAgICAgb2Zmc2V0PSIxIg0KICAgICAgICAgaWQ9InN0b3AzMDkxIiAvPjwvbGluZWFyR3JhZGllbnQ+PGxpbmVhckdyYWRpZW50DQogICAgICAgaWQ9ImxpbmVhckdyYWRpZW50MzMyNyI+PHN0b3ANCiAgICAgICAgIHN0eWxlPSJzdG9wLWNvbG9yOiMwMGExZmY7c3RvcC1vcGFjaXR5OjE7Ig0KICAgICAgICAgb2Zmc2V0PSIwIg0KICAgICAgICAgaWQ9InN0b3AzMzI5IiAvPjxzdG9wDQogICAgICAgICBzdHlsZT0ic3RvcC1jb2xvcjojMDAwMDAxO3N0b3Atb3BhY2l0eToxOyINCiAgICAgICAgIG9mZnNldD0iMSINCiAgICAgICAgIGlkPSJzdG9wMzMzMSIgLz48L2xpbmVhckdyYWRpZW50PjxsaW5lYXJHcmFkaWVudA0KICAgICAgIGlkPSJsaW5lYXJHcmFkaWVudDMyNDQiPjxzdG9wDQogICAgICAgICBpZD0ic3RvcDMyNDYiDQogICAgICAgICBvZmZzZXQ9IjAiDQogICAgICAgICBzdHlsZT0ic3RvcC1jb2xvcjojY2VmOGNlO3N0b3Atb3BhY2l0eToxIiAvPjxzdG9wDQogICAgICAgICBzdHlsZT0ic3RvcC1jb2xvcjojMDA4ZTg0O3N0b3Atb3BhY2l0eToxIg0KICAgICAgICAgb2Zmc2V0PSIwLjQ0MjUxODgzIg0KICAgICAgICAgaWQ9InN0b3A0MDIyIiAvPjxzdG9wDQogICAgICAgICBpZD0ic3RvcDMyNDgiDQogICAgICAgICBvZmZzZXQ9IjEiDQogICAgICAgICBzdHlsZT0ic3RvcC1jb2xvcjojMDAwMDAxO3N0b3Atb3BhY2l0eToxOyIgLz48L2xpbmVhckdyYWRpZW50PjxyYWRpYWxHcmFkaWVudA0KICAgICAgIGlua3NjYXBlOmNvbGxlY3Q9ImFsd2F5cyINCiAgICAgICB4bGluazpocmVmPSIjbGluZWFyR3JhZGllbnQzMDQxIg0KICAgICAgIGlkPSJyYWRpYWxHcmFkaWVudDI5NDkxIg0KICAgICAgIGdyYWRpZW50VW5pdHM9InVzZXJTcGFjZU9uVXNlIg0KICAgICAgIGdyYWRpZW50VHJhbnNmb3JtPSJtYXRyaXgoMC4yNDEwMzk0LDAsMCwwLjA2OTU1OTIxLDkuNjczOTAzLDE1LjYwOTIyNCkiDQogICAgICAgY3g9IjI0LjgxMjUiDQogICAgICAgY3k9IjM5LjEyNSINCiAgICAgICBmeD0iMjQuODEyNSINCiAgICAgICBmeT0iMzkuMTI1Ig0KICAgICAgIHI9IjE3LjY4NzUiIC8+PGxpbmVhckdyYWRpZW50DQogICAgICAgaW5rc2NhcGU6Y29sbGVjdD0iYWx3YXlzIg0KICAgICAgIGlkPSJsaW5lYXJHcmFkaWVudDMwNDEiPjxzdG9wDQogICAgICAgICBzdHlsZT0ic3RvcC1jb2xvcjojMDAwMDAwO3N0b3Atb3BhY2l0eToxOyINCiAgICAgICAgIG9mZnNldD0iMCINCiAgICAgICAgIGlkPSJzdG9wMzA0MyIgLz48c3RvcA0KICAgICAgICAgc3R5bGU9InN0b3AtY29sb3I6IzAwMDAwMDtzdG9wLW9wYWNpdHk6MDsiDQogICAgICAgICBvZmZzZXQ9IjEiDQogICAgICAgICBpZD0ic3RvcDMwNDUiIC8+PC9saW5lYXJHcmFkaWVudD48bGluZWFyR3JhZGllbnQNCiAgICAgICBpbmtzY2FwZTpjb2xsZWN0PSJhbHdheXMiDQogICAgICAgeGxpbms6aHJlZj0iI2xpbmVhckdyYWRpZW50MzA0OSINCiAgICAgICBpZD0ibGluZWFyR3JhZGllbnQyOTQ5NSINCiAgICAgICBncmFkaWVudFVuaXRzPSJ1c2VyU3BhY2VPblVzZSINCiAgICAgICBncmFkaWVudFRyYW5zZm9ybT0ibWF0cml4KDAuMjgxODQzNDMsMCwwLDAuMjgxODQzNDMsMzMyLjA3MjQxLDE1NS43MzQ3OCkiDQogICAgICAgeDE9IjE5LjY0ODM0MiINCiAgICAgICB5MT0iNDIuMjUzNjAxIg0KICAgICAgIHgyPSIyMC42MzEyMjQiDQogICAgICAgeTI9IjYuNzc1ODAzMSIgLz48bGluZWFyR3JhZGllbnQNCiAgICAgICBpbmtzY2FwZTpjb2xsZWN0PSJhbHdheXMiDQogICAgICAgeGxpbms6aHJlZj0iI2xpbmVhckdyYWRpZW50MzA2MSINCiAgICAgICBpZD0ibGluZWFyR3JhZGllbnQyOTQ5NyINCiAgICAgICBncmFkaWVudFVuaXRzPSJ1c2VyU3BhY2VPblVzZSINCiAgICAgICBncmFkaWVudFRyYW5zZm9ybT0ibWF0cml4KDAuMjgxODQzNDEsMCwwLDAuMjgxODQzNDEsMzQzLjI5NjcyLC0xMjkuMTIzMTEpIg0KICAgICAgIHgxPSI1MC4xNTI5MzEiDQogICAgICAgeTE9Ii0zLjYzMjQ0NzciDQogICAgICAgeDI9IjI1LjI5MTA4NiINCiAgICAgICB5Mj0iLTQuMzAwMjY1MyIgLz48bGluZWFyR3JhZGllbnQNCiAgICAgICBpbmtzY2FwZTpjb2xsZWN0PSJhbHdheXMiDQogICAgICAgeGxpbms6aHJlZj0iI2xpbmVhckdyYWRpZW50MzA3NyINCiAgICAgICBpZD0ibGluZWFyR3JhZGllbnQyOTQ5OSINCiAgICAgICBncmFkaWVudFVuaXRzPSJ1c2VyU3BhY2VPblVzZSINCiAgICAgICBncmFkaWVudFRyYW5zZm9ybT0ibWF0cml4KDAuMjgxODQzNDMsMCwwLDAuMjgxODQzNDMsMzMyLjE3MjA1LDE1NS45MzQwNykiDQogICAgICAgeDE9IjM4LjIyNzY1NCINCiAgICAgICB5MT0iMTMuNjAyNTI3Ig0KICAgICAgIHgyPSIzNy41MzUzNyINCiAgICAgICB5Mj0iNi42Mjg1ODk2IiAvPjxsaW5lYXJHcmFkaWVudA0KICAgICAgIGlua3NjYXBlOmNvbGxlY3Q9ImFsd2F5cyINCiAgICAgICB4bGluazpocmVmPSIjbGluZWFyR3JhZGllbnQyMjUwIg0KICAgICAgIGlkPSJsaW5lYXJHcmFkaWVudDI5NTAxIg0KICAgICAgIGdyYWRpZW50VW5pdHM9InVzZXJTcGFjZU9uVXNlIg0KICAgICAgIGdyYWRpZW50VHJhbnNmb3JtPSJtYXRyaXgoMC4zMjA5MDc1LDAsMCwwLjMyMDkwNzUsMzMxLjI1ODI3LDE1NC4xNDA2MSkiDQogICAgICAgeDE9IjMxLjE3NzQwNCINCiAgICAgICB5MT0iMTkuODIxNTE0Ig0KICAgICAgIHgyPSI0MC44NTkxNzciDQogICAgICAgeTI9IjkuNjU2ODUzNyIgLz48bGluZWFyR3JhZGllbnQNCiAgICAgICBpbmtzY2FwZTpjb2xsZWN0PSJhbHdheXMiDQogICAgICAgaWQ9ImxpbmVhckdyYWRpZW50MjI1MCI+PHN0b3ANCiAgICAgICAgIHN0eWxlPSJzdG9wLWNvbG9yOiNmZmZmZmY7c3RvcC1vcGFjaXR5OjE7Ig0KICAgICAgICAgb2Zmc2V0PSIwIg0KICAgICAgICAgaWQ9InN0b3AyMjUyIiAvPjxzdG9wDQogICAgICAgICBzdHlsZT0ic3RvcC1jb2xvcjojZmZmZmZmO3N0b3Atb3BhY2l0eTowOyINCiAgICAgICAgIG9mZnNldD0iMSINCiAgICAgICAgIGlkPSJzdG9wMjI1NCIgLz48L2xpbmVhckdyYWRpZW50PjxsaW5lYXJHcmFkaWVudA0KICAgICAgIGlua3NjYXBlOmNvbGxlY3Q9ImFsd2F5cyINCiAgICAgICB4bGluazpocmVmPSIjbGluZWFyR3JhZGllbnQzMDg3Ig0KICAgICAgIGlkPSJsaW5lYXJHcmFkaWVudDI5NTAzIg0KICAgICAgIGdyYWRpZW50VW5pdHM9InVzZXJTcGFjZU9uVXNlIg0KICAgICAgIGdyYWRpZW50VHJhbnNmb3JtPSJtYXRyaXgoMC4yODE4NDM0MywwLDAsMC4yODE4NDM0MywzMzIuMDcyNDEsMTU1LjczNDc4KSINCiAgICAgICB4MT0iOS43NTAzMjQyIg0KICAgICAgIHkxPSIzMi4yODM3NiINCiAgICAgICB4Mj0iMTYuOTE1Mjk3Ig0KICAgICAgIHkyPSIzOS40NDMyMTgiIC8+PGxpbmVhckdyYWRpZW50DQogICAgICAgaW5rc2NhcGU6Y29sbGVjdD0iYWx3YXlzIg0KICAgICAgIHhsaW5rOmhyZWY9IiNsaW5lYXJHcmFkaWVudDIyNTAiDQogICAgICAgaWQ9ImxpbmVhckdyYWRpZW50Mjk1MDUiDQogICAgICAgZ3JhZGllbnRVbml0cz0idXNlclNwYWNlT25Vc2UiDQogICAgICAgZ3JhZGllbnRUcmFuc2Zvcm09Im1hdHJpeCgwLjMyMzIzNTM2LC0wLjAwODQ2MDgxLDAuMDA4NDYwODEsMC4zMjMyMzUzNiwzMzEuNzY5NiwxNTQuMTY2MDMpIg0KICAgICAgIHgxPSIxMi4wMDQ2OTciDQogICAgICAgeTE9IjM1LjY4ODQ2MSINCiAgICAgICB4Mj0iMTAuNjUwODA1Ig0KICAgICAgIHkyPSIzMy4xOTQ5NjUiIC8+PGxpbmVhckdyYWRpZW50DQogICAgICAgaW5rc2NhcGU6Y29sbGVjdD0iYWx3YXlzIg0KICAgICAgIHhsaW5rOmhyZWY9IiNsaW5lYXJHcmFkaWVudDMwNDEiDQogICAgICAgaWQ9ImxpbmVhckdyYWRpZW50Mjk1MDciDQogICAgICAgZ3JhZGllbnRVbml0cz0idXNlclNwYWNlT25Vc2UiDQogICAgICAgZ3JhZGllbnRUcmFuc2Zvcm09Im1hdHJpeCgwLjI4MTc4ODU1LC0wLjAwNTU1OTMxLDAuMDA1NTU5MzEsMC4yODE3ODg1NSwzMzEuOTUyNjEsMTU1LjQ0NjAzKSINCiAgICAgICB4MT0iMTQuMDE3NTQyIg0KICAgICAgIHkxPSIzNi45NDI1NDMiDQogICAgICAgeDI9IjE1LjQxNTc5MyINCiAgICAgICB5Mj0iMzguMjY4MzY4IiAvPjwvZGVmcz48c29kaXBvZGk6bmFtZWR2aWV3DQogICAgIHBhZ2Vjb2xvcj0iI2ZmZmZmZiINCiAgICAgYm9yZGVyY29sb3I9IiM2NjY2NjYiDQogICAgIGJvcmRlcm9wYWNpdHk9IjEiDQogICAgIG9iamVjdHRvbGVyYW5jZT0iMTAiDQogICAgIGdyaWR0b2xlcmFuY2U9IjEwIg0KICAgICBndWlkZXRvbGVyYW5jZT0iMTAiDQogICAgIGlua3NjYXBlOnBhZ2VvcGFjaXR5PSIwIg0KICAgICBpbmtzY2FwZTpwYWdlc2hhZG93PSIyIg0KICAgICBpbmtzY2FwZTp3aW5kb3ctd2lkdGg9IjE5MjAiDQogICAgIGlua3NjYXBlOndpbmRvdy1oZWlnaHQ9IjExMzgiDQogICAgIGlkPSJuYW1lZHZpZXcxMCINCiAgICAgc2hvd2dyaWQ9ImZhbHNlIg0KICAgICBpbmtzY2FwZTp6b29tPSIzMiINCiAgICAgaW5rc2NhcGU6Y3g9IjMuMDMyNjQ0MSINCiAgICAgaW5rc2NhcGU6Y3k9IjYuMjMzMzQyNCINCiAgICAgaW5rc2NhcGU6d2luZG93LXg9Ii04Ig0KICAgICBpbmtzY2FwZTp3aW5kb3cteT0iLTgiDQogICAgIGlua3NjYXBlOndpbmRvdy1tYXhpbWl6ZWQ9IjEiDQogICAgIGlua3NjYXBlOmN1cnJlbnQtbGF5ZXI9InN2ZzIiDQogICAgIHNob3dndWlkZXM9InRydWUiDQogICAgIGlua3NjYXBlOmd1aWRlLWJib3g9InRydWUiPjxzb2RpcG9kaTpndWlkZQ0KICAgICAgIHBvc2l0aW9uPSIyMC4wMDIwNzcsMTcuMTQ2MzEiDQogICAgICAgb3JpZW50YXRpb249IjEsMCINCiAgICAgICBpZD0iZ3VpZGU0MjY0IiAvPjwvc29kaXBvZGk6bmFtZWR2aWV3PjxtZXRhZGF0YQ0KICAgICBpZD0ibWV0YWRhdGE0Ij4gU3ZnIFZlY3RvciBJY29ucyA6IGh0dHA6Ly93d3cub25saW5ld2ViZm9udHMuY29tL2ljb24gPHJkZjpSREY+PGNjOldvcmsNCiAgICAgcmRmOmFib3V0PSIiPjxkYzpmb3JtYXQ+aW1hZ2Uvc3ZnK3htbDwvZGM6Zm9ybWF0PjxkYzp0eXBlDQogICAgICAgcmRmOnJlc291cmNlPSJodHRwOi8vcHVybC5vcmcvZGMvZGNtaXR5cGUvU3RpbGxJbWFnZSIgLz48ZGM6dGl0bGU+PC9kYzp0aXRsZT48L2NjOldvcms+PC9yZGY6UkRGPjwvbWV0YWRhdGE+PGcNCiAgICAgdHJhbnNmb3JtPSJtYXRyaXgoMS4zNzc0MTg5LDAsMCwxLjM3NzQxODksLTcuNDkwMzIwMiwtNy44MTMzMzE0KSINCiAgICAgaWQ9Imc0MzM4Ij48ZWxsaXBzZQ0KICAgICAgIHJ5PSIxLjIzMDMyOTYiDQogICAgICAgcng9IjQuMjYzMzg0MyINCiAgICAgICBjeT0iMTguMzMwNzMiDQogICAgICAgY3g9IjE1LjY1NDY5MyINCiAgICAgICBpZD0icGF0aDIyNTgiDQogICAgICAgc3R5bGU9ImRpc3BsYXk6aW5saW5lO292ZXJmbG93OnZpc2libGU7dmlzaWJpbGl0eTp2aXNpYmxlO29wYWNpdHk6MC4xOTg4NjM2NztmaWxsOnVybCgjcmFkaWFsR3JhZGllbnQyOTQ5MSk7ZmlsbC1vcGFjaXR5OjE7ZmlsbC1ydWxlOm5vbnplcm87c3Ryb2tlOm5vbmU7c3Ryb2tlLXdpZHRoOjE7c3Ryb2tlLWxpbmVjYXA6YnV0dDtzdHJva2UtbGluZWpvaW46bWl0ZXI7c3Ryb2tlLW1pdGVybGltaXQ6NDtzdHJva2UtZGFzaGFycmF5Om5vbmU7c3Ryb2tlLWRhc2hvZmZzZXQ6MDtzdHJva2Utb3BhY2l0eToxO21hcmtlcjpub25lO21hcmtlci1zdGFydDpub25lO21hcmtlci1taWQ6bm9uZTttYXJrZXItZW5kOm5vbmUiIC8+PHBhdGgNCiAgICAgICBpbmtzY2FwZTpjb25uZWN0b3ItY3VydmF0dXJlPSIwIg0KICAgICAgIGQ9Im0gOS45NTE3NTc2LDExLjY1OTIyNSA2LjA5NDg2NDQsNi4yMzU3ODggYyAwLjI0NjYxNCwwLjI4MTg0NCAxLjAyODAzLDAuNDk5NjcyIDEuNTUwMTQsMCAwLjUwNDE4NSwtMC40ODI1MjMgMC4zODc1MzUsLTEuMTYyNjA2IC0wLjEwNTY5LC0xLjY1NTgzMSBMIDExLjY0MjgxOCw5Ljk2ODE2NDggQyAxMi4zNjQ4Niw3Ljk2MjQ5MzEgMTAuOTAzNDg2LDYuMjc3ODY2NiA5LjAxODE1NDEsNi42Mzg4ODc0IEwgOC42MTMwMDIyLDcuMDA4ODA3IDkuODgxMjk5Miw4LjIwNjY0MjUgOS45NTE3NTc2LDkuMjYzNTU3NyA5LjAwNDgxMSwxMC4xMjc5NTQgNy44NzMxNjE1LDEwLjAwMzM5NyA2LjcxMDU2LDguOTExMjUyNiBjIDAsMCAtMC40MDc1OTEyLDAuNDAyNzA2OSAtMC40MDc1OTEyLDAuNDAyNzA2OSAtMC4xODk1ODExLDEuODEwMzQyNSAxLjcwMzI4NjksMy40MjgzMjg1IDMuNjQ4Nzg4OCwyLjM0NTI2NTUgeiINCiAgICAgICBpZD0icGF0aDIxNDAiDQogICAgICAgc29kaXBvZGk6bm9kZXR5cGVzPSJjY3pjY2NjY2NjY2NzYyINCiAgICAgICBzdHlsZT0iZGlzcGxheTppbmxpbmU7b3ZlcmZsb3c6dmlzaWJsZTt2aXNpYmlsaXR5OnZpc2libGU7ZmlsbDp1cmwoI2xpbmVhckdyYWRpZW50Mjk0OTUpO2ZpbGwtb3BhY2l0eToxO2ZpbGwtcnVsZTpub256ZXJvO3N0cm9rZTojM2YzZjNmO3N0cm9rZS13aWR0aDoxO3N0cm9rZS1saW5lY2FwOmJ1dHQ7c3Ryb2tlLWxpbmVqb2luOm1pdGVyO3N0cm9rZS1taXRlcmxpbWl0OjQ7c3Ryb2tlLWRhc2hhcnJheTpub25lO3N0cm9rZS1kYXNob2Zmc2V0OjA7c3Ryb2tlLW9wYWNpdHk6MTttYXJrZXI6bm9uZTttYXJrZXItc3RhcnQ6bm9uZTttYXJrZXItbWlkOm5vbmU7bWFya2VyLWVuZDpub25lIiAvPjxwYXRoDQogICAgICAgaW5rc2NhcGU6Y29ubmVjdG9yLWN1cnZhdHVyZT0iMCINCiAgICAgICBkPSJtIDEwLjAxOTM2NiwxMS4yNDk4ODYgNi4xNjIzNDksNi40MjcwMSBjIDAuMTkwOTExLDAuMjE4MTgxIDAuNzk1ODI4LDAuMzg2ODA5IDEuMjAwMDA0LDAgMC4zOTAzMDcsLTAuMzczNTMzIDAuMzAwMDA0LC0wLjkwMDAwNSAtMC4wODE4MiwtMS4yODE4MjcgTCAxMS4zNjU4MywxMC4wOTg0OTUgQyAxMS44NDcxOTEsOC4wMTI1OTYzIDEwLjc2OTMzLDYuODg3OTMwOSA5LjE2NDc5Myw2LjkyODA0NDQgTCA5LjA3ODEwNjMsNy4wMTU3NzQyIDEwLjIzNDMxLDguMDU0MzE3NSAxMC4yNzYwODMsOS4zOTYyODUgOS4xMTYzNDg1LDEwLjQ1NDc5MiA3Ljc1NDk2MzYsMTAuMzA3NzQ5IDYuNzM1NTcwNCw5LjM0Nzc2MDkgNi42MjI0MTEsOS40ODU3NzAxIGMgLTAuMTAwMjg0NywxLjkxNTQxNjkgMi4wODMyMzg4LDIuNzg3MDA3OSAzLjM5Njk1NSwxLjc2NDExNTkgeiINCiAgICAgICBpZD0icGF0aDMwNTciDQogICAgICAgc29kaXBvZGk6bm9kZXR5cGVzPSJjY3pjY2NjY2NjY2NjYyINCiAgICAgICBzdHlsZT0iZGlzcGxheTppbmxpbmU7b3ZlcmZsb3c6dmlzaWJsZTt2aXNpYmlsaXR5OnZpc2libGU7b3BhY2l0eTowLjQyNjEzNjM5O2ZpbGw6bm9uZTtmaWxsLW9wYWNpdHk6MTtmaWxsLXJ1bGU6bm9uemVybztzdHJva2U6I2ZmZmZmZjtzdHJva2Utd2lkdGg6MC4zMjA5MDcyNDtzdHJva2UtbGluZWNhcDpidXR0O3N0cm9rZS1saW5lam9pbjptaXRlcjtzdHJva2UtbWl0ZXJsaW1pdDo0O3N0cm9rZS1kYXNoYXJyYXk6bm9uZTtzdHJva2UtZGFzaG9mZnNldDowO3N0cm9rZS1vcGFjaXR5OjE7bWFya2VyOm5vbmU7bWFya2VyLXN0YXJ0Om5vbmU7bWFya2VyLW1pZDpub25lO21hcmtlci1lbmQ6bm9uZSIgLz48cmVjdA0KICAgICAgIGhlaWdodD0iMC42NTk2MjI1NSINCiAgICAgICBpZD0icmVjdDMwNTkiDQogICAgICAgcng9IjAuMjgzNjQzOTMiDQogICAgICAgcnk9IjAuMjgzNjQzOTMiDQogICAgICAgc3R5bGU9ImRpc3BsYXk6aW5saW5lO292ZXJmbG93OnZpc2libGU7dmlzaWJpbGl0eTp2aXNpYmxlO29wYWNpdHk6MC4xNzA0NTQ1NjtmaWxsOm5vbmU7ZmlsbC1vcGFjaXR5OjE7ZmlsbC1ydWxlOm5vbnplcm87c3Ryb2tlOnVybCgjbGluZWFyR3JhZGllbnQyOTQ5Nyk7c3Ryb2tlLXdpZHRoOjAuMzIwOTA2NTg7c3Ryb2tlLWxpbmVjYXA6YnV0dDtzdHJva2UtbGluZWpvaW46bWl0ZXI7c3Ryb2tlLW1pdGVybGltaXQ6NDtzdHJva2UtZGFzaGFycmF5Om5vbmU7c3Ryb2tlLWRhc2hvZmZzZXQ6MDtzdHJva2Utb3BhY2l0eToxO21hcmtlcjpub25lO21hcmtlci1zdGFydDpub25lO21hcmtlci1taWQ6bm9uZTttYXJrZXItZW5kOm5vbmUiDQogICAgICAgdHJhbnNmb3JtPSJtYXRyaXgoMC42OTc5MzgxNCwwLjcxNjE1ODA1LC0wLjcxNjE1ODA1LDAuNjk3OTM4MTQsMCwwKSINCiAgICAgICB3aWR0aD0iNy40NjY5NjQyIg0KICAgICAgIHg9IjE1LjQ1NDAyMyINCiAgICAgICB5PSItMC40NjYzMDg2NSIgLz48cGF0aA0KICAgICAgIGlua3NjYXBlOmNvbm5lY3Rvci1jdXJ2YXR1cmU9IjAiDQogICAgICAgZD0ibSAxMS40MjUzOTQsMTQuNTE4NDE4IGMgMC4yNjc0ODksLTAuMjI5Mjc5IDQuMjYyODgsLTQuMzE1NzI4IDQuMjYyODgsLTQuMzE1NzI4IGwgMC45ODY0NTEsLTAuMDcwNDYgMS41NTAxNCwtMi4xNDkwNTY3IC0xLjI5MTQzOCwtMS4xNTA1MTQ0IC0yLjAwODEzMywxLjcyNjI4OTcgMCwwLjk4NjQ1MzcgLTQuMDg2NzMxLDQuMjQ1MjY1NyBjIC0wLjE5Mzc2NywwLjE5Mzc2NyAwLjM0MDIxNiwwLjkzOTEzMyAwLjU4NjgzMSwwLjcyNzc1MSB6Ig0KICAgICAgIGlkPSJwYXRoMjE0NCINCiAgICAgICBzb2RpcG9kaTpub2RldHlwZXM9ImNjY2NjY2NjYyINCiAgICAgICBzdHlsZT0iZGlzcGxheTppbmxpbmU7b3ZlcmZsb3c6dmlzaWJsZTt2aXNpYmlsaXR5OnZpc2libGU7ZmlsbDp1cmwoI2xpbmVhckdyYWRpZW50Mjk0OTkpO2ZpbGwtb3BhY2l0eToxO2ZpbGwtcnVsZTpub256ZXJvO3N0cm9rZTojM2YzZjNmO3N0cm9rZS13aWR0aDoxO3N0cm9rZS1saW5lY2FwOmJ1dHQ7c3Ryb2tlLWxpbmVqb2luOm1pdGVyO3N0cm9rZS1taXRlcmxpbWl0OjQ7c3Ryb2tlLWRhc2hhcnJheTpub25lO3N0cm9rZS1kYXNob2Zmc2V0OjA7c3Ryb2tlLW9wYWNpdHk6MTttYXJrZXI6bm9uZTttYXJrZXItc3RhcnQ6bm9uZTttYXJrZXItbWlkOm5vbmU7bWFya2VyLWVuZDpub25lIiAvPjxwYXRoDQogICAgICAgaW5rc2NhcGU6Y29ubmVjdG9yLWN1cnZhdHVyZT0iMCINCiAgICAgICBkPSJNIDExLjM5NDMyNywxNC4xODQ2OTcgQyAxMS42MDE4OCwxNC4wMDY3OTIgMTUuNTczOTU0LDkuOTM5MTUxNSAxNS41NzM5NTQsOS45MzkxNTE1IEwgMTYuNTEzNzU4LDkuODU5NTY5NyAxNy44NjYwMzYsOC4wNDI1Njg5IDE2LjkzODcsNy4yMjQ1NzkgMTUuMTgxMjI0LDguNzM4NDUwNiAxNS4yMzEwNDksOS42NTMzNDUgMTEuMTYzMTksMTMuOTE4OTUgYyAtMC4xNTAzNTIsMC4xNTAzNTIgMC4wMzk3OCwwLjQyOTc2NiAwLjIzMTEzNywwLjI2NTc0NyB6Ig0KICAgICAgIGlkPSJwYXRoMzA4NSINCiAgICAgICBzb2RpcG9kaTpub2RldHlwZXM9ImNjY2NjY2NjYyINCiAgICAgICBzdHlsZT0iZGlzcGxheTppbmxpbmU7b3ZlcmZsb3c6dmlzaWJsZTt2aXNpYmlsaXR5OnZpc2libGU7b3BhY2l0eTowLjUzOTc3MjcyO2ZpbGw6bm9uZTtmaWxsLW9wYWNpdHk6MTtmaWxsLXJ1bGU6bm9uemVybztzdHJva2U6dXJsKCNsaW5lYXJHcmFkaWVudDI5NTAxKTtzdHJva2Utd2lkdGg6MC4zMjA5MDc1OTtzdHJva2UtbGluZWNhcDpidXR0O3N0cm9rZS1saW5lam9pbjptaXRlcjtzdHJva2UtbWl0ZXJsaW1pdDo0O3N0cm9rZS1kYXNoYXJyYXk6bm9uZTtzdHJva2UtZGFzaG9mZnNldDowO3N0cm9rZS1vcGFjaXR5OjE7bWFya2VyOm5vbmU7bWFya2VyLXN0YXJ0Om5vbmU7bWFya2VyLW1pZDpub25lO21hcmtlci1lbmQ6bm9uZSIgLz48cGF0aA0KICAgICAgIGlua3NjYXBlOmNvbm5lY3Rvci1jdXJ2YXR1cmU9IjAiDQogICAgICAgZD0ibSA2LjkyMTk0MjEsMTguODQ2MjM0IGMgMC40MjI1MDQzLDAuNDcwMjA0IDEuNTk2MDk0MSwwLjY4Mjk0MyAyLjExNjUyODgsLTAuMjI3ODE4IDAuMjI2OTEzNSwtMC4zOTcxMDEgMC42NzE5NjEsLTEuNTA5MTY0IDIuNjU3NDczMSwtMy4yOTYxMjUgMC4zMzM0NzIsLTAuMjk5Nzg1IDAuNjg2NzEzLC0wLjk4NTU1MSAwLjM4NzI1NiwtMS4zNTU0NzEgbCAtMC43NzUwNjksLTAuNzc1MDY5IGMgLTAuMzE3MDczLC0wLjM1MjMwNSAtMS4xOTg0MDMsLTAuMTg3OTcxIC0xLjU1OTk4OTUsMC4zMDUxNDEgLTEuMDc3ODQ5MiwxLjQ3NDk1NiAtMi44Mzg3NzA0LDIuNjQ5MDU0IC0zLjIzNTg3MjksMi43OTA4NzUgLTAuNzU5ODgzNCwwLjI3MTM4OSAtMC42NzQzNiwxLjM5MTUwMyAtMC4xNzE2MjczLDEuOTI0MzE5IGwgMC41ODEzMDA4LDAuNjM0MTQ4IHoiDQogICAgICAgaWQ9InBhdGgyMTQyIg0KICAgICAgIHNvZGlwb2RpOm5vZGV0eXBlcz0iY2NjY2Njc2NjIg0KICAgICAgIHN0eWxlPSJkaXNwbGF5OmlubGluZTtvdmVyZmxvdzp2aXNpYmxlO3Zpc2liaWxpdHk6dmlzaWJsZTtmaWxsOnVybCgjbGluZWFyR3JhZGllbnQyOTUwMyk7ZmlsbC1vcGFjaXR5OjE7ZmlsbC1ydWxlOm5vbnplcm87c3Ryb2tlOiMyMDRhODc7c3Ryb2tlLXdpZHRoOjE7c3Ryb2tlLWxpbmVjYXA6YnV0dDtzdHJva2UtbGluZWpvaW46bWl0ZXI7c3Ryb2tlLW1pdGVybGltaXQ6NDtzdHJva2UtZGFzaGFycmF5Om5vbmU7c3Ryb2tlLWRhc2hvZmZzZXQ6MDtzdHJva2Utb3BhY2l0eToxO21hcmtlcjpub25lO21hcmtlci1zdGFydDpub25lO21hcmtlci1taWQ6bm9uZTttYXJrZXItZW5kOm5vbmUiIC8+PGNpcmNsZQ0KICAgICAgIHI9IjAuMzg3NTM0NzEiDQogICAgICAgY3k9IjE3LjA0OTQ4MiINCiAgICAgICBjeD0iMTYuNzg2NDY1Ig0KICAgICAgIGlkPSJwYXRoMjE0NiINCiAgICAgICBzdHlsZT0iZGlzcGxheTppbmxpbmU7b3ZlcmZsb3c6dmlzaWJsZTt2aXNpYmlsaXR5OnZpc2libGU7ZmlsbDojZmZmZmZmO2ZpbGwtb3BhY2l0eToxO2ZpbGwtcnVsZTpub256ZXJvO3N0cm9rZTojODg4YTg1O3N0cm9rZS13aWR0aDowLjMyMDkwNzM4O3N0cm9rZS1saW5lY2FwOmJ1dHQ7c3Ryb2tlLWxpbmVqb2luOm1pdGVyO3N0cm9rZS1taXRlcmxpbWl0OjQ7c3Ryb2tlLWRhc2hhcnJheTpub25lO3N0cm9rZS1kYXNob2Zmc2V0OjA7c3Ryb2tlLW9wYWNpdHk6MC45NDExNzY0NzttYXJrZXI6bm9uZTttYXJrZXItc3RhcnQ6bm9uZTttYXJrZXItbWlkOm5vbmU7bWFya2VyLWVuZDpub25lIiAvPjxjaXJjbGUNCiAgICAgICByPSIwLjMyMzg1MjA2Ig0KICAgICAgIGN5PSIxMy42Mjc5MDMiDQogICAgICAgY3g9IjEwLjYyNDYyOSINCiAgICAgICBpZD0icGF0aDMxMDEiDQogICAgICAgc3R5bGU9ImRpc3BsYXk6aW5saW5lO292ZXJmbG93OnZpc2libGU7dmlzaWJpbGl0eTp2aXNpYmxlO29wYWNpdHk6MC42MDIyNzI3MjtmaWxsOiNmZmZmZmY7ZmlsbC1vcGFjaXR5OjE7ZmlsbC1ydWxlOm5vbnplcm87c3Ryb2tlOm5vbmU7c3Ryb2tlLXdpZHRoOjE7c3Ryb2tlLWxpbmVjYXA6YnV0dDtzdHJva2UtbGluZWpvaW46bWl0ZXI7c3Ryb2tlLW1pdGVybGltaXQ6NDtzdHJva2UtZGFzaGFycmF5Om5vbmU7c3Ryb2tlLWRhc2hvZmZzZXQ6MDtzdHJva2Utb3BhY2l0eToxO21hcmtlcjpub25lO21hcmtlci1zdGFydDpub25lO21hcmtlci1taWQ6bm9uZTttYXJrZXItZW5kOm5vbmUiIC8+PHBhdGgNCiAgICAgICBpbmtzY2FwZTpjb25uZWN0b3ItY3VydmF0dXJlPSIwIg0KICAgICAgIGQ9Im0gMTAuMTk5NTYyLDE0LjM1Nzc3OCBjIDAsMCAtMi4zMDA4NzA0LDIuMzQyNTAzIC0zLjM3ODcyMTMsMi43Mzk2MDQiDQogICAgICAgaWQ9InBhdGgyOTM1NSINCiAgICAgICBzb2RpcG9kaTpub2RldHlwZXM9ImNjIg0KICAgICAgIHN0eWxlPSJkaXNwbGF5OmlubGluZTtvdmVyZmxvdzp2aXNpYmxlO3Zpc2liaWxpdHk6dmlzaWJsZTtmaWxsOm5vbmU7ZmlsbC1vcGFjaXR5OjE7ZmlsbC1ydWxlOm5vbnplcm87c3Ryb2tlOnVybCgjbGluZWFyR3JhZGllbnQyOTUwNSk7c3Ryb2tlLXdpZHRoOjAuNzM2MzI1MjtzdHJva2UtbGluZWNhcDpyb3VuZDtzdHJva2UtbGluZWpvaW46cm91bmQ7c3Ryb2tlLW1pdGVybGltaXQ6NDtzdHJva2UtZGFzaGFycmF5Om5vbmU7c3Ryb2tlLWRhc2hvZmZzZXQ6MDtzdHJva2Utb3BhY2l0eToxO21hcmtlcjpub25lO21hcmtlci1zdGFydDpub25lO21hcmtlci1taWQ6bm9uZTttYXJrZXItZW5kOm5vbmUiIC8+PHBhdGgNCiAgICAgICBpbmtzY2FwZTpjb25uZWN0b3ItY3VydmF0dXJlPSIwIg0KICAgICAgIGQ9Im0gNy4wMzEyNzExLDE4LjQ4NTI1NSBjIDAuNDYyNTE1NiwwLjU2MDE4IDEuNDc2MDI2NiwwLjY5MzU1NSAxLjc5NDI0NTQsLTAuMTE4OTI1IDAuMjE4NjM3NiwtMC41NTgyMjIgMS4wNjk3ODM5LC0xLjgxODE5NCAyLjYzMDY2ODUsLTMuMjIyOTkgMC4yNjIxNTIsLTAuMjM1NjY3IDAuNTM5ODQ2LC0wLjc3NDc3MyAwLjMwNDQzMiwtMS4wNjU1ODIgTCAxMS4xNTEzMSwxMy40Njg0NTEgYyAtMC4yNDkyNjUsLTAuMjc2OTYgLTAuOTQyMTA4LC0wLjE0Nzc3MiAtMS4yMjYzNjEyLDAuMjM5ODgxIC0wLjg0NzMzNjksMS4xNTk1MTMgLTIuNzIyMzcxLDIuNjc2MjI3IC0zLjE3NTYxOTUsMi44MjU3OTMgLTAuNzAxNzYzMSwwLjIzMTU3IC0wLjU3MDI1NTEsMS4wMzM3MzkgLTAuMTc1MDM5MSwxLjQ1MjYwNCBsIDAuNDU2OTgwOSwwLjQ5ODUyNiB6Ig0KICAgICAgIGlkPSJwYXRoMjI3MCINCiAgICAgICBzb2RpcG9kaTpub2RldHlwZXM9ImNzY2NjY3NjYyINCiAgICAgICBzdHlsZT0iZGlzcGxheTppbmxpbmU7b3ZlcmZsb3c6dmlzaWJsZTt2aXNpYmlsaXR5OnZpc2libGU7b3BhY2l0eTowLjE5ODg2MzY3O2ZpbGw6bm9uZTtmaWxsLW9wYWNpdHk6MTtmaWxsLXJ1bGU6bm9uemVybztzdHJva2U6I2ZmZmZmZjtzdHJva2Utd2lkdGg6MC4zMjA5MDczMjtzdHJva2UtbGluZWNhcDpidXR0O3N0cm9rZS1saW5lam9pbjptaXRlcjtzdHJva2UtbWl0ZXJsaW1pdDo0O3N0cm9rZS1kYXNoYXJyYXk6bm9uZTtzdHJva2UtZGFzaG9mZnNldDowO3N0cm9rZS1vcGFjaXR5OjE7bWFya2VyOm5vbmU7bWFya2VyLXN0YXJ0Om5vbmU7bWFya2VyLW1pZDpub25lO21hcmtlci1lbmQ6bm9uZSIgLz48cGF0aA0KICAgICAgIGlua3NjYXBlOmNvbm5lY3Rvci1jdXJ2YXR1cmU9IjAiDQogICAgICAgZD0ibSAxMC44ODgxMywxNC44ODI4NTMgYyAwLDAgLTIuMzQ5OTI5NiwyLjEyMzU3NyAtMi44NjA0ODg0LDMuNDg1MDcyIg0KICAgICAgIGlkPSJwYXRoMjI0NyINCiAgICAgICBzb2RpcG9kaTpub2RldHlwZXM9ImNjIg0KICAgICAgIHN0eWxlPSJkaXNwbGF5OmlubGluZTtvdmVyZmxvdzp2aXNpYmxlO3Zpc2liaWxpdHk6dmlzaWJsZTtvcGFjaXR5OjAuMjc4NDA5MTE7ZmlsbDpub25lO2ZpbGwtb3BhY2l0eToxO2ZpbGwtcnVsZTpub256ZXJvO3N0cm9rZTp1cmwoI2xpbmVhckdyYWRpZW50Mjk1MDcpO3N0cm9rZS13aWR0aDowLjczNjMyNTI7c3Ryb2tlLWxpbmVjYXA6cm91bmQ7c3Ryb2tlLWxpbmVqb2luOnJvdW5kO3N0cm9rZS1taXRlcmxpbWl0OjQ7c3Ryb2tlLWRhc2hvZmZzZXQ6MDtzdHJva2Utb3BhY2l0eToxO21hcmtlcjpub25lO21hcmtlci1zdGFydDpub25lO21hcmtlci1taWQ6bm9uZTttYXJrZXItZW5kOm5vbmUiIC8+PC9nPjwvc3ZnPg=='
			});
		},
	}
}