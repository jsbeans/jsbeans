{
	$name: 'DataCube.JsonFileNode',
	$parent: 'JSB.Workspace.FileNode',
	$client: {
		$require: ['css:JsonFileNode.css'],
		$constructor: function(opts){
			var self = this;
			$base(opts);
			this.addClass('jsonFileNode');
			
			this.append('<div class="status"></div>');
			
			this.subscribe('JSB.Workspace.Entry.updated', function(sender){
				if(sender != $this.descriptor.entry){
					return;
				}
				$this.update();
			});
			
			this.subscribe(['JSB.Workspace.FileEntry.upload','DataCube.Parser.progress'], {session: true}, function(sender, msg, params){
				if(sender != $this.getTargetEntry()){
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
				if($this.getTargetEntry().getLastTimestamp()){
					statusElt.append(`#dot
						<div class="item tables">Таблиц: <span class="count">{{=$this.getTargetEntry().getTablesCount()}}</span>; </div>
						<div class="item columns">cтолбцов: <span class="count">{{=$this.getTargetEntry().getColumnsCount()}}</span>; </div>
						<div class="item records">записей: <span class="count">{{=$this.getTargetEntry().getRecordsCount()}}</span></div>
					`);
				} else {
					statusElt.append('<span>Файл еще не обработан</span>');
				}
			}
		}
	}
	
}