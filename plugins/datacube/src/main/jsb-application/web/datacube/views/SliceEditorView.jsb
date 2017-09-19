{
	$name: 'DataCube.SliceEditorView',
	$parent: 'JSB.Workspace.BrowserView',
	$require: ['JSB.Widgets.SplitBox', 'DataCube.GridView', 'JSB.Widgets.ScrollBox', 'JSB.Widgets.MultiEditor', 'DataCube.Query.QueryEditor'],
	$client: {
		ready: false,
		ignoreHandlers: false,
		
		$constructor: function(opts){
			$base(opts);
			
			this.loadCss('SliceEditorView.css');
			this.addClass('sliceEditorView');
			
			var hSplitBox = new SplitBox({
				type: 'horizontal',
				position: 0.5
			});
			this.append(hSplitBox);
			
			// add editor split
			var vSplitBox = new SplitBox({
				type: 'vertical',
				position: 0.6
			});
			hSplitBox.addToPane(0, vSplitBox);
			
			var scrollBox = new ScrollBox();
			vSplitBox.addToPane(0, scrollBox);
			
			this.queryEditor = new QueryEditor();
			this.queryEditor.addClass('queryEditor');
			scrollBox.append(this.queryEditor);

			
			this.textQueryEditor = new MultiEditor({
				valueType: "org.jsbeans.types.JsonObject",
				showHints: false,
				readOnly: true
			});
			vSplitBox.addToPane(1, this.textQueryEditor);
			
			
			
			// add grid view
			this.gridView = new GridView();
			hSplitBox.addToPane(1, this.gridView);
		},
		
		refresh: function(){
			var entry = this.node.getEntry();
			if(!JSB.isInstanceOf(entry, 'DataCube.Model.Slice')){
				return;
			}
			this.queryEditor.setOption('slice', entry);
			this.queryEditor.set(entry.getQuery());
		},
		
	},
	
	$server: {
		$require: 'JSB.Workspace.WorkspaceController',
		$bootstrap: function(){
			WorkspaceController.registerBrowserView(this, {
				wmKey: 'datacube',
				priority: 0.5,
				acceptNode: ['DataCube.SliceNode'],
				caption: 'Редактирование'
			});
		},
	}
}