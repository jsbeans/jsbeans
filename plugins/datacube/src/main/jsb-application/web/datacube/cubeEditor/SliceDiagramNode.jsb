/** DataCube - jsBeans extension | jsbeans.org (MIT Licence) | (c) Special Information Systems, LLC */

{
	$name: 'DataCube.SliceDiagramNode',
	$parent: 'JSB.Widgets.Diagram.Node',
	$require: ['JSB.Controls.ScrollBox',
	           'JSB.Widgets.Button',
	           'JSB.Widgets.RendererRepository',
	           'JSB.Widgets.ToolManager',
	           'css:SliceDiagramNode.css'],
	
	$client: {
		editor: null,
		entry: null,

		_sources: {},
		
		options: {
		    onCreate: function(){
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
			this.fieldList = new ScrollBox({
			    cssClass: 'fields',
			    xAxisScroll: false
			});
			this.append(this.fieldList.getElement());

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

			if(dataSource){
                var renderer = RendererRepository.createRendererFor(dataSource, {showSource: true});
                footer.append(renderer.getElement());

                renderer.getElement().click(function(evt){
                    evt.stopPropagation();
                    // todo: show original source data
                });

                this.addClass('dataSourceSlice');
			}

            this.subscribe('DataCube.CubeEditor.search', function(sender, msg, value){
                $this.search(value);
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

		refresh: function(opts){
            if(opts && opts.fields){
                var dimensions = this.editor.getDimensions(),
                    fields = [];

                for(var i in opts.fields){
                    fields.push({
                        isDimension: dimensions[i],
                        key: i,
                        type: opts.fields[i].type
                    });
                }

                fields.sort(function(a, b){
                    if(a.isDimension && !b.isDimension){
                        return -1;
                    }

                    if(!a.isDimension && b.isDimension){
                        return 1;
                    }

                    if(a.key > b.key){
                        return 1;
                    }

                    if(a.key < b.key){
                        return -1;
                    }

                    return 0;
                });

                var fieldsBox = d3.select(this.fieldList.getElement().get(0));

                // enter
                fieldsBox.selectAll('div.sliceField').data(fields).enter().append(function(d){
                    var el = $this.$('<div class="cubeFieldIcon sliceField"></div>');

                    el.append('<div class="key"></div>');
                    el.append('<div class="type"></div>');

                    return el.get(0);
                });

                // update
                var sliceFields = fieldsBox.selectAll('div.sliceField').data(fields);

                sliceFields.classed('dimension', function(d){ return d.isDimension; });
                sliceFields.select('.key')
                	.text(function(d){ return d.key; })
                	.attr('title', function(d){return d.key;});
                
                sliceFields.select('.type')
                	.attr('type', function(d){ return d.type; })
                	.text(function(d){ return d.type; });

                // exit
                fieldsBox.selectAll('div.sliceField').data(fields).exit().remove();
            }

            // set link type
            if(this.leftConnectorElement){
                var fromType = this.entry.getFromType();

                if(fromType !== '$cube'){
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
/*
            if(opts && opts.name){
                this.sliceName.text(opts.name);
            }
*/            
		},

		search: function(value){
		    if(value){
                this.fieldList.find('.key:not(:icontains("' + value + '"))').closest('.sliceField').addClass('hidden');
                this.fieldList.find('.key:icontains("' + value + '")').closest('.sliceField').removeClass('hidden');
            } else {
                this.fieldList.find('.key').closest('.sliceField').removeClass('hidden');
            }
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
		    if(this.fields[desc.field]){
		        if(desc.isDimension){
		            this.fieldList.find('.key:contains("' + desc.field + '")').closest('.sliceField').addClass('dimension');
		        } else {
		            this.fieldList.find('.key:contains("' + desc.field + '")').closest('.sliceField').removeClass('dimension');
		        }
		    }

		    var fields = this.fieldList.children();

		    fields.sort(function(a, b){
		        a = $this.$(a);
		        b = $this.$(b);

		        var aDim = a.hasClass('dimension'),
		            bDim = b.hasClass('dimension'),
		            aName = a.find('.name').text(),
		            bName = b.find('.name').text();

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

		    fields.detach().appendTo(this.fieldList.getElement());
		}
	}
}