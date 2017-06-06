{
	$name: 'JSB.Tests.FsTest',
	$server: {
		$require: ['JSB.IO.FileSystem', 'JSB.Profiler', 'JSB.IO.Decoder', 'JSB.IO.Encoder'],
		
		$constructor: function(){
			this.profiler = new Profiler();
		},
		
		test1: function(){
			// read all
			var fPath = $jsb.getFullPath() + '/../resources/dostoevsky.txt';
			var stream = FileSystem.open(fPath, 'rb');
			this.profiler.probe('test1');
			var data = new Uint8Array(stream.read());
			this.profiler.probe();
			$jsb.getLogger().info('length: ' + data.length);
			$jsb.getLogger().info('profile: ' + this.profiler.dump());
			var dataArr = [];
			for(var i = 0; i < 100; i++){
				dataArr.push(data[i]);
			}
			$jsb.getLogger().info('data: ' + JSON.stringify(dataArr));
			stream.close();
			
		},
		
		test2: function(){
			// read partially
			var fPath = $jsb.getFullPath() + '/../resources/dostoevsky.txt';
			var stream = FileSystem.open(fPath, 'rb');
			
			var total = 0;
			this.profiler.probe('test2');
			while(stream.available()){
				var data = new Uint8Array(stream.read(16384));
				total += data.length;
			}
			this.profiler.probe();
			$jsb.getLogger().info('length: ' + total);
			$jsb.getLogger().info('profile: ' + this.profiler.dump());
			stream.close();
		},
		
		test3: function(){
			// read into buffer
			var fPath = $jsb.getFullPath() + '/../resources/dostoevsky.txt';
			var stream = FileSystem.open(fPath, 'rb');
			this.profiler.probe('test3');
			var data = new Uint8Array(100);
			stream.read(data.buffer);
			this.profiler.probe();
			$jsb.getLogger().info('length: ' + data.length);
			$jsb.getLogger().info('profile: ' + this.profiler.dump());
			var dataArr = [];
			for(var i = 0; i < 100; i++){
				dataArr.push(data[i]);
			}
			$jsb.getLogger().info('data: ' + JSON.stringify(dataArr));
			stream.close();
			
		},
		
		test4: function(){
			// copy file
			var fPath1 = $jsb.getFullPath() + '/../resources/dostoevsky.txt';
			var fPath2 = $jsb.getFullPath() + '/../resources/dostoevsky_copy.txt';
			$jsb.getLogger().info('Reading file: ' + fPath1);
			$jsb.getLogger().info('Writing file: ' + fPath2);
			this.profiler.probe('test4');
			var inStream = FileSystem.open(fPath1, 'rb');
			var outStream = FileSystem.open(fPath2, 'wb');
			var buffer = new ArrayBuffer(16384);
			while(inStream.available()){
				var count = inStream.read(buffer);
				outStream.write(buffer, 0, count);
			}
			inStream.close();
			outStream.close();
			this.profiler.probe();
			$jsb.getLogger().info('profile: ' + this.profiler.dump());
		},
		
		test5: function(){
			// copy file
			var fPath1 = $jsb.getFullPath() + '/../resources/dostoevsky.txt';
			var fPath2 = $jsb.getFullPath() + '/../resources/dostoevsky_copy.txt';
			$jsb.getLogger().info('Reading file: ' + fPath1);
			$jsb.getLogger().info('Writing file: ' + fPath2);
			this.profiler.probe('test5');
			var inStream = FileSystem.open(fPath1, 'rb');
			var outStream = FileSystem.open(fPath2, 'wb');
			inStream.copy(outStream);
			inStream.close();
			outStream.close();
			this.profiler.probe();
			$jsb.getLogger().info('profile: ' + this.profiler.dump());
		},
		
		test6: function(){
			// decode file
			var fPath = $jsb.getFullPath() + '/../resources/dostoevsky.txt';
			$jsb.getLogger().info('Reading file: ' + fPath);
			this.profiler.probe('test6');
			var inStream = FileSystem.open(fPath, 'rb');
			var decoder = new Decoder('Windows-1251');
			var decoded = decoder.decode(inStream);
			inStream.close();
			this.profiler.probe();
			$jsb.getLogger().info('profile: ' + this.profiler.dump());
			return decoded;
		},
		
		test7: function(){
			// decode file
			var fPath = $jsb.getFullPath() + '/../resources/dostoevsky.txt';
			$jsb.getLogger().info('Reading file: ' + fPath);
			this.profiler.probe('test7');
			var inStream = FileSystem.open(fPath, 'rb');
			var buffer = inStream.read();
			var decoder = new Decoder('Windows-1251');
			var decoded = decoder.decode(buffer);
			inStream.close();
			this.profiler.probe();
			$jsb.getLogger().info('profile: ' + this.profiler.dump());
			return decoded;
		},
		
		test8: function(){
			// decode file by line
			var fPath = $jsb.getFullPath() + '/../resources/dostoevsky.txt';
			$jsb.getLogger().info('Reading file: ' + fPath);
			this.profiler.probe('test8');
			var inStream = FileSystem.open(fPath, 'rb');
			var decoder = new Decoder('Windows-1251');
			var decoded = '';
			var lineCount = 0;
			while(true){
				var line = decoder.readLine(true, inStream);
				if(!line){
					break;
				}
				decoded += line;
				lineCount++;
			}
			inStream.close();
			this.profiler.probe();
			$jsb.getLogger().info('lines: ' + lineCount);
			$jsb.getLogger().info('profile: ' + this.profiler.dump());
			return decoded;
		},

		test9: function(){
			// copy file via lines
			var fPath1 = $jsb.getFullPath() + '/../resources/dostoevsky.txt';
			var fPath2 = $jsb.getFullPath() + '/../resources/dostoevsky_copy.txt';
			$jsb.getLogger().info('Reading file: ' + fPath1);
			$jsb.getLogger().info('Writing file: ' + fPath2);
			this.profiler.probe('test9');
			var inStream = FileSystem.open(fPath1, 'rb');
			var outStream = FileSystem.open(fPath2, 'wb');
			var decoder = new Decoder('Windows-1251');
			var encoder = new Encoder('UTF-8');
			var line;
			while(line = decoder.readLine(true, inStream)){
				outStream.write(encoder.encode(line));
			}
			inStream.close();
			outStream.close();
			this.profiler.probe();
			$jsb.getLogger().info('profile: ' + this.profiler.dump());
		},
		
		test10: function(){
			var fPath = $jsb.getFullPath() + '/../resources/dostoevsky.txt';
			var inStream = FileSystem.open(fPath, {
				read: true,
				charset: 'Windows-1251'
			});
			var txt = inStream.read();
			inStream.close();
			return txt;
		},
		
		test11: function(){
			// copy file via lines
			var fPath1 = $jsb.getFullPath() + '/../resources/dostoevsky.txt';
			var fPath2 = $jsb.getFullPath() + '/../resources/dostoevsky_copy.txt';
			$jsb.getLogger().info('Reading file: ' + fPath1);
			$jsb.getLogger().info('Writing file: ' + fPath2);
			this.profiler.probe('test11');
			var inStream = FileSystem.open(fPath1, {
				read: true,
				charset: 'Windows-1251'
			});
			var outStream = FileSystem.open(fPath2, 'w');
			var line;
			while(!$jsb.isNull(line = inStream.readLine())){
				outStream.writeLine(line);
			}
			inStream.close();
			outStream.close();
			this.profiler.probe();
			$jsb.getLogger().info('profile: ' + this.profiler.dump());
		},

		test12: function(){
			// copy file via whole text
			var fPath1 = $jsb.getFullPath() + '/../resources/dostoevsky.txt';
			var fPath2 = $jsb.getFullPath() + '/../resources/dostoevsky_copy.txt';
			$jsb.getLogger().info('Reading file: ' + fPath1);
			$jsb.getLogger().info('Writing file: ' + fPath2);
			this.profiler.probe('test12');
			var inStream = FileSystem.open(fPath1, {
				read: true,
				charset: 'Windows-1251'
			});
			var outStream = FileSystem.open(fPath2, 'w');

			outStream.write(inStream.read());
			
			inStream.close();
			outStream.close();
			this.profiler.probe();
			$jsb.getLogger().info('profile: ' + this.profiler.dump());
		},

		test13: function(){
			// copy file via fs read & write
			var fPath1 = $jsb.getFullPath() + '/../resources/dostoevsky.txt';
			var fPath2 = $jsb.getFullPath() + '/../resources/dostoevsky_copy.txt';
			this.profiler.probe('test13');
			var txt = FileSystem.read(fPath1, {charset:'Windows-1251'});
			FileSystem.write(fPath2, txt);
			this.profiler.probe();
			$jsb.getLogger().info('profile: ' + this.profiler.dump());
		},

		test14: function(){
			// copy file via fs copy routine
			var fPath1 = $jsb.getFullPath() + '/../resources/dostoevsky.txt';
			var fPath2 = $jsb.getFullPath() + '/../resources/dostoevsky_copy.txt';
			this.profiler.probe('test14');
			FileSystem.copy(fPath1, fPath2);
			this.profiler.probe();
			$jsb.getLogger().info('profile: ' + this.profiler.dump());
		},

		test15: function(){
			// copy whole directory
			var fPath1 = FileSystem.getCurrentDirectory();
			var fPath2 = FileSystem.getUserDirectory() + 'jsbeans_copy_test';
			this.profiler.probe('test15');
			FileSystem.copy(fPath1, fPath2);
			this.profiler.probe();
			$jsb.getLogger().info('profile: ' + this.profiler.dump());
		},

		test16: function(){
			// remove whole directory
			var fPath = FileSystem.getUserDirectory() + 'jsbeans_copy_test';
			FileSystem.remove(fPath);
		},
	}
}