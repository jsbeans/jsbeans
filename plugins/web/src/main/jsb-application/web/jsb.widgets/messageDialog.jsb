{
	$name:'JSB.MessageDialog',
	$client: {
		$singleton: true,
		$constructor: function(){
//			this.loadCss('messagedialog.css');
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