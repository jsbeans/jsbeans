{
	$name: 'JSB.DataCube.SqlSourceView',
	$parent: 'JSB.Workspace.BrowserView',
	
	$client: {
		$require: 'JSB.Widgets.SplitLayoutManager',
		ready: false,
		ignoreHandlers: false,
		
		$constructor: function(opts){
			$base(opts);
			
			this.loadCss('SqlSourceView.css');
			this.addClass('sqlSourceView');
			
			// create dialog
			this.append(`#dot
				<div jsb="JSB.Widgets.ScrollBox">
					<div jsb="JSB.Widgets.GroupBox" caption="Настройки соединения" class="connectionSettings">
						<div class="option connectionString">
							<div class="icon"></div>
							<div class="editor" jsb="JSB.Widgets.PrimitiveEditor" placeholder="Строка соединения"
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
						
						<div class="option buttons">
							<div jsb="JSB.Widgets.Button" class="roundButton btnOk btn16" caption="Проверить соединение"
								onclick="{{=this.callbackAttr(function(evt){$this.testConnection()})}}"></div>
							<div class="message"></div>
						</div>
					</div>
					
					<div jsb="JSB.Widgets.GroupBox" caption="Схема базы" class="scheme">
						<div class="option buttons">
							<div jsb="JSB.Widgets.Button" class="roundButton btn16 btnLoadScheme" caption="Загрузить схему"
								onclick="{{=this.callbackAttr(function(evt){$this.extractScheme()})}}"></div>
							<div class="status">
								<div class="icon"></div>
								<div class="message"></div>
							</div>
						</div>
						<div class="option details"></div>
					</div>
				</div>
			`);
			
			this.subscribe('DataCube.Model.SqlSource.extractScheme', {session: true}, function(sender, msg, params){
				if(sender != $this.node.getEntry()){
					return;
				}
				$this.updateSchemeStatus(params.status);
			});
			
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
			this.find('.connectionSettings .message').text('');
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
			this.find('.btnOk').jsb().enable(bEnable);
			this.find('.btnLoadScheme').jsb().enable(bEnable);
		},
		
		testConnection: function(){
			var settings = $this.collectSettings();
			var entry = $this.node.getEntry();
			entry.server().testConnection(settings, function(res, fail){
				if(fail){
					$this.find('.connectionSettings .message').addClass('fail').removeClass('ok').text(fail.message);
				} else {
					$this.find('.connectionSettings .message').addClass('ok').removeClass('fail').text('Соединение установлено');
				}
			});
		},
		
		fillDetails: function(details){
			$this.find('.scheme .details').empty();
			if(!details || !details.updated){
				$this.find('.scheme .status').addClass('fail').removeClass('progress').removeClass('ok');
				$this.find('.scheme .status > .message').text('Схема не загружена');
				$this.find('.btnLoadScheme > ._dwp_caption').text('Загрузить схему');
				return;
			}
			$this.find('.scheme .status').addClass('ok').removeClass('progress').removeClass('fail');
			$this.find('.btnLoadScheme > ._dwp_caption').text('Обновить схему');
			
			$this.find('.scheme .status > .message').text('Обновлено: ' + new Date(details.updated).toLocaleString());
			$this.find('.scheme .details').append('Схем: <span class="count">' + details.schemes + '</span>; таблиц: <span class="count">' + details.tables + '</span>; столбцов: <span class="count">' + details.columns + '</span>');
		},
		
		extractScheme: function(){
			var entry = $this.node.getEntry();
			entry.server().extractScheme(function(details, fail){
				if(fail){
					$this.find('.scheme .status').addClass('fail').removeClass('progress').removeClass('ok');
					$this.find('.scheme .status > .message').text(fail.message);
					return;
				}
				$this.fillDetails(details);
			});
		},
		
		updateSchemeStatus: function(status){
			$this.find('.scheme .status').addClass('progress').removeClass('fail').removeClass('ok');
			$this.find('.scheme .status > .message').text(status);
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
				$this.updateButtons();
			});
			entry.server().getDetails(function(details){
				$this.fillDetails(details);
			});
		}
		
	},
	
	$server: {
		$require: 'JSB.Workspace.WorkspaceController',
		$bootstrap: function(){
			WorkspaceController.registerBrowserView(this, {
				wmKey: 'datacube',
				priority: 1,
				acceptNode: 'JSB.DataCube.SqlSourceNode',
				caption: 'Настройки'
			});
		},
	}
}