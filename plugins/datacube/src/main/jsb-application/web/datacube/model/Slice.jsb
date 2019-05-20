{
    $name: 'DataCube.Model.Slice',
    $parent: 'DataCube.Model.QueryableEntry',

    $require: [
        'DataCube.Query.QuerySyntax'
    ],
    
    $expose: {
		priority: 0.5, 
		nodeType:'DataCube.SliceNode',
		create: false,
		move: false,
		remove: true,
		rename: true,
		share: false,
		icon: 'data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiIHN0YW5kYWxvbmU9Im5vIj8+DQo8IS0tIFN2ZyBWZWN0b3IgSWNvbnMgOiBodHRwOi8vd3d3Lm9ubGluZXdlYmZvbnRzLmNvbS9pY29uIC0tPg0KDQo8c3ZnDQogICB4bWxuczpkYz0iaHR0cDovL3B1cmwub3JnL2RjL2VsZW1lbnRzLzEuMS8iDQogICB4bWxuczpjYz0iaHR0cDovL2NyZWF0aXZlY29tbW9ucy5vcmcvbnMjIg0KICAgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIg0KICAgeG1sbnM6c3ZnPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyINCiAgIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyINCiAgIHhtbG5zOnNvZGlwb2RpPSJodHRwOi8vc29kaXBvZGkuc291cmNlZm9yZ2UubmV0L0RURC9zb2RpcG9kaS0wLmR0ZCINCiAgIHhtbG5zOmlua3NjYXBlPSJodHRwOi8vd3d3Lmlua3NjYXBlLm9yZy9uYW1lc3BhY2VzL2lua3NjYXBlIg0KICAgdmVyc2lvbj0iMS4xIg0KICAgeD0iMHB4Ig0KICAgeT0iMHB4Ig0KICAgdmlld0JveD0iMCAwIDIwIDIwIg0KICAgZW5hYmxlLWJhY2tncm91bmQ9Im5ldyAwIDAgMTAwMCAxMDAwIg0KICAgeG1sOnNwYWNlPSJwcmVzZXJ2ZSINCiAgIGlkPSJzdmcyIg0KICAgaW5rc2NhcGU6dmVyc2lvbj0iMC45MSByMTM3MjUiDQogICBzb2RpcG9kaTpkb2NuYW1lPSJzbGljZS5zdmciDQogICB3aWR0aD0iMjAiDQogICBoZWlnaHQ9IjIwIj48ZGVmcw0KICAgICBpZD0iZGVmczE0IiAvPjxzb2RpcG9kaTpuYW1lZHZpZXcNCiAgICAgcGFnZWNvbG9yPSIjZmZmZmZmIg0KICAgICBib3JkZXJjb2xvcj0iIzY2NjY2NiINCiAgICAgYm9yZGVyb3BhY2l0eT0iMSINCiAgICAgb2JqZWN0dG9sZXJhbmNlPSIxMCINCiAgICAgZ3JpZHRvbGVyYW5jZT0iMTAiDQogICAgIGd1aWRldG9sZXJhbmNlPSIxMCINCiAgICAgaW5rc2NhcGU6cGFnZW9wYWNpdHk9IjAiDQogICAgIGlua3NjYXBlOnBhZ2VzaGFkb3c9IjIiDQogICAgIGlua3NjYXBlOndpbmRvdy13aWR0aD0iMTkyMCINCiAgICAgaW5rc2NhcGU6d2luZG93LWhlaWdodD0iMTEzOCINCiAgICAgaWQ9Im5hbWVkdmlldzEyIg0KICAgICBzaG93Z3JpZD0iZmFsc2UiDQogICAgIGlua3NjYXBlOnpvb209IjMwLjIwOCINCiAgICAgaW5rc2NhcGU6Y3g9IjguNDY5NjgiDQogICAgIGlua3NjYXBlOmN5PSI5Ljg3MjkxIg0KICAgICBpbmtzY2FwZTp3aW5kb3cteD0iLTgiDQogICAgIGlua3NjYXBlOndpbmRvdy15PSItOCINCiAgICAgaW5rc2NhcGU6d2luZG93LW1heGltaXplZD0iMSINCiAgICAgaW5rc2NhcGU6Y3VycmVudC1sYXllcj0ic3ZnMiINCiAgICAgc2hvd2d1aWRlcz0idHJ1ZSINCiAgICAgaW5rc2NhcGU6Z3VpZGUtYmJveD0idHJ1ZSI+PHNvZGlwb2RpOmd1aWRlDQogICAgICAgcG9zaXRpb249IjE0LjAwMjkxMywyMC4zMjU3NDIiDQogICAgICAgb3JpZW50YXRpb249IjEsMCINCiAgICAgICBpZD0iZ3VpZGU0MTUwIiAvPjxzb2RpcG9kaTpndWlkZQ0KICAgICAgIHBvc2l0aW9uPSIxMC4wMzA0NTYsMTQuODMwNTA4Ig0KICAgICAgIG9yaWVudGF0aW9uPSIxLDAiDQogICAgICAgaWQ9Imd1aWRlNDE1MiIgLz48c29kaXBvZGk6Z3VpZGUNCiAgICAgICBwb3NpdGlvbj0iNC4wMDU1NjE0LDIxLjA4NzEyOSINCiAgICAgICBvcmllbnRhdGlvbj0iMSwwIg0KICAgICAgIGlkPSJndWlkZTQxNTQiIC8+PHNvZGlwb2RpOmd1aWRlDQogICAgICAgcG9zaXRpb249IjE3Ljk3NTM3MSw1Ljk5MTc5MDMiDQogICAgICAgb3JpZW50YXRpb249IjAsMSINCiAgICAgICBpZD0iZ3VpZGU0MTU4IiAvPjxzb2RpcG9kaTpndWlkZQ0KICAgICAgIHBvc2l0aW9uPSItMi41ODIwOTc1LDE0Ljk2MjkyNCINCiAgICAgICBvcmllbnRhdGlvbj0iMCwxIg0KICAgICAgIGlkPSJndWlkZTQxNjAiIC8+PHNvZGlwb2RpOmd1aWRlDQogICAgICAgcG9zaXRpb249IjE1LjUyNTY4OSwxLjk4NjIyODgiDQogICAgICAgb3JpZW50YXRpb249IjAsMSINCiAgICAgICBpZD0iZ3VpZGU0MTYyIiAvPjxzb2RpcG9kaTpndWlkZQ0KICAgICAgIHBvc2l0aW9uPSIxOS4wMzQ2OTMsMTguMDA4NDc1Ig0KICAgICAgIG9yaWVudGF0aW9uPSIwLDEiDQogICAgICAgaWQ9Imd1aWRlNDE2NCIgLz48c29kaXBvZGk6Z3VpZGUNCiAgICAgICBwb3NpdGlvbj0iLTMuMTc3OTY2MSw5Ljk2NDI0NzkiDQogICAgICAgb3JpZW50YXRpb249IjAsMSINCiAgICAgICBpZD0iZ3VpZGU0MTY2IiAvPjwvc29kaXBvZGk6bmFtZWR2aWV3PjxtZXRhZGF0YQ0KICAgICBpZD0ibWV0YWRhdGE0Ij4gU3ZnIFZlY3RvciBJY29ucyA6IGh0dHA6Ly93d3cub25saW5ld2ViZm9udHMuY29tL2ljb24gPHJkZjpSREY+PGNjOldvcmsNCiAgICAgcmRmOmFib3V0PSIiPjxkYzpmb3JtYXQ+aW1hZ2Uvc3ZnK3htbDwvZGM6Zm9ybWF0PjxkYzp0eXBlDQogICAgICAgcmRmOnJlc291cmNlPSJodHRwOi8vcHVybC5vcmcvZGMvZGNtaXR5cGUvU3RpbGxJbWFnZSIgLz48ZGM6dGl0bGU+PC9kYzp0aXRsZT48L2NjOldvcms+PC9yZGY6UkRGPjwvbWV0YWRhdGE+PHBhdGgNCiAgICAgc3R5bGU9ImZpbGw6I2ZmZmZmZjtmaWxsLW9wYWNpdHk6MTtzdHJva2U6bm9uZTtzdHJva2Utd2lkdGg6MTtzdHJva2UtbGluZWNhcDpyb3VuZDtzdHJva2UtbGluZWpvaW46cm91bmQ7c3Ryb2tlLW1pdGVybGltaXQ6NDtzdHJva2UtZGFzaGFycmF5Om5vbmU7c3Ryb2tlLW9wYWNpdHk6MSINCiAgICAgZD0ibSA2LjA1MzU4NDgsNy4zMDIxMzE5IDAsLTEuMzEwODQ0MiAxLjk2NjI2NjMsMCAxLjk2NjI2NiwwIDAsMS4zMTA4NDQyIDAsMS4zMTA4NDQxIC0xLjk2NjI2NiwwIC0xLjk2NjI2NjMsMCAwLC0xLjMxMDg0NDEgeiINCiAgICAgaWQ9InBhdGg0MTUzIg0KICAgICBpbmtzY2FwZTpjb25uZWN0b3ItY3VydmF0dXJlPSIwIiAvPjxwYXRoDQogICAgIHN0eWxlPSJmaWxsOiNmZmZmZmY7ZmlsbC1vcGFjaXR5OjE7c3Ryb2tlOm5vbmU7c3Ryb2tlLXdpZHRoOjE7c3Ryb2tlLWxpbmVjYXA6cm91bmQ7c3Ryb2tlLWxpbmVqb2luOnJvdW5kO3N0cm9rZS1taXRlcmxpbWl0OjQ7c3Ryb2tlLWRhc2hhcnJheTpub25lO3N0cm9rZS1vcGFjaXR5OjEiDQogICAgIGQ9Im0gNi4wNTM1ODQ4LDEwLjYyNjA1IDAsLTEuMzEwODM5OCAxLjk2NjI2NjMsMCAxLjk2NjI2NiwwIDAsMS4zMTA4Mzk4IDAsMS4zMTA4NDQgLTEuOTY2MjY2LDAgLTEuOTY2MjY2MywwIDAsLTEuMzEwODQ0IHoiDQogICAgIGlkPSJwYXRoNDE2OSINCiAgICAgaW5rc2NhcGU6Y29ubmVjdG9yLWN1cnZhdHVyZT0iMCIgLz48cGF0aA0KICAgICBzdHlsZT0iZmlsbDojZmZmZmZmO2ZpbGwtb3BhY2l0eToxO3N0cm9rZTpub25lO3N0cm9rZS13aWR0aDoxO3N0cm9rZS1saW5lY2FwOnJvdW5kO3N0cm9rZS1saW5lam9pbjpyb3VuZDtzdHJva2UtbWl0ZXJsaW1pdDo0O3N0cm9rZS1kYXNoYXJyYXk6bm9uZTtzdHJva2Utb3BhY2l0eToxIg0KICAgICBkPSJtIDYuMDUzNTg0OCwxMy45NDk5NzcgMCwtMS4zMTA4NDUgMS45NjYyNjYzLDAgMS45NjYyNjYsMCAwLDEuMzEwODQ1IDAsMS4zMTA4NDQgLTEuOTY2MjY2LDAgLTEuOTY2MjY2MywwIDAsLTEuMzEwODQ0IHoiDQogICAgIGlkPSJwYXRoNDE3MSINCiAgICAgaW5rc2NhcGU6Y29ubmVjdG9yLWN1cnZhdHVyZT0iMCIgLz48cGF0aA0KICAgICBzdHlsZT0iZmlsbDojZmZmZmZmO2ZpbGwtb3BhY2l0eToxO3N0cm9rZTpub25lO3N0cm9rZS13aWR0aDoxO3N0cm9rZS1saW5lY2FwOnJvdW5kO3N0cm9rZS1saW5lam9pbjpyb3VuZDtzdHJva2UtbWl0ZXJsaW1pdDo0O3N0cm9rZS1kYXNoYXJyYXk6bm9uZTtzdHJva2Utb3BhY2l0eToxIg0KICAgICBkPSJtIDEwLjY4ODM1NSw3LjMwMjEzMTkgMCwtMS4zMTA4NDQyIDEuOTY2MjY2LDAgMS45NjYyNjcsMCAwLDEuMzEwODQ0MiAwLDEuMzEwODQ0MSAtMS45NjYyNjcsMCAtMS45NjYyNjYsMCAwLC0xLjMxMDg0NDEgeiINCiAgICAgaWQ9InBhdGg0MTczIg0KICAgICBpbmtzY2FwZTpjb25uZWN0b3ItY3VydmF0dXJlPSIwIiAvPjxwYXRoDQogICAgIHN0eWxlPSJmaWxsOiNmZmZmZmY7ZmlsbC1vcGFjaXR5OjE7c3Ryb2tlOm5vbmU7c3Ryb2tlLXdpZHRoOjE7c3Ryb2tlLWxpbmVjYXA6cm91bmQ7c3Ryb2tlLWxpbmVqb2luOnJvdW5kO3N0cm9rZS1taXRlcmxpbWl0OjQ7c3Ryb2tlLWRhc2hhcnJheTpub25lO3N0cm9rZS1vcGFjaXR5OjEiDQogICAgIGQ9Im0gMTAuNzE4NDMyLDExLjY0OTEzMiBjIC0wLjAxNjU0LC0wLjE1ODI3IC0wLjAzMDA4LC0wLjc0ODE1IC0wLjAzMDA4LC0xLjMxMDg0NCBsIDAsLTEuMDIzMDc3OCAxLjk2NjI2NiwwIDEuOTY2MjY3LDAgMCwxLjMxMDgzOTggMCwxLjMxMDg0NCAtMS45MzYxOSwwIC0xLjkzNjE4OSwwIC0wLjAzMDA4LC0wLjI4Nzc2MiB6Ig0KICAgICBpZD0icGF0aDQxNzUiDQogICAgIGlua3NjYXBlOmNvbm5lY3Rvci1jdXJ2YXR1cmU9IjAiIC8+PHBhdGgNCiAgICAgc3R5bGU9ImZpbGw6I2ZmZmZmZjtmaWxsLW9wYWNpdHk6MTtzdHJva2U6bm9uZTtzdHJva2Utd2lkdGg6MTtzdHJva2UtbGluZWNhcDpyb3VuZDtzdHJva2UtbGluZWpvaW46cm91bmQ7c3Ryb2tlLW1pdGVybGltaXQ6NDtzdHJva2UtZGFzaGFycmF5Om5vbmU7c3Ryb2tlLW9wYWNpdHk6MSINCiAgICAgZD0ibSAxMC43MTg0MzIsMTQuOTczMDU4IGMgLTAuMDE2NTQsLTAuMTU4MjY5IC0wLjAzMDA4LC0wLjc0ODE0OSAtMC4wMzAwOCwtMS4zMTA4NDQgbCAwLC0xLjAyMzA4MiAxLjk2NjI2NiwwIDEuOTY2MjY3LDAgMCwxLjMxMDg0NSAwLDEuMzEwODQ0IC0xLjkzNjE5LDAgLTEuOTM2MTg5LDAgLTAuMDMwMDgsLTAuMjg3NzYzIHoiDQogICAgIGlkPSJwYXRoNDE3NyINCiAgICAgaW5rc2NhcGU6Y29ubmVjdG9yLWN1cnZhdHVyZT0iMCIgLz48cGF0aA0KICAgICBzdHlsZT0iZmlsbDojZmZmZmZmO2ZpbGwtb3BhY2l0eToxO3N0cm9rZTpub25lO3N0cm9rZS13aWR0aDoxO3N0cm9rZS1saW5lY2FwOnJvdW5kO3N0cm9rZS1saW5lam9pbjpyb3VuZDtzdHJva2UtbWl0ZXJsaW1pdDo0O3N0cm9rZS1kYXNoYXJyYXk6bm9uZTtzdHJva2Utb3BhY2l0eToxIg0KICAgICBkPSJtIDE1LjMyMzEyNSw3LjMwMjEzMTkgMCwtMS4zMTA4NDQyIDEuOTg5Njc1LDAgMS45ODk2NzQsMCAwLDEuMzEwODQ0MiAwLDEuMzEwODQ0MSAtMS45ODk2NzQsMCAtMS45ODk2NzUsMCAwLC0xLjMxMDg0NDEgeiINCiAgICAgaWQ9InBhdGg0MTc5Ig0KICAgICBpbmtzY2FwZTpjb25uZWN0b3ItY3VydmF0dXJlPSIwIiAvPjxwYXRoDQogICAgIHN0eWxlPSJmaWxsOiNmZmZmZmY7ZmlsbC1vcGFjaXR5OjE7c3Ryb2tlOm5vbmU7c3Ryb2tlLXdpZHRoOjE7c3Ryb2tlLWxpbmVjYXA6cm91bmQ7c3Ryb2tlLWxpbmVqb2luOnJvdW5kO3N0cm9rZS1taXRlcmxpbWl0OjQ7c3Ryb2tlLWRhc2hhcnJheTpub25lO3N0cm9rZS1vcGFjaXR5OjEiDQogICAgIGQ9Im0gMTUuMzIzMTI1LDEwLjYyNjA1IDAsLTEuMzEwODM5OCAxLjk4OTY3NSwwIDEuOTg5Njc0LDAgMCwxLjMxMDgzOTggMCwxLjMxMDg0NCAtMS45ODk2NzQsMCAtMS45ODk2NzUsMCAwLC0xLjMxMDg0NCB6Ig0KICAgICBpZD0icGF0aDQxODEiDQogICAgIGlua3NjYXBlOmNvbm5lY3Rvci1jdXJ2YXR1cmU9IjAiIC8+PHBhdGgNCiAgICAgc3R5bGU9ImZpbGw6I2ZmZmZmZjtmaWxsLW9wYWNpdHk6MTtzdHJva2U6bm9uZTtzdHJva2Utd2lkdGg6MTtzdHJva2UtbGluZWNhcDpyb3VuZDtzdHJva2UtbGluZWpvaW46cm91bmQ7c3Ryb2tlLW1pdGVybGltaXQ6NDtzdHJva2UtZGFzaGFycmF5Om5vbmU7c3Ryb2tlLW9wYWNpdHk6MSINCiAgICAgZD0ibSAxNS4zMjMxMjUsMTMuOTQ5OTc3IDAsLTEuMzEwODQ1IDEuOTg5Njc1LDAgMS45ODk2NzQsMCAwLDEuMzEwODQ1IDAsMS4zMTA4NDQgLTEuOTg5Njc0LDAgLTEuOTg5Njc1LDAgMCwtMS4zMTA4NDQgeiINCiAgICAgaWQ9InBhdGg0MTgzIg0KICAgICBpbmtzY2FwZTpjb25uZWN0b3ItY3VydmF0dXJlPSIwIiAvPjxwYXRoDQogICAgIHN0eWxlPSJmaWxsOiMzMzgwMDA7ZmlsbC1vcGFjaXR5OjE7c3Ryb2tlOm5vbmU7c3Ryb2tlLXdpZHRoOjE7c3Ryb2tlLWxpbmVjYXA6cm91bmQ7c3Ryb2tlLWxpbmVqb2luOnJvdW5kO3N0cm9rZS1taXRlcmxpbWl0OjQ7c3Ryb2tlLWRhc2hhcnJheTpub25lO3N0cm9rZS1vcGFjaXR5OjEiDQogICAgIGQ9Im0gMC42MjI1Mjc4NiwxMC4wNjczNTQgMCwtNy40NjQwNzk3IDEuODcwMzY1NTQsMCAxLjg3MDM2NTQsMCAwLDcuNDY0MDc5NyAwLDcuNDY0MDc3IC0xLjg3MDM2NTQsMCAtMS44NzAzNjU1NCwwIDAsLTcuNDY0MDc3IHoiDQogICAgIGlkPSJwYXRoNDI1MyINCiAgICAgaW5rc2NhcGU6Y29ubmVjdG9yLWN1cnZhdHVyZT0iMCIgLz48cGF0aA0KICAgICBzdHlsZT0iZmlsbDojMzM4MDAwO2ZpbGwtb3BhY2l0eToxO3N0cm9rZTpub25lO3N0cm9rZS13aWR0aDoxO3N0cm9rZS1saW5lY2FwOnJvdW5kO3N0cm9rZS1saW5lam9pbjpyb3VuZDtzdHJva2UtbWl0ZXJsaW1pdDo0O3N0cm9rZS1kYXNoYXJyYXk6bm9uZTtzdHJva2Utb3BhY2l0eToxIg0KICAgICBkPSJtIDQuNTMzOTg1MSwzLjY2MDQ1MTIgLTAuMDIyMTkzLC0xLjIwMjA0NTYgNy40NjYwNjYsMCA3LjQ2NjA3NCwwIDAsMS4xMDk2MTYzIDAsMS43NjUxNTk1IC03LjUzODI4OCwwLjAyNjIyMiAtNy40NjYwNjUyLC0wLjAyNjIyMiB6Ig0KICAgICBpZD0icGF0aDQyNTkiDQogICAgIGlua3NjYXBlOmNvbm5lY3Rvci1jdXJ2YXR1cmU9IjAiDQogICAgIHNvZGlwb2RpOm5vZGV0eXBlcz0iY2NjY2NjY2NjIiAvPjxwYXRoDQogICAgIHN0eWxlPSJmaWxsOiNmZmZmZmY7ZmlsbC1vcGFjaXR5OjE7c3Ryb2tlOm5vbmU7c3Ryb2tlLXdpZHRoOjE7c3Ryb2tlLWxpbmVjYXA6cm91bmQ7c3Ryb2tlLWxpbmVqb2luOnJvdW5kO3N0cm9rZS1taXRlcmxpbWl0OjQ7c3Ryb2tlLWRhc2hhcnJheTpub25lO3N0cm9rZS1vcGFjaXR5OjEiDQogICAgIGQ9Im0gNS4zNjM2NjI1LDEyLjAxNzg2IDAsLTUuNTcxOTEyOSA3LjE1MjUyMTUsMCA3LjE1MjUxNSwwIDAsNS41NzE5MTI5IDAsNS41NzE5MjUgLTcuMTUyNTE1LDAgLTcuMTUyNTIxNSwwIDAsLTUuNTcxOTI1IHoiDQogICAgIGlkPSJwYXRoNDI4MyINCiAgICAgaW5rc2NhcGU6Y29ubmVjdG9yLWN1cnZhdHVyZT0iMCIgLz48cGF0aA0KICAgICBkPSJtIDE5Ljk2OTQ3MSwxNy4zNjEzNCAwLC0xNC42OTk2NzA1IGMgMCwtMC4zNjU4MDM5IC0wLjI5NjcwNywtMC42NjQ1NDM3IC0wLjY2NDU0MywtMC42NjQ1NDM3IGwgLTE4LjU4NjkwMzkyLDAgYyAtMC4zNjU4MDM5MiwwIC0wLjY2NDU0Mzc5LDAuMjk2NzA3NiAtMC42NjQ1NDM3OSwwLjY2NDU0MzcgbCAwLDE0LjY5OTY3MDUgYyAwLDAuMzY1ODA0IDAuMjk2NzA3NjIsMC42NjQ1NDQgMC42NjQ1NDM3OSwwLjY2NDU0NCBsIDE4LjU4ODkzNTkyLDAgYyAwLjY5NzA2LDAgMC42NjI1MTEsLTAuNjY0NTQ0IDAuNjYyNTExLC0wLjY2NDU0NCB6IG0gLTE1LjkyOTg4OTYsMCAtMy4zMjE1NTczMiwwIDAsLTMuNjQ5MjU3IDMuMzIzNTg5NTIsMCAwLDMuNjQ5MjU3IHogbSAwLC00LjMxMTc2OCAtMy4zMjE1NTczMiwwIDAsLTMuMzE4MjE3NCAzLjMyMzU4OTUyLDAgMCwzLjMxODIxNzQgeiBtIDAsLTMuOTgwNzI1NCAtMy4zMjE1NTczMiwwIDAsLTMuMzUxMzIwOSAzLjMyMzU4OTUyLDAgMCwzLjM1MTMyMDkgeiBtIDAsLTQuMDE1ODY0NiAtMy4zMjE1NTczMiwwIDAsLTIuMzkxMzEyNSAzLjMyMzU4OTUyLDAgMCwyLjM5MTMxMjUgeiBtIDQuOTU4NDU3NiwxMi4zMDgzNTggLTQuMjkzOTEzOSwwIDAsLTMuNjQ5MjU3IDQuMzE0MjM2NSwwIHogbSAwLC00LjMxMTc2OCAtNC4yOTM5MTM5LDAgMCwtMy4zMTgyMTc0IDQuMzE0MjM2NSwwIHogbSAtNC4yOTM5MTM5LC0zLjk4MDcyNTQgMCwtMy4zNTEzMjA5IDQuMjkzOTEzOSwwIDAuMDIwMzIzLDMuMzUxMzIwOSB6IG0gNC4zMTQyMzY1LC00LjAxNTg2NDYgLTQuMzE0MjM2NSwwIDAsLTIuMzkxMzEyNSA0LjMxNDIzNjUsMCB6IG0gNC45Nzg3ODA0LDEyLjMwODM1OCAtNC4yOTM5MTQ0LDAgLTAuMDQwNjQsLTMuNjQ5MjU3IDQuMzM0NTU5NCwwIHogbSAwLC00LjMxMTc2OCAtNC4yOTM5MTQ0LDAgLTAuMDQwNjQsLTMuMzE4MjE3NCA0LjMzNDU1OTQsMCB6IG0gMCwtMy45ODA3MjU0IC00LjMxNDIzNjQsMCAtMC4wMjAzMiwtMy4zNTEzMjA5IDQuMzM0NTU5NCwwIHogbSAwLC00LjAxNTg2NDYgLTQuMzE0MjM2NCwwIC0wLjAyMDMyLC0yLjM5MTMxMjUgNC4zMzQ1NTk0LDAgeiBtIDUuMzA3Nzg2LDEyLjMwODM1OCAtNC42NDUyNzUsMCAtMC4wMjAzMiwtMy42NDkyNTcgNC42NjU1OTcsMCB6IG0gMCwtNC4zMTE3NjggLTQuNjQ1Mjc1LDAgLTAuMDIwMzIsLTMuMzE4MjE3NCA0LjY2NTU5NywwIHogbSAwLC0zLjk4MDcyNTQgLTQuNjY1NTk3LDAgMCwtMy4zNTEzMjA5IDQuNjY1NTk3LDAgeiBtIDAsLTQuMDE1ODY0NiAtNC42NDUyNzUsMCAtMC4wMjAzMiwtMi4zOTEzMTI1IDQuNjY1NTk3LDAgeiINCiAgICAgaWQ9InBhdGgxMCINCiAgICAgaW5rc2NhcGU6Y29ubmVjdG9yLWN1cnZhdHVyZT0iMCINCiAgICAgc3R5bGU9ImZpbGw6IzAwMmIwMDtmaWxsLW9wYWNpdHk6MSINCiAgICAgc29kaXBvZGk6bm9kZXR5cGVzPSJjc3Nzc3Nzc2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2MiIC8+PC9zdmc+',
	},

    $scheme: {
        cacheSettings: {
            render: 'group',
            name: 'Кэширование данных',
            collapsible: true,
            items: {
                useCache: {
                    render: 'switch',
                    name: 'Использовать кэширование срезов',
                    optional: 'checked',
                    items: {
                        cacheSize: {
                            render: 'item',
                            name: 'Размер кэша (Кб)',
                            value: 1024,
                            valueType: 'number'
                        },
                        cacheRowLimit: {
                            render: 'item',
                            name: 'Ограничить максимальное количество строк',
                            value: 1000,
                            valueType: 'number',
                            optional: true
                        },
                        cacheExtraQueries: {
                            render: 'item',
                            name: 'Кэшировать производные запросы (с фильтрами)',
                            optional: 'checked',
                            editor: 'none'
                        },
                        updateInterval: {
                            render: 'item',
                            name: 'Обновлять данные',
                            optional: true,
                            editor: 'JSB.Widgets.CronEditor',
                            value: '0 * * * *'
                        }
                    }
                }
            }
        }
    },

    cube: null,
    source: null,
    query: {},

    extractSources: function(query){
        var fromKeys = QuerySyntax.getFromContext(), //['$from', '$cube', '$join', '$union', '$provider', '$recursive']
            sources = [];

        if(!query){
            query = this.getQuery();
        }

        if(query['$provider']){
            return sources;
        }

        for(var i = 0; i < fromKeys.length; i++){
            if(query[fromKeys[i]]){
                switch(fromKeys[i]){
                    case '$from':
                        if(query[fromKeys[i]]){
                            sources.push(query[fromKeys[i]]);
                        }
                        break;
                    case '$join':
                        if(query.$join.$left){
                            sources.push(query.$join.$left);
                        }

                        if(query.$join.$right){
                            sources.push(query.$join.$right);
                        }
                        break;
                    case '$union':
                        sources = query.$union;
                        break;
                    case '$recursive':
                        if(query.$recursive.$start.$from){
                            sources.push(query.$recursive.$start.$from);
                        }
                        break;
                }
            }
        }

        return sources;
    },

	getCube: function(){
		return this.cube;
	},
	
	getQueryableContainer: function(){
		return this.getCube();
	},

    getFromType: function(){
        var fromKeys = QuerySyntax.getFromContext();

        for(var i = 0; i < fromKeys.length; i++){
            if(this.query[fromKeys[i]]){
                return fromKeys[i];
            }
        }

        return '$cube';
    },

    getSource: function(){
        return this.source;
    },

	getQuery: function(isClone){
	    if(isClone){
		    return JSB.clone(this.query);
        }

        return this.query;
	},

	$client: {
        extractFields: function(){
            var fields = {};

            if(this.query.$select){
                for(var i in this.query.$select){
                    fields[i] = {};
                }
            }

            return fields;
        }
	},
	
	$server: {
		$require: ['JSB.Workspace.WorkspaceController',
		           'DataCube.Query.Extractors.TypeExtractor',
		           'DataCube.Query.Query',
		           'DataCube.Query.QueryCache',
		           'DataCube.Scheduler.EntryScheduleController'],
		
		fieldsTypes: {},
		preparedQuery: {},

		$constructor: function(id, workspace, opts){
			$base(id, workspace);

			if(opts){   // new slice
			    this.cube = opts.cube;
                this.property('cube', this.cube.getId());

                $super.setName(opts.name);

                this.query = this.generateQueryFromSource(opts);
                this.property('query', this.query);

                if(opts.sourceType === '$provider'){
                    this.source = opts.sources[0];
                    this.property('source', this.source.getFullId());
                }

				this.property('queryParams', this.queryParams);
			} else {    // load existed slice
				if(this.property('cube')){
					this.cube = this.getWorkspace().entry(this.property('cube'));
				}

				if(this.property('query')){
					this.query = this.property('query');
				}

				if(this.property('source')){
				    var idArr = this.property('source').split('/');

				    this.source = this.getWorkspace(idArr[0]).entry(idArr[1]);
				}

				if(this.property('fieldsTypes')){
				    this.fieldsTypes = this.property('fieldsTypes');
				}

				if(this.property('preparedQuery')){
				    this.preparedQuery = this.property('preparedQuery');
				} else {
				    this.updatePreparedQuery();
				}
			}
			var ctx = this.getSettingsContext();
			this.cacheEnabled = Config.has('datacube.queryCache.enabled') && Config.get('datacube.queryCache.enabled') && ctx.find('useCache').checked();
			this.extCacheEnabled = this.cacheEnabled && ctx.find('cacheExtraQueries').checked();

			this.subscribe('DataCube.Query.QueryCache.updated', function(sender){
				if($this.queryCache && sender == $this.queryCache){
					$this.publish('DataCube.Model.Slice.updated');
				}
			});
			
			this.subscribe('DataCube.Scheduler.EntryScheduleController.executeJob', function(sender, msg, params){
				if(sender != $this){
					return;
				}
				$this.executeScheduledJob(params);
			});
		},
		
		destroy: function(){
			if($this.queryCache){
				$this.queryCache.destroy();
				$this.queryCache = null;
			}
			$base();
		},

		executeQuery: function(opts){
			$this.getCube().load();
			var extQuery = (opts && opts.extQuery) || {};
			var useCache = (opts && opts.useCache) || false;
			var extendedQueryDesc = this.extendQuery(this.getQuery(), opts);
            var isExtQuery = false;
            if(opts && opts.extQuery && Object.keys(opts.extQuery).length > 0){
            	isExtQuery = true;
            }
            if(opts && opts.wrapQuery && Object.keys(opts.wrapQuery).length > 0){
            	isExtQuery = true;
            }
            if(useCache && this.cacheEnabled && (!isExtQuery || this.extCacheEnabled)){
            	this.ensureQueryCache();
				return this.queryCache.executeQuery(extendedQueryDesc.query, extendedQueryDesc.params);
            }
            return this.cube.executeQuery(extendedQueryDesc.query, extendedQueryDesc.params);
		},

        extractFields: function(){
            var fieldsTypes = this.fieldsTypes,
                fields = {};

            if(this.query.$select){
                for(var i in this.query.$select){
                    if(!this.fieldsTypes[i]){
                        this.updateFieldsTypes(true, true);
                    }

                    fields[i] = {
                        type: this.fieldsTypes[i]
                    };
                }
            }

            return fields;
        },

		generateQueryFromSource: function(opts){
		    var sources = opts.sources,
		        query = {
		            $context: opts.name,
		            $select: {}
		        };

		    try{
                switch(opts.sourceType){
                    case '$provider':
                    case '$from':
                        query[opts.sourceType] = sources[0] ? sources[0].getFullId() : undefined;
                        query['$select'] = sources[0].createQuerySelect(opts.selectedFields);
                        break;
                    case '$join':
                        var selectLeft = {},
                            selectRight = {};

                        query['$join'] = opts.sourceOpts['$join'];

                        if(query['$join'].$left){
                            selectLeft = WorkspaceController.getEntryByFullId(query['$join'].$left).createQuerySelect(opts.selectedFields, false, true);
                        }

                        if(query['$join'].$right){
                            selectRight = WorkspaceController.getEntryByFullId(query['$join'].$right).createQuerySelect(opts.selectedFields, false, true);
                        }

                        JSB.merge(query['$select'], selectLeft, selectRight);
                        break;
                    case '$union':
                        query['$union'] = [];

                        for(var i = 0; i < sources.length; i++){
                            query['$union'].push(sources[i].getFullId());

                            JSB.merge(query['$select'], sources[i].createQuerySelect(opts.selectedFields));
                        }
                        break;
                    case '$cube':
                        query['$cube'] = this.getCube().getFullId();
                        query.$select['Столбец'] = {
                            $const: 0
                        };
                        break;
                    default:
                        query['$from'] = {};
                        query.$select['Столбец'] = {
                            $const: 0
                        };
                }
		    } catch(ex){
		        JSB.getLogger().error(ex);
		    }

		    return query;
		},

		getFieldType: function(fieldName){
		    return this.fieldsTypes[fieldName];
		},
		
		combineCacheOpts: function(){
			var ctx = this.getSettingsContext();
			return {
				cacheSize: ctx.find('cacheSize').value(),
				limitRows: ctx.find('cacheRowLimit').checked() ? ctx.find('cacheRowLimit').value() : 0
			};
		},
		
		ensureQueryCache: function(){
			if(!this.queryCache){
				var mtx = this.getId() + '_queryCache';
				JSB.getLocker().lock(mtx);
				if(!this.queryCache){
					this.queryCache = new QueryCache(this, this.cube, this.combineCacheOpts());
				}
				JSB.getLocker().unlock(mtx);
			}
			
			return this.queryCache;
		},

        getEditorData: function(){
		    var cube = this.getCube();

		    return {
		        cubeFields: cube.extractFields(),
		        cubeSlices: cube.getSlices()
		    }
		},

		getOutputFields: function(){
			var fMap = {};
			if(this.query && this.query.$select && Object.keys(this.query.$select).length > 0){
				for(var fName in this.query.$select){
					fMap[fName] = {
						type: null,	// TODO: need to resolve
						comment: null
					}
				}
			}

			return fMap;
		},

		getPreparedQuery: function(){
		    return this.preparedQuery;
		},

		invalidate: function(){
			if(!this.cacheEnabled){
				return;
			}
			this.ensureQueryCache();
			this.queryCache.clear();
		},

		loadCacheFromCube: function(){
			if(!this.cacheEnabled || !$this.getCube().queryCache){
				return;
			}
			this.ensureQueryCache();
			this.queryCache.copyFrom($this.getCube().queryCache, $this.query);
		},

		remove: function(){
		    this.cube.removeSlice(this.getFullId());

		    this.publish('DataCube.Model.Slice.remove', { cubeFullId: this.getCube().getFullId(), fullId: this.getFullId() }, {session: true});

		    $base();
		},

		setName: function(name){
			$base(name);

			this.doSync();
		},

		setSliceParams: function(params){
		    var updates = {};

            // name
		    if(JSB.isDefined(params.name) && !JSB.isEqual(this.getName(), params.name)){
		        $super.setName(params.name);

		        updates.name = params.name;
		    }

		    // query
		    if(JSB.isDefined(this.getName(params.query)) && !JSB.isEqual(this.query, params.query)){
                this.query =  params.query;
                this.property('query', this.query);

                this.updateFieldsTypes(true);

                this.updatePreparedQuery();

    			this.invalidate();
    			//this.loadCacheFromCube();

    			this.cube.updateCubeFields(this);

		        updates.query = params.query;
		        updates.fields = this.extractFields();
		    }

		    var result = {
		        sliceFullId: this.getFullId(),
		        updates: updates,
		        wasUpdated: Boolean(Object.keys(updates).length)
		    }

		    if(result.wasUpdated){
		        this.doSync();

                this.publish('DataCube.CubeEditor.sliceUpdated', result, {session: true});
		    }

		    return result;
		},
		
		updateCache: function(){
			if(!this.cacheEnabled){
				return;
			}
			this.ensureQueryCache();
			this.queryCache.update();
		},

		updateFieldsTypes: function(hideEvent, stopPropagate){
		    try{
		        var fieldsTypes = TypeExtractor.extractQueryOutputFieldsTypes($this.query),
		            isNeedUpdate = false;

		        for(var i in this.getQuery().$select){
                    if(fieldsTypes[i]){
                        if(fieldsTypes[i].type){
                            if(this.fieldsTypes[i] !== fieldsTypes[i].type){
                                this.fieldsTypes[i] = fieldsTypes[i].type;

                                isNeedUpdate = true;
                            }
                        } else if(fieldsTypes[i].nativeType){
                            if(this.fieldsTypes[i] !== fieldsTypes[i].nativeType){
                                this.fieldsTypes[i] = fieldsTypes[i].nativeType;

                                isNeedUpdate = true;
                            }
                        }
                    }
		        }

		        if(isNeedUpdate){
		            this.property('fieldsTypes', this.fieldsTypes);

		            if(!stopPropagate){
		                this.getCube().updateFieldsTypes(this.getFullId());
		            }

		            if(!hideEvent){
                        this.publish('DataCube.CubeEditor.sliceUpdated', {
                            fields: this.extractFields()
                        }, {session: true});
		            }
		        }
		    } catch(ex){
		        JSB.getLogger().error(ex);
		    }
		},

		updatePreparedQuery: function() {
		    var iterator;

		    try {
                iterator = Query.prepare({
                    query: this.getQuery()
                });

                this.preparedQuery = iterator.next();

                this.property('preparedQuery', this.preparedQuery);
		    } catch(e) {
		        this.property('preparedQuery', null);
		    } finally {
		        if(iterator){
		            iterator.close();
                }
		    }
		},

		onChangeSettings: function(){
			var ctx = this.getSettingsContext();
			
			// perform check for scheduled tasks
			var updateCacheCron = null;
			if(ctx.find('useCache').checked() && ctx.find('updateInterval').checked()){
				EntryScheduleController.registerJob(this, 'updateCache', ctx.find('updateInterval').value());
			} else {
				EntryScheduleController.unregisterJob(this, 'updateCache');
			}
			
			// update cache opts
			this.cacheEnabled = Config.has('datacube.queryCache.enabled') && Config.get('datacube.queryCache.enabled') && ctx.find('useCache').checked();
			this.extCacheEnabled = this.cacheEnabled && ctx.find('cacheExtraQueries').checked();
			if(this.queryCache){
				this.queryCache.updateOptions(this.combineCacheOpts());
			}
		},
		
		executeScheduledJob: function(job){
			if(job.key == 'updateCache'){
				$this.updateCache();
			}
		}
	}
}