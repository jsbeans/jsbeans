[{
	name: 'JSB.Tests.MethodAccessBase1',
	client: {
		
	},
	server: {
		__private1: function(){
			Log.debug('JSB.Tests.MethodAccessBase1.__private1');
		},
		
		_protected1: function(){
			Log.debug('JSB.Tests.MethodAccessBase1._protected1');
		}
	}
},{
	name: 'JSB.Tests.MethodAccessBase2',
	parent: 'JSB.Tests.MethodAccessBase1',
	client: {
		
	},
	server: {
		pub: function(){
			Log.debug('JSB.Tests.MethodAccessBase2.pub');
			this.__private2();
		},
		pub2: function(){
			Log.debug('JSB.Tests.MethodAccessBase2.pub2');
			this.__private1();
		},
		__private2: function(){
			Log.debug('JSB.Tests.MethodAccessBase2.__private2');
		},
		
		pub3: function(){
			Log.debug('JSB.Tests.MethodAccessBase2.pub3');
			this._protected1();
		}
		
	}
},{
	name: 'JSB.Tests.MethodAccessTest',
	require: ['JSB.Tests.MethodAccessBase2'],
	client: {
		
	},
	server: {
		constructor: function(){
			this.base2 = new JSB.Tests.MethodAccessBase2();
			this.__test5();
			this._test8();
		},
		
		test1: function(){
			this.base2.pub();
		},
		
		test2: function(){
			this.base2.__private2();
		},
		
		test3: function(){
			this.base2.__private1();
		},
		
		test4: function(){
			this.base2.pub2();
		},
		
		__test5: function(){
			this.base2.pub();
		},
		
		test6: function(){
			this.base2.pub3();
		},
		
		test7: function(){
			this.base2._protected1();
		},
		
		_test8: function(){
			this.base2.pub();
		},
		
		test9: function(){
			this.__test5();
		},

		test10: function(){
			var self = this;
			JSB.defer(function(){
				self.__test5();
			});
		},

	}
}]