{
	$name: 'DataCube.SliceDiagramNode',
	$parent: 'JSB.Widgets.Diagram.Node',
	$require: ['JQuery.UI.Resizable', 
	           'JSB.Widgets.ToolManager'],
	
	$client: {
		editor: null,
		slice: null,

		linksTo: {},
		
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
					//self.editor.cubeEntry.server().updateSliceNodePosition(self.slice.getId(), {x: x, y: y});
				}, 500, 'posChanged_' + this.getId());
			}
		},
		
		$constructor: function(diagram, key, opts){
			$base(diagram, key, opts);

			this.editor = opts.editor;
			this.entry = opts.entry;

			$jsb.loadCss('SliceDiagramNode.css');
			this.addClass('sliceDiagramNode');
			
			this.caption = this.$(`#dot
				<div class="caption">
					<div class="icon"></div>
					<div class="name">{{=this.entry.getName()}}</div>
					
					<div jsb="JSB.Widgets.Button" class="roundButton btnEdit btn10" tooltip="Редактировать срез"
						onclick="{{=$this.callbackAttr(function(evt){ $this.publish('JSB.Workspace.Entry.open', $this.entry); })}}"></div>
					<div jsb="JSB.Widgets.Button" class="roundButton btnDelete btn10" tooltip="Удалить срез"
						onclick="{{=$this.callbackAttr(function(evt){ $this.removeSlice(evt); evt.stopPropagation(); })}}"></div>
				</div>
			`);
			this.append(this.caption);

			var sourceSettings = this.$('<div class="sourceSettings"></div>');
			this.append(sourceSettings);

			sourceSettings.append('<header>Источник</header>');

			this.sourceMessage = this.$('<span class="sourceName"></span>');
			sourceSettings.append(this.sourceMessage);

			this.entry.server().getSourceType(function(type, fail){
			    if(fail){
			        return;
			    }

			    $this.sourceMessage.text(type);
			});

			this.selectSettings = this.$('<div class="selectSettings"></div>');
			this.append(this.selectSettings);

			// install connectors
			// todo: not create if slice cube id != editor cube id
			var leftConnector = this.$('<div class="connector left"></div>');
			this.caption.append(leftConnector);

            this.leftConnector = $this.installConnector('sliceLeft', {
                origin: leftConnector,
                handle: [leftConnector, this.caption],
                iri: 'connector/left/' + this.getId()
            });
/*
			var rightConnector = this.$('<div class="connector right"></div>');
			this.append(rightConnector);


            this.rightConnector = $this.installConnector('sliceRight', {
                origin: rightConnector,
                handle: [rightConnector, this.caption],
                iri: 'connector/right/' + this.getId()
            });
            */
			// install drag-move selector
			/*
			this.installDragHandle('drag', {
				selector: this.caption
			});
			*/

			this.status = this.$('<div class="status"></div>');
			this.append(this.status);

			// install drag handle
			this.installDragHandle('drag', {
				selector: this.caption
			});

			// install resize handle
			var rightBottomGripper = this.$('<div class="gripper cornerGripper rightBottomGripper"></div>');
			this.status.append(rightBottomGripper);
			
			this.installResizeHandle('rightBottomGripper',{
				selector: rightBottomGripper,
				resize: {right: true}
			});
			
			$this.refresh();
			
			this.subscribe('Slice.renameSlice', {session: true}, function(sender, msg, desc){
				var entry = desc.entry;
				if($this.entry != entry){
					return;
				}
				$this.caption.find('.name').text(desc.name);
			});
		},
		/*
		removeSlice: function(evt){
			var elt = $this.$(evt.currentTarget);
			ToolManager.showMessage({
				icon: 'removeDialogIcon',
				text: 'Вы уверены что хотите удалить срез "'+$this.slice.getName()+'" ?',
				buttons: [{text: 'Удалить', value: true},
				          {text: 'Нет', value: false}],
				target: {
					selector: elt
				},
				constraints: [{
					weight: 10.0,
					selector: elt
				},{
					selector: $this.getElement(),
					weight: 10.0
				}],
				callback: function(bDel){
					if(bDel){
						$this.editor.removeSlice($this.slice, $this);
					}
				}
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
				],
				draggable: true,
				callback: function(desc){
					$this.caption.find('.name').text(desc.name);
                    this.publish('DataCube.CubeEditor.sliceNodeEdit', { cube: $this.slice.cube, query: desc.query, queryParams: desc.queryParams });
					$this.slice.cube.server().updateSliceSettings($this.slice.getId(), desc, function(res, fail){
						// TODO: redraw query editor
					});
				}
			});
		},
		*/

		createLink: function(link){
		    var entry = link.target.node.entry;

		    this.linksTo[entry.getFullId()] = {
		        entry: link.target.node.entry
		    }
		},

		refresh: function(){
		    //
		},
		
		highlightNode: function(bEnable){
			if(bEnable){
				this.addClass('highlighted');
			} else {
				this.removeClass('highlighted');
			}
		},

		selectNode: function(bEnable){
		    var obj = {
                entry: this.entry,
                node: this,
                sources: this.linksTo
		    };

			if(bEnable){
				this.addClass('selected');
				this.publish('DataCube.CubeEditor.sliceNodeSelected', obj);
			} else {
				this.removeClass('selected');
				this.publish('DataCube.CubeEditor.sliceNodeDeselected', obj);
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