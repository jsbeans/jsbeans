/** DataCube - jsBeans extension | jsbeans.org (MIT Licence) | (c) Special Information Systems, LLC */

{
	$name: 'DataCube.CubeNode',
	$parent: 'JSB.Workspace.EntryNode',
	$require: ['JSB.Widgets.Button',
	           'css:CubeNode.css'],
	
	$client: {
	    $require: ['JSB.Widgets.ToolManager'],

		childrenLoaded: false,
		
		$constructor: function(opts){
			var self = this;
			$base(opts);
			this.addClass('cubeNode');
			
			this.append('<div class="status"></div>');
			
			var createSliceBtn = new Button({
				cssClass: 'roundButton btnCreate btn10',
				tooltip: 'Создать',
				onClick: function(evt){
				    evt.stopPropagation();
					$this.createSlice();
				}
			});
			$this.toolbox.append(createSliceBtn.getElement());
			
			this.subscribe('JSB.Workspace.Entry.updated', function(sender){
				if(sender != $this.getTargetEntry()){
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

            this.subscribe('Datacube.CubeNode.createSlice', function(sender, msg, slice){
            	if(slice.getParentId() != $this.getTargetEntry().getId()){
					return;
				}
                var node = $this.explorer.getEntryNode(slice);

                if(!node){
                    node = $this.explorer.addTreeItem({
                        entry: slice,
                        hasEntryChildren: 0,
                        name: slice.getName()
                    }, $this.treeNode.key, false, {collapsed:true});
                }

                if(sender === $this){
                	$this.explorer.expandNode($this.treeNode.key, function(){
                		$this.explorer.publish('JSB.Workspace.nodeOpen', node);	
                	});
                }
            });

			this.update();
		},
		
		createSlice: function(){
			$this.explorer.expandNode($this.treeNode.key, function(){
				$this.getTargetEntry().server().addSlice(function(slice){
                    $this.publish('Datacube.CubeNode.createSlice', slice);
				});
			});
		},
		
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
					<div class="item slices">Срезов: <span class="count">{{=$this.getTargetEntry().getSliceCount()}}</span></div>
				`);
			}
		}
	}
}