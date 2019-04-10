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
			
			var iconStr = this.$('head link[rel="shortcut icon"]').attr('href');
			if(iconStr && iconStr.length > 0){
				this.iconElt = this.$('<img class="icon cell">');
				this.iconElt.attr('src', iconStr);
				this.headerElt.append(this.iconElt);
			}

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
			
			if(!opts.embedded){
				this.server().getEntry(function(e){
					$this.setCurrentEntry(e);
				});
			}
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
		$require: [	'JSB.Workspace.WorkspaceController', 
					'JSB.Web',
					'JSB.Base64'],
		
		dashboardEntry: null,
		
		base64ImageToBinary: function(base64str){
			var m = base64str.match(/^data\:([^;]+);base64,(.+)$/i);
			if(m && m.length >= 3){
				return {
					type: m[1],
					data: Base64.decode(m[2])
				};
			}
		},
		
		get: function(params, path){
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
			
			
			// configuration
			var ctx = this.dashboardEntry.getSettingsContext();
			var description = ctx.find('publication description').value();
			
			var icon = ctx.find('publication icon').value();
			var lastIdx = icon.indexOf(';base64');
			var iconType = icon.substring(5, lastIdx);
			
			var logo = ctx.find('publication logo').value();
			
			var url = ctx.find('publication url').value() || path;
			
			function urlJoin(param){
				if(url.indexOf('?') >= 0){
					return url + '&' + param;
				}
				return url + '?' + param;
			}
			
			var keywords = '';
			var keywordArr = ctx.find('publication keywords').values();
			if(keywordArr && keywordArr.length > 0){
				for(var i = 0; i < keywordArr.length; i++){
					if(keywords.length > 0){
						keywords += ', ';
					}
					keywords += keywordArr[i].trim();
				}
			}
			
			var metaTags = [];
			var tagsSelArr = ctx.find('details metaTags').values();
			for(var i = 0; i < tagsSelArr.length; i++){
				var tagSel = tagsSelArr[i];
				var name = tagSel.find('tagName').value();
				var prop = tagSel.find('tagProp').value();
				var content = tagSel.find('tagContent').value();
				var equiv = tagSel.find('tagHttpEquiv').value();
				var charset = tagSel.find('tagCharset').value();
				var metaTagStr = '<meta ' 
					+ (name&&name.length > 0?'name="' + name + '" ':'')
					+ (prop&&prop.length > 0?'property="' + prop + '" ':'')
					+ (content&&content.length > 0?'content="' + content + '" ':'')
					+ (equiv&&equiv.length > 0?'http-equiv="' + equiv + '" ':'')
					+ (charset&&charset.length > 0?'charset="' + charset + '" ':'')
					+ '/>';
				metaTags.push(metaTagStr);
			}
			
			var headAfter = null;
			if(ctx.find('details headEntries').checked()){
				headAfter = ctx.find('details headEntries').value();
			}
			
			var bodyBefore = null;
			if(ctx.find('details bodyBefore').checked()){
				bodyBefore = ctx.find('details bodyBefore').value();
			}

			var bodyAfter = null;
			if(ctx.find('details bodyAfter').checked()){
				bodyAfter = ctx.find('details bodyAfter').value();
			}
			
			var htmlSection = this.getJsb()['$html'];
			
			if(params.r){
				switch(params.r){
				case 'logo':
					var imgDesc = $this.base64ImageToBinary(logo);
					if(imgDesc){
						return Web.response(imgDesc.data, {
							mode:'binary',
							contentType: imgDesc.type
						});
					}
					break;
				case 'icon':
					var imgDesc = $this.base64ImageToBinary(icon);
					if(imgDesc){
						return Web.response(imgDesc.data, {
							mode:'binary',
							contentType: imgDesc.type
						});
					}
					break;
				}
				throw new Error('Failed to get resource for "' + params.r + '"');
			} else {
				$this.publish('DataCube.Dashboard.get', this.dashboardEntry);
				return `#dot
				<!DOCTYPE html>
<!--
  ~ This file generated by jsBeans framework.
  ~ jsBeans v2.6.11 | jsbeans.org | (c) 2011-2019 Special Information Systems, LLC
-->
				<html>
				<head>
					<meta charset="utf-8" />
					
					{{? icon && icon.length > 0}}
					<link rel="shortcut icon" type="{{=iconType}}" href="{{=urlJoin('r=icon')}}"/>
					<link rel="icon" type="{{=iconType}}" href="{{=urlJoin('r=icon')}}"/>
					{{??}}
					<link rel="shortcut icon" type="image/png" href="{{=htmlSection.favicon}}"/>
					{{?}}
	
					<title>{{=$this.dashboardEntry.getName()}}</title>
					
					<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
					<meta name="viewport" content="width=1024, user-scalable=no" />
					
					{{? description && description.length > 0}}
					<meta name="description" content="{{=description}}" />
					{{?}}
					
					{{? keywords && keywords.length > 0}}
					<meta name="keywords" content="{{=keywords}}" />
					{{?}}
					
					<meta property="og:title" content="{{=$this.dashboardEntry.getName()}}" />
					<meta property="og:type" content="article" />
					
					{{? logo && logo.length > 0}}
					<meta property="og:image" content="{{=urlJoin('r=logo')}}" />
					{{?? icon && icon.length > 0}}
					<meta property="og:image" content="{{=urlJoin('r=icon')}}" />
					{{??}}
					<meta property="og:image" content="{{=htmlSection.favicon}}" />
					{{?}}
					
					{{? url && url.length > 0}}
					<meta property="og:url" content="{{=url}}" />
					{{??}}
					<meta property="og:url" content="{{=path}}" />
					{{?}}
					
					{{? description && description.length > 0}}
					<meta property="og:description" content="{{=description}}" />
					{{?}}
					
					{{~metaTags :tag:index}}
					{{=tag}}
					{{~}}
					
					<script type="text/javascript" src="/jsbeans.jsb"></script>
				 	
				 	<style>
				 		body {
							overflow: hidden;
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
				 	
				 	{{?headAfter && headAfter.length > 0}}
				 	{{=headAfter}}
				 	{{?}}
				</head>
	
				<body>
					{{?bodyBefore && bodyBefore.length > 0}}
				 	{{=bodyBefore}}
				 	{{?}}
				 	
					<div jsb="{{=this.getJsb().$name}}" bind="{{=this.getId()}}" class="mainContainer" ></div>
					
					{{?bodyAfter && bodyAfter.length > 0}}
				 	{{=bodyAfter}}
				 	{{?}}
	
				</body>
	
				</html>`;
			}
		},
		
		getEntry: function(){
			JSB.getLogger().debug('Requested dashboard: ' + this.dashboardEntry.getName());
			
			return this.dashboardEntry;
		}

	}
	
	
}