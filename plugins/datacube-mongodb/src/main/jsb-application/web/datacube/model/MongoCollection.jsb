{
	$name: 'DataCube.Model.MongoCollection',
	$parent: 'DataCube.Model.DatabaseTable',
	
	$expose: {
		priority:0.5, 
		nodeType:'DataCube.MongoCollectionNode',
		create: false,
		move: false,
		remove: false,
		share: false,
		rename: false,
		icon: 'data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiIHN0YW5kYWxvbmU9Im5vIj8+DQo8IS0tIEdlbmVyYXRvcjogQWRvYmUgSWxsdXN0cmF0b3IgMTUuMC4yLCBTVkcgRXhwb3J0IFBsdWctSW4gLiBTVkcgVmVyc2lvbjogNi4wMCBCdWlsZCAwKSAgLS0+DQoNCjxzdmcNCiAgIHhtbG5zOmRjPSJodHRwOi8vcHVybC5vcmcvZGMvZWxlbWVudHMvMS4xLyINCiAgIHhtbG5zOmNjPSJodHRwOi8vY3JlYXRpdmVjb21tb25zLm9yZy9ucyMiDQogICB4bWxuczpyZGY9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkvMDIvMjItcmRmLXN5bnRheC1ucyMiDQogICB4bWxuczpzdmc9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIg0KICAgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIg0KICAgeG1sbnM6eGxpbms9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmsiDQogICB4bWxuczpzb2RpcG9kaT0iaHR0cDovL3NvZGlwb2RpLnNvdXJjZWZvcmdlLm5ldC9EVEQvc29kaXBvZGktMC5kdGQiDQogICB4bWxuczppbmtzY2FwZT0iaHR0cDovL3d3dy5pbmtzY2FwZS5vcmcvbmFtZXNwYWNlcy9pbmtzY2FwZSINCiAgIHZlcnNpb249IjEuMSINCiAgIGlkPSJMYXllcl8xIg0KICAgeD0iMHB4Ig0KICAgeT0iMHB4Ig0KICAgd2lkdGg9IjIwIg0KICAgaGVpZ2h0PSIyMCINCiAgIHZpZXdCb3g9IjAgMCAyMCAyMCINCiAgIGVuYWJsZS1iYWNrZ3JvdW5kPSJuZXcgMCAwIDUxMiA0ODAiDQogICB4bWw6c3BhY2U9InByZXNlcnZlIg0KICAgaW5rc2NhcGU6dmVyc2lvbj0iMC45MSByMTM3MjUiDQogICBzb2RpcG9kaTpkb2NuYW1lPSJzcWx0YWJsZS5zdmciPjxtZXRhZGF0YQ0KICAgICBpZD0ibWV0YWRhdGExMSI+PHJkZjpSREY+PGNjOldvcmsNCiAgICAgICAgIHJkZjphYm91dD0iIj48ZGM6Zm9ybWF0PmltYWdlL3N2Zyt4bWw8L2RjOmZvcm1hdD48ZGM6dHlwZQ0KICAgICAgICAgICByZGY6cmVzb3VyY2U9Imh0dHA6Ly9wdXJsLm9yZy9kYy9kY21pdHlwZS9TdGlsbEltYWdlIiAvPjxkYzp0aXRsZT48L2RjOnRpdGxlPjwvY2M6V29yaz48L3JkZjpSREY+PC9tZXRhZGF0YT48ZGVmcw0KICAgICBpZD0iZGVmczkiPjxsaW5lYXJHcmFkaWVudA0KICAgICAgIGlua3NjYXBlOmNvbGxlY3Q9ImFsd2F5cyINCiAgICAgICBpZD0ibGluZWFyR3JhZGllbnQ0MzM5Ij48c3RvcA0KICAgICAgICAgc3R5bGU9InN0b3AtY29sb3I6I2ZmZmZmZjtzdG9wLW9wYWNpdHk6MTsiDQogICAgICAgICBvZmZzZXQ9IjAiDQogICAgICAgICBpZD0ic3RvcDQzNDEiIC8+PHN0b3ANCiAgICAgICAgIHN0eWxlPSJzdG9wLWNvbG9yOiNkY2RjZGM7c3RvcC1vcGFjaXR5OjEiDQogICAgICAgICBvZmZzZXQ9IjEiDQogICAgICAgICBpZD0ic3RvcDQzNDMiIC8+PC9saW5lYXJHcmFkaWVudD48bGluZWFyR3JhZGllbnQNCiAgICAgICBpbmtzY2FwZTpjb2xsZWN0PSJhbHdheXMiDQogICAgICAgaWQ9ImxpbmVhckdyYWRpZW50NDMzMSI+PHN0b3ANCiAgICAgICAgIHN0eWxlPSJzdG9wLWNvbG9yOiNmZmZmZmY7c3RvcC1vcGFjaXR5OjE7Ig0KICAgICAgICAgb2Zmc2V0PSIwIg0KICAgICAgICAgaWQ9InN0b3A0MzMzIiAvPjxzdG9wDQogICAgICAgICBzdHlsZT0ic3RvcC1jb2xvcjojZGNkY2RjO3N0b3Atb3BhY2l0eToxIg0KICAgICAgICAgb2Zmc2V0PSIxIg0KICAgICAgICAgaWQ9InN0b3A0MzM1IiAvPjwvbGluZWFyR3JhZGllbnQ+PGxpbmVhckdyYWRpZW50DQogICAgICAgaW5rc2NhcGU6Y29sbGVjdD0iYWx3YXlzIg0KICAgICAgIGlkPSJsaW5lYXJHcmFkaWVudDQzMjMiPjxzdG9wDQogICAgICAgICBzdHlsZT0ic3RvcC1jb2xvcjojZmZmZmZmO3N0b3Atb3BhY2l0eToxOyINCiAgICAgICAgIG9mZnNldD0iMCINCiAgICAgICAgIGlkPSJzdG9wNDMyNSIgLz48c3RvcA0KICAgICAgICAgc3R5bGU9InN0b3AtY29sb3I6I2RjZGNkYztzdG9wLW9wYWNpdHk6MSINCiAgICAgICAgIG9mZnNldD0iMSINCiAgICAgICAgIGlkPSJzdG9wNDMyNyIgLz48L2xpbmVhckdyYWRpZW50PjxsaW5lYXJHcmFkaWVudA0KICAgICAgIGlua3NjYXBlOmNvbGxlY3Q9ImFsd2F5cyINCiAgICAgICBpZD0ibGluZWFyR3JhZGllbnQ0MzE1Ij48c3RvcA0KICAgICAgICAgc3R5bGU9InN0b3AtY29sb3I6I2ZmZmZmZjtzdG9wLW9wYWNpdHk6MTsiDQogICAgICAgICBvZmZzZXQ9IjAiDQogICAgICAgICBpZD0ic3RvcDQzMTciIC8+PHN0b3ANCiAgICAgICAgIHN0eWxlPSJzdG9wLWNvbG9yOiNkY2RjZGM7c3RvcC1vcGFjaXR5OjEiDQogICAgICAgICBvZmZzZXQ9IjEiDQogICAgICAgICBpZD0ic3RvcDQzMTkiIC8+PC9saW5lYXJHcmFkaWVudD48bGluZWFyR3JhZGllbnQNCiAgICAgICBpbmtzY2FwZTpjb2xsZWN0PSJhbHdheXMiDQogICAgICAgaWQ9ImxpbmVhckdyYWRpZW50NDMwNyI+PHN0b3ANCiAgICAgICAgIHN0eWxlPSJzdG9wLWNvbG9yOiNmZmZmZmY7c3RvcC1vcGFjaXR5OjE7Ig0KICAgICAgICAgb2Zmc2V0PSIwIg0KICAgICAgICAgaWQ9InN0b3A0MzA5IiAvPjxzdG9wDQogICAgICAgICBzdHlsZT0ic3RvcC1jb2xvcjojZGNkY2RjO3N0b3Atb3BhY2l0eToxIg0KICAgICAgICAgb2Zmc2V0PSIxIg0KICAgICAgICAgaWQ9InN0b3A0MzExIiAvPjwvbGluZWFyR3JhZGllbnQ+PGxpbmVhckdyYWRpZW50DQogICAgICAgaW5rc2NhcGU6Y29sbGVjdD0iYWx3YXlzIg0KICAgICAgIGlkPSJsaW5lYXJHcmFkaWVudDQyOTkiPjxzdG9wDQogICAgICAgICBzdHlsZT0ic3RvcC1jb2xvcjojZmZmZmZmO3N0b3Atb3BhY2l0eToxOyINCiAgICAgICAgIG9mZnNldD0iMCINCiAgICAgICAgIGlkPSJzdG9wNDMwMSIgLz48c3RvcA0KICAgICAgICAgc3R5bGU9InN0b3AtY29sb3I6I2RjZGNkYztzdG9wLW9wYWNpdHk6MSINCiAgICAgICAgIG9mZnNldD0iMSINCiAgICAgICAgIGlkPSJzdG9wNDMwMyIgLz48L2xpbmVhckdyYWRpZW50PjxsaW5lYXJHcmFkaWVudA0KICAgICAgIGlua3NjYXBlOmNvbGxlY3Q9ImFsd2F5cyINCiAgICAgICBpZD0ibGluZWFyR3JhZGllbnQ0MjkxIj48c3RvcA0KICAgICAgICAgc3R5bGU9InN0b3AtY29sb3I6I2ZmZmZmZjtzdG9wLW9wYWNpdHk6MSINCiAgICAgICAgIG9mZnNldD0iMCINCiAgICAgICAgIGlkPSJzdG9wNDI5MyIgLz48c3RvcA0KICAgICAgICAgc3R5bGU9InN0b3AtY29sb3I6I2RjZGNkYztzdG9wLW9wYWNpdHk6MSINCiAgICAgICAgIG9mZnNldD0iMSINCiAgICAgICAgIGlkPSJzdG9wNDI5NSIgLz48L2xpbmVhckdyYWRpZW50PjxsaW5lYXJHcmFkaWVudA0KICAgICAgIGlua3NjYXBlOmNvbGxlY3Q9ImFsd2F5cyINCiAgICAgICBpZD0ibGluZWFyR3JhZGllbnQ0Mjc1Ij48c3RvcA0KICAgICAgICAgc3R5bGU9InN0b3AtY29sb3I6I2ZmZmZmZjtzdG9wLW9wYWNpdHk6MTsiDQogICAgICAgICBvZmZzZXQ9IjAiDQogICAgICAgICBpZD0ic3RvcDQyNzciIC8+PHN0b3ANCiAgICAgICAgIHN0eWxlPSJzdG9wLWNvbG9yOiNkY2RjZGM7c3RvcC1vcGFjaXR5OjEiDQogICAgICAgICBvZmZzZXQ9IjEiDQogICAgICAgICBpZD0ic3RvcDQyNzkiIC8+PC9saW5lYXJHcmFkaWVudD48bGluZWFyR3JhZGllbnQNCiAgICAgICBpbmtzY2FwZTpjb2xsZWN0PSJhbHdheXMiDQogICAgICAgaWQ9ImxpbmVhckdyYWRpZW50NDI2NyI+PHN0b3ANCiAgICAgICAgIHN0eWxlPSJzdG9wLWNvbG9yOiNmZmZmZmY7c3RvcC1vcGFjaXR5OjEiDQogICAgICAgICBvZmZzZXQ9IjAiDQogICAgICAgICBpZD0ic3RvcDQyNjkiIC8+PHN0b3ANCiAgICAgICAgIHN0eWxlPSJzdG9wLWNvbG9yOiNkY2RjZGM7c3RvcC1vcGFjaXR5OjEiDQogICAgICAgICBvZmZzZXQ9IjEiDQogICAgICAgICBpZD0ic3RvcDQyNzEiIC8+PC9saW5lYXJHcmFkaWVudD48bGluZWFyR3JhZGllbnQNCiAgICAgICBpbmtzY2FwZTpjb2xsZWN0PSJhbHdheXMiDQogICAgICAgaWQ9ImxpbmVhckdyYWRpZW50NDIxMCI+PHN0b3ANCiAgICAgICAgIHN0eWxlPSJzdG9wLWNvbG9yOiM2ZGEyZDE7c3RvcC1vcGFjaXR5OjEiDQogICAgICAgICBvZmZzZXQ9IjAiDQogICAgICAgICBpZD0ic3RvcDQyMTIiIC8+PHN0b3ANCiAgICAgICAgIHN0eWxlPSJzdG9wLWNvbG9yOiM4MGJiZTE7c3RvcC1vcGFjaXR5OjEiDQogICAgICAgICBvZmZzZXQ9IjEiDQogICAgICAgICBpZD0ic3RvcDQyMTQiIC8+PC9saW5lYXJHcmFkaWVudD48bGluZWFyR3JhZGllbnQNCiAgICAgICBpbmtzY2FwZTpjb2xsZWN0PSJhbHdheXMiDQogICAgICAgeGxpbms6aHJlZj0iI2xpbmVhckdyYWRpZW50NDIxMCINCiAgICAgICBpZD0ibGluZWFyR3JhZGllbnQ0MjE2Ig0KICAgICAgIHgxPSI5LjM0MjU2NjUiDQogICAgICAgeTE9IjAuNTMxOTM3NTQiDQogICAgICAgeDI9IjkuMjYzOTI4NCINCiAgICAgICB5Mj0iNC40NDE5OTg1Ig0KICAgICAgIGdyYWRpZW50VW5pdHM9InVzZXJTcGFjZU9uVXNlIg0KICAgICAgIGdyYWRpZW50VHJhbnNmb3JtPSJtYXRyaXgoMC45NTE0MDk0OSwwLDAsMC44MjU2MzE0NCwwLjQwNTk5NzkxLDAuNDAwNDYwOTgpIiAvPjxsaW5lYXJHcmFkaWVudA0KICAgICAgIGlua3NjYXBlOmNvbGxlY3Q9ImFsd2F5cyINCiAgICAgICB4bGluazpocmVmPSIjbGluZWFyR3JhZGllbnQ0MjY3Ig0KICAgICAgIGlkPSJsaW5lYXJHcmFkaWVudDQyNzMiDQogICAgICAgeDE9IjUuMDE5MTY4NCINCiAgICAgICB5MT0iNy4wMDIxMTkxIg0KICAgICAgIHgyPSI1LjAzODI5MjQiDQogICAgICAgeTI9IjEwLjAwNTI5NyINCiAgICAgICBncmFkaWVudFVuaXRzPSJ1c2VyU3BhY2VPblVzZSIgLz48bGluZWFyR3JhZGllbnQNCiAgICAgICBpbmtzY2FwZTpjb2xsZWN0PSJhbHdheXMiDQogICAgICAgeGxpbms6aHJlZj0iI2xpbmVhckdyYWRpZW50NDI3NSINCiAgICAgICBpZD0ibGluZWFyR3JhZGllbnQ0MjgxIg0KICAgICAgIHgxPSIxMC4yNDg5NDEiDQogICAgICAgeTE9IjcuMDAyMTE5MSINCiAgICAgICB4Mj0iMTAuMzAyMzYxIg0KICAgICAgIHkyPSIxMC4wMDUyOTciDQogICAgICAgZ3JhZGllbnRVbml0cz0idXNlclNwYWNlT25Vc2UiIC8+PGxpbmVhckdyYWRpZW50DQogICAgICAgaW5rc2NhcGU6Y29sbGVjdD0iYWx3YXlzIg0KICAgICAgIHhsaW5rOmhyZWY9IiNsaW5lYXJHcmFkaWVudDQyOTEiDQogICAgICAgaWQ9ImxpbmVhckdyYWRpZW50NDI5NyINCiAgICAgICB4MT0iMTQuOTQwNDI2Ig0KICAgICAgIHkxPSI3LjAwMjExOTEiDQogICAgICAgeDI9IjE1LjAxNTk3NSINCiAgICAgICB5Mj0iMTAuMDA1Mjk3Ig0KICAgICAgIGdyYWRpZW50VW5pdHM9InVzZXJTcGFjZU9uVXNlIiAvPjxsaW5lYXJHcmFkaWVudA0KICAgICAgIGlua3NjYXBlOmNvbGxlY3Q9ImFsd2F5cyINCiAgICAgICB4bGluazpocmVmPSIjbGluZWFyR3JhZGllbnQ0Mjk5Ig0KICAgICAgIGlkPSJsaW5lYXJHcmFkaWVudDQzMDUiDQogICAgICAgeDE9IjQuNzU2NDExMSINCiAgICAgICB5MT0iMTEuMDA2MzU2Ig0KICAgICAgIHgyPSI0LjczOTE3MjUiDQogICAgICAgeTI9IjE0LjAwOTUzNCINCiAgICAgICBncmFkaWVudFVuaXRzPSJ1c2VyU3BhY2VPblVzZSIgLz48bGluZWFyR3JhZGllbnQNCiAgICAgICBpbmtzY2FwZTpjb2xsZWN0PSJhbHdheXMiDQogICAgICAgeGxpbms6aHJlZj0iI2xpbmVhckdyYWRpZW50NDMwNyINCiAgICAgICBpZD0ibGluZWFyR3JhZGllbnQ0MzEzIg0KICAgICAgIHgxPSI5LjgzNDM4NjgiDQogICAgICAgeTE9IjExLjAwNjM1NiINCiAgICAgICB4Mj0iOS44MTQwMDg3Ig0KICAgICAgIHkyPSIxNC4wMDk1MzQiDQogICAgICAgZ3JhZGllbnRVbml0cz0idXNlclNwYWNlT25Vc2UiIC8+PGxpbmVhckdyYWRpZW50DQogICAgICAgaW5rc2NhcGU6Y29sbGVjdD0iYWx3YXlzIg0KICAgICAgIHhsaW5rOmhyZWY9IiNsaW5lYXJHcmFkaWVudDQzMTUiDQogICAgICAgaWQ9ImxpbmVhckdyYWRpZW50NDMyMSINCiAgICAgICB4MT0iMTQuNjgwMDI5Ig0KICAgICAgIHkxPSIxMS4wMDYzNTYiDQogICAgICAgeDI9IjE0LjYxNjQwMSINCiAgICAgICB5Mj0iMTQuMDA5NTM0Ig0KICAgICAgIGdyYWRpZW50VW5pdHM9InVzZXJTcGFjZU9uVXNlIiAvPjxsaW5lYXJHcmFkaWVudA0KICAgICAgIGlua3NjYXBlOmNvbGxlY3Q9ImFsd2F5cyINCiAgICAgICB4bGluazpocmVmPSIjbGluZWFyR3JhZGllbnQ0MzIzIg0KICAgICAgIGlkPSJsaW5lYXJHcmFkaWVudDQzMjkiDQogICAgICAgeDE9IjQuODkwMTc2MyINCiAgICAgICB5MT0iMTUuMDEwNTkzIg0KICAgICAgIHgyPSI0Ljg2OTM5ODEiDQogICAgICAgeTI9IjE2Ljk5NjgyMiINCiAgICAgICBncmFkaWVudFVuaXRzPSJ1c2VyU3BhY2VPblVzZSIgLz48bGluZWFyR3JhZGllbnQNCiAgICAgICBpbmtzY2FwZTpjb2xsZWN0PSJhbHdheXMiDQogICAgICAgeGxpbms6aHJlZj0iI2xpbmVhckdyYWRpZW50NDMzMSINCiAgICAgICBpZD0ibGluZWFyR3JhZGllbnQ0MzM3Ig0KICAgICAgIHgxPSIxMC4xMDM0NTgiDQogICAgICAgeTE9IjE1LjAxMDU5MyINCiAgICAgICB4Mj0iMTAuMDgxNjM1Ig0KICAgICAgIHkyPSIxNi45OTY4MjIiDQogICAgICAgZ3JhZGllbnRVbml0cz0idXNlclNwYWNlT25Vc2UiIC8+PGxpbmVhckdyYWRpZW50DQogICAgICAgaW5rc2NhcGU6Y29sbGVjdD0iYWx3YXlzIg0KICAgICAgIHhsaW5rOmhyZWY9IiNsaW5lYXJHcmFkaWVudDQzMzkiDQogICAgICAgaWQ9ImxpbmVhckdyYWRpZW50NDM0NSINCiAgICAgICB4MT0iMTQuODk2NzI0Ig0KICAgICAgIHkxPSIxNS4wMTA1OTMiDQogICAgICAgeDI9IjE0LjkyODY4NSINCiAgICAgICB5Mj0iMTYuOTk2ODIyIg0KICAgICAgIGdyYWRpZW50VW5pdHM9InVzZXJTcGFjZU9uVXNlIiAvPjwvZGVmcz48c29kaXBvZGk6bmFtZWR2aWV3DQogICAgIHBhZ2Vjb2xvcj0iI2ZmZmZmZiINCiAgICAgYm9yZGVyY29sb3I9IiM2NjY2NjYiDQogICAgIGJvcmRlcm9wYWNpdHk9IjEiDQogICAgIG9iamVjdHRvbGVyYW5jZT0iMTAiDQogICAgIGdyaWR0b2xlcmFuY2U9IjEwIg0KICAgICBndWlkZXRvbGVyYW5jZT0iMTAiDQogICAgIGlua3NjYXBlOnBhZ2VvcGFjaXR5PSIwIg0KICAgICBpbmtzY2FwZTpwYWdlc2hhZG93PSIyIg0KICAgICBpbmtzY2FwZTp3aW5kb3ctd2lkdGg9IjE5MjAiDQogICAgIGlua3NjYXBlOndpbmRvdy1oZWlnaHQ9IjExNzgiDQogICAgIGlkPSJuYW1lZHZpZXc3Ig0KICAgICBzaG93Z3JpZD0iZmFsc2UiDQogICAgIGlua3NjYXBlOnpvb209IjIyLjYyNzQxNyINCiAgICAgaW5rc2NhcGU6Y3g9IjE4Ljk2MDY2MyINCiAgICAgaW5rc2NhcGU6Y3k9IjExLjAzMDMxIg0KICAgICBpbmtzY2FwZTp3aW5kb3cteD0iMTkxMiINCiAgICAgaW5rc2NhcGU6d2luZG93LXk9Ii04Ig0KICAgICBpbmtzY2FwZTp3aW5kb3ctbWF4aW1pemVkPSIxIg0KICAgICBpbmtzY2FwZTpjdXJyZW50LWxheWVyPSJMYXllcl8xIg0KICAgICBzaG93Z3VpZGVzPSJ0cnVlIg0KICAgICBpbmtzY2FwZTpndWlkZS1iYm94PSJ0cnVlIj48c29kaXBvZGk6Z3VpZGUNCiAgICAgICBwb3NpdGlvbj0iMS4wMTEyMjI2LDE4LjIwMjAwNyINCiAgICAgICBvcmllbnRhdGlvbj0iMSwwIg0KICAgICAgIGlkPSJndWlkZTQyMTgiIC8+PHNvZGlwb2RpOmd1aWRlDQogICAgICAgcG9zaXRpb249IjE5LjAxMDk4NSwyMC45NjYwMTYiDQogICAgICAgb3JpZW50YXRpb249IjEsMCINCiAgICAgICBpZD0iZ3VpZGU0MjIwIiAvPjxzb2RpcG9kaTpndWlkZQ0KICAgICAgIHBvc2l0aW9uPSIwLDE2LjY5NjQwOSINCiAgICAgICBvcmllbnRhdGlvbj0iMSwwIg0KICAgICAgIGlkPSJndWlkZTQyMjIiIC8+PHNvZGlwb2RpOmd1aWRlDQogICAgICAgcG9zaXRpb249IjguMTU3MTk1OCwwIg0KICAgICAgIG9yaWVudGF0aW9uPSIwLDEiDQogICAgICAgaWQ9Imd1aWRlNDIyNCIgLz48c29kaXBvZGk6Z3VpZGUNCiAgICAgICBwb3NpdGlvbj0iOS42ODUyNjU2LDE5Ljk5OTczNiINCiAgICAgICBvcmllbnRhdGlvbj0iMCwxIg0KICAgICAgIGlkPSJndWlkZTQyMjYiIC8+PHNvZGlwb2RpOmd1aWRlDQogICAgICAgcG9zaXRpb249IjE5Ljk5OTczNiwxNC43ODYzMjIiDQogICAgICAgb3JpZW50YXRpb249IjEsMCINCiAgICAgICBpZD0iZ3VpZGU0MjI4IiAvPjxzb2RpcG9kaTpndWlkZQ0KICAgICAgIHBvc2l0aW9uPSIxMy40MTU1NTMsMTQuOTg4NTY2Ig0KICAgICAgIG9yaWVudGF0aW9uPSIwLDEiDQogICAgICAgaWQ9Imd1aWRlNDIzMSIgLz48c29kaXBvZGk6Z3VpZGUNCiAgICAgICBwb3NpdGlvbj0iMTcuOTk5NzYzLDEyLjkyMTE3OCINCiAgICAgICBvcmllbnRhdGlvbj0iMSwwIg0KICAgICAgIGlkPSJndWlkZTQyMzMiIC8+PHNvZGlwb2RpOmd1aWRlDQogICAgICAgcG9zaXRpb249IjEuOTk5OTczNiw5LjQzODA3NzgiDQogICAgICAgb3JpZW50YXRpb249IjEsMCINCiAgICAgICBpZD0iZ3VpZGU0MjM1IiAvPjxzb2RpcG9kaTpndWlkZQ0KICAgICAgIHBvc2l0aW9uPSIxMy4wMzM1MzYsMTMuOTk5ODE1Ig0KICAgICAgIG9yaWVudGF0aW9uPSIwLDEiDQogICAgICAgaWQ9Imd1aWRlNDIzNyIgLz48c29kaXBvZGk6Z3VpZGUNCiAgICAgICBwb3NpdGlvbj0iOS41NDk3ODgyLDEuMDAxMDU5MyINCiAgICAgICBvcmllbnRhdGlvbj0iMCwxIg0KICAgICAgIGlkPSJndWlkZTQyMzkiIC8+PHNvZGlwb2RpOmd1aWRlDQogICAgICAgcG9zaXRpb249IjkuODQyNTY2OSwxLjk5OTk3MzYiDQogICAgICAgb3JpZW50YXRpb249IjAsMSINCiAgICAgICBpZD0iZ3VpZGU0MjQxIiAvPjxzb2RpcG9kaTpndWlkZQ0KICAgICAgIHBvc2l0aW9uPSIxMC4yNDg5NDEsMTIuOTk3ODgxIg0KICAgICAgIG9yaWVudGF0aW9uPSIwLDEiDQogICAgICAgaWQ9Imd1aWRlNDI0MyIgLz48c29kaXBvZGk6Z3VpZGUNCiAgICAgICBwb3NpdGlvbj0iMTAuNzg5MTk1LDkuOTk0NzAzNCINCiAgICAgICBvcmllbnRhdGlvbj0iMCwxIg0KICAgICAgIGlkPSJndWlkZTQyNDUiIC8+PHNvZGlwb2RpOmd1aWRlDQogICAgICAgcG9zaXRpb249IjExLjIxODIyLDguOTkzNjQ0MSINCiAgICAgICBvcmllbnRhdGlvbj0iMCwxIg0KICAgICAgIGlkPSJndWlkZTQyNDciIC8+PHNvZGlwb2RpOmd1aWRlDQogICAgICAgcG9zaXRpb249IjEwLjc1NzQxNSwzLjAwMzE3OCINCiAgICAgICBvcmllbnRhdGlvbj0iMCwxIg0KICAgICAgIGlkPSJndWlkZTQyNDkiIC8+PHNvZGlwb2RpOmd1aWRlDQogICAgICAgcG9zaXRpb249IjguOTkzNjQ0MSw1Ljk5MDQ2NjEiDQogICAgICAgb3JpZW50YXRpb249IjAsMSINCiAgICAgICBpZD0iZ3VpZGU0MjUxIiAvPjxzb2RpcG9kaTpndWlkZQ0KICAgICAgIHBvc2l0aW9uPSI5LjY2MTAxNyw0Ljk4OTQwNjgiDQogICAgICAgb3JpZW50YXRpb249IjAsMSINCiAgICAgICBpZD0iZ3VpZGU0MjUzIiAvPjxzb2RpcG9kaTpndWlkZQ0KICAgICAgIHBvc2l0aW9uPSIyLjk4NzI4ODEsOC45OTM2NDQxIg0KICAgICAgIG9yaWVudGF0aW9uPSIxLDAiDQogICAgICAgaWQ9Imd1aWRlNDI1NSIgLz48c29kaXBvZGk6Z3VpZGUNCiAgICAgICBwb3NpdGlvbj0iNy45NzY2OTQ5LDguMTk5MTUyNiINCiAgICAgICBvcmllbnRhdGlvbj0iMSwwIg0KICAgICAgIGlkPSJndWlkZTQyNTciIC8+PHNvZGlwb2RpOmd1aWRlDQogICAgICAgcG9zaXRpb249IjYuOTkxNTI1NCw3LjY1ODg5ODMiDQogICAgICAgb3JpZW50YXRpb249IjEsMCINCiAgICAgICBpZD0iZ3VpZGU0MjU5IiAvPjxzb2RpcG9kaTpndWlkZQ0KICAgICAgIHBvc2l0aW9uPSIxMS45ODA5MzIsNy42NTg4OTgzIg0KICAgICAgIG9yaWVudGF0aW9uPSIxLDAiDQogICAgICAgaWQ9Imd1aWRlNDI2MSIgLz48c29kaXBvZGk6Z3VpZGUNCiAgICAgICBwb3NpdGlvbj0iMTIuOTk3ODgxLDYuNTQ2NjEwMiINCiAgICAgICBvcmllbnRhdGlvbj0iMSwwIg0KICAgICAgIGlkPSJndWlkZTQyNjMiIC8+PHNvZGlwb2RpOmd1aWRlDQogICAgICAgcG9zaXRpb249IjE3LjAwMjExOSw1Ljk5MDQ2NjEiDQogICAgICAgb3JpZW50YXRpb249IjEsMCINCiAgICAgICBpZD0iZ3VpZGU0MjY1IiAvPjwvc29kaXBvZGk6bmFtZWR2aWV3PjxyZWN0DQogICAgIHN0eWxlPSJmaWxsOiM3Nzg1OGU7ZmlsbC1vcGFjaXR5OjE7c3Ryb2tlOm5vbmU7c3Ryb2tlLXdpZHRoOjE7c3Ryb2tlLWxpbmVjYXA6cm91bmQ7c3Ryb2tlLWxpbmVqb2luOnJvdW5kO3N0cm9rZS1taXRlcmxpbWl0OjQ7c3Ryb2tlLWRhc2hhcnJheTpub25lO3N0cm9rZS1vcGFjaXR5OjEiDQogICAgIGlkPSJyZWN0NDE1MiINCiAgICAgd2lkdGg9IjE5Ljk4MTc2NiINCiAgICAgaGVpZ2h0PSIyMC4wMDQyMzgiDQogICAgIHg9IjAuMDE1MzM1NDMiDQogICAgIHk9IjAuMDAxMTk4MTEyNiIgLz48cmVjdA0KICAgICBzdHlsZT0iZmlsbDojZTRlNGU0O2ZpbGwtb3BhY2l0eToxO3N0cm9rZTpub25lO3N0cm9rZS13aWR0aDoxO3N0cm9rZS1saW5lY2FwOnJvdW5kO3N0cm9rZS1saW5lam9pbjpyb3VuZDtzdHJva2UtbWl0ZXJsaW1pdDo0O3N0cm9rZS1kYXNoYXJyYXk6bm9uZTtzdHJva2Utb3BhY2l0eToxIg0KICAgICBpZD0icmVjdDQxNTQiDQogICAgIHdpZHRoPSIxNy45OTc0NjEiDQogICAgIGhlaWdodD0iMTMuOTkxMTAyIg0KICAgICB4PSIxLjAxNDk3MTQiDQogICAgIHk9IjUuMDEwMDU2NSIgLz48cmVjdA0KICAgICBzdHlsZT0iZmlsbDojOTRhNmIwO2ZpbGwtb3BhY2l0eToxO3N0cm9rZTpub25lO3N0cm9rZS13aWR0aDoxO3N0cm9rZS1saW5lY2FwOnJvdW5kO3N0cm9rZS1saW5lam9pbjpyb3VuZDtzdHJva2UtbWl0ZXJsaW1pdDo0O3N0cm9rZS1kYXNoYXJyYXk6bm9uZTtzdHJva2Utb3BhY2l0eToxIg0KICAgICBpZD0icmVjdDQxNTgiDQogICAgIHdpZHRoPSIxNS45OTMxMTQiDQogICAgIGhlaWdodD0iMTEuOTkxMTM2Ig0KICAgICB4PSIyLjAxMjgzNjIiDQogICAgIHk9IjYuMDA5OTg1OSIgLz48cmVjdA0KICAgICBzdHlsZT0iZmlsbDp1cmwoI2xpbmVhckdyYWRpZW50NDI3Myk7ZmlsbC1vcGFjaXR5OjE7c3Ryb2tlOm5vbmU7c3Ryb2tlLXdpZHRoOjE7c3Ryb2tlLWxpbmVjYXA6cm91bmQ7c3Ryb2tlLWxpbmVqb2luOnJvdW5kO3N0cm9rZS1taXRlcmxpbWl0OjQ7c3Ryb2tlLWRhc2hhcnJheTpub25lO3N0cm9rZS1vcGFjaXR5OjEiDQogICAgIGlkPSJyZWN0NDE5MCINCiAgICAgd2lkdGg9IjMuOTk2NTk5NyINCiAgICAgaGVpZ2h0PSIzLjAwNTkyMzciDQogICAgIHg9IjIuOTg2MjM2NiINCiAgICAgeT0iNi45OTkzMjM0IiAvPjxyZWN0DQogICAgIHN0eWxlPSJmaWxsOnVybCgjbGluZWFyR3JhZGllbnQ0MjgxKTtmaWxsLW9wYWNpdHk6MTtzdHJva2U6bm9uZTtzdHJva2Utd2lkdGg6MTtzdHJva2UtbGluZWNhcDpyb3VuZDtzdHJva2UtbGluZWpvaW46cm91bmQ7c3Ryb2tlLW1pdGVybGltaXQ6NDtzdHJva2UtZGFzaGFycmF5Om5vbmU7c3Ryb2tlLW9wYWNpdHk6MSINCiAgICAgaWQ9InJlY3Q0MTkyIg0KICAgICB3aWR0aD0iNC4wMTM4MTI1Ig0KICAgICBoZWlnaHQ9IjIuOTk0Njg3OCINCiAgICAgeD0iNy45Njc5Mjc1Ig0KICAgICB5PSI3LjAwNDk0MSIgLz48cmVjdA0KICAgICBzdHlsZT0iZmlsbDp1cmwoI2xpbmVhckdyYWRpZW50NDI5Nyk7ZmlsbC1vcGFjaXR5OjE7c3Ryb2tlOm5vbmU7c3Ryb2tlLXdpZHRoOjE7c3Ryb2tlLWxpbmVjYXA6cm91bmQ7c3Ryb2tlLWxpbmVqb2luOnJvdW5kO3N0cm9rZS1taXRlcmxpbWl0OjQ7c3Ryb2tlLWRhc2hhcnJheTpub25lO3N0cm9rZS1vcGFjaXR5OjEiDQogICAgIGlkPSJyZWN0NDE5NCINCiAgICAgd2lkdGg9IjQuMDA4ODMyIg0KICAgICBoZWlnaHQ9IjIuOTk0ODI0NiINCiAgICAgeD0iMTIuOTk1ODgyIg0KICAgICB5PSI3LjAwNTc2NzgiIC8+PHJlY3QNCiAgICAgc3R5bGU9ImZpbGw6dXJsKCNsaW5lYXJHcmFkaWVudDQzMDUpO2ZpbGwtb3BhY2l0eToxO3N0cm9rZTpub25lO3N0cm9rZS13aWR0aDoxO3N0cm9rZS1saW5lY2FwOnJvdW5kO3N0cm9rZS1saW5lam9pbjpyb3VuZDtzdHJva2UtbWl0ZXJsaW1pdDo0O3N0cm9rZS1kYXNoYXJyYXk6bm9uZTtzdHJva2Utb3BhY2l0eToxIg0KICAgICBpZD0icmVjdDQxOTYiDQogICAgIHdpZHRoPSI0LjAwNDQzMTIiDQogICAgIGhlaWdodD0iMi45ODcyODgiDQogICAgIHg9IjIuOTg4NjQ0MSINCiAgICAgeT0iMTEuMDE3NTQzIiAvPjxyZWN0DQogICAgIHN0eWxlPSJmaWxsOnVybCgjbGluZWFyR3JhZGllbnQ0MzEzKTtmaWxsLW9wYWNpdHk6MTtzdHJva2U6bm9uZTtzdHJva2Utd2lkdGg6MTtzdHJva2UtbGluZWNhcDpyb3VuZDtzdHJva2UtbGluZWpvaW46cm91bmQ7c3Ryb2tlLW1pdGVybGltaXQ6NDtzdHJva2UtZGFzaGFycmF5Om5vbmU7c3Ryb2tlLW9wYWNpdHk6MSINCiAgICAgaWQ9InJlY3Q0MTk4Ig0KICAgICB3aWR0aD0iNC4wMDEyOTIyIg0KICAgICBoZWlnaHQ9IjMuMDA4NjU4OSINCiAgICAgeD0iNy45NzgyMzE5Ig0KICAgICB5PSIxMS4wMDUwMTMiIC8+PHJlY3QNCiAgICAgc3R5bGU9ImZpbGw6dXJsKCNsaW5lYXJHcmFkaWVudDQzMjEpO2ZpbGwtb3BhY2l0eToxO3N0cm9rZTpub25lO3N0cm9rZS13aWR0aDoxO3N0cm9rZS1saW5lY2FwOnJvdW5kO3N0cm9rZS1saW5lam9pbjpyb3VuZDtzdHJva2UtbWl0ZXJsaW1pdDo0O3N0cm9rZS1kYXNoYXJyYXk6bm9uZTtzdHJva2Utb3BhY2l0eToxIg0KICAgICBpZD0icmVjdDQyMDAiDQogICAgIHdpZHRoPSI0LjAwMjIzNDUiDQogICAgIGhlaWdodD0iMi45OTUyMzI4Ig0KICAgICB4PSIxMy4wMDA2NSINCiAgICAgeT0iMTEuMDA1NjI2IiAvPjxyZWN0DQogICAgIHN0eWxlPSJmaWxsOnVybCgjbGluZWFyR3JhZGllbnQ0MzI5KTtmaWxsLW9wYWNpdHk6MTtzdHJva2U6bm9uZTtzdHJva2Utd2lkdGg6MTtzdHJva2UtbGluZWNhcDpyb3VuZDtzdHJva2UtbGluZWpvaW46cm91bmQ7c3Ryb2tlLW1pdGVybGltaXQ6NDtzdHJva2UtZGFzaGFycmF5Om5vbmU7c3Ryb2tlLW9wYWNpdHk6MSINCiAgICAgaWQ9InJlY3Q0MjAyIg0KICAgICB3aWR0aD0iNC4wMDA4OTE3Ig0KICAgICBoZWlnaHQ9IjEuOTczNDI0MyINCiAgICAgeD0iMi45ODk4MjY3Ig0KICAgICB5PSIxNS4wMTkwNTMiIC8+PHJlY3QNCiAgICAgc3R5bGU9ImZpbGw6dXJsKCNsaW5lYXJHcmFkaWVudDQzMzcpO2ZpbGwtb3BhY2l0eToxO3N0cm9rZTpub25lO3N0cm9rZS13aWR0aDoxO3N0cm9rZS1saW5lY2FwOnJvdW5kO3N0cm9rZS1saW5lam9pbjpyb3VuZDtzdHJva2UtbWl0ZXJsaW1pdDo0O3N0cm9rZS1kYXNoYXJyYXk6bm9uZTtzdHJva2Utb3BhY2l0eToxIg0KICAgICBpZD0icmVjdDQyMDQiDQogICAgIHdpZHRoPSIzLjk5OTg0NjkiDQogICAgIGhlaWdodD0iMS45NzkwNDIyIg0KICAgICB4PSI3Ljk4MjEzODIiDQogICAgIHk9IjE1LjAxMzQzNiIgLz48cmVjdA0KICAgICBzdHlsZT0iZmlsbDp1cmwoI2xpbmVhckdyYWRpZW50NDM0NSk7ZmlsbC1vcGFjaXR5OjE7c3Ryb2tlOm5vbmU7c3Ryb2tlLXdpZHRoOjE7c3Ryb2tlLWxpbmVjYXA6cm91bmQ7c3Ryb2tlLWxpbmVqb2luOnJvdW5kO3N0cm9rZS1taXRlcmxpbWl0OjQ7c3Ryb2tlLWRhc2hhcnJheTpub25lO3N0cm9rZS1vcGFjaXR5OjEiDQogICAgIGlkPSJyZWN0NDIwNiINCiAgICAgd2lkdGg9IjQuMDA5NDM2NiINCiAgICAgaGVpZ2h0PSIxLjk3OTA0MjIiDQogICAgIHg9IjEyLjk5NjM3NCINCiAgICAgeT0iMTUuMDEzNDM2IiAvPjxwYXRoDQogICAgIHN0eWxlPSJmaWxsOnVybCgjbGluZWFyR3JhZGllbnQ0MjE2KTtmaWxsLW9wYWNpdHk6MTtzdHJva2U6IzNkNmFhYztzdHJva2Utd2lkdGg6MTtzdHJva2UtbGluZWNhcDpyb3VuZDtzdHJva2UtbGluZWpvaW46cm91bmQ7c3Ryb2tlLW1pdGVybGltaXQ6NDtzdHJva2UtZGFzaGFycmF5Om5vbmU7c3Ryb2tlLW9wYWNpdHk6MSINCiAgICAgZD0ibSAwLjUwNDkzNjMyLDAuNTA1MTk5OTkgMTguOTg5ODY0NjgsMCAwLDQuMDA4NDc5MDEgLTE4Ljk4OTg2NDY4LDAgeiINCiAgICAgaWQ9InJlY3Q0MjA4Ig0KICAgICBpbmtzY2FwZTpjb25uZWN0b3ItY3VydmF0dXJlPSIwIg0KICAgICBzb2RpcG9kaTpub2RldHlwZXM9ImNjY2NjIiAvPjwvc3ZnPg==',
	},
	
	view: false,
	itemCount: 0,
	
	isView: function(){
		return this.view;
	},
	
	getItemCount: function(){
		return this.itemCount;
	},

	$server: {
		$require: ['JSB.Workspace.WorkspaceController'],
		
		descriptor: null,
		fields: null,

		typeOrder: {
			'null': 0,
			'boolean': 1,
			'integer': 2,
			'float': 3,
			'string': 4,
			'object': 5,
			'array': 6
		},

		$constructor: function(id, workspace, opts, source){
			$base(id, workspace, source);
			
			if(opts){
				this.descriptor = opts;
				this.property('descriptor', this.descriptor);
				this.setName(this.descriptor.name);
				this.view = this.descriptor.isView || false;
				this.itemCount = this.descriptor.count || 0;
				$this.publish('DataCube.Model.SqlTable.updated');
			} else {
				this.descriptor = this.property('descriptor');
				this.missing = this.property('missing') || false;
				this.view = this.descriptor.isView || false;
				this.itemCount = this.descriptor.count || 0;
			}
			
			this.subscribe(['DataCube.Model.MongoSource.updateSettings','DataCube.Model.MongoSource.clearCache'], function(sender){
				if($this.getParent() != sender){
					return;
				}
				$this.publish('DataCube.Model.MongoCollection.updated');
			});
			
			this.subscribe('DataCube.Model.MongoSource.updateCache', function(sender){
				if($this.getParent() != sender){
					return;
				}
				$this.publish('DataCube.Model.MongoSource.updateCache');
			});

		},

		combineRecord: function(record, fields){
			
			function detectValueTable(value){
				var type = null;
				if(JSB.isNull(value)){
					type = 'null';
				} else if(JSB.isBoolean(value)){
					type = 'boolean';
				} else if(JSB.isString(value)){
					type = 'string';
				} else if(JSB.isFloat(value)){
					type = 'float';
				} else if(JSB.isInteger(value)){
					type = 'integer';
				} else if(JSB.isArray(value)) {
					type = 'array';
				} else if(JSB.isObject(value)) {
					type = 'object';
				} else if(JSB.isDate(value)) {
					type = 'date';
				} else {
					throw new Error('Unknown value type: ' + JSON.stringify(value));
				}
				return type;
			}
			
			var bChanged = false;
			for(var f in record){
				// obtain record type
				var rType = detectValueTable(record[f]);
				if(!JSB.isDefined(fields[f])){
					fields[f] = {
						name: f,
						type: rType
					};
					bChanged = true;
				} else {
					var eType = fields[f].type;
					if(this.typeOrder[rType] > this.typeOrder[eType]){
						bChanged = true;
						fields[f].type = rType;
					}
				}
				if(rType == 'object'){
					if(!JSB.isDefined(fields[f].fields)){
						fields[f].fields = {};
					}
					bChanged = this.combineRecord(record[f], fields[f].fields) || bChanged;
				} else if(rType == 'array'){
					for(var i = 0; i < record[f].length; i++){
						var iType = detectValueTable(record[f][i]);
						if(!JSB.isDefined(fields[f].itemType)){
							fields[f].itemType = iType;
						} else {
							if(this.typeOrder[iType] > this.typeOrder[fields[f].itemType]){
								bChanged = true;
								fields[f].itemType = iType;
							}
						}
						if(iType == 'object'){
							if(!JSB.isDefined(fields[f].fields)){
								fields[f].fields = {};
							}
							bChanged = this.combineRecord(record[f][i], fields[f].fields) || bChanged;
						}
					}
				}
			}
			return bChanged;
		},

		

		extractFields: function(opts){
			if(this.fields && (!opts || !opts.refresh)){
				return this.fields;
			}
			var desc = this.getDescriptor(),
			    fields = {},
			    isIdProps = opts && opts.idProps;
			var collectionName = desc.name;

			var scheme = (function(conn){
				// extract columns by querying contents
				var fieldTree = {};
				var it = this.asMongodb().iteratedQuery({find:collectionName});
				try {
					var unChanged = 0, read = 0;
					while(true){
						var record = it.next();
						if(!record){
							break;
						}
						read++;
						if($this.combineRecord(record, fieldTree)){
							unChanged = 0;
						} else {
							unChanged++;
						}
						if(unChanged > 100 || read > 1000){
							break;
						}
					}
					return fieldTree;
				} finally {
					it.close();
				}
			}).call(this.getStore());

			// transform fieldTree into plain fields
			function transformTreeEntry(treeFields, parent){
				for(var f in treeFields){
					var e = treeFields[f];
					var key = parent && parent.length > 0 ? parent + '.' + e.name : e.name;
					fields[key] = {
						id: key,
						name: e.name,
						type: e.type,
						nativeType: e.type
					};
					if(parent && parent.length > 0){
						fields[key].parent = parent;
					}
					if(e.type == 'object' || (e.type == 'array' && e.itemType == 'object')){
						transformTreeEntry(e.fields, key);
					}
				}
			}

			transformTreeEntry(scheme, null);

			this.fields = fields;
			return this.fields;
		},

		getDescriptor: function(){
			return this.descriptor;
		},

		getCollectionName: function(){
		    return this.descriptor.name;
		},

		updateDescriptor: function(desc){
			this.descriptor = desc;
			this.property('descriptor', this.descriptor);
			this.view = this.descriptor.isView || false;
			this.itemCount = this.descriptor.count || 0;
			this.setName(this.descriptor.name);
			this.doSync();
			$this.publish('DataCube.Model.SqlTable.updated');
		}
	}
}