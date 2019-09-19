{
	$name: 'JSB.Tests.RootTestManager',
	$singleton: true,
	$require: 'JSB.Tests.RootTestItem',
	
	createSimpleItem: function(){
		return new RootTestItem('simple');
	},
	
	createRootItem: function(){
		return $root(() => new RootTestItem('rooted'));
	}
}