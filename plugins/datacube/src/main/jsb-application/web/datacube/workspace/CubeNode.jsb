{
	$name: 'DataCube.CubeNode',
	$parent: 'JSB.Workspace.EntryNode',
	$client: {
		$constructor: function(opts){
			var self = this;
			$base(opts);
			this.loadCss('CubeNode.css');
			this.addClass('cubeNode');
			
			this.append('<div class="status"></div>');
			
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