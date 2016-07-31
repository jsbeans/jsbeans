JSO({
	name:'Log',
	server: {
		singleton: true,
		globalize: true,
		constructor: function(){
			JSO().setLogger(this);
		},
		body: {
			error: function(a, b){
				if (typeof a === 'boolean') {
					Bridge.log('error', this.withStack(b));
				} else {
					Bridge.log('error', a);
				}
			},

			debug: function(a, b){
				if (typeof a === 'boolean') {
					Bridge.log('debug', this.withStack(b));
				} else {
					Bridge.log('debug', a);
				}
			},

			warn: function(a, b){
				if (typeof a === 'boolean') {
					Bridge.log('warning', this.withStack(b));
				} else {
					Bridge.log('warning', a);
				}
			},

			warning: function(a, b){
				if (typeof a === 'boolean') {
					Bridge.log('warning', this.withStack(b));
				} else {
					Bridge.log('warning', a);
				}
			},

			info: function(a, b){
				if (typeof a === 'boolean') {
					Bridge.log('info', this.withStack(b));
				} else {
					Bridge.log('info', a);
				}
			},

			withStack: function(s) {
				try {___JSdhaKJH.toString()} catch(e) {
					return  s + '\r\n' + e.stack;
				}
			}
		}
	}
});
