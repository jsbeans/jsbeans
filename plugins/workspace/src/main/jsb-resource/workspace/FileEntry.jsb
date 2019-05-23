/*
 * This file is the part of jsBeans, high-level JavaScript client-server framework.
 * The contents of this file are subject to the MIT License (MIT).
 * (c) aa@sis.ru, da@sis.ru, Special Information Systems, LLC, 2011-2019
 *
 * Настоящий файл является частью клиент-сервеной JavaScript платформы.
 * Условия использования и распространения содержимого данного файла соответствуют программному обеспечению с открытыми исходными кодами и равнозначно MIT License (MIT).
 * Авторские права принадлежат aa@sis.ru, da@sis.ru, ООО СИС, 2011-2019гг.
 */

{
	$name: 'JSB.Workspace.FileEntry',
	$parent: 'JSB.Workspace.Entry',
	
	$expose: {
		priority: 0, 
		nodeType:'JSB.Workspace.FileNode',
		create: false,
		move:true,
		remove: true,
		share: true,
		rename: true,
		icon: 'data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiIHN0YW5kYWxvbmU9Im5vIj8+DQo8IS0tIEdlbmVyYXRvcjogQWRvYmUgSWxsdXN0cmF0b3IgMTYuMC4wLCBTVkcgRXhwb3J0IFBsdWctSW4gLiBTVkcgVmVyc2lvbjogNi4wMCBCdWlsZCAwKSAgLS0+DQoNCjxzdmcNCiAgIHhtbG5zOmRjPSJodHRwOi8vcHVybC5vcmcvZGMvZWxlbWVudHMvMS4xLyINCiAgIHhtbG5zOmNjPSJodHRwOi8vY3JlYXRpdmVjb21tb25zLm9yZy9ucyMiDQogICB4bWxuczpyZGY9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkvMDIvMjItcmRmLXN5bnRheC1ucyMiDQogICB4bWxuczpzdmc9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIg0KICAgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIg0KICAgeG1sbnM6eGxpbms9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmsiDQogICB4bWxuczpzb2RpcG9kaT0iaHR0cDovL3NvZGlwb2RpLnNvdXJjZWZvcmdlLm5ldC9EVEQvc29kaXBvZGktMC5kdGQiDQogICB4bWxuczppbmtzY2FwZT0iaHR0cDovL3d3dy5pbmtzY2FwZS5vcmcvbmFtZXNwYWNlcy9pbmtzY2FwZSINCiAgIHZlcnNpb249IjEuMSINCiAgIGlkPSJDYXBhXzEiDQogICB4PSIwcHgiDQogICB5PSIwcHgiDQogICB3aWR0aD0iMjAiDQogICBoZWlnaHQ9IjIwIg0KICAgdmlld0JveD0iMCAwIDIwIDIwIg0KICAgeG1sOnNwYWNlPSJwcmVzZXJ2ZSINCiAgIGlua3NjYXBlOnZlcnNpb249IjAuOTEgcjEzNzI1Ig0KICAgc29kaXBvZGk6ZG9jbmFtZT0iZmlsZS5zdmciPjxtZXRhZGF0YQ0KICAgICBpZD0ibWV0YWRhdGE0MSI+PHJkZjpSREY+PGNjOldvcmsNCiAgICAgICAgIHJkZjphYm91dD0iIj48ZGM6Zm9ybWF0PmltYWdlL3N2Zyt4bWw8L2RjOmZvcm1hdD48ZGM6dHlwZQ0KICAgICAgICAgICByZGY6cmVzb3VyY2U9Imh0dHA6Ly9wdXJsLm9yZy9kYy9kY21pdHlwZS9TdGlsbEltYWdlIiAvPjxkYzp0aXRsZT48L2RjOnRpdGxlPjwvY2M6V29yaz48L3JkZjpSREY+PC9tZXRhZGF0YT48ZGVmcw0KICAgICBpZD0iZGVmczM5Ij48bGluZWFyR3JhZGllbnQNCiAgICAgICBpbmtzY2FwZTpjb2xsZWN0PSJhbHdheXMiDQogICAgICAgaWQ9ImxpbmVhckdyYWRpZW50NDIwNSI+PHN0b3ANCiAgICAgICAgIHN0eWxlPSJzdG9wLWNvbG9yOiNmZWZlZmY7c3RvcC1vcGFjaXR5OjEiDQogICAgICAgICBvZmZzZXQ9IjAiDQogICAgICAgICBpZD0ic3RvcDQxODkiIC8+PHN0b3ANCiAgICAgICAgIHN0eWxlPSJzdG9wLWNvbG9yOiNkNmU2ZjY7c3RvcC1vcGFjaXR5OjEiDQogICAgICAgICBvZmZzZXQ9IjEiDQogICAgICAgICBpZD0ic3RvcDQxOTEiIC8+PC9saW5lYXJHcmFkaWVudD48bGluZWFyR3JhZGllbnQNCiAgICAgICBpbmtzY2FwZTpjb2xsZWN0PSJhbHdheXMiDQogICAgICAgeGxpbms6aHJlZj0iI2xpbmVhckdyYWRpZW50NDIwNSINCiAgICAgICBpZD0ibGluZWFyR3JhZGllbnQ0MTk3Ig0KICAgICAgIHgxPSIxMC4wNTEwNDYiDQogICAgICAgeTE9IjEuMTAyODExOCINCiAgICAgICB4Mj0iOS45NDA4OTMyIg0KICAgICAgIHkyPSIxOC45MjU4MDIiDQogICAgICAgZ3JhZGllbnRVbml0cz0idXNlclNwYWNlT25Vc2UiIC8+PC9kZWZzPjxzb2RpcG9kaTpuYW1lZHZpZXcNCiAgICAgcGFnZWNvbG9yPSIjZmZmZmZmIg0KICAgICBib3JkZXJjb2xvcj0iIzY2NjY2NiINCiAgICAgYm9yZGVyb3BhY2l0eT0iMSINCiAgICAgb2JqZWN0dG9sZXJhbmNlPSIxMCINCiAgICAgZ3JpZHRvbGVyYW5jZT0iMTAiDQogICAgIGd1aWRldG9sZXJhbmNlPSIxMCINCiAgICAgaW5rc2NhcGU6cGFnZW9wYWNpdHk9IjAiDQogICAgIGlua3NjYXBlOnBhZ2VzaGFkb3c9IjIiDQogICAgIGlua3NjYXBlOndpbmRvdy13aWR0aD0iMTkyMCINCiAgICAgaW5rc2NhcGU6d2luZG93LWhlaWdodD0iMTE3OCINCiAgICAgaWQ9Im5hbWVkdmlldzM3Ig0KICAgICBzaG93Z3JpZD0iZmFsc2UiDQogICAgIGlua3NjYXBlOnpvb209IjQ1LjM5MDgxNCINCiAgICAgaW5rc2NhcGU6Y3g9IjguMDA2NTc5NiINCiAgICAgaW5rc2NhcGU6Y3k9IjkuNTA3NjIzMSINCiAgICAgaW5rc2NhcGU6d2luZG93LXg9IjE5MTIiDQogICAgIGlua3NjYXBlOndpbmRvdy15PSItOCINCiAgICAgaW5rc2NhcGU6d2luZG93LW1heGltaXplZD0iMSINCiAgICAgaW5rc2NhcGU6Y3VycmVudC1sYXllcj0iQ2FwYV8xIiAvPjxnDQogICAgIGlkPSJnMyINCiAgICAgdHJhbnNmb3JtPSJtYXRyaXgoMC4wNDI0MzU4NCwwLDAsMC4wNDI0MzU4NCwwLjEzMzEzNDI4LDAuMDE0ODU5MjgpIg0KICAgICBzdHlsZT0iZmlsbC1vcGFjaXR5OjE7ZmlsbDojN2Q5OGI1O3N0cm9rZTpub25lO3N0cm9rZS1vcGFjaXR5OjEiPjxwYXRoDQogICAgICAgZD0iTSAzMjcuMDgxLDAgOTAuMjM0LDAgQyA3NC4zMzEsMCA2MS4zODEsMTIuOTU5IDYxLjM4MSwyOC44NTkgbCAwLDQxMi44NjMgYyAwLDE1LjkyNCAxMi45NSwyOC44NjMgMjguODUzLDI4Ljg2MyBsIDI5MC4xMTYsMCBjIDE1LjkxNywwIDI4Ljg1NSwtMTIuOTM5IDI4Ljg1NSwtMjguODYzIGwgMCwtMzUyLjQ4OCB6IG0gNi44MSw0My4xODQgMzUuOTk2LDM5LjEyMSAtMzUuOTk2LDAgeiBtIDUxLjA4MSwzOTguNTM5IGMgMCwyLjU0MiAtMi4wODEsNC42MjkgLTQuNjM1LDQuNjI5IGwgLTI5MC4xMDMsMCBjIC0yLjU1LDAgLTQuNjE5LC0yLjA4NyAtNC42MTksLTQuNjI5IGwgMCwtNDEyLjg2NCBjIDAsLTIuNTQ4IDIuMDY5LC00LjYxMyA0LjYxOSwtNC42MTMgbCAyMTkuNDExLDAgMCw3MC4xODEgYyAwLDYuNjgyIDUuNDQzLDEyLjA5OSAxMi4xMjksMTIuMDk5IGwgNjMuMTk4LDAgeiINCiAgICAgICBpZD0icGF0aDUiDQogICAgICAgaW5rc2NhcGU6Y29ubmVjdG9yLWN1cnZhdHVyZT0iMCINCiAgICAgICBzb2RpcG9kaTpub2RldHlwZXM9ImNzc3Nzc3NjY2NjY2Nzc3Nzc3Njc3NjcyINCiAgICAgICBzdHlsZT0iZmlsbC1vcGFjaXR5OjE7ZmlsbDojN2Q5OGI1O3N0cm9rZTpub25lO3N0cm9rZS1vcGFjaXR5OjEiIC8+PC9nPjxnDQogICAgIGlkPSJnNyINCiAgICAgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoMCwtNDUwLjU4NikiIC8+PGcNCiAgICAgaWQ9Imc5Ig0KICAgICB0cmFuc2Zvcm09InRyYW5zbGF0ZSgwLC00NTAuNTg2KSIgLz48Zw0KICAgICBpZD0iZzExIg0KICAgICB0cmFuc2Zvcm09InRyYW5zbGF0ZSgwLC00NTAuNTg2KSIgLz48Zw0KICAgICBpZD0iZzEzIg0KICAgICB0cmFuc2Zvcm09InRyYW5zbGF0ZSgwLC00NTAuNTg2KSIgLz48Zw0KICAgICBpZD0iZzE1Ig0KICAgICB0cmFuc2Zvcm09InRyYW5zbGF0ZSgwLC00NTAuNTg2KSIgLz48Zw0KICAgICBpZD0iZzE3Ig0KICAgICB0cmFuc2Zvcm09InRyYW5zbGF0ZSgwLC00NTAuNTg2KSIgLz48Zw0KICAgICBpZD0iZzE5Ig0KICAgICB0cmFuc2Zvcm09InRyYW5zbGF0ZSgwLC00NTAuNTg2KSIgLz48Zw0KICAgICBpZD0iZzIxIg0KICAgICB0cmFuc2Zvcm09InRyYW5zbGF0ZSgwLC00NTAuNTg2KSIgLz48Zw0KICAgICBpZD0iZzIzIg0KICAgICB0cmFuc2Zvcm09InRyYW5zbGF0ZSgwLC00NTAuNTg2KSIgLz48Zw0KICAgICBpZD0iZzI1Ig0KICAgICB0cmFuc2Zvcm09InRyYW5zbGF0ZSgwLC00NTAuNTg2KSIgLz48Zw0KICAgICBpZD0iZzI3Ig0KICAgICB0cmFuc2Zvcm09InRyYW5zbGF0ZSgwLC00NTAuNTg2KSIgLz48Zw0KICAgICBpZD0iZzI5Ig0KICAgICB0cmFuc2Zvcm09InRyYW5zbGF0ZSgwLC00NTAuNTg2KSIgLz48Zw0KICAgICBpZD0iZzMxIg0KICAgICB0cmFuc2Zvcm09InRyYW5zbGF0ZSgwLC00NTAuNTg2KSIgLz48Zw0KICAgICBpZD0iZzMzIg0KICAgICB0cmFuc2Zvcm09InRyYW5zbGF0ZSgwLC00NTAuNTg2KSIgLz48Zw0KICAgICBpZD0iZzM1Ig0KICAgICB0cmFuc2Zvcm09InRyYW5zbGF0ZSgwLC00NTAuNTg2KSIgLz48cGF0aA0KICAgICBzdHlsZT0iZmlsbDp1cmwoI2xpbmVhckdyYWRpZW50NDE5Nyk7ZmlsbC1vcGFjaXR5OjE7c3Ryb2tlOm5vbmU7c3Ryb2tlLXdpZHRoOjA7c3Ryb2tlLWxpbmVjYXA6cm91bmQ7c3Ryb2tlLWxpbmVqb2luOnJvdW5kO3N0cm9rZS1taXRlcmxpbWl0OjQ7c3Ryb2tlLWRhc2hhcnJheTpub25lO3N0cm9rZS1vcGFjaXR5OjE7ZmlsbC1ydWxlOm5vbnplcm8iDQogICAgIGQ9Im0gMy44MzY2NDA2LDE4Ljg4MzQzNCAtMC4wNjQzOTgsLTAuMDY0NCAwLC04LjgxMjM2IDAsLTguODEyMzYgMC4wNTcwMzYsLTAuMDY3NzgzIDAuMDU3MDM2LC0wLjA2Nzc4MyA0LjY5MDYyMDksMCA0LjY5MDYyMTIsMCAwLDEuNTIzMDgzIGMgMCwxLjEzNTkyODggMC4wMDY4LDEuNTQ2MTMzMSAwLjAyNjkzLDEuNjEzNzYyNyAwLjAzNTQxLDAuMTE5MjM0NyAwLjE5Nzg3MSwwLjI4MTY5NyAwLjMxNzEwNiwwLjMxNzEwNiAwLjA2NzIzLDAuMDE5OTY2IDAuNDQ3NDY0LDAuMDI2OTI5IDEuNDcwNTYyLDAuMDI2OTI5IGwgMS4zNzk4ODIsMCAwLDcuMTM5NzAyNCAwLDcuMTM5NzAzIC0wLjA2NDQsMC4wNjQ0IC0wLjA2NDQsMC4wNjQ0IC02LjIxNjEsMCAtNi4yMTYxMDA0LDAgLTAuMDY0Mzk4LC0wLjA2NDQgeiINCiAgICAgaWQ9InBhdGg0MTc3Ig0KICAgICBpbmtzY2FwZTpjb25uZWN0b3ItY3VydmF0dXJlPSIwIiAvPjwvc3ZnPg=='
	},
	
	fileSize: null,
	
	$server: {
		$require: ['JSB.Workspace.WorkspaceController', 
		           'JSB.Web.Download'],
		
		$bootstrap: function(){
			WorkspaceController.registerFileUploadCallback(null, this, 0, function(name, data){
				return true;
			});
		},

		$constructor: function(id, workspace, opts){
			$base(id, workspace);
			if(opts){
				if(opts.fileName){
					this.setName(opts.fileName);
				}
				if(opts.fileData){
					// store artifact
					this.storeArtifact('.data', opts.fileData);
				}
			} else {
				this.fileSize = this.property('fileSize');
			}
		},
		
		uploadFile: function(fileInfo){
			var tempName = '.data.' + JSB.generateUid();
			try {
				var lastProgress = -1;
				this.storeArtifact(tempName, fileInfo.data, {
					onProgress: function(copied){
						var curProgress = Math.floor((copied * 100) / fileInfo.size);
						if(curProgress != lastProgress){
							$this.publish('JSB.Workspace.FileEntry.upload', {status: 'Обновление файла ' + curProgress + '%', success: true}, {session: true});
							lastProgress = curProgress;
						}
					}
				});
				this.removeArtifact('.data');
				this.renameArtifact(tempName, '.data');
			} finally {
				this.removeArtifact(tempName);
			}
		},
		
		downloadFile: function(){
			var fileName = this.getName();
			var dh = new Download(fileName, {mode: 'binary'}, function(outputStream){
				var inputStream = $this.loadArtifact('.data', {stream: true});
				inputStream.copy(outputStream);
				inputStream.close();
			});
			return dh;
		},
		
		read: function(opts){
			return this.loadArtifact('.data', opts);
		},
		
		getFileSize: function(){
			return this.getArtifactSize('.data');
		},

		destroy: function(){
			if(this.existsArtifact('.data')){
				this.removeArtifact('.data');
			}
			$base();
		},
	}
}