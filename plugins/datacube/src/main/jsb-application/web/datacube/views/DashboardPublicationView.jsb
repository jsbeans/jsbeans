{
	$name: 'DataCube.DashboardPublicationView',
	$parent: 'JSB.Workspace.BrowserView',
	
	$client: {
		ready: false,
		ignoreHandlers: false,
		
		$constructor: function(opts){
			$base(opts);
			
			this.loadCss('DashboardPublicationView.css');
			this.addClass('dashboardPublicationView');
			
			this.append(`#dot
				<div jsb="JSB.Widgets.ScrollBox">
			
					<div jsb="JSB.Widgets.GroupBox" caption="Идентификация визуализации" collapsible="false" class="dashboardSettings">
						<div class="option workspaceId">
							<div class="icon"></div>
							<div class="editor" jsb="JSB.Widgets.PrimitiveEditor" readonly="true" title="Идентификатор рабочей области" placeholder="Идентификатор рабочей области"></div>
						</div>
						
						<div class="option dashboardId">
							<div class="icon"></div>
							<div class="editor" jsb="JSB.Widgets.PrimitiveEditor" readonly="true" title="Идентификатор визуализации" placeholder="Идентификатор визуализации"></div>
						</div>
					</div>
					
				</div>
			`);
		},
		
		refresh: function(){
		}
		
	},
	
	$server: {
		$require: 'JSB.Workspace.WorkspaceController',
		$bootstrap: function(){
			WorkspaceController.registerBrowserView(this, {
				wmKey: 'datacube',
				priority: 0.3,
				acceptNode: 'DataCube.DashboardNode',
				caption: 'Публикация'
			});
		},
	}
}