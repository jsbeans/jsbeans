({
	$name: 'JSB.IO.TextStream',
	$parent: 'JSB.IO.Stream',
	
	$server: {
		$require: ['JSB.IO.Decoder',
			'JSB.IO.Encoder'],
	
		encoder: null,
		decoder: null,
		options: {
			charset: 'UTF-8',
			newline: '\n',
			delimiter: ' '
		},
		
		$constructor: function(stream, opts){
			$base(stream);
			if(opts){
				$jsb.merge(true, this.options, opts);
			}
			if(this.isReadable()){
				this.decoder = new Decoder(this.options.charset);
				this.decoder.setStream(this);
			}
			if(this.isWritable()){
				this.encoder = new Encoder(this.options.charset);
				this.encoder.setStream(this);
			}
		},
		
		destroy: function(){
			if(this.decoder){
				this.decoder.destroy();
				this.decoder = null;
			}
			if(this.encoder){
				this.encoder.destroy();
				this.encoder = null;
			}
			$base();
		},
		
		readLine: function(newLine){
			return this.decoder.readLine(newLine);
		},
		
		read: function(arg1, arg2, arg3){
			if(!arg1 && !arg2 && !arg3 || JSB.isNumber(arg1)){
				return this.decoder.read(this.decoder.stream, arg1);
			} else {
				return $base(arg1, arg2, arg3);
			}
		},
		
		write: function(arg1, arg2, arg3){
			if($jsb.isString(arg1)){
				return this.encoder.encode(arg1, arg2, arg3);
			} else {
				return $base(arg1, arg2, arg3);
			}
		},
		
		writeLine: function(str){
			return this.write(str + this.options.newline);
		}
	}
})