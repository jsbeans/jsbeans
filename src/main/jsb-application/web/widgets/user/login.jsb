/*
 * This file is the part of jsBeans, high-level JavaScript client-server framework.
 * The contents of this file are subject to the MIT License (MIT).
 * (c) aa@sis.ru, da@sis.ru, Special Information Systems, LLC, 2011-2019
 *
 * Настоящий файл является частью клиент-серверной JavaScript платформы.
 * Условия использования и распространения содержимого данного файла соответствуют программному обеспечению с открытыми исходными кодами и равнозначно MIT License (MIT).
 * Авторские права принадлежат aa@sis.ru, da@sis.ru, ООО СИС, 2011-2019гг.
 */

{
	$name: 'Login',
	$parent: 'JSB.Widgets.Control',
	$require: {
		Button: 'JSB.Widgets.Button',
		TextEditor: 'JSB.Widgets.PrimitiveEditor',
		'MD5': 'JSB.Crypt.MD5',
		'css':'css:login.css'
	},
	$client: {
		$constructor: function(opts){
			var self = this;
			$base(opts);
			this.getElement().addClass('loginForm');
			
			this.getElement().css({
				display: 'none'
			});
			
			if(this.options.container){
				this.$(this.options.container).append(this.getElement());
			}
			// construct
			this.loginElt = new TextEditor({
				placeholder: 'имя пользователя',
				onChange: function(str, evt){
					if(evt && evt.which && evt.which == 13){
						self.passElt.setFocus();
						self.passElt.select();
					} else {
						if(self.lastUser != str.trim()){
							self.clearErrors();
						}
						self.checkFields();
					}
				}
			});
			this.passElt = new TextEditor({
				placeholder: 'пароль',
				password: true,
				onChange: function(str, evt){
					if(evt && evt.which && evt.which == 13){
						self.doLogin();
					} else {
						if(self.lastPass != str.trim()){
							self.clearErrors();
						}
						self.checkFields();
					}
				}
			});
			this.postBtn = new Button({
				caption: 'Войти',
				onClick: function(){
					self.doLogin();
				}
			});
			this.postBtn.enable(false);
			this.messageElt = this.$('<div class="message"></div>');
			this.messageElt.addClass('hidden');
			this.getElement().append('<div class="logo"></div>');
			var cookieLabel = this.$('<label class="cookieLabel">запомнить меня</label>');
			this.cookieCheckBox = this.$('<input type="checkbox" checked>');
			cookieLabel.prepend(this.cookieCheckBox);
			this.getElement().append(this.$('<div class="fields"></div>')
					.append(this.loginElt.getElement())
					.append(this.passElt.getElement())
					.append(cookieLabel));
			this.getElement().append(this.$('<div class="btnContainer"></div>')
					.append(this.messageElt)
					.append(this.postBtn.getElement()));
			
			this.loginElt.setFocus();
		},
		
		checkFields: function(){
			var b = this.loginElt.getData().getValue().trim().length > 0
				&& this.passElt.getData().getValue().trim().length > 0;
			this.postBtn.enable(b);
			return b;
		},
		
		sayNoNoNo: function(){
			var self = this;
			this.getElement().animate({'margin-left':'-=100'},100);
			this.getElement().animate({'margin-left':'+=200'},100);
			this.getElement().animate({'margin-left':'-=200'},100);
			this.getElement().animate({'margin-left':'+=200'},100);
			this.getElement().animate({'margin-left':'-=100'},100, function(){
			});
		},
		
		clearErrors: function(){
			this.loginElt.setMark(false);
			this.passElt.setMark(false);
			this.messageElt.addClass('hidden');
		},
		
		doLogin: function(){
			var self = this;
			if(!this.checkFields()){
				return;
			}
			
			var serverBase = JSB().getProvider().getServerBase();
			
			// proceed hash authentication
			this.lastUser = this.loginElt.getData().getValue().trim();
			this.lastPass = this.passElt.getData().getValue().trim();
			var hash = MD5.md5(this.lastUser + '@' + this.lastPass);
			
			JSB().getProvider().ajax(serverBase + 'login', {
				mode: 'json',
				user: this.lastUser,
				hash: hash,
				target: 'web',
				cookie: this.cookieCheckBox.prop('checked')
			}, function(status, res){
				
				if(status !== 'success'){
					// not authenticated
					self.messageElt.empty();
					self.messageElt.append('Ошибка входа.<br>Неверно указано имя пользователя или пароль.');
					self.messageElt.removeClass('hidden');
					self.loginElt.setMark(true);
					self.passElt.setMark(true);
					self.loginElt.setFocus();
					self.loginElt.select();
					self.sayNoNoNo();
				} else {
					// its ok
					if(self.options.onSuccess){
						self.options.onSuccess.call(self, res.token);
					}
				}
				
			});
		},
		
		show: function(b){
			var self = this;
			if(JSB().isNull(b)){
				b = true;
			}
			if(b){
				this.getElement().fadeIn(function(){
					self.loginElt.setFocus();
				});
			} else {
				this.getElement().fadeOut();
			}
		}
	}
}