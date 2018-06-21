{
	$name: 'DataCube.JsonFileNode',
	$parent: 'JSB.Workspace.FileNode',
	$client: {
		$constructor: function(opts){
			var self = this;
			$base(opts);
			this.loadCss('JsonFileNode.css');
			this.addClass('jsonFileNode');
			
			this.append('<div class="status"></div>');
			
			this.subscribe('JSB.Workspace.Entry.updated', function(sender){
				if(sender != $this.descriptor.entry){
					return;
				}
				$this.update();
			});
			
			this.subscribe(['JSB.Workspace.FileEntry.upload','DataCube.Parser.progress'], {session: true}, function(sender, msg, params){
				if(sender != $this.getEntry()){
					return;
				}
				$this.update(params.status);
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
				if($this.getEntry().getLastTimestamp()){
					statusElt.append(`#dot
						<div class="item tables">Таблиц: <span class="count">{{=$this.getEntry().getTablesCount()}}</span>; </div>
						<div class="item columns">cтолбцов: <span class="count">{{=$this.getEntry().getColumnsCount()}}</span>; </div>
						<div class="item records">записей: <span class="count">{{=$this.getEntry().getRecordsCount()}}</span></div>
					`);
				} else {
					statusElt.append('<span>Файл еще не обработан</span>');
				}
			}
		}
	}
	
}