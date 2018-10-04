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
		title: `#dot {{=Config.get('datacube.title')}}`,
		favicon: '/datacube/images/datacube.png'
	},
	
	$client: {
		paused: false,
		
		$constructor: function(opts){
			$base(opts);
			this.loadCss('Editor.css');
			this.addClass('dataCubeEditor');
			$this.server().getVersion(function(v){
				$this.dcVersion = v;
				$this.init();
			});
		},
		
		init: function(){
			this.append(`#dot
				<div class="dcHeader">
					<div class="dcLogo"></div>
					<div class="dcTitle">
						<div class="caption">{{=$this.getJsb().$html.title}}</div>
						<div class="version">{{=$this.dcVersion}}</div>
					</div>
					
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
						title: 'Проекты',
						options: {}
					},
					workspaceBrowser: {
						jsb: 'JSB.Workspace.Browser',
						title: 'Навигатор',
						options: {}
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
			
			this.subscribe('JSB.Workspace.nodeOpen', function(sender, msg, node){
				var leftSplit = $this.layoutManager.find('._dwp_splitbox[key="leftPane"]').jsb();
				if(JSB.isInstanceOf(node, 'DataCube.DashboardNode') || JSB.isInstanceOf(node, 'DataCube.WidgetNode')){
					leftSplit.showPane(1, true);
				} else {
					leftSplit.showPane(1, false);
				}
			});
			
			this.subscribe('JSB.AjaxProvider.serverReloaded', function(){
				$this.getElement().loader({style:'reload', message:'<div class="title">Сервер был перезагружен</div><div class="subtitle">Через несколько секунд редактор перезапустится</div>'});
				JSB.defer(function(){
					location.reload();
				}, 5000);
				
			});
			
			this.subscribe('JSB.AjaxProvider.xhrStatus', function(sender, msg, status){
				if(status == 200){
					if($this.paused){
						$this.paused = false;
						$this.getElement().loader('hide');
					}
				} else {
					if($this.paused){
						return;
					}
					$this.paused = true;
					$this.getElement().loader({style:'connection', message:'<div class="title">Потеряна связь с сервером!</div><div class="subtitle">Вероятно, выполняется обновление</div>'});
				}
			});
			
			this.subscribe(['JSB.Workspace.Workspace.blocked'], function(sender, msg, error){
				$this.getElement().loader({style:'error', message:'<div class="title">Внутренняя ошибка сервера</div><div class="subtitle">'+error.message+'</div>'});
			});
		}
	},
	
	$server: {
		getVersion: function(){
			return Config.get('build.version');
		}
	}
}