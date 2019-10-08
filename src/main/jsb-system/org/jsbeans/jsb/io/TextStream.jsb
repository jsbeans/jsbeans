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