{
	$name: 'DataCube.Widgets.ScatterChart',
	//$parent: 'DataCube.Widgets.Widget',
	$expose: {
		name: 'Разброс',
		description: '',
		category: 'Диаграммы',
		icon: `data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiIHN0YW5kYWxvbmU9Im5vIj8+DQo8c3ZnDQogICB4bWxuczpkYz0iaHR0cDovL3B1cmwub3JnL2RjL2VsZW1lbnRzLzEuMS8iDQogICB4bWxuczpjYz0iaHR0cDovL2NyZWF0aXZlY29tbW9ucy5vcmcvbnMjIg0KICAgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIg0KICAgeG1sbnM6c3ZnPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyINCiAgIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyINCiAgIHhtbG5zOnNvZGlwb2RpPSJodHRwOi8vc29kaXBvZGkuc291cmNlZm9yZ2UubmV0L0RURC9zb2RpcG9kaS0wLmR0ZCINCiAgIHhtbG5zOmlua3NjYXBlPSJodHRwOi8vd3d3Lmlua3NjYXBlLm9yZy9uYW1lc3BhY2VzL2lua3NjYXBlIg0KICAgaWQ9ItCh0LvQvtC5XzEiDQogICB2ZXJzaW9uPSIxLjEiDQogICB2aWV3Qm94PSIwIDAgMjAgMjAiDQogICB4bWw6c3BhY2U9InByZXNlcnZlIg0KICAgaW5rc2NhcGU6dmVyc2lvbj0iMC45MSByMTM3MjUiDQogICBzb2RpcG9kaTpkb2NuYW1lPSJzY2F0dGVyX2ljb24uc3ZnIg0KICAgd2lkdGg9IjIwIg0KICAgaGVpZ2h0PSIyMCI+PG1ldGFkYXRhDQogICAgIGlkPSJtZXRhZGF0YTI1Ij48cmRmOlJERj48Y2M6V29yaw0KICAgICAgICAgcmRmOmFib3V0PSIiPjxkYzpmb3JtYXQ+aW1hZ2Uvc3ZnK3htbDwvZGM6Zm9ybWF0PjxkYzp0eXBlDQogICAgICAgICAgIHJkZjpyZXNvdXJjZT0iaHR0cDovL3B1cmwub3JnL2RjL2RjbWl0eXBlL1N0aWxsSW1hZ2UiIC8+PGRjOnRpdGxlPjwvZGM6dGl0bGU+PC9jYzpXb3JrPjwvcmRmOlJERj48L21ldGFkYXRhPjxkZWZzDQogICAgIGlkPSJkZWZzMjMiIC8+PHNvZGlwb2RpOm5hbWVkdmlldw0KICAgICBwYWdlY29sb3I9IiNmZmZmZmYiDQogICAgIGJvcmRlcmNvbG9yPSIjNjY2NjY2Ig0KICAgICBib3JkZXJvcGFjaXR5PSIxIg0KICAgICBvYmplY3R0b2xlcmFuY2U9IjEwIg0KICAgICBncmlkdG9sZXJhbmNlPSIxMCINCiAgICAgZ3VpZGV0b2xlcmFuY2U9IjEwIg0KICAgICBpbmtzY2FwZTpwYWdlb3BhY2l0eT0iMCINCiAgICAgaW5rc2NhcGU6cGFnZXNoYWRvdz0iMiINCiAgICAgaW5rc2NhcGU6d2luZG93LXdpZHRoPSIxOTIwIg0KICAgICBpbmtzY2FwZTp3aW5kb3ctaGVpZ2h0PSIxMTc4Ig0KICAgICBpZD0ibmFtZWR2aWV3MjEiDQogICAgIHNob3dncmlkPSJmYWxzZSINCiAgICAgc2hvd2d1aWRlcz0idHJ1ZSINCiAgICAgaW5rc2NhcGU6Z3VpZGUtYmJveD0idHJ1ZSINCiAgICAgaW5rc2NhcGU6em9vbT0iNDEuNzE5MyINCiAgICAgaW5rc2NhcGU6Y3g9IjExLjI2MDY1OCINCiAgICAgaW5rc2NhcGU6Y3k9IjkuMjcxNjg1NCINCiAgICAgaW5rc2NhcGU6d2luZG93LXg9IjE5MTIiDQogICAgIGlua3NjYXBlOndpbmRvdy15PSItOCINCiAgICAgaW5rc2NhcGU6d2luZG93LW1heGltaXplZD0iMSINCiAgICAgaW5rc2NhcGU6Y3VycmVudC1sYXllcj0i0KHQu9C+0LlfMSI+PHNvZGlwb2RpOmd1aWRlDQogICAgICAgcG9zaXRpb249IjE0LjI4NTk1NCwxOC45ODQwMTkiDQogICAgICAgb3JpZW50YXRpb249IjAsMSINCiAgICAgICBpZD0iZ3VpZGU0MTY4IiAvPjwvc29kaXBvZGk6bmFtZWR2aWV3PjxzdHlsZQ0KICAgICB0eXBlPSJ0ZXh0L2NzcyINCiAgICAgaWQ9InN0eWxlMyI+DQoJLnN0MHtmaWxsOm5vbmU7c3Ryb2tlOiNGRkZGRkY7c3Ryb2tlLXdpZHRoOjc7c3Ryb2tlLWxpbmVjYXA6cm91bmQ7c3Ryb2tlLWxpbmVqb2luOnJvdW5kO3N0cm9rZS1taXRlcmxpbWl0OjEwO30NCgkuc3Qxe2ZpbGw6IzI0ODEzOTtzdHJva2U6I0ZGRkZGRjtzdHJva2Utd2lkdGg6MTA7c3Ryb2tlLWxpbmVjYXA6cm91bmQ7c3Ryb2tlLWxpbmVqb2luOnJvdW5kO3N0cm9rZS1taXRlcmxpbWl0OjEwO30NCgkuc3Qye2ZpbGw6I0Y1QkU0MDtzdHJva2U6I0ZGRkZGRjtzdHJva2Utd2lkdGg6MTA7c3Ryb2tlLWxpbmVjYXA6cm91bmQ7c3Ryb2tlLWxpbmVqb2luOnJvdW5kO3N0cm9rZS1taXRlcmxpbWl0OjEwO30NCgkuc3Qze2ZpbGw6IzMyQTlCODtzdHJva2U6I0ZGRkZGRjtzdHJva2Utd2lkdGg6MTA7c3Ryb2tlLWxpbmVjYXA6cm91bmQ7c3Ryb2tlLWxpbmVqb2luOnJvdW5kO3N0cm9rZS1taXRlcmxpbWl0OjEwO30NCgkuc3Q0e2ZpbGw6I0NGMzcyMjtzdHJva2U6I0ZGRkZGRjtzdHJva2Utd2lkdGg6MTA7c3Ryb2tlLWxpbmVjYXA6cm91bmQ7c3Ryb2tlLWxpbmVqb2luOnJvdW5kO3N0cm9rZS1taXRlcmxpbWl0OjEwO30NCjwvc3R5bGU+PHBvbHlsaW5lDQogICAgIHN0eWxlPSJmaWxsOm5vbmU7c3Ryb2tlOiNmZmZmZmY7c3Ryb2tlLXdpZHRoOjc7c3Ryb2tlLWxpbmVjYXA6cm91bmQ7c3Ryb2tlLWxpbmVqb2luOnJvdW5kO3N0cm9rZS1taXRlcmxpbWl0OjEwIg0KICAgICBpZD0icG9seWxpbmU3Ig0KICAgICBwb2ludHM9IjMzLjksNTQuNiAzMy45LDQ4NS42IDQ3Myw0ODUuNiAgIg0KICAgICBjbGFzcz0ic3QwIg0KICAgICB0cmFuc2Zvcm09InRyYW5zbGF0ZSgwLC00OTIpIiAvPjxjaXJjbGUNCiAgICAgc3R5bGU9ImZpbGw6IzU1MjIwMDtzdHJva2U6I2ZmZmZmZjtzdHJva2Utd2lkdGg6MC4zMDUxOTA2NTtzdHJva2UtbGluZWNhcDpyb3VuZDtzdHJva2UtbGluZWpvaW46cm91bmQ7c3Ryb2tlLW1pdGVybGltaXQ6MTAiDQogICAgIGlkPSJjaXJjbGU5Ig0KICAgICByPSIxLjA4OTUzMDYiDQogICAgIGN5PSIxOC4yNTg1NTEiDQogICAgIGN4PSIxLjU1NjY3NTgiDQogICAgIGNsYXNzPSJzdDEiIC8+PGNpcmNsZQ0KICAgICBzdHlsZT0iZmlsbDojNTUyMjAwO3N0cm9rZTojZmZmZmZmO3N0cm9rZS13aWR0aDowLjMwNTE5MDY1O3N0cm9rZS1saW5lY2FwOnJvdW5kO3N0cm9rZS1saW5lam9pbjpyb3VuZDtzdHJva2UtbWl0ZXJsaW1pdDoxMCINCiAgICAgaWQ9ImNpcmNsZTktNCINCiAgICAgcj0iMS4wODk1MzA2Ig0KICAgICBjeT0iMTIuNDk3NDc4Ig0KICAgICBjeD0iNi4zNTE5NzY0Ig0KICAgICBjbGFzcz0ic3QxIiAvPjxjaXJjbGUNCiAgICAgc3R5bGU9ImZpbGw6IzU1MjIwMDtzdHJva2U6I2ZmZmZmZjtzdHJva2Utd2lkdGg6MC4zMDUxOTA2NTtzdHJva2UtbGluZWNhcDpyb3VuZDtzdHJva2UtbGluZWpvaW46cm91bmQ7c3Ryb2tlLW1pdGVybGltaXQ6MTAiDQogICAgIGlkPSJjaXJjbGU5LTMiDQogICAgIHI9IjEuMDg5NTMwNiINCiAgICAgY3k9IjE0LjQxNTA1NSINCiAgICAgY3g9IjIuMjI5MTgzOSINCiAgICAgY2xhc3M9InN0MSIgLz48Y2lyY2xlDQogICAgIHN0eWxlPSJmaWxsOiM1NTIyMDA7c3Ryb2tlOiNmZmZmZmY7c3Ryb2tlLXdpZHRoOjAuMzA1MTkwNjU7c3Ryb2tlLWxpbmVjYXA6cm91bmQ7c3Ryb2tlLWxpbmVqb2luOnJvdW5kO3N0cm9rZS1taXRlcmxpbWl0OjEwIg0KICAgICBpZD0iY2lyY2xlOS04Ig0KICAgICByPSIxLjA4OTUzMDYiDQogICAgIGN5PSIxNS4xMzQxNDciDQogICAgIGN4PSI2LjE2MDIxODciDQogICAgIGNsYXNzPSJzdDEiIC8+PGNpcmNsZQ0KICAgICBzdHlsZT0iZmlsbDojNTUyMjAwO3N0cm9rZTojZmZmZmZmO3N0cm9rZS13aWR0aDowLjMwNTE5MDY1O3N0cm9rZS1saW5lY2FwOnJvdW5kO3N0cm9rZS1saW5lam9pbjpyb3VuZDtzdHJva2UtbWl0ZXJsaW1pdDoxMCINCiAgICAgaWQ9ImNpcmNsZTktNDQiDQogICAgIHI9IjEuMDg5NTMwNiINCiAgICAgY3k9IjE4LjA1ODQ1MyINCiAgICAgY3g9IjUuMDA5NjcxMiINCiAgICAgY2xhc3M9InN0MSIgLz48Y2lyY2xlDQogICAgIHN0eWxlPSJmaWxsOiM1NTIyMDA7c3Ryb2tlOiNmZmZmZmY7c3Ryb2tlLXdpZHRoOjAuMzA1MTkwNjU7c3Ryb2tlLWxpbmVjYXA6cm91bmQ7c3Ryb2tlLWxpbmVqb2luOnJvdW5kO3N0cm9rZS1taXRlcmxpbWl0OjEwIg0KICAgICBpZD0iY2lyY2xlOS00OCINCiAgICAgcj0iMS4wODk1MzA2Ig0KICAgICBjeT0iMTUuMjMwMDI2Ig0KICAgICBjeD0iMTIuOTQzNjQ5Ig0KICAgICBjbGFzcz0ic3QxIiAvPjxjaXJjbGUNCiAgICAgc3R5bGU9ImZpbGw6IzU1MjIwMDtzdHJva2U6I2ZmZmZmZjtzdHJva2Utd2lkdGg6MC4zMDUxOTA2NTtzdHJva2UtbGluZWNhcDpyb3VuZDtzdHJva2UtbGluZWpvaW46cm91bmQ7c3Ryb2tlLW1pdGVybGltaXQ6MTAiDQogICAgIGlkPSJjaXJjbGU5LTEiDQogICAgIHI9IjEuMDg5NTMwNiINCiAgICAgY3k9IjExLjUxNDcxOCINCiAgICAgY3g9IjEwLjk3ODEzNCINCiAgICAgY2xhc3M9InN0MSIgLz48Y2lyY2xlDQogICAgIHN0eWxlPSJmaWxsOiM1NTIyMDA7c3Ryb2tlOiNmZmZmZmY7c3Ryb2tlLXdpZHRoOjAuMzA1MTkwNjU7c3Ryb2tlLWxpbmVjYXA6cm91bmQ7c3Ryb2tlLWxpbmVqb2luOnJvdW5kO3N0cm9rZS1taXRlcmxpbWl0OjEwIg0KICAgICBpZD0iY2lyY2xlOS01Ig0KICAgICByPSIxLjA4OTUzMDYiDQogICAgIGN5PSIxNC43MjY2NjEiDQogICAgIGN4PSI5LjcwNzczNyINCiAgICAgY2xhc3M9InN0MSIgLz48Y2lyY2xlDQogICAgIHN0eWxlPSJmaWxsOiM1NTIyMDA7c3Ryb2tlOiNmZmZmZmY7c3Ryb2tlLXdpZHRoOjAuMzA1MTkwNjU7c3Ryb2tlLWxpbmVjYXA6cm91bmQ7c3Ryb2tlLWxpbmVqb2luOnJvdW5kO3N0cm9rZS1taXRlcmxpbWl0OjEwIg0KICAgICBpZD0iY2lyY2xlOS00MiINCiAgICAgcj0iMS4wODk1MzA2Ig0KICAgICBjeT0iOS44MzY4Mzc4Ig0KICAgICBjeD0iNC4yMTg2NzA4Ig0KICAgICBjbGFzcz0ic3QxIiAvPjxjaXJjbGUNCiAgICAgc3R5bGU9ImZpbGw6IzIxNjc3ODtzdHJva2U6I2ZmZmZmZjtzdHJva2Utd2lkdGg6MC4zMDUxOTA2NTtzdHJva2UtbGluZWNhcDpyb3VuZDtzdHJva2UtbGluZWpvaW46cm91bmQ7c3Ryb2tlLW1pdGVybGltaXQ6MTAiDQogICAgIGlkPSJjaXJjbGU5LTEtMCINCiAgICAgcj0iMS4wODk1MzA2Ig0KICAgICBjeT0iOS41MjUyMzE0Ig0KICAgICBjeD0iOC4wNTM4MjU0Ig0KICAgICBjbGFzcz0ic3QxIiAvPjxjaXJjbGUNCiAgICAgc3R5bGU9ImZpbGw6IzIxNjc3ODtzdHJva2U6I2ZmZmZmZjtzdHJva2Utd2lkdGg6MC4zMDUxOTA2NTtzdHJva2UtbGluZWNhcDpyb3VuZDtzdHJva2UtbGluZWpvaW46cm91bmQ7c3Ryb2tlLW1pdGVybGltaXQ6MTAiDQogICAgIGlkPSJjaXJjbGU5LTEtMC05Ig0KICAgICByPSIxLjA4OTUzMDYiDQogICAgIGN5PSIxMi40NDk1MzciDQogICAgIGN4PSIxMy45NzQzNDciDQogICAgIGNsYXNzPSJzdDEiIC8+PGNpcmNsZQ0KICAgICBzdHlsZT0iZmlsbDojMjE2Nzc4O3N0cm9rZTojZmZmZmZmO3N0cm9rZS13aWR0aDowLjMwNTE5MDY1O3N0cm9rZS1saW5lY2FwOnJvdW5kO3N0cm9rZS1saW5lam9pbjpyb3VuZDtzdHJva2UtbWl0ZXJsaW1pdDoxMCINCiAgICAgaWQ9ImNpcmNsZTktMS0wLTgiDQogICAgIHI9IjEuMDg5NTMwNiINCiAgICAgY3k9IjguNDQ2NTk0MiINCiAgICAgY3g9IjExLjUwNTQ2NiINCiAgICAgY2xhc3M9InN0MSIgLz48Y2lyY2xlDQogICAgIHN0eWxlPSJmaWxsOiMyMTY3Nzg7c3Ryb2tlOiNmZmZmZmY7c3Ryb2tlLXdpZHRoOjAuMzA1MTkwNjU7c3Ryb2tlLWxpbmVjYXA6cm91bmQ7c3Ryb2tlLWxpbmVqb2luOnJvdW5kO3N0cm9rZS1taXRlcmxpbWl0OjEwIg0KICAgICBpZD0iY2lyY2xlOS0xLTAtMyINCiAgICAgcj0iMS4wODk1MzA2Ig0KICAgICBjeT0iOS4xNDE3MTYiDQogICAgIGN4PSIxNC41NzM1OTEiDQogICAgIGNsYXNzPSJzdDEiIC8+PGNpcmNsZQ0KICAgICBzdHlsZT0iZmlsbDojMjE2Nzc4O3N0cm9rZTojZmZmZmZmO3N0cm9rZS13aWR0aDowLjMwNTE5MDY1O3N0cm9rZS1saW5lY2FwOnJvdW5kO3N0cm9rZS1saW5lam9pbjpyb3VuZDtzdHJva2UtbWl0ZXJsaW1pdDoxMCINCiAgICAgaWQ9ImNpcmNsZTktMS0wLTgwIg0KICAgICByPSIxLjA4OTUzMDYiDQogICAgIGN5PSI0LjE1NjAxNCINCiAgICAgY3g9IjEwLjUyMjcwNyINCiAgICAgY2xhc3M9InN0MSIgLz48Y2lyY2xlDQogICAgIHN0eWxlPSJmaWxsOiMyMTY3Nzg7c3Ryb2tlOiNmZmZmZmY7c3Ryb2tlLXdpZHRoOjAuMzA1MTkwNjU7c3Ryb2tlLWxpbmVjYXA6cm91bmQ7c3Ryb2tlLWxpbmVqb2luOnJvdW5kO3N0cm9rZS1taXRlcmxpbWl0OjEwIg0KICAgICBpZD0iY2lyY2xlOS0xLTAtODIiDQogICAgIHI9IjEuMDg5NTMwNiINCiAgICAgY3k9IjYuMjY1MzQ5NCINCiAgICAgY3g9IjcuODE0MTI5NCINCiAgICAgY2xhc3M9InN0MSIgLz48Y2lyY2xlDQogICAgIHN0eWxlPSJmaWxsOiMyMTY3Nzg7c3Ryb2tlOiNmZmZmZmY7c3Ryb2tlLXdpZHRoOjAuMzA1MTkwNjU7c3Ryb2tlLWxpbmVjYXA6cm91bmQ7c3Ryb2tlLWxpbmVqb2luOnJvdW5kO3N0cm9rZS1taXRlcmxpbWl0OjEwIg0KICAgICBpZD0iY2lyY2xlOS0xLTAtMzgiDQogICAgIHI9IjEuMDg5NTMwNiINCiAgICAgY3k9IjUuNDc0MzQ4NSINCiAgICAgY3g9IjEzLjkyNjQwOCINCiAgICAgY2xhc3M9InN0MSIgLz48Y2lyY2xlDQogICAgIHN0eWxlPSJmaWxsOiMyMTY3Nzg7c3Ryb2tlOiNmZmZmZmY7c3Ryb2tlLXdpZHRoOjAuMzA1MTkwNjU7c3Ryb2tlLWxpbmVjYXA6cm91bmQ7c3Ryb2tlLWxpbmVqb2luOnJvdW5kO3N0cm9rZS1taXRlcmxpbWl0OjEwIg0KICAgICBpZD0iY2lyY2xlOS0xLTAtMSINCiAgICAgcj0iMS4wODk1MzA2Ig0KICAgICBjeT0iNi4zODUxOTgxIg0KICAgICBjeD0iMTcuMjgyMTY5Ig0KICAgICBjbGFzcz0ic3QxIiAvPjxjaXJjbGUNCiAgICAgc3R5bGU9ImZpbGw6IzIxNjc3ODtzdHJva2U6I2ZmZmZmZjtzdHJva2Utd2lkdGg6MC4zMDUxOTA2NTtzdHJva2UtbGluZWNhcDpyb3VuZDtzdHJva2UtbGluZWpvaW46cm91bmQ7c3Ryb2tlLW1pdGVybGltaXQ6MTAiDQogICAgIGlkPSJjaXJjbGU5LTEtMC05MyINCiAgICAgcj0iMS4wODk1MzA2Ig0KICAgICBjeT0iMi40NzgxMzM3Ig0KICAgICBjeD0iMTcuNDczOTI3Ig0KICAgICBjbGFzcz0ic3QxIiAvPjxjaXJjbGUNCiAgICAgc3R5bGU9ImZpbGw6IzIxNjc3ODtzdHJva2U6I2ZmZmZmZjtzdHJva2Utd2lkdGg6MC4zMDUxOTA2NTtzdHJva2UtbGluZWNhcDpyb3VuZDtzdHJva2UtbGluZWpvaW46cm91bmQ7c3Ryb2tlLW1pdGVybGltaXQ6MTAiDQogICAgIGlkPSJjaXJjbGU5LTEtMC00NSINCiAgICAgcj0iMS4wODk1MzA2Ig0KICAgICBjeT0iMi40NTQxNjM4Ig0KICAgICBjeD0iMTQuNDA1ODA0Ig0KICAgICBjbGFzcz0ic3QxIiAvPjxjaXJjbGUNCiAgICAgc3R5bGU9ImZpbGw6IzIxNjc3ODtzdHJva2U6I2ZmZmZmZjtzdHJva2Utd2lkdGg6MC4zMDUxOTA2NTtzdHJva2UtbGluZWNhcDpyb3VuZDtzdHJva2UtbGluZWpvaW46cm91bmQ7c3Ryb2tlLW1pdGVybGltaXQ6MTAiDQogICAgIGlkPSJjaXJjbGU5LTEtMC03MCINCiAgICAgcj0iMS4wODk1MzA2Ig0KICAgICBjeT0iMi40NzgxMzM3Ig0KICAgICBjeD0iMTQuMTY2MTA1Ig0KICAgICBjbGFzcz0ic3QxIiAvPjxjaXJjbGUNCiAgICAgc3R5bGU9ImZpbGw6IzU1MjIwMDtzdHJva2U6I2ZmZmZmZjtzdHJva2Utd2lkdGg6MC4zMDUxOTA2NTtzdHJva2UtbGluZWNhcDpyb3VuZDtzdHJva2UtbGluZWpvaW46cm91bmQ7c3Ryb2tlLW1pdGVybGltaXQ6MTAiDQogICAgIGlkPSJjaXJjbGU5LTQ4LTYiDQogICAgIHI9IjEuMDg5NTMwNiINCiAgICAgY3k9IjE0LjEwMzQ0OSINCiAgICAgY3g9IjE2Ljg3NDY4NSINCiAgICAgY2xhc3M9InN0MSIgLz48Y2lyY2xlDQogICAgIHN0eWxlPSJmaWxsOiM1NTIyMDA7c3Ryb2tlOiNmZmZmZmY7c3Ryb2tlLXdpZHRoOjAuMzA1MTkwNjU7c3Ryb2tlLWxpbmVjYXA6cm91bmQ7c3Ryb2tlLWxpbmVqb2luOnJvdW5kO3N0cm9rZS1taXRlcmxpbWl0OjEwIg0KICAgICBpZD0iY2lyY2xlOS00NC0yIg0KICAgICByPSIxLjA4OTUzMDYiDQogICAgIGN5PSIxNy4yNjc0NTIiDQogICAgIGN4PSI4LjcyNDk3OTQiDQogICAgIGNsYXNzPSJzdDEiIC8+PGNpcmNsZQ0KICAgICBzdHlsZT0iZmlsbDojMjE2Nzc4O3N0cm9rZTojZmZmZmZmO3N0cm9rZS13aWR0aDowLjMwNTE5MDY1O3N0cm9rZS1saW5lY2FwOnJvdW5kO3N0cm9rZS1saW5lam9pbjpyb3VuZDtzdHJva2UtbWl0ZXJsaW1pdDoxMCINCiAgICAgaWQ9ImNpcmNsZTktMS0wLTgyLTMiDQogICAgIHI9IjEuMDg5NTMwNiINCiAgICAgY3k9IjYuODY0NTkyNiINCiAgICAgY3g9IjQuNTU0MjQ2OSINCiAgICAgY2xhc3M9InN0MSIgLz48L3N2Zz4=`,
		thumb: `data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGQAAABACAIAAABjvUUjAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJ
		bWFnZVJlYWR5ccllPAAAE/FJREFUeNrsWwl4U9W2PhmapumYzpQOFGgZZQZBKTJPXlAvPPXqu/re
		U/GpgCjykCu8572gOIAiyvQqImW0jEKZKYUOtHRu0ilJ0ylp0jRzMw8n+66TU0LokJZSLuDH+r7k
		22efvdfee5211/rX2udQEELYE+oZUZ+IoJfCcjgcPenjoRnc8qCqPeEP3XvNH8fx++QPHDzwf6JZ
		T7bhbRLrxWqzuq+40f/YwjrOOz40ZGh8YPwJ/onxEePnDZgHlRQK5b406w/mEzlyjkAt2FW2a86A
		OQqTYvax2S3GlkmRkwirhxy4A++lZpnN5vz8fAaDkZiYyGaze2KDPbRBTurq0fXQwHfakgIKQQXG
		FAQmnkK0oVKp5HBtDYj7VHL0PZw94T7hZfIyrVnLpDNDmCGLBy1mM9mwJVdlrILyksQlnU6GrGw3
		f4qTiBHhNjmqq/Z+6AExgRnakb1IVvRL+S8gKaqTLtdflhllUCAb3GouyGjKhPLZuvOfP/P3SL/I
		mbEzZ8bNPF93Pik6Cep3lOyw4JaPxn80N27uvc6zbRuyWKypU6dOnjw5ODgYBEd5JAkm2qhrBEnF
		+MeA+pBTr1RV6e1GlyKwKbTkkh/z5KV0k/po9WE6nanBjaPDRu+avSvSN3J6zHS5WZ5SmQK7EnTt
		noTVfuOQRKKMbslDM7hFQqF77egih5OgcLrmtMqkgoJQIzxXew4KVtwK/1fqrzS2NtZq65Ddihrz
		kWu4yjT9r8831lw8k/ZugyhX3MJBytq2cR1t4ypNyiNVR0w2U1ej2+12D/N/dL2hVC+FXWOwGVRm
		tcqsghoahZZSeUBqlPl7B5yqObOkfxJ288dtoWEbR68YGPYUNux53xZeysWVucGRi6g+2NWvzlol
		9qTVLw38k0sZg5nBrwx5pdfejOLek7RfPTHwXTVzbWQPHWHlYH3mxM1pd5er4Pb36w/rcXcRazL/
		R6pv2vjsJnD/+ytTbjZlb3n2C3+b9aAsR9jasCbh1VOpL82wUcInvrtNz3uvplBk0zCmrhkoLsEm
		/BfX28thhZ04qqML6mr+oPukEXxUQKnepuepeFqrtrilOJWX6qrPacoBB69H9oZbP2HCa2Tl8PBR
		sc1V8cwwKA8NHcE0GfjH33jnzNJfrq5eQGOzAmNen7kl6rWTBU1Z9GaOz5g34htKB/r2w8a9gbEH
		PBU4uJ2kHj9QGusfu3zs8t2c3fCER4aMNNlNPnSf9Mb0AFbo5YYrKsGJCIPyvcHzUoSn6QgAkRef
		xrDj5kq1Mlt8bVLop/MEy5aF25KZIzCMsNNYzESM4cuc/tlUwE9+8Z9Kzq8Ojo5mJzyQqT8sA293
		2OEfgPXByoM6q25d1rpXUyae4Z9Qg1G32Tfkf7X0a8aVjM+QWvz+sRfLCneuSH5mc96xS4KmDVl/
		P1uW3KDiOd0Bjg4uRc3lSFyMZNXAUWc348htApc+Q9Kydg7Ew/w9G3gCYQkEgqqqKoPBQEC+B0F3
		PxKSwFrDo3ph0Auz4+e/eWz+gFbFPp+RiyKfCWIE7D62KJEZ8sviE7OH/xXL2Bik4quoXtsTF79D
		Z2RnFf1j0mc2Ja/WrMTOfmipy7NYTJjVIBRlVjVeB45+NG9ArHfGjZ2CWGGdTuBepn97G4KAQJYt
		LS0A3319ffs+7oEBJGWIxcaCYjsidRqVFsII+mzGd6N8+9OztmFeLIxKmzTs5QFeIf5D/wQtKAs2
		b8AtdN9ITN8SsmPMPMeYhTsDvlywcjj/FMZkZpri6+j/tixmIodq1uVuHxY6Gg2Y7D4GNvR54r+v
		FkXqHgQ9nvWz19sQLixZW5DwWjfb3GpEVWlEQXAZVZx0VRtsDrXZ0agyfXO+HOVszS/Mv1nC5e19
		u1kqtrTKlx/lyPTWtqa1mfamsp7guF5vwz6GDq6wyVUj0okO8I7+bcKajh2h8cmak7PjFwYqeRiO
		QM0wcSEWMy4lRzQJL0YRIwp8nrtULh2ouL5uAroY/tafw6VY/k5s4fcYbsNoDBhJbbCyWQzXaPCg
		aN3N/36gQ596Q4ve0FLOjJ5Ix2iuuiDvoDEhI2AnQCTsqtRYNBK9dHjIMCoV11ocR9NujhwsN2FT
		xksLeUGL85E/hYKX8rwUdPGIKPaymXNYuOzP8f4Y8nXM2kQBEEZjOENrLNiX0U4SD9SP962wdN9l
		r39h3o+jg4eRFTaHDZABX82fHj0dLgEiwL9RWrqVd4AdEA3Cei7iZR9vLHDgiCPl6ystE3fO+s+w
		QN8ZceYZI16cZrLFsRkYbsK0Yix4htP8UQmjhiEMo2APhfoWOhhspqsNV3eV7YKy1qJdkb4CwjEo
		76/Y/13hVrKNmn/hWPFOZDdbzq1bue+GWGNGqUttV7+yHn8Hpf7FiKO532emForaOFacRj/P7SE0
		AYvTSa1Fj3B7n9isvhSW2qyWG+UQ5eZL88nwVWaQQaFOU/dp1upsoXhflkhuknxT/ANu0SE5DwnO
		XCqr/zFDiCxywhPUpSOTmuCjNyv01pR8qRbWWHoIlR3tRFgmLbryf0jTiPRyAm1JSiCutnc6sUvr
		kazikRPWhboL3+R/Q4oJAkDXqHCJI0u92prOU5lxXaGqGNVlofNr4FaZoEGqbIVCk9aSUSFCRb8g
		wVVi0k2cPT/v0hSmInVt597WbiEElLsDZW0l0g8n3kEGpb3TZcKDwW19JiyAo1qt1nO7boRVsBe1
		SqDWYrPAFejXqmsfchTlGkurEz04CPfOOYxUPNCVvZlijZGoaNbZLnyxRFmdDeUqJf5b8mZ0fpVD
		yiW4SwpR1TFUehTJ+Z6gCYjJOaKnbdh30IGq0WiysrLy8vIAl5IAtUtygib3ChJH/Fay53T9RYzm
		A97YaDNtzN1Ip9C+n7Etu/5KmTgHmgjVtauvr7ZDcxuCNkqjfvXxCsPxD8z1t1Ii1vrRHVhR8tBg
		6ssvLPrCj1Xjx4Y223khJf7zsdGvOEITUPEBdONrB5E+v5PwaiMq3UHzIifn6DG1Z9KD9qR9p23c
		uBEuAgICIiIivLy8PGUMm4oomgYKO5bMf0NFdksRqy4roKk4av6WRoP4OP/4tOgkHOHBjNj1aY3/
		HWAabm7Bosb5MfzGhI0Kin3W4RMM3Z4dFKrCK0+o8tKqx8fHRM4eSL9WxA8Z/rQ350hQYGyMWuTN
		CjbR/GMh8GF6gduj+IZTwhIpVWcoEAaw2FRnErmrlCaNRutJ5tMDBzJn3Xmy9B5sVsUpVHrY1Qww
		wfvpH1QrKsmbEhknX0xsqLRSWXJmXalIY7PapHqJzKxu625uRWdXgWWBIlfa9OHpq+VNOoOFsCab
		0iUipR6ZibwoytiIGvM6Gf3mT0hZgzuVgqwQaoQ6sEdGlcvZPeht2HsDX6Ou2VGyw828r6soS8mQ
		3IQJ68xtBvXnjLWH9k4Bc+acpt2hEJILU+hsqQWSto6tUiS4gFQ16MBiaFR5Zpu2+GRPwqn1Of9b
		LM5BqW8irbivhAX3NAaL3mJ/kN4wcytqyC1QcC7Wn9FZWh1kkgRc/oU1ivzUdSnpVmdFfauoQllu
		tDg+OVGuMd1mopdv/m3BgR8mqwuJ2DAlR1jVpHLnzRVrfrpW01FY4GSJgQwK5OgzzQL69mL14VsN
		D1JY/ItE9FufuzdP+N6lVXqrjmzHlRbs5qaUiYy4c4WZosyj1UeIrXbjminnB6JNySEkypfYlXsz
		8y+XN7vW485bpDJerZT1HpTei7DglslCALYHIqxfy3/lyrlEqfqcLXfP7hyJtFVTqqpQNmQ78nYr
		DbKKE/9OIJ3bGQiC8pMRNyXtxH6hFoS1H9VnuzM/UHEAQGzvkosP2mbdb2w4PHRkqE8oURqyEHi9
		i2Gnak5miK/72vF3YxcMKE0NblVjcj7WfxwR28kqsLAhWL/RWEB4s8E7VqfFxrzRjmFcQByLzvKQ
		HAMCh3tLemts+Fgy2PzXEQjS5qR7zmdBqPH7coRsp7iKvQVK1HAdlROGeXdpcr1OZpVX45fXo8rf
		wSTVtTYc4B2SCzh7Pp+45tBJy92DFNSptqcLOp4bdkprj3N4zYSevn7u9ZSKlH+1Zlmt1oqKCqPR
		OGTIkLCwsK5eRwDoUaPhl7Vw294SoFAxUKjRr1H3LxoTkGQJSsDsMsw/mlAN6uJTefpVM6PRoFmO
		+GlUCpXS2kinskKbr2KD+vn3ZyM7hnkRWxJzZpXC/RkT44IAw8AkO82IuSZQ1Fz03DCfqADinGLt
		xLVGm7HdWxHkQVzv3qXoybsOdCASgwEiJefUKRebHTuSLx4+gNoG26AvwweLm4I9vZImL8JajmFj
		36+LGuFXf2PmkKlTEkKIA8mKU9SwoWVWpR/da3bUi4eFWcsCarBp05z5FQrVYcfSPsaSPg4NjK1X
		Gokagqmn5FyponRSxHg/H8J0PBX2lEuI7oKg3l/yj7zVZfIP7o0aNYoUnocUqNluj2YNfikhlpwg
		Vn0eC03AAqKw2oyqUQuVqvLanMb8IQ2DxQVM2cAlT8dUSrQp2pe+8o+sqckNZbH9fAe3MqOMz21i
		uo4qqXRswluYf4TeaC1u1ExLDOvWYrw18i1yj/T6BasHlc8qaC5I5iS3M1YuhyblHk3O3ADbHykE
		yPkmwZfXz/2WeVprdBzNbyTAk9lWLTM0KI12q1WjkhssgInwddnrRTrRfbr2h+gNu1TaYGZwIjvR
		vea74i0Viso2hYyZEozjlHOfmKg0DbJhRvUE0beDArUBPpRXJsZAA19venwIc9sNUUv51cqDa4qa
		DBSMum7iJ/18+7kYylrN+3Lq25Ksdse3l3hitSmvVmXDH9U363qIs8Qq42kOz+6wQiCDK+sIrHTo
		FVR94ULdxT2kAmqakN1c1cIFTOfqVdyg3ny+LXi04w69yebOkyPWrDhcTGT7DNZsgfxQXoOwRf/5
		79W6u5s9BprVjmQ6s0Tpo9U1fpqxylL1O1E1/wtMUnw2P2oS+wW4aqVg/IPLDqevNVAQZmhGohxQ
		j7GxQTqr6WgJv1FpErTo153iQkvYm6mFIsJI9w/c/pexUKhXGs6USl57OnZgmO/bs7ypNOvjp1mF
		9ao9N4R3He415tZfXuf++AQyvdGM/nEpPWnfhBPfJiIxgebTLl47lrLsy+LN16taPzy7b+6BFYdy
		pURQJNV+fqZiWUph0tfXyO5wyW/WuQ+xIXs9X8V/NDXL07khqECDyjgtIbSjgAF7GKy4N50q1Zh2
		ZNQnjbCZGdJF/Z5h+ATozPakLdlrFsbNG0HbflG/dELE8P4sOuY817HYfswQRgYwNUbbX5MSAr2x
		aklrXAjLz/tOIAGxMYaw3r3SBFKg0WgP7tyQ6AygtKSkRKvVdpokdNoUS7O27W25LIH81xwidvv/
		TOHpEjE8qlGfX8qohkDX2aDk1wqBcMPvlWSvlUdKtE4DRHJzPXloum/3NybOafekJZRLW0qlOily
		tMXSEP2XN2nc2wAHUrk6JTIO8UzQnVSfrjh05H/HZlksFpFIJJPJzGZzpxIFKPC3U9w0joS8DPFl
		DAhhWez46OjAhU+Ba6NsWjLmTE5ZzU+vNSvVGG5PCPdbOSuhTqEPYjG2Lo7z19de4ylMNpxkTo7q
		jWFvzBnH9Ge3c3vpjelCrfDuU0HKo2OyKKQhgKCHyWR2qp8Ar2G79QtkulemFopzahQ/vDqGI9bC
		grVGi7CxadjA2MkDQ7ZdFZiseJPG9NNrY001WabytJTglQuHBNQpDHOHhVO6Rtjo9s/DNnm425BO
		5q19fHw6/XQAVNCGOxg0ikhtjGG3JQNgf/1WKNr1OpFISK+WqfTWuFDft2ePJe8uGBkJXEL8iIP1
		LbxQg+P1r6b1F8r13CbtHBBW18vI5MsrJa3vTR+EPapfMHSTomk12VccLlk6PtrPm/bqpDvvDIX6
		MujOUO6j2YntuhzIrY8M9Fk+czCUZw0NJyO+QWF+n8wd4h6+AqKnUe8S3bhY9vB+AdjDPJ6/P1AK
		xg5wNgR6+3Lq3LwvbrF36X0vcCUVEq3nrKHJav/gUDFwfrzCnW40C/Qi3N97Z0YNk0HYgr3ZdUEs
		rwal4c1n4kPavcHSJnrH/JH9JBqT2YYzvbo0H9502vIZg9ksr8fsmyAPmlXSqP72YrXzaKBN3PUK
		g1xnzha0AIBwPQCj1b7+FLeVjFGcvvZvJ7m85tZefzTw+AXSGJGWY06KDyb067b/8fWmXShvHhLh
		n1ogAjRANvOiUueNiGR6UUmHAP+bXhyZGOGP/eGIAmKWSqXwHx4ezmAwOiYJ3T+70pqs605y358+
		aGT/IHfXCbdyhUpes+4/nh3g/uVUt68MQked2ZZfp545NKwnrv2hQIc7HzpBicvllpaWqtXqjizc
		1wzlQB/G1MFhDURi8w5ktOOOKqk2MpA5OibIhZR6/rhAQ8vEGsoj6wHdpQYAX6VSgcjYbDb5okBP
		zJx7M73Fvj295uM5CWDRe/I5yv08+YcLSh/CtzuPr7CefH3fWwTfw4MAD808c+gJ/245eGjQk21x
		PzO8S1hgvAIDA+l0T0jV6KTQ0PZJLoPBoNfrwQKSygy+lYw375W/TqcDsAMGtOMtcEHAGUaJiIjo
		yBxIoVCEhIR4FllX/IEt+UEOicKioqI8bUPi9Ua5vNsnA7w0Gk0nZ2Vms0Ag4HA44FjLyspgYR2N
		RU/4w0pApl2ts7a2tqioCP47nRgIq9f8LRYLn8+vrq6GVdy8eROW042Bv58jOfKbFhiSNMOgQYDa
		PLvRXgwBSg2jsFgsPz+/bt30vTI3mUywM0iUHxQURJ46dymsJ9RNpPxEBD2nfwowALDTYSm2KjL/
		AAAAAElFTkSuQmCC`
	},
	$scheme: {
        type: 'group',
        items: [
        {
            name: 'Заголовок',
            type: 'item',
            key: 'title',
            itemType: 'string',
            itemValue: ''
        },
        {
            name: 'Подзаголовок',
            type: 'item',
            key: 'subtitle',
            itemType: 'string',
            itemValue: ''
        },
        {
            type: 'item',
            name: 'Включить легенду',
            key: 'enableLegend',
            optional: true,
            editor: 'none',
        },
        {
            type: 'group',
            name: 'Ось Х',
            key: 'xAxis',
            optional: true,
            editor: 'none',
            items: [
            {
                name: 'Заголовок',
                type: 'item',
                key: 'title',
                itemType: 'string',
            },
            {
                name: 'Формат значений',
                type: 'item',
                key: 'format',
                itemType: 'string',
            }
            ]
        },
        {
            type: 'group',
            name: 'Ось Y',
            key: 'yAxis',
            optional: true,
            editor: 'none',
            items: [
            {
                name: 'Заголовок',
                type: 'item',
                key: 'title',
                itemType: 'string',
            },
            {
                name: 'Формат значений',
                type: 'item',
                key: 'format',
                itemType: 'string',
            }
            ]
        },
        {
            type: 'group',
            name: 'plotOptions',
            key: 'plotOptions',
            optional: true,
            editor: 'none',
            items: [
            {
                type: 'group',
                name: 'scatter',
                key: 'scatter',
                items: [
                {
                    type: 'group',
                    name: 'tooltip',
                    key: 'tooltip',
                    items: [
                    {
                        name: 'headerFormat',
                        type: 'item',
                        key: 'headerFormat',
                        itemType: 'string',
                        itemValue: ''
                    },
                    {
                        name: 'pointFormat',
                        type: 'item',
                        key: 'pointFormat',
                        itemType: 'string',
                        itemValue: ''
                    }
                    ]
                }
                ]
            }
            ]
        },
        {
            type: 'group',
            name: 'Серии',
            binding: 'array',
            key: 'source',
            multiple: 'true',
            items: [
            {
                name: 'Данные',
                type: 'group',
                key: 'data',
                multiple: 'true',
                items: [
                {
                    type: 'select',
                    name: 'Имя поля',
                    key: 'fieldName',
                    itemType: 'string',
                    items: [
                        {
                            type: 'item',
                            name: 'x',
                            key: 'x',
                            editor: 'none'
                        },
                        {
                            type: 'item',
                            name: 'y',
                            key: 'y',
                            editor: 'none'
                        },
                        {
                            type: 'item',
                            name: 'другое',
                            key: 'other',
                            itemType: 'string',
                            itemValue: ''
                        }
                    ]
                },
                {
                    type: 'item',
                    name: 'Поле',
                    key: 'field',
                    binding: 'field',
                    itemType: 'string',
                    itemValue: '$field',
                }
                ]
            },
            {
                type: 'item',
                name: 'Имя серии',
                key: 'seriesName',
                itemType: 'string',
                itemValue: ''
            },
            {
                type: 'item',
                name: 'Цвет серии',
                key: 'color',
                itemType: 'color',
                editor: 'JSB.Widgets.ColorEditor'
            }
            ]
        }]
    },
	$client: {
		$require: ['JQuery.UI.Loader', 'JSB.Tpl.Highstock'],
		
		$constructor: function(opts){
			$base(opts);
            this.addClass('highchartsWidget');
			$this.init();
		},

        options: {
            onClick: null,
            onSelect: null,
            onUnselect: null,
            onMouseOver: null,
            onMouseOut: null
        },

        init: function(){
            this.container = this.$('<div class="container"></div>');
            this.append(this.container);

            this.getElement().resize(function(){
            	JSB.defer(function(){
                	if(!$this.getElement().is(':visible') || !$this.chart){
                        return;
                    }
                    $this.chart.setSize($this.getElement().width(), $this.getElement().height(), false);
                }, 500, 'hcResize' + $this.getId());
            });

            this.isInit = true;
            $this.setInitialized();
        },

        refresh: function(opts){
return;
            var source = this.getContext().find('source');
            if(!source.hasBinding()) return;
            
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

            var dataValue = [],
                dataValues = source.values();
            for(var i = 0; i < dataValues.length; i++){
                var val = [],
                    a = dataValues[i].values();

                for(var j = 0; j < a.length; j++){
                    var curr = a[j].value();
                    var n = curr.get(0);
                    val.push({
                        name: n.value() === null ? n.name() : n.value(),
                        value: a[j].get(1)
                    });
                }

                dataValue.push(val);
            }

            $this.getElement().loader();
            JSB().deferUntil(function(){
                source.fetch({readAll: true, reset: true}, function(){
                    var data = [];

                    while(source.next()){
                        for(var i = 0; i < dataValue.length; i++){
                            if(!data[i]) data[i] = [];

                            data[i].push(dataValue[i].reduce(function(newObj, el){
                                newObj[el.name] = el.value.value()
                                return newObj;
                            }, {}));
                        }
                    }

                    if(opts && opts.isCacheMod){
                    	$this.storeCache(data);
                    }

                    $this._buildChart(data);

                    $this.getElement().loader('hide');
                });
            }, function(){
                return $this.isInit;
            });
        },

        _buildChart: function(data){
            try{
                var dataValues = this.getContext().find('source').values(),
                    seriesParams = [];

                for(var i = 0; i < dataValues.length; i++){
                    seriesParams.push({
                        name: dataValues[i].get(1).value(),
                        color: dataValues[i].get(2).value()
                    });
                }

                var chart = {
                    chart: {
                        type: 'scatter',
                        zoomType: 'xy'
                    },
                    title: {
                        text: this.getContext().find('title').value()
                    },

                    subtitle: {
                        text: this.getContext().find('subtitle').value()
                    },

                    legend: {
                        enabled: this.getContext().find('enableLegend').used()
                    },

                    credits: {
                        enabled: false
                    },

                    series: []
                };

                for(var i = 0; i < data.length; i++){
                    chart.series.push({
                        data: data[i],
                        name: seriesParams[i].name,
                        color: seriesParams[i].color
                    });
                }

                // xAxis
                var x = this.getContext().find('xAxis');
                if(x.used()){
                    x = x.value();

                    chart.xAxis = {
                        title: {
                          text: x.get(0).value()
                        },
                        labels: {
                          format: x.get(1).value()
                        }
                    }
                }

                // yAxis
                var x = this.getContext().find('yAxis');
                if(x.used()){
                    x = x.value();

                    chart.yAxis = {
                        title: {
                          text: x.get(0).value()
                        },
                        labels: {
                          format: x.get(1).value()
                        }
                    }
                }

                // plotOptions
                var x = this.getContext().find('plotOptions');
                if(x.used()){
                    x = x.value();
                    var dataLabels = x.get(0).value().get(0).value();

                    chart.plotOptions = {
                        scatter: {
                            tooltip: {
                                headerFormat: dataLabels.get(0).value(),
                                pointFormat: dataLabels.get(1).value()
                            },
                            allowPointSelect: true,
                            point: {
                                events: {
                                    click: function(evt) {
                                        if(JSB().isFunction($this.options.onClick)){
                                            $this.options.onClick.call(this, evt);
                                        }
                                    },
                                    select: function(evt) {
                                        var flag = false;

                                        if(JSB().isFunction($this.options.onSelect)){
                                            flag = $this.options.onSelect.call(this, evt);
                                        }
                                        /*
                                        if(!flag){
                                            $this._addPieFilter(evt.target.name);
                                        }
                                        */
                                    },
                                    unselect: function(evt) {
                                        var flag = false;

                                        if(JSB().isFunction($this.options.onUnselect)){
                                            flag = $this.options.onUnselect.call(this, evt);
                                        }
                                        /*
                                        if(!flag && $this._currentFilter && !$this._notNeedUnselect){
                                            $this._notNeedUnselect = false;
                                            $this.removeFilter($this._currentFilter);
                                            $this.refreshAll();
                                        }
                                        */
                                    },
                                    mouseOut: function(evt) {
                                        if(JSB().isFunction($this.options.mouseOut)){
                                            $this.options.mouseOut.call(this, evt);
                                        }
                                    },
                                    mouseOver: function(evt) {
                                        if(JSB().isFunction($this.options.mouseOver)){
                                            $this.options.mouseOver.call(this, evt);
                                        }
                                    }
                                }
                            }
                        }
                    };
                }

                $this.container.highcharts(chart);
                $this.chart =  $this.container.highcharts();
            } catch(ex){
                console.log(ex);
            }
        },

        // events
        _addNewFilter: function(){
            /*
            var context = this.getContext().find('source').binding();
            if(!context.source) return;

            var field = this.getContext().find('data').value().get(0).binding();

            this._currentFilter = this.addFilter(context.source, 'and', [{ field: field, value: value, op: '$eq' }], this._currentFilter);
            */
        }
	}
}