{
	$name: 'JSB.Tests.ClusterTest',
	$fixedId: true,
	
	$constructor: function(){
		$base();
	},
	
	test1: function(arg1, arg2){
		JSB.getLogger().debug(Cluster.getNodeAddress() + ': test1: ' + JSON.stringify(arg1) + '; ' + JSON.stringify(arg2));
		return arg1;
	},
	
	test2: function(arg1, arg2){
		JSB.getLogger().debug(Cluster.getNodeAddress() + ': test2: ' + JSON.stringify(arg1) + '; ' + JSON.stringify(arg2));
		throw new Error('raise exception');
	},
	
	test3: function(){
		this.subscribe('clusterMessage', {
			cluster: true
		}, function(sender, msg, params){
			debugger;
		})
	}

	
}