{
	$name: 'DataCube.Model.CustomPanelSettings',
	$parent: 'DataCube.Model.SettingsEntry',
	
	$scheme: {
		panelSettings: {
			render: 'group',
			name: 'Панели',
			multiple: true,
			collapsible: false,
			entryType: '',
			items: {
				viewName: {
					render: 'item',
					name: 'Название',
					valueType: 'string',
				},
				viewPanel: {
					render: 'browserViewBinding',
					name: 'Панель',
					accept: 'DataCube.Model.Dashboard',
					emptyText: 'Перетащите сюда визуализацию'
				},
				viewIcon: {
					name: 'Иконка',
					render: 'item',
					editor: 'JSB.Widgets.ImageLoader'
				},
				viewEnabled: {
					render: 'item',
					name: 'Отображать',
					optional: 'checked',
					editor: 'none'
				}
			}
		}
		
	},
	
	$server: {
		$require: ['JSB.Workspace.WorkspaceController'],
		
		_updatedContext: null,
		
		$constructor: function(id, workspace, opts) {
			$base(id, workspace, opts);
			
			WorkspaceController.ensureTrigger('ready', function(){
				// update settings
				$this.storeSettings();
			});
			
			$this.subscribe('JSB.Workspace.WorkspaceController.queryBrowserViews', function(sender, msg, viewDesc){
				$this.fixupViews(viewDesc.nodeJsb, viewDesc.views);
			});
		},
		
		getSettingsScheme: function(){
			var innerScheme = $base();
			var nodeSlice = WorkspaceController.constructExplorerNodeTypeSlice();
			
			var scheme = {
				'null': {
					render: 'group',
					name: 'Главная',
					eType: null,
					icon: 'data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiIHN0YW5kYWxvbmU9Im5vIj8+DQo8IS0tIEdlbmVyYXRvcjogQWRvYmUgSWxsdXN0cmF0b3IgMTYuMC4wLCBTVkcgRXhwb3J0IFBsdWctSW4gLiBTVkcgVmVyc2lvbjogNi4wMCBCdWlsZCAwKSAgLS0+DQoNCjxzdmcNCiAgIHhtbG5zOmRjPSJodHRwOi8vcHVybC5vcmcvZGMvZWxlbWVudHMvMS4xLyINCiAgIHhtbG5zOmNjPSJodHRwOi8vY3JlYXRpdmVjb21tb25zLm9yZy9ucyMiDQogICB4bWxuczpyZGY9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkvMDIvMjItcmRmLXN5bnRheC1ucyMiDQogICB4bWxuczpzdmc9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIg0KICAgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIg0KICAgeG1sbnM6c29kaXBvZGk9Imh0dHA6Ly9zb2RpcG9kaS5zb3VyY2Vmb3JnZS5uZXQvRFREL3NvZGlwb2RpLTAuZHRkIg0KICAgeG1sbnM6aW5rc2NhcGU9Imh0dHA6Ly93d3cuaW5rc2NhcGUub3JnL25hbWVzcGFjZXMvaW5rc2NhcGUiDQogICB2ZXJzaW9uPSIxLjEiDQogICBpZD0iQ2FwYV8xIg0KICAgeD0iMHB4Ig0KICAgeT0iMHB4Ig0KICAgd2lkdGg9IjIwIg0KICAgaGVpZ2h0PSIyMCINCiAgIHZpZXdCb3g9IjAgMCAyMCAyMCINCiAgIHhtbDpzcGFjZT0icHJlc2VydmUiDQogICBpbmtzY2FwZTp2ZXJzaW9uPSIwLjkxIHIxMzcyNSINCiAgIHNvZGlwb2RpOmRvY25hbWU9ImhvbWUuc3ZnIj48bWV0YWRhdGENCiAgICAgaWQ9Im1ldGFkYXRhNDEiPjxyZGY6UkRGPjxjYzpXb3JrDQogICAgICAgICByZGY6YWJvdXQ9IiI+PGRjOmZvcm1hdD5pbWFnZS9zdmcreG1sPC9kYzpmb3JtYXQ+PGRjOnR5cGUNCiAgICAgICAgICAgcmRmOnJlc291cmNlPSJodHRwOi8vcHVybC5vcmcvZGMvZGNtaXR5cGUvU3RpbGxJbWFnZSIgLz48ZGM6dGl0bGU+PC9kYzp0aXRsZT48L2NjOldvcms+PC9yZGY6UkRGPjwvbWV0YWRhdGE+PGRlZnMNCiAgICAgaWQ9ImRlZnMzOSIgLz48c29kaXBvZGk6bmFtZWR2aWV3DQogICAgIHBhZ2Vjb2xvcj0iI2ZmZmZmZiINCiAgICAgYm9yZGVyY29sb3I9IiM2NjY2NjYiDQogICAgIGJvcmRlcm9wYWNpdHk9IjEiDQogICAgIG9iamVjdHRvbGVyYW5jZT0iMTAiDQogICAgIGdyaWR0b2xlcmFuY2U9IjEwIg0KICAgICBndWlkZXRvbGVyYW5jZT0iMTAiDQogICAgIGlua3NjYXBlOnBhZ2VvcGFjaXR5PSIwIg0KICAgICBpbmtzY2FwZTpwYWdlc2hhZG93PSIyIg0KICAgICBpbmtzY2FwZTp3aW5kb3ctd2lkdGg9IjE5MjAiDQogICAgIGlua3NjYXBlOndpbmRvdy1oZWlnaHQ9IjExMzgiDQogICAgIGlkPSJuYW1lZHZpZXczNyINCiAgICAgc2hvd2dyaWQ9ImZhbHNlIg0KICAgICBpbmtzY2FwZTp6b29tPSIyOS41Ig0KICAgICBpbmtzY2FwZTpjeD0iMTMuNjc0MzQ0Ig0KICAgICBpbmtzY2FwZTpjeT0iOC40NzkxMjMiDQogICAgIGlua3NjYXBlOndpbmRvdy14PSItOCINCiAgICAgaW5rc2NhcGU6d2luZG93LXk9Ii04Ig0KICAgICBpbmtzY2FwZTp3aW5kb3ctbWF4aW1pemVkPSIxIg0KICAgICBpbmtzY2FwZTpjdXJyZW50LWxheWVyPSJDYXBhXzEiIC8+PGcNCiAgICAgaWQ9ImczIg0KICAgICB0cmFuc2Zvcm09Im1hdHJpeCgwLjAzODgzMTQ5LDAsMCwwLjA0MjQyODc3LDAuMDc4NDMwNzksLTAuODUyNjI4ODkpIj48cGF0aA0KICAgICAgIGQ9Im0gNTEyLDI5NiAtOTYsLTk2IDAsLTE0NCAtNjQsMCAwLDgwIC05NiwtOTYgLTI1NiwyNTYgMCwxNiA2NCwwIDAsMTYwIDE2MCwwIDAsLTk2IDY0LDAgMCw5NiAxNjAsMCAwLC0xNjAgNjQsMCAwLC0xNiB6Ig0KICAgICAgIGlkPSJwYXRoNSINCiAgICAgICBpbmtzY2FwZTpjb25uZWN0b3ItY3VydmF0dXJlPSIwIiAvPjwvZz48Zw0KICAgICBpZD0iZzciDQogICAgIHRyYW5zZm9ybT0idHJhbnNsYXRlKDAsLTQ5MikiIC8+PGcNCiAgICAgaWQ9Imc5Ig0KICAgICB0cmFuc2Zvcm09InRyYW5zbGF0ZSgwLC00OTIpIiAvPjxnDQogICAgIGlkPSJnMTEiDQogICAgIHRyYW5zZm9ybT0idHJhbnNsYXRlKDAsLTQ5MikiIC8+PGcNCiAgICAgaWQ9ImcxMyINCiAgICAgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoMCwtNDkyKSIgLz48Zw0KICAgICBpZD0iZzE1Ig0KICAgICB0cmFuc2Zvcm09InRyYW5zbGF0ZSgwLC00OTIpIiAvPjxnDQogICAgIGlkPSJnMTciDQogICAgIHRyYW5zZm9ybT0idHJhbnNsYXRlKDAsLTQ5MikiIC8+PGcNCiAgICAgaWQ9ImcxOSINCiAgICAgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoMCwtNDkyKSIgLz48Zw0KICAgICBpZD0iZzIxIg0KICAgICB0cmFuc2Zvcm09InRyYW5zbGF0ZSgwLC00OTIpIiAvPjxnDQogICAgIGlkPSJnMjMiDQogICAgIHRyYW5zZm9ybT0idHJhbnNsYXRlKDAsLTQ5MikiIC8+PGcNCiAgICAgaWQ9ImcyNSINCiAgICAgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoMCwtNDkyKSIgLz48Zw0KICAgICBpZD0iZzI3Ig0KICAgICB0cmFuc2Zvcm09InRyYW5zbGF0ZSgwLC00OTIpIiAvPjxnDQogICAgIGlkPSJnMjkiDQogICAgIHRyYW5zZm9ybT0idHJhbnNsYXRlKDAsLTQ5MikiIC8+PGcNCiAgICAgaWQ9ImczMSINCiAgICAgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoMCwtNDkyKSIgLz48Zw0KICAgICBpZD0iZzMzIg0KICAgICB0cmFuc2Zvcm09InRyYW5zbGF0ZSgwLC00OTIpIiAvPjxnDQogICAgIGlkPSJnMzUiDQogICAgIHRyYW5zZm9ybT0idHJhbnNsYXRlKDAsLTQ5MikiIC8+PC9zdmc+',
					collapsible: true,
					collapsed: true,
					items: innerScheme
				}
			};
			for(var eType in nodeSlice){
				var panelKey = eType.replace(/\./g, '_');
				scheme[panelKey] = {
					render: 'group',
					name: nodeSlice[eType].title || eType,
					eType: eType,
					icon: nodeSlice[eType].icon,
					collapsible: true,
					collapsed: true,
					items: innerScheme
				};
			}
			
			return scheme;
		},
		
		getSettingsContext: function(settings){
			$base(settings);
			
			// update context in correspondence with workspace browser views
			var panelKeys = Object.keys(this._settingsContext._scheme);
			for(var panelKey in this._settingsContext._scheme){
				var panelContainerSel = this._settingsContext.find(panelKey);
				var panels = panelContainerSel.find('panelSettings');
				var eType = panelContainerSel.scheme().eType;
				var views = WorkspaceController.queryBrowserViews(null, eType, true);
				for(var i = 0; i < views.length; i++){
					var view = views[i];
					
					var pSels = panels.values();
					var bFound = false;
					for(var j = 0; j < pSels.length; j++){
						var pSel = pSels[j];
						var sysView = pSel.find('viewPanel').getSystemView();
						if(sysView && sysView.viewType == view.viewType){
							bFound = true;
							break;
						}
					}
					if(bFound){
						continue;
					}
					
					var panelSel = panels.addValue();
					panelSel.find('viewName').setValue(view.caption);
					panelSel.find('viewPanel').setSystemView(view);
					if(view.icon){
						panelSel.find('viewIcon').setValue(view.icon);
					}
				}
			}
			
			return this._settingsContext;
		},
		
		fixupViews: function(nodeJsb, views){
			var ctx = this.getSettingsContext();
			var panelKey = (!nodeJsb ? 'null' : nodeJsb.getDescriptor().$name.replace(/\./g, '_'));
			var panels = ctx.find(panelKey + ' panelSettings');
			var pSels = panels.values();
			if(!pSels || pSels.length == 0){
				return;
			}
			views.splice(0, views.length);
			for(var i = 0; i < pSels.length; i++){
				var pSel = pSels[i];
				if(!pSel.find('viewEnabled').checked()){
					continue;
				}
				var viewPanelSel = pSel.find('viewPanel');
				var view = viewPanelSel.getSystemView();
				var newView = {};
				if(view){
					newView = JSB.clone(view);
				} else {
					// add dashboard
					continue;
				}
				var caption = pSel.find('viewName').value();
				var icon = pSel.find('viewIcon').value();
				if(caption && caption.length > 0){
					newView.caption = caption;
				}
				if(icon && icon.length > 0){
					newView.icon = icon;
				}
				newView.priority = pSels.length - i - 1;
				views.push(newView);
			}
		}
	}
}