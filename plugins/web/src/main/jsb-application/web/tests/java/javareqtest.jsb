{
	$name: 'JSB.Tests.JavaReqTest',
	$require: ['JSB.System.Kernel', 'java:java.lang.System', 'java:java.io.File'],
	$client: {
	},
	$server: {
		test: function(){
			return System.currentTimeMillis();
		},
		sys: function(){
			return System;
		}
	}
}