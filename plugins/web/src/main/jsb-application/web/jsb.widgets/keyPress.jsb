{
	$name:'JSB.KeyPress',
	$client: {
		$singleton: true,
		$constructor: function(){
			var self = this;
			$jsb.loadScript('keypress.js');
			
			JSB().waitForObjectExist('window.keypress',function(){
				self.init();
			});
		},
		
		init: function(){
			
		}
	}
}