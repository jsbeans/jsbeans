/** DataCube - jsBeans extension | jsbeans.org (MIT Licence) | (c) Special Information Systems, LLC */

{
	$name: 'DataCube.Model.ExcelFile',
	$parent: 'JSB.Workspace.FileEntry',
	
	$expose: {
		priority: 0.5, 
		nodeType:'DataCube.ExcelFileNode',
		create: false,
		move: true,
		remove: true,
		share: true,
		rename: true,
		icon: 'data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiIHN0YW5kYWxvbmU9Im5vIj8+DQo8c3ZnDQogICB4bWxuczpkYz0iaHR0cDovL3B1cmwub3JnL2RjL2VsZW1lbnRzLzEuMS8iDQogICB4bWxuczpjYz0iaHR0cDovL2NyZWF0aXZlY29tbW9ucy5vcmcvbnMjIg0KICAgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIg0KICAgeG1sbnM6c3ZnPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyINCiAgIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyINCiAgIHhtbG5zOnNvZGlwb2RpPSJodHRwOi8vc29kaXBvZGkuc291cmNlZm9yZ2UubmV0L0RURC9zb2RpcG9kaS0wLmR0ZCINCiAgIHhtbG5zOmlua3NjYXBlPSJodHRwOi8vd3d3Lmlua3NjYXBlLm9yZy9uYW1lc3BhY2VzL2lua3NjYXBlIg0KICAgZW5hYmxlLWJhY2tncm91bmQ9Im5ldyAwIDAgMzAgMzAiDQogICBoZWlnaHQ9IjMwcHgiDQogICBpZD0iTGF5ZXJfMSINCiAgIHZlcnNpb249IjEuMSINCiAgIHZpZXdCb3g9IjAgMCAzMCAzMCINCiAgIHdpZHRoPSIzMHB4Ig0KICAgeG1sOnNwYWNlPSJwcmVzZXJ2ZSINCiAgIGlua3NjYXBlOnZlcnNpb249IjAuOTEgcjEzNzI1Ig0KICAgc29kaXBvZGk6ZG9jbmFtZT0iaWZfZXhjZWxfMjcyNjk3LnN2ZyI+PG1ldGFkYXRhDQogICAgIGlkPSJtZXRhZGF0YTE1Ij48cmRmOlJERj48Y2M6V29yaw0KICAgICAgICAgcmRmOmFib3V0PSIiPjxkYzpmb3JtYXQ+aW1hZ2Uvc3ZnK3htbDwvZGM6Zm9ybWF0PjxkYzp0eXBlDQogICAgICAgICAgIHJkZjpyZXNvdXJjZT0iaHR0cDovL3B1cmwub3JnL2RjL2RjbWl0eXBlL1N0aWxsSW1hZ2UiIC8+PC9jYzpXb3JrPjwvcmRmOlJERj48L21ldGFkYXRhPjxkZWZzDQogICAgIGlkPSJkZWZzMTMiIC8+PHNvZGlwb2RpOm5hbWVkdmlldw0KICAgICBwYWdlY29sb3I9IiNmZmZmZmYiDQogICAgIGJvcmRlcmNvbG9yPSIjNjY2NjY2Ig0KICAgICBib3JkZXJvcGFjaXR5PSIxIg0KICAgICBvYmplY3R0b2xlcmFuY2U9IjEwIg0KICAgICBncmlkdG9sZXJhbmNlPSIxMCINCiAgICAgZ3VpZGV0b2xlcmFuY2U9IjEwIg0KICAgICBpbmtzY2FwZTpwYWdlb3BhY2l0eT0iMCINCiAgICAgaW5rc2NhcGU6cGFnZXNoYWRvdz0iMiINCiAgICAgaW5rc2NhcGU6d2luZG93LXdpZHRoPSIxOTIwIg0KICAgICBpbmtzY2FwZTp3aW5kb3ctaGVpZ2h0PSIxMTc4Ig0KICAgICBpZD0ibmFtZWR2aWV3MTEiDQogICAgIHNob3dncmlkPSJmYWxzZSINCiAgICAgaW5rc2NhcGU6em9vbT0iNy44NjY2NjY3Ig0KICAgICBpbmtzY2FwZTpjeD0iMTUiDQogICAgIGlua3NjYXBlOmN5PSIxNSINCiAgICAgaW5rc2NhcGU6d2luZG93LXg9IjE5MTIiDQogICAgIGlua3NjYXBlOndpbmRvdy15PSItOCINCiAgICAgaW5rc2NhcGU6d2luZG93LW1heGltaXplZD0iMSINCiAgICAgaW5rc2NhcGU6Y3VycmVudC1sYXllcj0iTGF5ZXJfMSIgLz48Zw0KICAgICBpZD0iZzMiPjxwYXRoDQogICAgICAgY2xpcC1ydWxlPSJldmVub2RkIg0KICAgICAgIGQ9Ik0yOC43MDUsNy41MDZsLTUuNDYxLTYuMzMzbC0xLjA4LTEuMjU0SDkuMjYyICAgYy0xLjczMiwwLTMuMTMzLDEuNDAzLTMuMTMzLDMuMTM2VjcuMDRoMS45NDJMOC4wNywzLjgxOGMwLjAwMi0wLjk3NSwwLjc4Ni0xLjc2NCwxLjc1OC0xLjc2NGwxMS4wMzQtMC4wMXY1LjIyOCAgIGMwLjAwMiwxLjk0NywxLjU3NSwzLjUyMywzLjUyNCwzLjUyM2gzLjgxOWwtMC4xODgsMTUuMDgxYy0wLjAwMywwLjk3LTAuNzksMS43NTMtMS43NTksMS43NjFsLTE2LjU3LTAuMDA4ICAgYy0wLjg4NywwLTEuNjAxLTAuODctMS42MDUtMS45NDJ2LTEuMjc3SDYuMTM4djEuOTA0YzAsMS45MTIsMS4yODIsMy40NjgsMi44NTYsMy40NjhsMTcuODMxLTAuMDA0ICAgYzEuNzMyLDAsMy4xMzctMS40MSwzLjEzNy0zLjEzOVY4Ljk2NkwyOC43MDUsNy41MDYiDQogICAgICAgZmlsbD0iIzQzNDQ0MCINCiAgICAgICBmaWxsLXJ1bGU9ImV2ZW5vZGQiDQogICAgICAgaWQ9InBhdGg1IiAvPjxwYXRoDQogICAgICAgZD0iTTIwLjIyMywyNS4zODJIMFY2LjA2OGgyMC4yMjNWMjUuMzgyIE0xLjk0MywyMy40MzhoMTYuMzMzVjguMDEySDEuOTQzIg0KICAgICAgIGZpbGw9IiMwODc0M0IiDQogICAgICAgaWQ9InBhdGg3IiAvPjxwb2x5bGluZQ0KICAgICAgIGZpbGw9IiMwODc0M0IiDQogICAgICAgcG9pbnRzPSIxNS43MywyMC44MjIgMTIuMzI1LDIwLjgyMiAxMC4wMDEsMTcuNTM4IDcuNTYxLDIwLjgyMiA0LjE0LDIwLjgyMiA4LjM4NCwxNS40ODYgNC45NTcsMTAuODE3ICAgIDguNDEyLDEwLjgxNyAxMC4wMTYsMTMuMzU1IDExLjcyNiwxMC44MTcgMTUuMjQyLDEwLjgxNyAxMS42NDksMTUuNDg2IDE1LjczLDIwLjgyMiAgIg0KICAgICAgIGlkPSJwb2x5bGluZTkiIC8+PC9nPjxwYXRoDQogICAgIHN0eWxlPSJmaWxsOiNmZmZmZmY7ZmlsbC1vcGFjaXR5OjE7c3Ryb2tlOm5vbmU7c3Ryb2tlLXdpZHRoOjAuMTI3MTE4NjU7c3Ryb2tlLWxpbmVjYXA6cm91bmQ7c3Ryb2tlLWxpbmVqb2luOnJvdW5kO3N0cm9rZS1taXRlcmxpbWl0OjQ7c3Ryb2tlLWRhc2hhcnJheTpub25lO3N0cm9rZS1vcGFjaXR5OjEiDQogICAgIGQ9Ik0gOC44MTY4MzI5LDI3LjE2NzUwOCBDIDguNDAzNjQ4LDI2LjgwNDcyOCA4LjExMjYxOTQsMjYuMTY3MDg0IDguMTEwODc4NCwyNS42MjA3NjMgOC4xMTAyMTMxLDI1LjQxMTk3OCA4LjQ4NTIzOTksMjUuMzk4MzA1IDE0LjIxMjY1OSwyNS4zOTgzMDUgbCA2LjEwMjQ4OSwwIC0wLjAzMjU3LC05LjY5Mjc5NyBMIDIwLjI1LDYuMDEyNzExOSAxNC4xODAwODUsNS45Nzk2OTk1IDguMTEwMTY5NSw1Ljk0NjY4NzIgbCAwLC0xLjIxODk2MjggYyAwLC0xLjQxMjAyNDIgMC4xODcwMTg5LC0xLjk0MjgxNDMgMC44MjMwMjkxLC0yLjMzNTg5MDIgMC4zOTk2MzA3LC0wLjI0Njk4NTMgMC42MjE1NDEyLC0wLjI1NjI0MSA2LjE0MzUzNjQsLTAuMjU2MjQxIGwgNS43Mjg5MywwIDAuMDM5OTYsMy4wODI2MjcxIDAuMDM5OTYsMy4wODI2MjcyIDAuMzc0ODY4LDAuNjc2NzIyNCBjIDAuMjA2MTc4LDAuMzcyMTk3MyAwLjU4NzI1NSwwLjg0NDkzNjIgMC44NDY4MzksMS4wNTA1MzExIDAuODk0OTkyLDAuNzA4ODQ1IDEuMjUxMTU0LDAuNzg5NDQ4IDMuNzY0NjIsMC44NTE5NyBsIDIuMzE2ODM1LDAuMDU3NjMgLTAuMDU5MDMsMS43MzI0MiBjIC0wLjAzMjQ3LDAuOTUyODMxIC0wLjA4ODE5LDQuNDA5MzM0IC0wLjEyMzgyNSw3LjY4MTExOCAtMC4wNzEzMiw2LjU0NzM1MiAtMC4wNjE1MSw2LjQ2ODUzNSAtMC44NjU4ODUsNi45NTg5OTEgLTAuMzkzMTg3LDAuMjM5NzQgLTAuNzAyNjg0LDAuMjQ4MTU3IC05LjE0MTk0OCwwLjI0ODYxNiBsIC04LjczNDk4MzMsNC43NWUtNCAtMC40NDYyNTA4LC0wLjM5MTgxNCB6Ig0KICAgICBpZD0icGF0aDQxNDMiDQogICAgIGlua3NjYXBlOmNvbm5lY3Rvci1jdXJ2YXR1cmU9IjAiIC8+PHBhdGgNCiAgICAgc3R5bGU9ImZpbGw6I2ZmZmZmZjtmaWxsLW9wYWNpdHk6MTtzdHJva2U6bm9uZTtzdHJva2Utd2lkdGg6MTtzdHJva2UtbGluZWNhcDpyb3VuZDtzdHJva2UtbGluZWpvaW46cm91bmQ7c3Ryb2tlLW1pdGVybGltaXQ6NDtzdHJva2UtZGFzaGFycmF5Om5vbmU7c3Ryb2tlLW9wYWNpdHk6MSINCiAgICAgZD0ibSAyLjAwODQ3NDYsMTUuNzM3Mjg4IDAsLTcuNjI3MTE4NSA4LjEzNTU5MzQsMCA4LjEzNTU5MywwIDAsNy42MjcxMTg1IDAsNy42MjcxMTkgLTguMTM1NTkzLDAgLTguMTM1NTkzNCwwIDAsLTcuNjI3MTE5IHogbSA2Ljc4MjM1NDYsMy41NTQ2NTQgYyAwLjYxOTA2NjMsLTAuODM2NDE2IDEuMTY0NzMwOCwtMS41MjA3NTYgMS4yMTI1ODc4LC0xLjUyMDc1NiAwLjA0Nzg2LDAgMC41NzEwMSwwLjY4NTU0NSAxLjE2MjU2MSwxLjUyMzQzMiBsIDEuMDc1NTQ3LDEuNTIzNDMxIDEuNzQ3ODgyLDAuMDAyIGMgMC45NjEzMzUsMC4wMDExIDEuNzQ3ODgxLC0wLjAxOTE4IDEuNzQ3ODgxLC0wLjA0NTA3IDAsLTAuMDI1ODggLTAuODg4ODMxLC0xLjIwODgyNSAtMS45NzUxOCwtMi42Mjg3NTkgLTEuMDg2MzQ5LC0xLjQxOTkzNiAtMS45NDY5NjIsLTIuNjU1MjM1IC0xLjkxMjQ3MywtMi43NDUxMTIgMC4wMzQ0OSwtMC4wODk4OCAwLjgwODkxMywtMS4xMzIyMjggMS43MjA5NDMsLTIuMzE2MzM3IDAuOTEyMDMsLTEuMTg0MTEgMS42NTgyMzYsLTIuMTg3MTY3IDEuNjU4MjM2LC0yLjIyOTAxNyAwLC0wLjA0MTg1IC0wLjgwMDU3NCwtMC4wNzYwOSAtMS43NzkwNTIsLTAuMDc2MDkgbCAtMS43NzkwNTIsMCAtMC43OTUxMDEsMS4yMDQ2MTggYyAtMC40MzczMDUsMC42NjI1NDEgLTAuODIzNzAyLDEuMjA0MTI2IC0wLjg1ODY2LDEuMjAzNTI0IC0wLjAzNDk1OCwtNi4wMmUtNCAtMC4zOTg1Mzg1LC0wLjU0MjY4IC0wLjgwNzk1NzgsLTEuMjA0NjE4IGwgLTAuNzQ0Mzk4NywtMS4yMDM1MjQgLTEuNzgwODE0NCwwIC0xLjc4MDgxNDUsMCAwLjIwNjM4NDEsMC4zMTQ5ODIgYyAwLjExMzUxMTMsMC4xNzMyNCAwLjg2NjM0MTIsMS4yMTIwNTYgMS42NzI5NTU0LDIuMzA4NDgxIDAuODA2NjE0MiwxLjA5NjQyNCAxLjQzOTE4MjMsMi4wNjQ4NzMgMS40MDU3MDcsMi4xNTIxMDggLTAuMDMzNDc1LDAuMDg3MjQgLTAuOTUxMzM2NiwxLjI3NzEwMyAtMi4wMzk2OTE1LDIuNjQ0MTQ5IC0xLjA4ODM1NDksMS4zNjcwNDYgLTEuOTc4ODI3MSwyLjUxNjM4OSAtMS45Nzg4MjcxLDIuNTU0MDk3IDAsMC4wMzc3IDAuNzg2NTQ2NiwwLjA2NjQ1IDEuNzQ3ODgxNCwwLjA2Mzg5IGwgMS43NDc4ODEzLC0wLjAwNDcgMS4xMjU1NzUsLTEuNTIwNzU2IDAsLTJlLTYgeiINCiAgICAgaWQ9InBhdGg0MTQ1Ig0KICAgICBpbmtzY2FwZTpjb25uZWN0b3ItY3VydmF0dXJlPSIwIiAvPjwvc3ZnPg=='
	},
	
	records: null,
	
	getRecordsCount: function(){
		return this.records;
	},
	
	$server: {
		$require: ['JSB.Workspace.WorkspaceController',
		           'JSB.IO.Decoder'],
		
		$bootstrap: function(){
			WorkspaceController.registerFileUploadCallback(null, this, 0.5, function(name, data){
				if(/\.xlsx?$/i.test(name)){
					return true;
				}
				return false;
			});
		},
		
		$constructor: function(id, workspace, opts){
			$base(id, workspace, opts);
			if(opts){
/*				if(opts.fileName){
					this.setName(opts.fileName);
				}
				if(opts.fileData){
					// try to parse JSON
					var charsets = ['UTF-8','Windows-1251','UTF-16LE','UTF-16BE'];
					var json = null;
					for(var i = 0; i < charsets.length; i++){
						var charset = charsets[i];
						var decoder = new Decoder(charset);
						try {
							var jsonStr = decoder.decode(opts.fileData);
							var chrx = /[\{\[]/i;
							var j = 0;
							for(; j < jsonStr.length; j++){
								if(chrx.test(jsonStr[j])){
									break;
								}
							}
							if(j > 0 && j < jsonStr.length){
								jsonStr = jsonStr.substr(j);
							}
							if(j >= jsonStr.length){
								continue;
							}
							json = eval('(' + jsonStr + ')');
							break;
						} catch(e){
							JSB.getLogger().warn(e);
							continue;
						} finally {
							decoder.close();	
						}
					}
					if(!json){
						throw new Error('Wrong file specified: ' + opts.fileName);
					}
					this.records = 1;
					if(JSB.isArray(json)){
						this.records = json.length;
					}
					this.property('records', this.records);
					// store artifact
					this.storeArtifact('.data', json);
				} */
			} else {
				this.records = this.property('records');
			}
		}
	}
}