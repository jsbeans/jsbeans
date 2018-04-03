{
	$name: 'DataCube.WidgetApiView',
	$parent: 'JSB.Workspace.BrowserView',
	
	$client: {
		$require: ['JSB.Widgets.SplitBox'],
		ready: false,
		ignoreHandlers: false,
		
		$constructor: function(opts){
			$base(opts);
			
			this.loadCss('WidgetApiView.css');
			this.addClass('widgetApiView');
			
			var splitBox = new SplitBox({
				type: 'vertical',
				position: 0.4
			});
			this.append(splitBox);
			splitBox.addToPane(0, `#dot
				<div class="leftPane">
					<div jsb="JSB.Widgets.GroupBox" caption="Идентификация виджета" collapsible="false" class="widgetSettings">
						<div class="option workspaceId">
							<div class="icon"></div>
							<div class="editor" jsb="JSB.Widgets.PrimitiveEditor" readonly="true" title="Идентификатор рабочей области" placeholder="Идентификатор рабочей области"></div>
						</div>
						
						<div class="option widgetId">
							<div class="icon"></div>
							<div class="editor" jsb="JSB.Widgets.PrimitiveEditor" readonly="true" title="Идентификатор виджета" placeholder="Идентификатор виджета"></div>
						</div>
					</div>
					
					<div jsb="JSB.Widgets.GroupBox" caption="HTML" collapsible="false" class="htmlView">
						<div jsb="JSB.Widgets.MultiEditor" valuetype="org.jsbeans.types.Html"></div>
					</div>
				</div>
			`);
			
			splitBox.addToPane(1, `#dot
				<div class="rightPane">
					<div jsb="JSB.Widgets.GroupBox" caption="Виджет" collapsible="false" class="widgetView">
						<div class="option buttons">
							<div jsb="JSB.Widgets.Button" class="roundButton btn16 btnRefresh" caption="Обновить"
								onclick="{{=this.callbackAttr(function(evt){$this.updateFrame()})}}"></div>
						</div>
						<div class="option widget">
							<iframe></iframe>
						</div>
					</div>
				</div>
			`);
/*			
			var hSplitBox = new SplitBox({
				type: 'horizontal',
				position: 0.3
			});
			
			hSplitBox.addClass('hSplit');
			
			this.find('.rightPane').append(hSplitBox.getElement());
			
			hSplitBox.addToPane(0, `#dot
				<div jsb="JSB.Widgets.GroupBox" caption="CSS стили" collapsible="false" class="cssView">
					<div jsb="JSB.Widgets.MultiEditor" valuetype="org.jsbeans.types.Css"></div>
				</div>
			`);
			
			hSplitBox.addToPane(1, `#dot
				<div jsb="JSB.Widgets.GroupBox" caption="Виджет" collapsible="false" class="widgetView">
					<div class="option buttons">
						<div jsb="JSB.Widgets.Button" class="roundButton btn16 btnRefresh" caption="Обновить"
							onclick="{{=this.callbackAttr(function(evt){$this.updateFrame()})}}"></div>
					</div>
					<div class="option widget">
						<iframe></iframe>
					</div>
				</div>
			`);
			
			hSplitBox.showPane(0, false);	// hide CSS pane
*/			
			
			this.find('.widgetSettings').resize(function(){
				var h = $this.find('.widgetSettings').outerHeight() + 10;
				$this.find('.htmlView').css('height', 'calc(100% - ' + h + 'px)');
			});
		},

		fillSettings: function(){
			var entry = this.node.getEntry();
			$this.ignoreHandlers = true;
			var wid = entry.getWorkspace().getId();
			var eid = entry.getId();
			
			// fill id
			this.find('.workspaceId > .editor').jsb().setData(wid);
			this.find('.widgetId > .editor').jsb().setData(eid);
			
			// fill html
			var jsbPath = JSB.getProvider().getServerBase() + 'datacube/api/WidgetController.jsb';
			var html = `#dot <html>
	<head>
	
		<!-- Загрузка API компонента для внедрения виджетов -->
		<script type="text/javascript" 
				src="{{=jsbPath}}">
		</script>
		
		<style>
			body { margin: 0; }
			
			#myWidgetContainer {
				width: 100%;
				height: 100%;
			}
		</style>
		
	</head>
	
	<body>
	
		<!-- 
		Автоматическое встраивание виджета.
		
		Для автоматического встраивания виджета DataCube внутрь контейнера 
		необходимо установить атрибут jsb="DataCube.Api.Widget". 
		DataCube найдет подобную конструкцию в DOM и встроит виджет.
		
		Атрибуты:
			jsb - название бина (jsBeans), управляющего встроенным виджетом;
			wsid - идентификатор рабочей области ({{=entry.getWorkspace().getName()}});
			wid - инетификатор виджета ({{=entry.getName()}});
			auto - автоматический запуск отрисовки виджета после инициализации;
			oncreatewidget - обработчик события создания виджета.
		-->
		
		<div id="myWidgetContainer" 
			 jsb="DataCube.Api.Widget"
			 wsid="{{=wid}}" 
			 wid="{{=eid}}"
			 auto="true"
			 oncreatewidget="function(widget){ console.log(widget); }">
		</div>
		
		
		<!-- Управление виджетом -->
		
		<script type="text/javascript">
			/* Программное встраивание виджета */
			/*
			JSB.create('DataCube.Api.Widget', {
				wsid: "{{=wid}}", 
		 		wid: "{{=eid}}",
		 		onCreateWidget: function(widget){
		 			this.$('#myWidgetContainer').append(this.getElement());
		 			widget.refresh();
		 		}
			});
			*/

		
			/* Доступ к экземпляру виджета */
			JSB.getInstance('DataCube.Api.WidgetController')
			.lookupWidget('{{=eid}}', function(widget){
				/*
				// Программный запуск отрисовки/обновления виджета
				widget.refresh();
				*/

				/*
				// Установка сортировки
				widget.setSort({"count": -1});
				*/
				
				/* Управление фильтрами */
				/*
				// Добавление фильтра
				var filterDesc = {
					type: '$and',	// логический оператор фильтра
					op: '$lte',		// оператор сравнения поля среза
					field: 'count',	// название поля среза
					value: 1		// значение
				};
				
				var myFilterId = widget.addFilter(filterDesc);
				
				// обновление всех виджетов на странице с учетом фильтров
				widget.refreshAll();	
				
				// Удаление фильтра
				widget.removeFilter(myFilterId);
				
				// Проверка на наличие установленного фильтра
				widget.hasFilter(filterDesc);
				
				// Удаление всех фильтров
				widget.clearFilters();
				*/
				
				
				/* 
				// Доступ к экземпляру визуализации, где размещен виджет
				var dashboard = widget.getDashboard();
				console.log(dashboard.getName());
				
				// Получение списка дескрипторов виджетов, размещенных на визуализации
				dashboard.enumWidgets(function(wMap){
					for(var wId in wMap){
						console.log(wId + ':' + wMap[wId].getName());
					}
				});
				*/

			});
		</script>
		
	</body>
</html>`;

			this.find('.htmlView div[jsb="JSB.Widgets.MultiEditor"]').jsb().setData(html);
			
			$this.ignoreHandlers = false;
			$this.updateFrame();
		},
		
		updateFrame: function(){
			var multiEditor = this.find('.htmlView div[jsb="JSB.Widgets.MultiEditor"]').jsb();
			if(multiEditor.ensureTrigger('ready', function(){
				var html = $this.find('.htmlView div[jsb="JSB.Widgets.MultiEditor"]').jsb().getData().getValue();
				var iframe = $this.find('.widgetView iframe');
				var iframeNode = iframe.get(0);
				iframeNode.src = "about:blank";
				JSB.defer(function(){
					var doc = iframeNode.contentDocument;
					doc.designMode = "on";
					
					// put data into iframe
					doc.open();
					doc.write(html);
					doc.close();
					
					doc.designMode = "off";
				});
			}));
/*			
			if(!this.find('.htmlView div[jsb="JSB.Widgets.MultiEditor"]').jsb() || !this.find('.htmlView div[jsb="JSB.Widgets.MultiEditor"]').jsb().isReady()){
				JSB.deferUntil(function(){
					$this.updateFrame();
				}, function(){
					return $this.find('.htmlView div[jsb="JSB.Widgets.MultiEditor"]').jsb() && $this.find('.htmlView div[jsb="JSB.Widgets.MultiEditor"]').jsb().isReady();
				});
				return;
			}
*/			
		},
		
		refresh: function(){
			if(!this.ready){
				JSB.deferUntil(function(){
					$this.ready = true;
					$this.refresh();
				}, function(){
					return $this.isContentReady();
				});
				return;
			}

			$this.fillSettings();
		}
		
	},
	
	$server: {
		$require: 'JSB.Workspace.WorkspaceController',
		$bootstrap: function(){
			WorkspaceController.registerBrowserView(null, this, {
				priority: 0,
				acceptNode: ['DataCube.WidgetNode'],
				caption: 'API',
				icon: 'data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiIHN0YW5kYWxvbmU9Im5vIj8+DQo8IS0tIEdlbmVyYXRvcjogQWRvYmUgSWxsdXN0cmF0b3IgMTkuMC4wLCBTVkcgRXhwb3J0IFBsdWctSW4gLiBTVkcgVmVyc2lvbjogNi4wMCBCdWlsZCAwKSAgLS0+DQoNCjxzdmcNCiAgIHhtbG5zOmRjPSJodHRwOi8vcHVybC5vcmcvZGMvZWxlbWVudHMvMS4xLyINCiAgIHhtbG5zOmNjPSJodHRwOi8vY3JlYXRpdmVjb21tb25zLm9yZy9ucyMiDQogICB4bWxuczpyZGY9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkvMDIvMjItcmRmLXN5bnRheC1ucyMiDQogICB4bWxuczpzdmc9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIg0KICAgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIg0KICAgeG1sbnM6c29kaXBvZGk9Imh0dHA6Ly9zb2RpcG9kaS5zb3VyY2Vmb3JnZS5uZXQvRFREL3NvZGlwb2RpLTAuZHRkIg0KICAgeG1sbnM6aW5rc2NhcGU9Imh0dHA6Ly93d3cuaW5rc2NhcGUub3JnL25hbWVzcGFjZXMvaW5rc2NhcGUiDQogICB2ZXJzaW9uPSIxLjEiDQogICBpZD0iTGF5ZXJfMSINCiAgIHg9IjBweCINCiAgIHk9IjBweCINCiAgIHZpZXdCb3g9IjAgMCAyNS45OTk5OTkgMjUuOTk5OTk5Ig0KICAgeG1sOnNwYWNlPSJwcmVzZXJ2ZSINCiAgIGlua3NjYXBlOnZlcnNpb249IjAuOTEgcjEzNzI1Ig0KICAgc29kaXBvZGk6ZG9jbmFtZT0icHV6emxlLnN2ZyINCiAgIHdpZHRoPSIyNiINCiAgIGhlaWdodD0iMjYiPjxtZXRhZGF0YQ0KICAgICBpZD0ibWV0YWRhdGE2MSI+PHJkZjpSREY+PGNjOldvcmsNCiAgICAgICAgIHJkZjphYm91dD0iIj48ZGM6Zm9ybWF0PmltYWdlL3N2Zyt4bWw8L2RjOmZvcm1hdD48ZGM6dHlwZQ0KICAgICAgICAgICByZGY6cmVzb3VyY2U9Imh0dHA6Ly9wdXJsLm9yZy9kYy9kY21pdHlwZS9TdGlsbEltYWdlIiAvPjxkYzp0aXRsZT48L2RjOnRpdGxlPjwvY2M6V29yaz48L3JkZjpSREY+PC9tZXRhZGF0YT48ZGVmcw0KICAgICBpZD0iZGVmczU5IiAvPjxzb2RpcG9kaTpuYW1lZHZpZXcNCiAgICAgcGFnZWNvbG9yPSIjZmZmZmZmIg0KICAgICBib3JkZXJjb2xvcj0iIzY2NjY2NiINCiAgICAgYm9yZGVyb3BhY2l0eT0iMSINCiAgICAgb2JqZWN0dG9sZXJhbmNlPSIxMCINCiAgICAgZ3JpZHRvbGVyYW5jZT0iMTAiDQogICAgIGd1aWRldG9sZXJhbmNlPSIxMCINCiAgICAgaW5rc2NhcGU6cGFnZW9wYWNpdHk9IjAiDQogICAgIGlua3NjYXBlOnBhZ2VzaGFkb3c9IjIiDQogICAgIGlua3NjYXBlOndpbmRvdy13aWR0aD0iMTkyMCINCiAgICAgaW5rc2NhcGU6d2luZG93LWhlaWdodD0iMTE3OCINCiAgICAgaWQ9Im5hbWVkdmlldzU3Ig0KICAgICBzaG93Z3JpZD0iZmFsc2UiDQogICAgIGlua3NjYXBlOnpvb209IjE1LjQ4NDkyOSINCiAgICAgaW5rc2NhcGU6Y3g9Ii0zLjgzODM1OCINCiAgICAgaW5rc2NhcGU6Y3k9IjguMDY2NDE2MiINCiAgICAgaW5rc2NhcGU6d2luZG93LXg9IjE5MTIiDQogICAgIGlua3NjYXBlOndpbmRvdy15PSItOCINCiAgICAgaW5rc2NhcGU6d2luZG93LW1heGltaXplZD0iMSINCiAgICAgaW5rc2NhcGU6Y3VycmVudC1sYXllcj0iTGF5ZXJfMSIgLz48Zw0KICAgICBpZD0iZzQxODkiDQogICAgIHRyYW5zZm9ybT0ibWF0cml4KDAuMDUzMjgxNzQsMCwwLDAuMDUzMjgxNzQsLTAuMDI3Mjc1MjIsMjQuNjEwNzY4KSI+PGcNCiAgICAgICB0cmFuc2Zvcm09InRyYW5zbGF0ZSgwLC00NjEuNzAwMDEpIg0KICAgICAgIHN0eWxlPSJmaWxsOiNkNDU1MDA7ZmlsbC1vcGFjaXR5OjEiDQogICAgICAgaWQ9ImczIj48Zw0KICAgICAgICAgc3R5bGU9ImZpbGw6I2Q0NTUwMDtmaWxsLW9wYWNpdHk6MSINCiAgICAgICAgIGlkPSJnNSI+PHBhdGgNCiAgICAgICAgICAgaW5rc2NhcGU6Y29ubmVjdG9yLWN1cnZhdHVyZT0iMCINCiAgICAgICAgICAgc3R5bGU9ImZpbGw6I2Q0NTUwMDtmaWxsLW9wYWNpdHk6MSINCiAgICAgICAgICAgaWQ9InBhdGg3Ig0KICAgICAgICAgICBkPSJtIDQ0OC4xNSwzMjIuOCBjIC05LDggLTIxLjgsNC41IC0yMS44LC0xMS4xIGwgMCwtMzcuNSBjIDAsLTExLjMgLTkuMywtMjAuNiAtMjAuNiwtMjAuNiBsIC0yNi4zLDAgYyAzLDYuMSA0LjYsMTIuNyA0LjYsMTkuMyAwLDIzLjEgLTE4LDQwLjYgLTQyLjgsNDEuNiBsIC0wLjgsMCAtMC44LDAgYyAtMjQuOCwtMSAtNDIuOCwtMTguNSAtNDIuOCwtNDEuNiAwLC02LjcgMS42LC0xMy4zIDQuNiwtMTkuMyBsIC0yNy40LDAgLTAuMSwwIC0wLjQsMCBjIC0xMS4xLDAgLTIwLjIsOSAtMjAuMiwyMC4yIGwgMCwzNy45IGMgMCwxNS42IC0xMywxOSAtMjIsMTEuMSAtMTQuOSwtMTMuMSAtMzcuNiwtNi4xIC0zOC42LDE3LjggMSwyMy45IDIzLjcsMzAuOSAzOC41LDE3LjggOSwtOCAyMi4xLC00LjUgMjIuMSwxMS4xIGwgMCwzNy4xIGMgMCwxMS4xIDksMjAuMiAyMC4yLDIwLjIgbCAzNy42LDAgYyAxNS42LDAgMTksMTMuMSAxMS4xLDIyLjEgLTEzLjEsMTQuOSAtNi4xLDM3LjggMTcuOCwzOC44IDIzLjksLTEgMzAuOSwtMjMuOSAxNy44LC0zOC44IC04LC05IC00LjUsLTIyLjIgMTEuMSwtMjIuMiBsIDM3LjQsMCBjIDExLjEsMCAyMC4yLC05IDIwLjIsLTIwLjIgbCAwLC0zNy4xIGMgMCwtMTUuNiAxMi43LC0xOSAyMS43LC0xMS4xIDE0LjcsMTMuMSAzNy40LDYuMSAzOC40LC0xNy43IC0xLC0yMy45IC0yMy42LC0zMC45IC0zOC41LC0xNy44IHoiIC8+PC9nPjwvZz48Zw0KICAgICAgIHRyYW5zZm9ybT0idHJhbnNsYXRlKDAsLTQ2MS43MDAwMSkiDQogICAgICAgc3R5bGU9ImZpbGw6IzFjNzhjMDtmaWxsLW9wYWNpdHk6MSINCiAgICAgICBpZD0iZzkiPjxnDQogICAgICAgICBzdHlsZT0iZmlsbDojMWM3OGMwO2ZpbGwtb3BhY2l0eToxIg0KICAgICAgICAgaWQ9ImcxMSI+PHBhdGgNCiAgICAgICAgICAgaW5rc2NhcGU6Y29ubmVjdG9yLWN1cnZhdHVyZT0iMCINCiAgICAgICAgICAgc3R5bGU9ImZpbGw6IzFjNzhjMDtmaWxsLW9wYWNpdHk6MSINCiAgICAgICAgICAgaWQ9InBhdGgxMyINCiAgICAgICAgICAgZD0ibSA0NDguMzUsMTI5LjMgYyAtOSw4IC0yMi4yLDQuNSAtMjIuMiwtMTEuMSBsIDAsLTM3LjIgYyAwLC0xMS4xIC05LC0yMC4yIC0yMC4yLC0yMC4yIGwgLTM3LjEsMCBjIC0xNS42LDAgLTE5LC0xMi43IC0xMS4xLC0yMS43IDEzLjEsLTE0LjkgNi4xLC0zNy42IC0xNy44LC0zOC42IC0yMy45LDEgLTMwLjksMjMuNiAtMTcuOCwzOC41IDgsOSA0LjUsMjEuOCAtMTEuMSwyMS44IGwgLTM3LjUsMCBjIC0xMS4zLDAgLTIwLjYsOS4zIC0yMC42LDIwLjYgbCAwLDI2LjMgYyA2LjEsLTMgMTIuNywtNC42IDE5LjMsLTQuNiAyMy4yLDAgNDAuNywxOCA0MS43LDQyLjggbCAwLDAuOCAwLDAuOCBjIC0xLDI0LjggLTE4LjUsNDIuOCAtNDEuNiw0Mi44IC02LjcsMCAtMTMuMywtMS42IC0xOS4zLC00LjYgbCAwLDI3LjQgMCwwLjEgMCwwLjQgYyAwLDExLjEgOSwyMC4yIDIwLjIsMjAuMiBsIDM3LjksMCBjIDE1LjYsMCAxOSwxMyAxMS4xLDIyIC0xMy4xLDE0LjkgLTYuMSwzNy42IDE3LjgsMzguNiAyMy45LC0xIDMwLjksLTIzLjcgMTcuOCwtMzguNSAtOCwtOSAtNC41LC0yMi4xIDExLjEsLTIyLjEgbCAzNy4xLDAgYyAxMS4xLDAgMjAuMiwtOSAyMC4yLC0yMC4yIGwgMCwtMzcuNiBjIDAsLTE1LjYgMTMuMSwtMTkgMjIuMSwtMTEuMSAxNC45LDEzLjEgMzcuOCw2LjEgMzguOCwtMTcuOCAtMSwtMjMuOSAtMjMuOSwtMzAuOSAtMzguOCwtMTcuOCB6IiAvPjwvZz48L2c+PGcNCiAgICAgICB0cmFuc2Zvcm09InRyYW5zbGF0ZSgwLC00NjEuNzAwMDEpIg0KICAgICAgIHN0eWxlPSJmaWxsOiMxYzc4YzA7ZmlsbC1vcGFjaXR5OjEiDQogICAgICAgaWQ9ImcxNSI+PGcNCiAgICAgICAgIHN0eWxlPSJmaWxsOiMxYzc4YzA7ZmlsbC1vcGFjaXR5OjEiDQogICAgICAgICBpZD0iZzE3Ij48cGF0aA0KICAgICAgICAgICBpbmtzY2FwZTpjb25uZWN0b3ItY3VydmF0dXJlPSIwIg0KICAgICAgICAgICBzdHlsZT0iZmlsbDojMWM3OGMwO2ZpbGwtb3BhY2l0eToxIg0KICAgICAgICAgICBpZD0icGF0aDE5Ig0KICAgICAgICAgICBkPSJtIDIxNC40NSwyNTMuMyAtMzcuOSwwIGMgLTE1LjYsMCAtMTksLTEzIC0xMS4xLC0yMiAxMy4xLC0xNC45IDYuMSwtMzcuNiAtMTcuOCwtMzguNiAtMjMuOSwxIC0zMC45LDIzLjcgLTE3LjgsMzguNSA4LDkgNC41LDIyLjEgLTExLjEsMjIuMSBsIC0zNy4xLDAgYyAtMTEuMSwwIC0yMC4yLDkgLTIwLjIsMjAuMiBsIDAsMzcuNiBjIDAsMTUuNiAtMTMuMSwxOSAtMjIuMSwxMS4xIC0xNC45LC0xMy4xIC0zNy44LC02LjEgLTM4LjgsMTcuOCAwLjksMjMuNyAyMy45LDMwLjcgMzguNywxNy42IDksLTggMjIuMiwtNC41IDIyLjIsMTEuMSBsIDAsMzcuNCBjIDAsMTEuMSA5LDIwLjIgMjAuMiwyMC4yIGwgMzcuMSwwIGMgMTUuNiwwIDE5LDEyLjcgMTEuMSwyMS43IC0xMy4xLDE0LjkgLTYuMSwzNy42IDE3LjgsMzguNiAyMy45LC0xIDMwLjksLTIzLjYgMTcuOCwtMzguNSAtOCwtOSAtNC41LC0yMS44IDExLjEsLTIxLjggbCAzNy41LDAgYyAxMS4zLDAgMjAuNiwtOS4zIDIwLjYsLTIwLjYgbCAwLC0yNi4zIGMgLTYuMSwzIC0xMi43LDQuNiAtMTkuMyw0LjYgLTIzLjEsMCAtNDAuNiwtMTggLTQxLjYsLTQyLjggbCAwLC0wLjggMCwtMC44IGMgMSwtMjQuOCAxOC41LC00Mi44IDQxLjYsLTQyLjggNi43LDAgMTMuMywxLjYgMTkuMyw0LjYgbCAwLC0yNy40IDAsLTAuMSAwLC0wLjQgYyAwLC0xMS4xIC05LC0yMC4yIC0yMC4yLC0yMC4yIHoiIC8+PC9nPjwvZz48Zw0KICAgICAgIHRyYW5zZm9ybT0idHJhbnNsYXRlKDAsLTQ2MS43MDAwMSkiDQogICAgICAgc3R5bGU9ImZpbGw6IzE4NjQ5ZjtmaWxsLW9wYWNpdHk6MSINCiAgICAgICBpZD0iZzIxIj48Zw0KICAgICAgICAgc3R5bGU9ImZpbGw6IzE4NjQ5ZjtmaWxsLW9wYWNpdHk6MSINCiAgICAgICAgIGlkPSJnMjMiPjxwYXRoDQogICAgICAgICAgIGlua3NjYXBlOmNvbm5lY3Rvci1jdXJ2YXR1cmU9IjAiDQogICAgICAgICAgIHN0eWxlPSJmaWxsOiMxODY0OWY7ZmlsbC1vcGFjaXR5OjEiDQogICAgICAgICAgIGlkPSJwYXRoMjUiDQogICAgICAgICAgIGQ9Im0gMjU2LjQ1LDEyOS4yIGMgLTksOCAtMjIuMSw0LjUgLTIyLjEsLTExLjEgbCAwLC0zNyBjIDAsLTExLjEgLTksLTIwLjIgLTIwLjIsLTIwLjIgbCAtMzcuNiwwIGMgLTE1LjYsMCAtMTksLTEzLjEgLTExLjEsLTIyLjEgMTMuMSwtMTQuOSA2LjEsLTM3LjggLTE3LjgsLTM4LjggLTIzLjksMSAtMzAuOSwyMy45IC0xNy44LDM4LjggOCw5IDQuNSwyMi4yIC0xMS4xLDIyLjIgbCAtMzcuMiwwIGMgLTExLjEsMCAtMjAuMiw5IC0yMC4yLDIwLjIgbCAwLDM3LjEgYyAwLDE1LjYgLTEyLjcsMTkgLTIxLjcsMTEuMSAtMTQuOSwtMTMuMSAtMzcuNiwtNi4xIC0zOC42LDE3LjggMSwyMy43IDIzLjYsMzAuNyAzOC41LDE3LjYgOSwtOCAyMS44LC00LjUgMjEuOCwxMS4xIGwgMCwzNy41IGMgMCwxMS4zIDkuMywyMC42IDIwLjYsMjAuNiBsIDI2LjMsMCBjIC0zLC02LjEgLTQuNiwtMTIuNyAtNC42LC0xOS4zIDAsLTIzLjEgMTgsLTQwLjYgNDIuOCwtNDEuNiBsIDAuOCwwIDAuOCwwIGMgMjQuOCwxIDQyLjgsMTguNSA0Mi44LDQxLjYgMCw2LjcgLTEuNiwxMy4zIC00LjYsMTkuMyBsIDI3LjQsMCAwLjEsMCAwLjQsMCBjIDExLjEsMCAyMC4yLC05IDIwLjIsLTIwLjIgbCAwLC0zNy45IGMgMCwtMTUuNiAxMywtMTkgMjIsLTExLjEgMTQuOSwxMy4xIDM3LjYsNi4xIDM4LjYsLTE3LjggLTEsLTIzLjkgLTIzLjcsLTMwLjkgLTM4LjUsLTE3LjggeiIgLz48L2c+PC9nPjwvZz48Zw0KICAgICBpZD0iZzI3Ig0KICAgICB0cmFuc2Zvcm09InRyYW5zbGF0ZSgwLC00NjEuNzAwMDEpIiAvPjxnDQogICAgIGlkPSJnMjkiDQogICAgIHRyYW5zZm9ybT0idHJhbnNsYXRlKDAsLTQ2MS43MDAwMSkiIC8+PGcNCiAgICAgaWQ9ImczMSINCiAgICAgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoMCwtNDYxLjcwMDAxKSIgLz48Zw0KICAgICBpZD0iZzMzIg0KICAgICB0cmFuc2Zvcm09InRyYW5zbGF0ZSgwLC00NjEuNzAwMDEpIiAvPjxnDQogICAgIGlkPSJnMzUiDQogICAgIHRyYW5zZm9ybT0idHJhbnNsYXRlKDAsLTQ2MS43MDAwMSkiIC8+PGcNCiAgICAgaWQ9ImczNyINCiAgICAgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoMCwtNDYxLjcwMDAxKSIgLz48Zw0KICAgICBpZD0iZzM5Ig0KICAgICB0cmFuc2Zvcm09InRyYW5zbGF0ZSgwLC00NjEuNzAwMDEpIiAvPjxnDQogICAgIGlkPSJnNDEiDQogICAgIHRyYW5zZm9ybT0idHJhbnNsYXRlKDAsLTQ2MS43MDAwMSkiIC8+PGcNCiAgICAgaWQ9Imc0MyINCiAgICAgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoMCwtNDYxLjcwMDAxKSIgLz48Zw0KICAgICBpZD0iZzQ1Ig0KICAgICB0cmFuc2Zvcm09InRyYW5zbGF0ZSgwLC00NjEuNzAwMDEpIiAvPjxnDQogICAgIGlkPSJnNDciDQogICAgIHRyYW5zZm9ybT0idHJhbnNsYXRlKDAsLTQ2MS43MDAwMSkiIC8+PGcNCiAgICAgaWQ9Imc0OSINCiAgICAgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoMCwtNDYxLjcwMDAxKSIgLz48Zw0KICAgICBpZD0iZzUxIg0KICAgICB0cmFuc2Zvcm09InRyYW5zbGF0ZSgwLC00NjEuNzAwMDEpIiAvPjxnDQogICAgIGlkPSJnNTMiDQogICAgIHRyYW5zZm9ybT0idHJhbnNsYXRlKDAsLTQ2MS43MDAwMSkiIC8+PGcNCiAgICAgaWQ9Imc1NSINCiAgICAgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoMCwtNDYxLjcwMDAxKSIgLz48L3N2Zz4='
			});
		},
	}
}