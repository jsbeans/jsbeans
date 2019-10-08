/*
 * This file is the part of jsBeans, high-level JavaScript client-server framework.
 * The contents of this file are subject to the MIT Licence (MIT).
 * (c) aa@sis.ru, da@sis.ru, Special Information Systems, LLC, 2011-2019
 *
 * Настоящий файл является частью клиент-серверной JavaScript платформы.
 * Условия использования и распространения содержимого данного файла соответствуют программному обеспечению с открытыми исходными кодами и равнозначно MIT Licence (MIT).
 * Авторские права принадлежат aa@sis.ru, da@sis.ru, ООО СИС, 2011-2019гг.
 */

{
	$name:'JSB.MessageDialog',
	$client: {
		$singleton: true,
		$constructor: function(){
		},
		
		/* vars */
		dlg: null,
		
		/* methods */
		show: function(caption, textBody){
			var self = this;
			if(this.dlg == null){
				this.dlg = this.$('<div class="_dwp_messageDialog"></div>');
				this.body = this.$('<p class="messageBody"></p>');
				this.dlg.append(this.body);
				this.dlg.css('display', 'none');
				
				this.$('body').prepend(this.dlg);

				this.dlg.attr('title', caption);
				this.dlg.dialog({
					autoOpen: false,
					modal: true,
					resizable: false,
					buttons: {
						'Ok': function(){
							self.$(this).dialog('close');
						}
					}
				});
			}
			this.body.html(textBody);
			this.dlg.dialog('open');
		}
	}
}