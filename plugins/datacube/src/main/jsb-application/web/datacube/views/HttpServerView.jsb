{
	$name: 'JSB.DataCube.HttpServerView',
	$parent: 'JSB.Workspace.BrowserView',
	
	$client: {
		$require: 'JSB.Widgets.SplitLayoutManager',
		ready: false,
		ignoreHandlers: false,
		
		$constructor: function(opts){
			$base(opts);
			
			this.loadCss('HttpServerView.css');
			this.addClass('httpServerView');
			
			// create dialog
			this.append(`#dot
				<div jsb="JSB.Widgets.ScrollBox">
					<div jsb="JSB.Widgets.GroupBox" caption="Настройки соединения" class="connectionSettings">
						<div class="option connectionString">
							<div class="icon"></div>
							<div class="editor" jsb="JSB.Widgets.PrimitiveEditor" placeholder="Адрес сервера"
								onchange="{{=this.callbackAttr(function(val){$this.updateSettings()})}}"></div>
						</div>
						
						<div class="option user">
							<div class="icon"></div>
							<div class="editor" jsb="JSB.Widgets.PrimitiveEditor" placeholder="Имя пользователя"
								onchange="{{=this.callbackAttr(function(val){$this.updateSettings()})}}"></div>
						</div>
						
						<div class="option password">
							<div class="icon"></div>
							<div class="editor" jsb="JSB.Widgets.PrimitiveEditor" placeholder="Пароль" password="true"
								onchange="{{=this.callbackAttr(function(val){$this.updateSettings()})}}"></div>
						</div>
					</div>
				</div>
			`);
			
			JSB.deferUntil(function(){
				$this.ready = true;
			}, function(){
				return $this.isContentReady();
			});
		},
		
		collectSettings: function(){
			return {
				url: this.find('.connectionString > .editor').jsb().getData().getValue(),
				properties: {
					user: this.find('.user > .editor').jsb().getData().getValue(),
					password: this.find('.password > .editor').jsb().getData().getValue()
				}
			};
		},
		
		fillSettings: function(settings){
			$this.ignoreHandlers = true;
			this.find('.connectionString > .editor').jsb().setData(settings && settings.url ? settings.url : '');
			this.find('.user > .editor').jsb().setData(settings && settings.properties && settings.properties.user ? settings.properties.user : '');
			this.find('.password > .editor').jsb().setData(settings && settings.properties && settings.properties.password ? settings.properties.password : '');
			$this.ignoreHandlers = false;
		},
		
		updateSettings: function(){
			$this.updateButtons();
			if($this.ignoreHandlers){
				return;
			}
			JSB.defer(function(){
				var settings = $this.collectSettings();
				var entry = $this.node.getEntry();
				entry.server().updateSettings(settings);
			}, 300, 'updateSettings_' + this.getId());
			
		},
		
		updateButtons: function(){
			var bEnable = this.find('.connectionString > .editor').jsb().getData().getValue().trim().length > 0;
		},
		
		refresh: function(){
			if(!this.ready){
				JSB.deferUntil(function(){
					$this.refresh();
				}, function(){
					return $this.ready;
				});
				return;
			}
			var entry = this.node.getEntry();
			entry.server().getSettings(function(settings){
				$this.fillSettings(settings);
			});
		}
		
	},
	
	$server: {
		$require: 'JSB.Workspace.WorkspaceController',
		$bootstrap: function(){
			WorkspaceController.registerBrowserView(this, {
				wmKey: 'datacube',
				priority: 1,
				acceptNode: 'JSB.DataCube.HttpServerNode',
				caption: 'Настройки'
			});
		},
	}
}