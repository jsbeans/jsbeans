{
	$name: 'Peg',
	$singleton: true,
	
	
	
	$constructor: function(){
		this.StringBuffer = function(stream, opts){
			this.stream = stream;
			this.opts = opts;
			this.buffers = [{
				pos: 0,
				buffer: ''
			},{
				pos: 0,
				buffer: ''
			}];
			this.currentBuffer = 0;
			this.lastBuffer = 1;
			this.length = 0;
			this.batchSize = 131072;
			this.eof = false;
		}
		this.StringBuffer.prototype = {
			checkFill: function(idx){
				while(idx >= this.length && !this.eof){
					var nBuffer = this.stream.read(this.batchSize);
					if(!nBuffer || nBuffer.length == 0){
						this.eof = true;
						break;
					}
					this.lastBuffer = this.currentBuffer;
					this.currentBuffer = (this.currentBuffer + 1) & 1;
					var bDesc = this.buffers[this.currentBuffer];
					bDesc.buffer = nBuffer;
					bDesc.pos = this.buffers[this.lastBuffer].pos + this.buffers[this.lastBuffer].buffer.length;
					this.length += bDesc.buffer.length;
					if(this.opts && this.opts.onProgress){
						this.opts.onProgress(this.stream.getTotalRead(), this.stream.available());
					}
				}
			},
			
			charCodeAt: function(idx){
				if(idx >= this.length && !this.eof){
					this.checkFill(idx);
				}
				var bDesc = this.buffers[this.currentBuffer];
				if(idx < bDesc.pos){
					bDesc = this.buffers[this.lastBuffer];
				}
				return bDesc.buffer.charCodeAt(idx - bDesc.pos);
			},
			
			charAt: function(idx){
				if(idx >= this.length && !this.eof){
					this.checkFill(idx);
				} 
				var bDesc = this.buffers[this.currentBuffer];
				if(idx < bDesc.pos){
					bDesc = this.buffers[this.lastBuffer];
				}
				return bDesc.buffer.charAt(idx - bDesc.pos);
			},
			
			substr: function(a, b){
				if(a + b >= this.length && !this.eof){
					this.checkFill(a + b);
				}
				var bDesc = this.buffers[this.currentBuffer];
				if(a < bDesc.pos && a + b < bDesc.pos){
					bDesc = this.buffers[this.lastBuffer];
					return bDesc.buffer.substr(a - bDesc.pos, b);
				} else if(a < bDesc.pos && a + b >= bDesc.pos){
					var prevDesc = this.buffers[this.lastBuffer];
					var part1 = prevDesc.buffer.substr(a - prevDesc.pos);
					var part2 = bDesc.buffer.substr(0, b - part1.length);
					return part1 + part2;
				} else if(a >= bDesc.pos && a + b >= bDesc.pos){
					return bDesc.buffer.substr(a - bDesc.pos, b);
				} else {
					debugger;
				}
			},
			
			substring: function(a, b){
				return this.substr(a, b - a);
			}

		};
		
		var self = this;
		`#include 'peg-0.10.0.js'`;
	},
	
	generate: function(){
		return this.peg.generate.apply(this.peg, arguments);
	},
	
	parseStream: function(parser, stream, opts){
		return parser.parse(new (this.StringBuffer)(stream, opts));
	}
}