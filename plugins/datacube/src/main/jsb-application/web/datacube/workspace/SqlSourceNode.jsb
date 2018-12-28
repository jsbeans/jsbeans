{
	$name: 'DataCube.SqlSourceNode',
	$parent: 'JSB.Workspace.EntryNode',
	$client: {
		$require: ['css:SqlSourceNode.css'],
		$constructor: function(opts){
			$base(opts);
			this.addClass('sqlSourceNode');
			
			this.append(`#dot
				<div class="status"></div>
			`);
			
			this.subscribe('JSB.Workspace.Entry.updated', function(sender){
				if(sender != $this.getTargetEntry()){
					return;
				}
				$this.update();
			});
			
			this.subscribe('DataCube.Model.SqlSource.extractScheme', {session: true}, function(sender, msg, params){
				if(sender != $this.getTargetEntry()){
					return;
				}
                $this.update(params.status);
			});
			
			$this.update();
		},
		
		update: function(status){
			if(status){
				this.find('.status').empty().text(status);
				return;
			}
			var details = $this.getTargetEntry().getDetails();
			if(!details || !details.updated){
				this.find('.status').empty().text('Схема не загружена');
			} else {
				this.find('.status').empty().append('Схем: <span class="count">' + details.schemes + '</span>; таблиц: <span class="count">' + details.tables + '</span>; столбцов: <span class="count">' + details.columns + '</span>');
			}
		}
		
	}
	
}