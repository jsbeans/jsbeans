/*{
	$name: 'JSB.Tests.Requires.Singleton1',
	$singleton: true,
	$require: 'JSB.Tests.Requires.SimpleBean1',
	
	$constructor: function(){
		$base();
		JSB.getLogger().info('Constructor from ' + this.getJsb().$name);
	},
	
	test: function(){
		JSB.getLogger().info('Hi from ' + this.getJsb().$name);
	}
	
}*/