/*
 * This file is the part of jsBeans, high-level JavaScript client-server framework.
 * The contents of this file are subject to the MIT Licence (MIT).
 * (c) aa@sis.ru, da@sis.ru, Special Information Systems, LLC, 2011-2019
 *
 * Настоящий файл является частью клиент-серверной JavaScript платформы.
 * Условия использования и распространения содержимого данного файла соответствуют программному обеспечению с открытыми исходными кодами и равнозначно MIT Licence (MIT).
 * Авторские права принадлежат aa@sis.ru, da@sis.ru, ООО СИС, 2011-2019гг.
 */

({
	$name: 'JSB.IO.Encoder',
	
	$server: {
		$require: ['java:java.nio.charset.Charset',
			'java:java.nio.charset.CodingErrorAction',
			'java:java.nio.ByteBuffer',
			'java:java.nio.CharBuffer',
			'java:org.jsbeans.helpers.BufferHelper',
			'java:org.jsbeans.helpers.StringHelper',
			{'JavaString': 'java:java.lang.String'}],
		
		encoder: null,
		encoded: null,
		outputBuffer: null,
		stream: null,
		
		$constructor: function(charset, capacity){
			$base();
			this.encoder = Charset.forName(charset).newEncoder();
			this.capacity = capacity || 8192;
			this.encoded = new ArrayBuffer(this.capacity);
			this.outputBuffer = ByteBuffer.wrap(BufferHelper.toByteArray(this.encoded));
			
		    this.encoder.onMalformedInput(CodingErrorAction.REPLACE);
		    this.encoder.onUnmappableCharacter(CodingErrorAction.REPLACE);
		},
		
		destroy: function(){
			this.encoder = null;
			this.encoded = null;
			this.outputBuffer = null;
			this.stream = null;
			$base();
		},
		
		setStream: function(stream){
			this.stream = stream;
		},
		
		encode: function(str, from, to){
			from = from || 0;
			to = to || str.length;
			var input = CharBuffer.wrap(str, from, to);
			var result = this.encoder.encode(input, this.outputBuffer, false);
			
	        while (result.isOverflow()) {
	            // grow output buffer
	            this.capacity += Math.max(this.capacity, Math.round(2 * (to - from) * this.encoder.averageBytesPerChar()));
	            this.encoded = new ArrayBuffer(this.capacity);
	            this.outputBuffer = ByteBuffer.wrap(BufferHelper.toByteArray(this.encoded));
	            input.position(0);
	            result = this.encoder.encode(input, this.outputBuffer, false);
	        }
	        if (result.isError()) {
	            this.encoder.reset();
	            throw result;
	        }
	        var ret = null;
	        if(this.stream) {
	            this.stream.write(this.encoded, 0, this.outputBuffer.position());
	            ret = this.outputBuffer.position();
	        } else {
		        var retBB = new ArrayBuffer(this.outputBuffer.position());
		        BufferHelper.copyToArrayBuffer(BufferHelper.toByteArray(this.encoded), 0, retBB, 0, this.outputBuffer.position());
		        ret = retBB;
	        }
            this.clear();
	        
	        return ret;
		},
		
		clear: function(){
			this.outputBuffer.clear();
		},
		
		close: function(){
	        var input = CharBuffer.wrap('');
	        var result = this.encoder.encode(input, this.outputBuffer, true);
	        if (result.isError()) {
	            this.encoder.reset();
	            throw result;
	        }
	        if(this.stream) {
	            this.stream.write(this.encoded, 0, this.outputBuffer.position());
	            this.clear();
	        }
		}
	}
})