JSB({
	name: 'JSB.Tests.ExceptionStacktraceTest',
	require: ['Kernel'],
	server: {
		run: function(){
			function test(){
				throw 'Exception thrown';
			}
			test();
		}
	}
});