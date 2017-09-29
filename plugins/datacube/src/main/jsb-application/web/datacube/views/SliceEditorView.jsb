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
			
			this.queryEditor = new QueryEditor({
				onChange: function(){
					$this.updateGrid();
					$this.updateTextQuery();
				}
			});
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
			this.slice = this.node.getEntry();
			if(!JSB.isInstanceOf(this.slice, 'DataCube.Model.Slice')){
				return;
			}
			this.slice.server().getInputFields(function(fields){
				$this.query = JSB.clone($this.slice.getQuery());
				$this.queryEditor.setOption('slice', $this.slice);
				$this.queryEditor.setOption('cubeFields', fields);
				$this.queryEditor.set($this.query);
				
				$this.updateGrid();
				$this.updateTextQuery();
			});
		},
		
		updateGrid: function(){
			this.gridView.updateData(this.slice, this.query);
		},
		
		updateTextQuery: function(){
			this.textQueryEditor.setData(this.query);
		} 
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