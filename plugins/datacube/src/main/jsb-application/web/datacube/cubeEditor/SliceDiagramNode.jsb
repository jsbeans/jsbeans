/** DataCube - jsBeans extension | jsbeans.org (MIT Licence) | (c) Special Information Systems, LLC */

{
	$name: 'DataCube.SliceDiagramNode',
	$parent: 'JSB.Widgets.Diagram.Node',
	$require: ['jQuery.UI.Resizable',
	           'JSB.Controls.Grid',
	           'JSB.Widgets.Button',
	           'JSB.Widgets.RendererRepository',
	           'JSB.Widgets.ToolManager',
	           'css:SliceDiagramNode.css'],
	
	$client: {
	    // const
	    MAX_HEIGHT: 200,
	    MAX_GRID_HEIGHT: 150,

		editor: null,
		entry: null,

		_sources: {},
		
		options: {
		    onCreate: function() {
		        var self = this;

		        this.entry.server().extractFields(function(res, fail){
		            if(fail){
		                // todo: error?
		                return;
		            }

                    self.refresh({
                        fields: res,
                        sources: self.options.sources
                    });

                    self.updateConnectors();
                    self.updateLinks();
		        });
		    },
			onHighlight: function(bEnable) {
				this.highlightNode(bEnable);
			},
			onSelect: function(bEnable){
				this.selectNode(bEnable);
			},
			onPositionChanged: function(x, y) {
				var self = this;

				JSB.defer(function(){
				    self.editor.getCube().server().updateNodePosition(self.entry, {position: {x: x, y: y}});
				}, 500, 'posChanged_' + self.getId());
			}
		},
		
		$constructor: function(diagram, key, opts){
			$base(diagram, key, opts);

			this.editor = opts.editor;
			this.entry = opts.entry;

            var dataSource = this.entry.getSource();

			this.addClass('sliceDiagramNode');

			var header = this.$('<header></header>');
			this.append(header);
			
			this.installHandle({
			    key: 'drag',
				selector: header,
				type: 'drag'
			});

			// left connector
			if(!dataSource){
                this.leftConnectorElement = this.$('<div class="connector left"></div>');
                header.append(this.leftConnectorElement);

                this.leftConnector = $this.installConnector('sliceLeft', {
                    origin: this.leftConnectorElement,
                    handle: [this.leftConnectorElement],
                    iri: 'connector/left/' + this.getId()
                });
			}

			// caption
			var caption = this.$(`#dot
				<div class="caption">
				</div>
			`);
			header.append(caption);

			caption.append(RendererRepository.createRendererFor(this.entry).getElement());

			var editBtn = new Button({
			    cssClass: 'roundButton btnEdit btn10',
			    tooltip: 'Редактировать срез',
			    onClick: function(evt){
			        evt.stopPropagation();
			        $this.publish('JSB.Workspace.Entry.open', $this.entry);
			    }
			});
			header.append(editBtn.getElement());

			// select fields
			this.fieldList = new Grid({
			    cssClass: 'fields',
			    columns: ['name', 'type'],
			    colHeader: false,
			    cellRenderer: function(td, value, rowIndex, colIndex, rowData) {
			        td.append(value);

			        if(colIndex === 'name') {
			            td.addClass('cubeFieldIcon sliceField');

                        if(rowData.isDimension) {
                            td.addClass('dimension');
                        }
			        }
			    }
			});
			this.append(this.fieldList);

            this.fieldList.getElement().mousewheel(function(evt){
                evt.stopPropagation();
            });

            this.fieldList.getElement().click(function(evt) {
                evt.stopPropagation();
            });

			// right connector
			var rightConnector = this.$('<div class="connector right"></div>');
			header.append(rightConnector);

            this.rightConnector = $this.installConnector('sliceRight', {
                origin: rightConnector,
                handle: [rightConnector],
                iri: 'connector/right/' + this.getId()
            });

			var footer = this.$('<footer></footer>');
			this.append(footer);

			if(dataSource) {
                var renderer = RendererRepository.createRendererFor(dataSource, {showSource: true});
                footer.append(renderer.getElement());

                renderer.getElement().click(function(evt){
                    evt.stopPropagation();
                    // todo: show original source data
                });

                this.addClass('dataSourceSlice');
			}

			this.getElement().resizable({
			    start: function(evt) {
			        $this.getElement().css('max-height', '');
			    },
                stop: function(evt, ui) {
                    JSB.defer(function(){
                        $this.editor.getCube().server().updateNodePosition($this.entry, {size: {width: $this.getElement().width(), height: $this.getElement().height()}});
                    }, 500, 'sizeChanged_' + $this.getId());
                }
            });

            if(!opts.size) {
                this.getElement().css('max-height', this.MAX_HEIGHT);
            }

            this.subscribe('DataCube.CubeEditor.search', function(sender, msg, value) {
                $this.fieldList.search('name', value);
            });

            this.subscribe('DataCube.CubeEditor.sliceUpdated', function(sender, msg, obj){
                if(obj.sliceFullId === $this.entry.getFullId()){
                    $this.refresh({
                        fields: obj.updates.fields,
                        name: obj.updates.name,
                        query: obj.updates.query
                    });
                }
            }, {session: true});

            this.subscribe('DataCube.CubeEditor.toggleDimension', function(sender, msg, desc){
                $this.toggleDimension(desc);
            });

            this.subscribe('Datacube.CubeEditor.CubePanel.hoverField', function(sender, msg, desc){
                if($this.fields[desc.field]){
                    $this.highlightNode(desc.type === 'mouseIn');
                }
            });
		},

		highlightNode: function(bEnable){
			if(bEnable){
				this.addClass('highlighted');
			} else {
				this.removeClass('highlighted');
			}
		},

		refresh: function(opts) {
            if(opts && opts.fields) {
                var dimensions = this.editor.getDimensions();

                this.fieldList.clear();

                // add dimensions
                for(var i in opts.fields) {
                    if(dimensions[i]) {
                        this.fieldList.addRow({
                            isDimension: dimensions[i],
                            name: i,
                            type: opts.fields[i].type
                        });
                    }
                }

                // add non dimension fields
                for(var i in opts.fields) {
                    if(!dimensions[i]) {
                        this.fieldList.addRow({
                            isDimension: dimensions[i],
                            name: i,
                            type: opts.fields[i].type
                        });
                    }
                }
            }

            this.fieldList.updateDimensions();

            var gridHeight = this.fieldList.getElement().children('.grid-master').height();

            if(gridHeight > this.MAX_GRID_HEIGHT) {
                this.getElement().height(this.MAX_GRID_HEIGHT + this.getElement().children('header').height() + this.getElement().children('footer').height());
            } else {
                this.getElement().height(gridHeight + this.getElement().children('header').height() + this.getElement().children('footer').height() + 16);
            }

            // set link type
            if(this.leftConnectorElement) {
                var fromType = this.entry.getFromType();

                if(fromType !== '$cube') {
                    // update links
                    var oldLinks = this._sources,
                        newLinks = opts && opts.sources || this.entry.extractSources(opts && opts.query);

                    for(var i in oldLinks){
                        if(!newLinks[i]){
                            oldLinks[i].destroy();
                            delete oldLinks[i];
                        }
                    }

                    for(var i = 0; i < newLinks.length; i++){
                        var id = newLinks[i];

                        if(JSB.isObject(id)){
                            continue;
                        }

                        if(!oldLinks[id] && this.editor.getSliceNode(id)){
                            oldLinks[id] = this.editor.createLink(fromType, {
                                sourceConnector: this.leftConnector,
                                targetConnector: this.editor.getSliceNode(id).rightConnector
                            });
                        }
                    }

                    this.getElement().attr('sourceType', fromType);
                }
            }

            this.fields = opts && opts.fields || {};
		},

		selectNode: function(bEnable){
		    var obj = {
		        cubeFields: this.editor.getCubeFields(),
                entry: this.entry,
                node: this,
                slices: this.editor.getSlices()
		    };

			if(bEnable){
				this.addClass('selected');
				this.publish('DataCube.CubeEditor.sliceNodeSelected', obj);
			} else {
				this.removeClass('selected');
				this.publish('DataCube.CubeEditor.sliceNodeDeselected', obj);
			}
		},

		toggleDimension: function(desc){
		    this.fieldList.search('name', desc.field, function(tr, isSuit) {
		        if(isSuit) {
                    if(desc.isDimension) {
                        tr.children('td[colKey="name"]').addClass('dimension');
                    } else {
                        tr.children('td[colKey="name"]').removeClass('dimension');
                    }
		        }
		    });

		    this.fieldList.sort(function(a, b) {
		        var aTD = $this.$(a).children('td[colKey="name"]'),
		            bTD = $this.$(b).children('td[colKey="name"]'),
		            aDim = aTD.hasClass('dimension'),
		            bDim = bTD.hasClass('dimension'),
		            aName = aTD.text(),
		            bName = bTD.text();

                if(aDim && !bDim){
                    return -1;
                }

                if(!aDim && bDim){
                    return 1;
                }

                if(aName > bName){
                    return 1;
                }

                if(aName < bName){
                    return -1;
                }

                return 0;
		    });
		}
	}
}