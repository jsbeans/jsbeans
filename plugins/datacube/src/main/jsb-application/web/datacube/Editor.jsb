{
	$name: 'DataCube.Editor',
	$parent: 'JSB.Widgets.Page',
	$require: [
	    'JQuery.UI',
	    'JQuery.UI.Loader',
		'JSB.Widgets.SplitLayoutManager',
		'JSB.Widgets.ToolBar',
		'JSB.Widgets.ToolManager',
	],
	
	$html: {
		title: 'DataCube',
		favicon: '/datacube/images/datacube.png'
	},
	
	$client: {
		$constructor: function(opts){
			$base(opts);
			this.loadCss('Editor.css');
			this.addClass('dataCubeEditor');
			$this.init();
			
		},
		
		init: function(){
			this.append(`
				<div class="dcHeader">
					<div class="dcLogo"></div>
					<div class="dcTitle">DataCube</div>
					<div class="dcSubTitle">Editor</div>
				</div>
			`);
			this.layoutManager = new SplitLayoutManager({
				defaultLayout: 'editor',
				layouts: {
					editor: {
						split: 'vertical',
						panes: [{
							key: 'leftPane',
							size: 0.2,
							split: 'horizontal',
							minSize: 380,
							panes: [{
								key: 'workspaceExplorer',
								widgets: 'workspaceExplorer',
								caption: true,
								size: 0.5,
								minSize: 200
							},{
								widgets: 'widgetExplorer',
								key: 'widgetExplorer',
								caption: true,
								minSize: 200
							}]
						},{
							minSize: '50%',
							key: 'workspaceBrowser',
							widgets: 'workspaceBrowser'
						}]
						
					}
				},
				widgets: {
					workspaceExplorer: {
						jsb: 'JSB.Workspace.Explorer',
						title: 'Навигатор',
						options: {
							wmKey: 'datacube'
						}
					},
					workspaceBrowser: {
						jsb: 'JSB.Workspace.Browser',
						title: 'Навигатор',
						options: {
							wmKey: 'datacube'
						}
					},
					widgetExplorer: {
						jsb: 'DataCube.Widgets.WidgetExplorer',
						title: 'Виджеты'
					}
				}
			});
			this.append(this.layoutManager);
			
			// hide widgets pane
			$this.layoutManager.find('._dwp_splitbox[key="leftPane"]').jsb().showPane(1, false);
			
			$this.publish('DataCube.Editor.initialized');
			
			this.subscribe('Workspace.Explorer.initialized', function(explorer){
				// inject toolbar buttons
				explorer.toolbar.insertItem({
					key: 'createSqlSource',
					tooltip: 'Создать подключение к базе данных',
					element: '<div class="icon"></div>',
					click: function(){
						explorer.createNewEntry('DataCube.Model.SqlSource', {}, 'База');
					}
				}, 'createSeparator');

				explorer.toolbar.insertItem({
					key: 'createHttpServer',
					tooltip: 'Создать подключение к серверу',
					element: '<div class="icon"></div>',
					click: function(){
						explorer.createNewEntry('DataCube.Model.HttpServer', {}, 'Сервер');
					}
				}, 'createSeparator');

				explorer.toolbar.insertItem({
					key: 'createCube',
					tooltip: 'Создать куб',
					element: '<div class="icon"></div>',
					click: function(){
						explorer.createNewEntry('DataCube.Model.Cube', {}, 'Куб');
					}
				}, 'createSeparator');

				
				explorer.toolbar.insertItem({
					key: 'createDashboard',
					tooltip: 'Создать визуализацию',
					element: '<div class="icon"></div>',
					click: function(){
						explorer.createNewEntry('DataCube.Model.Dashboard', {}, 'Визуализация');
					}
				}, 'createSeparator');
			});
			
			this.subscribe('Workspace.nodeOpen', function(sender, msg, node){
				var leftSplit = $this.layoutManager.find('._dwp_splitbox[key="leftPane"]').jsb();
				if(JSB.isInstanceOf(node, 'DataCube.DashboardNode') || JSB.isInstanceOf(node, 'DataCube.WidgetNode')){
					leftSplit.showPane(1, true);
				} else {
					leftSplit.showPane(1, false);
				}
			});
		}
	},
	
	$server: {
		
	}
}