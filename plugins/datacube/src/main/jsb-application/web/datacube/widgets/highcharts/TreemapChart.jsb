{
    $name: 'DataCube.Widgets.TreemapChart',
    $parent: 'DataCube.Widgets.BaseHighchart',
    $expose: {
        name: 'Карта дерева',
        description: '',
        category: 'Диаграммы',
        icon: 'data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiIHN0YW5kYWxvbmU9Im5vIj8+CjwhLS0gQ3JlYXRlZCB3aXRoIElua3NjYXBlIChodHRwOi8vd3d3Lmlua3NjYXBlLm9yZy8pIC0tPgoKPHN2ZwogICB4bWxuczpkYz0iaHR0cDovL3B1cmwub3JnL2RjL2VsZW1lbnRzLzEuMS8iCiAgIHhtbG5zOmNjPSJodHRwOi8vY3JlYXRpdmVjb21tb25zLm9yZy9ucyMiCiAgIHhtbG5zOnJkZj0iaHR0cDovL3d3dy53My5vcmcvMTk5OS8wMi8yMi1yZGYtc3ludGF4LW5zIyIKICAgeG1sbnM6c3ZnPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIKICAgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIgogICB4bWxuczpzb2RpcG9kaT0iaHR0cDovL3NvZGlwb2RpLnNvdXJjZWZvcmdlLm5ldC9EVEQvc29kaXBvZGktMC5kdGQiCiAgIHhtbG5zOmlua3NjYXBlPSJodHRwOi8vd3d3Lmlua3NjYXBlLm9yZy9uYW1lc3BhY2VzL2lua3NjYXBlIgogICB3aWR0aD0iMjBtbSIKICAgaGVpZ2h0PSIyMG1tIgogICB2aWV3Qm94PSIwIDAgMjAgMjAiCiAgIHZlcnNpb249IjEuMSIKICAgaWQ9InN2ZzgiCiAgIGlua3NjYXBlOnZlcnNpb249IjAuOTIuMSByMTUzNzEiCiAgIHNvZGlwb2RpOmRvY25hbWU9InRyZWVtYXAuc3ZnIj4KICA8ZGVmcwogICAgIGlkPSJkZWZzMiIgLz4KICA8c29kaXBvZGk6bmFtZWR2aWV3CiAgICAgaWQ9ImJhc2UiCiAgICAgcGFnZWNvbG9yPSIjZmZmZmZmIgogICAgIGJvcmRlcmNvbG9yPSIjNjY2NjY2IgogICAgIGJvcmRlcm9wYWNpdHk9IjEuMCIKICAgICBpbmtzY2FwZTpwYWdlb3BhY2l0eT0iMC4wIgogICAgIGlua3NjYXBlOnBhZ2VzaGFkb3c9IjIiCiAgICAgaW5rc2NhcGU6em9vbT0iNS42IgogICAgIGlua3NjYXBlOmN4PSItNS41NjE3MzcxIgogICAgIGlua3NjYXBlOmN5PSI0OS4zMDcyNjIiCiAgICAgaW5rc2NhcGU6ZG9jdW1lbnQtdW5pdHM9Im1tIgogICAgIGlua3NjYXBlOmN1cnJlbnQtbGF5ZXI9ImxheWVyMSIKICAgICBzaG93Z3JpZD0iZmFsc2UiCiAgICAgaW5rc2NhcGU6d2luZG93LXdpZHRoPSIxOTIwIgogICAgIGlua3NjYXBlOndpbmRvdy1oZWlnaHQ9IjExMzgiCiAgICAgaW5rc2NhcGU6d2luZG93LXg9Ii04IgogICAgIGlua3NjYXBlOndpbmRvdy15PSItOCIKICAgICBpbmtzY2FwZTp3aW5kb3ctbWF4aW1pemVkPSIxIiAvPgogIDxtZXRhZGF0YQogICAgIGlkPSJtZXRhZGF0YTUiPgogICAgPHJkZjpSREY+CiAgICAgIDxjYzpXb3JrCiAgICAgICAgIHJkZjphYm91dD0iIj4KICAgICAgICA8ZGM6Zm9ybWF0PmltYWdlL3N2Zyt4bWw8L2RjOmZvcm1hdD4KICAgICAgICA8ZGM6dHlwZQogICAgICAgICAgIHJkZjpyZXNvdXJjZT0iaHR0cDovL3B1cmwub3JnL2RjL2RjbWl0eXBlL1N0aWxsSW1hZ2UiIC8+CiAgICAgICAgPGRjOnRpdGxlPjwvZGM6dGl0bGU+CiAgICAgIDwvY2M6V29yaz4KICAgIDwvcmRmOlJERj4KICA8L21ldGFkYXRhPgogIDxnCiAgICAgaW5rc2NhcGU6bGFiZWw9IkxheWVyIDEiCiAgICAgaW5rc2NhcGU6Z3JvdXBtb2RlPSJsYXllciIKICAgICBpZD0ibGF5ZXIxIgogICAgIHRyYW5zZm9ybT0idHJhbnNsYXRlKDAsLTI3NykiPgogICAgPHBhdGgKICAgICAgIHN0eWxlPSJmaWxsOiMwMDAwMDA7c3Ryb2tlLXdpZHRoOjAuMDQ5NzUwNjMiCiAgICAgICBkPSJNIDAuMTIyMzYxLDI5Ni44Nzc2MyAwLDI5Ni43NTUyNiAwLjAxMjY4LDI4Ni45NzI3MyAwLjAyNTM2LDI3Ny4xOTAyIDAuMTQyODA5LDI3Ny4wOTUxIEMgMC4yNTc1NTUsMjc3LjAwMjIgMC40ODQ2MTQsMjc3IDEwLjAwODAxMSwyNzcgaCA5Ljc0Nzc1MyBsIDAuMTIyMTE0LDAuMTIyMTIgMC4xMjIxMTMsMC4xMjIxMSBWIDI4NyAyOTYuNzU1NzcgTCAxOS44Nzc4NzgsMjk2Ljg3Nzg4IDE5Ljc1NTc2NCwyOTcgSCAxMC4wMDAyMzggMC4yNDQ3MTMgWiBtIDE5LjY2NDQyOSwtMC4wOTA5IGMgMC4wODQ2NywtMC4wODQ3IDAuMDg4ODMsLTAuNTQzMjEgMC4wODg4MywtOS43ODY3OCAwLC05LjI0MzY5IC0wLjAwNDIsLTkuNzAyMSAtMC4wODg4NCwtOS43ODY3OCAtMC4wODQ2OCwtMC4wODQ3IC0wLjU0MzA4LC0wLjA4ODggLTkuNzg2NTM5LC0wLjA4ODggLTkuMjQzMzQ1LDAgLTkuNzAxODYxLDAuMDA0IC05Ljc4NjUzOCwwLjA4ODggLTAuMDg0NTgsMC4wODQ2IC0wLjA4OTQ1LDAuNTQ5NjcgLTAuMTAxNjUyLDkuNzA5NyAtMC4wMDg0LDYuMjc5NzIgMC4wMDQzLDkuNjY2IDAuMDM2NTksOS43NTA4MSAwLjAyNzE3LDAuMDcxNSAwLjEwMDA5OCwwLjE1MDM5IDAuMTYyMDYyLDAuMTc1NCAwLjA2Njk1LDAuMDI3IDQuMDIyNTg3LDAuMDQxNiA5Ljc0OTk1MiwwLjAzNiA5LjE3ODMxNiwtMC4wMDkgOS42NDE1MjIsLTAuMDEzNyA5LjcyNjEyOSwtMC4wOTgzIHogTSAwLjc5NjQ5NSwyOTEuNzc2MDcgdiAtNC40Mjc4NiBoIDQuNDI3NzUxIDQuNDI3NzUxIHYgNC40Mjc4NiA0LjQyNzg2IEggNS4yMjQyNDYgMC43OTY0OTUgWiBtIDguNzU2MDAyLDAgdiAtNC4zMjgzNiBIIDUuMjI0MjQ2IDAuODk1OTk1IHYgNC4zMjgzNiA0LjMyODM2IGggNC4zMjgyNTEgNC4zMjgyNTEgeiBtIDAuODE4OTYyLDQuMzY1NjcgYyAtMC4wMTMwMiwtMC4wMzQyIC0wLjAxNzkxLC0zLjA5NTc3IC0wLjAxMDg4LC02LjgwMzQ4IGwgMC4wMTI3OSwtNi43NDEzIDIuMDI3MzEzLC0wLjAxMyAyLjAyNzMxMywtMC4wMTMgdiA2LjgxNjQ4IDYuODE2NDcgaCAtMi4wMTY0MzcgYyAtMS41NjczNjEsMCAtMi4wMjE3MDgsLTAuMDEzOSAtMi4wNDAxMDMsLTAuMDYyMiB6IG0gMy45NTcwNCwtNi43NTM3MyB2IC02LjcxNjQyIGggLTEuOTQwMjUxIC0xLjk0MDI1IHYgNi43MTY0MiA2LjcxNjQyIGggMS45NDAyNSAxLjk0MDI1MSB6IG0gMC44MTg5NDIsNi43NTQyIGMgLTAuMDEzMjcsLTAuMDM0NiAtMC4wMTgyNiwtMC45NDcxNCAtMC4wMTEwOSwtMi4wMjc5MyBsIDAuMDEzMDMsLTEuOTY1MDggaCAyLjAxNDg3NiAyLjAxNDg3NCB2IDIuMDE0OTMgMi4wMTQ5MiBsIC0yLjAwMzc4MSwwLjAxMyBjIC0xLjU3ODA0NSwwLjAxMDIgLTIuMDA4OTA3LC0zLjhlLTQgLTIuMDI3OTAyLC0wLjA0OTkgeiBtIDMuOTU3MDU5LC0xLjk3ODA4IHYgLTEuOTQwMyBoIC0xLjk0MDI1IC0xLjk0MDI1MSB2IDEuOTQwMyAxLjk0MDMgaCAxLjk0MDI1MSAxLjk0MDI1IHogbSAtMy45NTY4NzQsLTIuNzk3OTQgYyAtMC4wMTMxNiwtMC4wMzQ1IC0wLjAxODE2LC0yLjAyMTcxIC0wLjAxMTA5LC00LjQxNTk5IGwgMC4wMTI4NCwtNC4zNTMyNCBoIDIuMDE0ODc3IDIuMDE0ODc0IHYgNC40MDI5OSA0LjQwMjk4IGwgLTIuMDAzNzgxLDAuMDEzIGMgLTEuNTc2NDI1LDAuMDEwMiAtMi4wMDg4ODcsLTMuOGUtNCAtMi4wMjc3MTcsLTAuMDQ5OCB6IG0gMy45NTY4NzQsLTQuMzY2MjQgdiAtNC4zMjgzNiBoIC0xLjk0MDI1IC0xLjk0MDI1MSB2IDQuMzI4MzYgNC4zMjgzNiBIIDE3LjE2NDI1IDE5LjEwNDUgWiBNIDAuNzk2NDk1LDI4Mi4yMjM4MyB2IC00LjQyNzg2IGggNC40Mjc3NTEgNC40Mjc3NTEgdiA0LjQyNzg2IDQuNDI3ODYgSCA1LjIyNDI0NiAwLjc5NjQ5NSBaIG0gOC43NTYwMDIsMCB2IC00LjMyODM2IEggNS4yMjQyNDYgMC44OTU5OTUgdiA0LjMyODM2IDQuMzI4MzYgaCA0LjMyODI1MSA0LjMyODI1MSB6IG0gMC44MTg3MjUsLTAuNDEwNTUgYyAtMC4wMTMxNSwtMC4wMzQzIC0wLjAxODA0LC0wLjk0NjU3IC0wLjAxMDg4LC0yLjAyNzM2IGwgMC4wMTMwMywtMS45NjUwNyA0LjQxNTMxNCwtMC4wMTI3IDQuNDE1MzE2LC0wLjAxMjcgdiAyLjA0MDA3IDIuMDQwMDggaCAtNC40MDQ0NCBjIC0zLjQ4MTQ1NSwwIC00LjQwOTQ0NywtMC4wMTMxIC00LjQyODM0MSwtMC4wNjIzIHogbSA4LjczMzI3OCwtMS45Nzc1MSB2IC0xLjk0MDMgaCAtNC4zMjgyNTEgLTQuMzI4MjUxIHYgMS45NDAzIDEuOTQwMyBoIDQuMzI4MjUxIDQuMzI4MjUxIHoiCiAgICAgICBpZD0icGF0aDQ0ODciCiAgICAgICBpbmtzY2FwZTpjb25uZWN0b3ItY3VydmF0dXJlPSIwIiAvPgogICAgPHBhdGgKICAgICAgIHN0eWxlPSJmaWxsOiMwNDQ3NjY7ZmlsbC1vcGFjaXR5OjE7c3Ryb2tlOiMwMDAwMDA7c3Ryb2tlLXdpZHRoOjAuMTU4NjA1MTc7c3Ryb2tlLW1pdGVybGltaXQ6NDtzdHJva2UtZGFzaGFycmF5Om5vbmU7c3Ryb2tlLW9wYWNpdHk6MSIKICAgICAgIGQ9Ik0gMi45Nzg4NzM2LDc1LjAyODQwNSAxLjEzMzg3NDMsNzUuMDAyMzgzIDAuODY4NTEwMjcsNzQuNzAwMTUgMC42MDMxNDYyLDc0LjM5NzkxNyAwLjUzOTkwMTkxLDcyLjQ5MjExNiBDIDAuNDQxNzQ0MjUsNjkuNTM0MjM4IDAuNTQ5NjgxOTEsMi44ODcwOTAxIDAuNjU0MzIyODksMS44NDE3NzgzIDAuNzU4NjA0NDcsMC44MDAwNTY2NiAwLjc4ODM1MTkzLDAuNzY0MzkzNDEgMS42NDA1MTUzLDAuNjU5NDY0OTIgMi40MjUwMjMxLDAuNTYyODY3IDczLjAxMzI3LDAuNTY0MzkxODggNzMuOTEwMDYzLDAuNjYxMDI2MTEgYyAwLjM4MTMzMywwLjA0MTA5MDcgMC43NDk0OTksMC4xMzA4NzY2NSAwLjgxODE0NywwLjE5OTUyNDMzIDAuMDY4NjUsMC4wNjg2NDc3IDAuMTU4NDM0LDAuNDM2ODEzNzYgMC4xOTk1MjQsMC44MTgxNDY3NiAwLjEwNzYzNCwwLjk5ODg3MDggMC4wODg2NCw3Mi4wMTA1MTc4IC0wLjAxOTQxLDcyLjU2NzYwODggLTAuMDcwMzYsMC4zNjI3NzQgLTAuMTM0Nzg1LDAuNDY4ODczIC0wLjM0NjI0LDAuNTcwMjIxIC0wLjIwMzk5NCwwLjA5Nzc3IC0xLjE4MTgyOCwwLjE0MDAyNyAtNC41NTI1NzIsMC4xOTY3MzUgLTMuODY0MTY0LDAuMDY1MDEgLTYyLjU1NTA5NzcsMC4wNzgyNyAtNjcuMDMwNjM0NCwwLjAxNTE0IHogTSAzNi41NjQ5NDQsNTUuODU0MTczIFYgMzkuMTEzMTAyIEggMTkuNzc5MjMgMi45OTM1MTU3IFYgNTUuODU0MTczIDcyLjU5NTI0NSBIIDE5Ljc3OTIzIDM2LjU2NDk0NCBaIG0gMTguMDM1NzE1LC05LjA0NzMwNyB2IC0yNS43ODgzOCBsIC03LjcwMDg5MywwLjA0MDExIGMgLTQuMjM1NDkxLDAuMDIyMDYgLTcuNzA4OTUyLDAuMDQ2NzIgLTcuNzE4ODAyLDAuMDU0OCAtMC4wNjAzLDAuMDQ5NDUgLTAuMDU3MzgsNTEuMjEzMTEgMC4wMDI5LDUxLjI3MzUwNCAwLjE1MzAxLDAuMTUzMjM0IDEuMzU1NDM1LDAuMTgxNDU2IDguMjk2MjI5LDAuMTk0NzI3IGwgNy4xMjA1MzcsMC4wMTM2MiB6IG0gMTUuNDY4NzUsMjUuNzI5MjA0IDIuNDc3Njc4LC0wLjA1ODgzIFYgNjQuODU3NjcgNTcuMjM4MSBoIC03LjY3ODU3MSAtNy42Nzg1NzIgdiA3LjU4NzU4NCA3LjU4NzU4NSBsIDAuMjAwODkzLDAuMDQ1MTIgYyAwLjExMDQ5MSwwLjAyNDgyIDAuMzgxNjk3LDAuMDU4NzQgMC42MDI2NzksMC4wNzUzOSAwLjc3OTEzNiwwLjA1ODcgOS42Mjk1MTgsMC4wNjAzOCAxMi4wNzU4OTMsMC4wMDIzIHogbSAtMS44NzUsLTE4LjAzNTg2MyA0LjM1MjY3OCwtMC4wNTkxMiBWIDM3Ljc1ODczNyAyMS4wNzYzOSBsIC03LjY1NjI1LDAuMDIyODIgLTcuNjU2MjUsMC4wMjI4MiAtMC4wMjI1NiwxNi42MjUzNzQgLTAuMDIyNTYsMTYuNjI1Mzc1IDAuMjkwNDEzLDAuMDQ4OTUgYyAwLjc3NzUyNCwwLjEzMTA2NyA0LjcxNzg5NiwwLjE1OTkyNyAxMC43MTQ1MjEsMC4wNzg0NyB6IE0gMzYuNTIwMzAxLDE5LjczODEwMiBWIDIuOTk3MDMgTCAxOS43NTY5MDksMi45NzQ0NzU1IDIuOTkzNTE1NywyLjk1MTkyMSB2IDE2Ljc4NjE4MSAxNi43ODYxOCBsIDE2Ljc2MzM5MzMsLTAuMDIyNTUgMTYuNzYzMzkyLC0wLjAyMjU1IHogbSAzNi4xMTYwNzIsLTkuMDE4MTIgViAyLjk1MTg2MjUgbCAtMTYuNzE4NzUsMC4wNTczMDUgYyAtOS4xOTUzMTMsMC4wMzE1MTggLTE2LjcyNjg1LDAuMDYzMTczIC0xNi43MzY3NSwwLjA3MDM0NiAtMC4wMDk5LDAuMDA3MTcgLTAuMDI5OTksMy4zOTQ2NTA5IC0wLjA0NDY0LDcuNTI3NzI5NSAtMC4wMjE1NCw2LjA3NDEyNSAtMC4wMDQ0LDcuNTM2OTQ5IDAuMDg5NDIsNy42MzA4MDkgMC4xNjczMDcsMC4xNjczOTMgNC4xMjcxNzMsMC4yMTM2MDcgMTkuOTk1NTQ2LDAuMjMzMzU1IGwgMTMuNDE1MTc5LDAuMDE2NyB6IgogICAgICAgaWQ9InBhdGg0NDkxIgogICAgICAgaW5rc2NhcGU6Y29ubmVjdG9yLWN1cnZhdHVyZT0iMCIKICAgICAgIHRyYW5zZm9ybT0ibWF0cml4KDAuMjY0NTgzMzMsMCwwLDAuMjY0NTgzMzMsMCwyNzcpIiAvPgogICAgPHJlY3QKICAgICAgIHN0eWxlPSJmaWxsOiNmZmNiNWM7ZmlsbC1vcGFjaXR5OjE7c3Ryb2tlOm5vbmU7c3Ryb2tlLXdpZHRoOjAuNDc7c3Ryb2tlLW1pdGVybGltaXQ6NDtzdHJva2UtZGFzaGFycmF5Om5vbmU7c3Ryb2tlLW9wYWNpdHk6MSIKICAgICAgIGlkPSJyZWN0NDQ5MyIKICAgICAgIHdpZHRoPSI4LjY1NjUwMTgiCiAgICAgICBoZWlnaHQ9IjguNjU2NzIwMiIKICAgICAgIHg9IjAuODk1OTk1MDIiCiAgICAgICB5PSIyNzcuODk1NDgiIC8+CiAgICA8cmVjdAogICAgICAgc3R5bGU9ImZpbGw6I2QwZDJkMztmaWxsLW9wYWNpdHk6MTtzdHJva2U6bm9uZTtzdHJva2Utd2lkdGg6MC40NztzdHJva2UtbWl0ZXJsaW1pdDo0O3N0cm9rZS1kYXNoYXJyYXk6bm9uZTtzdHJva2Utb3BhY2l0eToxIgogICAgICAgaWQ9InJlY3Q0NDk1IgogICAgICAgd2lkdGg9IjguNjU2NTAxOCIKICAgICAgIGhlaWdodD0iOC42NTY3MjAyIgogICAgICAgeD0iMC44OTU5OTUwMiIKICAgICAgIHk9IjI4Ny40NDc3MiIgLz4KICAgIDxyZWN0CiAgICAgICBzdHlsZT0iZmlsbDojOGZjODYzO2ZpbGwtb3BhY2l0eToxO3N0cm9rZTpub25lO3N0cm9rZS13aWR0aDowLjQ3O3N0cm9rZS1taXRlcmxpbWl0OjQ7c3Ryb2tlLWRhc2hhcnJheTpub25lO3N0cm9rZS1vcGFjaXR5OjEiCiAgICAgICBpZD0icmVjdDQ0OTciCiAgICAgICB3aWR0aD0iMy44ODA1MDA4IgogICAgICAgaGVpZ2h0PSIxMy40MzI4NCIKICAgICAgIHg9IjEwLjQ0Nzk5NyIKICAgICAgIHk9IjI4Mi42NzE2IiAvPgogICAgPHJlY3QKICAgICAgIHN0eWxlPSJmaWxsOiM0OTlkZDY7ZmlsbC1vcGFjaXR5OjE7c3Ryb2tlOm5vbmU7c3Ryb2tlLXdpZHRoOjAuNDc7c3Ryb2tlLW1pdGVybGltaXQ6NDtzdHJva2UtZGFzaGFycmF5Om5vbmU7c3Ryb2tlLW9wYWNpdHk6MSIKICAgICAgIGlkPSJyZWN0NDQ5OSIKICAgICAgIHdpZHRoPSI4LjY1NjUwMTgiCiAgICAgICBoZWlnaHQ9IjMuODgwNiIKICAgICAgIHg9IjEwLjQ0Nzk5NyIKICAgICAgIHk9IjI3Ny44OTU0OCIgLz4KICAgIDxyZWN0CiAgICAgICBzdHlsZT0iZmlsbDojZTU0YzRjO2ZpbGwtb3BhY2l0eToxO3N0cm9rZTpub25lO3N0cm9rZS13aWR0aDowLjQ3O3N0cm9rZS1taXRlcmxpbWl0OjQ7c3Ryb2tlLWRhc2hhcnJheTpub25lO3N0cm9rZS1vcGFjaXR5OjEiCiAgICAgICBpZD0icmVjdDQ1MDMiCiAgICAgICB3aWR0aD0iMy44ODA1MDA4IgogICAgICAgaGVpZ2h0PSI4LjY1NjcyMDIiCiAgICAgICB4PSIxNS4yMjM5OTkiCiAgICAgICB5PSIyODIuNjcxNiIgLz4KICAgIDxyZWN0CiAgICAgICBzdHlsZT0iZmlsbDojNjY1MWJlO2ZpbGwtb3BhY2l0eToxO3N0cm9rZTpub25lO3N0cm9rZS13aWR0aDowLjQ3O3N0cm9rZS1taXRlcmxpbWl0OjQ7c3Ryb2tlLWRhc2hhcnJheTpub25lO3N0cm9rZS1vcGFjaXR5OjEiCiAgICAgICBpZD0icmVjdDQ1MDUiCiAgICAgICB3aWR0aD0iMy44ODA1MDA4IgogICAgICAgaGVpZ2h0PSIzLjg4MDYiCiAgICAgICB4PSIxNS4yMjM5OTkiCiAgICAgICB5PSIyOTIuMjIzODIiIC8+CiAgPC9nPgo8L3N2Zz4K'
    },
    $scheme: {
        series: {
	        linkedFields: {
	            name: {
	                type: 'string',
	                repeat: true
	            },
	            data: {
	                type: 'number',
	                repeat: true
	            }
	        },
            items: {
                seriesItem: {
                    render: 'group',
                    name: 'Серия',
                    collapsible: true,
                    items: {
                        name: {
                            render: 'dataBinding',
                            name: 'Имена частей',
                            linkTo: 'source'
                        },
                        data: {
                            render: 'dataBinding',
                            name: 'Размеры частей',
                            linkTo: 'source'
                        },
                        parent: {
                            render: 'dataBinding',
                            name: 'Родитель',
                            linkTo: 'source'
                        },
                        autoSize: {
                            render: 'item',
                            name: 'Автоматически считать размеры',
                            optional: true,
                            editor: 'none'
                        },
                        isSum: {
                            render: 'item',
                            name: 'Суммировать количество',
                            optional: true,
                            editor: 'none'
                        },
                        // todo: mb do it with filters?
                        skipEmptyNamedGroups: {
                            render: 'item',
                            name: 'Опускать группы с пустыми именами',
                            optional: 'checked',
                            editor: 'none'
                        }
                    }
                }
            }
        },
        plotOptions: {
            items: {
                series: {
                    items: {
                        stacking: {
                            render: null
                        },
                        dataLabels: {
                            items: {
                                enabled: {
                                    optional: 'checked'
                                },
                                verticalAlign: {
                                    items: {
                                        middle: {
                                            name: 'По центру'
                                        },
                                        bottom: {
                                            name: 'По нижнему краю'
                                        },
                                        top: {
                                            name: 'По верхнему краю'
                                        }
                                    }
                                },
                                format: {
                                    formatterOpts: {
                                        variables: [
                                            {
                                                alias: 'Значение точки',
                                                type: 'number',
                                                value: 'y'
                                            },
                                            {
                                                alias: 'Имя точки',
                                                type: 'string',
                                                value: 'point.name'
                                            }
                                        ]
                                    },
                                    defaultValue: '{point.name}'
                                }
                            }
                        }
                    }
                },
                treemap: {
                    render: 'group',
                    name: 'Карта дерева',
                    collapsible: true,
                    collapsed: true,
                    items: {
                        layoutAlgorithm: {
                            render: 'select',
                            name: 'Алгоритм расположения',
                            items: {
                                sliceAndDice: {
                                    name: 'sliceAndDice'
                                },
                                squarified: {
                                    name: 'squarified'
                                },
                                stripes: {
                                    name: 'stripes'
                                },
                                strip: {
                                    name: 'strip'
                                }
                            }
                        },
                        layoutStartingDirection: {
                            render: 'select',
                            name: 'Направление алгоритма расположения',
                            items: {
                                vertical: {
                                    name: 'Вертикальное'
                                },
                                horizontal: {
                                    name: 'Горизонтальное'
                                }
                            }
                        },
                        alternateStartingDirection: {
                            render: 'item',
                            name: 'Альтернативное направление слоёв',
                            optional: true,
                            editor: 'none'
                        },
                        borderColor: {
                            render: 'item',
                            name: 'Цвет границ',
                            editor: 'JSB.Widgets.ColorEditor',
                            defaultValue: '#333333'
                        }
                    }
                }
            }
        }
    },
    $client: {
        _filterPropName: 'name',

	    $constructor: function(opts){
	        $base(opts);
	        JSB.loadScript('tpl/highcharts/modules/treemap.js', function(){
	            $this.setInitialized();
	        });
	    },

	    onRefresh: function(opts){
            if(!$base(opts)){
                this.ready();
                return;
            }

            if(!this._schemeOpts){
                var seriesContext = this.getContext().find('series').values();

                this._schemeOpts = {
                    series: []
                };

                for(var i = 0; i < seriesContext.length; i++){
                    var name = seriesContext[i].find('name');

                    this._schemeOpts.series.push({
                        nameSelector: seriesContext[i].find('name'),
                        dataSelector: seriesContext[i].find('data'),
                        parentSelector: seriesContext[i].find('parent'),
                        seriesNameSelector: seriesContext[i].find('seriesName'),
                        autoSize: seriesContext[i].find('autoSize').checked(),
                        isSum: seriesContext[i].find('isSum').checked(),
                        skipEmptyNamedGroups: seriesContext[i].find('skipEmptyNamedGroups').checked()
                    });
                }
            }

            if(!this._resolvePointFilters(this._schemeOpts.bindings)){
                this.ready();
                return;
            }

            var widgetOpts = this._widgetOpts ? undefined : { styleScheme: this.getContext().find('chart colorScheme').value() };

            this.getElement().loader();

            var data = {},
                colorCount = 0;

            function fetch(isReset){
                $this.fetch($this._dataSource, { batchSize: 100, reset: isReset, widgetOpts: isReset ? widgetOpts : undefined }, function(res, fail, serverWidgetOpts){
                    try{
                        if(fail){
                            $this.ready();
                            $this.getElement().loader('hide');
                            return;
                        }

                        if(res.length === 0){
                            resultProcessing();
                            return;
                        }

                        if(serverWidgetOpts){
                            $this._widgetOpts = serverWidgetOpts;
                        }

                        while($this._dataSource.next()){
                            var curCat = data;

                            for(var i = 0; i < $this._schemeOpts.series.length; i++){
                                var name = $this._schemeOpts.series[i].seriesNameSelector.value() || $this._schemeOpts.series[i].nameSelector.value(),
                                    value = $this._schemeOpts.series[i].dataSelector.value();

                                if($this._schemeOpts.series[i].skipEmptyNamedGroups && (!name || name.length === 0)){
                                    break;
                                }

                                var id = $this._schemeOpts.series[i].seriesNameSelector.value() || $this._schemeOpts.series[i].nameSelector.value();

                                if(curCat[name]){
                                    if($this._schemeOpts.series[i].autoSize){
                                        curCat[name].chartOpts.value++;
                                    } else if($this._schemeOpts.series[i].isSum){
                                        curCat[name].chartOpts.value += value;
                                    }
                                } else {
                                    var color;

                                    if(i === 0){
                                        if($this._widgetOpts.styleScheme){
                                            color = $this._widgetOpts.styleScheme[colorCount%$this._widgetOpts.styleScheme.length];
                                        } else {
                                            color = Highcharts.getOptions().colors[colorCount%10];
                                        }
                                    }

                                    curCat[name] = {
                                        child: {},
                                        chartOpts: {
                                            datacube: {
                                                binding: $this._schemeOpts.series[i].nameSelector.binding(),
                                            },
                                            color: color,
                                            id: id,
                                            name: name,
                                            parent: parent,
                                            value: $this._schemeOpts.series[i].autoSize ? 0 : value
                                        }
                                    };

                                    i === 0 && colorCount++;
                                }

                                curCat = curCat[name].child;
                            }
                        }

                        fetch();
                    } catch (ex){
                        console.log('TreemapChart load data exception');
                        console.log(ex);
                        $this.getElement().loader('hide');
                    }
                });
            }

            function resultProcessing(){
                try{
                    function resolveData(arr, data, parent){
                        if(!data){
                            return;
                        }

                        for(var i in data){
                            if(!data[i].chartOpts.parent){
                                data[i].chartOpts.parent = parent;
                            }

                            arr.push(data[i].chartOpts);

                            resolveData(arr, data[i].child, data[i].chartOpts.id);
                        }
                    }

                    var seriesData = [];
                    resolveData(seriesData, data);

                    $this.buildChart(seriesData);
                } catch (ex){
                    console.log('TreemapChart processing data exception');
                    console.log(ex);
                } finally {
                    $this.getElement().loader('hide');
                }
            }

            fetch(true);
	    },

	    _buildChart: function(data){
            var baseChartOpts;

            try {
                if(this._styles){
                    baseChartOpts = this._styles;
                } else {
                    baseChartOpts = $base(data);

                    var levels = baseChartOpts.series,
                        plotOptions = this.getContext().find('plotOptions treemap');

                    delete baseChartOpts.series;
                    baseChartOpts.series = [levels[0]];

                    baseChartOpts.plotOptions.treemap = {
                        layoutAlgorithm: plotOptions.find('layoutAlgorithm').value(),
                        layoutStartingDirection: plotOptions.find('layoutStartingDirection').value(),
                        alternateStartingDirection: plotOptions.find('alternateStartingDirection').checked(),
                        borderColor: plotOptions.find('borderColor').value()
                    }

                    this._styles = baseChartOpts;
                }

                var chartOpts = {
                    series: [{
                        type: "treemap",
                        allowDrillToNode: true,
                        data: data
                    }]
                };

                JSB.merge(true, baseChartOpts, chartOpts);
            } catch(ex){
                console.log('TreemapChart build chart exception');
                console.log(ex);
            } finally {
                return baseChartOpts;
            }
	    }
    }
}