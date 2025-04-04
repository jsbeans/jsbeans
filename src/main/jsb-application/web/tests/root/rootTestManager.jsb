{
	$name: 'JSB.Tests.RootTestManager',
	$singleton: true,
	$require: 'JSB.Tests.RootTestItem',
	
	createSimpleItem: function(){
		return new RootTestItem('simple');
	},
	
	createRootItem: function(){
		return $root(() => new RootTestItem('rooted'));
	},
	
	rootWithException: function(){
		try {
			JSB.getLogger().info('rootWithException: start');
			$root(()=>{
				throw new Error('error');
			}, true);
		} finally {
			JSB.getLogger().info('rootWithException: finally');
		}
	}
}