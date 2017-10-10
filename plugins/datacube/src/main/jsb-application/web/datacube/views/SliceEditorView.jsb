{
	$name: 'DataCube.SliceEditorView',
	$parent: 'JSB.Workspace.BrowserView',
	$require: ['JSB.Widgets.SplitBox', 'DataCube.GridView', 'JSB.Widgets.ScrollBox', 'JSB.Widgets.PrimitiveEditor', 'JSB.Widgets.Button', 'JSB.Widgets.MultiEditor', 'DataCube.Query.QueryEditor'],
	$client: {
		ready: false,
		ignoreHandlers: false,
		
		$constructor: function(opts){
			$base(opts);
			
			this.loadCss('SliceEditorView.css');
			this.addClass('sliceEditorView');

			this.titleBlock = this.$('<div class="titleBlock"></div>');
            this.append(this.titleBlock);

            this.titleEditor = new PrimitiveEditor();
            this.titleBlock.append(this.titleEditor.getElement());

            this.saveBtn = new Button({
                cssClass: "btnOk",
                caption: "Сохранить",
                onClick: function(){
                    $this.savedMessage.fadeIn(1600, "linear", function(){
                        $this.savedMessage.fadeOut(1600, "linear");
                    });
                    $this.slice.cube.server().updateSliceSettings($this.slice.getLocalId(), {
                        name: $this.titleEditor.getData().getValue(),
                        query: $this.query,
                        queryParams: {}
                    });
                }
            });
            this.titleBlock.append(this.saveBtn.getElement());

            this.updateBtn = new Button({
                cssClass: "btnUpdate",
                caption: "Обновить",
                onClick: function(){
                	$this.updateGrid();
                }
            });
            this.titleBlock.append(this.updateBtn.getElement());

            this.analyzeBtn = new Button({
                cssClass: "btnUpdate",
                caption: "Анализировать",
                onClick: function(){
                	var q = JSB.clone($this.query);
                	q['$analyze'] = true;
                	$this.updateGrid(q);
                }
            });
            this.titleBlock.append(this.analyzeBtn.getElement());
			
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

            this.savedMessage = this.$('<div class="savedMessage" style="display: none;">Изменения сохранены!</div>');
            this.savedMessage.click(function(){
                $this.savedMessage.css('display', 'none');
            });
            this.append(this.savedMessage);
		},
		
		refresh: function(){
			this.slice = this.node.getEntry();
			this.titleEditor.setData(this.slice.getName());
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
		
		updateGrid: function(query){
			query = query || this.query;
			this.gridView.updateData(this.slice, query);
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