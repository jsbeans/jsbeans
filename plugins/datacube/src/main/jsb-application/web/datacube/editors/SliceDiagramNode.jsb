{
	$name: 'JSB.DataCube.SliceDiagramNode',
	$parent: 'JSB.Widgets.Diagram.Node',
	$require: ['JQuery.UI.Resizable', 
	           'JSB.Widgets.ToolManager',
	           'JSB.DataCube.Dialogs.SliceOptionsTool'],
	
	$client: {
		ready: false,
		editor: null,
		slice: null,
		leftFieldConnectors: {},
		rightFieldConnectors: {},
		
		options: {
			onHighlight: function(bEnable){
				this.highlightNode(bEnable);
			},
			onSelect: function(bEnable){
				this.selectNode(bEnable);
			},
			onRemove: function(){},
			onPositionChanged: function(x, y){
				var self = this;
				if(this.editor.ignoreHandlers){
					return;
				}
				JSB.defer(function(){
					self.editor.cubeEntry.server().updateSliceNodePosition(self.slice.getLocalId(), {x: x, y: y});
				}, 500, 'posChanged_' + this.getId());
				
			}
		},
		
		$constructor: function(diagram, key, opts){
			$base(diagram, key, opts);
			this.editor = opts.editor;
			this.slice = opts.slice;
			this.loadCss('SliceDiagramNode.css');
			this.addClass('sliceDiagramNode');
			
			this.caption = this.$(`#dot
				<div class="caption">
					<div class="icon"></div>
					<div class="name">{{=this.slice.getName()}}</div>
					
					<div jsb="JSB.Widgets.Button" class="roundButton btnEdit btn10" tooltip="Редактировать срез"
						onclick="{{=$this.callbackAttr(function(evt){ $this.showSettings(evt); evt.stopPropagation(); })}}"></div>
				</div>
			`);
			this.body = this.$(`
				<div class="body">
					<div class="message">Редактор срезов пока не реализован. Формируйте запрос в настройках.</div>
				</div>
			`);
			this.status = this.$('<div class="status"></div>');
			this.append(this.caption);
			this.append(this.body);
			this.append(this.status);
			this.fieldList = this.$('<div class="fields"></div>');
			this.body.append(this.fieldList);

			// install drag-move selector
			this.installDragHandle('drag', {
				selector: this.caption
			});
			
			// install resize hande
			var rightBottomGripper = this.$('<div class="gripper cornerGripper rightBottomGripper"></div>');
			this.append(rightBottomGripper);
			
			this.installResizeHandle('rightBottomGripper',{
				selector: rightBottomGripper,
				resize: {right: true}
			});
			
			$this.refresh();
			$this.ready = true;
			
			this.subscribe('Workspace.renameEntry', function(sender, msg, desc){
				var entry = desc.entry;
				if($this.entry != entry){
					return;
				}
				$this.caption.find('.name').text(desc.name);
			});
		},
		
		showSettings: function(evt){
			var elt = this.$(evt.currentTarget);
			ToolManager.activate({
				id: 'sliceOptionsTool',
				cmd: 'show',
				data: {
					slice: $this.slice,
				},
				scope: $this.$('.cubeEditorView'),
				target: {
					selector: elt,
				},
				constraints: [{
					selector: elt,
					weight: 10.0
				},{
					selector: $this.getElement(),
					weight: 10.0
				},
				/*
				{
				    selector: $this.$('.gridView'),
                    weight: 10.0
				}
				*/
				],
				draggable: true,
				callback: function(desc){
                    this.publish('DataCube.CubeEditor.sliceNodeEdit', { cube: $this.slice.cube, query: desc.query, queryParams: desc.queryParams });
					$this.slice.cube.server().updateSliceSettings($this.slice.getLocalId(), desc, function(res, fail){
						// TODO: redraw query editor
					});
				}
			});
		},
		
		refresh: function(){
			this.fieldList.empty();
			// TODO: redraw query editor
		},
		
		highlightNode: function(bEnable){
			if(bEnable){
				this.addClass('highlighted');
			} else {
				this.removeClass('highlighted');
			}
		},

		selectNode: function(bEnable){
			if(bEnable){
				this.addClass('selected');
				this.editor.publish('DataCube.CubeEditor.sliceNodeSelected', this.slice);
			} else {
				this.removeClass('selected');
			}
		},
		
		highlightConnector: function(connector, bEnable, meta){
			var elt = connector.options.origin;
			if(bEnable){
				elt.addClass('highlighted');
			} else {
				elt.removeClass('highlighted');
			}
		}
	}
}