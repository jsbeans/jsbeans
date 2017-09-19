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
				<div jsb="JSB.Widgets.ScrollBox" class="scroll">
			
					<div jsb="JSB.Widgets.GroupBox" caption="Идентификация визуализации" collapsible="false" class="dashboardSettings">
						<div class="option workspaceId">
							<div class="icon"></div>
							<div class="editor" jsb="JSB.Widgets.PrimitiveEditor" readonly="true" title="Идентификатор рабочей области" placeholder="Идентификатор рабочей области"></div>
						</div>
						
						<div class="option dashboardId">
							<div class="icon"></div>
							<div class="editor" jsb="JSB.Widgets.PrimitiveEditor" readonly="true" title="Идентификатор визуализации" placeholder="Идентификатор визуализации"></div>
						</div>
						
						<div class="option dashboardShare">
							<div class="icon"></div>
							<div class="editor" jsb="JSB.Widgets.PrimitiveEditor" readonly="true" title="URL визуализации" placeholder="URL визуализации"></div>
							<div jsb="JSB.Widgets.Button" class="roundButton btn16 btnOpenNewWindow" caption="Открыть"
								onclick="{{=this.callbackAttr(function(evt){$this.openNewWindow()})}}"></div>
							
						</div>
					</div>
					
				</div>
			`);
		},
		
		refresh: function(){
			if(!this.ready){
				JSB.deferUntil(function(){
					$this.ready = true;
					$this.refresh();
				}, function(){
					return $this.isContentReady();
				});
				return;
			}

			$this.fillSettings();
		},
		
		fillSettings: function(){
			var entry = this.node.getEntry();
			$this.ignoreHandlers = true;
			var wid = entry.workspace.getLocalId();
			var eid = entry.getLocalId();
			
			// fill id
			this.find('.workspaceId > .editor').jsb().setData(wid);
			this.find('.dashboardId > .editor').jsb().setData(eid);
			
			var jsbPath = JSB.getProvider().getServerBase() + 'datacube/Dashboard.jsb?wsid=' + wid + '&did=' + eid;
			this.find('.dashboardShare > .editor').jsb().setData(jsbPath);
			
			$this.ignoreHandlers = false;
		},
		
		openNewWindow: function(){
			var url = this.find('.dashboardShare > .editor').jsb().getData().getValue();
			var win = window.open(url, '_blank');
			win.focus();
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