{
	$name: 'JSB.IO.Stream',
				
	$server: {
		$require: [
			'java:org.jsbeans.helpers.BufferHelper',
			'java:java.lang.System',
			'java:java.io.InputStream',
			'java:java.io.OutputStream',
			'java:java.lang.reflect.Array',
			'java:java.lang.Byte'],
		
		input: null,
		output: null,
		buffer: null,
		closed: true,
		
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
			$base();
			if(this.buffer){
				this.buffer = null;
			}
			if(!this.closed){
				this.close();
			}
		},
		
		_setStream: function(obj){
			if(obj instanceof InputStream){
				this.input = obj;
				this.closed = false;
			} else if(obj instanceof OutputStream){
				this.output = obj;
				this.closed = false;
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
		
		available: function(){
	        if ($jsb.isNull(this.input)) {
	            throw "No input stream";
	        }
	        return this.input.available();
		},
		
		read: function(arg, from, to){
	        if ($jsb.isNull(this.input)) {
	            throw "No input stream";
	        }
	        if(arg instanceof ArrayBuffer){
	        	var arrayBuffer = arg;
				from = from || 0;
				to = to || arrayBuffer.byteLength;
				if(!this.buffer || this.buffer.length < to - from){
	        		this.buffer = Array.newInstance(Byte.TYPE, to - from);
	        	}
				var count = this.input.read(this.buffer, 0, to - from);
				BufferHelper.copyToArrayBuffer(this.buffer, 0, arrayBuffer, from, count);
				
				return count;
	        } else if(!$jsb.isNull(arg) && $jsb.isNumber(arg) && arg > 0) {
	        	var limit = arg;
	        	if(!this.buffer || this.buffer.length < limit){
	        		this.buffer = Array.newInstance(Byte.TYPE, limit);
	        	}
                var read = this.input.read(this.buffer, 0, limit);
                if(read > 0){
	            	var filled = new ArrayBuffer(read);
	            	BufferHelper.copyToArrayBuffer(this.buffer, 0, filled, 0, read);
                	return filled;
                } else {
                	return new ArrayBuffer(0);
                }
	        } else if(!$jsb.isNull(arg) && arg.getClass && arg.getClass().getName() == '[B') {
	        	// check for arg is byte[]
	        	var byteArray = arg;
				from = from || 0;
				to = to || byteArray.length;
				return this.input.read(byteArray, from, to - from);
	        } else if(!$jsb.isNull(arg)){
	        	throw 'Unknown argument passed';
	        } else {
	        	if(!this.buffer || this.buffer.length < 4096){
	        		this.buffer = Array.newInstance(Byte.TYPE, 4096);
	        	}
	            var read, count = 0;
                while ((read = this.input.read(this.buffer, count, this.buffer.length - count)) > -1) {
                    count += read;
                    if (count == this.buffer.length) {
                    	var b = Array.newInstance(Byte.TYPE, this.buffer.length * 2);
                        System.arraycopy(this.buffer, 0, b, 0, count);
                        this.buffer = b;
                    }
                }
                if(count > 0){
	            	var filled = new ArrayBuffer(count);
	            	BufferHelper.copyToArrayBuffer(this.buffer, 0, filled, 0, count);
                	return filled;
                } else {
                	return new ArrayBuffer(0);
                }
	        }
		},
		
		write: function(obj, from, to){
			var bytes = null;
			var arrayBuffer = null;
			if($jsb.isString(obj)){
				arrayBuffer = BufferHelper.toArrayBuffer(obj);
			} else if($jsb.isArrayBuffer(obj)){
				arrayBuffer = obj;
			} else {
				throw 'Expected an ArrayBuffer or string as first argument';
			}
			from = from || 0;
			to = to || arrayBuffer.byteLength;
			this.output.write(BufferHelper.toByteArray(arrayBuffer), from, to - from);
			return to - from;
		},
		
		copy: function(output){
			if(!$jsb.isInstanceOf(output, 'JSB.IO.Stream')){
				throw 'Expected JSB.IO.Stream as first argument';
			}
			var buffer = new ArrayBuffer(Math.max(4096, Math.min(this.available(), 65536)));
			while(this.available()){
				var count = this.read(buffer);
				output.write(buffer, 0, count);
			}
			output.flush();
			return this;
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
				this.closed = true;
				this.destroy();
			}
		},
		
		isClosed: function(){
			return this.closed;
		}
	}
}