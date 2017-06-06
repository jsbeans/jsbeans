{
	$name: 'JSB.Tests.MsgTest',
	
	$constructor: function(){
		$base();
		
		this.subscribe('test1', function(sender, msg, params){
			$jsb.getLogger().info('Message from: ' + sender.getJsb().$name + '(' + sender.getId() + '): ' + msg);
			
			return 'ok';
		});
		
		this.subscribe('test2', function(sender, msg, params){
			$jsb.getLogger().info('Message from: ' + sender.getJsb().$name + '(' + sender.getId() + '): ' + msg);
		});

		this.subscribe('test3', {session:true}, function(sender, msg, params){
			$jsb.getLogger().info('Message from: ' + sender.getJsb().$name + '(' + sender.getId() + '): ' + msg);
		});

		this.subscribe('test4', {session:true}, function(sender, msg, params){
			$jsb.getLogger().info('Message from: ' + sender.getJsb().$name + '(' + sender.getId() + '): ' + msg);
			
			return 'ok';
		});

	}
	
}