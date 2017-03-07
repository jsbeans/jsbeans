[{
	name: 'JSB.Tests.BaseProcTest',
	server: {
		func: function(x){
			return 'JSB.Tests.BaseProcTest.func(' + x + ')';
		}
	}
},{
	name: 'JSB.Tests.BaseProcTest2',
	parent: 'JSB.Tests.BaseProcTest',
	server: {
		func: function(x){
			return 'JSB.Tests.BaseProcTest2.func('+x+') => ' + $base(x + 2);
		}
	}
},{
	name: 'JSB.Tests.BaseProcTest3',
	parent: 'JSB.Tests.BaseProcTest2',
	server: {
		func: function(x){
			return 'JSB.Tests.BaseProcTest3.func('+x+') => ' + $base(x + 1);
		}
	}
}]