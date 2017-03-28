{
	$name:'Log',
	$server: {
		$singleton: true,
		$globalize: true,
		$constructor: function(){
			JSB().setLogger(this);
		},
		
		error: function(a, b){
			if (b) {
				Bridge.log('error', this.withStack(a));
			} else {
				Bridge.log('error', a);
			}
		},

		debug: function(a, b){
			if (b) {
				Bridge.log('debug', this.withStack(a));
			} else {
				Bridge.log('debug', a);
			}
		},

		warn: function(a, b){
			if (b) {
				Bridge.log('warning', this.withStack(a));
			} else {
				Bridge.log('warning', a);
			}
		},

		warning: function(a, b){
			if (b) {
				Bridge.log('warning', this.withStack(a));
			} else {
				Bridge.log('warning', a);
			}
		},

		info: function(a, b){
			if (b) {
				Bridge.log('info', this.withStack(a));
			} else {
				Bridge.log('info', a);
			}
		},

		withStack: function(s) {
			try {___JSdhaKJH.toString()} catch(e) {
				if(s.stack){
					s += '\r\n' + s.stack;
				} 
				return  s + '\r\n' + e.stack;
			}
		}
	}
}