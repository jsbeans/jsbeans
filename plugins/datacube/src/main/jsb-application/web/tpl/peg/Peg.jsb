{
	$name: 'Peg',
	$singleton: true,
	
	
	
	$constructor: function(){
		this.StringBuffer = function(stream){
			this.stream = stream;
			this.pos = 0;
			this.buffer = '';
			this.length = 0;
		}
		this.StringBuffer.prototype = {
			checkFill: function(idx){
				while(idx >= this.length){
					var ch = this.stream.read(65536);
					if(!ch || ch.length == 0){
						break;
					}
					this.buffer += ch;
					this.length = this.buffer.length;
				}
			},
			charCodeAt: function(idx){
				if(idx >= this.length){
					this.checkFill(idx);
				}
				var r = this.buffer.charCodeAt(idx);
//				JSB.getLogger().info('charCodeAt(' + idx + '):' + r);
				return r;
			},
			charAt: function(idx){
				if(idx >= this.length){
					this.checkFill(idx);
				}
				var r = this.buffer.charAt(idx);
//				JSB.getLogger().info('charAt(' + idx + '):' + r);
				return r;
			},
			substr: function(a, b){
				if(b && a + b >= this.length){
					this.checkFill(a + b);
				} else if(a >= this.length) {
					this.checkFill(a);
				}
				var r = this.buffer.substr(a, b);
//				JSB.getLogger().info('substr(' + a + ', ' + b + '):' + r);
				return r;
			},
			substring: function(a, b){
				if(b && b >= this.length){
					this.checkFill(b);
				} else if(a >= this.length){
					this.checkFill(a);
				}
				var r = this.buffer.substring(a, b);
//				JSB.getLogger().info('substring(' + a + ', ' + b + '):' + r);
				return r;
			}

		};
		
		var self = this;
		`#include 'peg-0.10.0.js'`;
	},
	
	generate: function(){
		return this.peg.generate.apply(this.peg, arguments);
	},
	
	parseStream: function(parser, stream){
		debugger;
		var t1 = Date.now();
		// wrap stream
/*		var str = '';
		while(true){
			var l = stream.read(65536);
			if(!l || l.length == 0){
				break;
			}
			str += l;
		}*/
		var t2 = Date.now();
//		var res = parser.parse(str);
		var res = parser.parse(new (this.StringBuffer)(stream));
		var t3 = Date.now();
//		JSB.getLogger().debug('input length: ' + str.length);
		JSB.getLogger().debug('read time: '+(t2-t1)+'; parse time: ' + (t3-t2));
		debugger;
		return res;
	}
}