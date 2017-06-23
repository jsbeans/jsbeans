{
	$name: 'UserSettings',
	$parent: 'JSB.Widgets.Widget',

	expose: {
		path: 'User/Menu',
		displayName: 'Настройки',
		order: 999,
		group: 'settings',
		renew:true
	},
	$client: {
		$constructor: function(opts){
			var self = this;
			$base(opts);
			this.getElement().addClass('userSettings');

			this.append(`#dot
				<style>
					.userSettings {
						width: 306px;
						color: #858585;
    					font-size: 14px;
				    	height: 220px;
					}
					.userSettings .row > div {
						display: block;
						height: 26px;
						margin: 8px 12px 8px 6px;
					}
					.userSettings .apply {
						float: right;
						margin: 6px 12px 6px 6px;
					}

				</style>

				<div class="row email">
					<div jsb="JSB.Widgets.PrimitiveEditor" readonly="true"></div>
				</div>

				<div class="row name">
					<div jsb="JSB.Widgets.PrimitiveEditor" placeholder="Ваше имя"></div>
				</div>

				<div class="row pass oldpass">
					<div jsb="JSB.Widgets.PrimitiveEditor" placeholder="Текущий пароль" password=true></div>
				</div>
				<div class="row pass newpass">
					<div jsb="JSB.Widgets.PrimitiveEditor" placeholder="Новый пароль" password=true></div>
				</div>
				<div class="row pass newpass2">
					<div jsb="JSB.Widgets.PrimitiveEditor" placeholder="Подтверждение пароля" password=true></div>
				</div>

				<div class="apply" jsb="JSB.Widgets.Button" caption="Применить" onclick="{{=this.callbackAttr(function(evt){ self.applyChanges(); })}}"></div>
			`);

			this.server().getAttributes(function(attrs){
				JSB().deferUntil(function(){
					self.attrs = attrs;
					self.find('.email>div').jsb().setData(attrs.email||attrs.login);
					self.find('.name>div').jsb().setData(attrs.name||'');
				}, function(){
					return self.find('.email>div').jsb() && self.find('.name>div').jsb(); 
				});
			});
		},
		
		behavior: {
			allowResize: {
				horizontal: false,
				vertical: false
			},
			dimensions: {
				defaultWidth: 300,
				defaultHeight: 220
			}
		},

		applyChanges: function(){
			var self = this;
			function passhash(p) {
				if (p && p.length > 0)
					return JSB().MD5.md5(self.attrs.login + '@' + p);
				return null;
			}
			var name = this.find('.name>div').jsb().getData().getValue();
			var oldpass = this.find('.oldpass>div').jsb().getData().getValue();
			var newpass = this.find('.newpass>div').jsb().getData().getValue();
			var newpass2 = this.find('.newpass2>div').jsb().getData().getValue();

			var changed = name.length > 0 && name !== this.attrs.name  ||  newpass.length > 0 || newpass2.length > 0;
			if (changed) {
				if (oldpass.length == 0) {
					this.find('.oldpass>div').jsb().setMark(true);
					return;
				}

				if (newpass !== newpass2) {
					this.find('.newpass2>div').jsb().setMark(true);
					return;
				}

				this.server().storeChanges({name: name, hash: passhash(newpass)}, passhash(oldpass), function(result){
					if (result.success === true) {
						self.publish('userMenuClose');
					} else if(result.error === 'wrongpass') {
						self.find('.oldpass>div').jsb().setMark(true);
						return;
					} else {
						alert('Произошла ошибка сохранения изменений, попробуйте повторить');
					}
				});
			}
		}
	},

	$server: {
		$require: 'JSB.System.Kernel',
		
		getAttributes: function(){
			var json = Auth.getUserCredentials(Kernel.user()).result.response;

			return {
				login: Kernel.user(),
				email: json.email,
				name: json.name,
			};
		},

		storeChanges: function(attrs, oldhash) {
			var creds = {};
			if (attrs.hash) creds.hash = attrs.hash;
			if (attrs.name) creds.name = attrs.name;

			try {
				var hash = Auth.getUserCredentials(Kernel.user()).result.response.hash;
				if(hash.toUpperCase() === oldhash.toUpperCase()) {
					var  result = Auth.setUserCredentials(Kernel.user(), creds);
					if (result.errorMsg) throw result.errorMsg;
					return {success: true};
				} else {
					return {success: false, error: 'wrongpass'};
				}
			} catch(e) {
				return {success: false, error: 'unknown'};
			}
		}
	}
}