/** DataCube - jsBeans extension | jsbeans.org (MIT Licence) | (c) Special Information Systems, LLC */

{
	$name: 'DataCube.CustomPanelView',
	$parent: 'DataCube.Workspace.BrowserView',
	
	$expose: {
		priority: 1,
		caption: 'Панель',
	},
	
	$scheme: {
		dashboard: {
			render: 'entryBinding',
			name: 'Визуализация',
			accept: 'DataCube.Model.Dashboard',
			emptyText: 'Перетащите сюда визуализацию'
		}
	},
	
	$client: {
		$require: ['DataCube.Dashboard',
		           'css:CustomPanelView.css'],
		
		$constructor: function(opts){
			$base(opts);
			this.addClass('customPanelView');
			this.dashboardView = new Dashboard({embedded:true});
			this.append(this.dashboardView);
		},
		
		refresh: function(){
			var dashboardSel = this.getContext().find('dashboard');
			dashboardSel.getEntry(function(entry){
				if(entry){
					$this.dashboardView.setCurrentEntry(entry);
				}
			});
		}
		
	}
	
}