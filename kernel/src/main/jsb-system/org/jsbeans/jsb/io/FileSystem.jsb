{
	$name: 'JSB.IO.FileSystem',
	$singleton: true,
	$globalize: 'FileSystem',
	
	$server: {
		$require: [
			'JSB.IO.Stream',
			
			'java:java.lang.System',
			'java:java.nio.file.Paths',
			'java:java.nio.file.Files',
			'java:java.nio.file.FileSystems',
			'java:java.nio.file.LinkOption',
			'java:java.nio.file.StandardOpenOption',
			'java:java.nio.file.StandardCopyOption',
			'java:java.nio.file.FileVisitor',
			'java:java.nio.file.FileVisitResult',
			
			'java:java.nio.file.attribute.FileTime',
			'java:java.nio.file.attribute.PosixFileAttributeView',
		],
		
		$constructor: function(){
			$base();
			this.fs = FileSystems.getDefault();
			this.separator = this.fs.getSeparator();
			this.separator_rx = this.separator == '/' ? new RegExp(this.separator): new RegExp(this.separator.replace("\\", "\\\\") + "|/");
		},
		
		_resolvePath: function(path) {
		    if($jsb.isNull(path) || !$jsb.isString(path)) {
		        throw 'undefined path argument';
		    }

		    return Paths.get(path).toAbsolutePath().normalize();
		},

	
		_checkOptions: function(options){
			var optionsMask = {
			    read: 1,
			    write: 1,
			    append: 1,
			    update: 1,
			    binary: 1,
			    exclusive: 1,
			    canonical: 1,
			    charset: 1
			};

			function applyMode(mode) {
			    var options = {};
			    for (var i = 0; i < mode.length; i++) {
			        switch (mode[i]) {
			        case 'r':
			            options.read = true;
			            break;
			        case 'w':
			            options.write = true;
			            break;
			        case 'a':
			            options.append = true;
			            break;
			        case '+':
			            options.update = true;
			            break;
			        case 'b':
			            options.binary = true;
			            break;
			        case 'x':
			            // FIXME botic: is this implemented?
			            options.exclusive = true;
			            break;
			        case 'c':
			            // FIXME botic: is this needed?
			            options.canonical = true;
			            break;
			        default:
			            throw "unsupported mode argument: " + options;
			        }
			    }
			    return options;
			}

			
		    if (!options) {
		        options = {};
		    } else if (typeof options != 'object') {
		        if (typeof options == 'string') {
		            // if options is a mode string convert it to options object
		            options = applyMode(options);
		        } else {
		            throw 'unsupported options argument';
		        }
		    } else {
		        // run sanity check on user-provided options object
		        for (var key in options) {
		            if (!(key in optionsMask)) {
		                throw "unsupported option: " + key;
		            }
		            options[key] = key == 'charset' ? String(options[key]) : Boolean(options[key]);
		        }
		    }
		    return options;

		},
		
		open: function(path, options){
			options = this._checkOptions(options);
			var nioPath = this._resolvePath(path);
			
		    var {read, write, append, update, binary, charset} = options;

		    if (read === true && write === true) {
		        throw "Cannot open a file for reading and writing at the same time";
		    }

		    if (!read && !write && !append && !update) {
		        read = true;
		    }

		    // configure the NIO options
		    var nioOptions = [];
		    if (append === true) {
		        nioOptions.push(StandardOpenOption.APPEND);
		    }
		    if (read === true) {
		        nioOptions.push(StandardOpenOption.READ);
		    }
		    if (write === true) {
		        nioOptions.push(StandardOpenOption.WRITE, StandardOpenOption.CREATE, StandardOpenOption.TRUNCATE_EXISTING);
		    }

		    var stream = new Stream(read ? Files.newInputStream(nioPath, nioOptions) : Files.newOutputStream(nioPath, nioOptions));
		    if (binary) {
		        return stream;
		    } else if (read || write || append) {
		        // if charset is undefined, TextStream will use utf8
//		        return new TextStream(stream, {charset: charset});
		    	return null;
		    } else if (update) {
		        // FIXME botic: check for invalid options before returning a stream? See issue #270
		        throw "update not yet implemented";
		    }

		}
		
	}
}