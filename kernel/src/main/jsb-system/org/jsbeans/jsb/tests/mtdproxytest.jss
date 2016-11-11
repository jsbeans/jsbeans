JSB({
	name: 'JSB.Tests.MethodProxyTest',
	require: ['Kernel'],
	server: {
		mtd1: function(x){
			return x + 1;
		},
		
		cs: function(){
			var csArr = JSB.getCallStack();
			var nArr = [];
			for(var i in csArr){
				nArr.push({methodName: csArr[i].methodName});
			}
			
			return nArr;
		},
		
		run: function(){
			var x = 0;
			var t1 = Date.now();
			for(var i = 0; i < 100000; i++){
				x = this.mtd1(x);
			}
			return Date.now() - t1;
		},
		
		run2: function(){
			return this.cs();
		}
	}
});