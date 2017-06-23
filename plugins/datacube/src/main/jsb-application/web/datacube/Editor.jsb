{
	$name: 'JSB.DataCube.Editor',
	$parent: 'JSB.Widgets.Widget',
	$require: {
		SplitLayoutManager: 'JSB.Widgets.SplitLayoutManager',
		ToolBar: 'JSB.Widgets.ToolBar',
		ToolManager: 'JSB.Widgets.ToolManager',
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
							minSize: 350,
							widgets: 'workspaceExplorer',
							caption: true
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
					}
				}
			});
			this.append(this.layoutManager);
			$this.publish('DataCube.Editor.initialized');
			
			this.subscribe('Workspace.Explorer.initialized', function(explorer){
				// inject toolbar buttons
				explorer.toolbar.insertItem({
					key: 'createCube',
					tooltip: 'Создать куб',
					element: '<div class="icon"></div>',
					click: function(){
						explorer.createNewEntry('JSB.DataCube.Model.Cube');
					}
				}, 'createSeparator');
			});
		}
	}
}