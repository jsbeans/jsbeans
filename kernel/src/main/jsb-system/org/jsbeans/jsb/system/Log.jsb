{
	$name:'JSB.System.Log',
	$server: {
		$singleton: true,
		$globalize: 'Log',
		
		$constructor: function(){
			JSB().setLogger(this);
		},
		
		_prepareObj: function(a){
			var str = '' + a;
			if(a.stack){
				str += '\r\n' + a.stack;
			}
			return str;
		},
		
		_withStack: function(s) {
			try {___JSdhaKJH.toString()} catch(e) {
				return  this._prepareObj(s) + '\r\n' + e.stack;
			}
		},
		
		error: function(a, b){
			if (b) {
				Bridge.log('error', this._withStack(a));
			} else {
				Bridge.log('error', this._prepareObj(a));
			}
		},

		debug: function(a, b){
			if (b) {
				Bridge.log('debug', this._withStack(a));
			} else {
				Bridge.log('debug', this._prepareObj(a));
			}
		},

		warn: function(a, b){
			if (b) {
				Bridge.log('warning', this._withStack(a));
			} else {
				Bridge.log('warning', this._prepareObj(a));
			}
		},

		warning: function(a, b){
			if (b) {
				Bridge.log('warning', this._withStack(a));
			} else {
				Bridge.log('warning', this._prepareObj(a));
			}
		},

		info: function(a, b){
			if (b) {
				Bridge.log('info', this._withStack(a));
			} else {
				Bridge.log('info', this._prepareObj(a));
			}
		}

	}
}