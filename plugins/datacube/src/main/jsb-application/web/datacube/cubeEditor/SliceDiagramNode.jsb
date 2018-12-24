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
		        })
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

			if(dataSource){
                var renderer = RendererRepository.createRendererFor(dataSource, {showSource: true});
                header.append(renderer.getElement());

                renderer.getElement().click(function(evt){
                    evt.stopPropagation();
                    // todo: show original source data
                });

                this.addClass('dataSourceSlice');
			}

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

			// connectors
			if(!dataSource){
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

            this.rightConnector = $this.installConnector('sliceRight', {
                origin: rightConnector,
                handle: [rightConnector],
                iri: 'connector/right/' + this.getId()
            });

			this.status = this.$('<footer></footer>');
			this.append(this.status);
			
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
		},

		highlightNode: function(bEnable){
			if(bEnable){
				this.addClass('highlighted');
			} else {
				this.removeClass('highlighted');
			}
		},

		refresh: function(opts){
		    var query = opts && opts.query || this.entry.getQuery(),
		        dimensions = this.editor.getDimensions();

            if(opts && opts.fields){
                var fields = [];

                for(var i in opts.fields){
                    fields.push({
                        name: i,
                        type: opts.fields[i].type
                    });
                }

                fields.sort(function(a, b){
                    if(dimensions[a.name] && !dimensions[b.name]){
                        return -1;
                    }

                    if(!dimensions[a.name] && dimensions[b.name]){
                        return 1;
                    }

                    if(a.name > b.name){
                        return 1;
                    }

                    if(a.name < b.name){
                        return -1;
                    }

                    return 0;
                });

                var fieldsElementsData = d3.select(this.fieldList.getElement().get(0)).selectAll('div.sliceField').data(fields);

                // enter
                var fieldsElementsEnter = fieldsElementsData.enter().append('div').classed('cubeFieldIcon sliceField', true);

                fieldsElementsEnter.append('div').classed('name', true);
                fieldsElementsEnter.append('div').classed('type', true);

                // update
                var fieldsElements = d3.select(this.fieldList.getElement().get(0)).selectAll('div.sliceField');

                fieldsElements.classed('dimension', function(d){
                        return dimensions[d.name];
                    });
                fieldsElements.select('.name').text(function(d){
                        return d.name;
                    });
                fieldsElements.select('.type').text(function(d){
                        return d.type;
                    });

                // exit
                fieldsElementsData.exit().remove();
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
                        targetConnector: this.editor.getSlice(id).node.rightConnector
                    });
                }
            }

            this.fields = opts && opts.fields || {};

            if(opts && opts.name){
                this.sliceName.text(opts.name);
            }
		},

		search: function(value){
		    if(value){
                this.fieldList.find('.name:not(:icontains("' + value + '"))').closest('.sliceField').addClass('hidden');
                this.fieldList.find('.name:icontains("' + value + '")').closest('.sliceField').removeClass('hidden');
            } else {
                this.fieldList.find('.name').closest('.sliceField').removeClass('hidden');
            }
		},

		selectNode: function(bEnable){
		    var obj = {
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
		            this.fieldList.find('.name:contains("' + desc.field + '")').closest('.sliceField').addClass('dimension');
		        } else {
		            this.fieldList.find('.name:contains("' + desc.field + '")').closest('.sliceField').removeClass('dimension');
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