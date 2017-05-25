{
	$name: 'JSB.IO.Stream',
				
	$server: {
		$require: [
			'java:java.lang.System',
			'java:java.io.InputStream',
			'java:java.io.OutputStream',
			'java:java.lang.reflect.Array',
			'java:java.lang.Byte'],
		
		input: null,
		output: null,
		closed: false,
		
		$constructor: function(stream){
			$base();
			if($jsb.isInstanceOf(stream, $class)){
				if(stream.input){
					this._setStream(stream.input);
				} else if(stream.output){
					this._setStream(stream.output);
				}
			} else {
				this._setStream(stream);
			}
		},
		
		destroy: function(){
			this.close();
			$base();
		},
		
		_setStream: function(obj){
			if(obj instanceof InputStream){
				this.input = obj;
			} else if(obj instanceof OutputStream){
				this.output = obj;
			}
		},
		
		isReadable: function(){
			return !$jsb.isNull(this.input);
		},

		isWritable: function(){
			return !$jsb.isNull(this.output);
		},
		
		isSeekable: function(){
			return false;
		},
		
		read: function(limit){
	        if ($jsb.isNull(this.input)) {
	            throw "No input stream";
	        }
	        if(!$jsb.isNull(limit) && $jsb.isNumber(limit) && limit > 0) {
            	var bytes = Array.newInstance(Byte.TYPE, limit);
                var read = this.input.read(bytes);
                if(read > 0){
	            	var filled = new Uint8Array(read);
                	for(var i = 0; i < read; i++){
                		filled[i] = bytes[i];
                	}
                	return filled;
                } else {
                	return new Uint8Array(0);
                }
	        } else {
	        	var buffer = Array.newInstance(Byte.TYPE, 8192);
	            var read, count = 0;
                while ((read = this.input.read(buffer, count, buffer.length - count)) > -1) {
                    count += read;
                    if (count == buffer.length) {
                    	var b = Array.newInstance(Byte.TYPE, buffer.length * 2);
                        System.arraycopy(buffer, 0, b, 0, count);
                        buffer = b;
                    }
                }
                if(count > 0){
	            	var filled = new Uint8Array(count);
                	for(var i = 0; i < count; i++){
                		filled[i] = buffer[i];
                	}
                	return filled;
                } else {
                	return new Uint8Array(0);
                }
	        }
		},
		
		write: function(obj, start, end){
			var bytes = null;
			
		},
		
		flush: function(){
			if($jsb.isNull(this.output)){
				throw 'No output stream';
			}
			this.output.flush();
		},
		
		skip: function(num){
			if($jsb.isNull(this.input)){
				throw 'No input stream';
			}
			return this.input.skip(num);
		},
		
		close: function(){
			if(!this.closed){
				if(!$jsb.isNull(this.input)){
					this.input.close();
				}
				if(!$jsb.isNull(this.output)){
					this.output.close();
				}
			}
			this.closed = true;
			this.destroy();
		},
		
		isClosed: function(){
			return this.closed;
		}
	}
}