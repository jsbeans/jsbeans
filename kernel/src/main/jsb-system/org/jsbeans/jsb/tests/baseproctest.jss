JSB({
	name: 'JSB.Tests.BaseProcTest',
	server: {
		func: function(x){
			return 'JSB.Tests.BaseProcTest.func(' + x + ')';
		}
	}
});

JSB({
	name: 'JSB.Tests.BaseProcTest2',
	parent: 'JSB.Tests.BaseProcTest',
	server: {
		func: function(x){
			return 'JSB.Tests.BaseProcTest2.func('+x+') => ' + this.base(x + 2);
		}
	}
});

JSB({
	name: 'JSB.Tests.BaseProcTest3',
	parent: 'JSB.Tests.BaseProcTest2',
	server: {
		func: function(x){
			return 'JSB.Tests.BaseProcTest3.func('+x+') => ' + this.base(x + 1);
		}
	}
});