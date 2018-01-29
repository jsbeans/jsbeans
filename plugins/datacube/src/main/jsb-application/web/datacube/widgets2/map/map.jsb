{
	$name: 'DataCube.Widgets.LeafletMap',
	$parent: 'DataCube.Widgets.Widget',
    $expose: {
        name: 'Карта',
        description: '',
        category: 'Карты',
        icon: `data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiIHN0YW5kYWxvbmU9Im5vIj8+DQo8IS0tIEdlbmVyYXRvcjogQWRvYmUgSWxsdXN0cmF0b3IgMTkuMC4wLCBTVkcgRXhwb3J0IFBsdWctSW4gLiBTVkcgVmVyc2lvbjogNi4wMCBCdWlsZCAwKSAgLS0+DQoNCjxzdmcNCiAgIHhtbG5zOmRjPSJodHRwOi8vcHVybC5vcmcvZGMvZWxlbWVudHMvMS4xLyINCiAgIHhtbG5zOmNjPSJodHRwOi8vY3JlYXRpdmVjb21tb25zLm9yZy9ucyMiDQogICB4bWxuczpyZGY9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkvMDIvMjItcmRmLXN5bnRheC1ucyMiDQogICB4bWxuczpzdmc9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIg0KICAgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIg0KICAgeG1sbnM6c29kaXBvZGk9Imh0dHA6Ly9zb2RpcG9kaS5zb3VyY2Vmb3JnZS5uZXQvRFREL3NvZGlwb2RpLTAuZHRkIg0KICAgeG1sbnM6aW5rc2NhcGU9Imh0dHA6Ly93d3cuaW5rc2NhcGUub3JnL25hbWVzcGFjZXMvaW5rc2NhcGUiDQogICB2ZXJzaW9uPSIxLjEiDQogICBpZD0iTGF5ZXJfMSINCiAgIHg9IjBweCINCiAgIHk9IjBweCINCiAgIHZpZXdCb3g9IjAgMCAyMCAyMCINCiAgIHhtbDpzcGFjZT0icHJlc2VydmUiDQogICBpbmtzY2FwZTp2ZXJzaW9uPSIwLjkxIHIxMzcyNSINCiAgIHNvZGlwb2RpOmRvY25hbWU9Im1hcHMtYW5kLWZsYWdzLnN2ZyINCiAgIHdpZHRoPSIyMCINCiAgIGhlaWdodD0iMjAiPjxtZXRhZGF0YQ0KICAgICBpZD0ibWV0YWRhdGE1NSI+PHJkZjpSREY+PGNjOldvcmsNCiAgICAgICAgIHJkZjphYm91dD0iIj48ZGM6Zm9ybWF0PmltYWdlL3N2Zyt4bWw8L2RjOmZvcm1hdD48ZGM6dHlwZQ0KICAgICAgICAgICByZGY6cmVzb3VyY2U9Imh0dHA6Ly9wdXJsLm9yZy9kYy9kY21pdHlwZS9TdGlsbEltYWdlIiAvPjxkYzp0aXRsZT48L2RjOnRpdGxlPjwvY2M6V29yaz48L3JkZjpSREY+PC9tZXRhZGF0YT48ZGVmcw0KICAgICBpZD0iZGVmczUzIiAvPjxzb2RpcG9kaTpuYW1lZHZpZXcNCiAgICAgcGFnZWNvbG9yPSIjZmZmZmZmIg0KICAgICBib3JkZXJjb2xvcj0iIzY2NjY2NiINCiAgICAgYm9yZGVyb3BhY2l0eT0iMSINCiAgICAgb2JqZWN0dG9sZXJhbmNlPSIxMCINCiAgICAgZ3JpZHRvbGVyYW5jZT0iMTAiDQogICAgIGd1aWRldG9sZXJhbmNlPSIxMCINCiAgICAgaW5rc2NhcGU6cGFnZW9wYWNpdHk9IjAiDQogICAgIGlua3NjYXBlOnBhZ2VzaGFkb3c9IjIiDQogICAgIGlua3NjYXBlOndpbmRvdy13aWR0aD0iMTkyMCINCiAgICAgaW5rc2NhcGU6d2luZG93LWhlaWdodD0iMTE3OCINCiAgICAgaWQ9Im5hbWVkdmlldzUxIg0KICAgICBzaG93Z3JpZD0iZmFsc2UiDQogICAgIGlua3NjYXBlOnpvb209IjI5LjUiDQogICAgIGlua3NjYXBlOmN4PSI2LjIyMzYwODciDQogICAgIGlua3NjYXBlOmN5PSIxMC40MDI2MzgiDQogICAgIGlua3NjYXBlOndpbmRvdy14PSIxOTEyIg0KICAgICBpbmtzY2FwZTp3aW5kb3cteT0iLTgiDQogICAgIGlua3NjYXBlOndpbmRvdy1tYXhpbWl6ZWQ9IjEiDQogICAgIGlua3NjYXBlOmN1cnJlbnQtbGF5ZXI9IkxheWVyXzEiIC8+PGcNCiAgICAgaWQ9Imc0MTk5Ig0KICAgICB0cmFuc2Zvcm09Im1hdHJpeCgwLjAzOTAyOTI2LDAsMCwwLjAzOTAyOTI2LDAuMDAxOTIxOTQsMTkuMjIyMjUxKSI+PHBvbHlnb24NCiAgICAgICB0cmFuc2Zvcm09InRyYW5zbGF0ZSgwLC00OTIpIg0KICAgICAgIGlkPSJwb2x5Z29uMyINCiAgICAgICBwb2ludHM9IjM3OS44Nyw0NTkuNjk4IDM0Ni44MzcsMjc0LjI4OCAzNzkuODcsODguODc5IDUwMy43NCwxMzIuOTIyIDUwMy43NCw1MDMuNzQxICINCiAgICAgICBzdHlsZT0iZmlsbDojZmVlMTkxIiAvPjxwb2x5Z29uDQogICAgICAgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoMCwtNDkyKSINCiAgICAgICBpZD0icG9seWdvbjUiDQogICAgICAgcG9pbnRzPSIyNTUuOTk5LDUwMy43NDEgMjMzLjk3NywzMTguMzMxIDI1NS45OTksMTMyLjkyMiAzNzkuODcsODguODc5IDM3OS44Nyw0NTkuNjk4ICINCiAgICAgICBzdHlsZT0iZmlsbDojZmZkMjRkIiAvPjxwb2x5Z29uDQogICAgICAgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoMCwtNDkyKSINCiAgICAgICBpZD0icG9seWdvbjciDQogICAgICAgcG9pbnRzPSIxMzIuMTI4LDQ1OS42OTggOTkuMDk2LDI3NC4yODggMTMyLjEyOCw4OC44NzkgMjU1Ljk5OSwxMzIuOTIyIDI1NS45OTksNTAzLjc0MSAiDQogICAgICAgc3R5bGU9ImZpbGw6I2ZlZTE5MSIgLz48cG9seWdvbg0KICAgICAgIHRyYW5zZm9ybT0idHJhbnNsYXRlKDAsLTQ5MikiDQogICAgICAgaWQ9InBvbHlnb245Ig0KICAgICAgIHBvaW50cz0iMTMyLjEyOCw4OC44NzkgMTMyLjEyOCw0NTkuNjk4IDguMjU3LDUwMy43NDEgOC4yNTcsMTMyLjkyMiAiDQogICAgICAgc3R5bGU9ImZpbGw6I2ZmZDI0ZCIgLz48cGF0aA0KICAgICAgIGlua3NjYXBlOmNvbm5lY3Rvci1jdXJ2YXR1cmU9IjAiDQogICAgICAgaWQ9InBhdGgxMSINCiAgICAgICBkPSJtIDQyOS44MTUsLTM3MS44NjIgYyAwLDg5LjU4NyAtMTAxLjEzNiwxNzIuNTU3IC0xMDEuMTM2LDE3Mi41NTcgLTUuOTA5LDQuODQ4IC0xNS41OCw0Ljg0OCAtMjEuNDksMCAwLDAgLTEwMS4xMzYsLTgyLjk3IC0xMDEuMTM2LC0xNzIuNTU3IDAsLTYxLjc5IDUwLjA5MSwtMTExLjg4IDExMS44OCwtMTExLjg4IDYxLjc4OSwwIDExMS44ODIsNTAuMDkxIDExMS44ODIsMTExLjg4IHoiDQogICAgICAgc3R5bGU9ImZpbGw6I2YxNDc0MiIgLz48cGF0aA0KICAgICAgIGlua3NjYXBlOmNvbm5lY3Rvci1jdXJ2YXR1cmU9IjAiDQogICAgICAgaWQ9InBhdGgxMyINCiAgICAgICBkPSJtIDMxNy45MzQsLTMxNS41NzQgYyAtMzEuMDM3LDAgLTU2LjI4OCwtMjUuMjUxIC01Ni4yODgsLTU2LjI4OCAwLC0zMS4wMzcgMjUuMjUxLC01Ni4yODcgNTYuMjg4LC01Ni4yODcgMzEuMDM3LDAgNTYuMjg4LDI1LjI1MSA1Ni4yODgsNTYuMjg4IDAsMzEuMDM3IC0yNS4yNTEsNTYuMjg3IC01Ni4yODgsNTYuMjg3IHoiDQogICAgICAgc3R5bGU9ImZpbGw6I2ZmZmZmZiIgLz48cGF0aA0KICAgICAgIGlua3NjYXBlOmNvbm5lY3Rvci1jdXJ2YXR1cmU9IjAiDQogICAgICAgc3R5bGU9ImZpbGw6IzU1NDQwMCINCiAgICAgICBpZD0icGF0aDE1Ig0KICAgICAgIGQ9Im0gNTA2LjUwNywtMzY2Ljg2MiAtNDAuMzM2LC0xNC4zNDEgYyAtNC4yOTYsLTEuNTMyIC05LjAxOSwwLjcxNiAtMTAuNTQ3LDUuMDE0IC0xLjUyOCw0LjI5OSAwLjcxNyw5LjAxOSA1LjAxNCwxMC41NDcgbCAzNC44NDUsMTIuMzg5IDAsMzUzLjI5MyAtMTA3LjM1NSwtMzguMTcgMCwtMTY0LjMzNyBjIDAsLTQuNTYyIC0zLjY5NywtOC4yNTggLTguMjU4LC04LjI1OCAtNC41NjEsMCAtOC4yNTgsMy42OTYgLTguMjU4LDguMjU4IGwgMCwxNjQuMzM3IC0xMDcuMzU1LDM4LjE3IDAsLTIwMi41MDIgYyAwLC00LjU2MiAtMy42OTcsLTguMjU4IC04LjI1OCwtOC4yNTggLTQuNTYxLDAgLTguMjU4LDMuNjk2IC04LjI1OCw4LjI1OCBsIDAsMjAyLjUwMiAtMTA3LjM1NSwtMzguMTcgMCwtMjg3LjkxOCBjIDAsLTQuNTYyIC0zLjY5NywtOC4yNTggLTguMjU4LC04LjI1OCAtNC41NjEsMCAtOC4yNTgsMy42OTYgLTguMjU4LDguMjU4IGwgMCwyODcuOTE4IC0xMDcuMzUzLDM4LjE3IDAsLTM1My4yOTMgMTA3LjM1NSwtMzguMTcxIDAsMzIuMzQzIGMgMCw0LjU2MiAzLjY5Nyw4LjI1OCA4LjI1OCw4LjI1OCA0LjU2MSwwIDguMjU4LC0zLjY5NiA4LjI1OCwtOC4yNTggbCAwLC0zMi4zNDMgMzAuODAzLDEwLjk1MSBjIDQuMjk3LDEuNTMyIDkuMDIsLTAuNzE2IDEwLjU0NywtNS4wMTQgMS41MjgsLTQuMjk3IC0wLjcxNywtOS4wMTkgLTUuMDE0LC0xMC41NDcgbCAtNDEuODI2LC0xNC44NzEgYyAtMC4wMjQsLTAuMDA5IC0wLjA1LC0wLjAxMSAtMC4wNzMsLTAuMDIgLTAuMzk1LC0wLjEzNyAtMC44MDQsLTAuMjQ0IC0xLjIyMywtMC4zMiAtMC4wNjMsLTAuMDExIC0wLjEyNiwtMC4wMTkgLTAuMTg3LC0wLjAyOSAtMC40MTgsLTAuMDY2IC0wLjg0NSwtMC4xMSAtMS4yODMsLTAuMTEgbCAwLDAgLTAuMDAyLDAgYyAtMC40MzcsMCAtMC44NjIsMC4wNDQgLTEuMjgxLDAuMTA5IC0wLjA2NCwwLjAxIC0wLjEyNywwLjAxOCAtMC4xODksMC4wMjkgLTAuNDE5LDAuMDc2IC0wLjgyNywwLjE4NCAtMS4yMjIsMC4zMiAtMC4wMjQsMC4wMDkgLTAuMDUsMC4wMTEgLTAuMDczLDAuMDIgTCA1LjQ5MywtMzY2Ljg2MyBjIC0zLjI5MiwxLjE3IC01LjQ5MSw0LjI4NiAtNS40OTEsNy43OCBsIDAsMzcwLjgyNCBjIDAsMi42ODQgMS4zMDQsNS4yIDMuNDk2LDYuNzQ3IDIuMTkzLDEuNTQ2IDUuMDAxLDEuOTM2IDcuNTI4LDEuMDMzIEwgMTMyLjEzLC0yMy41MzggMjUzLjIzNCwxOS41MjEgYyAwLjAyNCwwLjAwOSAwLjA1LDAuMDExIDAuMDc0LDAuMDIgMC4zOTUsMC4xMzcgMC44MDMsMC4yNDQgMS4yMjIsMC4zMTkgMC4wNjMsMC4wMTIgMC4xMjcsMC4wMiAwLjE4OSwwLjAyOSAwLjQxOCwwLjA2NiAwLjg0NSwwLjExIDEuMjgyLDAuMTEgMC40MzcsMCAwLjg2MywtMC4wNDQgMS4yODIsLTAuMTEgMC4wNjMsLTAuMDEgMC4xMjcsLTAuMDE4IDAuMTg5LC0wLjAyOSAwLjQxOSwtMC4wNzUgMC44MjcsLTAuMTgzIDEuMjIyLC0wLjMxOSAwLjAyNCwtMC4wMDkgMC4wNSwtMC4wMTEgMC4wNzQsLTAuMDIgbCAxMjEuMTA0LC00My4wNTkgMTIxLjEwNCw0My4wNTkgYyAwLjkwMSwwLjMyIDEuODM1LDAuNDc4IDIuNzY2LDAuNDc4IDEuNjg0LDAgMy4zNTEsLTAuNTE1IDQuNzYyLC0xLjUxMSAyLjE5MiwtMS41NDcgMy40OTYsLTQuMDYzIDMuNDk2LC02Ljc0NyBsIDAsLTM3MC44MjIgYyAtMTBlLTQsLTMuNDk0IC0yLjIwMSwtNi42MTEgLTUuNDkzLC03Ljc4MSB6IiAvPjxwYXRoDQogICAgICAgaW5rc2NhcGU6Y29ubmVjdG9yLWN1cnZhdHVyZT0iMCINCiAgICAgICBzdHlsZT0iZmlsbDojODAwMDAwIg0KICAgICAgIGlkPSJwYXRoMTciDQogICAgICAgZD0ibSAzMDEuOTUyLC0xOTIuOTIxIGMgNC40ODEsMy42NzggMTAuMjMxLDUuNTE1IDE1Ljk4Myw1LjUxNSA1Ljc1LDAgMTEuNTAyLC0xLjgzOSAxNS45ODIsLTUuNTE0IDEuMDYsLTAuODcgMjYuMjY0LC0yMS42NzggNTEuODA1LC01My45NDMgMzQuNzM4LC00My44ODMgNTIuMzUsLTg1Ljk0IDUyLjM1LC0xMjQuOTk4IEMgNDM4LjA3MywtNDM4LjEwNyAzODQuMTc5LC00OTIgMzE3LjkzNSwtNDkyIGMgLTY2LjI0NCwwIC0xMjAuMTM5LDUzLjg5MyAtMTIwLjEzOSwxMjAuMTM4IDAsMzkuMDU5IDE3LjYxNCw4MS4xMTUgNTIuMzUxLDEyNC45OTggMjUuNTQxLDMyLjI2NiA1MC43NDUsNTMuMDczIDUxLjgwNSw1My45NDMgeiBtIDE1Ljk4MywtMjgyLjU2MyBjIDU3LjEzOCwwIDEwMy42MjIsNDYuNDg1IDEwMy42MjIsMTAzLjYyMiAwLDg0LjU3OCAtOTcuMTM3LDE2NS4zNjggLTk4LjExNiwxNjYuMTczIC0yLjg4NCwyLjM2MyAtOC4xMzMsMi4zNjUgLTExLjAxMiwwLjAwMSAtMC45ODEsLTAuODA2IC05OC4xMTgsLTgxLjU5NSAtOTguMTE4LC0xNjYuMTc0IDAuMDAxLC01Ny4xMzcgNDYuNDg2LC0xMDMuNjIyIDEwMy42MjQsLTEwMy42MjIgeiIgLz48cGF0aA0KICAgICAgIGlua3NjYXBlOmNvbm5lY3Rvci1jdXJ2YXR1cmU9IjAiDQogICAgICAgc3R5bGU9ImZpbGw6IzgwMDAwMCINCiAgICAgICBpZD0icGF0aDE5Ig0KICAgICAgIGQ9Im0gMzgyLjQ4LC0zNzEuODYyIGMgMCwtMzUuNTkxIC0yOC45NTUsLTY0LjU0NiAtNjQuNTQ2LC02NC41NDYgLTM1LjU5MSwwIC02NC41NDYsMjguOTU1IC02NC41NDYsNjQuNTQ2IDAsMzUuNTkxIDI4Ljk1NSw2NC41NDYgNjQuNTQ2LDY0LjU0NiAzNS41OTEsMCA2NC41NDYsLTI4Ljk1NCA2NC41NDYsLTY0LjU0NiB6IG0gLTExMi41NzYsMCBjIDAsLTI2LjQ4NCAyMS41NDYsLTQ4LjAzIDQ4LjAzLC00OC4wMyAyNi40ODMsMCA0OC4wMywyMS41NDYgNDguMDMsNDguMDMgMCwyNi40ODQgLTIxLjU0Niw0OC4wMyAtNDguMDMsNDguMDMgLTI2LjQ4MywwIC00OC4wMywtMjEuNTQ2IC00OC4wMywtNDguMDMgeiIgLz48L2c+PGcNCiAgICAgaWQ9ImcyMSINCiAgICAgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoMCwtNDkyKSIgLz48Zw0KICAgICBpZD0iZzIzIg0KICAgICB0cmFuc2Zvcm09InRyYW5zbGF0ZSgwLC00OTIpIiAvPjxnDQogICAgIGlkPSJnMjUiDQogICAgIHRyYW5zZm9ybT0idHJhbnNsYXRlKDAsLTQ5MikiIC8+PGcNCiAgICAgaWQ9ImcyNyINCiAgICAgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoMCwtNDkyKSIgLz48Zw0KICAgICBpZD0iZzI5Ig0KICAgICB0cmFuc2Zvcm09InRyYW5zbGF0ZSgwLC00OTIpIiAvPjxnDQogICAgIGlkPSJnMzEiDQogICAgIHRyYW5zZm9ybT0idHJhbnNsYXRlKDAsLTQ5MikiIC8+PGcNCiAgICAgaWQ9ImczMyINCiAgICAgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoMCwtNDkyKSIgLz48Zw0KICAgICBpZD0iZzM1Ig0KICAgICB0cmFuc2Zvcm09InRyYW5zbGF0ZSgwLC00OTIpIiAvPjxnDQogICAgIGlkPSJnMzciDQogICAgIHRyYW5zZm9ybT0idHJhbnNsYXRlKDAsLTQ5MikiIC8+PGcNCiAgICAgaWQ9ImczOSINCiAgICAgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoMCwtNDkyKSIgLz48Zw0KICAgICBpZD0iZzQxIg0KICAgICB0cmFuc2Zvcm09InRyYW5zbGF0ZSgwLC00OTIpIiAvPjxnDQogICAgIGlkPSJnNDMiDQogICAgIHRyYW5zZm9ybT0idHJhbnNsYXRlKDAsLTQ5MikiIC8+PGcNCiAgICAgaWQ9Imc0NSINCiAgICAgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoMCwtNDkyKSIgLz48Zw0KICAgICBpZD0iZzQ3Ig0KICAgICB0cmFuc2Zvcm09InRyYW5zbGF0ZSgwLC00OTIpIiAvPjxnDQogICAgIGlkPSJnNDkiDQogICAgIHRyYW5zZm9ybT0idHJhbnNsYXRlKDAsLTQ5MikiIC8+PC9zdmc+`,
        thumb: 'data:image/png;base64,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'
    },
    $scheme: {
        dataSource: {
            render: 'sourceBinding',
            name: 'Источник данных',
            description: 'Укажите источник данных'
        },
        regions: {
         render: 'group',
         name: 'Регионы',
         collapsable: true,
         multiple: true,
         description: 'Укажите регионы',
         items: {
             item: {
                 render: 'group',
                 name: 'Серия',
                 items: {
                     region: {
                         render: 'dataBinding',
                         name: 'Имя региона или поле для сопоставления',
                         linkTo: 'dataSource'
                     },
                     value: {
                         render: 'dataBinding',
                         name: 'Значения',
                         linkTo: 'dataSource'
                     },
                     geojsonMap: {
                         render: 'select',
                         name: 'GeoJson-карта',
                         items: {
                             russianRegions: {
                                 name: 'Карта регионов России'
                             },
                             russianRegionsMPT: {
                                 name: 'Карта регионов России MPT'
                             },
                             worldCountries: {
                                name: 'Карта мира'
                             }
                         }
                     },
                     compareTo: {
                         render: 'select',
                         name: 'Сопоставление по',
                         linkTo: 'geojsonMap',
                         itemsGroups: {
                             russianRegions: {
                                 forFields: ['russianRegions', 'russianRegionsMPT'],
                                 items: {
                                     NAME_1: {
                                         name: 'Имя региона'
                                     },
                                     KONST_NUM: {
                                         name: 'Номер по конституции'
                                     },
                                     OKTMO: {
                                         name: 'Код OKTMO'
                                     },
                                     ISO: {
                                         name: 'Код ISO'
                                     }
                                 }
                             },
                             worldCountries: {
                                 forFields: ['worldCountries'],
                                 items: {
                                     ru_name: {
                                         name: 'Название страны'
                                     },
                                     id: {
                                         name: 'Код ISO'
                                     }
                                 }
                             }
                         }
                     },
                     fillColor: {
                        render: 'select',
                        name: 'Цвет заливки',
                        items: {
                            simpleColor: {
                                name: 'Единый цвет',
                                items: {
                                    color: {
                                        render: 'item',
                                        name: 'Цвет',
                                        editor: 'color'
                                    }
                                }
                            },
                            rangeColor: {
                                name: 'Диапазон цветов',
                                items: {
                                    startColor: {
                                        render: 'item',
                                        name: 'Начальный цвет',
                                        editor: 'color'
                                    },
                                    endColor: {
                                        render: 'item',
                                        name: 'Конечный цвет',
                                        editor: 'color'
                                    },
                                    functionType: {
                                        render: 'select',
                                        name: 'Функция вычисления цвета',
                                        items: {
                                            linear: {
                                                name: 'Линейная'
                                            },
                                            logarithmic: {
                                                name: 'Логарифмическая'
                                            },
                                            quadratic: {
                                                name: 'Квадратичная'
                                            }
                                        }
                                    }
                                }
                            },
                            sourceColor: {
                                 render: 'dataBinding',
                                 name: 'Цвет из источника',
                                 linkTo: 'dataSource'
                            }
                        }
                     },
                     defaultColor: {
                        render: 'item',
                        name: 'Цвет заливки регионов без данных',
                        editor: 'color'
                     },
                     borderColor: {
                        render: 'item',
                        name: 'Цвет границ регионов',
                        editor: 'color'
                     },
                     borderWidth: {
                        render: 'item',
                        name: 'Толщина границы'
                     },
                     showValuesPermanent: {
                        render: 'item',
                        name: 'Показывать значения на регионах',
                        optional: true,
                        editor: 'none'
                     },
                     showEmptyRegions: {
                        render: 'item',
                        name: 'Показывать регионы без значений',
                        optional: true,
                        editor: 'none'
                     },
                     selectedRegion: {
                         render: 'group',
                         name: 'Выделенные регион',
                         items: {
                            selectColor: {
                                render: 'item',
                                name: 'Цвет заливки регионов',
                                editor: 'color'
                            },
                            selectBorderColor: {
                                render: 'item',
                                name: 'Цвет границ регионов',
                                editor: 'color'
                            }
                         }
                     }
                 }
             }
         }
        },
        tileMaps: {
         render: 'group',
         name: 'Tile-карты',
         items: {
             serverUrl: {
                 render: 'select',
                 name: 'Сервер карт',
                 items: {
                     sputnik: {
                         name: 'Спутник.ру'
                     },
                     openstreetmap: {
                         name: 'Openstreetmap.org'
                     },
                     cartocdn: {
                         name: 'Cartocdn.com'
                     },
                     stamen: {
                         name: 'Stamen.com'
                     },
                     custom: {
                         name: 'Свой',
                         items: {
                             customServer: {
                                 render: 'item',
                                 name: 'Url-адрес'
                             }
                         }
                     }
                 }
             }
         }
        }
    },
    $client: {
        $require: ['JSB.Utils.Rainbow', 'JQuery.UI.Loader', 'JSB.Crypt.MD5'],

        $constructor: function(opts){
            $base(opts);

            this.container = this.$('<div class="container"></div>');
            this.append(this.container);

            this.addClass('mapWidget');
            this.loadCss('map.css');

            JSB.loadCss('tpl/leaflet/leaflet.css');
            JSB.loadScript('tpl/leaflet/leaflet.js', function(){
                $this.setInitialized();
            });

            $this.getElement().resize(function(){
                JSB.defer(function(){
                    if(!$this.getElement().is(':visible') || !$this.map){
                        return;
                    }
                    $this.map.invalidateSize();
                }, 300, 'hcResize' + $this.getId());
            });
        },

        // inner variables
        _curFilters: {},
        _isMapsLoaded: false,
        _isDataLoaded: false,
        _maps: [],
        _mapHash: null,

        refresh: function(opts){
            // if filter source is current widget
            if(opts && this == opts.initiator){
                return;
            }

            // widget settings editor set style changes
            if(opts && opts.refreshFromCache){
                return;
            }

            var dataSource = this.getContext().find('dataSource');
            if(!dataSource.hasBinding()){
                return;
            }

            $base();

            // advanced filters
            //var globalFilters = dataSource.getFilters(),
            var regionsContext = this.getContext().find('regions').getItems();
/*
            if(globalFilters){
                var bindings = [],
                    newFilters = {};

                for(var i = 0; i < regionsContext.length; i++){
                    bindings.push(regionsContext[i].find('region').binding()[0]);
                }

                for(var i in globalFilters){
                    var cur = globalFilters[i];

                    for(var j = 0; j < bindings.length; j++){
                        if(cur.field === bindings[j] && cur.op === '$eq'){
                            if(!this._curFilters[cur.value]){
                                this._curFilters[cur.value] = cur.id;
                                this._selectFeature(cur.value);
                            }

                            newFilters[cur.value] = true;

                            delete globalFilters[i];
                        }
                    }
                }

                for(var i in this._curFilters){
                    if(!newFilters[i]){
                        this._deselectFeature(i);
                        delete this._curFilters[i];
                    }
                }

                if(Object.keys(globalFilters).length > 0 && this.createFilterHash(globalFilters) === this._curFilterHash || Object.keys(globalFilters).length === 0 && !this._curFilterHash){
                    return;
                } else {
                    this._curFilterHash = Object.keys(globalFilters).length > 0 ? this.createFilterHash(globalFilters) : undefined;
                    dataSource.setFilters(globalFilters);
                }
            } else {
                if(Object.keys(this._curFilters).length > 0){
                    for(var i in this._curFilters){
                        this._deselectFeature(i);
                    }
                    this._curFilters = {};
                    return;
                }
                this._curFilterHash = null;
            }
*/
debugger;
            try{
                var regionsColors = [],
                    maps = [],
                    newMapHash = '';

                for(var i = 0; i < regionsContext.length; i++){
                    var colorSelector = regionsContext[i].find('color').value();
                    switch(colorSelector.key()){
                        case 'simpleColor':
                            regionsColors[i] = {
                                simpleColor: colorSelector.value().value()
                            }
                            break;
                        case 'rangeColor':
                            regionsColors[i] = {
                                rangeColor: {
                                    startColor: colorSelector.find('startColor').value(),
                                    endColor: colorSelector.find('endColor').value(),
                                    functionType: colorSelector.find('functionType').value().key()
                                }
                            }
                            break;
                        case 'sourceColor':
                            regionsColors[i] = {
                                sourceColor: colorSelector
                            }
                            break;
                    }

                    regionsColors[i].defaultColor = regionsContext[i].find('defaultColor').value();
                    regionsColors[i].borderColor = regionsContext[i].find('borderColor').value();
                    regionsColors[i].borderWidth = regionsContext[i].find('borderWidth').value();
                    regionsColors[i].selectBorderColor = regionsContext[i].find('selectBorderColor').value();
                    regionsColors[i].selectColor = regionsContext[i].find('selectColor').value();

                    var jsonMapSelector  = regionsContext[i].find('geojson').value();
                    switch(jsonMapSelector.key()){
                        case 'russianRegions':
                            maps.push({
                                data: null,
                                path: 'geojson/russianRegions.json',
                                compareTo: jsonMapSelector.find('compareTo').value().key(),
                                wrapLongitude: -30
                            });
                            newMapHash += 'geojson/russianRegions.json';
                            break;
                        case 'russianRegionsMPT':
                            maps.push({
                                data: null,
                                path: 'geojson/russianRegionsMPT.json',
                                compareTo: jsonMapSelector.find('compareTo').value().key(),
                                wrapLongitude: -30
                            });
                            newMapHash += 'geojson/russianRegionsMPT.json';
                            break;
                        case 'worldCountries':
                            maps.push({
                                data: null,
                                path: 'geojson/worldCountries.json', // 'geojson/countries.json', //'geojson/worldCountries.json',
                                compareTo: jsonMapSelector.find('compareTo').value().key(),
                                wrapLongitude: -32
                            });
                            newMapHash += 'geojson/worldCountries.json';
                            break;
                    }
                }

                newMapHash = MD5.md5(newMapHash);
                if(newMapHash !== this._mapHash){
                    this._mapHash = newMapHash;
                    this._maps = maps;
                    this._isMapsLoaded = false;
                    this.loadMaps();
                }
            } catch(ex){
                console.log('Parse scheme exception!');
                console.log(ex);
            }

            this.getElement().loader();
            dataSource.fetch({readAll: true, reset: true}, function(res){
                try{
                    var regions = {};

                    while(dataSource.next()){
                        for(var i = 0; i < regionsContext.length; i++){
                            var value = regionsContext[i].find('value').value();

                            if(!regions[i]){
                                regions[i] = {
                                    data: [],
                                    showValuesPermanent: regionsContext[i].find('showValuesPermanent').used(),
                                    showEmptyRegions: regionsContext[i].find('showEmptyRegions').used()
                                };
                            }

                            regions[i].data.push({
                                region: regionsContext[i].find('region').value(),
                                value: value
                            });

                            if(!regions[i].maxValue || regions[i].maxValue < value){
                                regions[i].maxValue = value;
                            }

                            if(!regions[i].minValue || regions[i].minValue > value){
                                regions[i].minValue = value;
                            }

                            if(regionsColors[i].simpleColor){
                                regions[i].color = regionsColors[i].simpleColor;
                            }

                            if(regionsColors[i].sourceColor){
                                regions[i][regions[i].data.length].color = regionsColors[i].sourceColor.value();
                            }
                        }
                    }

                    for(var i = 0; i < regionsColors.length; i++){
                        if(regionsColors[i].rangeColor){
                            var rainbow = new Rainbow({
                                minNum: regions[i].minValue,
                                maxNum: regions[i].maxValue,
                                spectrum: [regionsColors[i].rangeColor.startColor, regionsColors[i].rangeColor.endColor]
                            });

                            for(var j = 0; j < regions[i].data.length; j++){
                                regions[i].data[j].color = '#' + rainbow.colourAt(regions[i].data[j].value, regionsColors[i].rangeColor.functionType);
                            }

                            regions[i].defaultColor = regionsColors[i].defaultColor;
                            regions[i].borderColor = regionsColors[i].borderColor;
                            regions[i].borderWidth = regionsColors[i].borderWidth;
                            regions[i].selectBorderColor = regionsColors[i].selectBorderColor;
                            regions[i].selectColor = regionsColors[i].selectColor;
                        }
                    }

                    $this.buildChart({
                        regions: regions
                    });
                } catch(ex){
                    console.log('Load data exception!');
                    console.log(ex);
                } finally {
                    if($this._isMapsLoaded){
                        $this.getElement().loader('hide');
                    }
                    $this._isDataLoaded = true;
                }
            });
        },

        // refresh after data and/or style changes
        buildChart: function(data){
            JSB.defer(function(){
                $this.ensureInitialized(function(){
                    $this.innerBuildChart(data);
                });
            }, 300, 'buildChart_' + this.getId());
        },

        innerBuildChart: function(data){
            if(!this._isMapsLoaded){
                JSB.defer(function(){
                    $this.innerBuildChart(data);
                }, 500, 'mapLoading_' + this.getId());
                return;
            }

            try {
                var tileMaps = this.getContext().find('tileMaps').values();

                if(this.map){
                    this._mapOpts = {
                        center: this.map.getCenter(),
                        zoom: this.map.getZoom()
                    }
                    this.map.remove();
                } else {
                    this._mapOpts = {
                        center: [40.5, -280.5],
                        zoom: 2
                    };
                }

                this.map = L.map(this.container.get(0), this._mapOpts);

                // add title layers
                for(var i = 0; i < tileMaps.length; i++){
                    L.tileLayer(tileMaps[i].find('url').value().value(), {foo: 'bar'}).addTo(this.map);
                }

                // add geojson layers
                for(var i = 0; i < this._maps.length; i++){
                    if(this._maps[i].data){
                        (function(i, data){
                            var tooltipLayers = [];

                            $this._maps[i].map = L.geoJSON($this._maps[i].data, {
                                style: function (feature) {
                                    if(data && data.color){
                                        return {fillColor: data.color, color: data.color, fillOpacity: 0.7};
                                    }
                                    var reg = $this.findRegion(feature.properties[$this._maps[i].compareTo], data.regions[i].data);
                                    if(!reg){
                                        if(data.regions[i].showEmptyRegions){
                                            return {fillColor: data.regions[i].defaultColor, color: data.regions[i].borderColor, weight: data.regions[i].borderWidth, fillOpacity: 0.7};
                                        } else {
                                            return {fillColor: 'transparent', color: 'transparent'};
                                        }
                                    }
                                    return {fillColor: reg.color, color: data.regions[i].borderColor, weight: data.regions[i].borderWidth, fillOpacity: 0.7};
                                },
                                coordsToLatLng: function(point){
                                    if($this._maps[i].wrapLongitude && (point[0] > $this._maps[i].wrapLongitude)){
                                        point[0] -= 360;
                                    }
                                    return L.GeoJSON.coordsToLatLng(point);
                                },
                                onEachFeature: function(feature, layer){
                                    var reg = $this.findRegion(feature.properties[$this._maps[i].compareTo], data.regions[i].data);
                                    if(!reg){
                                        layer.bindPopup(feature.properties[$this._maps[i].compareTo] + ': Нет данных', {closeButton: false, autoPan: false});
                                        return;
                                    }
                                    layer.bindPopup(reg.region + ': ' + reg.value, {closeButton: false, autoPan: false});

                                    if(data.regions[i].showValuesPermanent){
                                        layer.bindTooltip(String(reg.value), {permanent: true, direction: "center", interactive: true, className: 'permanentTooltips', opacity: 0.7});
                                        tooltipLayers.push(layer);
                                    }

                                    layer.on({
                                        click: function(evt){
                                            if(!reg){
                                                return;
                                            }

                                            if(evt.target.datacubeOpts){
                                                if(evt.target.datacubeOpts.selected){
                                                    // remove filter
                                                    $this._removeFilter(evt, {
                                                        regionValue: reg.region,
                                                        seriesIndex: i
                                                    });
                                                    return;
                                                }
                                            } else {
                                                evt.target.datacubeOpts = {
                                                    defaultColor: evt.target.options.fillColor,
                                                    defaultBorderColor: evt.target.options.color
                                                }
                                            }

                                            // add filter
                                            evt.target.datacubeOpts.selected = true;

                                            evt.target.setStyle({color: data.regions[i].selectBorderColor, fillColor: data.regions[i].selectColor});

                                            $this._addFilter(evt, {
                                                regionValue: reg.region,
                                                seriesIndex: i
                                            });
                                        },
                                        mouseover: function(evt){
                                            evt.originalEvent.stopPropagation();
                                            this.openPopup();
                                        },
                                        mouseout: function(evt){
                                            evt.originalEvent.stopPropagation();
                                            this.closePopup();
                                        }
                                    });
                                }
                            });
                            $this._maps[i].map.addTo($this.map);

                            for(var j = 0; j < tooltipLayers.length; j++){
                                tooltipLayers[j].openTooltip();
                            }
                        })(i, data);
                    }
                }

                for(var i in $this._curFilters){
                    this._selectFeature(i);
                }
            } catch(ex){
                console.log('Build chart exception!');
                console.log(ex);
            }
        },

        // filters
        _addFilter: function(evt, opts){
            var dataSource = this.getContext().find('dataSource').binding();
            if(!dataSource.source) return;

            var field = this.getContext().find("regions").values()[opts.seriesIndex].find('region').binding()[0];
            if(!field[0]) return;

            var fDesc = {
                sourceId: dataSource.source,
                type: '$or',
                op: '$eq',
                field: field,
                value: opts.regionValue
            };

            if(!evt.originalEvent.ctrlKey && !evt.originalEvent.shiftKey && Object.keys(this._curFilters).length > 0){
                for(var i in this._curFilters){
                    this._deselectFeature(i);
                    this.removeFilter(this._curFilters[i]);
                }

                this._curFilters = {};
            }

            if(!this.hasFilter(fDesc)){
                this._curFilters[opts.regionValue] = this.addFilter(fDesc);
                this.refreshAll();
            }
        },

        _removeFilter: function(evt, opts){
            if(!evt.originalEvent.ctrlKey && !evt.originalEvent.shiftKey && Object.keys(this._curFilters).length > 1){
                for(var i in this._curFilters){
                    if(i != opts.regionValue){
                        this._deselectFeature(i);
                        this.removeFilter(this._curFilters[i]);
                    }
                }
                var temp = this._curFilters[opts.regionValue];
                this._curFilters = {};
                this._curFilters[opts.regionValue] = temp;
                this.refreshAll();
                return;
            }

            evt.target.datacubeOpts.selected = false;

            evt.target.setStyle({color: evt.target.datacubeOpts.defaultBorderColor, fillColor: evt.target.datacubeOpts.defaultColor});

            this.removeFilter(this._curFilters[opts.regionValue]);
            this.refreshAll();
        },

        _deselectFeature: function(value){
            for(var i = 0; i < this._maps.length; i++){
                this._maps[i].map.eachLayer(function(layer){
                    if(value.indexOf(layer.feature.properties[$this._maps[i].compareTo]) > -1 && layer.datacubeOpts && layer.datacubeOpts.selected){
                        layer.datacubeOpts.selected = false;
                        layer.setStyle({color: layer.datacubeOpts.defaultBorderColor, fillColor: layer.datacubeOpts.defaultColor});
                    }
                });
            }
        },

        _selectFeature: function(value){
            var regionsContext = this.getContext().find('regions').values();

            for(var i = 0; i < this._maps.length; i++){
                var selectBorderColor = regionsContext[i].find('selectBorderColor').value(),
                    selectColor = regionsContext[i].find('selectColor').value();

                this._maps[i].map.eachLayer(function(layer){
                    if(value.indexOf(layer.feature.properties[$this._maps[i].compareTo]) > -1){
                        if(layer.datacubeOpts && layer.datacubeOpts.selected){
                            return;
                        }

                        layer.datacubeOpts = {
                            defaultColor: layer.options.fillColor,
                            defaultBorderColor: layer.options.color,
                            selected: true
                        }

                        layer.setStyle({color: selectBorderColor, fillColor: selectColor});
                    }
                });
            }
        },

        loadMaps: function(){
            if(this._maps.length === 0){
                this._isMapsLoaded = true;
                return;
            }

            var params = {
                maps: []
            };
            for(var i = 0; i < this._maps.length; i++){
                if(!this._maps[i].path){
                    continue;
                }

                params.maps.push({
                    path: this._maps[i].path
                });
            }

            this.getElement().loader();
            this.ajax('datacube/widgets/map/map.jsb', params, function(result, obj){
                if($this._isDataLoaded){
                    $this.getElement().loader('hide');
                }

                if(result !== 'success'){
                    $this._isMapsLoaded = true;
                    return;
                }

                obj = obj.result;

                for(var i = 0; i < obj.length; i++){
                    $this._maps[i].data = obj[i].data;
                }

                $this._isMapsLoaded = true;
            });
        },

        // utils
        findRegion: function(region, array){
            if(!region){
                return;
            }

            for(var j = 0; j < array.length; j++){
                var name = array[j].region;
                if(!name){
                    continue;
                }

                if(name.indexOf(region) > -1){
                    return array[j];
                }
            }
        }
    },

    $server: {
        $require: ['JSB.Web', 'JSB.IO.FileSystem'],

        post: function(params){
            for(var i = 0; i < params.maps.length; i++){
                if(FileSystem.exists($jsb.getFullPath() + '/' + params.maps[i].path)){
                    params.maps[i].data = eval('(' + FileSystem.read($jsb.getFullPath() + '/' + params.maps[i].path, 'r') + ')');
                    //params.maps[i].data = JSON.parse(FileSystem.read($jsb.getFullPath() + '/' + params.maps[i].path, 'r'));
                }
            }

            return Web.response(params.maps, {mode:'json'})
        }
    }
}