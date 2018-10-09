{
	$name: 'DataCube.SqlSourceView',
	$parent: 'JSB.Workspace.BrowserView',
	
	$client: {
		$require: 'JSB.Widgets.SplitLayoutManager',
		ready: false,
		ignoreHandlers: false,
		
		$constructor: function(opts){
			$base(opts);
			
			$jsb.loadCss('SqlSourceView.css');
			this.addClass('sqlSourceView');
			
			// create dialog
			this.append(`#dot
				<div jsb="JSB.Widgets.ScrollBox">
					<div jsb="JSB.Widgets.GroupBox" caption="Настройки соединения" class="connectionSettings">
						<div class="option connectionString">
							<div class="icon"></div>
							<div class="editor" jsb="JSB.Widgets.PrimitiveEditor" placeholder="Строка соединения"
								onchange="{{=this.callbackAttr(function(val){$this.updateSettings()})}}"></div>
						</div>
						
						<div class="option user">
							<div class="icon"></div>
							<div class="editor" jsb="JSB.Widgets.PrimitiveEditor" placeholder="Имя пользователя"
								onchange="{{=this.callbackAttr(function(val){$this.updateSettings()})}}"></div>
						</div>
						
						<div class="option password">
							<div class="icon"></div>
							<div class="editor" jsb="JSB.Widgets.PrimitiveEditor" placeholder="Пароль" password="true"
								onchange="{{=this.callbackAttr(function(val){$this.updateSettings()})}}"></div>
						</div>
						
						<div class="option buttons">
							<div jsb="JSB.Widgets.Button" class="roundButton btnOk btn16" caption="Проверить соединение"
								onclick="{{=this.callbackAttr(function(evt){$this.testConnection()})}}"></div>
							<div class="message"></div>
						</div>
					</div>
					
					<div jsb="JSB.Widgets.GroupBox" caption="Схема базы" class="scheme">
						<div class="option filter">
							<div class="icon"></div>
							<div class="editor" jsb="JSB.Widgets.PrimitiveEditor" placeholder="Фильтр"
								onchange="{{=this.callbackAttr(function(val){$this.updateSettings()})}}"></div>
						</div>
						<div class="option buttons">
							<div jsb="JSB.Widgets.Button" class="roundButton btn16 btnLoadScheme" caption="Загрузить схему"
								onclick="{{=this.callbackAttr(function(evt){$this.extractScheme()})}}"></div>
							<div class="status">
								<div class="icon"></div>
								<div class="message"></div>
							</div>
							<div jsb="JSB.Widgets.Button" class="roundButton btn16 btnClearCache" caption="Очистить кэш с данными"
								onclick="{{=this.callbackAttr(function(evt){$this.clearCache()})}}"></div>
							<div jsb="JSB.Widgets.Button" class="roundButton btn16 btnUpdateCache" caption="Обновить кэш с данными"
								onclick="{{=this.callbackAttr(function(evt){$this.updateCache()})}}"></div>


						</div>
						<div class="option details"></div>
					</div>
				</div>
			`);
			
			this.subscribe('DataCube.Model.SqlSource.extractScheme', {session: true}, function(sender, msg, params){
				if(sender != $this.node.getTargetEntry()){
					return;
				}
				$this.updateSchemeStatus(params.status);
			});
			
			JSB.deferUntil(function(){
				$this.ready = true;
			}, function(){
				return $this.isContentReady();
			});
		},
		
		collectSettings: function(){
		    var settings = {
				url: this.find('.connectionString > .editor').jsb().getData().getValue(),
				properties: {
					user: this.find('.user > .editor').jsb().getData().getValue(),
					password: this.find('.password > .editor').jsb().getData().getValue()
				},
				filter: this.find('.filter > .editor').jsb().getData().getValue()
			};
		    if (!settings.properties.user || /^\s*$/.test(settings.properties.user)) {
		        delete settings.properties.user;
		    }
            if (!settings.properties.password || /^\s*$/.test(settings.properties.password)) {
                delete settings.properties.password;
            }

			return settings;
		},
		
		fillSettings: function(settings){
			$this.ignoreHandlers = true;
			this.find('.connectionString > .editor').jsb().setData(settings && settings.url ? settings.url : '');
			this.find('.user > .editor').jsb().setData(settings && settings.properties && settings.properties.user ? settings.properties.user : '');
			this.find('.password > .editor').jsb().setData(settings && settings.properties && settings.properties.password ? settings.properties.password : '');
			this.find('.filter > .editor').jsb().setData(settings && settings.filter ? settings.filter : '');
			this.find('.connectionSettings .message').text('');
			$this.ignoreHandlers = false;
		},
		
		updateSettings: function(){
			$this.updateButtons();
			if($this.ignoreHandlers){
				return;
			}
			JSB.defer(function(){
				var settings = $this.collectSettings();
				var entry = $this.node.getTargetEntry();
				entry.server().updateSettings(settings);
			}, 300, 'updateSettings_' + this.getId());
			
		},
		
		updateButtons: function(){
			var bEnable = this.find('.connectionString > .editor').jsb().getData().getValue().trim().length > 0;
			this.find('.btnOk').jsb().enable(bEnable);
			this.find('.btnLoadScheme').jsb().enable(bEnable);
		},
		
		testConnection: function(){
			var settings = $this.collectSettings();
			var entry = $this.node.getTargetEntry();
			entry.server().testConnection(settings, function(res, fail){
				if(fail){
					$this.find('.connectionSettings .message').addClass('fail').removeClass('ok').text(fail.message);
				} else {
					$this.find('.connectionSettings .message').addClass('ok').removeClass('fail').text('Соединение установлено');
				}
			});
		},
		
		fillDetails: function(details){
			$this.find('.scheme .details').empty();
			if(!details || !details.updated){
				$this.find('.scheme .status').addClass('fail').removeClass('progress').removeClass('ok');
				$this.find('.scheme .status > .message').text('Схема не загружена');
				$this.find('.btnLoadScheme > ._dwp_caption').text('Загрузить схему');
				return;
			}
			$this.find('.scheme .status').addClass('ok').removeClass('progress').removeClass('fail');
			$this.find('.btnLoadScheme > ._dwp_caption').text('Обновить схему');
			
			$this.find('.scheme .status > .message').text('Обновлено: ' + new Date(details.updated).toLocaleString());
			$this.find('.scheme .details').append('Схем: <span class="count">' + details.schemes + '</span>; таблиц: <span class="count">' + details.tables + '</span>; столбцов: <span class="count">' + details.columns + '</span>');
		},
		
		extractScheme: function(){
			var entry = $this.node.getTargetEntry();
			entry.server().extractScheme(function(details, fail){
				if(fail){
					$this.find('.scheme .status').addClass('fail').removeClass('progress').removeClass('ok');
					$this.find('.scheme .status > .message').text(fail.message);
					return;
				}
				$this.fillDetails(details);
			});
		},
		
		clearCache: function(){
			var entry = $this.node.getTargetEntry();
			$this.getElement().loader({message:'Очистка кэша...', onShow: function(){
				entry.server().clearCache(function(){
					$this.getElement().loader('hide');
				});
			}});
		},
		
		updateCache: function(){
			var entry = $this.node.getTargetEntry();
			$this.getElement().loader({message:'Загрузка подключенных кубов...', onShow: function(){
				entry.server().updateCache(function(){
					$this.getElement().loader('hide');
				});
			}});
		},
		
		updateSchemeStatus: function(status){
			$this.find('.scheme .status').addClass('progress').removeClass('fail').removeClass('ok');
			$this.find('.scheme .status > .message').text(status);
		},
		
		refresh: function(){
			if(!this.ready){
				JSB.deferUntil(function(){
					$this.refresh();
				}, function(){
					return $this.ready;
				});
				return;
			}
			var entry = this.node.getTargetEntry();
			entry.server().getSettings(function(settings){
				$this.fillSettings(settings);
				$this.updateButtons();
			});
			entry.server().getDetails(function(details){
				$this.fillDetails(details);
			});
		}
		
	},
	
	$server: {
		$require: 'JSB.Workspace.WorkspaceController',
		$bootstrap: function(){
			WorkspaceController.registerBrowserView(null, this, {
				priority: 1,
				acceptNode: 'DataCube.SqlSourceNode',
				caption: 'Настройки',
				icon: 'data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiIHN0YW5kYWxvbmU9Im5vIj8+DQo8IS0tIEdlbmVyYXRvcjogQWRvYmUgSWxsdXN0cmF0b3IgMTkuMC4wLCBTVkcgRXhwb3J0IFBsdWctSW4gLiBTVkcgVmVyc2lvbjogNi4wMCBCdWlsZCAwKSAgLS0+DQoNCjxzdmcNCiAgIHhtbG5zOmRjPSJodHRwOi8vcHVybC5vcmcvZGMvZWxlbWVudHMvMS4xLyINCiAgIHhtbG5zOmNjPSJodHRwOi8vY3JlYXRpdmVjb21tb25zLm9yZy9ucyMiDQogICB4bWxuczpyZGY9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkvMDIvMjItcmRmLXN5bnRheC1ucyMiDQogICB4bWxuczpzdmc9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIg0KICAgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIg0KICAgeG1sbnM6eGxpbms9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmsiDQogICB4bWxuczpzb2RpcG9kaT0iaHR0cDovL3NvZGlwb2RpLnNvdXJjZWZvcmdlLm5ldC9EVEQvc29kaXBvZGktMC5kdGQiDQogICB4bWxuczppbmtzY2FwZT0iaHR0cDovL3d3dy5pbmtzY2FwZS5vcmcvbmFtZXNwYWNlcy9pbmtzY2FwZSINCiAgIHZlcnNpb249IjEuMSINCiAgIGlkPSJMYXllcl8xIg0KICAgeD0iMHB4Ig0KICAgeT0iMHB4Ig0KICAgdmlld0JveD0iMCAwIDIwIDIwIg0KICAgeG1sOnNwYWNlPSJwcmVzZXJ2ZSINCiAgIGlua3NjYXBlOnZlcnNpb249IjAuOTEgcjEzNzI1Ig0KICAgc29kaXBvZGk6ZG9jbmFtZT0iZGF0YWJhc2Vfc2V0dGluZ3Muc3ZnIg0KICAgd2lkdGg9IjIwIg0KICAgaGVpZ2h0PSIyMCI+PG1ldGFkYXRhDQogICAgIGlkPSJtZXRhZGF0YTI3Ij48cmRmOlJERj48Y2M6V29yaw0KICAgICAgICAgcmRmOmFib3V0PSIiPjxkYzpmb3JtYXQ+aW1hZ2Uvc3ZnK3htbDwvZGM6Zm9ybWF0PjxkYzp0eXBlDQogICAgICAgICAgIHJkZjpyZXNvdXJjZT0iaHR0cDovL3B1cmwub3JnL2RjL2RjbWl0eXBlL1N0aWxsSW1hZ2UiIC8+PGRjOnRpdGxlPjwvZGM6dGl0bGU+PC9jYzpXb3JrPjwvcmRmOlJERj48L21ldGFkYXRhPjxkZWZzDQogICAgIGlkPSJkZWZzMjUiPjxyYWRpYWxHcmFkaWVudA0KICAgICAgIGlua3NjYXBlOmNvbGxlY3Q9ImFsd2F5cyINCiAgICAgICB4bGluazpocmVmPSIjbGluZWFyR3JhZGllbnQzMDQxIg0KICAgICAgIGlkPSJyYWRpYWxHcmFkaWVudDI5NDkxIg0KICAgICAgIGdyYWRpZW50VW5pdHM9InVzZXJTcGFjZU9uVXNlIg0KICAgICAgIGdyYWRpZW50VHJhbnNmb3JtPSJtYXRyaXgoMC4yNDEwMzk0LDAsMCwwLjA2OTU1OTIxLDkuNjczOTAzLDE1LjYwOTIyNCkiDQogICAgICAgY3g9IjI0LjgxMjUiDQogICAgICAgY3k9IjM5LjEyNSINCiAgICAgICBmeD0iMjQuODEyNSINCiAgICAgICBmeT0iMzkuMTI1Ig0KICAgICAgIHI9IjE3LjY4NzUiIC8+PGxpbmVhckdyYWRpZW50DQogICAgICAgaW5rc2NhcGU6Y29sbGVjdD0iYWx3YXlzIg0KICAgICAgIGlkPSJsaW5lYXJHcmFkaWVudDMwNDEiPjxzdG9wDQogICAgICAgICBzdHlsZT0ic3RvcC1jb2xvcjojMDAwMDAwO3N0b3Atb3BhY2l0eToxOyINCiAgICAgICAgIG9mZnNldD0iMCINCiAgICAgICAgIGlkPSJzdG9wMzA0MyIgLz48c3RvcA0KICAgICAgICAgc3R5bGU9InN0b3AtY29sb3I6IzAwMDAwMDtzdG9wLW9wYWNpdHk6MDsiDQogICAgICAgICBvZmZzZXQ9IjEiDQogICAgICAgICBpZD0ic3RvcDMwNDUiIC8+PC9saW5lYXJHcmFkaWVudD48cmFkaWFsR3JhZGllbnQNCiAgICAgICBpbmtzY2FwZTpjb2xsZWN0PSJhbHdheXMiDQogICAgICAgeGxpbms6aHJlZj0iI2xpbmVhckdyYWRpZW50MzA0MSINCiAgICAgICBpZD0icmFkaWFsR3JhZGllbnQyOTQ5MyINCiAgICAgICBncmFkaWVudFVuaXRzPSJ1c2VyU3BhY2VPblVzZSINCiAgICAgICBncmFkaWVudFRyYW5zZm9ybT0ibWF0cml4KDAuMjY4MzAxNDUsMCwwLDAuMDgyMzg4MzYsMS42NTEwNjA5LDE1LjI3NzQ3KSINCiAgICAgICBjeD0iMjQuODEyNSINCiAgICAgICBjeT0iMzkuMTI1Ig0KICAgICAgIGZ4PSIyNC44MTI1Ig0KICAgICAgIGZ5PSIzOS4xMjUiDQogICAgICAgcj0iMTcuNjg3NSIgLz48bGluZWFyR3JhZGllbnQNCiAgICAgICBpbmtzY2FwZTpjb2xsZWN0PSJhbHdheXMiDQogICAgICAgeGxpbms6aHJlZj0iI2xpbmVhckdyYWRpZW50MzA0OSINCiAgICAgICBpZD0ibGluZWFyR3JhZGllbnQyOTQ5NSINCiAgICAgICBncmFkaWVudFVuaXRzPSJ1c2VyU3BhY2VPblVzZSINCiAgICAgICBncmFkaWVudFRyYW5zZm9ybT0ibWF0cml4KDAuMjgxODQzNDMsMCwwLDAuMjgxODQzNDMsMzMyLjA3MjQxLDE1NS43MzQ3OCkiDQogICAgICAgeDE9IjE5LjY0ODM0MiINCiAgICAgICB5MT0iNDIuMjUzNjAxIg0KICAgICAgIHgyPSIyMC42MzEyMjQiDQogICAgICAgeTI9IjYuNzc1ODAzMSIgLz48bGluZWFyR3JhZGllbnQNCiAgICAgICBpZD0ibGluZWFyR3JhZGllbnQzMDQ5Ij48c3RvcA0KICAgICAgICAgc3R5bGU9InN0b3AtY29sb3I6Izg4OGE4NTtzdG9wLW9wYWNpdHk6MTsiDQogICAgICAgICBvZmZzZXQ9IjAiDQogICAgICAgICBpZD0ic3RvcDMwNTEiIC8+PHN0b3ANCiAgICAgICAgIHN0eWxlPSJzdG9wLWNvbG9yOiNkM2Q3Y2Y7c3RvcC1vcGFjaXR5OjE7Ig0KICAgICAgICAgb2Zmc2V0PSIwLjUiDQogICAgICAgICBpZD0ic3RvcDIyNjIiIC8+PHN0b3ANCiAgICAgICAgIHN0eWxlPSJzdG9wLWNvbG9yOiNlZWVlZWM7c3RvcC1vcGFjaXR5OjE7Ig0KICAgICAgICAgb2Zmc2V0PSIwLjY3NjEyOTU4Ig0KICAgICAgICAgaWQ9InN0b3AyMjY0IiAvPjxzdG9wDQogICAgICAgICBzdHlsZT0ic3RvcC1jb2xvcjojYmFiZGI2O3N0b3Atb3BhY2l0eToxOyINCiAgICAgICAgIG9mZnNldD0iMC44NDA1MTcyMiINCiAgICAgICAgIGlkPSJzdG9wMjI2OCIgLz48c3RvcA0KICAgICAgICAgc3R5bGU9InN0b3AtY29sb3I6I2QzZDdjZjtzdG9wLW9wYWNpdHk6MTsiDQogICAgICAgICBvZmZzZXQ9IjAuODc1Ig0KICAgICAgICAgaWQ9InN0b3AyMjY2IiAvPjxzdG9wDQogICAgICAgICBzdHlsZT0ic3RvcC1jb2xvcjojYmFiZGI2O3N0b3Atb3BhY2l0eToxOyINCiAgICAgICAgIG9mZnNldD0iMSINCiAgICAgICAgIGlkPSJzdG9wMzA1MyIgLz48L2xpbmVhckdyYWRpZW50PjxsaW5lYXJHcmFkaWVudA0KICAgICAgIGlua3NjYXBlOmNvbGxlY3Q9ImFsd2F5cyINCiAgICAgICB4bGluazpocmVmPSIjbGluZWFyR3JhZGllbnQzMDYxIg0KICAgICAgIGlkPSJsaW5lYXJHcmFkaWVudDI5NDk3Ig0KICAgICAgIGdyYWRpZW50VW5pdHM9InVzZXJTcGFjZU9uVXNlIg0KICAgICAgIGdyYWRpZW50VHJhbnNmb3JtPSJtYXRyaXgoMC4yODE4NDM0MSwwLDAsMC4yODE4NDM0MSwzNDMuMjk2NzIsLTEyOS4xMjMxMSkiDQogICAgICAgeDE9IjUwLjE1MjkzMSINCiAgICAgICB5MT0iLTMuNjMyNDQ3NyINCiAgICAgICB4Mj0iMjUuMjkxMDg2Ig0KICAgICAgIHkyPSItNC4zMDAyNjUzIiAvPjxsaW5lYXJHcmFkaWVudA0KICAgICAgIGlkPSJsaW5lYXJHcmFkaWVudDMwNjEiPjxzdG9wDQogICAgICAgICBzdHlsZT0ic3RvcC1jb2xvcjojZmZmZmZmO3N0b3Atb3BhY2l0eToxOyINCiAgICAgICAgIG9mZnNldD0iMCINCiAgICAgICAgIGlkPSJzdG9wMzA2MyIgLz48c3RvcA0KICAgICAgICAgc3R5bGU9InN0b3AtY29sb3I6IzAwMDAwMDtzdG9wLW9wYWNpdHk6MTsiDQogICAgICAgICBvZmZzZXQ9IjEiDQogICAgICAgICBpZD0ic3RvcDMwNjUiIC8+PC9saW5lYXJHcmFkaWVudD48bGluZWFyR3JhZGllbnQNCiAgICAgICBpbmtzY2FwZTpjb2xsZWN0PSJhbHdheXMiDQogICAgICAgeGxpbms6aHJlZj0iI2xpbmVhckdyYWRpZW50MzA3NyINCiAgICAgICBpZD0ibGluZWFyR3JhZGllbnQyOTQ5OSINCiAgICAgICBncmFkaWVudFVuaXRzPSJ1c2VyU3BhY2VPblVzZSINCiAgICAgICBncmFkaWVudFRyYW5zZm9ybT0ibWF0cml4KDAuMjgxODQzNDMsMCwwLDAuMjgxODQzNDMsMzMyLjE3MjA1LDE1NS45MzQwNykiDQogICAgICAgeDE9IjM4LjIyNzY1NCINCiAgICAgICB5MT0iMTMuNjAyNTI3Ig0KICAgICAgIHgyPSIzNy41MzUzNyINCiAgICAgICB5Mj0iNi42Mjg1ODk2IiAvPjxsaW5lYXJHcmFkaWVudA0KICAgICAgIGlkPSJsaW5lYXJHcmFkaWVudDMwNzciPjxzdG9wDQogICAgICAgICBzdHlsZT0ic3RvcC1jb2xvcjojODg4YTg1O3N0b3Atb3BhY2l0eToxOyINCiAgICAgICAgIG9mZnNldD0iMCINCiAgICAgICAgIGlkPSJzdG9wMzA3OSIgLz48c3RvcA0KICAgICAgICAgc3R5bGU9InN0b3AtY29sb3I6I2QzZDdjZjtzdG9wLW9wYWNpdHk6MTsiDQogICAgICAgICBvZmZzZXQ9IjEiDQogICAgICAgICBpZD0ic3RvcDMwODEiIC8+PC9saW5lYXJHcmFkaWVudD48bGluZWFyR3JhZGllbnQNCiAgICAgICBpbmtzY2FwZTpjb2xsZWN0PSJhbHdheXMiDQogICAgICAgeGxpbms6aHJlZj0iI2xpbmVhckdyYWRpZW50MjI1MCINCiAgICAgICBpZD0ibGluZWFyR3JhZGllbnQyOTUwMSINCiAgICAgICBncmFkaWVudFVuaXRzPSJ1c2VyU3BhY2VPblVzZSINCiAgICAgICBncmFkaWVudFRyYW5zZm9ybT0ibWF0cml4KDAuMzIwOTA3NSwwLDAsMC4zMjA5MDc1LDMzMS4yNTgyNywxNTQuMTQwNjEpIg0KICAgICAgIHgxPSIzMS4xNzc0MDQiDQogICAgICAgeTE9IjE5LjgyMTUxNCINCiAgICAgICB4Mj0iNDAuODU5MTc3Ig0KICAgICAgIHkyPSI5LjY1Njg1MzciIC8+PGxpbmVhckdyYWRpZW50DQogICAgICAgaW5rc2NhcGU6Y29sbGVjdD0iYWx3YXlzIg0KICAgICAgIGlkPSJsaW5lYXJHcmFkaWVudDIyNTAiPjxzdG9wDQogICAgICAgICBzdHlsZT0ic3RvcC1jb2xvcjojZmZmZmZmO3N0b3Atb3BhY2l0eToxOyINCiAgICAgICAgIG9mZnNldD0iMCINCiAgICAgICAgIGlkPSJzdG9wMjI1MiIgLz48c3RvcA0KICAgICAgICAgc3R5bGU9InN0b3AtY29sb3I6I2ZmZmZmZjtzdG9wLW9wYWNpdHk6MDsiDQogICAgICAgICBvZmZzZXQ9IjEiDQogICAgICAgICBpZD0ic3RvcDIyNTQiIC8+PC9saW5lYXJHcmFkaWVudD48bGluZWFyR3JhZGllbnQNCiAgICAgICBpbmtzY2FwZTpjb2xsZWN0PSJhbHdheXMiDQogICAgICAgeGxpbms6aHJlZj0iI2xpbmVhckdyYWRpZW50MzA4NyINCiAgICAgICBpZD0ibGluZWFyR3JhZGllbnQyOTUwMyINCiAgICAgICBncmFkaWVudFVuaXRzPSJ1c2VyU3BhY2VPblVzZSINCiAgICAgICBncmFkaWVudFRyYW5zZm9ybT0ibWF0cml4KDAuMjgxODQzNDMsMCwwLDAuMjgxODQzNDMsMzMyLjA3MjQxLDE1NS43MzQ3OCkiDQogICAgICAgeDE9IjkuNzUwMzI0MiINCiAgICAgICB5MT0iMzIuMjgzNzYiDQogICAgICAgeDI9IjE2LjkxNTI5NyINCiAgICAgICB5Mj0iMzkuNDQzMjE4IiAvPjxsaW5lYXJHcmFkaWVudA0KICAgICAgIGlkPSJsaW5lYXJHcmFkaWVudDMwODciPjxzdG9wDQogICAgICAgICBzdHlsZT0ic3RvcC1jb2xvcjojMzQ2NWE0O3N0b3Atb3BhY2l0eToxOyINCiAgICAgICAgIG9mZnNldD0iMCINCiAgICAgICAgIGlkPSJzdG9wMzA4OSIgLz48c3RvcA0KICAgICAgICAgc3R5bGU9InN0b3AtY29sb3I6IzlmYmNlMTtzdG9wLW9wYWNpdHk6MTsiDQogICAgICAgICBvZmZzZXQ9IjAiDQogICAgICAgICBpZD0ic3RvcDMwOTUiIC8+PHN0b3ANCiAgICAgICAgIHN0eWxlPSJzdG9wLWNvbG9yOiM2Yjk1Y2E7c3RvcC1vcGFjaXR5OjE7Ig0KICAgICAgICAgb2Zmc2V0PSIwIg0KICAgICAgICAgaWQ9InN0b3AyMjQyIiAvPjxzdG9wDQogICAgICAgICBzdHlsZT0ic3RvcC1jb2xvcjojM2Q2YWE1O3N0b3Atb3BhY2l0eToxOyINCiAgICAgICAgIG9mZnNldD0iMC43NSINCiAgICAgICAgIGlkPSJzdG9wMjI0NCIgLz48c3RvcA0KICAgICAgICAgc3R5bGU9InN0b3AtY29sb3I6IzM4NmViNDtzdG9wLW9wYWNpdHk6MTsiDQogICAgICAgICBvZmZzZXQ9IjEiDQogICAgICAgICBpZD0ic3RvcDMwOTEiIC8+PC9saW5lYXJHcmFkaWVudD48bGluZWFyR3JhZGllbnQNCiAgICAgICBpbmtzY2FwZTpjb2xsZWN0PSJhbHdheXMiDQogICAgICAgeGxpbms6aHJlZj0iI2xpbmVhckdyYWRpZW50MjI1MCINCiAgICAgICBpZD0ibGluZWFyR3JhZGllbnQyOTUwNSINCiAgICAgICBncmFkaWVudFVuaXRzPSJ1c2VyU3BhY2VPblVzZSINCiAgICAgICBncmFkaWVudFRyYW5zZm9ybT0ibWF0cml4KDAuMzIzMjM1MzYsLTAuMDA4NDYwODEsMC4wMDg0NjA4MSwwLjMyMzIzNTM2LDMzMS43Njk2LDE1NC4xNjYwMykiDQogICAgICAgeDE9IjEyLjAwNDY5NyINCiAgICAgICB5MT0iMzUuNjg4NDYxIg0KICAgICAgIHgyPSIxMC42NTA4MDUiDQogICAgICAgeTI9IjMzLjE5NDk2NSIgLz48bGluZWFyR3JhZGllbnQNCiAgICAgICBpbmtzY2FwZTpjb2xsZWN0PSJhbHdheXMiDQogICAgICAgeGxpbms6aHJlZj0iI2xpbmVhckdyYWRpZW50MzA0MSINCiAgICAgICBpZD0ibGluZWFyR3JhZGllbnQyOTUwNyINCiAgICAgICBncmFkaWVudFVuaXRzPSJ1c2VyU3BhY2VPblVzZSINCiAgICAgICBncmFkaWVudFRyYW5zZm9ybT0ibWF0cml4KDAuMjgxNzg4NTUsLTAuMDA1NTU5MzEsMC4wMDU1NTkzMSwwLjI4MTc4ODU1LDMzMS45NTI2MSwxNTUuNDQ2MDMpIg0KICAgICAgIHgxPSIxNC4wMTc1NDIiDQogICAgICAgeTE9IjM2Ljk0MjU0MyINCiAgICAgICB4Mj0iMTUuNDE1NzkzIg0KICAgICAgIHkyPSIzOC4yNjgzNjgiIC8+PC9kZWZzPjxzb2RpcG9kaTpuYW1lZHZpZXcNCiAgICAgcGFnZWNvbG9yPSIjZmZmZmZmIg0KICAgICBib3JkZXJjb2xvcj0iIzY2NjY2NiINCiAgICAgYm9yZGVyb3BhY2l0eT0iMSINCiAgICAgb2JqZWN0dG9sZXJhbmNlPSIxMCINCiAgICAgZ3JpZHRvbGVyYW5jZT0iMTAiDQogICAgIGd1aWRldG9sZXJhbmNlPSIxMCINCiAgICAgaW5rc2NhcGU6cGFnZW9wYWNpdHk9IjAiDQogICAgIGlua3NjYXBlOnBhZ2VzaGFkb3c9IjIiDQogICAgIGlua3NjYXBlOndpbmRvdy13aWR0aD0iMTkyMCINCiAgICAgaW5rc2NhcGU6d2luZG93LWhlaWdodD0iMTEzOCINCiAgICAgaWQ9Im5hbWVkdmlldzIzIg0KICAgICBzaG93Z3JpZD0iZmFsc2UiDQogICAgIGlua3NjYXBlOnpvb209IjkuODMzMzMzNSINCiAgICAgaW5rc2NhcGU6Y3g9Ii0zMy40NDQ2MTUiDQogICAgIGlua3NjYXBlOmN5PSIyLjAwMTM4NyINCiAgICAgaW5rc2NhcGU6d2luZG93LXg9Ii04Ig0KICAgICBpbmtzY2FwZTp3aW5kb3cteT0iLTgiDQogICAgIGlua3NjYXBlOndpbmRvdy1tYXhpbWl6ZWQ9IjEiDQogICAgIGlua3NjYXBlOmN1cnJlbnQtbGF5ZXI9IkxheWVyXzEiIC8+PHN0eWxlDQogICAgIHR5cGU9InRleHQvY3NzIg0KICAgICBpZD0ic3R5bGUzIj4NCgkuc3Qwe2ZpbGw6Izk1QTVBNjt9DQoJLnN0MXtmaWxsOiNCREMzQzc7fQ0KCS5zdDJ7ZmlsbDojN0Y4QzhEO30NCgkuc3Qze2ZpbGw6I0VDRjBGMTt9DQo8L3N0eWxlPjxnDQogICAgIGlkPSJYTUxJRF8xXyINCiAgICAgdHJhbnNmb3JtPSJtYXRyaXgoMC4zMDY3OTc4LDAsMCwwLjMwNjc5NzgsLTQuNzkzNjc5OCwtNC43NDkwMjk3KSI+PHBhdGgNCiAgICAgICBpZD0iWE1MSURfM18iDQogICAgICAgY2xhc3M9InN0MCINCiAgICAgICBkPSJtIDIxLjQsNTYuOSAwLDguNiAwLDEuMiAwLDAuMyBjIDAsMCAwLDAgMCwwLjMgMCw3LjEgMTEuOSwxMy4zIDI2LjYsMTMuMyAxNC43LDAgMjYuNiwtNi4yIDI2LjYsLTEzLjMgbCAwLC0wLjYgMCwtMC45IDAsLTguOSAtNTMuMiwwIHoiDQogICAgICAgaW5rc2NhcGU6Y29ubmVjdG9yLWN1cnZhdHVyZT0iMCINCiAgICAgICBzdHlsZT0iZmlsbDojOTVhNWE2IiAvPjxlbGxpcHNlDQogICAgICAgaWQ9IlhNTElEXzRfIg0KICAgICAgIGNsYXNzPSJzdDEiDQogICAgICAgY3g9IjQ4Ig0KICAgICAgIGN5PSI1Ni45MDAwMDIiDQogICAgICAgcng9IjI2LjYiDQogICAgICAgcnk9IjExLjgiDQogICAgICAgc3R5bGU9ImZpbGw6I2JkYzNjNyIgLz48cGF0aA0KICAgICAgIGlkPSJYTUxJRF81XyINCiAgICAgICBjbGFzcz0ic3QyIg0KICAgICAgIGQ9Im0gMjEuNiw2Ny4yIGMgLTAuMSwwLjMgLTAuMiwwLjkgLTAuMiwxLjUgMCw2LjUgMTEuOSwxMS44IDI2LjYsMTEuOCAxNC43LDAgMjYuNiwtNS4zIDI2LjYsLTExLjggMCwtMC42IC0wLjEsLTEuMiAtMC4yLC0xLjUgQyA3Mi44LDcyLjggNjEuNiw3Ny41IDQ4LDc3LjUgMzQuNCw3Ny41IDIzLjIsNzIuOCAyMS42LDY3LjIgWiINCiAgICAgICBpbmtzY2FwZTpjb25uZWN0b3ItY3VydmF0dXJlPSIwIg0KICAgICAgIHN0eWxlPSJmaWxsOiM3ZjhjOGQiIC8+PHBhdGgNCiAgICAgICBpZD0iWE1MSURfNl8iDQogICAgICAgY2xhc3M9InN0MCINCiAgICAgICBkPSJtIDIxLjQsNDIuMSAwLDguNiAwLDEuMiAwLDAuMyBjIDAsMCAwLDAgMCwwLjMgMCw3LjEgMTEuOSwxMy4zIDI2LjYsMTMuMyAxNC43LDAgMjYuNiwtNi4yIDI2LjYsLTEzLjMgbCAwLC0wLjYgMCwtMC45IDAsLTguOSAtNTMuMiwwIHoiDQogICAgICAgaW5rc2NhcGU6Y29ubmVjdG9yLWN1cnZhdHVyZT0iMCINCiAgICAgICBzdHlsZT0iZmlsbDojOTVhNWE2IiAvPjxlbGxpcHNlDQogICAgICAgaWQ9IlhNTElEXzdfIg0KICAgICAgIGNsYXNzPSJzdDEiDQogICAgICAgY3g9IjQ4Ig0KICAgICAgIGN5PSI0Mi4wOTk5OTgiDQogICAgICAgcng9IjI2LjYiDQogICAgICAgcnk9IjExLjgiDQogICAgICAgc3R5bGU9ImZpbGw6I2JkYzNjNyIgLz48cGF0aA0KICAgICAgIGlkPSJYTUxJRF84XyINCiAgICAgICBjbGFzcz0ic3QyIg0KICAgICAgIGQ9Im0gMjEuNiw1Mi40IGMgLTAuMSwwLjMgLTAuMiwwLjkgLTAuMiwxLjUgMCw2LjUgMTEuOSwxMS44IDI2LjYsMTEuOCAxNC43LDAgMjYuNiwtNS4zIDI2LjYsLTExLjggMCwtMC42IC0wLjEsLTEuMiAtMC4yLC0xLjUgQyA3Mi44LDU4IDYxLjYsNjIuOCA0OCw2Mi44IDM0LjQsNjIuOCAyMy4yLDU4IDIxLjYsNTIuNCBaIg0KICAgICAgIGlua3NjYXBlOmNvbm5lY3Rvci1jdXJ2YXR1cmU9IjAiDQogICAgICAgc3R5bGU9ImZpbGw6IzdmOGM4ZCIgLz48cGF0aA0KICAgICAgIGlkPSJYTUxJRF85XyINCiAgICAgICBjbGFzcz0ic3QwIg0KICAgICAgIGQ9Im0gMjEuNCwyNy4zIDAsOC42IDAsMS4yIDAsMC4zIGMgMCwwIDAsMCAwLDAuMyAwLDcuMSAxMS45LDEzLjMgMjYuNiwxMy4zIDE0LjcsMCAyNi42LC02LjIgMjYuNiwtMTMuMyBsIDAsLTAuNiAwLC0wLjkgMCwtOC45IC01My4yLDAgeiINCiAgICAgICBpbmtzY2FwZTpjb25uZWN0b3ItY3VydmF0dXJlPSIwIg0KICAgICAgIHN0eWxlPSJmaWxsOiM5NWE1YTYiIC8+PHBhdGgNCiAgICAgICBpZD0iWE1MSURfMTBfIg0KICAgICAgIGNsYXNzPSJzdDIiDQogICAgICAgZD0iTSAyMS42LDM3LjcgQyAyMS41LDM4IDIxLjQsMzguNiAyMS40LDM5LjIgMjEuNCw0NS42IDMzLjMsNTEgNDgsNTEgNjIuNyw1MSA3NC42LDQ1LjcgNzQuNiwzOS4yIDc0LjYsMzguNiA3NC41LDM4IDc0LjQsMzcuNyA3Mi44LDQzLjMgNjEuNiw0OCA0OCw0OCAzNC40LDQ4IDIzLjIsNDMuMyAyMS42LDM3LjcgWiINCiAgICAgICBpbmtzY2FwZTpjb25uZWN0b3ItY3VydmF0dXJlPSIwIg0KICAgICAgIHN0eWxlPSJmaWxsOiM3ZjhjOGQiIC8+PHBhdGgNCiAgICAgICBpZD0iWE1MSURfMTFfIg0KICAgICAgIGNsYXNzPSJzdDEiDQogICAgICAgZD0ibSA0OCw1Ni45IDAsMjMuNiBjIDE0LjcsMCAyNi42LC02LjIgMjYuNiwtMTMuMyBsIDAsLTAuNiAwLC0wLjkgMCwtOC45IC0yNi42LDAgeiINCiAgICAgICBpbmtzY2FwZTpjb25uZWN0b3ItY3VydmF0dXJlPSIwIg0KICAgICAgIHN0eWxlPSJmaWxsOiNiZGMzYzciIC8+PHBhdGgNCiAgICAgICBpZD0iWE1MSURfMTJfIg0KICAgICAgIGNsYXNzPSJzdDMiDQogICAgICAgZD0ibSA0OCw0NSAwLDIzLjYgQyA2Mi43LDY4LjYgNzQuNiw2My4zIDc0LjYsNTYuOCA3NC42LDUwLjMgNjIuNyw0NSA0OCw0NSBaIg0KICAgICAgIGlua3NjYXBlOmNvbm5lY3Rvci1jdXJ2YXR1cmU9IjAiDQogICAgICAgc3R5bGU9ImZpbGw6I2VjZjBmMSIgLz48cGF0aA0KICAgICAgIGlkPSJYTUxJRF8xM18iDQogICAgICAgY2xhc3M9InN0MSINCiAgICAgICBkPSJtIDQ4LDQyLjEgMCwyMy42IGMgMTQuNywwIDI2LjYsLTYgMjYuNiwtMTMuMyBsIDAsLTAuNiAwLC0wLjggMCwtOC45IC0yNi42LDAgeiINCiAgICAgICBpbmtzY2FwZTpjb25uZWN0b3ItY3VydmF0dXJlPSIwIg0KICAgICAgIHN0eWxlPSJmaWxsOiNiZGMzYzciIC8+PHBhdGgNCiAgICAgICBpZD0iWE1MSURfMTRfIg0KICAgICAgIGNsYXNzPSJzdDAiDQogICAgICAgZD0iTSA3NC40LDUyLjQgQyA3Mi44LDU4LjMgNjEuNiw2Mi44IDQ4LDYyLjggbCAwLDMgYyAxNC43LDAgMjYuNiwtNS4zIDI2LjYsLTExLjggMCwtMC42IC0wLjEsLTEuMSAtMC4yLC0xLjYgeiINCiAgICAgICBpbmtzY2FwZTpjb25uZWN0b3ItY3VydmF0dXJlPSIwIg0KICAgICAgIHN0eWxlPSJmaWxsOiM5NWE1YTYiIC8+PHBhdGgNCiAgICAgICBpZD0iWE1MSURfMTVfIg0KICAgICAgIGNsYXNzPSJzdDMiDQogICAgICAgZD0ibSA0OCwzMC4zIDAsMjMuNiBDIDYyLjcsNTMuOSA3NC42LDQ4LjYgNzQuNiw0Mi4xIDc0LjYsMzUuNiA2Mi43LDMwLjMgNDgsMzAuMyBaIg0KICAgICAgIGlua3NjYXBlOmNvbm5lY3Rvci1jdXJ2YXR1cmU9IjAiDQogICAgICAgc3R5bGU9ImZpbGw6I2VjZjBmMSIgLz48cGF0aA0KICAgICAgIGlkPSJYTUxJRF8xNl8iDQogICAgICAgY2xhc3M9InN0MSINCiAgICAgICBkPSJNIDQ4LDI3LjMgNDgsNTEgYyAxNC43LDAgMjYuNiwtNiAyNi42LC0xMy4zIGwgMCwtMC42IDAsLTAuOSAwLC04LjkgLTI2LjYsMCB6Ig0KICAgICAgIGlua3NjYXBlOmNvbm5lY3Rvci1jdXJ2YXR1cmU9IjAiDQogICAgICAgc3R5bGU9ImZpbGw6I2JkYzNjNyIgLz48cGF0aA0KICAgICAgIGlkPSJYTUxJRF8xN18iDQogICAgICAgY2xhc3M9InN0MCINCiAgICAgICBkPSJNIDc0LjQsMzcuNyBDIDcyLjgsNDMuNSA2MS42LDQ4IDQ4LDQ4IGwgMCwzIGMgMTQuNywwIDI2LjYsLTUuMyAyNi42LC0xMS44IDAsLTAuNiAtMC4xLC0xLjEgLTAuMiwtMS41IHoiDQogICAgICAgaW5rc2NhcGU6Y29ubmVjdG9yLWN1cnZhdHVyZT0iMCINCiAgICAgICBzdHlsZT0iZmlsbDojOTVhNWE2IiAvPjxwYXRoDQogICAgICAgaWQ9IlhNTElEXzE4XyINCiAgICAgICBjbGFzcz0ic3QwIg0KICAgICAgIGQ9Ik0gNzQuNCw2Ny4yIEMgNzIuOCw3Mi44IDYxLjYsNzcuNSA0OCw3Ny41IGwgMCwzIGMgMTQuNywwIDI2LjYsLTUuMyAyNi42LC0xMS44IDAsLTAuNiAtMC4xLC0xLjIgLTAuMiwtMS41IHoiDQogICAgICAgaW5rc2NhcGU6Y29ubmVjdG9yLWN1cnZhdHVyZT0iMCINCiAgICAgICBzdHlsZT0iZmlsbDojOTVhNWE2IiAvPjxlbGxpcHNlDQogICAgICAgaWQ9IlhNTElEXzE5XyINCiAgICAgICBjbGFzcz0ic3QxIg0KICAgICAgIGN4PSI0OCINCiAgICAgICBjeT0iMjcuMjk5OTk5Ig0KICAgICAgIHJ4PSIyNi42Ig0KICAgICAgIHJ5PSIxMS44Ig0KICAgICAgIHN0eWxlPSJmaWxsOiNiZGMzYzciIC8+PC9nPjxlbGxpcHNlDQogICAgIHN0eWxlPSJkaXNwbGF5OmlubGluZTtvdmVyZmxvdzp2aXNpYmxlO3Zpc2liaWxpdHk6dmlzaWJsZTtvcGFjaXR5OjAuMTk4ODYzNjc7ZmlsbDp1cmwoI3JhZGlhbEdyYWRpZW50Mjk0OTEpO2ZpbGwtb3BhY2l0eToxO2ZpbGwtcnVsZTpub256ZXJvO3N0cm9rZTpub25lO3N0cm9rZS13aWR0aDoxO3N0cm9rZS1saW5lY2FwOmJ1dHQ7c3Ryb2tlLWxpbmVqb2luOm1pdGVyO3N0cm9rZS1taXRlcmxpbWl0OjQ7c3Ryb2tlLWRhc2hhcnJheTpub25lO3N0cm9rZS1kYXNob2Zmc2V0OjA7c3Ryb2tlLW9wYWNpdHk6MTttYXJrZXI6bm9uZTttYXJrZXItc3RhcnQ6bm9uZTttYXJrZXItbWlkOm5vbmU7bWFya2VyLWVuZDpub25lIg0KICAgICBpZD0icGF0aDIyNTgiDQogICAgIGN4PSIxNS42NTQ2OTMiDQogICAgIGN5PSIxOC4zMzA3MyINCiAgICAgcng9IjQuMjYzMzg0MyINCiAgICAgcnk9IjEuMjMwMzI5NiIgLz48ZWxsaXBzZQ0KICAgICBzdHlsZT0iZGlzcGxheTppbmxpbmU7b3ZlcmZsb3c6dmlzaWJsZTt2aXNpYmlsaXR5OnZpc2libGU7b3BhY2l0eTowLjMxMjU7ZmlsbDp1cmwoI3JhZGlhbEdyYWRpZW50Mjk0OTMpO2ZpbGwtb3BhY2l0eToxO2ZpbGwtcnVsZTpub256ZXJvO3N0cm9rZTpub25lO3N0cm9rZS13aWR0aDoxO3N0cm9rZS1saW5lY2FwOmJ1dHQ7c3Ryb2tlLWxpbmVqb2luOm1pdGVyO3N0cm9rZS1taXRlcmxpbWl0OjQ7c3Ryb2tlLWRhc2hhcnJheTpub25lO3N0cm9rZS1kYXNob2Zmc2V0OjA7c3Ryb2tlLW9wYWNpdHk6MTttYXJrZXI6bm9uZTttYXJrZXItc3RhcnQ6bm9uZTttYXJrZXItbWlkOm5vbmU7bWFya2VyLWVuZDpub25lIg0KICAgICBpZD0icGF0aDMwMzkiDQogICAgIGN4PSI4LjMwODI5MDUiDQogICAgIGN5PSIxOC41MDA5MTYiDQogICAgIHJ4PSI0Ljc0NTU4MjEiDQogICAgIHJ5PSIxLjQ1NzI0NTIiIC8+PHBhdGgNCiAgICAgc3R5bGU9ImRpc3BsYXk6aW5saW5lO292ZXJmbG93OnZpc2libGU7dmlzaWJpbGl0eTp2aXNpYmxlO2ZpbGw6dXJsKCNsaW5lYXJHcmFkaWVudDI5NDk1KTtmaWxsLW9wYWNpdHk6MTtmaWxsLXJ1bGU6bm9uemVybztzdHJva2U6IzNmM2YzZjtzdHJva2Utd2lkdGg6MTtzdHJva2UtbGluZWNhcDpidXR0O3N0cm9rZS1saW5lam9pbjptaXRlcjtzdHJva2UtbWl0ZXJsaW1pdDo0O3N0cm9rZS1kYXNoYXJyYXk6bm9uZTtzdHJva2UtZGFzaG9mZnNldDowO3N0cm9rZS1vcGFjaXR5OjE7bWFya2VyOm5vbmU7bWFya2VyLXN0YXJ0Om5vbmU7bWFya2VyLW1pZDpub25lO21hcmtlci1lbmQ6bm9uZSINCiAgICAgc29kaXBvZGk6bm9kZXR5cGVzPSJjY3pjY2NjY2NjY2NzYyINCiAgICAgaWQ9InBhdGgyMTQwIg0KICAgICBkPSJtIDkuOTUxNzU3NiwxMS42NTkyMjUgNi4wOTQ4NjQ0LDYuMjM1Nzg4IGMgMC4yNDY2MTQsMC4yODE4NDQgMS4wMjgwMywwLjQ5OTY3MiAxLjU1MDE0LDAgMC41MDQxODUsLTAuNDgyNTIzIDAuMzg3NTM1LC0xLjE2MjYwNiAtMC4xMDU2OSwtMS42NTU4MzEgTCAxMS42NDI4MTgsOS45NjgxNjQ4IEMgMTIuMzY0ODYsNy45NjI0OTMxIDEwLjkwMzQ4Niw2LjI3Nzg2NjYgOS4wMTgxNTQxLDYuNjM4ODg3NCBMIDguNjEzMDAyMiw3LjAwODgwNyA5Ljg4MTI5OTIsOC4yMDY2NDI1IDkuOTUxNzU3Niw5LjI2MzU1NzcgOS4wMDQ4MTEsMTAuMTI3OTU0IDcuODczMTYxNSwxMC4wMDMzOTcgNi43MTA1Niw4LjkxMTI1MjYgYyAwLDAgLTAuNDA3NTkxMiwwLjQwMjcwNjkgLTAuNDA3NTkxMiwwLjQwMjcwNjkgLTAuMTg5NTgxMSwxLjgxMDM0MjUgMS43MDMyODY5LDMuNDI4MzI4NSAzLjY0ODc4ODgsMi4zNDUyNjU1IHoiDQogICAgIGlua3NjYXBlOmNvbm5lY3Rvci1jdXJ2YXR1cmU9IjAiIC8+PHBhdGgNCiAgICAgc3R5bGU9ImRpc3BsYXk6aW5saW5lO292ZXJmbG93OnZpc2libGU7dmlzaWJpbGl0eTp2aXNpYmxlO29wYWNpdHk6MC40MjYxMzYzOTtmaWxsOm5vbmU7ZmlsbC1vcGFjaXR5OjE7ZmlsbC1ydWxlOm5vbnplcm87c3Ryb2tlOiNmZmZmZmY7c3Ryb2tlLXdpZHRoOjAuMzIwOTA3MjQ7c3Ryb2tlLWxpbmVjYXA6YnV0dDtzdHJva2UtbGluZWpvaW46bWl0ZXI7c3Ryb2tlLW1pdGVybGltaXQ6NDtzdHJva2UtZGFzaGFycmF5Om5vbmU7c3Ryb2tlLWRhc2hvZmZzZXQ6MDtzdHJva2Utb3BhY2l0eToxO21hcmtlcjpub25lO21hcmtlci1zdGFydDpub25lO21hcmtlci1taWQ6bm9uZTttYXJrZXItZW5kOm5vbmUiDQogICAgIHNvZGlwb2RpOm5vZGV0eXBlcz0iY2N6Y2NjY2NjY2NjY2MiDQogICAgIGlkPSJwYXRoMzA1NyINCiAgICAgZD0ibSAxMC4wMTkzNjYsMTEuMjQ5ODg2IDYuMTYyMzQ5LDYuNDI3MDEgYyAwLjE5MDkxMSwwLjIxODE4MSAwLjc5NTgyOCwwLjM4NjgwOSAxLjIwMDAwNCwwIDAuMzkwMzA3LC0wLjM3MzUzMyAwLjMwMDAwNCwtMC45MDAwMDUgLTAuMDgxODIsLTEuMjgxODI3IEwgMTEuMzY1ODMsMTAuMDk4NDk1IEMgMTEuODQ3MTkxLDguMDEyNTk2MyAxMC43NjkzMyw2Ljg4NzkzMDkgOS4xNjQ3OTMsNi45MjgwNDQ0IEwgOS4wNzgxMDYzLDcuMDE1Nzc0MiAxMC4yMzQzMSw4LjA1NDMxNzUgMTAuMjc2MDgzLDkuMzk2Mjg1IDkuMTE2MzQ4NSwxMC40NTQ3OTIgNy43NTQ5NjM2LDEwLjMwNzc0OSA2LjczNTU3MDQsOS4zNDc3NjA5IDYuNjIyNDExLDkuNDg1NzcwMSBjIC0wLjEwMDI4NDcsMS45MTU0MTY5IDIuMDgzMjM4OCwyLjc4NzAwNzkgMy4zOTY5NTUsMS43NjQxMTU5IHoiDQogICAgIGlua3NjYXBlOmNvbm5lY3Rvci1jdXJ2YXR1cmU9IjAiIC8+PHJlY3QNCiAgICAgeT0iLTAuNDY2MzA4NjUiDQogICAgIHg9IjE1LjQ1NDAyMyINCiAgICAgd2lkdGg9IjcuNDY2OTY0MiINCiAgICAgdHJhbnNmb3JtPSJtYXRyaXgoMC42OTc5MzgxNCwwLjcxNjE1ODA1LC0wLjcxNjE1ODA1LDAuNjk3OTM4MTQsMCwwKSINCiAgICAgc3R5bGU9ImRpc3BsYXk6aW5saW5lO292ZXJmbG93OnZpc2libGU7dmlzaWJpbGl0eTp2aXNpYmxlO29wYWNpdHk6MC4xNzA0NTQ1NjtmaWxsOm5vbmU7ZmlsbC1vcGFjaXR5OjE7ZmlsbC1ydWxlOm5vbnplcm87c3Ryb2tlOnVybCgjbGluZWFyR3JhZGllbnQyOTQ5Nyk7c3Ryb2tlLXdpZHRoOjAuMzIwOTA2NTg7c3Ryb2tlLWxpbmVjYXA6YnV0dDtzdHJva2UtbGluZWpvaW46bWl0ZXI7c3Ryb2tlLW1pdGVybGltaXQ6NDtzdHJva2UtZGFzaGFycmF5Om5vbmU7c3Ryb2tlLWRhc2hvZmZzZXQ6MDtzdHJva2Utb3BhY2l0eToxO21hcmtlcjpub25lO21hcmtlci1zdGFydDpub25lO21hcmtlci1taWQ6bm9uZTttYXJrZXItZW5kOm5vbmUiDQogICAgIHJ5PSIwLjI4MzY0MzkzIg0KICAgICByeD0iMC4yODM2NDM5MyINCiAgICAgaWQ9InJlY3QzMDU5Ig0KICAgICBoZWlnaHQ9IjAuNjU5NjIyNTUiIC8+PHBhdGgNCiAgICAgc3R5bGU9ImRpc3BsYXk6aW5saW5lO292ZXJmbG93OnZpc2libGU7dmlzaWJpbGl0eTp2aXNpYmxlO2ZpbGw6dXJsKCNsaW5lYXJHcmFkaWVudDI5NDk5KTtmaWxsLW9wYWNpdHk6MTtmaWxsLXJ1bGU6bm9uemVybztzdHJva2U6IzNmM2YzZjtzdHJva2Utd2lkdGg6MTtzdHJva2UtbGluZWNhcDpidXR0O3N0cm9rZS1saW5lam9pbjptaXRlcjtzdHJva2UtbWl0ZXJsaW1pdDo0O3N0cm9rZS1kYXNoYXJyYXk6bm9uZTtzdHJva2UtZGFzaG9mZnNldDowO3N0cm9rZS1vcGFjaXR5OjE7bWFya2VyOm5vbmU7bWFya2VyLXN0YXJ0Om5vbmU7bWFya2VyLW1pZDpub25lO21hcmtlci1lbmQ6bm9uZSINCiAgICAgc29kaXBvZGk6bm9kZXR5cGVzPSJjY2NjY2NjY2MiDQogICAgIGlkPSJwYXRoMjE0NCINCiAgICAgZD0ibSAxMS40MjUzOTQsMTQuNTE4NDE4IGMgMC4yNjc0ODksLTAuMjI5Mjc5IDQuMjYyODgsLTQuMzE1NzI4IDQuMjYyODgsLTQuMzE1NzI4IGwgMC45ODY0NTEsLTAuMDcwNDYgMS41NTAxNCwtMi4xNDkwNTY3IC0xLjI5MTQzOCwtMS4xNTA1MTQ0IC0yLjAwODEzMywxLjcyNjI4OTcgMCwwLjk4NjQ1MzcgLTQuMDg2NzMxLDQuMjQ1MjY1NyBjIC0wLjE5Mzc2NywwLjE5Mzc2NyAwLjM0MDIxNiwwLjkzOTEzMyAwLjU4NjgzMSwwLjcyNzc1MSB6Ig0KICAgICBpbmtzY2FwZTpjb25uZWN0b3ItY3VydmF0dXJlPSIwIiAvPjxwYXRoDQogICAgIHN0eWxlPSJkaXNwbGF5OmlubGluZTtvdmVyZmxvdzp2aXNpYmxlO3Zpc2liaWxpdHk6dmlzaWJsZTtvcGFjaXR5OjAuNTM5NzcyNzI7ZmlsbDpub25lO2ZpbGwtb3BhY2l0eToxO2ZpbGwtcnVsZTpub256ZXJvO3N0cm9rZTp1cmwoI2xpbmVhckdyYWRpZW50Mjk1MDEpO3N0cm9rZS13aWR0aDowLjMyMDkwNzU5O3N0cm9rZS1saW5lY2FwOmJ1dHQ7c3Ryb2tlLWxpbmVqb2luOm1pdGVyO3N0cm9rZS1taXRlcmxpbWl0OjQ7c3Ryb2tlLWRhc2hhcnJheTpub25lO3N0cm9rZS1kYXNob2Zmc2V0OjA7c3Ryb2tlLW9wYWNpdHk6MTttYXJrZXI6bm9uZTttYXJrZXItc3RhcnQ6bm9uZTttYXJrZXItbWlkOm5vbmU7bWFya2VyLWVuZDpub25lIg0KICAgICBzb2RpcG9kaTpub2RldHlwZXM9ImNjY2NjY2NjYyINCiAgICAgaWQ9InBhdGgzMDg1Ig0KICAgICBkPSJNIDExLjM5NDMyNywxNC4xODQ2OTcgQyAxMS42MDE4OCwxNC4wMDY3OTIgMTUuNTczOTU0LDkuOTM5MTUxNSAxNS41NzM5NTQsOS45MzkxNTE1IEwgMTYuNTEzNzU4LDkuODU5NTY5NyAxNy44NjYwMzYsOC4wNDI1Njg5IDE2LjkzODcsNy4yMjQ1NzkgMTUuMTgxMjI0LDguNzM4NDUwNiAxNS4yMzEwNDksOS42NTMzNDUgMTEuMTYzMTksMTMuOTE4OTUgYyAtMC4xNTAzNTIsMC4xNTAzNTIgMC4wMzk3OCwwLjQyOTc2NiAwLjIzMTEzNywwLjI2NTc0NyB6Ig0KICAgICBpbmtzY2FwZTpjb25uZWN0b3ItY3VydmF0dXJlPSIwIiAvPjxwYXRoDQogICAgIHN0eWxlPSJkaXNwbGF5OmlubGluZTtvdmVyZmxvdzp2aXNpYmxlO3Zpc2liaWxpdHk6dmlzaWJsZTtmaWxsOnVybCgjbGluZWFyR3JhZGllbnQyOTUwMyk7ZmlsbC1vcGFjaXR5OjE7ZmlsbC1ydWxlOm5vbnplcm87c3Ryb2tlOiMyMDRhODc7c3Ryb2tlLXdpZHRoOjE7c3Ryb2tlLWxpbmVjYXA6YnV0dDtzdHJva2UtbGluZWpvaW46bWl0ZXI7c3Ryb2tlLW1pdGVybGltaXQ6NDtzdHJva2UtZGFzaG9mZnNldDowO3N0cm9rZS1vcGFjaXR5OjE7bWFya2VyOm5vbmU7bWFya2VyLXN0YXJ0Om5vbmU7bWFya2VyLW1pZDpub25lO21hcmtlci1lbmQ6bm9uZTtzdHJva2UtZGFzaGFycmF5Om5vbmUiDQogICAgIHNvZGlwb2RpOm5vZGV0eXBlcz0iY2NjY2Njc2NjIg0KICAgICBpZD0icGF0aDIxNDIiDQogICAgIGQ9Im0gNi45MjE5NDIxLDE4Ljg0NjIzNCBjIDAuNDIyNTA0MywwLjQ3MDIwNCAxLjU5NjA5NDEsMC42ODI5NDMgMi4xMTY1Mjg4LC0wLjIyNzgxOCAwLjIyNjkxMzUsLTAuMzk3MTAxIDAuNjcxOTYxLC0xLjUwOTE2NCAyLjY1NzQ3MzEsLTMuMjk2MTI1IDAuMzMzNDcyLC0wLjI5OTc4NSAwLjY4NjcxMywtMC45ODU1NTEgMC4zODcyNTYsLTEuMzU1NDcxIGwgLTAuNzc1MDY5LC0wLjc3NTA2OSBjIC0wLjMxNzA3MywtMC4zNTIzMDUgLTEuMTk4NDAzLC0wLjE4Nzk3MSAtMS41NTk5ODk1LDAuMzA1MTQxIC0xLjA3Nzg0OTIsMS40NzQ5NTYgLTIuODM4NzcwNCwyLjY0OTA1NCAtMy4yMzU4NzI5LDIuNzkwODc1IC0wLjc1OTg4MzQsMC4yNzEzODkgLTAuNjc0MzYsMS4zOTE1MDMgLTAuMTcxNjI3MywxLjkyNDMxOSBsIDAuNTgxMzAwOCwwLjYzNDE0OCB6Ig0KICAgICBpbmtzY2FwZTpjb25uZWN0b3ItY3VydmF0dXJlPSIwIiAvPjxjaXJjbGUNCiAgICAgc3R5bGU9ImRpc3BsYXk6aW5saW5lO292ZXJmbG93OnZpc2libGU7dmlzaWJpbGl0eTp2aXNpYmxlO2ZpbGw6I2ZmZmZmZjtmaWxsLW9wYWNpdHk6MTtmaWxsLXJ1bGU6bm9uemVybztzdHJva2U6Izg4OGE4NTtzdHJva2Utd2lkdGg6MC4zMjA5MDczODtzdHJva2UtbGluZWNhcDpidXR0O3N0cm9rZS1saW5lam9pbjptaXRlcjtzdHJva2UtbWl0ZXJsaW1pdDo0O3N0cm9rZS1kYXNoYXJyYXk6bm9uZTtzdHJva2UtZGFzaG9mZnNldDowO3N0cm9rZS1vcGFjaXR5OjAuOTQxMTc2NDc7bWFya2VyOm5vbmU7bWFya2VyLXN0YXJ0Om5vbmU7bWFya2VyLW1pZDpub25lO21hcmtlci1lbmQ6bm9uZSINCiAgICAgaWQ9InBhdGgyMTQ2Ig0KICAgICBjeD0iMTYuNzg2NDY1Ig0KICAgICBjeT0iMTcuMDQ5NDgyIg0KICAgICByPSIwLjM4NzUzNDcxIiAvPjxjaXJjbGUNCiAgICAgc3R5bGU9ImRpc3BsYXk6aW5saW5lO292ZXJmbG93OnZpc2libGU7dmlzaWJpbGl0eTp2aXNpYmxlO29wYWNpdHk6MC42MDIyNzI3MjtmaWxsOiNmZmZmZmY7ZmlsbC1vcGFjaXR5OjE7ZmlsbC1ydWxlOm5vbnplcm87c3Ryb2tlOm5vbmU7c3Ryb2tlLXdpZHRoOjE7c3Ryb2tlLWxpbmVjYXA6YnV0dDtzdHJva2UtbGluZWpvaW46bWl0ZXI7c3Ryb2tlLW1pdGVybGltaXQ6NDtzdHJva2UtZGFzaGFycmF5Om5vbmU7c3Ryb2tlLWRhc2hvZmZzZXQ6MDtzdHJva2Utb3BhY2l0eToxO21hcmtlcjpub25lO21hcmtlci1zdGFydDpub25lO21hcmtlci1taWQ6bm9uZTttYXJrZXItZW5kOm5vbmUiDQogICAgIGlkPSJwYXRoMzEwMSINCiAgICAgY3g9IjEwLjYyNDYyOSINCiAgICAgY3k9IjEzLjYyNzkwMyINCiAgICAgcj0iMC4zMjM4NTIwNiIgLz48cGF0aA0KICAgICBzdHlsZT0iZGlzcGxheTppbmxpbmU7b3ZlcmZsb3c6dmlzaWJsZTt2aXNpYmlsaXR5OnZpc2libGU7ZmlsbDpub25lO2ZpbGwtb3BhY2l0eToxO2ZpbGwtcnVsZTpub256ZXJvO3N0cm9rZTp1cmwoI2xpbmVhckdyYWRpZW50Mjk1MDUpO3N0cm9rZS13aWR0aDowLjczNjMyNTI7c3Ryb2tlLWxpbmVjYXA6cm91bmQ7c3Ryb2tlLWxpbmVqb2luOnJvdW5kO3N0cm9rZS1taXRlcmxpbWl0OjQ7c3Ryb2tlLWRhc2hhcnJheTpub25lO3N0cm9rZS1kYXNob2Zmc2V0OjA7c3Ryb2tlLW9wYWNpdHk6MTttYXJrZXI6bm9uZTttYXJrZXItc3RhcnQ6bm9uZTttYXJrZXItbWlkOm5vbmU7bWFya2VyLWVuZDpub25lIg0KICAgICBzb2RpcG9kaTpub2RldHlwZXM9ImNjIg0KICAgICBpZD0icGF0aDI5MzU1Ig0KICAgICBkPSJtIDEwLjE5OTU2MiwxNC4zNTc3NzggYyAwLDAgLTIuMzAwODcwNCwyLjM0MjUwMyAtMy4zNzg3MjEzLDIuNzM5NjA0Ig0KICAgICBpbmtzY2FwZTpjb25uZWN0b3ItY3VydmF0dXJlPSIwIiAvPjxwYXRoDQogICAgIHN0eWxlPSJkaXNwbGF5OmlubGluZTtvdmVyZmxvdzp2aXNpYmxlO3Zpc2liaWxpdHk6dmlzaWJsZTtvcGFjaXR5OjAuMTk4ODYzNjc7ZmlsbDpub25lO2ZpbGwtb3BhY2l0eToxO2ZpbGwtcnVsZTpub256ZXJvO3N0cm9rZTojZmZmZmZmO3N0cm9rZS13aWR0aDowLjMyMDkwNzMyO3N0cm9rZS1saW5lY2FwOmJ1dHQ7c3Ryb2tlLWxpbmVqb2luOm1pdGVyO3N0cm9rZS1taXRlcmxpbWl0OjQ7c3Ryb2tlLWRhc2hhcnJheTpub25lO3N0cm9rZS1kYXNob2Zmc2V0OjA7c3Ryb2tlLW9wYWNpdHk6MTttYXJrZXI6bm9uZTttYXJrZXItc3RhcnQ6bm9uZTttYXJrZXItbWlkOm5vbmU7bWFya2VyLWVuZDpub25lIg0KICAgICBzb2RpcG9kaTpub2RldHlwZXM9ImNzY2NjY3NjYyINCiAgICAgaWQ9InBhdGgyMjcwIg0KICAgICBkPSJtIDcuMDMxMjcxMSwxOC40ODUyNTUgYyAwLjQ2MjUxNTYsMC41NjAxOCAxLjQ3NjAyNjYsMC42OTM1NTUgMS43OTQyNDU0LC0wLjExODkyNSAwLjIxODYzNzYsLTAuNTU4MjIyIDEuMDY5NzgzOSwtMS44MTgxOTQgMi42MzA2Njg1LC0zLjIyMjk5IDAuMjYyMTUyLC0wLjIzNTY2NyAwLjUzOTg0NiwtMC43NzQ3NzMgMC4zMDQ0MzIsLTEuMDY1NTgyIEwgMTEuMTUxMzEsMTMuNDY4NDUxIGMgLTAuMjQ5MjY1LC0wLjI3Njk2IC0wLjk0MjEwOCwtMC4xNDc3NzIgLTEuMjI2MzYxMiwwLjIzOTg4MSAtMC44NDczMzY5LDEuMTU5NTEzIC0yLjcyMjM3MSwyLjY3NjIyNyAtMy4xNzU2MTk1LDIuODI1NzkzIC0wLjcwMTc2MzEsMC4yMzE1NyAtMC41NzAyNTUxLDEuMDMzNzM5IC0wLjE3NTAzOTEsMS40NTI2MDQgbCAwLjQ1Njk4MDksMC40OTg1MjYgeiINCiAgICAgaW5rc2NhcGU6Y29ubmVjdG9yLWN1cnZhdHVyZT0iMCIgLz48cGF0aA0KICAgICBzdHlsZT0iZGlzcGxheTppbmxpbmU7b3ZlcmZsb3c6dmlzaWJsZTt2aXNpYmlsaXR5OnZpc2libGU7b3BhY2l0eTowLjI3ODQwOTExO2ZpbGw6bm9uZTtmaWxsLW9wYWNpdHk6MTtmaWxsLXJ1bGU6bm9uemVybztzdHJva2U6dXJsKCNsaW5lYXJHcmFkaWVudDI5NTA3KTtzdHJva2Utd2lkdGg6MC43MzYzMjUyO3N0cm9rZS1saW5lY2FwOnJvdW5kO3N0cm9rZS1saW5lam9pbjpyb3VuZDtzdHJva2UtbWl0ZXJsaW1pdDo0O3N0cm9rZS1kYXNob2Zmc2V0OjA7c3Ryb2tlLW9wYWNpdHk6MTttYXJrZXI6bm9uZTttYXJrZXItc3RhcnQ6bm9uZTttYXJrZXItbWlkOm5vbmU7bWFya2VyLWVuZDpub25lIg0KICAgICBzb2RpcG9kaTpub2RldHlwZXM9ImNjIg0KICAgICBpZD0icGF0aDIyNDciDQogICAgIGQ9Im0gMTAuODg4MTMsMTQuODgyODUzIGMgMCwwIC0yLjM0OTkyOTYsMi4xMjM1NzcgLTIuODYwNDg4NCwzLjQ4NTA3MiINCiAgICAgaW5rc2NhcGU6Y29ubmVjdG9yLWN1cnZhdHVyZT0iMCIgLz48L3N2Zz4='
			});
		},
	}
}