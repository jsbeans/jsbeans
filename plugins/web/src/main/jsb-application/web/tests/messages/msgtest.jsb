{
	$name: 'JSB.Tests.MsgTest',
	$fixedId: true,
	
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
		
		this.subscribe('test5', {cluster:true}, function(sender, msg, params){
			$jsb.getLogger().info('Message from: ' + sender.getJsb().$name + '(' + sender.getId() + '): ' + msg);
			
			return 'ok';
		});

		this.subscribe('test6', {session:true, cluster:true}, function(sender, msg, params){
			$jsb.getLogger().info('Message from: ' + sender.getJsb().$name + '(' + sender.getId() + '): ' + msg);
			
			if(JSB.isClient()){
				return 'ok from client';
			} else {
				return 'ok from ' + Cluster.getNodeAddress();
			}
		});

	}
	
}