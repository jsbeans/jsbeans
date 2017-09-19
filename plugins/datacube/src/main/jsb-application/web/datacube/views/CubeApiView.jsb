{
	$name: 'DataCube.CubeApiView',
	$parent: 'JSB.Workspace.BrowserView',
	
	$client: {
		$require: ['JSB.Widgets.SplitBox', 'JSB.Widgets.TabView', 'JsonView', 'JSB.Widgets.ScrollBox', 'JSB.Widgets.MultiEditor'],
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
			
			this.loadCss('CubeApiView.css');
			this.addClass('cubeApiView');
			
			var splitBox = new SplitBox({
				type: 'vertical',
				position: 0.5
			});
			this.append(splitBox);
			splitBox.addToPane(0, `#dot
				<div class="leftScroll" jsb="JSB.Widgets.ScrollBox">
					<div jsb="JSB.Widgets.GroupBox" caption="Идентификация куба" class="cubeSettings">
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
			var wid = entry.workspace.getLocalId();
			var eid = entry.getLocalId();
			
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
			var wid = entry.workspace.getLocalId();
			var eid = entry.getLocalId();
			
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
			WorkspaceController.registerBrowserView(this, {
				wmKey: 'datacube',
				priority: 0,
				acceptNode: ['DataCube.CubeNode', 'DataCube.SliceNode'],
				caption: 'API'
			});
		},
	}
}