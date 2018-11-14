{
	$name: 'DataCube.SliceDiagramNode',
	$parent: 'JSB.Widgets.Diagram.Node',
	$require: ['JQuery.UI.Resizable',
	           'JSB.Controls.ScrollBox',
	           'JSB.Widgets.Button',
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

				JSB.defer(function(){
				    self.editor.getCube().server().updateNodePosition(self.entry, {position: {x: x, y: y}});
				}, 500, 'posChanged_' + this.getId());
			}
		},
		
		$constructor: function(diagram, key, opts){
			$base(diagram, key, opts);

			this.editor = opts.editor;
			this.entry = opts.entry;

			$jsb.loadCss('SliceDiagramNode.css');
			this.addClass('sliceDiagramNode');

			// drag handle
			var dragHandle = this.$('<div class="dragHandle"><div></div><div></div><div></div></div>');
			this.append(dragHandle);

			this.installDragHandle('drag', {
				selector: dragHandle
			});

			var header = this.$('<header></header>');
			this.append(header);

			// caption
			var caption = this.$(`#dot
				<div class="caption">
					<div class="icon"></div>
					<div class="name">{{=this.entry.getName()}}</div>
				</div>
			`);
			header.append(caption);

			var editBtn = new Button({
			    cssClass: 'roundButton btnEdit btn10',
			    tooltip: 'Редактировать срез',
			    onClick: function(){
			        $this.publish('JSB.Workspace.Entry.open', $this.entry);
			    }
			});
			header.append(editBtn.getElement());

			// source link type
			var sourceMessage = this.$('<span class="source">Тип источника: </span>');
			this.append(sourceMessage);

			this.sourceType = this.$('<b class="sourceType">' + this.entry.getSourceType() + '</b>');
			sourceMessage.append(this.sourceType);

			// select fields
			this.fieldList = new ScrollBox({
			    cssClass: 'fields',
			    xAxisScroll: false
			});
			this.append(this.fieldList.getElement());

			// connectors
			// left connector has slice from current cube only
			if(this.editor.getCube().getId() === this.entry.getCube().getId()){
                var leftConnector = this.$('<div class="connector left"></div>');
                header.append(leftConnector);

                this.leftConnector = $this.installConnector('sliceLeft', {
                    origin: leftConnector,
                    handle: [leftConnector, caption],
                    iri: 'connector/left/' + this.getId()
                });
			}
/*
			var rightConnector = this.$('<div class="connector right"></div>');
			this.append(rightConnector);


            this.rightConnector = $this.installConnector('sliceRight', {
                origin: rightConnector,
                handle: [rightConnector, this.caption],
                iri: 'connector/right/' + this.getId()
            });
*/

			this.status = this.$('<footer></footer>');
			this.append(this.status);

			this.getElement().click(function(){
			    $this.select(true);
			});

			$this.refresh();
			
			this.subscribe('Slice.renameSlice', {session: true}, function(sender, msg, desc){
				var entry = desc.entry;

				if($this.entry != entry){
					return;
				}

				caption.find('.name').text(desc.name);
			});
		},

		createLink: function(link){
		    var entry = link.target.node.entry;

		    this.linksTo[entry.getFullId()] = {
		        entry: link.target.node.entry
		    }
		},

		refresh: function(opts){
		    var query = opts && opts.query || this.entry.getQuery(),
		        fields = query.$select ? Object.keys(query.$select) : [];

	        var fieldsElements = d3.select(this.fieldList.getElement().get(0));
	        // enter
	        fieldsElements.selectAll('div.field').data(fields).enter().append('div').classed('field', true);

	        // update
	        fieldsElements.selectAll('div.field').data(fields)
	            .text(function(d){
	                return d;
	            });

	        // exit
	        fieldsElements.selectAll('div.field').data(fields).exit().remove();
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
		}
	}
}