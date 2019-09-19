{
	$name: 'JSB.Tests.RootTestItem',
	
	$constructor: function(str){
		debugger;
		$base();
		JSB.getLogger().info('' + str + ':' + JSB.getCurrentSession());
	}
}