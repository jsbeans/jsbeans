{
	$name: 'DataCube.CubeEditorView',
	$parent: 'JSB.Workspace.BrowserView',

	$client: {
		$require: 'JSB.Widgets.SplitLayoutManager',

		$constructor: function(opts){
			$base(opts);

			$jsb.loadCss('CubeEditorView.css');
			this.addClass('cubeEditorView');

			this.layoutManager = new SplitLayoutManager({
				defaultLayout: 'editor',
				layouts: {
					editor: {
						split: 'vertical',
						panes: [{
							key: 'leftPane',
							size: 0.7,
							split: 'horizontal',
							panes: [{
                                key: 'cubeEditor',
                                size: 0.75,
                                minSize: '100px',
                                widgets: 'cubeEditor'
                            },{
                                key: 'gridView',
                                minSize: '100px',
                                widgets: 'gridView'
                            }]
						},{
						    key: 'rightPane',
						    split: 'horizontal',
							panes: [{
                                key: 'cubePanel',
                                widgets: 'cubePanel'
							},{
                                key: 'sliceEditor',
                                widgets: 'sliceEditor'
							}]
						}]
					}
				},
				widgets: {
					cubeEditor: {
						jsb: 'DataCube.CubeEditor',
					},
					gridView: {
						jsb: 'DataCube.GridView',
						options: {
							noDataMessage: 'Выберите объект на диаграмме'
						},
						title: 'Таблица'
					},
					cubePanel: {
					    jsb: 'DataCube.CubePanel'
					},
					sliceEditor: {
					    jsb: 'DataCube.SliceEditor'
					}
				},
				widgetsReadyCallback: function(){
				    $this.setTrigger('_layoutInitialized');
				}
			});
			this.append(this.layoutManager);

			// todo: toggle slice properties
		},

		refresh: function(){
			this.ensureTrigger(['_layoutInitialized'], function(){
			    $this.layoutManager.getWidget('cubeEditor').refresh($this.getCurrentEntry());
			    $this.layoutManager.getWidget('gridView').clear();
			});
		}
	},

	$server: {
		$require: 'JSB.Workspace.WorkspaceController',
		$bootstrap: function(){
			WorkspaceController.registerBrowserView(null, this, {
				priority: 2,
				acceptNode: 'DataCube.CubeNode',
				caption: 'Структура',
				icon: 'data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiIHN0YW5kYWxvbmU9Im5vIj8+DQo8IS0tIEdlbmVyYXRvcjogQWRvYmUgSWxsdXN0cmF0b3IgMTYuMC4wLCBTVkcgRXhwb3J0IFBsdWctSW4gLiBTVkcgVmVyc2lvbjogNi4wMCBCdWlsZCAwKSAgLS0+DQoNCjxzdmcNCiAgIHhtbG5zOmRjPSJodHRwOi8vcHVybC5vcmcvZGMvZWxlbWVudHMvMS4xLyINCiAgIHhtbG5zOmNjPSJodHRwOi8vY3JlYXRpdmVjb21tb25zLm9yZy9ucyMiDQogICB4bWxuczpyZGY9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkvMDIvMjItcmRmLXN5bnRheC1ucyMiDQogICB4bWxuczpzdmc9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIg0KICAgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIg0KICAgeG1sbnM6c29kaXBvZGk9Imh0dHA6Ly9zb2RpcG9kaS5zb3VyY2Vmb3JnZS5uZXQvRFREL3NvZGlwb2RpLTAuZHRkIg0KICAgeG1sbnM6aW5rc2NhcGU9Imh0dHA6Ly93d3cuaW5rc2NhcGUub3JnL25hbWVzcGFjZXMvaW5rc2NhcGUiDQogICB2ZXJzaW9uPSIxLjEiDQogICBpZD0iQ2FwYV8xIg0KICAgeD0iMHB4Ig0KICAgeT0iMHB4Ig0KICAgd2lkdGg9IjIwIg0KICAgaGVpZ2h0PSIyMCINCiAgIHZpZXdCb3g9IjAgMCAyMCAyMCINCiAgIHhtbDpzcGFjZT0icHJlc2VydmUiDQogICBpbmtzY2FwZTp2ZXJzaW9uPSIwLjkxIHIxMzcyNSINCiAgIHNvZGlwb2RpOmRvY25hbWU9ImN1YmVlZGl0LnN2ZyI+PG1ldGFkYXRhDQogICAgIGlkPSJtZXRhZGF0YTQxIj48cmRmOlJERj48Y2M6V29yaw0KICAgICAgICAgcmRmOmFib3V0PSIiPjxkYzpmb3JtYXQ+aW1hZ2Uvc3ZnK3htbDwvZGM6Zm9ybWF0PjxkYzp0eXBlDQogICAgICAgICAgIHJkZjpyZXNvdXJjZT0iaHR0cDovL3B1cmwub3JnL2RjL2RjbWl0eXBlL1N0aWxsSW1hZ2UiIC8+PGRjOnRpdGxlPjwvZGM6dGl0bGU+PC9jYzpXb3JrPjwvcmRmOlJERj48L21ldGFkYXRhPjxkZWZzDQogICAgIGlkPSJkZWZzMzkiIC8+PHNvZGlwb2RpOm5hbWVkdmlldw0KICAgICBwYWdlY29sb3I9IiNmZmZmZmYiDQogICAgIGJvcmRlcmNvbG9yPSIjNjY2NjY2Ig0KICAgICBib3JkZXJvcGFjaXR5PSIxIg0KICAgICBvYmplY3R0b2xlcmFuY2U9IjEwIg0KICAgICBncmlkdG9sZXJhbmNlPSIxMCINCiAgICAgZ3VpZGV0b2xlcmFuY2U9IjEwIg0KICAgICBpbmtzY2FwZTpwYWdlb3BhY2l0eT0iMCINCiAgICAgaW5rc2NhcGU6cGFnZXNoYWRvdz0iMiINCiAgICAgaW5rc2NhcGU6d2luZG93LXdpZHRoPSIxOTIwIg0KICAgICBpbmtzY2FwZTp3aW5kb3ctaGVpZ2h0PSIxMTM4Ig0KICAgICBpZD0ibmFtZWR2aWV3MzciDQogICAgIHNob3dncmlkPSJmYWxzZSINCiAgICAgaW5rc2NhcGU6em9vbT0iNi4xNjk5MzQ2Ig0KICAgICBpbmtzY2FwZTpjeD0iLTkuNjI2OTkwOCINCiAgICAgaW5rc2NhcGU6Y3k9Ii0zMS45NDg0MDUiDQogICAgIGlua3NjYXBlOndpbmRvdy14PSItOCINCiAgICAgaW5rc2NhcGU6d2luZG93LXk9Ii04Ig0KICAgICBpbmtzY2FwZTp3aW5kb3ctbWF4aW1pemVkPSIxIg0KICAgICBpbmtzY2FwZTpjdXJyZW50LWxheWVyPSJDYXBhXzEiIC8+PGcNCiAgICAgaWQ9Imc3Ig0KICAgICB0cmFuc2Zvcm09InRyYW5zbGF0ZSgwLC01OTIpIiAvPjxnDQogICAgIGlkPSJnOSINCiAgICAgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoMCwtNTkyKSIgLz48Zw0KICAgICBpZD0iZzExIg0KICAgICB0cmFuc2Zvcm09InRyYW5zbGF0ZSgwLC01OTIpIiAvPjxnDQogICAgIGlkPSJnMTMiDQogICAgIHRyYW5zZm9ybT0idHJhbnNsYXRlKDAsLTU5MikiIC8+PGcNCiAgICAgaWQ9ImcxNSINCiAgICAgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoMCwtNTkyKSIgLz48Zw0KICAgICBpZD0iZzE3Ig0KICAgICB0cmFuc2Zvcm09InRyYW5zbGF0ZSgwLC01OTIpIiAvPjxnDQogICAgIGlkPSJnMTkiDQogICAgIHRyYW5zZm9ybT0idHJhbnNsYXRlKDAsLTU5MikiIC8+PGcNCiAgICAgaWQ9ImcyMSINCiAgICAgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoMCwtNTkyKSIgLz48Zw0KICAgICBpZD0iZzIzIg0KICAgICB0cmFuc2Zvcm09InRyYW5zbGF0ZSgwLC01OTIpIiAvPjxnDQogICAgIGlkPSJnMjUiDQogICAgIHRyYW5zZm9ybT0idHJhbnNsYXRlKDAsLTU5MikiIC8+PGcNCiAgICAgaWQ9ImcyNyINCiAgICAgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoMCwtNTkyKSIgLz48Zw0KICAgICBpZD0iZzI5Ig0KICAgICB0cmFuc2Zvcm09InRyYW5zbGF0ZSgwLC01OTIpIiAvPjxnDQogICAgIGlkPSJnMzEiDQogICAgIHRyYW5zZm9ybT0idHJhbnNsYXRlKDAsLTU5MikiIC8+PGcNCiAgICAgaWQ9ImczMyINCiAgICAgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoMCwtNTkyKSIgLz48Zw0KICAgICBpZD0iZzM1Ig0KICAgICB0cmFuc2Zvcm09InRyYW5zbGF0ZSgwLC01OTIpIiAvPjxnDQogICAgIGlkPSJnNDE5OSINCiAgICAgdHJhbnNmb3JtPSJtYXRyaXgoMC4wMzI0NDIyNiwwLDAsMC4wMzI0NDIyNiwwLjA3NzA1MjczLDE5LjI3MDM4NCkiPjxwYXRoDQogICAgICAgc3R5bGU9ImZpbGw6IzE4NjQ5ZjtmaWxsLW9wYWNpdHk6MSINCiAgICAgICBzb2RpcG9kaTpub2RldHlwZXM9ImNjY2NzY2NjYyINCiAgICAgICBpbmtzY2FwZTpjb25uZWN0b3ItY3VydmF0dXJlPSIwIg0KICAgICAgIGlkPSJwYXRoNS0wIg0KICAgICAgIGQ9Im0gMS42NTksLTEwNy4yNjMyMyAtMC42NTgsLTI3OC4xNDIgYyAtMC4wMzIsLTEzLjY4NiAxMy45NSwtMjIuOTM4IDI2LjUzNCwtMTcuNTU5IGwgMjUzLjIwNiwxMDguMjQxIGMgNi45OTcsMi45OTEgMTEuNTQyLDkuODU5IDExLjU2LDE3LjQ2OCBsIDAuNjU4LDI3OC4xNDIgYyAwLjAzMiwxMy42ODcgLTEzLjk1LDIyLjkzOSAtMjYuNTM0LDE3LjU2IEwgMTMuMjE5LC04OS43OTQyMyBjIC02Ljk5NywtMi45OTEgLTExLjU0MywtOS44NTkgLTExLjU2LC0xNy40NjkgeiIgLz48cGF0aA0KICAgICAgIHN0eWxlPSJmaWxsOiMxNDU2OGI7ZmlsbC1vcGFjaXR5OjEiDQogICAgICAgc29kaXBvZGk6bm9kZXR5cGVzPSJjY3NjY2NjY2NjYyINCiAgICAgICBpbmtzY2FwZTpjb25uZWN0b3ItY3VydmF0dXJlPSIwIg0KICAgICAgIGlkPSJwYXRoNS0wLTYiDQogICAgICAgZD0ibSA1OTEuMjYwMDIsLTQwNi4yMjcwNyBjIDEwLjA0MywtMC4wMjUgMTkuMDU2LDguMDU0IDE5LjA4MSwxOS4wMjIgbCAwLjY1OCwyNzguMTQxOTkgYyAwLjAxOCw3LjYwOSAtNC40OTUsMTQuNSAtMTEuNDc4LDE3LjUyMyBsIC0yNTIuNjksMTA5LjQzOCBjIC0yLjQ5MywxLjA3OSAtNS4wNDcsMS41ODMgLTcuNTM0LDEuNTkgLTEwLjA0NCwwLjAyMyAtMTkuMDU4LC04LjA1NSAtMTkuMDgzLC0xOS4wMjIgbCAtMC42NTgsLTI3OC4xNDMgYyAtMC4wMTksLTcuNjA5IDQuNDk1LC0xNC41IDExLjQ3OSwtMTcuNTIzIGwgMjUyLjY5LC0xMDkuNDM2OTkgYyAyLjQ5MywtMS4wODEgNS4wNDYsLTEuNTg0IDcuNTM1LC0xLjU5IHoiIC8+PGcNCiAgICAgICB0cmFuc2Zvcm09InRyYW5zbGF0ZSgwLC01OTIpIg0KICAgICAgIHN0eWxlPSJmaWxsOiMxYzc4YzA7ZmlsbC1vcGFjaXR5OjEiDQogICAgICAgaWQ9ImczIj48cGF0aA0KICAgICAgICAgc3R5bGU9ImZpbGw6IzFjNzhjMDtmaWxsLW9wYWNpdHk6MSINCiAgICAgICAgIHNvZGlwb2RpOm5vZGV0eXBlcz0iY2NjY2NjY2NjY2MiDQogICAgICAgICBpbmtzY2FwZTpjb25uZWN0b3ItY3VydmF0dXJlPSIwIg0KICAgICAgICAgaWQ9InBhdGg1Ig0KICAgICAgICAgZD0ibSAzMDQuMDgzLDAgYyAyLjYzMiwtMC4wMDYgNS4yNjYsMC41MzMgNy43MjgsMS42MTggbCAyNjYuNDAzLDExNy40MzkgYyAxNS4xMTIsNi42NjMgMTUuMTYzLDI4LjA4OCAwLjA4MiwzNC44MjEgTCAzMTIuNDUxLDI3Mi41NzcgYyAtMi40NTYsMS4wOTcgLTUuMDg4LDEuNjQ4IC03LjcyMSwxLjY1NSAtMi42MzIsMC4wMDYgLTUuMjY2LC0wLjUzMyAtNy43MjgsLTEuNjE4IEwgMzAuNiwxNTUuMTc1IEMgMTUuNDg3LDE0OC41MTMgMTUuNDM3LDEyNy4wODcgMzAuNTE3LDEyMC4zNTQgTCAyOTYuMzYxLDEuNjU1IEMgMjk4LjgxOCwwLjU1OCAzMDEuNDQ5LDAuMDA2IDMwNC4wODMsMCBaIiAvPjwvZz48L2c+PGcNCiAgICAgaWQ9Imc4Ig0KICAgICB0cmFuc2Zvcm09InRyYW5zbGF0ZSg5Ljk1NzkyOTcsLTQ5MC4wMzA3NSkiIC8+PGcNCiAgICAgaWQ9ImcxMCINCiAgICAgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoOS45NTc5Mjk3LC00OTAuMDMwNzUpIiAvPjxnDQogICAgIGlkPSJnMTIiDQogICAgIHRyYW5zZm9ybT0idHJhbnNsYXRlKDkuOTU3OTI5NywtNDkwLjAzMDc1KSIgLz48Zw0KICAgICBpZD0iZzE0Ig0KICAgICB0cmFuc2Zvcm09InRyYW5zbGF0ZSg5Ljk1NzkyOTcsLTQ5MC4wMzA3NSkiIC8+PGcNCiAgICAgaWQ9ImcxNiINCiAgICAgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoOS45NTc5Mjk3LC00OTAuMDMwNzUpIiAvPjxnDQogICAgIGlkPSJnMTgiDQogICAgIHRyYW5zZm9ybT0idHJhbnNsYXRlKDkuOTU3OTI5NywtNDkwLjAzMDc1KSIgLz48Zw0KICAgICBpZD0iZzIwIg0KICAgICB0cmFuc2Zvcm09InRyYW5zbGF0ZSg5Ljk1NzkyOTcsLTQ5MC4wMzA3NSkiIC8+PGcNCiAgICAgaWQ9ImcyMiINCiAgICAgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoOS45NTc5Mjk3LC00OTAuMDMwNzUpIiAvPjxnDQogICAgIGlkPSJnMjQiDQogICAgIHRyYW5zZm9ybT0idHJhbnNsYXRlKDkuOTU3OTI5NywtNDkwLjAzMDc1KSIgLz48Zw0KICAgICBpZD0iZzI2Ig0KICAgICB0cmFuc2Zvcm09InRyYW5zbGF0ZSg5Ljk1NzkyOTcsLTQ5MC4wMzA3NSkiIC8+PGcNCiAgICAgaWQ9ImcyOCINCiAgICAgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoOS45NTc5Mjk3LC00OTAuMDMwNzUpIiAvPjxnDQogICAgIGlkPSJnMzAiDQogICAgIHRyYW5zZm9ybT0idHJhbnNsYXRlKDkuOTU3OTI5NywtNDkwLjAzMDc1KSIgLz48Zw0KICAgICBpZD0iZzMyIg0KICAgICB0cmFuc2Zvcm09InRyYW5zbGF0ZSg5Ljk1NzkyOTcsLTQ5MC4wMzA3NSkiIC8+PGcNCiAgICAgaWQ9ImczNCINCiAgICAgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoOS45NTc5Mjk3LC00OTAuMDMwNzUpIiAvPjxnDQogICAgIGlkPSJnMzYiDQogICAgIHRyYW5zZm9ybT0idHJhbnNsYXRlKDkuOTU3OTI5NywtNDkwLjAzMDc1KSIgLz48Zw0KICAgICBpZD0iZzMtNSINCiAgICAgdHJhbnNmb3JtPSJtYXRyaXgoMC4wMjc5NzkxNywwLDAsMC4wMjc5NzkxNyw2LjcxNTAwNTcsNi4zNDA0NjU1KSINCiAgICAgc3R5bGU9ImZpbGw6I2ZmZmZmZjtmaWxsLW9wYWNpdHk6MTtzdHJva2U6bm9uZSI+PHBhdGgNCiAgICAgICBkPSJtIDQ0OCwyNTYgYyAwLC0xMiAtMS4yNSwtMjMuNjU2IC0zLjM0NCwtMzUuMDMxIGwgNjUuMDMxLC0zNy41MzEgLTY0LC0xMTAuODc1IC02NS4wMzEsMzcuNTYzIEMgMzYyLjkzOCw5NSAzNDIuNDA2LDgzLjA5NCAzMjAsNzUuMTU2IEwgMzIwLDAgMTkyLDAgMTkyLDc1LjE1NiBDIDE2OS41OTQsODMuMDk0IDE0OS4wNjIsOTUgMTMxLjM0NCwxMTAuMTI1IEwgNjYuMzEzLDcyLjU2MyAyLjMxMywxODMuNDM4IDY3LjM0NCwyMjEgQyA2NS4yNSwyMzIuMzQ0IDY0LDI0NCA2NCwyNTYgYyAwLDExLjk2OSAxLjI1LDIzLjYyNSAzLjM0NCwzNSBsIC02NS4wMzEsMzcuNTYzIDY0LDExMC44NzUgNjUuMDYzLC0zNy41NjMgYyAxNy43MTksMTUuMTU2IDM4LjIxOSwyNy4wMzEgNjAuNjI1LDM0Ljk2OSBsIDAsNzUuMTU2IDEyOCwwIDAsLTc1LjE1NiBjIDIyLjQwNiwtNy45MzggNDIuOTM4LC0xOS44MTMgNjAuNjI1LC0zNC45NjkgbCA2NS4wNjMsMzcuNTYzIDY0LC0xMTAuODc1IC02NS4wMzEsLTM3LjUzMSBDIDQ0Ni43NSwyNzkuNjU2IDQ0OCwyNjcuOTY5IDQ0OCwyNTYgWiBtIDE3Ljk2OSw4NC4yODEgLTMyLDU1LjQzOCBMIDM5Ni42MjUsMzc0LjE1NiAzNzcsMzYyLjg0NCAzNTkuODEyLDM3Ny41NjMgYyAtMTQuODEzLDEyLjcxOSAtMzEuODEzLDIyLjUgLTUwLjUsMjkuMTI1IGwgLTIxLjMxMiw3LjUzMSAwLDIyLjYyNSAwLDQzLjE1NiAtNjQsMCAwLC00My4xNTYgMCwtMjIuNjI1IC0yMS4zMTMsLTcuNTMxIGMgLTE4LjY1NiwtNi42MjUgLTM1LjYyNSwtMTYuNDA2IC01MC41LC0yOS4xMjUgTCAxMzUsMzYyLjg0NCAxMTUuMzc1LDM3NC4xNTcgNzguMDMxLDM5NS43MiA0NiwzNDAuMjgxIDgzLjM0NCwzMTguNzE4IDEwMi45MDcsMzA3LjQwNSA5OC44MTMsMjg1LjE4NiBDIDk2LjkzOCwyNzQuOTM4IDk2LDI2NS4zNzUgOTYsMjU2IGMgMCwtOS4zNzUgMC45MzgsLTE4LjkzOCAyLjgxMywtMjkuMTg4IEwgMTAyLjkwNywyMDQuNTkzIDgzLjM0NCwxOTMuMzEyIDQ2LDE3MS43NSBsIDMyLjAzMSwtNTUuNDY5IDM3LjMxMywyMS41MzEgMTkuNTk0LDExLjMxMyAxNy4xODgsLTE0LjY1NiBjIDE0LjkzOCwtMTIuNzUgMzEuOTM4LC0yMi41MzEgNTAuNTYzLC0yOS4xNTYgTCAyMjQsOTcuNzUgMjI0LDc1LjE1NiAyMjQsMzIgbCA2NCwwIDAsNDMuMTU2IDAsMjIuNTk0IDIxLjMxMyw3LjU2MyBjIDE4LjYyNSw2LjYyNSAzNS42NTYsMTYuNDA2IDUwLjU2MywyOS4xNTYgbCAxNy4yMTksMTQuNjU2IDE5LjU2MywtMTEuMzEzIDM3LjMxMywtMjEuNTMxIDMyLDU1LjQzOCAtMzcuMzEzLDIxLjUzMSAtMTkuNTYzLDExLjMxMyA0LjA5NCwyMi4xODggQyA0MTUuMDk0LDIzNy4wNjMgNDE2LDI0Ni42MjUgNDE2LDI1NiBjIDAsOS4zNzUgLTAuOTA2LDE4LjkzOCAtMi44MTMsMjkuMjUgbCAtNC4wOTQsMjIuMjE5IDE5LjU2MywxMS4yODEgMzcuMzEzLDIxLjUzMSB6Ig0KICAgICAgIGlkPSJwYXRoNS0wOSINCiAgICAgICBpbmtzY2FwZTpjb25uZWN0b3ItY3VydmF0dXJlPSIwIg0KICAgICAgIHN0eWxlPSJmaWxsOiNmZmZmZmY7ZmlsbC1vcGFjaXR5OjE7c3Ryb2tlOm5vbmUiIC8+PHBhdGgNCiAgICAgICBkPSJtIDI1NiwxOTIgYyAzNS4yODEsMCA2NCwyOC42ODggNjQsNjQgMCwzNS4yODEgLTI4LjcxOSw2NCAtNjQsNjQgLTM1LjMxMywwIC02NCwtMjguNzE5IC02NCwtNjQgMCwtMzUuMzEyIDI4LjY4OCwtNjQgNjQsLTY0IG0gMCwtMzIgYyAtNTMsMCAtOTYsNDMgLTk2LDk2IDAsNTMgNDMsOTYgOTYsOTYgNTMsMCA5NiwtNDMgOTYsLTk2IDAsLTUzIC00MywtOTYgLTk2LC05NiBsIDAsMCB6Ig0KICAgICAgIGlkPSJwYXRoNyINCiAgICAgICBpbmtzY2FwZTpjb25uZWN0b3ItY3VydmF0dXJlPSIwIg0KICAgICAgIHN0eWxlPSJmaWxsOiNmZmZmZmY7ZmlsbC1vcGFjaXR5OjE7c3Ryb2tlOm5vbmUiIC8+PC9nPjxwYXRoDQogICAgIHN0eWxlPSJmaWxsOiNkNDU1MDA7ZmlsbC1vcGFjaXR5OjE7c3Ryb2tlOm5vbmU7c3Ryb2tlLXdpZHRoOjAuMDU3MzAyNjI7c3Ryb2tlLWxpbmVjYXA6cm91bmQ7c3Ryb2tlLWxpbmVqb2luOnJvdW5kO3N0cm9rZS1taXRlcmxpbWl0OjQ7c3Ryb2tlLWRhc2hhcnJheTpub25lO3N0cm9rZS1vcGFjaXR5OjEiDQogICAgIGQ9Im0gMTIuOTg3NDc0LDE4LjgwMDI2OSAtMS43M2UtNCwtMC45MTE2ODggLTAuNTM0MTU4LC0wLjE4ODY1OCBjIC0wLjUwNTczNCwtMC4xNzg2MTkgLTEuMTk4ODU3LC0wLjU5NzA1OSAtMS43MjU0OTUsLTEuMDQxNjkgTCAxMC40ODk5NCwxNi40NTc1NDIgOS42OTk0OTI4LDE2LjkxMTYwOSA4LjkwOTA0NTgsMTcuMzY1Njc2IDguNDkzMzc0MSwxNi42NDU1NTUgQyA4LjI2NDc1NTMsMTYuMjQ5NDg4IDguMDk0MTI4OCwxNS44OTg4NTcgOC4xMTQyMDU1LDE1Ljg2NjM3MiA4LjEzNDI4MTIsMTUuODMzODkzIDguNDgwNzUwMiwxNS42MTkxOCA4Ljg4NDEzNTksMTUuMzg5MjQ0IEwgOS42MTc1NjQ3LDE0Ljk3MTE3NyA5LjU3NTA5OTIsMTQuNzA1OTU5IEMgOS40MTE1MTAyLDEzLjY4NDE3NyA5LjQxMTIxMDUsMTMuMjU5ODgzIDkuNTczMzYzNiwxMi4zMTIwMTIgTCA5LjYxOTkzNjcsMTIuMDM5ODEzIDguODcwMzk1MywxMS42MDkyMTUgQyA4LjQ1ODE0ODYsMTEuMzcyMzg2IDguMTEyNTk5NSwxMS4xNTE3NDkgOC4xMDI1MDg1LDExLjExODkxIDguMDkyNDQxNywxMS4wODYwNzIgOC4yNzA4OTAyLDEwLjc0MDY2NiA4LjQ5OTExMzMsMTAuMzUxMzQzIGwgMC40MTQ5NTIsLTAuNzA3ODYyMSAwLjc4OTk2OTIsMC40NTM0NTcxIDAuNzg5OTY3NSwwLjQ1MzQ1NSAwLjQzMDMxMSwtMC4zNTcxNzUgYyAwLjQ2NjQ4OSwtMC4zODcyMDQ0IDEuMTM2MjU2LC0wLjc2NTcxNiAxLjY4NDMwNCwtMC45NTE4NjczIGwgMC4zNDU4MjQsLTAuMTE3NDYyNiAwLjAxODQsLTAuOTM4NTk5OSAwLjAxODQsLTAuOTM4NiAwLjg2MDE0LDAgMC44NjAxMzksMCAwLDAuOTE5MzgwNyAwLDAuOTE5MzgwNSAwLjQxNDQwNCwwLjE1MDA1OTEgYyAwLjY2MjQ3NCwwLjIzOTg4NTcgMS4xMjQ1MjUsMC40OTYwMzIxIDEuNjU0NTY4LDAuOTE3MjM4NSBsIDAuNDk0ODkxLDAuMzkzMjcyIDAuNzg0NDMyLC0wLjQ1MzY4OSAwLjc4NDQzMiwtMC40NTM2ODkyIDAuNDI1NDk2LDAuNzMyNDcyMiBjIDAuMjM0MDI0LDAuNDAyODYgMC40MDYyNzMsMC43NTE2OTYgMC4zODI3NzcsMC43NzUxOTIgLTAuMDIzNSwwLjAyMzUgLTAuMzYxNjA5LDAuMjI3MTY5IC0wLjc1MTM2MywwLjQ1MjYwNyBsIC0wLjcwODY0MywwLjQwOTg4NiAwLjAzMTY5LDAuMzg3MTYzIGMgMC4wNTA5LDAuNjIxOTQ5IDAuMDM5MzIsMS44MTQ3NzYgLTAuMDIxNTQsMi4yMTc0NDMgbCAtMC4wNTYxNywwLjM3MTU3OCAwLjczNTUyNCwwLjQxMzQxNCBjIDAuNDA0NTM3LDAuMjI3Mzc5IDAuNzUwNTY5LDAuNDM3NzYgMC43Njg5NTgsMC40Njc1MTUgMC4wNDAwOSwwLjA2NDg3IC0wLjc1NjMwMiwxLjQ1OTA4IC0wLjgzMzQ0NiwxLjQ1OTA4IC0wLjAyOTU5LDAgLTAuMzg1NDM0LC0wLjE5Mzk0IC0wLjc5MDc4MywtMC40MzA5OCAtMC40MDUzNDksLTAuMjM3MDM5IC0wLjc0ODM4MiwtMC40MzA5OCAtMC43NjIyOTUsLTAuNDMwOTggLTAuMDEzOTEsMCAtMC4xNjc2NTgsMC4xMjMyMTQgLTAuMzQxNjU3LDAuMjczODEgLTAuNTE2Mjc5LDAuNDQ2ODM2IC0wLjk4MDYxLDAuNzI1MDE5IC0xLjU5NzAzNSwwLjk1Njc5NCBsIC0wLjU4MTA5MSwwLjIxODQ5IC0wLjAxODQ0LDAuODk5OTE3IC0wLjAxODQ0LDAuODk5OTE2IC0wLjg2MDA4OSwwIC0wLjg2MDA4OSwwIC0xLjcyZS00LC0wLjkxMTY4OSB6IG0gMi4wNzAzMDMsLTIuODYyMTAxIGMgMC41NDIwOCwtMC4yNjg2MDUgMS4wNDk1MTYsLTAuNzgyOTMyIDEuMjk3MjY1LC0xLjMxNDg4MSAwLjE1ODUzMywtMC4zNDAzODcgMC4xNzc3ODIsLTAuNDYwMTQ0IDAuMTc4NzgyLC0xLjExMjIwNiAwLjAwMTEsLTAuNjg4OTcgLTAuMDEwOTksLTAuNzU1MzQ0IC0wLjIxMDcxLC0xLjE2MTAzMyAtMC42ODMwMSwtMS4zODczOTEgLTIuMzEyMDczLC0xLjk0MTY1MSAtMy42Nzg4OTUsLTEuMjUxNjgyIC0xLjU4MzQ5OCwwLjc5OTM0NiAtMS45NTk5NTksMi45Mzc3MjMgLTAuNzQ1NzIxLDQuMjM1ODQzIDAuNjA4ODYsMC42NTA5MiAxLjE2MzE0NywwLjg3NTgzNyAyLjA4MzcxNywwLjg0NTUyOCAwLjU1NzQ0OSwtMC4wMTgzNSAwLjY4MTE1MywtMC4wNDYxMyAxLjA3NTU2MiwtMC4yNDE1NjkgeiINCiAgICAgaWQ9InBhdGg0MjY4Ig0KICAgICBpbmtzY2FwZTpjb25uZWN0b3ItY3VydmF0dXJlPSIwIiAvPjwvc3ZnPg=='
			});
		}
	}
}