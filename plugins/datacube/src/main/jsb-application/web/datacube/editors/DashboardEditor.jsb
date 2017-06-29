{
	$name: 'JSB.DataCube.DashboardEditor',
	$parent: 'JSB.Widgets.Widget',
	
	$client: {
		$require: ['JSB.Widgets.ToolBar'],
		
		entry: null,
		           
		$constructor: function(opts){
			$base(opts);
			
			this.loadCss('DashboardEditor.css');
			this.addClass('dashboardEditor');
			
			// create toolbar
			this.toolbar = new ToolBar();
			this.append(this.toolbar);
			
			this.toolbar.addItem({
				key: 'addSource',
				tooltip: 'Добавить источник данных',
				element: '<div class="icon"></div>',
				click: function(){
				}
			});
			
			this.toolbar.addSeparator({key: 'createSeparator'});
			
		},
		
		setCurrentEntry: function(entry){
			if(this.entry == entry){
				return;
			}
			this.entry = entry;
		}
		
	}
}