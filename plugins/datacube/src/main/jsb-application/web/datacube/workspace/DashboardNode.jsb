{
	$name: 'DataCube.DashboardNode',
	$parent: 'JSB.Workspace.EntryNode',
	$client: {
		$require: ['css:DashboardNode.css'],
		
		$constructor: function(opts){
			$base(opts);
			this.addClass('dashboardNode');
			
			this.append(`#dot
				<div class="status">
					<div class="item widgets">Виджетов: <span class="count">{{=this.descriptor.entry.getWidgetCount()}}</span></div>
				</div>
			`);
			
			this.subscribe('JSB.Workspace.Entry.updated', function(sender){
                if(sender != $this.getTargetEntry()){
                    return;
                }
                $this.update();
			});
		},
		
		update: function(){
			this.find('.status > .widgets > .count').text(this.descriptor.entry.getWidgetCount());
		}
	}
}