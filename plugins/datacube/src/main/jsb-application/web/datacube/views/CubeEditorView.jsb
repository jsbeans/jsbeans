{
	$name: 'DataCube.CubeEditorView',
	$parent: 'JSB.Workspace.BrowserView',
	
	$client: {
		$require: 'JSB.Widgets.SplitLayoutManager',
		
		$constructor: function(opts){
			$base(opts);
			
			this.loadCss('CubeEditorView.css');
			this.addClass('cubeEditorView');
			
			this.layoutManager = new SplitLayoutManager({
				defaultLayout: 'editor',
				layouts: {
					editor: {
						split: 'horizontal',
						panes: [{
							key: 'topPane',
							size: 0.6,
							minSize: '50%',
							widgets: 'cubeEditor'
						},{
							minSize: '100px',
							key: 'bottomPane',
							widgets: [ 'gridView' ],
						}]
					}
				},
				widgets: {
					cubeEditor: {
						jsb: 'DataCube.CubeEditor',
					},
					gridView: {
						jsb: 'DataCube.GridView',
						title: 'Таблица'
					},
				}
			});
			this.append(this.layoutManager);
		},
		
		refresh: function(){
			var cubeEditor = this.find('div[key="cubeEditor"] > ._dwp_widget').jsb();
			if(!cubeEditor){
				JSB.deferUntil(function(){
					$this.refresh();
				}, function(){
					return $this.find('div[key="cubeEditor"] > ._dwp_widget').jsb();
				}, 100, 'CubeEditorView.refresh');
				return;
			}
			cubeEditor.setCurrentEntry(this.node.getEntry());
		}
		
	},
	
	$server: {
		$require: 'JSB.Workspace.WorkspaceController',
		$bootstrap: function(){
			WorkspaceController.registerBrowserView(this, {
				wmKey: 'datacube',
				priority: 1,
				acceptNode: 'DataCube.CubeNode',
				caption: 'Схема куба'
			});
		},
	}
}