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
					<div class="icon"></div>
				</div>
			`);
			header.append(caption);

			this.sliceName = this.$('<div class="name">' + this.entry.getName() + '</div>');
			caption.append(this.sliceName);

			var editBtn = new Button({
			    cssClass: 'roundButton btnEdit btn10',
			    tooltip: 'Редактировать срез',
			    onClick: function(evt){
			        evt.stopPropagation();
			        $this.publish('JSB.Workspace.Entry.open', $this.entry);
			    }
			});
			header.append(editBtn.getElement());

			// source link type
			/*
			var sourceMessage = this.$('<span class="source">Тип связи: </span>');
			this.append(sourceMessage);

			this.sourceType = this.$('<b class="sourceType">' + this.entry.getLinkType() + '</b>');
			sourceMessage.append(this.sourceType);
			*/

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

			this.subscribe('DataCube.Model.Slice.renameSlice', {session: true}, function(sender, msg, desc){
				var entry = desc.entry;

				if($this.entry != entry){
					return;
				}

				caption.find('.name').text(desc.name);
			});

            this.subscribe('DataCube.CubeEditor.search', function(sender, msg, value){
                $this.search(value);
            });

            this.subscribe('DataCube.CubeEditor.sliceUpdated', function(sender, msg, obj){
                if(obj.slice.getId() === $this.entry.getId()){
                    $this.refresh(obj);
                }
            });

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

                sliceFields.classed('dimension', function(d){
                        return d.isDimension;
                    });
                sliceFields.select('.key').text(function(d){
                        return d.key;
                    });
                sliceFields.select('.type').text(function(d){
                        return d.type;
                    });

                // exit
                fieldsBox.selectAll('div.sliceField').data(fields).exit().remove();
            }

            // set link type
            if(this.leftConnectorElement){
                var fromType = this.entry.getFromType();

                if(fromType !== '$cube'){
                    var fromClass = '',
                        fromName = this.leftConnectorElement.children('.tooltip');

                    if(fromName.length === 0){
                        fromName = this.$('<div class="tooltip"></div>');
                        this.leftConnectorElement.append(fromName);
                    }

                    switch(fromType){
                        case '$from':
                            fromClass = 'fromIcon';
                            fromName.text('From');
                            break;
                        case '$join':
                            fromClass = 'joinIcon';
                            fromName.text('Join');
                            break;
                        case '$union':
                            fromClass = 'unionIcon';
                            fromName.text('Union');
                            break;
                        case '$recursive':
                            fromClass = 'recursiveIcon';
                            fromName.text('Recursive');
                            break;
                    }

                    this.leftConnectorElement.removeClass().addClass('connector left hasIcon ' + fromClass);

                    // update links
                    var oldLinks = this._sources,
                        newLinks = opts && opts.sources || this.entry.extractSources(opts && opts.query || this.entry.getQuery());

                    for(var i in oldLinks){
                        if(!newLinks[i]){
                            oldLinks[i].destroy();
                            delete oldLinks[i];
                        }
                    }

                    for(var i = 0; i < newLinks.length; i++){
                        var id = newLinks[i];

                        if(!oldLinks[id]){
                            oldLinks[id] = this.editor.createLink(fromType, {
                                sourceConnector: this.leftConnector,
                                targetConnector: this.editor.getSlice(id).node.rightConnector
                            });
                        }
                    }
                }
            }

            this.fields = opts && opts.fields || {};

            if(opts && opts.name){
                this.sliceName.text(opts.name);
            }
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