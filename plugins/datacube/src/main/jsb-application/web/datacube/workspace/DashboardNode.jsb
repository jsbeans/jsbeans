/** DataCube - jsBeans extension | jsbeans.org (MIT Licence) | (c) Special Information Systems, LLC */

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
					<div class="item widgets">Виджетов: <span class="count">{{=$this.getTargetEntry().getWidgetCount()}}</span></div>
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
			this.find('.status > .widgets > .count').text($this.getTargetEntry().getWidgetCount());
		}
	}
}