{
	$name:'JSB.KeyPress',
	$client: {
		$singleton: true,
		$require: ['script:keypress.js'],
		
		$constructor: function(){
			var self = this;
			
			JSB().waitForObjectExist('window.keypress',function(){
				self.init();
			});
		},
		
		init: function(){
			
		}
	}
}