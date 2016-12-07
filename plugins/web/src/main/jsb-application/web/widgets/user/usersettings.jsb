JSB({
	name: 'UserLogout',
	parent: 'UserMenuItem',
	require: {
	},
	expose: {
		path: 'User/Menu',
		displayName: 'Выход',
		order: 1000,
		group: 'exit'
	},
	client: {
		constructor: function(){
		},
		execute: function(){
			var self = this;
			var serverBase = JSO().getProvider().getServerBase();
			JSO().getProvider().ajax(serverBase + 'logout', {mode: 'json'}, function(status, res){
				self.publish('userLogout');
			});
		}
	},
	
	server: {}
});


JSB({
	name: 'UserSettings',
	parent: 'JSB.Widgets.Widget',
	require: {},
	expose: {
		path: 'User/Menu',
		displayName: 'Настройки',
		order: 999,
		group: 'settings',
		renew:true
	},
	client: {
		constructor: function(opts){
			var self = this;
			$base(opts);
			this.getElement().addClass('userSettings');

			this.append(#dot{{
				<style>
					.userSettings {
						width: 306px;
						color: #858585;
    					font-size: 14px;
				    	height: 220px;
					}
					.userSettings .row dwp-control {
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
					<dwp-control jso="JSB.Widgets.PrimitiveEditor" readonly="true"></dwp-control>
				</div>

				<div class="row name">
					<dwp-control jso="JSB.Widgets.PrimitiveEditor" placeholder="Ваше имя"></dwp-control>
				</div>

				<div class="row pass oldpass">
					<dwp-control jso="JSB.Widgets.PrimitiveEditor" placeholder="Текущий пароль" password=true></dwp-control>
				</div>
				<div class="row pass newpass">
					<dwp-control jso="JSB.Widgets.PrimitiveEditor" placeholder="Новый пароль" password=true></dwp-control>
				</div>
				<div class="row pass newpass2">
					<dwp-control jso="JSB.Widgets.PrimitiveEditor" placeholder="Подтверждение пароля" password=true></dwp-control>
				</div>

				<dwp-control class="apply" jso="JSB.Widgets.Button" caption="Применить" click="{{=this.callbackAttr(function(evt){ self.applyChanges(); })}}"></dwp-control>
			}});

			this.server().getAttributes(function(attrs){
				JSB().deferUntil(function(){
					self.attrs = attrs;
					self.find('.email>dwp-control').jso().setData(attrs.email||attrs.login);
					self.find('.name>dwp-control').jso().setData(attrs.name||'');
				}, function(){
					return self.find('.email>dwp-control').jso() && self.find('.name>dwp-control').jso(); 
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
					return JSO().MD5.md5(self.attrs.login + '@' + p);
				return null;
			}
			var name = this.find('.name>dwp-control').jso().getData().getValue();
			var oldpass = this.find('.oldpass>dwp-control').jso().getData().getValue();
			var newpass = this.find('.newpass>dwp-control').jso().getData().getValue();
			var newpass2 = this.find('.newpass2>dwp-control').jso().getData().getValue();

			var changed = name.length > 0 && name !== this.attrs.name  ||  newpass.length > 0 || newpass2.length > 0;
			if (changed) {
				if (oldpass.length == 0) {
					this.find('.oldpass>dwp-control').jso().setMark(true);
					return;
				}

				if (newpass !== newpass2) {
					this.find('.newpass2>dwp-control').jso().setMark(true);
					return;
				}

				this.server().storeChanges({name: name, hash: passhash(newpass)}, passhash(oldpass), function(result){
					if (result.success === true) {
						self.publish('userMenuClose');
					} else if(result.error === 'wrongpass') {
						self.find('.oldpass>dwp-control').jso().setMark(true);
						return;
					} else {
						alert('Произошла ошибка сохранения изменений, попробуйте повторить');
					}
				});
			}
		}
	},

	server: {
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
});

/*
JSO({
	name: 'MyPurchase',
	parent: 'JSB.Widgets.Widget',
	require: {
	},
	
	expose: {
		path: 'User/Menu',
		displayName: 'Мои покупки',
		order: 100,
		group: 'shop'
	}, 
	client: {
		constructor: function(opts){
			var self = this;
			$base(opts);

			this.append(#dot{{
				<dwp-control jso="JSB.Widgets.Button" caption="Close" click="{{=this.callbackAttr(function(evt){ self.doClose(); })}}"></dwp-control>
			}});
		},
		body: {
			doClose: function(){
				this.publish('userMenuClose');
			}
		}	
	},
	
	server: {
		body: {
		}
	}
});
*/