{
	$name: 'JSB.Tests.ExceptionStacktraceTest',
	$require: ['JSB.System.Kernel'],
	$client: {
		run: function(){
			this.server().run(function(arg1, arg2){
				debugger;
			});
		}
	},
	$server: {
		run: function(){
			function test(){
				throw 'Exception thrown';
			}
			test();
		}
	}
}