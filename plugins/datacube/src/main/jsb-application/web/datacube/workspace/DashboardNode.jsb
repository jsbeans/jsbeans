{
	$name: 'JSB.DataCube.DashboardNode',
	$parent: 'JSB.Workspace.EntryNode',
	$client: {
		$constructor: function(opts){
			$base(opts);
			this.loadCss('DashboardNode.css');
			this.addClass('dashboardNode');
			
			this.append(`#dot
				<div class="status">
					<div class="item widgets">Виджетов: <span class="count">{{=this.descriptor.entry.getWidgetCount()}}</span></div>
				</div>
			`);
			
			this.subscribe('Workspace.Entry.updated', function(){
				$this.update();
			});
		},
		
		update: function(){
			this.find('.status > .widgets > .count').text(this.descriptor.entry.getWidgetCount());
		}
		
	}
	
}