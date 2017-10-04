{
	$name: 'DataCube.Dashboard',
	$parent: 'JSB.Widgets.Page',
	
	$html: {
		title: 'DataCube',
		favicon: '/datacube/images/datacube.png'
	},
	
	$client: {
		$require: ['JSB.Widgets.Dashboard.Dashboard',
		           'DataCube.Controls.FilterSelector',
		           'DataCube.Widgets.FilterManager',
		           'DataCube.Widgets.WidgetWrapper'],
		           
		entry: null,
		           
		$constructor: function(opts){
			$base(opts);
			this.loadCss('Dashboard.css');
			this.addClass('dataCubeDashboard');
			
			this.filterManager = new FilterManager(this);
			
			this.filterSelector = new FilterSelector(this, this.filterManager);
			this.append(this.filterSelector);
			
			this.dashboard = new Dashboard({
				emptyText: 'Перетащите сюда виджет'
			});
			this.append(this.dashboard);
			
			this.filterSelector.getElement().resize(function(){
				$this.dashboard.getElement().css('height', 'calc(100% - '+$this.filterSelector.getElement().outerHeight()+'px)');
			});
			
			this.server().getEntry(function(e){
				$this.setCurrentEntry(e);
			});
		},
		
		setCurrentEntry: function(entry){
			if(this.entry == entry){
				return;
			}
			this.entry = entry;
			this.filterManager.clear();
			this.entry.server().load(function(dashboardDesc){
				// remove old wrappers
				for(var wId in $this.wrappers){
					$this.wrappers[wId].destroy();
				}
				
				// create wrappers
				$this.wrappers = {};
				var wWrappers = {};
				for(var wId in dashboardDesc.wrappers){
					var wWrapper = new WidgetWrapper(dashboardDesc.wrappers[wId], $this);
					wWrappers[wId] = wWrapper;
					$this.wrappers[wWrapper.getId()] = wWrapper;
				}
				
				// translate layout ids
				var layout = JSB.clone(dashboardDesc.layout);
				if(layout){
					function performLayout(lEntry){
						if(lEntry && lEntry.widgets){
							var nWidgets = [];
							for(var i = 0; i < lEntry.widgets.length; i++){
								var wServerId = lEntry.widgets[i];
								if(wServerId && wWrappers[wServerId]){
									var wClientId = wWrappers[wServerId].getId();
									nWidgets.push(wClientId);
								}
							}
							lEntry.widgets = nWidgets;
						} 
						if(lEntry && lEntry.containers){
							for(var i = 0; i < lEntry.containers.length; i++){
								performLayout(lEntry.containers[i]);
							}
						} 
					}
					
					performLayout(layout);
				}
				var desc = {
					layout: layout,
					widgets: $this.wrappers
				};
				$this.ignoreHandlers = true;
				$this.dashboard.setLayout(desc);
				$this.ignoreHandlers = false;
			});
		},
		
		getFilterSelector: function(){
			return this.filterSelector;
		},
		
		getFilterManager: function(){
			return this.filterManager;
		},
		
		getDashboard: function(){
			return this.entry;
		}
	},
	
	$server: {
		$require: ['JSB.Workspace.WorkspaceController', 'JSB.Web'],
		
		dashboardEntry: null,
		
		get: function(params){
			
			if(!params.wsid){
				throw new Error('Missing parameter: "wsid" (workspace Id)');
			}

			if(!params.did){
				throw new Error('Missing parameter: "did" (dashboard Id)');
			}
			
			var wm = WorkspaceController.ensureManager('datacube');
			if(!wm){
				throw new Error('Internal error: missing WorkspaceManager for datacube');
			}
			var w = wm.workspace(params.wsid);
			if(!w){
				throw new Error('Unable to find workspace with id: ' + params.wsid);
			}
			
			this.dashboardEntry = w.entry(params.did);
			if(!this.dashboardEntry || !JSB.isInstanceOf(this.dashboardEntry, 'DataCube.Model.Dashboard')){
				throw new Error('Unable to find dashboard with id: ' + params.did);
			}
			
			var htmlSection = this.getJsb()['$html'];
			return `#dot
			<!DOCTYPE html>
			<html>
			<head>
				<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
				<meta name="viewport" content="width=1024, user-scalable=no" />
				{{? htmlSection.title}}
				<title>{{=$this.dashboardEntry.getName()}}</title>
				{{?}}
				{{? htmlSection.favicon}}
				<link rel="shortcut icon" type="image/png" href="{{=htmlSection.favicon}}"/>
				{{?}}
			 	<script type="text/javascript" src="/jsbeans.jsb"></script>
			 	
			 	<style>
			 		body {
						overflow: hidden; /* this is important to prevent the whole page to bounce */
						margin: 0;
					}

					.mainContainer {
						width: 100%;
						height: 100%;
						left: 0%;
						top: 0%;
						display: block;
						position: absolute !important;
					}
			 	</style>
			</head>

			<body>
				<div jsb="{{=this.getJsb().$name}}" bind="{{=this.getId()}}" class="mainContainer" ></div>
			</body>

			</html>`;
		},
		
		getEntry: function(){
			return this.dashboardEntry;
		}

	}
	
	
}