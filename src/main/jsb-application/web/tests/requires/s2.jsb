/*{
	$name: 'JSB.Tests.Requires.SimpleBean1',
	$require: 'JSB.Tests.Requires.Singleton1',
	
	$constructor: function(){
		$base();
		JSB.getLogger().info('Constructor from ' + this.getJsb().$name);
	},
	
	test: function(){
		Singleton1.test();
		JSB.getLogger().info('Hi from ' + this.getJsb().$name);
	}
	
}*/