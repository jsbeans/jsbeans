({
	$name: 'JSB.IO.Decoder',
	
	$server: {
		$require: ['java:java.nio.charset.Charset',
			'java:java.nio.charset.CodingErrorAction',
			'java:java.nio.ByteBuffer',
			'java:java.nio.CharBuffer',
			'java:org.jsbeans.helpers.BufferHelper',
			'java:org.jsbeans.helpers.StringHelper',
			{'JavaString': 'java:java.lang.String'}],
		
	
		inputBuffer: null,
		outputBuffer: null,
		decoder: null,
		stream: null,
		mark: 0,
	
		$constructor: function(charset, capacity){
			$base();
			this.decoder = Charset.forName(charset).newDecoder();
			this.capacity = capacity || 8192;
		    this.inputBuffer = ByteBuffer.allocate(this.capacity);
		    this.outputBuffer = CharBuffer.allocate(this.decoder.averageCharsPerByte() * this.capacity);

		    this.decoder.onMalformedInput(CodingErrorAction.REPLACE);
		    this.decoder.onUnmappableCharacter(CodingErrorAction.REPLACE);
		},
		
		setStream: function(stream){
			this.stream = stream;
		},
		
		destroy: function(){
			this.stream = null;
			this.inputBuffer = null;
			this.outputBuffer = null;
			this.decoder = null;
			$base();
		},
		
		_decode: function(remaining){
			$this.inputBuffer.flip();
			var result = $this.decoder.decode($this.inputBuffer, $this.outputBuffer, false);
			while(result.isOverflow()){
				$this.capacity += Math.max($this.capacity, remaining);
				var newOutput = CharBuffer.allocate(1.2 * $this.capacity * $this.decoder.averageCharsPerByte());
	            $this.outputBuffer.flip();
	            newOutput.append($this.outputBuffer);
	            $this.outputBuffer = newOutput;
	            result = $this.decoder.decode($this.inputBuffer, $this.outputBuffer, false);
			}
			if(result.isError()){
				$this.decoder.reset();
				$this.inputBuffer.clear();
				throw result;
			}
			$this.inputBuffer.compact();
		},
		
		decode: function(arg1, arg2, arg3){
			if($jsb.isArrayBuffer(arg1)){
				var bytes = arg1;
				var from = arg2 || 0;
				var to = arg3 || bytes.byteLength;
				while(to > from){
					var count = Math.min(to - from, this.inputBuffer.capacity() - this.inputBuffer.position());
					this.inputBuffer.put(BufferHelper.toByteArray(bytes), from, count);
					this._decode(to - from);
					from += count;
				}
				return '' + JavaString.valueOf(this.outputBuffer.array(), this.mark, this.outputBuffer.position() - this.mark);
			} else if($jsb.isInstanceOf(arg1, 'JSB.IO.Stream')){
				var stream = arg1;
				var count = arg2;
				while(stream.available() && (!count || count > this.outputBuffer.position() - this.mark)){
					if(this.mark > 0){
						this.outputBuffer.limit(this.outputBuffer.position());
						this.outputBuffer.position(this.mark);
						this.outputBuffer.compact();
						this.mark = 0;
					}
					var position = this.inputBuffer.position();
					var read = stream.read(this.inputBuffer.array(), position, this.inputBuffer.capacity());
					if(read <= 0){
						break;
					} else {
						this.inputBuffer.position(position + read);
						this._decode(0);
					}
				}
				this.outputBuffer.flip();
				var result = null;
				if(count && this.outputBuffer.limit() - this.mark > count){
					result = this.mark == this.outputBuffer.limit() ? null : '' + String(this.outputBuffer.subSequence(this.mark, this.mark + Math.min(count, this.outputBuffer.limit() - this.mark)));
					this.mark += count;
					this.outputBuffer.position(this.outputBuffer.limit());
		            this.outputBuffer.limit(this.outputBuffer.capacity());
				} else {
		            result = this.mark == this.outputBuffer.limit() ? null : '' +  String(this.outputBuffer.subSequence(this.mark, this.outputBuffer.limit()));
		            if(!stream.available()){
		            	this.clear();	
		            }
				}
				return result;
			}
		},
		
		read: function(stream, count){
			stream = stream || this.stream;
			if(!stream){
				throw new Error('Decoder.read works with streams only');
			}
			return this.decode(stream, count);
		},
		
		readLine: function(includeNewline, stream){
			stream = stream || this.stream;
			if(!stream){
				throw new Error('Decoder.readLine works with streams only');
			}
			var newline = StringHelper.searchNewline(this.outputBuffer, this.mark);
			while(stream.available() && newline < 0){
				if(this.mark > 0){
					this.outputBuffer.limit(this.outputBuffer.position());
					this.outputBuffer.position(this.mark);
					this.outputBuffer.compact();
					this.mark = 0;
				}
				var position = this.inputBuffer.position();
				var read = stream.read(this.inputBuffer.array(), position, this.inputBuffer.capacity());
				if(read <= 0){
					break;
				} else {
					var from = this.outputBuffer.position();
					this.inputBuffer.position(position + read);
					this._decode(0);
					newline = StringHelper.searchNewline(this.outputBuffer, from);
				}
			}
			this.outputBuffer.flip();
			var array = this.outputBuffer.array();
			var result = null;
			if(newline >= 0){
				var isCrlf = array[newline] == 13 && array[newline + 1] == 10;
	            if (isCrlf && includeNewline) {
	                result = '' + JavaString.valueOf(array, this.mark, newline + 2 - this.mark);
	                this.mark = newline + 2;
	            } else {
	                var count = includeNewline ? newline + 1 - this.mark : newline - this.mark;
	                result = '' + JavaString.valueOf(array, this.mark, count);
	                this.mark = isCrlf ? newline + 2 : newline + 1;
	            }
	            this.outputBuffer.position(this.outputBuffer.limit());
	            this.outputBuffer.limit(this.outputBuffer.capacity());
			} else if(!stream.available()){
	            result = this.mark == this.outputBuffer.limit() ? null : '' + JavaString.valueOf(array, this.mark, this.outputBuffer.limit() - this.mark);
	            this.clear();
			}
			
			return result;
		},
		
		clear: function(){
			this.outputBuffer.clear();
			this.mark = 0;
		},
		
		hasPending: function(){
			return this.inputBuffer.position() > 0;
		},
		
		close: function(){
	        this.inputBuffer.flip();
	        var result = this.decoder.decode(this.inputBuffer, this.outputBuffer, true);
	        if(result.isError()) {
	            this.decoder.reset();
	            this.inputBuffer.clear();
	            throw result;
	        }
		}
	}
})