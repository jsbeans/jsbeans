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
		           'DataCube.Widgets.WidgetWrapper',
		           'JSB.Widgets.MenuBar',
		           'css:Dashboard.css'],
		           
		entry: null,
		           
		$constructor: function(opts){
			$base(opts);
			this.addClass('dataCubeDashboard loading');
			
			this.filterManager = new FilterManager(this);
			
			this.headerElt = this.$('<div class="header"></div>');
			this.append(this.headerElt);

			this.titleElt = this.$('<div class="title cell"></div>');
			this.headerElt.append(this.titleElt);
			
			this.filterSelector = new FilterSelector(this, this.filterManager);
			this.headerElt.append($this.$('<div class="filter cell"></div>').append(this.filterSelector.getElement()));
			
			this.menuBar = new MenuBar({
				category: 'dashboardViewer',
				cssClass: 'dashboardMenu cell',
				context: this
			});
			this.headerElt.append(this.menuBar.getElement());
			
			this.dashboard = new Dashboard({
				emptyText: '',
			});
			this.append(this.dashboard);
			
			this.loadingBack = $this.$('<div class="loadingBack"><div class="message"><div class="icon"></div></div></div>');
			this.append(this.loadingBack);
			
			this.headerElt.resize(function(){
				$this.dashboard.getElement().css('height', 'calc(100% - '+($this.headerElt.outerHeight() + 4)+'px)');
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
			$this.addClass('loading');
			this.titleElt.text(this.entry.getName());
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
					var wWrapper = new WidgetWrapper(dashboardDesc.wrappers[wId], $this, {viewMode: true});
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
				
				JSB.chain(Object.keys($this.wrappers), function(wId, callback){
					$this.wrappers[wId].ensureWidgetInitialized(callback);
				}, function(){
					$this.removeClass('loading');
				});
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
		},
		
		getWrappers: function(){
			return this.wrappers;
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
			
			var w = WorkspaceController.getWorkspace(params.wsid);
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
			JSB.getLogger().debug('Requested dashboard: ' + this.dashboardEntry.getName());
			return this.dashboardEntry;
		}

	}
	
	
}