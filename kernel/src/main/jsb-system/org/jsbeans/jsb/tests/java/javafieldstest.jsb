[{
	$name: 'JSB.Tests.JavaFieldsTest1',
	$require: ['Kernel'],
	$client: {
	},
	$server: {
		System: Packages.java.lang.System,
		File: Packages.java.io.File
	}
},{
	$name: 'JSB.Tests.JavaFieldsTest2',
	$require: ['JSB.Tests.JavaFieldsTest1'],
	$client: {
	},
	$server: {
	}
}]