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
            name: 'Источник данных'
        },
        regions: {
         render: 'group',
         name: 'Регионы',
         collapsible: true,
         multiple: true,
         items: {
             item: {
                 render: 'group',
                 name: 'Группа регионов',
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
                                 name: 'Карта регионов России',
                                 items: {
                                    compareTo: {
                                         render: 'select',
                                         name: 'Сопоставление по',
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
                                    }
                                 }
                             },
                             russianRegionsMPT: {
                                 name: 'Карта регионов России MPT',
                                 items: {
                                    compareTo: {
                                         render: 'select',
                                         name: 'Сопоставление по',
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
                                    }
                                 }
                             },
                             worldCountries: {
                                name: 'Карта мира',
                                 items: {
                                    compareTo: {
                                         render: 'select',
                                         name: 'Сопоставление по',
                                         items: {
                                             ru_name: {
                                                 name: 'Название страны'
                                             },
                                             name: {
                                                 name: 'Название страны (англ)'
                                             },
                                             id: {
                                                 name: 'Код ISO'
                                             }
                                         }
                                    }
                                 }
                             },
                             countriesInEng: {
                                name: 'Карта мира (страны на англ)',
                                 items: {
                                    compareTo: {
                                         render: 'select',
                                         name: 'Сопоставление по',
                                         items: {
                                             name: {
                                                 name: 'Название страны'
                                             }
                                         }
                                    }
                                 }
                             },
                             moscowAO: {
                                name: 'Москва. Административные округа',
                                items: {
                                    compareTo: {
                                        render: 'select',
                                        name: 'Сопоставление по',
                                        items: {
                                            NAME: {
                                                name: 'Имя'
                                            },
                                            OKATO: {
                                                name: 'Код ОКАТО'
                                            },
                                            ABBREV: {
                                                name: 'Аббревиатура'
                                            }
                                        }
                                    }
                                }
                             },
                             moscowAO_КСП: {
                                name: 'Москва. Административные округа КСП',
                                items: {
                                    compareTo: {
                                        render: 'select',
                                        name: 'Сопоставление по',
                                        items: {
                                            NAME: {
                                                name: 'Имя'
                                            },
                                            OKATO: {
                                                name: 'Код ОКАТО'
                                            },
                                            ABBREV: {
                                                name: 'Аббревиатура'
                                            }
                                        }
                                    }
                                }
                             },
                             moscowMO: {
                                name: 'Москва. Муниципальные образования',
                                items: {
                                    compareTo: {
                                        render: 'select',
                                        name: 'Сопоставление по',
                                        items: {
                                            NAME: {
                                                name: 'Имя'
                                            },
                                            OKATO: {
                                                name: 'Код ОКАТО'
                                            },
                                            OKTMO: {
                                                name: 'Код OKTMO'
                                            },
                                            NAME_AO: {
                                                name: 'Имя административного округа'
                                            },
                                            OKATO_AO: {
                                                name: 'Код ОКАТО административного округа'
                                            },
                                            ABBREV_AO: {
                                                name: 'Аббревиатура административного округа'
                                            }
                                        }
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
                                        editor: 'JSB.Widgets.ColorEditor'
                                    }
                                }
                            },
                            rangeColor: {
                                name: 'Диапазон цветов',
                                items: {
                                    startColor: {
                                        render: 'item',
                                        name: 'Начальный цвет',
                                        editor: 'JSB.Widgets.ColorEditor'
                                    },
                                    endColor: {
                                        render: 'item',
                                        name: 'Конечный цвет',
                                        editor: 'JSB.Widgets.ColorEditor'
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
                                    },
                                    stepGradation: {
                                        render: 'switch',
                                        name: 'Ступенчатая градация',
                                        items: {
                                            stepCount: {
                                                render: 'item',
                                                name: 'Число частей',
                                                valueType: 'number',
                                                defaultValue: 2
                                            },
                                            legend: {
                                                render: 'switch',
                                                name: 'Легенда',
                                                items: {
                                                    position: {
                                                        render: 'item',
                                                        name: 'Расположение',
                                                        editor: 'JSB.Controls.Positioner',
                                                        editorOpts: {
                                                            positions: [
                                                                [ { key: 'topleft', name: 'Верхний левый угол' }, { key: 'topright', name: 'Верхний правый угол'}],
                                                                [ { key: 'bottomleft', name: 'Нижний левый угол' }, { key: 'bottomright', name: 'Нижний правый угол' }]
                                                            ]
                                                        }
                                                    }
                                                }
                                            }
                                        }
                                    }
                                }
                            },
                            sourceColor: {
                                 name: 'Цвет из источника',
                                 items: {
                                    color: {
                                        render: 'dataBinding',
                                        name: 'Поле с цветом',
                                        linkTo: 'dataSource'
                                    }
                                 }
                            }
                        }
                     },
                     defaultColor: {
                        render: 'item',
                        name: 'Цвет заливки регионов без данных',
                        editor: 'JSB.Widgets.ColorEditor'
                     },
                     borderColor: {
                        render: 'item',
                        name: 'Цвет границ регионов',
                        editor: 'JSB.Widgets.ColorEditor',
                        valueType: 'string',
                        defaultValue: 'transparent'
                     },
                     borderWidth: {
                        render: 'item',
                        name: 'Толщина границы',
                        valueType: 'number',
                        defaultValue: 2
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
                         name: 'Выделенные регионы',
                         items: {
                            selectColor: {
                                render: 'item',
                                name: 'Цвет заливки регионов',
                                editor: 'JSB.Widgets.ColorEditor'
                            },
                            selectBorderColor: {
                                render: 'item',
                                name: 'Цвет границ регионов',
                                editor: 'JSB.Widgets.ColorEditor'
                            }
                         }
                     },
                     valueDisplayType: {
                        render: 'select',
                        name: 'Способ отображения значений',
                        items: {
                            legend: {
                                name: 'Информационная легенда'
                            },
                            onObject: {
                                name: 'На регионе'
                            }
                        }
                     },
                     displayContent: {
                        render: 'formatter',
                        name: 'Контент',
                        linkTo: 'dataSource',
                        formatterOpts: {
                            variables: [
                                {
                                    alias: 'Значение',
                                    type: 'number',
                                    value: 'y'
                                }
                            ]
                        },
                        valueType: 'string',
                        defaultValue: '{y:,.0f}'
                     }
                 }
             }
         }
        },
        markers: {
            render: 'group',
            name: 'Маркеры',
            collapsible: true,
            multiple: true,
            items: {
                item: {
                    render: 'group',
                    name: 'Группа маркеров',
                    items: {
                        coordinatesType: {
                            render: 'select',
                            name: 'Тип координат',
                            items: {
                                simple: {
                                    name: 'Отдельные координаты',
                                    items: {
                                        coordinatesX: {
                                            render: 'dataBinding',
                                            name: 'Широта',
                                            linkTo: 'dataSource',
                                            valueType: 'number'
                                        },
                                        coordinatesY: {
                                            render: 'dataBinding',
                                            name: 'Долгота',
                                            linkTo: 'dataSource',
                                            valueType: 'number'
                                        }
                                    }
                                },
                                array: {
                                    name: 'Массив координат',
                                    items: {
                                        coordinatesArray: {
                                            render: 'dataBinding',
                                            name: 'Массив',
                                            linkTo: 'dataSource'
                                        }
                                    }
                                }
                            }
                        },
                        markerType: {
                            render: 'select',
                            name: 'Тип маркера',
                            items: {
                                defaultMarker: {
                                    name: 'По-умолчанию'
                                },
                                widget: {
                                    name: 'Виджет',
                                    items: {
                                        widgetBinding: {
                                            render: 'embeddedWidget',
                                            name: 'Тип виджета',
                                            linkTo: 'dataSource'
                                        },
                                        markerWidth: {
                                            render: 'item',
                                            name: 'Длина маркера',
                                            valueType: 'number'
                                        },
                                        markerHeight: {
                                            render: 'item',
                                            name: 'Высота маркера',
                                            valueType: 'number'
                                        }
                                    }
                                },
                                heatCircles: {
                                    name: 'Тепловые круги',
                                    items: {
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
                                                            editor: 'JSB.Widgets.ColorEditor',
                                                            valueType: 'string',
                                                            defaultValue: '#000'
                                                        }
                                                    }
                                                },
                                                rangeColor: {
                                                    name: 'Диапазон цветов',
                                                    items: {
                                                        colorValues: {
                                                            render: 'dataBinding',
                                                            name: 'Значения',
                                                            linkTo: 'dataSource'
                                                        },
                                                        startColor: {
                                                            render: 'item',
                                                            name: 'Начальный цвет',
                                                            editor: 'JSB.Widgets.ColorEditor',
                                                            valueType: 'string',
                                                            defaultValue: '#000'
                                                        },
                                                        endColor: {
                                                            render: 'item',
                                                            name: 'Конечный цвет',
                                                            editor: 'JSB.Widgets.ColorEditor',
                                                            valueType: 'string',
                                                            defaultValue: '#000'
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
                                                        },
                                                        stepGradation: {
                                                            render: 'switch',
                                                            name: 'Ступенчатая градация',
                                                            items: {
                                                                stepCount: {
                                                                    render: 'item',
                                                                    name: 'Число частей',
                                                                    valueType: 'number',
                                                                    defaultValue: 2
                                                                },
                                                                legend: {
                                                                    render: 'switch',
                                                                    name: 'Легенда',
                                                                    items: {
                                                                        position: {
                                                                            render: 'item',
                                                                            name: 'Расположение',
                                                                            editor: 'JSB.Controls.Positioner',
                                                                            editorOpts: {
                                                                                positions: [
                                                                                    [ { key: 'topleft', name: 'Верхний левый угол' }, { key: 'topright', name: 'Верхний правый угол'}],
                                                                                    [ { key: 'bottomleft', name: 'Нижний левый угол' }, { key: 'bottomright', name: 'Нижний правый угол' }]
                                                                                ]
                                                                            }
                                                                        }
                                                                    }
                                                                }
                                                            }
                                                        }
                                                    }
                                                },
                                                sourceColor: {
                                                     name: 'Цвет из источника',
                                                     items: {
                                                        color: {
                                                            render: 'dataBinding',
                                                            name: 'Поле с цветом',
                                                            linkTo: 'dataSource'
                                                        }
                                                     }
                                                }
                                            }
                                        },
                                        sizeValues: {
                                            render: 'select',
                                            name: 'Размер маркеров',
                                            items: {
                                                fixed: {
                                                    name: 'Фиксированный',
                                                    items: {
                                                        fixedSize: {
                                                            render: 'item',
                                                            name: 'Радиус',
                                                            valueType: 'number',
                                                            defaultValue: 2
                                                        }
                                                    }
                                                },
                                                byValue: {
                                                    name: 'На базе значения',
                                                    items: {
                                                        sizeValuesBinding: {
                                                            render: 'dataBinding',
                                                            name: 'Значение размерной градации',
                                                            linkTo: 'dataSource'
                                                        },
                                                        minRadius: {
                                                            render: 'item',
                                                            name: 'Минимальный радиус',
                                                            valueType: 'number',
                                                            defaultValue: 2
                                                        },
                                                        maxRadius: {
                                                            render: 'item',
                                                            name: 'Максимальный радиус',
                                                            valueType: 'number',
                                                            defaultValue: 10
                                                        }
                                                    }
                                                }
                                            }
                                        },
                                        markerStyleType: {
                                            render: 'select',
                                            name: 'Стиль маркера',
                                            items: {
                                                fillCircle: {
                                                    name: 'Закрашенный кружок'
                                                },
                                                hollowCircle: {
                                                    name: 'Полый кружок'
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        },
                        useCluster: {
                            render: 'item',
                            name: 'Использовать группировку',
                            optional: true,
                            editor: 'none'
                        },
                        markerTooltip: {
                            render: 'switch',
                            name: 'Подсказка',
                            items: {
                                tooltipType: {
                                    render: 'select',
                                    name: 'Тип подсказки',
                                    items: {
                                        simpleTooltip: {
                                            name: 'Простая подсказка',
                                            /*
                                            items: {
                                                // todo
                                            }
                                            */
                                        },
                                        completeWidget: {
                                            name: 'Готовый виджет',
                                            items: {
                                                completeWidgetBinding: {
                                                    render: 'completeWidget',
                                                    name: 'Виджет'
                                                },
                                                identField: {
                                                    render: 'dataBinding',
                                                    name: 'Поле идентификации',
                                                    linkTo: 'dataSource'
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        },
                        markerFiltration: {
                            render: 'switch',
                            name: 'Фильтрация',
                            items: {
                                markerFilterField: {
                                    render: 'dataBinding',
                                    name: 'Фильтрующее поле',
                                    linkTo: 'dataSource'
                                }
                            }
                        }
                    }
                }
            }
        },
        settings: {
            render: 'group',
            name: 'Общие настройки',
            collapsible: true,
            collapsed: true,
            items: {
                startPosition: {
                    render: 'group',
                    name: 'Начальное положение',
                    collapsible: true,
                    collapsed: false,
                    items: {
                        latitude: {
                            render: 'item',
                            name: 'Широта',
                            valueType: 'number',
                            defaultValue: 40.5
                        },
                        longitude: {
                            render: 'item',
                            name: 'Долгота',
                            valueType: 'number',
                            defaultValue: 40.5
                        },
                        zoom: {
                            render: 'item',
                            name: 'Приближение',
                            valueType: 'number',
                            defaultValue: 2
                        }
                    }
                },
                formatter: {
                    render: 'formatter',
                    name: 'Форматирование значений',
                    formatterOpts: {
                        basicSettings: {
                            type: 'number',
                            value: 'y'
                        },
                    	variables: [
                    		{
                    			alias: 'Значение',
                    			type: 'number',
                    			value: 'y'
                    		}
                    	]
                    },
                    valueType: 'string',
                    defaultValue: '{y:,.0f}'
                },
                infoControl: {
                    render: 'group',
                    name: 'Настройки информационной легенды',
                    items: {
                        header: {
                            render: 'item',
                            name: 'Заголовок',
                            valueType: 'string',
                            defaultValue: 'Информационная легенда'
                        },
                        position: {
                            render: 'item',
                            name: 'Расположение',
                            editor: 'JSB.Controls.Positioner',
                            editorOpts: {
                                positions: [
                                    [ { key: 'topleft', name: 'Верхний левый угол' }, { key: 'topright', name: 'Верхний правый угол'}],
                                    [ { key: 'bottomleft', name: 'Нижний левый угол' }, { key: 'bottomright', name: 'Нижний правый угол' }]
                                ]
                            },
                            valueType: 'string',
                            defaultValue: 'topright'
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
                     openstreetmap: {
                         name: 'Openstreetmap.org'
                     },
                     sputnik: {
                         name: 'Спутник.ру'
                     },
                     cartocdn: {
                         name: 'Cartocdn.com'
                     },
                     stamen: {
                         name: 'Stamen.com'
                     },
                     avicomp: {
                         name: 'OGCServer'
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
        },
        header: {
	        render: 'group',
	        name: 'Заголовок',
            collapsible: true,
            collapsed: true,
            items: {
                text: {
                    render: 'item',
                    name: 'Текст',
                    valueType: 'string',
                    defaultValue: ''
                },
                fontColor: {
                    render: 'item',
                    name: 'Цвет шрифта',
                    editor: 'JSB.Widgets.ColorEditor',
                    defaultValue: '#333333'
                },
                fontSize: {
                    render: 'item',
                    name: 'Размер шрифта',
                    valueType: 'number',
                    defaultValue: 18
                },
                x: {
                    render: 'item',
                    name: 'X',
                    valueType: 'number'
                },
                y: {
                    render: 'item',
                    name: 'Y',
                    valueType: 'number',
                    defaultValue: 10
                }
            }
        }
    },
    $client: {
        $require: ['JSB.Utils.Rainbow', 'JSB.Crypt.MD5', 'JSB.Utils.Formatter'],

        $constructor: function(opts){
            $base(opts);

            this.container = this.$('<div class="container"></div>');
            this.append(this.container);

            this._widgetElements.header = this.$('<span class="header"></span>');
            this.append(this._widgetElements.header);

            this.addClass('mapWidget');
            $jsb.loadCss('map.css');

            JSB.loadCss('tpl/leaflet.markercluster/MarkerCluster.css');
            JSB.loadCss('tpl/leaflet.markercluster/MarkerCluster.Default.css');

            JSB.loadCss('tpl/leaflet/leaflet.css');
            JSB.loadScript(['tpl/leaflet/leaflet-src.js', 'tpl/topojson/topojson-client.js'], function(){    // tpl/leaflet/leaflet.js
                JSB.loadScript(['tpl/leaflet.markercluster/leaflet.markercluster.js'], function(){
                    $this.setInitialized();
                });
            });

            this.getElement().resize(function(){
                JSB.defer(function(){
                    if(!$this.getElement().is(':visible') || !$this.map){
                        return;
                    }

                    $this.map.invalidateSize();
                }, 300, 'hcResize' + $this.getId());
            });

            this.getElement().visible(function(evt, isVisible){
                if($this._isNeedLegendsResize && isVisible){
                    for(var i = 0; i < $this._legends.length; i++){
                        $this._resizeLegend($this._legends[i]);
                    }

                    $this._isNeedLegendsResize = false;
                }
            });
        },

        // inner variables
        _curFilters: {},
        _isNeedLegendsResize: false,
        _maps: [],
        _mapHash: null,
        _layers: {
            geoJson: [],
            markers: [],
            tile: [],
            wms: []
        },
        _legends: [],
        _styles: null,
        _widgetElements: {
            header: null,
            map: null
        },

        onRefresh: function(opts){
            // if filter source is current widget
            if(opts && this == opts.initiator){
                this.ready();
                return;
            }

            if(opts && opts.updateStyles){
                this._styles = null;
                this._maps = [];
                this._dataSource = null;
            }

            if(!this._dataSource){
                this._dataSource = this.getContext().find('dataSource');

                if(!this._dataSource.hasBinding()){
                    this.ready();
                    return;
                }
            }

            $base();

            // advanced filters
            var globalFilters = this.getSourceFilters(this._dataSource),
                regionsContext = this.getContext().find('regions').values(),
                markersContext = this.getContext().find('markers').values();;

            if(globalFilters && Object.keys(globalFilters).length > 0){
                var bindings = [],
                    newFilters = {};

                for(var i = 0; i < regionsContext.length; i++){
                    bindings.push(regionsContext[i].find('region').getBindingName());
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

                if(Object.keys(globalFilters).length > 0 && this.createFilterHash(globalFilters) === this._curFilterHash || Object.keys(globalFilters).length === 0 && !this._curFilterHash && this.map){
                    this.ready();
                    return;
                } else {
                    this._curFilterHash = Object.keys(globalFilters).length > 0 ? this.createFilterHash(globalFilters) : undefined;
                    this.setSourceFilters(this._dataSource, globalFilters);
                }
            } else {
                if(Object.keys(this._curFilters).length > 0){
                    for(var i in this._curFilters){
                        this._deselectFeature(i);
                    }
                    this._curFilters = {};
                    this.ready();
                    return;
                }
                this._curFilterHash = null;
            }

            try{
                if(!this._styles){
                    // set header
                    /*********/
                    var headerContext = this.getContext().find('header');
                    this._widgetElements.header.text(headerContext.find('text').value());
                    this._widgetElements.header.css('color', headerContext.find('fontColor').value());
                    this._widgetElements.header.css('font-size', headerContext.find('fontSize').value());
                    this._widgetElements.header.css('left', this._isDefined(headerContext.find('x').value(), 'calc(50% - ' + (this._widgetElements.header.width() / 2) + 'px)'));
                    this._widgetElements.header.css('top', headerContext.find('y').value());
                    /*********/

                    this._styles = {
                        contentBindings: [],
                        contentData: [],
                        regions: [],
                        markers: [],
                        embeddedBindings: [],
                        tiles: []
                    };

                    // parsing settings
                    /*********/
                    var settingsContext = this.getContext().find('settings');

                    this._styles.settings = {
                        startPosition: {
                            latitude: settingsContext.find('startPosition latitude').value(),
                            longitude: settingsContext.find('startPosition longitude').value(),
                            zoom: settingsContext.find('startPosition zoom').value()
                        },
                        formatter: settingsContext.find('formatter').value(),
                        infoControl: {
                            header: settingsContext.find('infoControl header').value(),
                            position: settingsContext.find('infoControl position').value()
                        }
                    }
                    /*********/

                    // parsing regions data
                    /*********/
                    var maps = [],
                        loadedMaps = this.getJsb().maps;

                    for(var i = 0; i < regionsContext.length; i++){
                        var colorSelector = regionsContext[i].find('fillColor');

                        switch(colorSelector.value()){
                            case 'simpleColor':
                                this._styles.regions[i] = {
                                    simpleColor: colorSelector.find('color').value()
                                }
                                break;
                            case 'rangeColor':
                                var isStepGrad = colorSelector.find('stepGradation').checked();

                                this._styles.regions[i] = {
                                    rangeColor: {
                                        startColor: colorSelector.find('startColor').value(),
                                        endColor: colorSelector.find('endColor').value(),
                                        functionType: colorSelector.find('functionType').value(),
                                        stepGradation: isStepGrad ? colorSelector.find('stepCount').value() : undefined
                                    }
                                }

                                if(isStepGrad && colorSelector.find('stepGradation legend').checked()){
                                    this._styles.regions[i].legend = {
                                        position: colorSelector.find('stepGradation legend position').value()
                                    }
                                }
                                break;
                            case 'sourceColor':
                                this._styles.regions[i] = {
                                    sourceColor: colorSelector.find('color')
                                }
                                break;
                        }

                        this._styles.contentBindings = this._styles.contentBindings.concat(regionsContext[i].find('displayContent').getBindingFields());
                        this._styles.regions[i].displayContent = regionsContext[i].find('displayContent').value();

                        this._styles.regions[i].defaultColor = regionsContext[i].find('defaultColor').value();
                        this._styles.regions[i].borderColor = regionsContext[i].find('borderColor').value();
                        this._styles.regions[i].borderWidth = regionsContext[i].find('borderWidth').value();
                        this._styles.regions[i].selectBorderColor = regionsContext[i].find('selectBorderColor').value();
                        this._styles.regions[i].selectColor = regionsContext[i].find('selectColor').value();
                        this._styles.regions[i].showValuesPermanent = regionsContext[i].find('showValuesPermanent').checked();
                        this._styles.regions[i].showEmptyRegions = regionsContext[i].find('showEmptyRegions').checked();
                        this._styles.regions[i].valueDisplayType = regionsContext[i].find('valueDisplayType').value();

                        var r = {
                            compareTo: regionsContext[i].find('compareTo').value()
                        };

                        var mapName = regionsContext[i].find('geojsonMap').value();
                        if(loadedMaps && loadedMaps[mapName]){
                            this._maps.push({
                                data: loadedMaps[mapName]
                            });
                        } else {
                            switch(mapName){
                                case 'worldCountries':
                                    maps.push(JSB.merge(r, {
                                        data: null,
                                        path: 'geojson/worldCountries.json'
                                    }));
                                    break;
                                case 'russianRegions':
                                    maps.push(JSB.merge(r, {
                                        data: null,
                                        path: 'geojson/russianRegionsTopojson.json',
                                        type: 'TopoJSON'
                                    }));
                                    break;
                                case 'russianRegionsMPT':
                                    maps.push(JSB.merge(r, {
                                        data: null,
                                        path: 'geojson/russianRegionsMPTTopojson.json',
                                        type: 'TopoJSON'
                                    }));
                                    break;
                                case 'moscowAO':
                                    maps.push(JSB.merge(r, {
                                        data: null,
                                        path: 'geojson/moscowAO.json'
                                    }));
                                    break;
                                case 'moscowAO_КСП':
                                    maps.push(JSB.merge(r, {
                                        data: null,
                                        path: 'geojson/moscowAO_КСП.json'
                                    }));
                                    break;
                                case 'moscowMO':
                                    maps.push(JSB.merge(r, {
                                        data: null,
                                        path: 'geojson/moscowMO.json'
                                    }));
                                    break;
                                case 'countriesInEng':
                                    maps.push(JSB.merge(r, {
                                        data: null,
                                        path: 'geojson/countriesInEng.json'
                                    }));
                                    break;
                            }
                        }
                    }

                    if(maps.length > 0){
                        this.resetTrigger('_mapLoaded');
                        this.loadMaps(maps);
                    } else {
                        this.setTrigger('_mapLoaded');
                    }
                    /*********/

                    // parsing markers data
                    /*********/
                    for(var i = 0; i < markersContext.length; i++){
                        this._styles.markers[i] = {};

                        var markerType = markersContext[i].find('markerType').value(),
                            useCluster = markersContext[i].find('useCluster').checked();

                        this._styles.markers[i].markerType = markerType;

                        this._styles.markers[i].coordinatesType = markersContext[i].find('coordinatesType').value();
                        if(this._styles.markers[i].coordinatesType === 'array'){
                            this._styles.markers[i].coordinatesArray = markersContext[i].find('coordinatesArray');
                        } else {
                            this._styles.markers[i].coordinatesX = markersContext[i].find('coordinatesX');
                            this._styles.markers[i].coordinatesY = markersContext[i].find('coordinatesY');
                        }

                        this._styles.markers[i].useCluster = useCluster;

                        if(useCluster){
                            // todo: cluster settings
                        }
                        /*
                        this._styles.contentBindings = this._styles.contentBindings.concat(markersContext[i].find('displayContent').getBindingFields());
                        this._styles.markers[i].displayContent = markersContext[i].find('displayContent').value();
                        */

                        switch(markerType){
                            case 'defaultMarker':
                                break;
                            case 'widget':
                                var wb = markersContext[i].find('widgetBinding');

                                if(wb.isValueSkipping()){
                                    this._styles.embeddedBindings = embeddedBindings.concat(wb.findRendersByName('sourceBinding'));
                                    this._styles.markers[i].valueSkipping = true;
                                    this._styles.markers[i].widgetBinding = wb;
                                    this._styles.markers[i].values = [];
                                } else {
                                    this._styles.markers[i].values = wb.getFullValues();
                                }

                                this._styles.markers[i].jsb = wb.getWidgetBean();

                                this._styles.markers[i].markerWidth = markersContext[i].find('markerWidth').value();
                                this._styles.markers[i].markerHeight = markersContext[i].find('markerHeight').value();
                                break;
                            case 'heatCircles':
                                var colorSelector = markersContext[i].find('fillColor');

                                switch(colorSelector.value()){
                                    case 'simpleColor':
                                        this._styles.markers[i].simpleColor = colorSelector.find('color').value();
                                        break;
                                    case 'rangeColor':
                                        var isStepGrad = colorSelector.find('stepGradation').checked();

                                        this._styles.markers[i].rangeColor = {
                                                colorValues: colorSelector.find('colorValues'),
                                                startColor: colorSelector.find('startColor').value(),
                                                endColor: colorSelector.find('endColor').value(),
                                                functionType: colorSelector.find('functionType').value(),
                                                stepGradation: isStepGrad ? colorSelector.find('stepCount').value() : undefined
                                            }

                                        if(isStepGrad && colorSelector.find('stepGradation legend').checked()){
                                            this._styles.markers[i].legend = {
                                                position: colorSelector.find('stepGradation legend position').value()
                                            }
                                        }
                                        break;
                                    case 'sourceColor':
                                        this._styles.markers[i].sourceColor = colorSelector.find('color');
                                        break;
                                }

                                if(markersContext[i].find('sizeValues').value() === 'byValue'){
                                    this._styles.markers[i].sizeValuesBinding = markersContext[i].find('sizeValues sizeValuesBinding');
                                    this._styles.markers[i].minRadius = markersContext[i].find('sizeValues minRadius').value();
                                    this._styles.markers[i].maxRadius = markersContext[i].find('sizeValues maxRadius').value();
                                } else {
                                    this._styles.markers[i].fixedSize = markersContext[i].find('sizeValues fixedSize').value();
                                }

                                this._styles.markers[i].markerStyleType = markersContext[i].find('markerStyleType').value();
                                break;
                        }

                        // marker tooltip
                        var markerTooltip = markersContext[i].find('markerTooltip');

                        if(markerTooltip.checked()){
                            var tooltipType = markerTooltip.find('tooltipType').value();

                            this._styles.markers[i].tooltip = {
                                tooltipType: tooltipType,
                                identField: markerTooltip.find('identField')
                            };

                            switch(tooltipType){
                                case 'simpleTooltip':
                                    //
                                    break;
                                case 'completeWidget':
                                    this._styles.markers[i].tooltip.widgetDesc = markerTooltip.find('completeWidgetBinding').value();
                                    break;
                            }
                        }

                        // filtration
                        var markerFiltration = markersContext[i].find('markerFiltration');

                        if(markerFiltration.checked()){
                            this._styles.markers[i].filtration = {
                                filterField: markerFiltration.find('markerFilterField')
                            }
                        }
                    }
                    /*********/

                    // parsing tiles
                    /*********/
                    var tileMaps = this.getContext().find('tileMaps').values();
                    for(var i = 0; i < tileMaps.length; i++){
                        var url,
                            isWMS = false,
                            wmsOptions = {};

                        switch(tileMaps[i].find('serverUrl').value()){
                            case 'sputnik':
                                url = 'http://tiles.maps.sputnik.ru/{z}/{x}/{y}.png'
                                break;
                            case 'openstreetmap':
                                url = 'http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
                                break;
                            case 'cartocdn':
                                url = 'http://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png'
                                break;
                            case 'stamen':
                                url = 'http://{s}.tile.stamen.com/toner-lite/{z}/{x}/{y}.png'
                                break;
                            case 'custom':
                                url = tileMaps[i].find('customServer').value();
                                break;
                            case 'avicomp':
                                url = 'http://172.16.32.3/public/wms-proxy/?';
                                //url = 'http://172.16.32.3:8000/?';
                                isWMS = true;
                                break;
                            default:
                                continue;
                        }

                        this._styles.tiles[i] = {
                            url: url,
                            isWMS: isWMS
                        }
                    }
                    /*********/
                }
            } catch(ex){
                console.log('Parse scheme exception!');
                console.log(ex);
            }

            this.resetTrigger('_dataLoaded');
            this.getElement().loader();

            var regions = [],
                markers = [],
                bindings = [];

            this._styles.contentData = [];

            function fetch(isReset){
                $this.fetch($this._dataSource, { fetchSize: 100, reset: isReset }, function(res, fail){
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

                        $this.parseFormatterData($this._styles.contentBindings, $this._styles.contentData, res);

                        while($this._dataSource.next({ embeddedBindings: $this._styles.embeddedBindings })){
                            // load regions
                            /*********/
                            for(var i = 0; i < regionsContext.length; i++){
                                if(!bindings[i]){
                                    bindings[i] = {
                                        region: regionsContext[i].find('region'),
                                        value: regionsContext[i].find('value')
                                    }
                                }

                                if(!regions[i]){
                                    regions[i] = {
                                        data: []
                                    };
                                }

                                var value = bindings[i].value.value();

                                regions[i].data.push({
                                    region: bindings[i].region.value(),
                                    value: value
                                });

                                if(!regions[i].maxValue || regions[i].maxValue < value){
                                    regions[i].maxValue = value;
                                }

                                if(!regions[i].minValue || regions[i].minValue > value){
                                    regions[i].minValue = value;
                                }

                                if($this._styles.regions[i].simpleColor){
                                    regions[i].color = $this._styles.regions[i].simpleColor;
                                }

                                if($this._styles.regions[i].sourceColor){
                                    regions[i].color = $this._styles.regions[i].sourceColor.value();
                                }
                            }
                            /*********/

                            // load markers
                            /*********/

                            for(var i = 0; i < markersContext.length; i++){
                                if(!markers[i]){
                                    markers[i] = {
                                        coordinates: []
                                    }
                                }

                                if($this._styles.markers[i].coordinatesType === 'array'){
                                    var val = $this._styles.markers[i].coordinatesArray.value();

                                    if(!val || !val[0] || !val[1]){
                                        continue;
                                    }

                                    markers[i].coordinates.push([parseFloat(val[1]), parseFloat(val[0])]);
                                } else {
                                    markers[i].coordinates.push([$this._styles.markers[i].coordinatesX.value(), $this._styles.markers[i].coordinatesY.value()]);
                                }

                                if($this._styles.markers[i].tooltip){
                                    if(!markers[i].tooltipFilterData){
                                        markers[i].tooltipFilterData = [];
                                    }

                                    var filter = {};

                                    filter[$this._styles.markers[i].tooltip.identField.binding()] = {
                                        $eq: {
                                            $const: $this._styles.markers[i].tooltip.identField.value()
                                        }
                                    }

                                    markers[i].tooltipFilterData.push(filter);
                                }

                                if($this._styles.markers[i].filtration){
                                    if(!markers[i].filterData){
                                        markers[i].filterData = [];
                                    }

                                    markers[i].filterData.push({
                                       binding:  $this._styles.markers[i].filtration.filterField.binding(),
                                       value:  $this._styles.markers[i].filtration.filterField.value()
                                    });
                                }

                                switch($this._styles.markers[i].markerType){
                                    case 'widget':
                                        if(!markers[i].values){
                                            markers[i].values = [];
                                        }

                                        if($this._styles.markers[i].valueSkipping){
                                            markers[i].values.push(JSB.clone($this._styles.markers[i].widgetBinding.getFullValues()));
                                        }
                                        break;
                                    case 'heatCircles':
                                        if($this._styles.markers[i].rangeColor){
                                            if(!markers[i].colorValues){
                                                markers[i].colorValues = [];
                                            }

                                            var value = $this._styles.markers[i].rangeColor.colorValues.value();

                                            if(!markers[i].maxColorValue || markers[i].maxColorValue < value){
                                                markers[i].maxColorValue = value;
                                            }

                                            if(!markers[i].minColorValue || markers[i].minColorValue > value){
                                                markers[i].minColorValue = value;
                                            }

                                            markers[i].colorValues.push({
                                                value: value
                                            });
                                        }

                                        if($this._styles.markers[i].sourceColor){
                                            if(!markers[i].colors){
                                                markers[i].colors = [];
                                            }
                                            markers[i].colors.push($this._styles.markers[i].sourceColor.value());
                                        }

                                        if($this._styles.markers[i].sizeValuesBinding){
                                            if(!markers[i].sizeValues){
                                                markers[i].sizeValues = [];
                                            }

                                            var value = $this._styles.markers[i].sizeValuesBinding.value();

                                            if(!markers[i].maxSizeValue || markers[i].maxSizeValue < value){
                                                markers[i].maxSizeValue = value;
                                            }

                                            if(!markers[i].minSizeValue || markers[i].minSizeValue > value){
                                                markers[i].minSizeValue = value;
                                            }

                                            markers[i].sizeValues.push({
                                                value: value
                                            });
                                        }
                                        break;
                                }
                            }
                            /*********/
                        }

                        fetch();
                    } catch(ex){
                        console.log('Loading data exception!');
                        console.log(ex);

                        resultProcessing();
                    }
                });
            }

            function resultProcessing(){
                try{
                    // processing regions
                    /*********/
                    if(regions.length > 0){
                        for(var i = 0; i < $this._styles.regions.length; i++){
                            if($this._styles.regions[i].rangeColor){
                                var rainbow = new Rainbow({
                                    colorFunction: $this._styles.regions[i].rangeColor.functionType,
                                    minNum: regions[i].minValue,
                                    maxNum: regions[i].maxValue,
                                    spectrum: [$this._styles.regions[i].rangeColor.startColor, $this._styles.regions[i].rangeColor.endColor],
                                    stepColors: $this._styles.regions[i].rangeColor.stepGradation
                                });

                                if($this._styles.regions[i].rangeColor.stepGradation){
                                    for(var j = 0; j < regions[i].data.length; j++){
                                        if(!regions[i].data[j].value){
                                            continue;
                                        }

                                        var col = rainbow.colorAt(regions[i].data[j].value);

                                        regions[i].data[j].color = '#' + col.color;
                                        regions[i].data[j].group = col.group;
                                    }

                                    regions[i].colorMap = rainbow.getColorMap();
                                } else {
                                    for(var j = 0; j < regions[i].data.length; j++){
                                        regions[i].data[j].color = '#' + rainbow.colorAt(regions[i].data[j].value);
                                    }
                                }

                                rainbow.destroy();
                            }
                        }
                    }
                    /*********/

                    // processing markers
                    /*********/
                    if(markers.length > 0){
                        for(var i = 0; i < $this._styles.markers.length; i++){
                            if($this._styles.markers[i].markerType === 'heatCircles'){
                                if($this._styles.markers[i].rangeColor){
                                    var rainbow = new Rainbow({
                                        colorFunction: $this._styles.markers[i].rangeColor.functionType,
                                        minNum: markers[i].minColorValue,
                                        maxNum: markers[i].maxColorValue,
                                        spectrum: [$this._styles.markers[i].rangeColor.startColor, $this._styles.markers[i].rangeColor.endColor],
                                        stepColors: $this._styles.markers[i].rangeColor.stepGradation
                                    });

                                    if($this._styles.markers[i].rangeColor.stepGradation){
                                        for(var j = 0; j < markers[i].colorValues.length; j++){
                                            if(!markers[i].colorValues[j].value){
                                                continue;
                                            }

                                            var col = rainbow.colorAt(markers[i].colorValues[j].value);

                                            markers[i].colorValues[j].color = '#' + col.color;
                                            markers[i].colorValues[j].group = col.group;
                                        }

                                        markers[i].colorMap = rainbow.getColorMap();
                                    } else {
                                        for(var j = 0; j < markers[i].colorValues.length; j++){
                                            markers[i].colorValues[j].color = '#' + rainbow.colorAt(markers[i].colorValues[j].value);
                                        }
                                    }

                                    rainbow.destroy();
                                }

                                if($this._styles.markers[i].sizeValuesBinding){
                                    var maxSize = markers[i].maxSizeValue - markers[i].minSizeValue,
                                        maxPx = $this._styles.markers[i].maxRadius - $this._styles.markers[i].minRadius;

                                    for(var j = 0; j < markers[i].sizeValues.length; j++){
                                        markers[i].sizeValues[j].size = (markers[i].sizeValues[j].value - markers[i].minSizeValue) / markers[i].maxSizeValue * maxPx + $this._styles.markers[i].minRadius;
                                    }
                                }
                            }
                        }
                    }
                    /*********/

                    $this.setTrigger('_dataLoaded');

                    $this.buildChart({
                        regions: regions,
                        markers: markers
                    });
                } catch(ex){
                    console.log('Processing data exception!');
                    console.log(ex);
                }
            }

            fetch(true);

            this.ensureDataLoaded(function(){
                try{
                    $this.getElement().loader('hide');
                } catch(e){}
            });
        },

        // refresh after data and/or style changes
        buildChart: function(data){
            this.ensureDataLoaded(function(){
                $this._buildChart(data);
                $this.ready();
            });
        },

        _buildChart: function(data){
            try {
            	if(JSB.isNull(this._styles.settings.startPosition.latitude)){
            		this._styles.settings.startPosition.latitude = 40.5;
            	}
            	if(JSB.isNull(this._styles.settings.startPosition.longitude)){
            		this._styles.settings.startPosition.longitude = 40.5;
            	}
            	if(JSB.isNull(this._styles.settings.startPosition.zoom)){
            		this._styles.settings.startPosition.zoom = 2;
            	}
                var mapOpts = {
                    center: [this._styles.settings.startPosition.latitude, this._styles.settings.startPosition.longitude],
                    zoom: this._styles.settings.startPosition.zoom
                };

                if(this.map){
                    mapOpts = {
                        center: this.map.getCenter(),
                        zoom: this.map.getZoom()
                    };

                    this.map.remove();
                    /*
                    this.map.eachLayer(function(layer){
                        layer.remove();
                    });
                    */
                    /*
                    for(var i = 0; i < this._layers.markers.length; i++){
                        this._layers.markers[i].remove();
                    }

                    for(var i = 0; i < this._layers.geoJson.length; i++){
                        this._layers.geoJson[i].remove();
                    }
                    */
                }

                this.map = L.map(this.container.get(0), mapOpts);

                // remove old controls
                if(this._infoControl){
                    this._infoControl.remove();
                    this._infoControl = undefined;
                }

                // clear legends list
                for(var i = 0; i < this._legends.length; i++){
                    this._legends[i].control.remove();
                }
                this._legends = [];

                // add tile and wms layers
                if(this._styles.tiles){
                    for(var i = 0; i < this._styles.tiles.length; i++){
                        if(this._styles.tiles[i].isWMS){
                            L.tileLayer.wms(this._styles.tiles[i].url, {layerType: 'wms'}).addTo(this.map);
                        } else {
                            L.tileLayer(this._styles.tiles[i].url, {foo: 'bar', layerType: 'tile'}).addTo(this.map);
                        }
                    }
                }

                // tooltip
                function createTooltip(opts){
                    if(!opts){
                        return;
                    }

                    var popup = L.popup({closeButton: false, autoPan: false, minWidth: 400, maxWidth: 500, offset: L.point(0, -30)});

                    switch(opts.tooltipType){
                        case 'simpleTooltip':
                            //
                            break;
                        case 'completeWidget':
                            $this.server().getWidgetEntry(opts.widgetDesc.widgetWsid, opts.widgetDesc.widgetWid, function(entry, fail){
                                if(fail){
                                    return;
                                }

                                JSB.lookup(entry.wType, function(WidgetClass){
                                    var widget = new WidgetClass({
                                        filterManager: $this.filterManager,
                                        widgetEntry: entry,
                                        widgetWrapper: $this.getWrapper()
                                    });

                                    opts.widget = widget;
                                    opts.popup = popup;

                                    popup.setContent(widget.getElement().get(0));
                                });
                            });
                            break;
                    }
                }

                function createTooltipEvents(layer, coordinates, context, tooltip){
                    layer.on({
                        mouseover: function(evt){
                            evt.originalEvent.stopPropagation();

                            if(tooltip.popup){
                                tooltip.widget.ensureInitialized(function(){
                                    tooltip.popup.setLatLng(coordinates);
                                    tooltip.popup.openOn($this.map);

                                    if(context){
                                        tooltip.widget.setContextFilter(context);
                                    }

                                    tooltip.widget.refresh();
                                })
                            }
                        },
                        mouseout: function(evt){
                            evt.originalEvent.stopPropagation();

                            if(tooltip.popup){
                                tooltip.popup.closePopup();
                            }
                        }
                    });
                }

                // add geojson layers
                /*********/
                function regionStyle(i, reg){
                    if(!reg){
                        if($this._styles.regions[i].showEmptyRegions){
                            return {fillColor: $this._styles.regions[i].defaultColor, color: $this._styles.regions[i].borderColor, weight: $this._styles.regions[i].borderWidth, fillOpacity: 0.7};
                        } else {
                            return {fillColor: 'transparent', color: 'transparent'};
                        }
                    }

                    if(data && data.regions[i].color){
                        return {fillColor: data.regions[i].color, color: $this._styles.regions[i].borderColor, fillOpacity: 0.7};
                    }

                    return {fillColor: reg.color, color: $this._styles.regions[i].borderColor, weight: $this._styles.regions[i].borderWidth, fillOpacity: 0.7};
                }

                for(var i = 0; i < this._maps.length; i++){
                    if(this._maps[i].data){
                        // create maps
                        (function(i, data){
                            var tooltipLayers = [],
                                mapGroup = [];

                            if($this._styles.regions[i].valueDisplayType === 'legend'){
                                $this._createInfoControl();
                            }

                            $this._maps[i].map = L.geoJSON($this._maps[i].data, {
                                onEachFeature: function(feature, layer){
                                    var regInfo = $this.findRegion(feature.properties[$this._maps[i].compareTo], data.regions[i].data),
                                        reg = regInfo.region;

                                    layer.setStyle(regionStyle(i, reg));

                                    // set values properties
                                    /*********/
                                    if($this._styles.regions[i].valueDisplayType === 'legend'){
                                        (function(i, index){
                                            layer.on({
                                                mouseover: function(evt){
                                                    if(reg){
                                                        $this._infoControl.update($this._format($this._styles.regions[i].displayContent, index, {y: reg.value}));
                                                    }
                                                },
                                                mouseout: function(evt){
                                                    $this._infoControl.update();
                                                }
                                            });
                                        })(i, regInfo.index);
                                    } else {
                                        if(!reg){
                                            layer.bindPopup(feature.properties[$this._maps[i].compareTo] + ': Нет данных', {closeButton: false, autoPan: false});
                                            return;
                                        }

                                        layer.bindPopup(reg.region + ': ' + $this._format($this._styles.regions[i].displayContent, i, {y: reg.value}), {closeButton: false, autoPan: false});

                                        layer.on({
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

                                    if($this._styles.regions[i].showValuesPermanent && reg){
                                        layer.bindTooltip(String($this._format($this._styles.regions[i].displayContent, i, {y: reg.value})), {permanent: true, direction: "center", interactive: true, className: 'permanentTooltips', opacity: 0.7});
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

                                            evt.target.setStyle({color: $this._styles.regions[i].selectBorderColor, fillColor: $this._styles.regions[i].selectColor});

                                            $this._addFilter(evt, {
                                                regionValue: reg.region,
                                                seriesIndex: i
                                            });
                                        }
                                    });
                                    /*********/
                                }
                            });
                            $this._maps[i].map.addTo($this.map);

                            for(var j = 0; j < tooltipLayers.length; j++){
                                tooltipLayers[j].openTooltip();
                            }
                        })(i, data);

                        // create legends
                        if(this._styles.regions[i].legend){
                            this._createLegend(this._styles.regions[i].legend.position, data.regions[i].colorMap);
                        }
                    }
                }

                // select regions which were selected before refresh
                for(var i in $this._curFilters){
                    this._selectFeature(i);
                }
                /*********/

                // add markers layers
                /*********/
                function formatMarkerText(i, j){
                    var text = '';

                    if(data.markers[i].markerNames && JSB.isDefined(data.markers[i].markerNames[j])){
                        text += data.markers[i].markerNames[j];
                    }

                    if(data.markers[i].markerValues && JSB.isDefined(data.markers[i].markerValues[j])){
                        if(data.markers[i].markerNames){
                            text += ' : ';
                        }

                        text += $this._format($this._styles.markers[i].displayContent, i, {y: data.markers[i].markerValues[j]});
                    }

                    return text;
                }

                var markersGroups = [];

                for(var i = 0; i < data.markers.length; i++){
                    markersGroups[i] = [];

                    createTooltip(this._styles.markers[i].tooltip);

                    switch(this._styles.markers[i].markerType){
                        case 'defaultMarker':
                            for(var j = 0; j < data.markers[i].coordinates.length; j++){
                                var coordinates = L.latLng(data.markers[i].coordinates[j][0], data.markers[i].coordinates[j][1]),
                                    marker = L.marker(coordinates);

                                if(this._styles.markers[i].tooltip){
                                    createTooltipEvents(marker, coordinates, data.markers[i].tooltipFilterData[j], this._styles.markers[i].tooltip);
                                }

                                if($this._styles.markers[i].filtration){
                                    (function(marker, filterData){
                                        marker.on('click', function(){
                                            $this.addFilter({
                                                sourceId: $this._dataSource.source,
                                                type: '$or',
                                                op: '$eq',
                                                field: filterData.binding,
                                                value: filterData.value
                                            });

                                            $this.refreshAll();

                                            $this.refresh();
                                        });
                                    })(marker, data.markers[i].filterData[j]);
                                }

                                /*
                                if(data.markers[i].markerValues && this._styles.markers[i].valueDisplayType === 'legend'){
                                    (function(content){
                                        marker.on({
                                            mouseover: function(evt){
                                                $this._infoControl.update(name, value);
                                            },
                                            mouseout: function(evt){
                                                $this._infoControl.update();
                                            }
                                        });
                                    })($this._format($this._styles.markers[i].displayContent, i, {y: data.markers[i].markerValues[j]}));
                                }
                                */

                                markersGroups[i].push(marker);
                            }

                            if(this._styles.markers[i].valueDisplayType === 'legend'){
                                this._createInfoControl();
                            }
                            break;
                        case 'widget':
                            (function(i){
                                JSB.lookup(data.markers[i].jsb, function(cls){
                                    for(var j = 0; j < data.markers[i].coordinates.length; j++){
                                        var widget = new cls();

                                        (function(widget){
                                            var icon = L.divIcon({ html: widget.getElement().get(0), iconSize: [$this._styles.markers[i].markerWidth, $this._styles.markers[i].markerHeight] }),
                                                marker = L.marker(L.latLng(data.markers[i].coordinates[j][0], data.markers[i].coordinates[j][1]), {icon: icon}); //.addTo($this.map);

                                            if($this._styles.markers[i].valueSkipping){
                                                widget.setWrapper($this.getWrapper(), {values: data.markers[i].values[j]});
                                            } else {
                                                widget.setWrapper($this.getWrapper(), {values: data.markers[i].values});
                                            }

                                            widget.ensureInitialized(function(){
                                                widget.refresh();
                                            });

                                            markersGroups[i].push(marker);
                                        })(widget);
                                    }
                                });
                            })(i);
                            break;
                        case 'heatCircles':
                            var color = $this._styles.markers[i].simpleColor;

                            for(var j = 0; j < data.markers[i].coordinates.length; j++){
                                var marker = undefined,
                                    icon = undefined,
                                    html = undefined;

                                if(data.markers[i].colorValues && data.markers[i].colorValues[j].color){
                                    color = data.markers[i].colorValues[j].color;
                                }

                                if(data.markers[i].colors){
                                    color = data.markers[i].colors[j];
                                }

                                if(this._styles.markers[i].valueDisplayType === 'onObject' && data.markers[i].markerValues && JSB.isDefined(data.markers[i].markerValues[j])){
                                    html = '<span>' + $this._format($this._styles.markers[i].displayContent, i, {y: data.markers[i].markerValues[j]}) + '</span>';
                                }

                                if($this._styles.markers[i].fixedSize){
                                    if($this._styles.markers[i].markerStyleType === 'hollowCircle'){
                                        icon = L.divIcon({ html: html, iconStyle: 'background-color: white; border: 2px solid ' + color + '; border-radius: ' + $this._styles.markers[i].fixedSize + 'px', className: 'heatCircles', iconSize: [$this._styles.markers[i].fixedSize, $this._styles.markers[i].fixedSize] });
                                    } else {
                                        icon = L.divIcon({ html: html, iconStyle: 'background-color: ' + color + '; border-radius: ' + $this._styles.markers[i].fixedSize + 'px', className: 'heatCircles', iconSize: [$this._styles.markers[i].fixedSize, $this._styles.markers[i].fixedSize] });
                                    }
                                } else {
                                    if($this._styles.markers[i].markerStyleType === 'hollowCircle'){
                                        icon = L.divIcon({ html: html, iconStyle: 'background-color: white; border: 2px solid ' + color + '; border-radius: ' + data.markers[i].sizeValues[j].size + 'px', className: 'heatCircles', iconSize: [data.markers[i].sizeValues[j].size, data.markers[i].sizeValues[j].size] });
                                    } else {
                                        icon = L.divIcon({ html: html, iconStyle: 'background-color: ' + color + '; border-radius: ' + data.markers[i].sizeValues[j].size + 'px', className: 'heatCircles', iconSize: [data.markers[i].sizeValues[j].size, data.markers[i].sizeValues[j].size] });
                                    }
                                }

                                marker = L.marker(L.latLng(data.markers[i].coordinates[j][0], data.markers[i].coordinates[j][1]), {icon: icon});

                                createTooltip(this._styles.markers[i].tooltip, 'markers', marker);

                                if($this._styles.markers[i].filtration){
                                    (function(marker, filterData){
                                        marker.on('click', function(){
                                            $this.addFilter({
                                                sourceId: $this._dataSource.source,
                                                type: '$or',
                                                op: '$eq',
                                                field: filterData.binding,
                                                value: filterData.value
                                            });

                                            $this.refreshAll();

                                            $this.refresh();
                                        });
                                    })(marker, data.markers[i].filterData[j]);
                                }

                                /*
                                if(data.markers[i].markerValues && this._styles.markers[i].valueDisplayType === 'legend'){
                                    (function(content){
                                        marker.on({
                                            mouseover: function(evt){
                                                $this._infoControl.update(name, value);
                                            },
                                            mouseout: function(evt){
                                                $this._infoControl.update();
                                            }
                                        });
                                    })($this._format($this._styles.markers[i].displayContent, i, {y: data.markers[i].markerValues[j]}));
                                }
                                */

                                markersGroups[i].push(marker);
                            }
                            /*
                            if(this._styles.markers[i].legend){
                                this._createLegend(this._styles.markers[i].legend.position, data.markers[i].colorMap);
                            }

                            if(this._styles.markers[i].valueDisplayType === 'legend'){
                                this._createInfoControl();
                            }
                            */
                            break;
                    }
                }

                this._layers.markers = [];
                for(var i = 0; i < markersGroups.length; i++){
                    if(this._styles.markers[i].useCluster){
                        var layer = L.markerClusterGroup();

                        for(var j = 0; j < markersGroups[i].length; j++){
                            layer.addLayer(markersGroups[i][j]);
                        }

                        this.map.addLayer(layer);
                    } else {
                        this._layers.markers.push(L.layerGroup(markersGroups[i], {pane: 'markerPane', layerType: 'markersGroup'}).addTo(this.map));
                    }
                }
                /*********/
            } catch(ex){
                console.log('Build chart exception!');
                console.log(ex);
            }
        },

        ensureDataLoaded: function(callback){
            this.ensureTrigger(['_mapLoaded', '_dataLoaded'], callback);
        },

        // filters
        _addFilter: function(evt, opts){
            var field = this.getContext().find("regions").values()[opts.seriesIndex].find('region').getBindingName();
            if(!field){
                return;
            }

            var fDesc = {
                sourceId: this._dataSource.source,
                type: '$or',
                op: '$eq',
                field: field,
                value: opts.regionValue
            };

            if(!evt.originalEvent.ctrlKey && !evt.originalEvent.shiftKey){
                for(var i in this._curFilters){
                    this._deselectFeature(i);
                    this.removeFilter(this._curFilters[i]);
                }

                this._curFilters = {};

                fDesc.type = '$and';
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

        loadMaps: function(maps){
            this.getElement().loader();

            var cCnt = 0;
            for(var i = 0; i < maps.length; i++){
            	(function(idx){
                	$this.ajax(maps[idx].path, null, function(result, obj){
                		if(result == 'success'){
	                		if(JSB.isString(obj)){
	                			obj = eval( '(' + obj + ')');
	                		}

	                		if(maps[idx].type && maps[idx].type === 'TopoJSON'){
	                		    obj = topojson.feature(obj, obj.objects[Object.keys(obj.objects)[0]]);
	                		}

	                		$this._maps[idx] = {
	                		    compareTo: maps[idx].compareTo,
	                		    data: obj
	                		};

	                		if(!$this.getJsb().maps){
	                		    $this.getJsb().maps = {};
	                		}
	                		$this.getJsb().maps[idx] = obj;
                		}
                		cCnt++;
                		if(cCnt == maps.length){
                			$this.setTrigger('_mapLoaded');
                		}
                	}, {timeout: 0, method:'get'});
            	})(i);
            }
        },

        // utils
        _createLegend: function(position, colorMap){
            var div, list,
                legend = L.control({position: position});

            legend.onAdd = function(map) {
                div = $this.$('<div class="legend ' + position + '"></div>');
                list = $this.$('<ul></ul>');

                div.append('<span>' + Formatter.format('{y:,.0f}', {y: colorMap[0].min}) + '</span>');
                div.append(list);

                for (var j = 0; j < colorMap.length; j++) {
                    list.append('<li><i style="background: #' + colorMap[j].color + ';"></i><span>' + Formatter.format('{y:,.0f}', {y: colorMap[j].max}) + '</span></li>');
                }

                return div.get(0);
            };

            legend.addTo(this.map);

            var leg = {
                control: legend,
                list: list
            };

            this._resizeLegend(leg);

            this._legends.push(leg);

            this._isNeedLegendsResize = true;
        },

        _createInfoControl: function(){
            if(this._infoControl){
                return;
            }

            this._infoControl = L.control({ position: this._styles.settings.infoControl.position });

            this._infoControl.onAdd = function(){
                var legend = $this.$('<div class="infoControl"><h4>' + $this._styles.settings.infoControl.header + '</h4></div>');

                this._content = $this.$('<div class="content"></div>');
                legend.append(this._content);

                return legend.get(0);
            };

            this._infoControl.update = function(content){
                this._content.empty().append(content);
            };

            this._infoControl.addTo(this.map);
        },

        _format: function(format, i, obj){
            return Formatter.format(format, JSB.merge(obj || {}, this._styles.contentData[i]));
        },

        _resizeLegend: function(legend){
            var list = legend.list,
                li = list && list.find('li > span'),
                max = 0;

            for(var i = 0; i < li.length; i++){
                var w = this.$(li[i]).width();
                if(w > max){
                    max = w;
                }
            }

            list.width(max + 25);
        },

        _isDefined: function(val, def){
            return JSB.isDefined(val) ? val : def;
        },

        findRegion: function(region, array){
            if(!region){
                return {};
            }

            for(var j = 0; j < array.length; j++){
                var name = array[j].region;
                if(!name){
                    continue;
                }

                //if(name.indexOf(region) > -1){
                if(name === region){
                    return {
                        index: j,
                        region: array[j]
                    };
                }
            }

            return {};
        }
    },

	$server: {
		$require: ['JSB.Workspace.WorkspaceController'],

		getWidgetEntry: function(wsId, wId){
			var w = WorkspaceController.getWorkspace(wsId);
			if(!w){
				throw new Error('Unable to find workspace with id: ' + wsId);
			}

			var widgetEntry = w.entry(wId);
			if(!widgetEntry || !JSB.isInstanceOf(widgetEntry, 'DataCube.Model.Widget')){
				throw new Error('Unable to find widget with id: ' + wId);
			}

			return widgetEntry;
		}
	}
}