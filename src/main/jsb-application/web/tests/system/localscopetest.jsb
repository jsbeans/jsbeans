{
	$name: 'JSB.Tests.LocalScopeTest',
	$require: ['JSB.System.Kernel', 'JSB.System.Log'],
	$client: {
		counter: 0,
		run: function(){
			console.log('name: ' + $jsb.$name + '; ' + $this.counter);
		},
		
		test: function(){
			console.log('test: ' + $jsb.$name);
		}
	},
	$server: {
		run: function(){
			Log.debug('name: ' + $jsb.$name);
		}
	}
},{
	$name: 'JSB.Tests.LocalScopeTest2',
	$parent: 'JSB.Tests.LocalScopeTest',
	$client: {
		counter: 10,
		run: function(){
			console.log('name: ' + $jsb.$name + '; ' + $this.counter);
			$base();
		},
		
		test: function(){
			console.log('test: ' + $jsb.$name);
			$super.run();
		}
	},
	$server: {
		run: function(){
			Log.debug('name: ' + $jsb.$name);
			$base();
		}
	}
},{
	$name: 'JSB.Tests.LocalScopeTest3',
	$parent: 'JSB.Tests.LocalScopeTest2',
	$client: {
		$constructor: function(){
			$base();
			$server.run();
		},
		test: function(){
			console.log('test: ' + $jsb.$name);
			$base();
			$server.run();
		}
	}
}