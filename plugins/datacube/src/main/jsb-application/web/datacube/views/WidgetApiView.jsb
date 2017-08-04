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
			JSB.deferUntil(function(){
				$this.ready = true;
			}, function(){
				return $this.isContentReady();
			});
			
			this.find('.widgetSettings').resize(function(){
				var h = $this.find('.widgetSettings').outerHeight() + 10;
				$this.find('.htmlView').css('height', 'calc(100% - ' + h + 'px)');
			});
		},

		fillSettings: function(){
			var entry = this.node.getEntry();
			$this.ignoreHandlers = true;
			var wid = entry.workspace.getLocalId();
			var eid = entry.getLocalId();
			
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
			wsid - идентификатор рабочей области ({{=entry.workspace.getName()}});
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
		 			this.$('#myWidgetContainer').append(widget.getElement());
		 			widget.refresh();
		 		}
			});
			*/

		
			/* Доступ к экземпляру виджета */
		
			JSB.getInstance('DataCube.Api.WidgetController')
			.lookupWidget('{{=eid}}', function(widget){
				console.log(widget);
				
				/* Программный запуск отрисовки/обновления виджета */
				
				/*
				widget.refresh();
				*/
				
				
				/* Установка сортировки */
				
				/* 
				widget.setSort({"cubeFieldName": -1});
				*/
				
				/* Управление фильтрами */
				
				/*
				TODO: complete this manual
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
			if(!this.find('.htmlView div[jsb="JSB.Widgets.MultiEditor"]').jsb() || !this.find('.htmlView div[jsb="JSB.Widgets.MultiEditor"]').jsb().isReady()){
				JSB.deferUntil(function(){
					$this.updateFrame();
				}, function(){
					return $this.find('.htmlView div[jsb="JSB.Widgets.MultiEditor"]').jsb() && $this.find('.htmlView div[jsb="JSB.Widgets.MultiEditor"]').jsb().isReady();
				});
				return;
			}
			var html = this.find('.htmlView div[jsb="JSB.Widgets.MultiEditor"]').jsb().getData().getValue();
			var iframe = this.find('.widgetView iframe');
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
			
			$this.fillSettings();
		}
		
	},
	
	$server: {
		$require: 'JSB.Workspace.WorkspaceController',
		$bootstrap: function(){
			WorkspaceController.registerBrowserView(this, {
				wmKey: 'datacube',
				priority: 0,
				acceptNode: ['DataCube.WidgetNode'],
				caption: 'API'
			});
		},
	}
}