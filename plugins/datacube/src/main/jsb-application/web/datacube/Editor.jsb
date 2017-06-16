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
							split: 'horizontal',
							minSize: '50%',
							key: 'workArea',
							panes: [{
								key: 'workspaceBrowser',
								size: 0.7,
								minSize: '20%',
								widgets: 'workspaceBrowser'
							},{
								minSize: 100,
								widgets: [ 'console'],
								caption: true
							}]
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
					console: {
						jsb: 'Console',
						title: 'Консоль'
					},
				}
			});
			this.append(this.layoutManager);
			$this.publish('JSB.DataCube.editorInitialized');
		}
	}
}