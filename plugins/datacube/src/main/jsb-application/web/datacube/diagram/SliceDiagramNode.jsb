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

		_sources: {},
		
		options: {
		    onCreate: function(){
		        this.refresh({
		            sources: this.options.sources
		        });
		    },
			onHighlight: function(bEnable){
				this.highlightNode(bEnable);
			},
			onSelect: function(bEnable){
				this.selectNode(bEnable);
			},
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

			this.installHandle({
			    key: 'drag',
				selector: dragHandle,
				type: 'drag'
			});

			var header = this.$('<header></header>');
			this.append(header);

			// caption
			var caption = this.$(`#dot
				<div class="caption">
					<div class="icon"></div>
				</div>
			`);
			header.append(caption);

			this.sliceName = this.$('<div class="name">' + this.entry.getName() + '</div>');
			caption.append(this.sliceName);

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
                    handle: [leftConnector],
                    iri: 'connector/left/' + this.getId()
                });
			}

			var rightConnector = this.$('<div class="connector right"></div>');
			header.append(rightConnector);

            this.rightConnector = $this.installConnector('providerRight', {
                origin: rightConnector,
                handle: [rightConnector],
                iri: 'connector/right/' + this.getId()
            });

			this.status = this.$('<footer></footer>');
			this.append(this.status);
			
			this.subscribe('Slice.renameSlice', {session: true}, function(sender, msg, desc){
				var entry = desc.entry;

				if($this.entry != entry){
					return;
				}

				caption.find('.name').text(desc.name);
			});

            this.subscribe('DataCube.CubeEditor.startAddDimension', function(sender, msg, obj){
                $this.addClass('addDimension');
            });

            this.subscribe('DataCube.CubeEditor.stopAddDimension', function(sender, msg, obj){
                $this.removeClass('addDimension');
            });

            this.subscribe('DataCube.CubeEditor.addDimension', function(sender, msg, field){
                $this.addDimension(field);
            });

            this.subscribe('DataCube.CubeEditor.dimensionHighlighted', function(sender, msg, obj){
                //todo
                // obj: { isHighlighted: <bool>, key: <string> }
            });

            this.subscribe('DataCube.CubeEditor.sliceUpdated', function(sender, msg, obj){
                if(obj.slice.getId() === $this.entry.getId()){
                    $this.refresh(obj);
                }
            });
		},

		addDimension: function(field){
		    if(this.fields[field]){
		        this.fieldList.find('.field[key="' + field + '"]').addClass('dimension');
		    }
		},

		refresh: function(opts){
		    var query = opts && opts.query || this.entry.getQuery(),
		        fields = query.$select ? Object.keys(query.$select) : [];

            if(fields.length !== 0){
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

                // set measurements
                this.fieldList.getElement().find('div.field').click(function(evt){
                    if($this.hasClass('addDimension')){
                        evt.stopPropagation();

                        $this.publish('DataCube.CubeEditor.stopAddDimension', {
                            field: $this.$(evt.target).text(),
                            slice: $this.entry
                        });
                    }
                });
	        }

            // update links
            var oldLinks = this._sources,
                newLinks = opts && opts.sources || this.entry.extractSources(query);

            for(var i in oldLinks){
                if(!newLinks[i]){
                    oldLinks[i].destroy();
                    delete oldLinks[i];
                }
            }

            for(var i = 0; i < newLinks.length; i++){
                var id = newLinks[i];

                if(!oldLinks[id]){
                    oldLinks[id] = this.editor.createLink('bind', {
                        sourceConnector: this.leftConnector,
                        targetConnector: this.editor.getSource(id).node.rightConnector
                    });
                }
            }

            this.fields = query.$select || {};

            if(opts && opts.name){
                this.sliceName.text(opts.name);
            }
		},

		refreshLinks: function(){
		    //
		},

		removeDimension: function(field){
		    if(this.fields[field]){
		        this.fieldList.find('.field[key="' + field + '"]').removeClass('dimension');
		    }
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
                sources: this.editor.getSources(),
                slices: this.editor.getSlices()
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