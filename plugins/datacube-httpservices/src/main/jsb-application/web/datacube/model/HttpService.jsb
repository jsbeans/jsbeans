{
	$name: 'DataCube.Model.HttpService',
	$parent: 'DataCube.Model.QueryableContainer',
	
	$scheme: {
		server: {
			render: 'group',
			name: 'Настройки соединения',
			items: {
				address: {
					render: 'item',
					name: 'Адрес сервера',
					description: `
						<h3>Адрес сервера</h3>
						<p>Неизменная часть URL-запроса к HTTP-методам удаленного сервиса</p>
					`,
					require: true,
					editorOpts: {
						placeholder: 'http://my.server.com:8888/api'
					}
				},
				auth: {
					render: 'group',
					name: 'Использовать авторизацию',
					optional: true,
					items: {
						user: {
							render: 'item',
							name: 'Имя пользователя'
						},
						password: {
							render: 'item',
							name: 'Пароль',
							editorOpts: {
								type: 'password'
							}
						}
					}
				},
				proxy: {
					render: 'select',
					name: 'Прокси',
					items: {
						noProxy: {
							render: 'item',
							name: 'не использовать',
							editor: 'none'
						},
						httpProxy: {
							render: 'group',
							name: 'HTTP',
							items: {
								
							}
						},
						socksProxy: {
							render: 'group',
							name: 'SOCKS',
							items: {
								
							}
						}
					}
				}
				
			}
		}
	},
	
	methodCount: 0,
	serviceAddr: null,
	
	getMethodCount: function(){
		return this.methodCount;
	},
	
	getServiceAddress: function(){
		return this.serviceAddr;
	},
	
	$server: {
		$require: ['JSB.Workspace.WorkspaceController',
		           'DataCube.Model.HttpMethod',
		           'JSB.Store.StoreManager'],
		
		methods: {},
		loaded: false,
		
		
		$bootstrap: function(){
			WorkspaceController.registerExplorerNode(null, this, {
				priority: 0.5, 
				nodeType:'DataCube.HttpServiceNode',
				create: true,
				move: true,
				remove: true,
				title: 'HTTP-Сервис',
				description: 'Создает подключение к удаленному HTTP-сервису',
				icon: 'data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiIHN0YW5kYWxvbmU9Im5vIj8+CjxzdmcKICAgeG1sbnM6ZGM9Imh0dHA6Ly9wdXJsLm9yZy9kYy9lbGVtZW50cy8xLjEvIgogICB4bWxuczpjYz0iaHR0cDovL2NyZWF0aXZlY29tbW9ucy5vcmcvbnMjIgogICB4bWxuczpyZGY9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkvMDIvMjItcmRmLXN5bnRheC1ucyMiCiAgIHhtbG5zOnN2Zz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciCiAgIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIKICAgeG1sbnM6c29kaXBvZGk9Imh0dHA6Ly9zb2RpcG9kaS5zb3VyY2Vmb3JnZS5uZXQvRFREL3NvZGlwb2RpLTAuZHRkIgogICB4bWxuczppbmtzY2FwZT0iaHR0cDovL3d3dy5pbmtzY2FwZS5vcmcvbmFtZXNwYWNlcy9pbmtzY2FwZSIKICAgaGVpZ2h0PSIyMCIKICAgdmVyc2lvbj0iMS4xIgogICB2aWV3Qm94PSIwIDAgMjAgMjAiCiAgIHdpZHRoPSIyMCIKICAgaWQ9InN2ZzIiCiAgIGlua3NjYXBlOnZlcnNpb249IjAuOTEgcjEzNzI1IgogICBzb2RpcG9kaTpkb2NuYW1lPSJodHRwLnN2ZyI+CiAgPG1ldGFkYXRhCiAgICAgaWQ9Im1ldGFkYXRhMTUiPgogICAgPHJkZjpSREY+CiAgICAgIDxjYzpXb3JrCiAgICAgICAgIHJkZjphYm91dD0iIj4KICAgICAgICA8ZGM6Zm9ybWF0PmltYWdlL3N2Zyt4bWw8L2RjOmZvcm1hdD4KICAgICAgICA8ZGM6dHlwZQogICAgICAgICAgIHJkZjpyZXNvdXJjZT0iaHR0cDovL3B1cmwub3JnL2RjL2RjbWl0eXBlL1N0aWxsSW1hZ2UiIC8+CiAgICAgICAgPGRjOnRpdGxlPjwvZGM6dGl0bGU+CiAgICAgIDwvY2M6V29yaz4KICAgIDwvcmRmOlJERj4KICA8L21ldGFkYXRhPgogIDxzb2RpcG9kaTpuYW1lZHZpZXcKICAgICBwYWdlY29sb3I9IiNmZmZmZmYiCiAgICAgYm9yZGVyY29sb3I9IiM2NjY2NjYiCiAgICAgYm9yZGVyb3BhY2l0eT0iMSIKICAgICBvYmplY3R0b2xlcmFuY2U9IjEwIgogICAgIGdyaWR0b2xlcmFuY2U9IjEwIgogICAgIGd1aWRldG9sZXJhbmNlPSIxMCIKICAgICBpbmtzY2FwZTpwYWdlb3BhY2l0eT0iMCIKICAgICBpbmtzY2FwZTpwYWdlc2hhZG93PSIyIgogICAgIGlua3NjYXBlOndpbmRvdy13aWR0aD0iMTkyMCIKICAgICBpbmtzY2FwZTp3aW5kb3ctaGVpZ2h0PSIxMTc4IgogICAgIGlkPSJuYW1lZHZpZXcxMyIKICAgICBzaG93Z3JpZD0iZmFsc2UiCiAgICAgaW5rc2NhcGU6em9vbT0iMjAuODU5NjUiCiAgICAgaW5rc2NhcGU6Y3g9IjE0LjM4NzI1NCIKICAgICBpbmtzY2FwZTpjeT0iOS4xNDIxNzk3IgogICAgIGlua3NjYXBlOndpbmRvdy14PSIxOTEyIgogICAgIGlua3NjYXBlOndpbmRvdy15PSItOCIKICAgICBpbmtzY2FwZTp3aW5kb3ctbWF4aW1pemVkPSIxIgogICAgIGlua3NjYXBlOmN1cnJlbnQtbGF5ZXI9InN2ZzIiCiAgICAgc2hvd2d1aWRlcz0idHJ1ZSIKICAgICBpbmtzY2FwZTpndWlkZS1iYm94PSJ0cnVlIj4KICAgIDxzb2RpcG9kaTpndWlkZQogICAgICAgcG9zaXRpb249IjEuMDA2NzI4MywxMy4wODc0NjgiCiAgICAgICBvcmllbnRhdGlvbj0iMSwwIgogICAgICAgaWQ9Imd1aWRlNDE0NSIgLz4KICAgIDxzb2RpcG9kaTpndWlkZQogICAgICAgcG9zaXRpb249IjE4Ljk4NDAxOSw2LjYxNTY0MzEiCiAgICAgICBvcmllbnRhdGlvbj0iMSwwIgogICAgICAgaWQ9Imd1aWRlNDE0NyIgLz4KICAgIDxzb2RpcG9kaTpndWlkZQogICAgICAgcG9zaXRpb249IjIyLjQzNTY1OSwxMS45MzY5MjEiCiAgICAgICBvcmllbnRhdGlvbj0iMCwxIgogICAgICAgaWQ9Imd1aWRlNDE0OSIgLz4KICAgIDxzb2RpcG9kaTpndWlkZQogICAgICAgcG9zaXRpb249IjE4LjA3MzE3LDEwLjg4MjI1NCIKICAgICAgIG9yaWVudGF0aW9uPSIwLDEiCiAgICAgICBpZD0iZ3VpZGU0MTUxIiAvPgogICAgPHNvZGlwb2RpOmd1aWRlCiAgICAgICBwb3NpdGlvbj0iMTUuNzI0MTM3LDkuMDEyNjE1MyIKICAgICAgIG9yaWVudGF0aW9uPSIwLDEiCiAgICAgICBpZD0iZ3VpZGU0MTUzIiAvPgogICAgPHNvZGlwb2RpOmd1aWRlCiAgICAgICBwb3NpdGlvbj0iMi4wMTM0NTY2LDguMTk3NjQ0NyIKICAgICAgIG9yaWVudGF0aW9uPSIxLDAiCiAgICAgICBpZD0iZ3VpZGU0MTU1IiAvPgogICAgPHNvZGlwb2RpOmd1aWRlCiAgICAgICBwb3NpdGlvbj0iMjAuNTY2MDIxLDEzLjk1MDM3OCIKICAgICAgIG9yaWVudGF0aW9uPSIwLDEiCiAgICAgICBpZD0iZ3VpZGU0MTU3IiAvPgogICAgPHNvZGlwb2RpOmd1aWRlCiAgICAgICBwb3NpdGlvbj0iOS45NzE0MDQxLDQuNjAyMTg2NSIKICAgICAgIG9yaWVudGF0aW9uPSIxLDAiCiAgICAgICBpZD0iZ3VpZGU0MTU5IiAvPgogICAgPHNvZGlwb2RpOmd1aWRlCiAgICAgICBwb3NpdGlvbj0iMTUuOTYzODM0LDIuOTI0MzA2IgogICAgICAgb3JpZW50YXRpb249IjEsMCIKICAgICAgIGlkPSJndWlkZTQxNjEiIC8+CiAgICA8c29kaXBvZGk6Z3VpZGUKICAgICAgIHBvc2l0aW9uPSIxMy45OTgzMTcsNS45OTI0MzA0IgogICAgICAgb3JpZW50YXRpb249IjAsMSIKICAgICAgIGlkPSJndWlkZTQxNjciIC8+CiAgICA8c29kaXBvZGk6Z3VpZGUKICAgICAgIHBvc2l0aW9uPSIzLjU0NzUxODgsNC45ODU3MDIxIgogICAgICAgb3JpZW50YXRpb249IjAsMSIKICAgICAgIGlkPSJndWlkZTQxNjkiIC8+CiAgICA8c29kaXBvZGk6Z3VpZGUKICAgICAgIHBvc2l0aW9uPSIxNy45NzcyOTEsLTEuNjc3ODgwNSIKICAgICAgIG9yaWVudGF0aW9uPSIxLDAiCiAgICAgICBpZD0iZ3VpZGU0MTcxIiAvPgogIDwvc29kaXBvZGk6bmFtZWR2aWV3PgogIDxkZXNjCiAgICAgaWQ9ImRlc2M2IiAvPgogIDxkZWZzCiAgICAgaWQ9ImRlZnM4IiAvPgogIDxnCiAgICAgaWQ9Imljb24tMTMyLWNsb3VkIgogICAgIHN0eWxlPSJmaWxsOiMxNTdlZmI7ZmlsbC1ydWxlOmV2ZW5vZGQ7c3Ryb2tlOm5vbmU7c3Ryb2tlLXdpZHRoOjEiCiAgICAgdHJhbnNmb3JtPSJtYXRyaXgoMC43NDE1MTM2NiwwLDAsMC44MjA0NzI3NCwtMi4yNDE5MDMzLC02LjUwMTczMDEpIj4KICAgIDxwYXRoCiAgICAgICBpZD0iY2xvdWQiCiAgICAgICBkPSJNIDI2Ljg4Mjg2MywxNS4zNjU1MSBDIDI4LjcxMzI5MSwxNi4xMDg1MDggMzAsMTcuOTAzNTgxIDMwLDIwIGMgMCwyLjc1NTgwNSAtMi4yMzgzMjUsNSAtNC45OTk0NCw1IEwgNy45OTk0Mzk5LDI1IEMgNS4yMzI0OTQyLDI1IDMsMjIuNzYxNDI0IDMsMjAgMywxNy45NDkxMzEgNC4yMzk2NTg4LDE2LjE4MTYwOCA2LjAxMTg5NjYsMTUuNDExNTM5IGwgMCwwIEMgNi4wMDQwMDIxLDE1LjI3NTM2NyA2LDE1LjEzODE1MSA2LDE1IDYsMTEuMTM0MDA3IDkuMTM0MDA2Niw4IDEzLDggMTUuNjEyNzU3LDggMTcuODkxMTgyLDkuNDMxNDQ4OCAxOS4wOTM4MDgsMTEuNTUyODgyIDE5LjgyMDYxNiwxMS4xOTg3MTYgMjAuNjM3MTAyLDExIDIxLjUsMTEgYyAyLjY0ODY1NSwwIDQuODYwMDIyLDEuODcyMjQ5IDUuMzgyODYzLDQuMzY1NTEgeiIKICAgICAgIGlua3NjYXBlOmNvbm5lY3Rvci1jdXJ2YXR1cmU9IjAiIC8+CiAgPC9nPgogIDxwYXRoCiAgICAgc3R5bGU9Im9wYWNpdHk6MTtmaWxsOiNmZmZmZmY7ZmlsbC1vcGFjaXR5OjE7c3Ryb2tlOiNmZmZmZmY7c3Ryb2tlLXdpZHRoOjAuMTI3MDI5MzE7c3Ryb2tlLWxpbmVjYXA6cm91bmQ7c3Ryb2tlLWxpbmVqb2luOnJvdW5kO3N0cm9rZS1taXRlcmxpbWl0OjEwO3N0cm9rZS1kYXNoYXJyYXk6bm9uZTtzdHJva2Utb3BhY2l0eToxIgogICAgIGQ9Im0gMTMuMjY3ODA4LDguODY0MjQxMiAtMC4wMzg0NSwtMC44MTgyMjQgLTIuODI2NDAzLC0wLjAzNDE4NSAtMi44MjY0MDc4LC0wLjAzNDE4NSAwLC0wLjgyMDgzMDIgMCwtMC44MjA4MzA0IDIuODI2NDA3OCwtMC4wMzQxODUgMi44MjY0MDMsLTAuMDM0MTg1IDAuMDYzNTIsLTAuODYxMDQxMyAwLjA2MzUyLC0wLjg2MTA0MTUgMS4yNjg3MTIsMS4yNzQ2OTI1IDEuMjY4NzEzLDEuMjc0NjkzMiAtMS4yOTM3NzgsMS4yOTM3Nzc3IC0xLjI5Mzc3OCwxLjI5Mzc3NzcgLTAuMDM4NDUsLTAuODE4MjI0IHoiCiAgICAgaWQ9InBhdGg0MTUzIgogICAgIGlua3NjYXBlOmNvbm5lY3Rvci1jdXJ2YXR1cmU9IjAiIC8+CiAgPHBhdGgKICAgICBzdHlsZT0ib3BhY2l0eToxO2ZpbGw6I2ZmZmZmZjtmaWxsLW9wYWNpdHk6MTtzdHJva2U6I2ZmZmZmZjtzdHJva2Utd2lkdGg6MC4xMjM4ODIzNTtzdHJva2UtbGluZWNhcDpyb3VuZDtzdHJva2UtbGluZWpvaW46cm91bmQ7c3Ryb2tlLW1pdGVybGltaXQ6MTA7c3Ryb2tlLWRhc2hhcnJheTpub25lO3N0cm9rZS1vcGFjaXR5OjEiCiAgICAgZD0ibSAzLjMyMTM2MjQsMTEuMzExNjYyIC0xLjI2OTg0MzksLTEuMjc0OTQyIDEuMjk0NjM5LC0xLjI5MDIzMjYgMS4yOTQ2MzgsLTEuMjkwMjMyNSAwLjAzNzE0OCwwLjg1ODgwODkgMC4wMzcxNDgsMC44NTg4MDggMi42OTQ0NDIsMC4wMzMzODQgMi42OTQ0NDA1LDAuMDMzMzg0IDAsMC44MDI4MjAyIDAsMC44MDI4MTggLTIuNzE5OTgzOCwwIC0yLjcxOTk4NTMsMCAtMC4wMzYzOTksMC44NzAxNjEgLTAuMDM2Mzk5LDAuODcwMTYxIC0xLjI2OTg0MzEsLTEuMjc0OTQ0IHoiCiAgICAgaWQ9InBhdGg0MTU1IgogICAgIGlua3NjYXBlOmNvbm5lY3Rvci1jdXJ2YXR1cmU9IjAiIC8+CiAgPGcKICAgICBzdHlsZT0iZm9udC1zdHlsZTpub3JtYWw7Zm9udC12YXJpYW50Om5vcm1hbDtmb250LXdlaWdodDpub3JtYWw7Zm9udC1zdHJldGNoOm5vcm1hbDtmb250LXNpemU6Ni43ODE2NDk1OXB4O2xpbmUtaGVpZ2h0OjEyNSU7Zm9udC1mYW1pbHk6Q291cmllcjstaW5rc2NhcGUtZm9udC1zcGVjaWZpY2F0aW9uOkNvdXJpZXI7dGV4dC1hbGlnbjpzdGFydDtsZXR0ZXItc3BhY2luZzowcHg7d29yZC1zcGFjaW5nOjBweDt3cml0aW5nLW1vZGU6bHItdGI7dGV4dC1hbmNob3I6c3RhcnQ7ZmlsbDojMDAwMDAwO2ZpbGwtb3BhY2l0eToxO3N0cm9rZTpub25lO3N0cm9rZS13aWR0aDoxcHg7c3Ryb2tlLWxpbmVjYXA6YnV0dDtzdHJva2UtbGluZWpvaW46bWl0ZXI7c3Ryb2tlLW9wYWNpdHk6MSIKICAgICBpZD0idGV4dDQxNjMiCiAgICAgdHJhbnNmb3JtPSJtYXRyaXgoMS4yNzczMjI4LDAsMCwxLjI3NzMyMjgsLTAuODA3NzkyMjYsLTQuNjcxNjcxMykiPgogICAgPHBhdGgKICAgICAgIGQ9Im0gMi4yMjEzNjI2LDE5LjA0MTc4OCAwLC0zLjU3OTEwMSAwLjcyMjY1NjIsMCAwLDEuNDA4NjkxIDEuNDE2MDE1NywwIDAsLTEuNDA4NjkxIDAuNzIyNjU2MiwwIDAsMy41NzkxMDEgLTAuNzIyNjU2MiwwIDAsLTEuNTY0OTQxIC0xLjQxNjAxNTcsMCAwLDEuNTY0OTQxIC0wLjcyMjY1NjIsMCB6IgogICAgICAgc3R5bGU9ImZvbnQtc3R5bGU6bm9ybWFsO2ZvbnQtdmFyaWFudDpub3JtYWw7Zm9udC13ZWlnaHQ6Ym9sZDtmb250LXN0cmV0Y2g6bm9ybWFsO2ZvbnQtc2l6ZTo1cHg7Zm9udC1mYW1pbHk6QXJpYWw7LWlua3NjYXBlLWZvbnQtc3BlY2lmaWNhdGlvbjonQXJpYWwgQm9sZCciCiAgICAgICBpZD0icGF0aDQxNzQiCiAgICAgICBpbmtzY2FwZTpjb25uZWN0b3ItY3VydmF0dXJlPSIwIiAvPgogICAgPHBhdGgKICAgICAgIGQ9Im0gNi42Mzc4NjY1LDE5LjA0MTc4OCAwLC0yLjk3MzYzMyAtMS4wNjIwMTE3LDAgMCwtMC42MDU0NjggMi44NDQyMzgzLDAgMCwwLjYwNTQ2OCAtMS4wNTk1NzA0LDAgMCwyLjk3MzYzMyAtMC43MjI2NTYyLDAgeiIKICAgICAgIHN0eWxlPSJmb250LXN0eWxlOm5vcm1hbDtmb250LXZhcmlhbnQ6bm9ybWFsO2ZvbnQtd2VpZ2h0OmJvbGQ7Zm9udC1zdHJldGNoOm5vcm1hbDtmb250LXNpemU6NXB4O2ZvbnQtZmFtaWx5OkFyaWFsOy1pbmtzY2FwZS1mb250LXNwZWNpZmljYXRpb246J0FyaWFsIEJvbGQnIgogICAgICAgaWQ9InBhdGg0MTc2IgogICAgICAgaW5rc2NhcGU6Y29ubmVjdG9yLWN1cnZhdHVyZT0iMCIgLz4KICAgIDxwYXRoCiAgICAgICBkPSJtIDkuNjg0NzQxNSwxOS4wNDE3ODggMCwtMi45NzM2MzMgLTEuMDYyMDExNywwIDAsLTAuNjA1NDY4IDIuODQ0MjM4MiwwIDAsMC42MDU0NjggLTEuMDU5NTcsMCAwLDIuOTczNjMzIC0wLjcyMjY1NjUsMCB6IgogICAgICAgc3R5bGU9ImZvbnQtc3R5bGU6bm9ybWFsO2ZvbnQtdmFyaWFudDpub3JtYWw7Zm9udC13ZWlnaHQ6Ym9sZDtmb250LXN0cmV0Y2g6bm9ybWFsO2ZvbnQtc2l6ZTo1cHg7Zm9udC1mYW1pbHk6QXJpYWw7LWlua3NjYXBlLWZvbnQtc3BlY2lmaWNhdGlvbjonQXJpYWwgQm9sZCciCiAgICAgICBpZD0icGF0aDQxNzgiCiAgICAgICBpbmtzY2FwZTpjb25uZWN0b3ItY3VydmF0dXJlPSIwIiAvPgogICAgPHBhdGgKICAgICAgIGQ9Im0gMTEuOTI1OTUyLDE5LjA0MTc4OCAwLC0zLjU3OTEwMSAxLjE1OTY2OCwwIHEgMC42NTkxOCwwIDAuODU5Mzc1LDAuMDUzNzEgMC4zMDc2MTgsMC4wODA1NyAwLjUxNTEzNywwLjM1MTU2MyAwLjIwNzUyLDAuMjY4NTU1IDAuMjA3NTIsMC42OTU4MDEgMCwwLjMyOTU5IC0wLjExOTYyOSwwLjU1NDE5OSAtMC4xMTk2MjksMC4yMjQ2MDkgLTAuMzA1MTc2LDAuMzU0MDA0IC0wLjE4MzEwNiwwLjEyNjk1MyAtMC4zNzM1MzUsMC4xNjg0NTcgLTAuMjU4Nzg5LDAuMDUxMjcgLTAuNzQ5NTEyLDAuMDUxMjcgbCAtMC40NzExOTEsMCAwLDEuMzUwMDk4IC0wLjcyMjY1NywwIHogbSAwLjcyMjY1NywtMi45NzM2MzMgMCwxLjAxNTYyNSAwLjM5NTUwNywwIHEgMC40MjcyNDcsMCAwLjU3MTI5LC0wLjA1NjE1IDAuMTQ0MDQzLC0wLjA1NjE1IDAuMjI0NjA5LC0wLjE3NTc4MSAwLjA4MzAxLC0wLjExOTYyOSAwLjA4MzAxLC0wLjI3ODMyMSAwLC0wLjE5NTMxMiAtMC4xMTQ3NDYsLTAuMzIyMjY1IC0wLjExNDc0NiwtMC4xMjY5NTMgLTAuMjkwNTI4LC0wLjE1ODY5MiAtMC4xMjkzOTQsLTAuMDI0NDEgLTAuNTIwMDE5LC0wLjAyNDQxIGwgLTAuMzQ5MTIxLDAgeiIKICAgICAgIHN0eWxlPSJmb250LXN0eWxlOm5vcm1hbDtmb250LXZhcmlhbnQ6bm9ybWFsO2ZvbnQtd2VpZ2h0OmJvbGQ7Zm9udC1zdHJldGNoOm5vcm1hbDtmb250LXNpemU6NXB4O2ZvbnQtZmFtaWx5OkFyaWFsOy1pbmtzY2FwZS1mb250LXNwZWNpZmljYXRpb246J0FyaWFsIEJvbGQnIgogICAgICAgaWQ9InBhdGg0MTgwIgogICAgICAgaW5rc2NhcGU6Y29ubmVjdG9yLWN1cnZhdHVyZT0iMCIgLz4KICA8L2c+Cjwvc3ZnPgo=',
				order: 18
			});
		},

		$constructor: function(id, workspace){
			$base(id, workspace);
			
			if(this.property('methods')){
				this.methodCount = this.property('methods');
			}
			if(this.property('address')){
				this.serviceAddr = this.property('address');
			}
		},
		
		load: function(){
			if(this.loaded){
				return;
			}
			this.lock('_load');
			try {
				if(this.loaded){
					return;
				}
				
				// load concepts from children
				this.lock('_methods');
				var chMap = this.getChildren();
				for(var chId in chMap){
					var chObj = chMap[chId];
					if(JSB.isInstanceOf(chObj, 'DataCube.Model.HttpMethod')){
						this.methods[chId] = chObj;
					}
				}
				this.unlock('_methods');
				
				this.loaded = true;
			} finally {
				this.unlock('_load');
			}
		},
		
		store: function(){
			// do nothing for a while
		},
		
		onChangeSettings: function(){
			this.serviceAddr = this.getSettingsContext().find('server address').value().trim();
			this.property('address', this.serviceAddr || null);
			this.store();
		},
		
		getStore: function(){
			return StoreManager.getStore({
				name: 'HttpServiceStore',
				type: 'DataCube.Store.HttpServiceStore'
			});
		},
		
		createHttpMethod: function(){
			this.load();
			
			this.lock('_methods');
			try {
				// generate concept name map
				var cnMap = {};
				for(var cId in this.methods){
					cnMap[this.methods[cId].getName()] = true;
				}
				var cName = null;
				for(var cnt = 1; ; cnt++){
					cName = 'mtd' + cnt;
					if(!cnMap[cName]){
						break;
					}
				}
				
				var cId = JSB.generateUid();
				var method = new HttpMethod(cId, this.getWorkspace(), this, cName);
	
				this.methods[cId] = method;
				this.methodCount = Object.keys(this.methods).length;
				this.property('methods', this.methodCount);
				
				this.addChildEntry(method);
			} finally {
				this.unlock('_methods');
			}
			
			this.publish('DataCube.Model.HttpService.changed', {action: 'httpMethodAdded', method: method}, {session: true});
			this.store();
			this.doSync();
			
			return method;
		},
		
		removeHttpMethod: function(mtdId, fromEntry){
			this.load();
			var bRemoved = false;
			if(this.methods[mtdId]){
				this.lock('_methods');
				try {
					if(this.methods[mtdId]){
						if(!fromEntry){
							this.methods[mtdId].remove();
						}
						delete this.methods[mtdId];	
						this.methodCount = Object.keys(this.methods).length;
						this.property('methods', this.methodCount);
						bRemoved = true;
					}
				} finally {
					this.unlock('_methods');
				}
				if(bRemoved){
					this.publish('DataCube.Model.HttpService.changed', {action: 'httpMethodRemoved', methodId: mtdId}, {session: true});
					this.store();
					this.doSync();
				}
			}
		},
	}
}