{
    $name: 'DataCube.Widgets.TreemapChart',
    $parent: 'DataCube.Widgets.BaseHighchart',
    $expose: {
        name: 'Карта дерева',
        description: '',
        category: 'Диаграммы',
        icon: 'data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiIHN0YW5kYWxvbmU9Im5vIj8+CjwhLS0gQ3JlYXRlZCB3aXRoIElua3NjYXBlIChodHRwOi8vd3d3Lmlua3NjYXBlLm9yZy8pIC0tPgoKPHN2ZwogICB4bWxuczpkYz0iaHR0cDovL3B1cmwub3JnL2RjL2VsZW1lbnRzLzEuMS8iCiAgIHhtbG5zOmNjPSJodHRwOi8vY3JlYXRpdmVjb21tb25zLm9yZy9ucyMiCiAgIHhtbG5zOnJkZj0iaHR0cDovL3d3dy53My5vcmcvMTk5OS8wMi8yMi1yZGYtc3ludGF4LW5zIyIKICAgeG1sbnM6c3ZnPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIKICAgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIgogICB4bWxuczpzb2RpcG9kaT0iaHR0cDovL3NvZGlwb2RpLnNvdXJjZWZvcmdlLm5ldC9EVEQvc29kaXBvZGktMC5kdGQiCiAgIHhtbG5zOmlua3NjYXBlPSJodHRwOi8vd3d3Lmlua3NjYXBlLm9yZy9uYW1lc3BhY2VzL2lua3NjYXBlIgogICB3aWR0aD0iMjBtbSIKICAgaGVpZ2h0PSIyMG1tIgogICB2aWV3Qm94PSIwIDAgMjAgMjAiCiAgIHZlcnNpb249IjEuMSIKICAgaWQ9InN2ZzgiCiAgIGlua3NjYXBlOnZlcnNpb249IjAuOTIuMSByMTUzNzEiCiAgIHNvZGlwb2RpOmRvY25hbWU9InRyZWVtYXAuc3ZnIj4KICA8ZGVmcwogICAgIGlkPSJkZWZzMiIgLz4KICA8c29kaXBvZGk6bmFtZWR2aWV3CiAgICAgaWQ9ImJhc2UiCiAgICAgcGFnZWNvbG9yPSIjZmZmZmZmIgogICAgIGJvcmRlcmNvbG9yPSIjNjY2NjY2IgogICAgIGJvcmRlcm9wYWNpdHk9IjEuMCIKICAgICBpbmtzY2FwZTpwYWdlb3BhY2l0eT0iMC4wIgogICAgIGlua3NjYXBlOnBhZ2VzaGFkb3c9IjIiCiAgICAgaW5rc2NhcGU6em9vbT0iNS42IgogICAgIGlua3NjYXBlOmN4PSItNS41NjE3MzcxIgogICAgIGlua3NjYXBlOmN5PSI0OS4zMDcyNjIiCiAgICAgaW5rc2NhcGU6ZG9jdW1lbnQtdW5pdHM9Im1tIgogICAgIGlua3NjYXBlOmN1cnJlbnQtbGF5ZXI9ImxheWVyMSIKICAgICBzaG93Z3JpZD0iZmFsc2UiCiAgICAgaW5rc2NhcGU6d2luZG93LXdpZHRoPSIxOTIwIgogICAgIGlua3NjYXBlOndpbmRvdy1oZWlnaHQ9IjExMzgiCiAgICAgaW5rc2NhcGU6d2luZG93LXg9Ii04IgogICAgIGlua3NjYXBlOndpbmRvdy15PSItOCIKICAgICBpbmtzY2FwZTp3aW5kb3ctbWF4aW1pemVkPSIxIiAvPgogIDxtZXRhZGF0YQogICAgIGlkPSJtZXRhZGF0YTUiPgogICAgPHJkZjpSREY+CiAgICAgIDxjYzpXb3JrCiAgICAgICAgIHJkZjphYm91dD0iIj4KICAgICAgICA8ZGM6Zm9ybWF0PmltYWdlL3N2Zyt4bWw8L2RjOmZvcm1hdD4KICAgICAgICA8ZGM6dHlwZQogICAgICAgICAgIHJkZjpyZXNvdXJjZT0iaHR0cDovL3B1cmwub3JnL2RjL2RjbWl0eXBlL1N0aWxsSW1hZ2UiIC8+CiAgICAgICAgPGRjOnRpdGxlPjwvZGM6dGl0bGU+CiAgICAgIDwvY2M6V29yaz4KICAgIDwvcmRmOlJERj4KICA8L21ldGFkYXRhPgogIDxnCiAgICAgaW5rc2NhcGU6bGFiZWw9IkxheWVyIDEiCiAgICAgaW5rc2NhcGU6Z3JvdXBtb2RlPSJsYXllciIKICAgICBpZD0ibGF5ZXIxIgogICAgIHRyYW5zZm9ybT0idHJhbnNsYXRlKDAsLTI3NykiPgogICAgPHBhdGgKICAgICAgIHN0eWxlPSJmaWxsOiMwMDAwMDA7c3Ryb2tlLXdpZHRoOjAuMDQ5NzUwNjMiCiAgICAgICBkPSJNIDAuMTIyMzYxLDI5Ni44Nzc2MyAwLDI5Ni43NTUyNiAwLjAxMjY4LDI4Ni45NzI3MyAwLjAyNTM2LDI3Ny4xOTAyIDAuMTQyODA5LDI3Ny4wOTUxIEMgMC4yNTc1NTUsMjc3LjAwMjIgMC40ODQ2MTQsMjc3IDEwLjAwODAxMSwyNzcgaCA5Ljc0Nzc1MyBsIDAuMTIyMTE0LDAuMTIyMTIgMC4xMjIxMTMsMC4xMjIxMSBWIDI4NyAyOTYuNzU1NzcgTCAxOS44Nzc4NzgsMjk2Ljg3Nzg4IDE5Ljc1NTc2NCwyOTcgSCAxMC4wMDAyMzggMC4yNDQ3MTMgWiBtIDE5LjY2NDQyOSwtMC4wOTA5IGMgMC4wODQ2NywtMC4wODQ3IDAuMDg4ODMsLTAuNTQzMjEgMC4wODg4MywtOS43ODY3OCAwLC05LjI0MzY5IC0wLjAwNDIsLTkuNzAyMSAtMC4wODg4NCwtOS43ODY3OCAtMC4wODQ2OCwtMC4wODQ3IC0wLjU0MzA4LC0wLjA4ODggLTkuNzg2NTM5LC0wLjA4ODggLTkuMjQzMzQ1LDAgLTkuNzAxODYxLDAuMDA0IC05Ljc4NjUzOCwwLjA4ODggLTAuMDg0NTgsMC4wODQ2IC0wLjA4OTQ1LDAuNTQ5NjcgLTAuMTAxNjUyLDkuNzA5NyAtMC4wMDg0LDYuMjc5NzIgMC4wMDQzLDkuNjY2IDAuMDM2NTksOS43NTA4MSAwLjAyNzE3LDAuMDcxNSAwLjEwMDA5OCwwLjE1MDM5IDAuMTYyMDYyLDAuMTc1NCAwLjA2Njk1LDAuMDI3IDQuMDIyNTg3LDAuMDQxNiA5Ljc0OTk1MiwwLjAzNiA5LjE3ODMxNiwtMC4wMDkgOS42NDE1MjIsLTAuMDEzNyA5LjcyNjEyOSwtMC4wOTgzIHogTSAwLjc5NjQ5NSwyOTEuNzc2MDcgdiAtNC40Mjc4NiBoIDQuNDI3NzUxIDQuNDI3NzUxIHYgNC40Mjc4NiA0LjQyNzg2IEggNS4yMjQyNDYgMC43OTY0OTUgWiBtIDguNzU2MDAyLDAgdiAtNC4zMjgzNiBIIDUuMjI0MjQ2IDAuODk1OTk1IHYgNC4zMjgzNiA0LjMyODM2IGggNC4zMjgyNTEgNC4zMjgyNTEgeiBtIDAuODE4OTYyLDQuMzY1NjcgYyAtMC4wMTMwMiwtMC4wMzQyIC0wLjAxNzkxLC0zLjA5NTc3IC0wLjAxMDg4LC02LjgwMzQ4IGwgMC4wMTI3OSwtNi43NDEzIDIuMDI3MzEzLC0wLjAxMyAyLjAyNzMxMywtMC4wMTMgdiA2LjgxNjQ4IDYuODE2NDcgaCAtMi4wMTY0MzcgYyAtMS41NjczNjEsMCAtMi4wMjE3MDgsLTAuMDEzOSAtMi4wNDAxMDMsLTAuMDYyMiB6IG0gMy45NTcwNCwtNi43NTM3MyB2IC02LjcxNjQyIGggLTEuOTQwMjUxIC0xLjk0MDI1IHYgNi43MTY0MiA2LjcxNjQyIGggMS45NDAyNSAxLjk0MDI1MSB6IG0gMC44MTg5NDIsNi43NTQyIGMgLTAuMDEzMjcsLTAuMDM0NiAtMC4wMTgyNiwtMC45NDcxNCAtMC4wMTEwOSwtMi4wMjc5MyBsIDAuMDEzMDMsLTEuOTY1MDggaCAyLjAxNDg3NiAyLjAxNDg3NCB2IDIuMDE0OTMgMi4wMTQ5MiBsIC0yLjAwMzc4MSwwLjAxMyBjIC0xLjU3ODA0NSwwLjAxMDIgLTIuMDA4OTA3LC0zLjhlLTQgLTIuMDI3OTAyLC0wLjA0OTkgeiBtIDMuOTU3MDU5LC0xLjk3ODA4IHYgLTEuOTQwMyBoIC0xLjk0MDI1IC0xLjk0MDI1MSB2IDEuOTQwMyAxLjk0MDMgaCAxLjk0MDI1MSAxLjk0MDI1IHogbSAtMy45NTY4NzQsLTIuNzk3OTQgYyAtMC4wMTMxNiwtMC4wMzQ1IC0wLjAxODE2LC0yLjAyMTcxIC0wLjAxMTA5LC00LjQxNTk5IGwgMC4wMTI4NCwtNC4zNTMyNCBoIDIuMDE0ODc3IDIuMDE0ODc0IHYgNC40MDI5OSA0LjQwMjk4IGwgLTIuMDAzNzgxLDAuMDEzIGMgLTEuNTc2NDI1LDAuMDEwMiAtMi4wMDg4ODcsLTMuOGUtNCAtMi4wMjc3MTcsLTAuMDQ5OCB6IG0gMy45NTY4NzQsLTQuMzY2MjQgdiAtNC4zMjgzNiBoIC0xLjk0MDI1IC0xLjk0MDI1MSB2IDQuMzI4MzYgNC4zMjgzNiBIIDE3LjE2NDI1IDE5LjEwNDUgWiBNIDAuNzk2NDk1LDI4Mi4yMjM4MyB2IC00LjQyNzg2IGggNC40Mjc3NTEgNC40Mjc3NTEgdiA0LjQyNzg2IDQuNDI3ODYgSCA1LjIyNDI0NiAwLjc5NjQ5NSBaIG0gOC43NTYwMDIsMCB2IC00LjMyODM2IEggNS4yMjQyNDYgMC44OTU5OTUgdiA0LjMyODM2IDQuMzI4MzYgaCA0LjMyODI1MSA0LjMyODI1MSB6IG0gMC44MTg3MjUsLTAuNDEwNTUgYyAtMC4wMTMxNSwtMC4wMzQzIC0wLjAxODA0LC0wLjk0NjU3IC0wLjAxMDg4LC0yLjAyNzM2IGwgMC4wMTMwMywtMS45NjUwNyA0LjQxNTMxNCwtMC4wMTI3IDQuNDE1MzE2LC0wLjAxMjcgdiAyLjA0MDA3IDIuMDQwMDggaCAtNC40MDQ0NCBjIC0zLjQ4MTQ1NSwwIC00LjQwOTQ0NywtMC4wMTMxIC00LjQyODM0MSwtMC4wNjIzIHogbSA4LjczMzI3OCwtMS45Nzc1MSB2IC0xLjk0MDMgaCAtNC4zMjgyNTEgLTQuMzI4MjUxIHYgMS45NDAzIDEuOTQwMyBoIDQuMzI4MjUxIDQuMzI4MjUxIHoiCiAgICAgICBpZD0icGF0aDQ0ODciCiAgICAgICBpbmtzY2FwZTpjb25uZWN0b3ItY3VydmF0dXJlPSIwIiAvPgogICAgPHBhdGgKICAgICAgIHN0eWxlPSJmaWxsOiMwNDQ3NjY7ZmlsbC1vcGFjaXR5OjE7c3Ryb2tlOiMwMDAwMDA7c3Ryb2tlLXdpZHRoOjAuMTU4NjA1MTc7c3Ryb2tlLW1pdGVybGltaXQ6NDtzdHJva2UtZGFzaGFycmF5Om5vbmU7c3Ryb2tlLW9wYWNpdHk6MSIKICAgICAgIGQ9Ik0gMi45Nzg4NzM2LDc1LjAyODQwNSAxLjEzMzg3NDMsNzUuMDAyMzgzIDAuODY4NTEwMjcsNzQuNzAwMTUgMC42MDMxNDYyLDc0LjM5NzkxNyAwLjUzOTkwMTkxLDcyLjQ5MjExNiBDIDAuNDQxNzQ0MjUsNjkuNTM0MjM4IDAuNTQ5NjgxOTEsMi44ODcwOTAxIDAuNjU0MzIyODksMS44NDE3NzgzIDAuNzU4NjA0NDcsMC44MDAwNTY2NiAwLjc4ODM1MTkzLDAuNzY0MzkzNDEgMS42NDA1MTUzLDAuNjU5NDY0OTIgMi40MjUwMjMxLDAuNTYyODY3IDczLjAxMzI3LDAuNTY0MzkxODggNzMuOTEwMDYzLDAuNjYxMDI2MTEgYyAwLjM4MTMzMywwLjA0MTA5MDcgMC43NDk0OTksMC4xMzA4NzY2NSAwLjgxODE0NywwLjE5OTUyNDMzIDAuMDY4NjUsMC4wNjg2NDc3IDAuMTU4NDM0LDAuNDM2ODEzNzYgMC4xOTk1MjQsMC44MTgxNDY3NiAwLjEwNzYzNCwwLjk5ODg3MDggMC4wODg2NCw3Mi4wMTA1MTc4IC0wLjAxOTQxLDcyLjU2NzYwODggLTAuMDcwMzYsMC4zNjI3NzQgLTAuMTM0Nzg1LDAuNDY4ODczIC0wLjM0NjI0LDAuNTcwMjIxIC0wLjIwMzk5NCwwLjA5Nzc3IC0xLjE4MTgyOCwwLjE0MDAyNyAtNC41NTI1NzIsMC4xOTY3MzUgLTMuODY0MTY0LDAuMDY1MDEgLTYyLjU1NTA5NzcsMC4wNzgyNyAtNjcuMDMwNjM0NCwwLjAxNTE0IHogTSAzNi41NjQ5NDQsNTUuODU0MTczIFYgMzkuMTEzMTAyIEggMTkuNzc5MjMgMi45OTM1MTU3IFYgNTUuODU0MTczIDcyLjU5NTI0NSBIIDE5Ljc3OTIzIDM2LjU2NDk0NCBaIG0gMTguMDM1NzE1LC05LjA0NzMwNyB2IC0yNS43ODgzOCBsIC03LjcwMDg5MywwLjA0MDExIGMgLTQuMjM1NDkxLDAuMDIyMDYgLTcuNzA4OTUyLDAuMDQ2NzIgLTcuNzE4ODAyLDAuMDU0OCAtMC4wNjAzLDAuMDQ5NDUgLTAuMDU3MzgsNTEuMjEzMTEgMC4wMDI5LDUxLjI3MzUwNCAwLjE1MzAxLDAuMTUzMjM0IDEuMzU1NDM1LDAuMTgxNDU2IDguMjk2MjI5LDAuMTk0NzI3IGwgNy4xMjA1MzcsMC4wMTM2MiB6IG0gMTUuNDY4NzUsMjUuNzI5MjA0IDIuNDc3Njc4LC0wLjA1ODgzIFYgNjQuODU3NjcgNTcuMjM4MSBoIC03LjY3ODU3MSAtNy42Nzg1NzIgdiA3LjU4NzU4NCA3LjU4NzU4NSBsIDAuMjAwODkzLDAuMDQ1MTIgYyAwLjExMDQ5MSwwLjAyNDgyIDAuMzgxNjk3LDAuMDU4NzQgMC42MDI2NzksMC4wNzUzOSAwLjc3OTEzNiwwLjA1ODcgOS42Mjk1MTgsMC4wNjAzOCAxMi4wNzU4OTMsMC4wMDIzIHogbSAtMS44NzUsLTE4LjAzNTg2MyA0LjM1MjY3OCwtMC4wNTkxMiBWIDM3Ljc1ODczNyAyMS4wNzYzOSBsIC03LjY1NjI1LDAuMDIyODIgLTcuNjU2MjUsMC4wMjI4MiAtMC4wMjI1NiwxNi42MjUzNzQgLTAuMDIyNTYsMTYuNjI1Mzc1IDAuMjkwNDEzLDAuMDQ4OTUgYyAwLjc3NzUyNCwwLjEzMTA2NyA0LjcxNzg5NiwwLjE1OTkyNyAxMC43MTQ1MjEsMC4wNzg0NyB6IE0gMzYuNTIwMzAxLDE5LjczODEwMiBWIDIuOTk3MDMgTCAxOS43NTY5MDksMi45NzQ0NzU1IDIuOTkzNTE1NywyLjk1MTkyMSB2IDE2Ljc4NjE4MSAxNi43ODYxOCBsIDE2Ljc2MzM5MzMsLTAuMDIyNTUgMTYuNzYzMzkyLC0wLjAyMjU1IHogbSAzNi4xMTYwNzIsLTkuMDE4MTIgViAyLjk1MTg2MjUgbCAtMTYuNzE4NzUsMC4wNTczMDUgYyAtOS4xOTUzMTMsMC4wMzE1MTggLTE2LjcyNjg1LDAuMDYzMTczIC0xNi43MzY3NSwwLjA3MDM0NiAtMC4wMDk5LDAuMDA3MTcgLTAuMDI5OTksMy4zOTQ2NTA5IC0wLjA0NDY0LDcuNTI3NzI5NSAtMC4wMjE1NCw2LjA3NDEyNSAtMC4wMDQ0LDcuNTM2OTQ5IDAuMDg5NDIsNy42MzA4MDkgMC4xNjczMDcsMC4xNjczOTMgNC4xMjcxNzMsMC4yMTM2MDcgMTkuOTk1NTQ2LDAuMjMzMzU1IGwgMTMuNDE1MTc5LDAuMDE2NyB6IgogICAgICAgaWQ9InBhdGg0NDkxIgogICAgICAgaW5rc2NhcGU6Y29ubmVjdG9yLWN1cnZhdHVyZT0iMCIKICAgICAgIHRyYW5zZm9ybT0ibWF0cml4KDAuMjY0NTgzMzMsMCwwLDAuMjY0NTgzMzMsMCwyNzcpIiAvPgogICAgPHJlY3QKICAgICAgIHN0eWxlPSJmaWxsOiNmZmNiNWM7ZmlsbC1vcGFjaXR5OjE7c3Ryb2tlOm5vbmU7c3Ryb2tlLXdpZHRoOjAuNDc7c3Ryb2tlLW1pdGVybGltaXQ6NDtzdHJva2UtZGFzaGFycmF5Om5vbmU7c3Ryb2tlLW9wYWNpdHk6MSIKICAgICAgIGlkPSJyZWN0NDQ5MyIKICAgICAgIHdpZHRoPSI4LjY1NjUwMTgiCiAgICAgICBoZWlnaHQ9IjguNjU2NzIwMiIKICAgICAgIHg9IjAuODk1OTk1MDIiCiAgICAgICB5PSIyNzcuODk1NDgiIC8+CiAgICA8cmVjdAogICAgICAgc3R5bGU9ImZpbGw6I2QwZDJkMztmaWxsLW9wYWNpdHk6MTtzdHJva2U6bm9uZTtzdHJva2Utd2lkdGg6MC40NztzdHJva2UtbWl0ZXJsaW1pdDo0O3N0cm9rZS1kYXNoYXJyYXk6bm9uZTtzdHJva2Utb3BhY2l0eToxIgogICAgICAgaWQ9InJlY3Q0NDk1IgogICAgICAgd2lkdGg9IjguNjU2NTAxOCIKICAgICAgIGhlaWdodD0iOC42NTY3MjAyIgogICAgICAgeD0iMC44OTU5OTUwMiIKICAgICAgIHk9IjI4Ny40NDc3MiIgLz4KICAgIDxyZWN0CiAgICAgICBzdHlsZT0iZmlsbDojOGZjODYzO2ZpbGwtb3BhY2l0eToxO3N0cm9rZTpub25lO3N0cm9rZS13aWR0aDowLjQ3O3N0cm9rZS1taXRlcmxpbWl0OjQ7c3Ryb2tlLWRhc2hhcnJheTpub25lO3N0cm9rZS1vcGFjaXR5OjEiCiAgICAgICBpZD0icmVjdDQ0OTciCiAgICAgICB3aWR0aD0iMy44ODA1MDA4IgogICAgICAgaGVpZ2h0PSIxMy40MzI4NCIKICAgICAgIHg9IjEwLjQ0Nzk5NyIKICAgICAgIHk9IjI4Mi42NzE2IiAvPgogICAgPHJlY3QKICAgICAgIHN0eWxlPSJmaWxsOiM0OTlkZDY7ZmlsbC1vcGFjaXR5OjE7c3Ryb2tlOm5vbmU7c3Ryb2tlLXdpZHRoOjAuNDc7c3Ryb2tlLW1pdGVybGltaXQ6NDtzdHJva2UtZGFzaGFycmF5Om5vbmU7c3Ryb2tlLW9wYWNpdHk6MSIKICAgICAgIGlkPSJyZWN0NDQ5OSIKICAgICAgIHdpZHRoPSI4LjY1NjUwMTgiCiAgICAgICBoZWlnaHQ9IjMuODgwNiIKICAgICAgIHg9IjEwLjQ0Nzk5NyIKICAgICAgIHk9IjI3Ny44OTU0OCIgLz4KICAgIDxyZWN0CiAgICAgICBzdHlsZT0iZmlsbDojZTU0YzRjO2ZpbGwtb3BhY2l0eToxO3N0cm9rZTpub25lO3N0cm9rZS13aWR0aDowLjQ3O3N0cm9rZS1taXRlcmxpbWl0OjQ7c3Ryb2tlLWRhc2hhcnJheTpub25lO3N0cm9rZS1vcGFjaXR5OjEiCiAgICAgICBpZD0icmVjdDQ1MDMiCiAgICAgICB3aWR0aD0iMy44ODA1MDA4IgogICAgICAgaGVpZ2h0PSI4LjY1NjcyMDIiCiAgICAgICB4PSIxNS4yMjM5OTkiCiAgICAgICB5PSIyODIuNjcxNiIgLz4KICAgIDxyZWN0CiAgICAgICBzdHlsZT0iZmlsbDojNjY1MWJlO2ZpbGwtb3BhY2l0eToxO3N0cm9rZTpub25lO3N0cm9rZS13aWR0aDowLjQ3O3N0cm9rZS1taXRlcmxpbWl0OjQ7c3Ryb2tlLWRhc2hhcnJheTpub25lO3N0cm9rZS1vcGFjaXR5OjEiCiAgICAgICBpZD0icmVjdDQ1MDUiCiAgICAgICB3aWR0aD0iMy44ODA1MDA4IgogICAgICAgaGVpZ2h0PSIzLjg4MDYiCiAgICAgICB4PSIxNS4yMjM5OTkiCiAgICAgICB5PSIyOTIuMjIzODIiIC8+CiAgPC9nPgo8L3N2Zz4K',
        thumb: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGAAAABACAYAAADlNHIOAAAABGdBTUEAALGPC/xhBQAAAAlwSFlzAAAOwgAADsIBFShKgAAAKspJREFUeF7tfGd7VGeW7f0/82F6Zrrdwe7sHne7ncE2OdnkZJCEcs4q5YCEEiJjkSQRJUACg4k22RibbOXKpVJCwr3uWu+pIwkEbXu6b/t+mHqe/ZzzxlO1195r7/0ewf/B/35+1M//AIBv8ejRI4yMjlqtbx/jb+bO+jx6NBK6+/sf7fFDPt9+++0Tz7E+f8Nj9n/X52+hhfZ1/OZ/9nk08v1+4/f5/CAA+vw+XLp0FW5nN1pPnUFvdy/OnzuHc59fRn9fEPfv3sOZK1/C5+zBwcPH8ElbC65c/wLOnh50d3Xh4mdX4PIE0P3NQxxvPY6rV27g8qXr3K8XIwTkzCetaDt5CsG+ftziuls3v8Y3HQ/RPzCE0UfDuHzlM1y+dg3Xrt3EhYsX0eMO4Osvv8C9h93m+/UHA2hvb0dXdxcetj9ED58rVd++dR137t7GtcuX8Nnlqzh77iK8gSC+uX8P586exYWz53Hpswu4eOYM7jx4iJGRYXzT/g16e3v5vXvQye/eznZ3Ty8e3PkS585fhM/jw5VrfPa9e9RDp/mNHd/c5+/zmO/yfT8/CIBufomTn5zF1csXsWnnLhw/1oqd27aj8UATGvfuQ+n6WrR9dhP9PjfWF5egorICO3c34PjhA9jXsA8tx0+j5XAzataXYcfOnajb/DGOHT6KLVu3YXB4BM3796Ce83fv3I2aio04un8/Nm3ZTEX70dvZjpMnP8GFSxfxyYkzONZ2El/duY9PT7aho9uJx48f4+uvbqJ+115UbNiARq49d/68AeDWtYv47MJZnD11AvsOHEZzy3EC1IPrV6/jML97w54D/B5NONTUhGtffQ2vuxe7du/D7t17+d2bsXFLPRr37ELdps3Yt3OL2Xvztl2ob2zGyaMH0bS7HkdbjmD/3h1oPX3OUtb3/PwwCqLr9nR1EPX7cHu8vO+mlTjR0dGJrs5OPHj4EF5/EI9JT16vj+KBi9Yt6/cHAgj4/Xj44D7av/mGVsq1TiectNbPr1wz22u8t7cbt+/cQQ/H3Rx3u71GiW72d3b1co4Pbq8fwf5++HxeY4HdnR3cP4jO9ge49uUdePjsgM9Pz+k3+8ozhoaH0Usr1boufm/tOdTfhx5+fz+/p8frNZ4YHBhk24ULl69zf7/5jecuXsLdh5209C4+oyPkYe1wcq3b5YSH6/R9+/xe/v6Aeeb3/fxvEP6RPz8KACPDg3j48C4t8Rv4acUP2zsNhQT7+hCgeGTlbje9x4VhxgY/233BfozSs+49aDeWfPfmDQz2D9CCXehxuWnlQfjoGX56kT4dtFQ3rXpgcBB92jfAMT5rcGiYe/XhypUruNfehbsPOvEVaWdwcMis+1d/fhQAhvoZPG/dxO3b1/AZOb3t9Hn43D349JM2fHruAj6/cQPn6fafHG/D/YdduHXrBs5evExudqLlaCuuff4ZPj99Cl66/pkzF/Apuf7ChfNoI7dfvXoFwyOjeMgAe+b8OZy/dAnnzp3HjauXcYKB/+sHHQgGfDh27Bi+uH0Xl2/cZmJxmVTiCn27f+3nR6OgR+RkpZayaln/t6MjGBoaNGmt+vXRmEk///atiSuKQerT528mlWQaOsr5XP/4sdb8zfQrNR3lflozQjDsPUbNvMdmvT7aQZ9RM8du/Ws//xsDfuTPGAD9I324P/g1HgzeeULaB+/j4eDdp/pvo2uwHd8M3jP3dr/mdQw+HGvbczWvY/DBpH7t3W76x/fQfSf3eHrvB0O30TvQi/vOYdzuHcSd58gD1yDuOQefO0f99zlH8qxxiebccw+R4vx4dOMOhozcfVKus++rB5ZMGmf75r1nj127jcG77WOeOAbAl8GrSO1dDYcrckxyXOuw3pmOAlecubf7s1xh2Nq7HsXOJPZHhPrXIc8Vg6re3LF5kmyOlziTUdnrmNRf6kxBhTPL3Nv9Wa5w1PQWmDX23np2jmctGjsakHGgD2ENTqxrnCyRTU7kHO1F8qFehD9njvozm3uRQYni/GfN0f6JrX6cPXgJQ+9GwT81Gv53Y56UtyPhWZYDz/Ic+KdwzsQxzvfNToJnhWPSWOC1cDjjyzHE5ECfMQC+6r9ufnyBJ25M8j2xqHRno9iTiFxPNNsxRnI867DDtQHr3WnIM/2xpr/Qk4CNrsIn9shjf4U7A7WugtA8S7Sf+qvduaG9rX6HJwqbXCUod6eP7a098nzrcKBrP3KOBBF1wI3Yg5Ml7pAb+a0uZLS4EP2cOep3HHMhhxLP+c+ao/3TTgZwofkqhmfGIzAjAYGZiU/K+3Hwrc6H76N8BKZzzsQxzvd/kA7fmoJJY31TouFOqcLwkJV1TQDgGjJp2QX8wbboh1e5HdjoLqSiHEZZEoGyx7XZjJW6k1HmTqWkUGkZVF4xgYgfEymwwp2JOvZb8ywp4boadx7q3EXm3u4vdidhm6vCPMfeu5R7l3oTcKjrIBwEQEqMo6KeFim0gABkEoCY58xRfy6VLxASOP9Zc7R/ug3ArJDyZyU9KdPiqfwCS8kCaOIY5/s/zIBvbeGksb6pMXCnVk8G4Hb/TRQ5E40SJ0qtOx8VngyUeqiEkMgj6l21qHZJSSlUUppRlOZvcZWF2pZovNqVZ4CRx0zstwEY3yPNgGEDIFCtfoLgTfxxAJhLxc1JRmBuypNCJUvB/zQA7vR/Sd5NMdY9UTa6C4wl55IaRAmSHE8EtpOCpDgH6UgUonFRjkU1FlVJ1L+edFJDEHRvzdUejC9Urp6he7s/m3vXuYqM0h2eSNMnWnL4wrG/q+l7AfBdFPS9ADjhx4Vj1zG0JBP+xVnwL8l+UhZmwhtdRhrKQ+C9WItqbCE9+een/TAAbhkKWmsowxb9+Cp3jrHSalprDb1Bor59zq3G2mWpsuQaXgVWvbMmNE99eWZc86x+q8/u3+paj52uqgl75Bla2+Ws41g5+x1jc6u92TjWeYwxoO87Acg5avF74uHJIqXnH/8BHvC8GPAeY8DKPHhjCMKqXErekxJebAEwLY7rOT8kfe88NwZcN9lGEQOpLbJom/sNHdG6pRAFT1muFKh+cbxEgVNUo3kT+ze4s/AxAZByx/szGLALsMe5aWyeRHtscZUShI3GQ+z+9d5knOo8jaKjfUg67ELqkcmS1uxCEQGQchMPuZDMeU+L1haEAEgkAPFU+NMimvpOABSEV+XDu66Y3pAB/yJ6iS1s+1YQlKhS+BekGToywsAsL3Bn1WE4dPQxBsBdUpBSTlmyLbaVFnuSjDeIFko8yYaGBJA8QTRhU1Mu76XYUs7LI21YNBRtAroym4lUprmat42WPpHeRGkbCK68Rvc2lTl8YWjtbPvHKIh9UfvdyKPy7WxpIoApoWsyxXGKFNRyDUPzyf/zyPnzUydImlGkL6IY3sgS0k2qUe6YCIDlDnrHenM1YEjoGaIvV7YAeEYams00tJBWb4sUJyUr8IqSxOVlnlTTr0AsS62gddvxQpaujEkKtAKrldnIkqXoSu4lC5cXlLNP3rSLwVzr7D1k7VK+qEkZkb1HsTceJzo/QdbhINY1kSaoyKdFlptH697wiROFVHBR27gUU8pOOs3Yel7LKeobm8P5FRxTn9YWn/Hj89ZrGFwa4v+lzPfHhG0pVjTDIOxnUPbPIwgSBmylpr7luQiwFhgL2rOTrXWMJ96VDgz3Dxi9PwVAhLFSW0RBkwFIM/0l9ApxfhGBkFdIBIooSwrWepvK1C9PehIAeVu+pWjuZe+h+bXcdzszIT3T3iPfF4WTXSdQfaIPuVSyLP1pKaTyaj51IusZWZC8Q9mRFCyw5A0Tx9WWVyguyFvCGWtOH7qKRzPJ4QqsoiFb1J5DpdMTRC0mwNrUxDGB41+Ubc0b62dtwMCt+V4Wb88A4IapOqUsW/TDpVDL6uOMdYrH7eyljtZuKVpzJfFmvubZilOfFKvUUtdxcFUfMDa4qtm2QLJBV+qrQk/31h6JKPBF4yQ9oJgxQBQhvn+WlJx4dhoqAEQ5su6nxyQCQN5jAxDRTAAOE4DZIf4PZTFjypa1G7rJfHKMAPlVATMWPAEA64YxalpbMBkApaE6GpCVjguVzMpWFCG+Vt6vflGClCwrlYdIYbJa3YvrFYi1djPvlVKqX2mr2rpX8DVxxiUPqDTrBexWk1U5rCAcoibdq7reQM872nkU2YwB4nEp7FmiFPNfBkCIjp4YCwHgW0G+V7yw44LSUsUBHV+syZ8MgNLQDNeasWBoBcooKiHTWK6qYlNAGTqKMRarIK1ga1OI1hTzqgJKwbmKIIhudC/6ksVrvuKDLFuBXVSk9Vpr1xwa30hQVBMoTui52b412Nu1C7lH+p8MwgdciDsSQEJLEHGHA8hr8yHjeABxLYNUuodjfYhv6Uc852Qc96P4pA8xh/xIPDqA2MN+xBLQ+CO8hgBQZqR91z0FQB/5fODdWPRPjcXAtAQMzknFwLJc9BOEwemJ6CfF9FP5A1Ni0M+Y0b+6AEOkm34qfmA+M6DEKnN04V+QDg8D9yQA7gW/QmUvc35a7EQRFdhKnxiEFQOkHPVL+XacKPOzIg6kIT8QjZoA6cibiTyvzn2Ujmab+SaoEkDNl5Vrve5tADQuehNweoaeqyyooWvPZACo2JStnyOqsg2x9TdRcPArFDV8hujKZkQ2dCN126eIrj7OsVvI3HMDGQ23kVh/A8uKjyJlz1fI3HkW4Ttv06u8pj7IaHEjtZkec7wPZ49YRxFBAuAkhZyKKcRnaSV4uDwLdxan4sqyVDygNd9ZmILOldl4QDo6Hu3AvcQyzsnB8bnx2BuejEvLE9ATV44+ZU+sA7ykoUkAfM0YoNNMKdIWKUb0YCv37wFgPIA8nXeX1xupyLy5DoVfMhPqSUeu26qGbQBk4cqy5GFKW20ApHQ9S6A8DwAHAZh4GBdNCy7bcwHp6TlIysxFWlYWsnJzEZeYiPTtn6Jsy17kFRYgKSUdOY5ShBc3IqdmD1aFRSK/rBZ5OclYFl+IlJYAsyPrkC6dsSSpNYBzEwBwTYlFY2U92loOImn1OqSsjERtfhWS4+JQE5OIyvwStMaWYFsqE42yapSl5iNzZSJKs3JQmJ6J04l5TGlZB9CLvCtznxWEn38aagGgU81MUxUbHqe1KuWUEqXACl8GstqjUbKnFtVb6pBZnYukXK6rK0RyaQYOdLHg8oqCrFNQrRfvb6KXCUxR3GZ3iYkB4nzd64hCBiCqK/TGYn9XIwpINeLzJFa1EhVcjlaPKayU/ZSd6EUpA3H+CT+DtQdZx7wmzSxsczJTcnJc+b4H+Sy0MpqdVLbTXFOPuFHCefKCOAIcRUA+PXYDQ+EFVkUbVoS7S9Jwe3kGrtPyv+T1zkcOXFuRhodL0vGVvGBZJroX8T7MgS/nx+P2O2F4MHUdbr8dhvth+QiSfiwPeGYWdN1kQeMZjbISKwsSCOJhWbCUoSxIVmoFYYcJwDs8G1DTXoiScznIaU1C5nla+IUUZB5NRGpDIjbfK0GlL8es1bGG9pV1K+eXhQtc422kHwV6gWtiAcFQu8SbgINdTahkGiorFV/bIuU7jjEAH3dT2W4UU8nZRy1O11g2xxwcy2RffqtVjEUf8DAYWxK938Mq2W0CtOZrPNyOAXPGg/DArGT0f5iJQWY4QzOTMcA4MLgkBwMzEjE4I4kxgLGAVDVAihlcQpnJNbNTTIwIxG2Ad02hCcie6LLJAPy909ASeoA8QoBIgbq3KCg/1J9oACn0xqE8SGVSioLxKKYUDcShciAzZP0xBliBaaiI+1qB3I4LScbr7GCvvRWk9dxcX7ihoJzD/YgMFV3PEtUIqmbDG92IZMFmi2hL/aoXNG8shojK2J4IgOqEZ2ZBvNrVrjnbUXHFwupZWZBJQwmGmfdeHLzxBCCuwlTD5ixo4CkAxg/jxk8yRReVVKytjMkAKAbEmn4BoP5SxghLaVYhput4ALYKKylYcWQiALJ2OxZo3I41TwMwKQhPVCRFVl96wmkUqZTUFvWrEhY9Pb3+HwJgEesAZkBjopPQZdmkraKxilmVtCex0tQAfq7xhBc9ywO+QKFTCk6fIGnMhKzAaAMgS7UsOeEJAKRkKw1lhcw8v4qKlXJFUcqmrBRUb82U5cgDGC+ocM1ROqr3AE97gPazAbCDcOmxoDmzeboAk3VnHbWUXEiuVyBVPWCL2ooDOm6IoEdM9BopXOnn9wZAXC5ls62jCB/jg7lK9JImqhS+6PXWUYUkshSevK3WkQTT1OdkQV8g3xlnFGyL+FjB0rZMSZXLiglSvsakpHyCo7aULH4XeJor0HRVW+8DtJ99X8sizE51pXztafG9rgXmas8VSBXeNBzuPPTcwzgpMoNKVsBNIxji8YlKVjuV4zqqEFgqysaE/VL89wZAVj9HB3RptPYcU5SNyRx6xapcVr0hChJQVLw3Y6N1kPfDsqAYKsKqiAVIOa1cCrYU7WBlW2qoQ/0KplKq+nTwpmrYFp33SLnWsUSS2VuVsRQr61ZNIA9S4JVnyRPkAZvcxQZ8kxT4Yv/uGzEpWVYuAKRQtZ81Xnem12RLUrQten+g2GBT13MBEL9/mG5Ric51SC1WcUUg6BVGVCHrgG4xK2TON2vZZwAQQCzkvKyIJwFgxYDJ74SNJXrSDHWIDnQYJ6VJQcp+lM+XezKNB8gbFAMElsDTHrrKku0qWB6hY2YBpviiZ6hPa2w6UlvPU5DXVe18XySzoAP/EACy9spTTsQftN4L2KJUVmvLCIDihQGABd7plusYXkEep5UbLqf4aL0+crhpk+N9UWXQsfQY3TDT8WRupBfYb8oIAr3FAPABCzHGCC/HfmAWZAdH0lIoHowHYWYwBEXKswDQO2CdiI6fempMyrT7tI8O4VRPaC8BKpBk8RqzALM8wj6kK2SR988AoJwxQFmRAq8tMVR4EmOAvGCSBygNnaWASw9gAJVCjXIViO0gbKgmJOR4geBNrTFAGXCYdnqKdsCXsMGA5M7eNPl9wLMP46yCayIAdtE0HoQtABRsraJMubt1MKc+6/Ct0HC93Sdv0BsvUVYJKWxi7i+F63nKgrRGYGjcvJTvPPjcV5LfFwAFYcWDiWPfOwuSCAB6QYC0o/akNPT9eKN4bxKzHv3Zil7cM0h7sjdbYHHcE1eO4VHrX9lMCMI6jtbBmo6ik4yIe6Vk3RvlMlgqnbQLMXmHOVwzdGTRRbkng/OSQi/ao8xxgtYpTijzEZDqsyjISk3lBQJXe6itfYoJsChOQGu8wBdl/i4olx4gZT79GlFKtAF4XhBWtvQvAYBW718ZoiDFAdUBzIQUwPVO2BzGTQZAWVCsUZbcX1QhRcpqrSPhAvNSRQFVFXA9KWSbXle6VYTp6LnUACO6kXJtq9dVB3p6ya49BZysepez1hxPCxg9b0voGFv38hABr2fp+eb7eFPR2tmKkmN9JpuRlU8UKVe5vgDQVZmOALFFbb1w0RuxfxoApKXnAkDrN9QUWuNlWjoOQOlkAOwsSBY4npNbBZL+LkhtKa/cYx0frxdFmKyFGYxH3mCdZMoDNE80Is+QR4lapFx5hKxZ13EPsIo+U2/wWRoXxQkszbGzpjxfBNo6TyLtYD/WNHoR3jRRPFjb6EHCIY85cshoptUf9CBOx9EhUTu9xY3q0y6kNOveFnmOGznHdJ5EENpUMTMmtAVx/shVjEyNQpBKC06NseStSASUejLTCTCbCSzNscbJ/Wb8DY4zRvQRmOCbkVY/1/jCis1paP9bUfASoGcCoFeS+rF2VaosZiLvT6xWpdjxwJtquN2OAVpjU4vGpWhZu8DSetGKvEiWraxHIg/TX8LpOWrLS/SXFNapaaR5H3Ciqw315/pR/akHNWcsqTVCxbJv63k3dn/uxpZzblSdtvpsqaJs4XjjZZe5t9fXcG0N25vOerDrMzd2XrRAqr4QwPULtzGUtwX+HIpjCwK5LKZ0X74b/oLt1n11A3x1++GrbYJvI6WmEb76FnhrG+Ev+Rj+sl3m6tl2yMzTWjfH9Q9P9HkuAFKWUS6VUhpSugXGOACTsyALAAVXBVXRh7xBlrzTaf39j3heYOnPUQSK6EZztjvLTfYkUKR8/WnLPucWQ3N6y1bjKcLnHW349nAGRhvDMLI/EiNNEXh0IAZDJ8mpR5LwqCmcEolHHBtqzTNjI03rxuYOHcvF0KEkc2/1hWPoOKvS5nSMNFprRxvXou9SAxLikzB33geYvWgJ4tIzkJCRae7nLlmGtTFxiEvLwJzFSzF/2QosXL0GEQlJ+GDFKsxfvhILV6yGo7QMC1auwrzlK7AkLAI5RcWYx/VzPlyMsKgY9Pdb/35tDIBbA1eQ5l2BHH+YKXrKfbR2X7ypQAv90cj2rzX9pb4kpoT0Bl8CqnyZ7F+DIn8sKn0ZobUMoBSHPxy5fj6Y67RHtTcLGf7VZp8M/0rUeQmEl4GZwVVS581jm/GBzy33seijVPjSsMlTgM3eQpQHMnG6owGj2xbjUe3bGK57F8Mbp2Bo83T0N8VgcPt8DKt/41Qz1r93rRmz25o7sPsjDG3jPN5bfe+YvsGdS7j2HdM3WvsmvKfq8O70Bfiv//oVfvqzX2HW7PmYM/cDc//Cz1/CW29NNX0/e+FF/OpXv8Vvf/sypkyZhpde+r1p/+Y3f8RHH0XgxRd/h1/+8jf44x//glWrwvCLX/za7PH22+8iGAwavY8B0B74Bnsf1qOpYx8Ote9Hc/thNHccREv7ERzsaGL/Xhzq2I/WjmM41n4Ure3HeW1h/x7Tr77D7QfM/MMdB8z8/dxL15aOwzhq5u7FASpxf+ceHG8/hiPtB836RsrR9mYcaG9AY+du05Y0dOwyfQfaG7GnazcuPTiJRzuXY2jTNAxtmUUFz8DgtnkIHkjEwK4VGNw627QHty9AsDHagDK0ZTaGts4x8/v3RWJwx0JrPdcObXqffREYqF+Jobr3Td9I3VR4Pt2MWfOWUKF/wK9//Qd88MFizJ+/ED//+a+NgqdMeR/z5n04puw//vHPeP/9Wfjd7/5k2n/4wysID48ywGj9K6+8hjVrLEAEgsCaBMCtWwPISvejMLcPBbkB5Ob4Ub3Bj9JiP/IdARQ4+rC+JIDaah8cOT7k5fpQkOdHWXGfGc/PteaVlfhRXsp2DvdRm+M1lX44HBxn34Yy7lHZZ/bIZ19FWR+KC/qQp3HOr+B4UT6fx+9gi/pzHYNoO/INRvcuwvAkAJLQv2e1Ufjgjg+NkoNNcfSCMPTTwgd2ryZAKzkvmddVnPeBmTO444PQvAjuw7U7F+HR9nlwn92BmXMWUcG/M0qTspOSUvHhh0uwcOFSREREGQW/++4Mo/hZs+ZhxYqPMGPGHLZnYja9IyMjx9xPmzbLrM/OzsWiRcsMmFFRsZMp6PoXQUTEdCM+pddIbFIvcot6kZrVi7hkS9Kze1FY2ouYRGtOQur4uNq6pnFORo61Xm2N5xVzDdvqy3SE2txD4xlsJ6Vb93Y7Mc3azxb1Ryd5cPjAPTzeu5BU8V7IgqfR6ucYAGTxA7tXGmVL8YEjmQRFyl/Fdjj69idwDjMSCZUe3B+P/oZ15r6PcSXI8f596zC0by0B+BgfLFmN//7vvxrrXbJkBRISUrBgwSKjwPT0LKxeHUYwliAmJh5hYZEGmFWr1iIxMcUoeunSlcjMzDHALF68gpQUjmXLGCPoSevWRU8G4MbNIKLiu40yJFJuQcm4QiRZub0oXm8pRXOSM8bH1dY1k3Oy86z1amtcoMWzrb6c/FCbe2g8m22BpHu7nZJp7WeL+uNSPDhy8D5GD6zBkCyY1iorHqhfZlHQx4sJynTLK+QBDVGkFVHNdM5djL5D6Rb1kHa0dqB+qdXeyHgR8pIhAjvKOOI7XoLYlByjbFl9cnK6UdwLL7xkOF1KFTgvMAbIyt944x1DLX/606vG2nX/y1/+FitXrjF0pHsB+fLLfzFrRGGTKOjHBEAK15j61E6nBwkUWzSemO7GkUP3MXKYlk6+l9L6SScKtn2H0wnAkhAAM8cB2BQCRAAcTDH3dlvA2V7Uv2eNBQDvRxkDfK1lmLlguQmqz4oBAuDPf37dKFoU8+abU0y/QNE80ZbWCgAF4Bdf/L2Z//LLr3KPlzB16jNiwPMAkELtPilWAIgSbKVLwfa4DYCAkjK1h5QpheveAFBg7as97LZAEW2ZuWW9yOe46G9MCrlnvgfNh+5htIFBmIHVcLZk6zwEmh0YoFJlwbJ6E4QZcI0HEARZfN/BZMviKYM76AECTIHXeIBixApzP1r7lvGAiQCIekQ1M2fONXyfkpJOz1hK5c8m/awzdCP+F1CJiammLZCyshzGI2bOnEcaWm72UcwQVT2TgiLjuo0SJVKgFKUfL+6X5FEZ6yt7jEVKWVJaQWkPldgDR6F1LVrfg3xyvCw3jSLlbqjuoWVznFK2QWJ5j+bYys4iuBKBpTgyyQMyPGg5rBjAIGwylpmWUMF95Pu+gwzECroMqMGmWMP5dkakABxozjFXiTUvjF6wnEAsDcWFWHP/aOdCeD+pwfuzFxlrldXPnr0A8aoLmIrKwqOj440i33hjigmo77473XiBxsXzr7zyV7z33nQTN5TxaExKF129+upbhtYmecAXXwap9G6jWJsCSsotBdqKcNBaK6hMWb28QQqTBUupUrrp53z1yQu0tri8BwUcsz1DfdqngIqWNxXR4u0xXS2QQ1bP/e3npDk8OCoA9kwIwiEKEQCiHCnw8a5FGDoQh6GWDKPMR/WL8a0KtOZUjOxaghG2hxqsoCzLlwQUhBlHdD+0azk8Z7azWErE9OlzjNVHR8cZSxZ/i2oEgijlRaapsvSXX/6zoR0p2swjcOL8detiTCqqNXPmLMDvf/8Ka4tf4p133vtuACTFBMC+T8umIkvcVLaP2YyTXuIkrztJPU4zL9PBdoraXo65SS9OrmG6WuxGaqbTtLXGrOO8nAInle2kcq227XWydoGSQsBtGtNVWdDBJgXhtaSQDw2FGGERFWixKGhk01R8WTIDHdvX4v62CHhrpqO3ZiYu5E7HzfIF6Cx/Dx0V78K5nTXDvjCms/IkepBJT1kL0JtGWIx5zmxFfHKWoRllNKIcGwAFVAHwl7+8jt+89BssWrwMr73+Nv7y59foCdPM/L+++kaIqjLoCTNM4bV2bYShIKWuig3fSUESpYtj7XQXlXEHqRlXEcV5sUk9iEvqMtfcog4quZupZifWRl5HROwdRCc68VH450hO/xIppJuoBK5J7KB08jmd9JYeWn0PPavbPDcupcc8R/RTXmWBrrYdW2KZBR3afx+P97OaJa2YLMhkQuR30stw/RJ4N7yNmpJs1G6qQWlxAeqqy9l2ID9+NTYUpmFbYSpqaypxemcm64mVlicRhD5lUfWMAaQ2uxB7b8YC/OxnLxqlS5lKL6V48XxMTCLC1q5BTGwUCtZXITohHalpOSgpKkJ19RZUFeeaua+99jY9ZLUJ1FOnTjd7KANaupTJw3eloRLxs32fkhnEio92YNXKMBSuP0HF7UR+6X4UlzZRGsn9jYiPu4CKmj3YseMICgobkJK9kVxfhdKSfSgo2o+YlL2IT6qnhR8hFe3F+qoWlJY1Iq9wB8rKbtDSvQYAUZ88YZIH7L+HbxsVhGcZfh/aOtfUAYGWXAyyEPNvnov7lXNxc2sUbmyNxdc1i/FV1WJ01C3G19ticXs7ZWcCeprSMNAQYSrkwW1zTYakTGiQ+z3aOosesA0znirEREPTp882lBQbm0irfg9vkd9Xs8J95ZXX8dfXp2DFshX0jNcwfdoMk+n8x3+8YMBTpaxMSPHhpz/9Jalq6ndnQU8DkJTuobV/hvyiZpSUnYcj9ySSs04jJ7cFFVWXkF14AilpN5GWeQyFxaeQW0DlVl6md5xDNufkczw5+wqSM8+htOIM0h1HqegTqK46ibz8ZjjybhEst4kjCtJ6toNxQLFFQTq7wEpDH7WQqxVE90UYy1UBFmjONtdBppaju5Zi+FA8ho9mY3TPSozsXY3hpihzQGfFAHpNY5SJAUpFJYEjWSYQ636Y9YT77E4sXPqRUayoZvny1cailXaKz0Uhr776pqkJFjKgzmGQVvWbxgJt4cJliIyMNUFb2VBycpo5hlAQzssrNH1xcUwYvq8H2BSUkCrK8FA5XsPnqdke0o6bFutlDHAxe/GQz10UL5XoZvD0UoEuBlQ3rd3DAOthn9vEkcJSJ5XqJcVpDdtlHgZll8mUFHyVfdVu7sGGGutemZGjyINTrXfxePeHGGa6OESuVtAd2jrbKE4BVGdB1pnPOtYGmQSEWQ6DarCJWU5DdCh9nYcgK+MBHUXQ+jXfZECcK28a2TwNvrYKrIqIN1asDCciIpr8vdgoXB4hZSoDUoCVQpXVKM1UqvpnxgJVvkpLZemLFi03h3dvvfUuFZ9gABWYkzzgOgFYF9uNBCnbKJzBkFmKSQ+VodAyZY01m3pMpiLFqC3llFdZmZGowgZMaaZ4XPO0l/o0rgxJqayOJdSvqyxee9rroxOYutb0mL3teZEJHnzSSgrat9g6C2LwtJWmHH7gYxZW7FeKquJMFq2TUAMUA3T/blbQpjKeyQIuBBaVbU5O6U2KJQrCoxunsBArxfR5S43CZfFKL+PiEk0mo/uMjGwDio4jRE2ap4p3yZKVzHJ+wcCr6niKOZgTOK+//o7JmpSyqhqeMWPuZABu3grS6rtNKmhLSYWlMKWWAqKICpHypFxxtURcvZ4AaJ4UZXuP5ojL11O5dr+udtoqZatP11I+RwDY81SkCQBlQ/Y8xQALAB3GMXuhshU4lQlZJ5qMDQRF4IiiLADoKZves+boKHqjgi7HdfRAUFQjKA7oPEgBXettAGbMX26sXcWYshdZurhcxw1r166jUt+mB/wJ4eGRpk4QMGlpmSZIS9EKvBKlqRoXDYmWFEcE5sDTfxsqABJTu40lTxQpRldZsyxeuXtsqBKWSFkqvgSSbcESAaA+KVHtiQCUVjzpAQJqogeozwbArrqjEi0AHpsgrCPm2dYRguiHNYDF4fQIthUb+g6lUqlWqmrFiyTo7H9ARxfk/7798SZu6BBORZrm9DMVHd61DJ5TGzHng+WGYnTErIM2KVbeYB8xvMpUU0FaniBK0mGbFPzaa2+Zw7u//vVNo3it+8lPXjABWHHiJz/5mQFjeHjY6P2JGPB0GiqR8nWVskRDE8+CbAsuYbFVVEYayumh51giPs8vEY1YytY8nYjKs1TMmWo65EEV1ZM9oLK2xzxLfQIzJpkAtLEOOBhmrFX8b86EqDhzonkoDUFyv+F/Kt/XVm4O4HROFDiabzIdQ1VUsu51JD2sKlr3OsI2GRWBrV9qKuG1EbFjx8kqqKRkBV6llgqy06bNpBdMMYr/xS9+E4oHq0zaqiMKzZW1r1z5Eb3mLwYAxQlRlU5DnwnA00FYIgDsmGADYCtFonsBoExF86VQiehJyq5lzKiu60HVxh6j1LqtPdi5y2ornsjSt33cY4KuqKmCdLae1+3s+3gP52/pwSauqd7sxoUzdzG6e+JxNPle1azxBObxpjpmiqrDOB0t68iClCNly1M0X7QUbIw1c0RlOiMyKS3n6SxpWEcRpzdh9vwl5PCXjWJlxcpm7PcBOuMR/y9atNTk9uqTgnX0oCpXoChzioyMMWPymnfeeZ8x5AOTSWkf+79e+7sAyPJ1bCD+FxDKihRw07Jo5SykJKqQFRdEN7YFJ1IEjgBQgNVxghHO0T46cCtlv8Z0XqQzJYErsbIeK6irX1fRXyozqwMNpKCGUBA2L2SmW3xPD1BF/MRhXMOEw7jtrJx12EaAtNZwvgDg/ACzJftdgIklzJg8n25hHbBwrA5QDFDmYp+GLl+uFPW1MWUq11cMkKcoyIqidCyhQzh5jjKfuXM/NB6gGKK+SQBcvRHE6ogugtAzJpGU5ExWvKxSVfGmU9m5hT0Ijxmfo3tHYTcLsx5mUeP90YkWDeUVaU4v1sVZEh5tnSvlcJ/MvB6ERY2PRXCe9snK62Y1/WR/ZKIAuINv62fjUdXrGKp5G8PVb6I/FGCD4nfSyMC2+SYjCu4Jw1DtFHPCKXoZIM0M6b0v1wT1BoxxRPd9jQSDXmPNnYKRje/Ac7IS789cQDrRYdxLhsuVVv77v/+UxdXPjVUrAOteGY9oR4WWPOXf/u0nBhDFDmVCKuJUfImOtMd//ufPTd8kAB48DGLztm7SQ+8TsntfL3bUW7J7by/2H+olPYyP6159exutOXb/x7t7sYvzGw882a/5+5p6ceTo5L00b0+DNW732f07drlw/kw7Bs9UIHisAH2tReg7XojA6RpKHfxntyFwqopSDf+ndfCd/xiBTyop7OMctX0X6nndCe/lQ/Bd3GP6vJcOoK+txOwl6W8thPvaUVTXbkZOTh4cjjzU1tZRNpnXiurbunU7iopKzX1VVQ1SUzM4xnkbN5GGkk1fWVkFr7UoL680+X9JyXr2lZtaobx8w2QArP/EUf+RnP77x/8fxfpu+tq6+38tP/QzPDyAR0ODGP32MR49fozREeu/yHz82PpvM80n9L+2j7Jv9LH6gP8Lp68PcRxkurEAAAAASUVORK5CYII='
    },
    $scheme: {
        series: {
	        render: 'group',
	        name: 'Серии',
            collapsible: true,
            multiple: true,
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

	    refresh: function(opts){
            if(!$base(opts)){
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
                        autoSize: seriesContext[i].find('autoSize').checked(),
                        isSum: seriesContext[i].find('isSum').checked(),
                        skipEmptyNamedGroups: seriesContext[i].find('skipEmptyNamedGroups').checked()
                    });
                }
            }

            if(!this._resolvePointFilters(this._schemeOpts.bindings)){
                return;
            }

            var widgetOpts = this._widgetOpts ? undefined : { styleScheme: this.getContext().find('chart colorScheme').value() };

            this.getElement().loader();

            var data = {},
                colorCount = 0;

            try {
                function fetch(isReset){
                    $this.fetch($this._dataSource, { batchSize: 100, reset: isReset, widgetOpts: isReset ? widgetOpts : undefined }, function(res, fail, serverWidgetOpts){
                        if(fail || res.length === 0){
                            resultProcessing();
                            return;
                        }

                        if(serverWidgetOpts){
                            $this._widgetOpts = serverWidgetOpts;
                        }

                        while($this._dataSource.next()){
                            var curCat = data;

                            for(var i = 0; i < $this._schemeOpts.series.length; i++){
                                var name = $this._schemeOpts.series[i].nameSelector.value(),
                                    value = $this._schemeOpts.series[i].dataSelector.value();

                                if($this._schemeOpts.series[i].skipEmptyNamedGroups && name.length === 0){
                                    break;
                                }

                                var id = name + '_' + i;

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
                                            value: $this._schemeOpts.series[i].autoSize ? 0 : value
                                        }
                                    };

                                    i === 0 && colorCount++;
                                }

                                curCat = curCat[name].child;
                            }
                        }

                        fetch();
                    });
                }

                function resultProcessing(){
                    function resolveData(arr, data, parent){
                        if(!data){
                            return;
                        }

                        for(var i in data){
                            data[i].chartOpts.parent = parent;

                            arr.push(data[i].chartOpts);

                            resolveData(arr, data[i].child, data[i].chartOpts.id);
                        }
                    }

                    var seriesData = [];
                    resolveData(seriesData, data);

                    if(opts && opts.isCacheMod){
                        $this.storeCache(seriesData);
                    }

                    $this.buildChart(seriesData);

                    $this.getElement().loader('hide');
                }

                fetch(true);
            } catch (ex){
                console.log('TreemapChart load data exception');
                console.log(ex);
                $this.getElement().loader('hide');
            }
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