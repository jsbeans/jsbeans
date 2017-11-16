{
	$name: 'DataCube.CubeNode',
	$parent: 'JSB.Workspace.EntryNode',
	$require: 'JSB.Widgets.Button',
	
	$client: {
		childrenLoaded: false,
		
		$constructor: function(opts){
			var self = this;
			$base(opts);
			this.loadCss('CubeNode.css');
			this.addClass('cubeNode');
			
			this.append('<div class="status"></div>');
			
			var createSliceBtn = new Button({
				cssClass: 'roundButton btnCreate btn10',
				tooltip: 'Создать срез',
				onClick: function(evt){
					evt.stopPropagation();
					$this.createSlice();
				}
			});
			$this.toolbox.append(createSliceBtn.getElement());
			
			this.subscribe('Workspace.Entry.updated', function(sender){
				if(sender != $this.descriptor.entry){
					return;
				}
				$this.update();
			});
			
			this.subscribe('DataCube.Model.Cube.status', {session: true}, function(sender, msg, params){
				if(sender != $this.getEntry()){
					return;
				}
                $this.update(params.status, params.success !== true);
			});
			
			this.update();
			
		},
		
		createSlice: function(){
			$this.explorer.expandNode($this, function(){
				$this.getEntry().server().addSlice(function(slice){
					var node = $this.explorer.addTreeItem({
                        entry: slice,
                        hasEntryChildren: 0,
                        name: slice.getName(),
                        type: 'entry'
                    }, $this.treeNode.key, false, {collapsed:true});
					$this.explorer.publish('Workspace.nodeOpen', node);
				});
			});
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
					<div class="item sources">Источников: <span class="count">{{=$this.getEntry().getSourceCount()}}</span>; </div>
					<div class="item fields">полей: <span class="count">{{=$this.getEntry().getFieldCount()}}</span>; </div>
					<div class="item slices">срезов: <span class="count">{{=$this.getEntry().getSliceCount()}}</span></div>
				`);
			}
		}
		
	}
	
}