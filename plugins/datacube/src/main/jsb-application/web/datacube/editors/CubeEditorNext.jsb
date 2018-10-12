{
	$name: 'DataCube.CubeEditorNext',
	$parent: 'JSB.Widgets.Widget',
	$client: {
	    $require: ['JSB.Widgets.Diagram', 'DataCube.CubePanel', 'DataCube.Providers.DataProviderRepository'],

	    $constructor: function(opts){
			$base(opts);

			$jsb.loadCss('CubeEditorNext.css');
			this.addClass('cubeEditorNext');

			// create diagram
			this.diagram = new Diagram({
				minZoom: 0.25,
				highlightSelecting: false,
				onInit: function(){
					//this.diagramInitialized = true;
				},
				nodes: {
					dataProviderDiagramNode: {
						jsb: 'DataCube.DataProviderDiagramNode2',
						layout: {
							'default': {
								auto: true,
								animate: true,
								nodeExpand: 20
							}
						}
					},
					sliceDiagramNode: {
						jsb: 'DataCube.SliceDiagramNode',
						layout: {
							'default': {
								auto: true,
								animate: true,
								nodeExpand: 20
							}
						}
					}
				},

				connectors: {
					providerFieldRight: {
						acceptLocalLinks: false,
						userLink: false,
						offsetX: 2,
						wiringLink: {
							key: 'bind',
							type: 'target'
						}
					}
				},

				links: {
					bind: {
						source: ['cubeFieldLeft'],
						target: ['providerFieldRight'],
						joints: [{
							name: 'offsStart',
							position: function(){
								var ptStart = this.getLink().getSourcePosition();
								var ptEnd = this.getLink().getTargetPosition();
								var dist = Math.sqrt((ptEnd.x - ptStart.x)*(ptEnd.x - ptStart.x) + (ptEnd.y - ptStart.y)*(ptEnd.y - ptStart.y));
								var offs = dist / 4;
								if(ptStart && ptEnd){
									return {x: ptStart.x - 40, y: ptStart.y};
								}
								return null;
							}
						},{
							name: 'offsEnd',
							position: function(){
								var ptStart = this.getLink().getSourcePosition();
								var ptEnd = this.getLink().getTargetPosition();
								var dist = Math.sqrt((ptEnd.x - ptStart.x)*(ptEnd.x - ptStart.x) + (ptEnd.y - ptStart.y)*(ptEnd.y - ptStart.y));
								var offs = dist / 4;
								if(ptStart && ptEnd){
									return {x: ptEnd.x + 40, y: ptEnd.y};
								}
								return null;
							}
						}],
						heads: {
							target: {
								shape: 'arrow',
								strip: 0
							}
						}
					}
				}

			});
			this.append(this.diagram);

			// create cube fields panel
			this.cubePanel = new CubePanel();
			this.append(this.cubePanel);

            this.subscribe('Datacube.CubeNode.createSlice', function(sender, msg, slice){
                if(slice.cube === $this.cubeEntry){
                    $this.addSlice(slice);
                }
            });
	    },

		addSlice: function(slice){
            var sNode = $this.diagram.createNode('sliceDiagramNode', {slice: slice, editor: $this});
            /*
            var cubeRect = $this.cubeNode.getRect();
            sNode.setPosition(cubeRect.x + cubeRect.w + 100, cubeRect.y);

            $this.diagram.select($this.diagram.getNodes(), false);
            $this.diagram.select($this.diagram.getLinks(), false);
            sNode.select(true);
            */
		},

	    constructCube: function(desc){
	        // create slices' nodes
	        for(var i = 0; i < desc.slices.length; i++){
	            var sNode = $this.diagram.createNode('sliceDiagramNode', {slice: desc.slices[i].slice, editor: $this});
	        }
	    },

	    refresh: function(entry){
			if(this.cubeEntry == entry){
				return;
			}

			this.cubeEntry = entry;
			this.diagram.clear();

			this.cubeEntry.server().load(true, function(desc){
				$this.constructCube(desc);
			});
	    }
	}
}