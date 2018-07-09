({
	$name: 'JSB.IO.ProxyStream',
	$parent: 'JSB.IO.Stream',
	
	$server: {
		
		options: {},
		completed: false,
		
		$constructor: function(stream1, stream2, opts){
			$base(stream1);
			
			if($jsb.isInstanceOf(stream2, 'JSB.IO.Stream')){
				if(stream2.input){
					this._setStream(stream2.input);
				} else if(stream2.output){
					this._setStream(stream2.output);
				}
			} else {
				this._setStream(stream2);
			}
			
			if(opts){
				$jsb.merge(true, this.options, opts);
			}
		},
		
		destroy: function(){
			this.closed = true;
			$base();
		},
		
		read: function(arg1, arg2, arg3){
			var count = $base(arg1, arg2, arg3);
			if(count == -1){
				if(!this.completed){
					return 0;
				}
				// read complete
				if(this.options.onReadComplete){
					this.options.onReadComplete.call(this);
				}
			}
			return count;
		},
		
		
		complete: function(){
			this.completed = true;
			if(this.options.onWriteComplete){
				this.options.onWriteComplete.call(this);
			}
		}
	}
})