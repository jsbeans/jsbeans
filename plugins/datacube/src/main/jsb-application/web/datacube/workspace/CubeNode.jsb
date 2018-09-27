{
	$name: 'DataCube.CubeNode',
	$parent: 'JSB.Workspace.EntryNode',
	$require: 'JSB.Widgets.Button',
	
	$client: {
	    $require: ['JSB.Widgets.ToolManager'],

		childrenLoaded: false,
		
		$constructor: function(opts){
			var self = this;
			$base(opts);
			this.loadCss('CubeNode.css');
			this.addClass('cubeNode');
			
			this.append('<div class="status"></div>');
			
			var createSliceBtn = new Button({
				cssClass: 'roundButton btnCreate btn10',
				tooltip: 'Создать',
				onClick: function(evt){
				    evt.stopPropagation();
					//$this.showCreateMenu(evt, true, this);
					$this.createSlice();
				}
			});
			$this.toolbox.append(createSliceBtn.getElement());
			
			this.subscribe('JSB.Workspace.Entry.updated', function(sender){
				if(sender != $this.descriptor.entry){
					return;
				}
				$this.update();
			});
			
			this.subscribe('DataCube.Model.Cube.status', {session: true}, function(sender, msg, params){
				if(sender != $this.getTargetEntry()){
					return;
				}
                $this.update(params.status, params.success !== true);
			});
			
			this.update();
		},
		
		createSlice: function(){
			$this.explorer.expandNode($this.treeNode.key, function(){
				$this.getTargetEntry().server().addSlice(function(slice){
					var node = $this.explorer.addTreeItem({
                        entry: slice,
                        hasEntryChildren: 0,
                        name: slice.getName()
                    }, $this.treeNode.key, false, {collapsed:true});

                    $this.publish('Datacube.CubeNode.createSlice', slice);

					$this.explorer.publish('JSB.Workspace.nodeOpen', node);
				});
			});
		},
		/*
		createNewEntry: function(key){
			$this.explorer.expandNode($this.treeNode.key, function(){
			    switch(key){
			        case 'DataCube.Model.Slice':
                        $this.getTargetEntry().server().addSlice(function(slice){
                            var node = $this.explorer.addTreeItem({
                                entry: slice,
                                hasEntryChildren: 0,
                                name: slice.getName()
                            }, $this.treeNode.key, false, {collapsed:true});
                            $this.explorer.publish('JSB.Workspace.nodeOpen', node);
                        });
                        break;
                    case 'DataCube.Model.QueryDataProvider':
                        //
                        break;
				}
			});
		},

		showCreateMenu: function(evt){
		    var explorerNodes = $this.explorer.explorerNodeTypes,
		        nodesNames = ['DataCube.Model.Slice', 'DataCube.Model.QueryDataProvider'],
		        items = [];

            for(var i = 0; i < nodesNames.length; i++){
                var elt = this.$('<div><img class="icon"></img><div class="info"><div class="title"></div><div class="desc"></div></div></div>');

				elt.find('.title').text(explorerNodes[nodesNames[i]].title);
				elt.find('.desc').text(explorerNodes[nodesNames[i]].description);
				elt.find('.icon').attr('src', explorerNodes[nodesNames[i]].icon);

				items.push({
				    key: nodesNames[i],
                    element: elt,
				    order: i
				})
            }

			ToolManager.activate({
				id: '_dwp_droplistTool',
				cmd: 'show',
				data: items,
				key: 'createMenu',
				target: {
					selector: this.$(evt.currentTarget),
					dock: 'bottom'
				},
				callback: function(key){
				    $this.createNewEntry(key);
				}
			});
		},
		*/
		
		collectMenuItems: function(){
			var items = $base();
			if(items.length > 0){
				items.push({
					key: 'menuSeparator',
					element: '<div class="separator"></div>',
					cssClass: 'menuSeparator',
					allowHover: false,
					allowSelect: false
				});
			}
			
			items.push({
				key: 'clearCache',
				element: '<div class="icon"></div><div class="text">Очистить кэш</div>',
				allowHover: true,
				allowSelect: true,
				callback: function(){
					$this.getTargetEntry().server().invalidate(function(){
						
					});
				}
			});
			
			items.push({
				key: 'updateCache',
				element: '<div class="icon"></div><div class="text">Обновить кэш</div>',
				allowHover: true,
				allowSelect: true,
				callback: function(){
					$this.getTargetEntry().server().updateCache(function(){
						
					});
				}
			});
			return items;
		},
		
		update: function(status, bFail){
			var statusElt = this.find('.status');
			statusElt.empty();
			if(bFail){
				statusElt.addClass('error');
			} else {
				statusElt.removeClass('error');
			}
			if(status){
				statusElt.append(status);
				statusElt.attr('title', status);
			} else {
				statusElt.append(`#dot
					<div class="item sources">Источников: <span class="count">{{=$this.getTargetEntry().getSourceCount()}}</span>; </div>
					<div class="item fields">полей: <span class="count">{{=$this.getTargetEntry().getFieldCount()}}</span>; </div>
					<div class="item slices">срезов: <span class="count">{{=$this.getTargetEntry().getSliceCount()}}</span></div>
				`);
			}
		}
	}
}