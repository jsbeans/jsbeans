{
	$name: 'DataCube.SliceApiView',
	$parent: 'JSB.Workspace.BrowserView',
	
	$client: {
		$require: ['JSB.Widgets.SplitBox', 
		           'JSB.Widgets.TabView', 
		           'JsonView', 
		           'JSB.Widgets.ScrollBox', 
		           'JSB.Widgets.MultiEditor'],
		ready: false,
		ignoreHandlers: false,
		isCube: false,
		requestOpts: {
			select: {},
			groupBy: [],
			filter: {},
			sort: [{}],
			skip: 0,
			limit: 10
		},
		
		$constructor: function(opts){
			$base(opts);
			
			this.loadCss('SliceApiView.css');
			this.addClass('sliceApiView');
			
			var splitBox = new SplitBox({
				type: 'vertical',
				position: 0.5
			});
			this.append(splitBox);
			splitBox.addToPane(0, `#dot
				<div class="leftScroll" jsb="JSB.Widgets.ScrollBox">
					<div jsb="JSB.Widgets.GroupBox" caption="Идентификация среза" class="cubeSettings">
						<div class="option workspaceId">
							<div class="icon"></div>
							<div class="editor" jsb="JSB.Widgets.PrimitiveEditor" readonly="true" title="Идентификатор рабочей области" placeholder="Идентификатор рабочей области"></div>
						</div>
						
						<div class="option cubeId">
							<div class="icon"></div>
							<div class="editor" jsb="JSB.Widgets.PrimitiveEditor" readonly="true" title="Идентификатор куба" placeholder="Идентификатор куба"></div>
						</div>
						
						<div class="option sliceId">
							<div class="icon"></div>
							<div class="editor" jsb="JSB.Widgets.PrimitiveEditor" readonly="true" title="Идентификатор среза" placeholder="Идентификатор среза"></div>
						</div>

					</div>
					
					<div jsb="JSB.Widgets.GroupBox" caption="Конструктор запроса" class="requestConstructor">
					
						<div class="option select" jsb="JSB.Widgets.CheckBox" label="$select" check="false">
							<div jsb="JSB.Widgets.MultiEditor" 
								class="editor selectEditor"
								valuetype="org.jsbeans.types.JsonObject" 
								showhints="false"
								onchange="{{=$this.callbackAttr(function(val){ $this.requestOpts.select = val; $this.updateRequest()}) }}"></div>
						</div>

						<div class="option groupBy" jsb="JSB.Widgets.CheckBox" label="$groupBy" checked="false"
							onchange="{{=$this.callbackAttr(function(checked){ $this.enableGroupBy(checked); })}}">
							<div jsb="JSB.Widgets.MultiEditor" 
								class="editor groupByEditor"
								valuetype="org.jsbeans.types.JsonObject" 
								showhints="false"
								onchange="{{=$this.callbackAttr(function(val){ $this.requestOpts.groupBy = val; $this.updateRequest()}) }}"></div>
						</div>

						<div class="option filter" jsb="JSB.Widgets.CheckBox" label="$filter" checked="false"
							onchange="{{=$this.callbackAttr(function(checked){ $this.enableFilter(checked); })}}">
							<div jsb="JSB.Widgets.MultiEditor" 
								class="editor filterEditor"
								valuetype="org.jsbeans.types.JsonObject" 
								showhints="false"
								onchange="{{=$this.callbackAttr(function(val){ $this.requestOpts.filter = val; $this.updateRequest()}) }}"></div>
						</div>

						<div class="option sort" jsb="JSB.Widgets.CheckBox" label="$sort" checked="false"
							onchange="{{=$this.callbackAttr(function(checked){ $this.enableSort(checked); })}}">
							<div jsb="JSB.Widgets.MultiEditor" 
								class="editor sortEditor"
								valuetype="org.jsbeans.types.JsonObject" 
								showhints="false"
								onchange="{{=$this.callbackAttr(function(val){ $this.requestOpts.sort = val; $this.updateRequest()}) }}"></div>
						</div>

						<div class="option skip" jsb="JSB.Widgets.CheckBox" label="skip" checked="true"
							onchange="{{=$this.callbackAttr(function(checked){ $this.updateRequest() })}}">
							<div jsb="JSB.Widgets.PrimitiveEditor"
								class="editor skipEditor"
								valuetype="int"
								ontypevalidation="true"
								onchange="{{=$this.callbackAttr(function(val){ $this.requestOpts.skip = val; $this.updateRequest() }) }}">
							</div>
						</div>

						<div class="option limit" jsb="JSB.Widgets.CheckBox" label="limit" checked="true"
							onchange="{{=$this.callbackAttr(function(checked){ $this.updateRequest() })}}">
							<div jsb="JSB.Widgets.PrimitiveEditor"
								class="editor limitEditor"
								valuetype="int"
								ontypevalidation="true"
								onchange="{{=$this.callbackAttr(function(val){ $this.requestOpts.limit = val; $this.updateRequest() }) }}">
							</div>
						</div>
						
					</div>
					
					<div jsb="JSB.Widgets.GroupBox" caption="HTTP запрос" class="httpRequest">
						<div class="option">
							<div jsb="JSB.Widgets.PrimitiveEditor"
								class="editor requestEditor"
								multiline="true"
								rows="10"
								onchange="{{=$this.callbackAttr(function(val){  }) }}">
							</div>
						</div>
						<div class="option">
							<div jsb="JSB.Widgets.Button" class="roundButton btn16 btnSendRequest" caption="Отправить запрос"
								onclick="{{=this.callbackAttr(function(evt){$this.sendRequest()})}}"></div>
						</div>
					</div>

				</div>
			`);
			
			var resultsTab = new TabView({
				allowCloseTab: false,
				allowNewTab: false
			});
			resultsTab.addClass('resultsTab');
			
			// add json view
			this.jsonView = new JsonView();
			var jsonScroll = new ScrollBox();
			jsonScroll.append(this.jsonView);
			var jsonTab = resultsTab.addTab('JSON', jsonScroll, {id:'json'});
			
			// add text view
			this.textView = new MultiEditor({
				readOnly: true,
				valueType: 'org.jsbeans.types.JsonObject'
			});
			resultsTab.addTab('Текст', this.textView, {id:'text'});
			resultsTab.switchTab(jsonTab);
			
			splitBox.addToPane(1, resultsTab);
		},

		enableGroupBy: function(bChecked){
			if(bChecked){
				var editor = this.find('.groupByEditor').jsb();
				editor.setData(this.requestOpts.groupBy);
			}
			this.updateRequest();
		},

		enableFilter: function(bChecked){
			if(bChecked){
				var editor = this.find('.filterEditor').jsb();
				editor.setData(this.requestOpts.filter);
			}
			this.updateRequest();
		},
		
		enableSort: function(bChecked){
			if(bChecked){
				var editor = this.find('.sortEditor').jsb();
				editor.setData(this.requestOpts.sort);
			}
			this.updateRequest();
		},
		
		updateRequest: function(){
			// construct slice request
			var entry = this.node.getEntry();
			var wid = entry.getWorkspace().getId();
			var eid = entry.getId();
			
			var query = {};
			if(this.isCube){
				query.$select = this.requestOpts.select;
				if(this.find('.option.groupBy').jsb().isChecked()){
					query.$groupBy = this.requestOpts.groupBy;
				}
			}
			if(this.find('.option.filter').jsb().isChecked()){
				query.$filter = this.requestOpts.filter;
			}
			if(this.find('.option.sort').jsb().isChecked()){
				query.$sort = this.requestOpts.sort;
			}
			
			var url = JSB.getProvider().getServerBase() + 'datacube/api/' + (this.isCube ? 'Cube.jsb':'Slice.jsb') + '?wsid=' + wid + (this.isCube ? '&cid=':'&sid=') + eid + '&query=' + JSON.stringify(query);
			
			if(this.find('.option.skip').jsb().isChecked()){
				url += '&skip=' + this.requestOpts.skip;
			}
			if(this.find('.option.limit').jsb().isChecked()){
				url += '&limit=' + this.requestOpts.limit;
			}
			
			this.find('.requestEditor').jsb().setData(url);
		},
		
		sendRequest: function(){
			var url = this.find('.requestEditor').jsb().getData().getValue();
			this.ajax(url, {}, function(result, obj){
				if(JSB.isString(obj)){
					obj = eval('(' + obj + ')');
				}
				$this.updateResults(obj);
			});
		},
		
		updateResults: function(obj){
			this.jsonView.setData(obj);
			this.textView.setData(obj);
		},
		
		fillSettings: function(){
			var idGroup = this.find('.cubeSettings').jsb();
			var entry = this.node.getEntry();
			if(JSB.isInstanceOf(entry, 'DataCube.Model.Cube')){
				this.isCube = true;
				idGroup.setTitle('Идентификация куба');
			} else {
				this.isCube = false;
				idGroup.setTitle('Идентификация среза');
			}
			this.requestOpts = {
				select: {},
				groupBy: [],
				filter: {},
				sort: [{}],
				skip: 0,
				limit: 10
			};
			$this.ignoreHandlers = true;
			var wid = entry.getWorkspace().getId();
			var eid = entry.getId();
			
			// fill id
			this.find('.workspaceId > .editor').jsb().setData(wid);
			if(this.isCube){
				this.find('.sliceId').addClass('hidden');
				this.find('.cubeId').removeClass('hidden');
				this.find('.cubeId > .editor').jsb().setData(eid);
			} else {
				this.find('.sliceId').removeClass('hidden');
				this.find('.cubeId').addClass('hidden');
				this.find('.sliceId > .editor').jsb().setData(eid);
			}
			
			
			
			// fill constructor
			if(this.isCube){
				this.find('.option.select').removeClass('hidden');
				this.find('.selectEditor').jsb().setData(this.requestOpts.select);
				
				this.find('.option.groupBy').removeClass('hidden');
				this.find('.option.groupBy').jsb().setChecked(false);
			} else {
				this.find('.option.select').addClass('hidden');
				this.find('.option.groupBy').addClass('hidden');
			}
			this.find('.option.filter').jsb().setChecked(false);
			this.find('.option.sort').jsb().setChecked(false);
			
			this.find('.option.limit').jsb().setChecked(true);
			this.find('.option.skip').jsb().setChecked(true);
			this.find('.limitEditor').jsb().setData(this.requestOpts.limit);
			this.find('.skipEditor').jsb().setData(this.requestOpts.skip);
			
			this.jsonView.setData();
			this.textView.setData();
			
			$this.ignoreHandlers = false;
			this.updateRequest();
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
		}
		
	},
	
	$server: {
		$require: 'JSB.Workspace.WorkspaceController',
		$bootstrap: function(){
			WorkspaceController.registerBrowserView(null, this, {
				priority: 0,
				acceptNode: ['DataCube.SliceNode'],
				caption: 'API',
				icon: 'data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiIHN0YW5kYWxvbmU9Im5vIj8+DQo8IS0tIEdlbmVyYXRvcjogQWRvYmUgSWxsdXN0cmF0b3IgMTkuMC4wLCBTVkcgRXhwb3J0IFBsdWctSW4gLiBTVkcgVmVyc2lvbjogNi4wMCBCdWlsZCAwKSAgLS0+DQoNCjxzdmcNCiAgIHhtbG5zOmRjPSJodHRwOi8vcHVybC5vcmcvZGMvZWxlbWVudHMvMS4xLyINCiAgIHhtbG5zOmNjPSJodHRwOi8vY3JlYXRpdmVjb21tb25zLm9yZy9ucyMiDQogICB4bWxuczpyZGY9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkvMDIvMjItcmRmLXN5bnRheC1ucyMiDQogICB4bWxuczpzdmc9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIg0KICAgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIg0KICAgeG1sbnM6c29kaXBvZGk9Imh0dHA6Ly9zb2RpcG9kaS5zb3VyY2Vmb3JnZS5uZXQvRFREL3NvZGlwb2RpLTAuZHRkIg0KICAgeG1sbnM6aW5rc2NhcGU9Imh0dHA6Ly93d3cuaW5rc2NhcGUub3JnL25hbWVzcGFjZXMvaW5rc2NhcGUiDQogICB2ZXJzaW9uPSIxLjEiDQogICBpZD0iTGF5ZXJfMSINCiAgIHg9IjBweCINCiAgIHk9IjBweCINCiAgIHZpZXdCb3g9IjAgMCAyNS45OTk5OTkgMjUuOTk5OTk5Ig0KICAgeG1sOnNwYWNlPSJwcmVzZXJ2ZSINCiAgIGlua3NjYXBlOnZlcnNpb249IjAuOTEgcjEzNzI1Ig0KICAgc29kaXBvZGk6ZG9jbmFtZT0icHV6emxlLnN2ZyINCiAgIHdpZHRoPSIyNiINCiAgIGhlaWdodD0iMjYiPjxtZXRhZGF0YQ0KICAgICBpZD0ibWV0YWRhdGE2MSI+PHJkZjpSREY+PGNjOldvcmsNCiAgICAgICAgIHJkZjphYm91dD0iIj48ZGM6Zm9ybWF0PmltYWdlL3N2Zyt4bWw8L2RjOmZvcm1hdD48ZGM6dHlwZQ0KICAgICAgICAgICByZGY6cmVzb3VyY2U9Imh0dHA6Ly9wdXJsLm9yZy9kYy9kY21pdHlwZS9TdGlsbEltYWdlIiAvPjxkYzp0aXRsZT48L2RjOnRpdGxlPjwvY2M6V29yaz48L3JkZjpSREY+PC9tZXRhZGF0YT48ZGVmcw0KICAgICBpZD0iZGVmczU5IiAvPjxzb2RpcG9kaTpuYW1lZHZpZXcNCiAgICAgcGFnZWNvbG9yPSIjZmZmZmZmIg0KICAgICBib3JkZXJjb2xvcj0iIzY2NjY2NiINCiAgICAgYm9yZGVyb3BhY2l0eT0iMSINCiAgICAgb2JqZWN0dG9sZXJhbmNlPSIxMCINCiAgICAgZ3JpZHRvbGVyYW5jZT0iMTAiDQogICAgIGd1aWRldG9sZXJhbmNlPSIxMCINCiAgICAgaW5rc2NhcGU6cGFnZW9wYWNpdHk9IjAiDQogICAgIGlua3NjYXBlOnBhZ2VzaGFkb3c9IjIiDQogICAgIGlua3NjYXBlOndpbmRvdy13aWR0aD0iMTkyMCINCiAgICAgaW5rc2NhcGU6d2luZG93LWhlaWdodD0iMTE3OCINCiAgICAgaWQ9Im5hbWVkdmlldzU3Ig0KICAgICBzaG93Z3JpZD0iZmFsc2UiDQogICAgIGlua3NjYXBlOnpvb209IjE1LjQ4NDkyOSINCiAgICAgaW5rc2NhcGU6Y3g9Ii0zLjgzODM1OCINCiAgICAgaW5rc2NhcGU6Y3k9IjguMDY2NDE2MiINCiAgICAgaW5rc2NhcGU6d2luZG93LXg9IjE5MTIiDQogICAgIGlua3NjYXBlOndpbmRvdy15PSItOCINCiAgICAgaW5rc2NhcGU6d2luZG93LW1heGltaXplZD0iMSINCiAgICAgaW5rc2NhcGU6Y3VycmVudC1sYXllcj0iTGF5ZXJfMSIgLz48Zw0KICAgICBpZD0iZzQxODkiDQogICAgIHRyYW5zZm9ybT0ibWF0cml4KDAuMDUzMjgxNzQsMCwwLDAuMDUzMjgxNzQsLTAuMDI3Mjc1MjIsMjQuNjEwNzY4KSI+PGcNCiAgICAgICB0cmFuc2Zvcm09InRyYW5zbGF0ZSgwLC00NjEuNzAwMDEpIg0KICAgICAgIHN0eWxlPSJmaWxsOiNkNDU1MDA7ZmlsbC1vcGFjaXR5OjEiDQogICAgICAgaWQ9ImczIj48Zw0KICAgICAgICAgc3R5bGU9ImZpbGw6I2Q0NTUwMDtmaWxsLW9wYWNpdHk6MSINCiAgICAgICAgIGlkPSJnNSI+PHBhdGgNCiAgICAgICAgICAgaW5rc2NhcGU6Y29ubmVjdG9yLWN1cnZhdHVyZT0iMCINCiAgICAgICAgICAgc3R5bGU9ImZpbGw6I2Q0NTUwMDtmaWxsLW9wYWNpdHk6MSINCiAgICAgICAgICAgaWQ9InBhdGg3Ig0KICAgICAgICAgICBkPSJtIDQ0OC4xNSwzMjIuOCBjIC05LDggLTIxLjgsNC41IC0yMS44LC0xMS4xIGwgMCwtMzcuNSBjIDAsLTExLjMgLTkuMywtMjAuNiAtMjAuNiwtMjAuNiBsIC0yNi4zLDAgYyAzLDYuMSA0LjYsMTIuNyA0LjYsMTkuMyAwLDIzLjEgLTE4LDQwLjYgLTQyLjgsNDEuNiBsIC0wLjgsMCAtMC44LDAgYyAtMjQuOCwtMSAtNDIuOCwtMTguNSAtNDIuOCwtNDEuNiAwLC02LjcgMS42LC0xMy4zIDQuNiwtMTkuMyBsIC0yNy40LDAgLTAuMSwwIC0wLjQsMCBjIC0xMS4xLDAgLTIwLjIsOSAtMjAuMiwyMC4yIGwgMCwzNy45IGMgMCwxNS42IC0xMywxOSAtMjIsMTEuMSAtMTQuOSwtMTMuMSAtMzcuNiwtNi4xIC0zOC42LDE3LjggMSwyMy45IDIzLjcsMzAuOSAzOC41LDE3LjggOSwtOCAyMi4xLC00LjUgMjIuMSwxMS4xIGwgMCwzNy4xIGMgMCwxMS4xIDksMjAuMiAyMC4yLDIwLjIgbCAzNy42LDAgYyAxNS42LDAgMTksMTMuMSAxMS4xLDIyLjEgLTEzLjEsMTQuOSAtNi4xLDM3LjggMTcuOCwzOC44IDIzLjksLTEgMzAuOSwtMjMuOSAxNy44LC0zOC44IC04LC05IC00LjUsLTIyLjIgMTEuMSwtMjIuMiBsIDM3LjQsMCBjIDExLjEsMCAyMC4yLC05IDIwLjIsLTIwLjIgbCAwLC0zNy4xIGMgMCwtMTUuNiAxMi43LC0xOSAyMS43LC0xMS4xIDE0LjcsMTMuMSAzNy40LDYuMSAzOC40LC0xNy43IC0xLC0yMy45IC0yMy42LC0zMC45IC0zOC41LC0xNy44IHoiIC8+PC9nPjwvZz48Zw0KICAgICAgIHRyYW5zZm9ybT0idHJhbnNsYXRlKDAsLTQ2MS43MDAwMSkiDQogICAgICAgc3R5bGU9ImZpbGw6IzFjNzhjMDtmaWxsLW9wYWNpdHk6MSINCiAgICAgICBpZD0iZzkiPjxnDQogICAgICAgICBzdHlsZT0iZmlsbDojMWM3OGMwO2ZpbGwtb3BhY2l0eToxIg0KICAgICAgICAgaWQ9ImcxMSI+PHBhdGgNCiAgICAgICAgICAgaW5rc2NhcGU6Y29ubmVjdG9yLWN1cnZhdHVyZT0iMCINCiAgICAgICAgICAgc3R5bGU9ImZpbGw6IzFjNzhjMDtmaWxsLW9wYWNpdHk6MSINCiAgICAgICAgICAgaWQ9InBhdGgxMyINCiAgICAgICAgICAgZD0ibSA0NDguMzUsMTI5LjMgYyAtOSw4IC0yMi4yLDQuNSAtMjIuMiwtMTEuMSBsIDAsLTM3LjIgYyAwLC0xMS4xIC05LC0yMC4yIC0yMC4yLC0yMC4yIGwgLTM3LjEsMCBjIC0xNS42LDAgLTE5LC0xMi43IC0xMS4xLC0yMS43IDEzLjEsLTE0LjkgNi4xLC0zNy42IC0xNy44LC0zOC42IC0yMy45LDEgLTMwLjksMjMuNiAtMTcuOCwzOC41IDgsOSA0LjUsMjEuOCAtMTEuMSwyMS44IGwgLTM3LjUsMCBjIC0xMS4zLDAgLTIwLjYsOS4zIC0yMC42LDIwLjYgbCAwLDI2LjMgYyA2LjEsLTMgMTIuNywtNC42IDE5LjMsLTQuNiAyMy4yLDAgNDAuNywxOCA0MS43LDQyLjggbCAwLDAuOCAwLDAuOCBjIC0xLDI0LjggLTE4LjUsNDIuOCAtNDEuNiw0Mi44IC02LjcsMCAtMTMuMywtMS42IC0xOS4zLC00LjYgbCAwLDI3LjQgMCwwLjEgMCwwLjQgYyAwLDExLjEgOSwyMC4yIDIwLjIsMjAuMiBsIDM3LjksMCBjIDE1LjYsMCAxOSwxMyAxMS4xLDIyIC0xMy4xLDE0LjkgLTYuMSwzNy42IDE3LjgsMzguNiAyMy45LC0xIDMwLjksLTIzLjcgMTcuOCwtMzguNSAtOCwtOSAtNC41LC0yMi4xIDExLjEsLTIyLjEgbCAzNy4xLDAgYyAxMS4xLDAgMjAuMiwtOSAyMC4yLC0yMC4yIGwgMCwtMzcuNiBjIDAsLTE1LjYgMTMuMSwtMTkgMjIuMSwtMTEuMSAxNC45LDEzLjEgMzcuOCw2LjEgMzguOCwtMTcuOCAtMSwtMjMuOSAtMjMuOSwtMzAuOSAtMzguOCwtMTcuOCB6IiAvPjwvZz48L2c+PGcNCiAgICAgICB0cmFuc2Zvcm09InRyYW5zbGF0ZSgwLC00NjEuNzAwMDEpIg0KICAgICAgIHN0eWxlPSJmaWxsOiMxYzc4YzA7ZmlsbC1vcGFjaXR5OjEiDQogICAgICAgaWQ9ImcxNSI+PGcNCiAgICAgICAgIHN0eWxlPSJmaWxsOiMxYzc4YzA7ZmlsbC1vcGFjaXR5OjEiDQogICAgICAgICBpZD0iZzE3Ij48cGF0aA0KICAgICAgICAgICBpbmtzY2FwZTpjb25uZWN0b3ItY3VydmF0dXJlPSIwIg0KICAgICAgICAgICBzdHlsZT0iZmlsbDojMWM3OGMwO2ZpbGwtb3BhY2l0eToxIg0KICAgICAgICAgICBpZD0icGF0aDE5Ig0KICAgICAgICAgICBkPSJtIDIxNC40NSwyNTMuMyAtMzcuOSwwIGMgLTE1LjYsMCAtMTksLTEzIC0xMS4xLC0yMiAxMy4xLC0xNC45IDYuMSwtMzcuNiAtMTcuOCwtMzguNiAtMjMuOSwxIC0zMC45LDIzLjcgLTE3LjgsMzguNSA4LDkgNC41LDIyLjEgLTExLjEsMjIuMSBsIC0zNy4xLDAgYyAtMTEuMSwwIC0yMC4yLDkgLTIwLjIsMjAuMiBsIDAsMzcuNiBjIDAsMTUuNiAtMTMuMSwxOSAtMjIuMSwxMS4xIC0xNC45LC0xMy4xIC0zNy44LC02LjEgLTM4LjgsMTcuOCAwLjksMjMuNyAyMy45LDMwLjcgMzguNywxNy42IDksLTggMjIuMiwtNC41IDIyLjIsMTEuMSBsIDAsMzcuNCBjIDAsMTEuMSA5LDIwLjIgMjAuMiwyMC4yIGwgMzcuMSwwIGMgMTUuNiwwIDE5LDEyLjcgMTEuMSwyMS43IC0xMy4xLDE0LjkgLTYuMSwzNy42IDE3LjgsMzguNiAyMy45LC0xIDMwLjksLTIzLjYgMTcuOCwtMzguNSAtOCwtOSAtNC41LC0yMS44IDExLjEsLTIxLjggbCAzNy41LDAgYyAxMS4zLDAgMjAuNiwtOS4zIDIwLjYsLTIwLjYgbCAwLC0yNi4zIGMgLTYuMSwzIC0xMi43LDQuNiAtMTkuMyw0LjYgLTIzLjEsMCAtNDAuNiwtMTggLTQxLjYsLTQyLjggbCAwLC0wLjggMCwtMC44IGMgMSwtMjQuOCAxOC41LC00Mi44IDQxLjYsLTQyLjggNi43LDAgMTMuMywxLjYgMTkuMyw0LjYgbCAwLC0yNy40IDAsLTAuMSAwLC0wLjQgYyAwLC0xMS4xIC05LC0yMC4yIC0yMC4yLC0yMC4yIHoiIC8+PC9nPjwvZz48Zw0KICAgICAgIHRyYW5zZm9ybT0idHJhbnNsYXRlKDAsLTQ2MS43MDAwMSkiDQogICAgICAgc3R5bGU9ImZpbGw6IzE4NjQ5ZjtmaWxsLW9wYWNpdHk6MSINCiAgICAgICBpZD0iZzIxIj48Zw0KICAgICAgICAgc3R5bGU9ImZpbGw6IzE4NjQ5ZjtmaWxsLW9wYWNpdHk6MSINCiAgICAgICAgIGlkPSJnMjMiPjxwYXRoDQogICAgICAgICAgIGlua3NjYXBlOmNvbm5lY3Rvci1jdXJ2YXR1cmU9IjAiDQogICAgICAgICAgIHN0eWxlPSJmaWxsOiMxODY0OWY7ZmlsbC1vcGFjaXR5OjEiDQogICAgICAgICAgIGlkPSJwYXRoMjUiDQogICAgICAgICAgIGQ9Im0gMjU2LjQ1LDEyOS4yIGMgLTksOCAtMjIuMSw0LjUgLTIyLjEsLTExLjEgbCAwLC0zNyBjIDAsLTExLjEgLTksLTIwLjIgLTIwLjIsLTIwLjIgbCAtMzcuNiwwIGMgLTE1LjYsMCAtMTksLTEzLjEgLTExLjEsLTIyLjEgMTMuMSwtMTQuOSA2LjEsLTM3LjggLTE3LjgsLTM4LjggLTIzLjksMSAtMzAuOSwyMy45IC0xNy44LDM4LjggOCw5IDQuNSwyMi4yIC0xMS4xLDIyLjIgbCAtMzcuMiwwIGMgLTExLjEsMCAtMjAuMiw5IC0yMC4yLDIwLjIgbCAwLDM3LjEgYyAwLDE1LjYgLTEyLjcsMTkgLTIxLjcsMTEuMSAtMTQuOSwtMTMuMSAtMzcuNiwtNi4xIC0zOC42LDE3LjggMSwyMy43IDIzLjYsMzAuNyAzOC41LDE3LjYgOSwtOCAyMS44LC00LjUgMjEuOCwxMS4xIGwgMCwzNy41IGMgMCwxMS4zIDkuMywyMC42IDIwLjYsMjAuNiBsIDI2LjMsMCBjIC0zLC02LjEgLTQuNiwtMTIuNyAtNC42LC0xOS4zIDAsLTIzLjEgMTgsLTQwLjYgNDIuOCwtNDEuNiBsIDAuOCwwIDAuOCwwIGMgMjQuOCwxIDQyLjgsMTguNSA0Mi44LDQxLjYgMCw2LjcgLTEuNiwxMy4zIC00LjYsMTkuMyBsIDI3LjQsMCAwLjEsMCAwLjQsMCBjIDExLjEsMCAyMC4yLC05IDIwLjIsLTIwLjIgbCAwLC0zNy45IGMgMCwtMTUuNiAxMywtMTkgMjIsLTExLjEgMTQuOSwxMy4xIDM3LjYsNi4xIDM4LjYsLTE3LjggLTEsLTIzLjkgLTIzLjcsLTMwLjkgLTM4LjUsLTE3LjggeiIgLz48L2c+PC9nPjwvZz48Zw0KICAgICBpZD0iZzI3Ig0KICAgICB0cmFuc2Zvcm09InRyYW5zbGF0ZSgwLC00NjEuNzAwMDEpIiAvPjxnDQogICAgIGlkPSJnMjkiDQogICAgIHRyYW5zZm9ybT0idHJhbnNsYXRlKDAsLTQ2MS43MDAwMSkiIC8+PGcNCiAgICAgaWQ9ImczMSINCiAgICAgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoMCwtNDYxLjcwMDAxKSIgLz48Zw0KICAgICBpZD0iZzMzIg0KICAgICB0cmFuc2Zvcm09InRyYW5zbGF0ZSgwLC00NjEuNzAwMDEpIiAvPjxnDQogICAgIGlkPSJnMzUiDQogICAgIHRyYW5zZm9ybT0idHJhbnNsYXRlKDAsLTQ2MS43MDAwMSkiIC8+PGcNCiAgICAgaWQ9ImczNyINCiAgICAgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoMCwtNDYxLjcwMDAxKSIgLz48Zw0KICAgICBpZD0iZzM5Ig0KICAgICB0cmFuc2Zvcm09InRyYW5zbGF0ZSgwLC00NjEuNzAwMDEpIiAvPjxnDQogICAgIGlkPSJnNDEiDQogICAgIHRyYW5zZm9ybT0idHJhbnNsYXRlKDAsLTQ2MS43MDAwMSkiIC8+PGcNCiAgICAgaWQ9Imc0MyINCiAgICAgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoMCwtNDYxLjcwMDAxKSIgLz48Zw0KICAgICBpZD0iZzQ1Ig0KICAgICB0cmFuc2Zvcm09InRyYW5zbGF0ZSgwLC00NjEuNzAwMDEpIiAvPjxnDQogICAgIGlkPSJnNDciDQogICAgIHRyYW5zZm9ybT0idHJhbnNsYXRlKDAsLTQ2MS43MDAwMSkiIC8+PGcNCiAgICAgaWQ9Imc0OSINCiAgICAgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoMCwtNDYxLjcwMDAxKSIgLz48Zw0KICAgICBpZD0iZzUxIg0KICAgICB0cmFuc2Zvcm09InRyYW5zbGF0ZSgwLC00NjEuNzAwMDEpIiAvPjxnDQogICAgIGlkPSJnNTMiDQogICAgIHRyYW5zZm9ybT0idHJhbnNsYXRlKDAsLTQ2MS43MDAwMSkiIC8+PGcNCiAgICAgaWQ9Imc1NSINCiAgICAgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoMCwtNDYxLjcwMDAxKSIgLz48L3N2Zz4='
			});
		},
	}
}