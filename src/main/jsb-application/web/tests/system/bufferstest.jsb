{
	$name: 'JSB.Tests.BuffersTest',
	
	$client: {
		test1: function(){
			this.server().readToBuffer(function(buffer){
				if(buffer instanceof ArrayBuffer){
					console.log(buffer.byteLength);
					$this.server().compareBuffers(buffer, function(res, fail){
						if(res){
							console.log('ok');
						} else if(fail){
							$jsb.getLogger().error(fail);
						}
					});
				} else {
					throw 'Error';
				}
			});
		},
		
		test2: function(){
			this.server().readToBuffer2(function(buffer){
				if(buffer instanceof Uint8Array){
					console.log(buffer.length);
					$this.server().compareBuffers(buffer, function(res, fail){
						if(res){
							console.log('ok');
						} else if(fail){
							$jsb.getLogger().error(fail);
						}
					});
				} else {
					throw 'Error';
				}
			});
		}
	},
	
	$server: {
		$require: ['JSB.IO.FileSystem'],
		
		readToBuffer: function(){
			var fPath = $jsb.getFullPath() + '/../resources/dostoevsky.txt';
			var buffer = FileSystem.read(fPath, {binary:true});
			$jsb.getLogger().info('length: ' + buffer.byteLength);
			return buffer;
		},
		
		readToBuffer2: function(){
			var fPath = $jsb.getFullPath() + '/../resources/dostoevsky.txt';
			var buffer = FileSystem.read(fPath, {binary:true});
			$jsb.getLogger().info('length: ' + buffer.byteLength);
			return new Uint8Array(buffer);
		},
		
		base64Test: function(){
			var buffer = this.readToBuffer();
			var str = JSB().Base64.encode(buffer);
			$jsb.getLogger().info('encoded length: ' + str.length);
			var decoded = JSB().Base64.decode(str);
			$jsb.getLogger().info('decoded length: ' + decoded.byteLength);
			if(buffer.byteLength != decoded.byteLength){
				throw 'fail';
			}
			var b1 = new Uint8Array(buffer);
			var b2 = new Uint8Array(decoded);
			for(var i = 0; i < b1.length; i++){
				if(b1[i] != b2[i]){
					throw 'fail at ' + i;
				}
			}
			$jsb.getLogger().info('buffers are equal');
		},
		
		compareBuffers: function(clientBuffer){
			var buffer = this.readToBuffer();
			var b1 = new Uint8Array(buffer);
			var b2 = null;
			if($jsb.isArrayBuffer(clientBuffer)){
				b2 = new Uint8Array(clientBuffer);
			} else if($jsb.isUint8Array(clientBuffer)){
				b2 = clientBuffer;
			}
			for(var i = 0; i < b1.length; i++){
				if(b1[i] != b2[i]){
					throw 'fail at ' + i;
				}
			}
			$jsb.getLogger().info('buffers are equal');
			return true;
		}
	}
}