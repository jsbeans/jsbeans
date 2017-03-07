{
	name:'JSB.KeyPress',
	group: 'dwp',
	client: {
		singleton: true,
		constructor: function(){
			var self = this;
			this.loadScript('keypress.js');
			
			JSO().waitForObjectExist('window.keypress',function(){
				self.init();
			});
		},
		
		init: function(){
			
		}
	}
}