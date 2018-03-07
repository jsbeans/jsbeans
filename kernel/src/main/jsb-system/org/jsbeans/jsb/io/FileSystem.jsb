({
	$name: 'JSB.IO.FileSystem',
	$singleton: true,
	$globalize: 'FileSystem',
	
	$server: {
		$require: [
			'JSB.IO.Stream',
			'JSB.IO.TextStream',
			
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
			
			this.security = System.getSecurityManager();
		},
		
		_resolvePath: function(path) {
		    if($jsb.isNull(path) || !$jsb.isString(path)) {
		        throw new Error('Undefined path argument');
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
			            throw new Error('Unsupported mode argument: ' + options);
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
		            throw new Error('Unsupported options argument');
		        }
		    } else {
		        // run sanity check on user-provided options object
		        for (var key in options) {
		            if (!(key in optionsMask)) {
		                throw new Error('unsupported option: ' + key);
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
		        throw new Error("Cannot open a file for reading and writing at the same time");
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

		    if (binary) {
		        return new Stream(read ? Files.newInputStream(nioPath, nioOptions) : Files.newOutputStream(nioPath, nioOptions));
		    } else if (read || write || append) {
		    	return new TextStream(read ? Files.newInputStream(nioPath, nioOptions) : Files.newOutputStream(nioPath, nioOptions), options);
		    } else if (update) {
		        // FIXME botic: check for invalid options before returning a stream? See issue #270
		        throw new Error("Update not implemented yet");
		    }

		},
		
		read: function(path, options){
			options = options === undefined ? {} : this._checkOptions(options);
			options.read = true;
			options.write = false;
			var stream = this.open(path, options);
			try {
				return stream.read();
			} finally {
				stream.close();
			}
		},
		
		write: function(path, data, options){
			options = options === undefined ? {} : this._checkOptions(options);
			options.write = true;
			options.read = false;
			options.binary = $jsb.isArrayBuffer(data);
			var stream = this.open(path, options);
			try {
				stream.write(data);
				stream.flush();
			} finally {
				stream.close();
			}
		},
		
		exists: function(path) {
		    return Files.exists(this._resolvePath(path));
		},
		
		list: function(path, opts) {
		    var nioPath = this._resolvePath(path);
		    
		    opts = $jsb.merge({files: true, directories: true, links: true, recursive: false}, opts);

		    if (!Files.isDirectory(nioPath)) {
		        throw new Error('Expected directory: ' + path);
		    }

		    var files = [];
		    var dirStream = null;
		    try {
		    	dirStream = Files.newDirectoryStream(nioPath);
			    var dirIterator = dirStream.iterator();
			    while (dirIterator.hasNext()) {
			    	var file = String(dirIterator.next().getFileName());
			    	if(opts.files && opts.directories && opts.links){
			    		files.push(file);
			    	} else {
				    	var filePath = this.join(nioPath.toString(), file);
				    	if((opts.files && this.isFile(filePath))
				    		||(opts.directories && this.isDirectory(filePath))
				    		||(opts.links && this.isLink(filePath))){
				    		files.push(file);
				    	} 
			    	}
			        if(opts.recursive){
			        	var filePath = this.join(nioPath.toString(), file);
			        	if(this.isDirectory(filePath)){
			        		var arr = this.list(filePath, opts).map(function(p){return $this.join(file, p)});
			        		if(arr.length > 0){
			        			files = files.concat(arr);
			        		}
			        	}
			        }
			    }
		    } catch(e){
		    	return [];
		    } finally {
		    	if(dirStream){
		    		dirStream.close();		
		    	}
		    }

		    return files;
		},

		join: function() {
		    // filter out empty strings to avoid join("", "foo") -> "/foo"
		    var args = Array.prototype.filter.call(arguments, function(p) {
		        return p !== "" && p !== null && p !== undefined;
		    });

		    return String(Paths.get.apply(this, (args.length > 0 ? args : ["."])));
		},
		
		copy: function(from, to) {
		    var sourcePath = this._resolvePath(from);
		    var targetPath = this._resolvePath(to);
		    
		    if (String(targetPath) == String(sourcePath)) {
		        throw new Error("Source and target files are equal");
		    } else if (String(targetPath).indexOf(String(sourcePath)) == 0) {
		        throw new Error("Target is a child of source");
		    }
		    
		    if(Files.isDirectory(sourcePath)) {
		        // make target dir tree
		    	Files.createDirectories(targetPath);

		        var files = this.list(from);
		        for(var i = 0; i < files.length; i++) {
		        	var file = files[i];
		            var s = this.join(sourcePath.toString(), file);
		            var t = this.join(targetPath.toString(), file);
		            if (this.isLink(s)) {
		                this.createSymbolicLink(this.readLink(s), t);
		            } else {
		                this.copy(s, t);
		            }
		        }
		    } else {
		    	Files.copy(sourcePath, targetPath, [StandardCopyOption.REPLACE_EXISTING]);
		    }
		},
		
		move: function(from, to){
			var sourcePath = this._resolvePath(from);
		    var targetPath = this._resolvePath(to);
		    
		    Files.move(sourcePath, targetPath, [StandardCopyOption.REPLACE_EXISTING]);
		},
		
		createSymbolicLink: function(existing, link) {
		    return String(Files.createSymbolicLink(Paths.get(link), Paths.get(existing)));
		},

		createHardLink: function(existing, link) {
		    return String(Files.createLink(Paths.get(link), Paths.get(existing)));
		},
		
		readLink: function(path) {
		    // Throws an exception if there is no symbolic link at the given path or the link cannot be read.
		    if (!Files.isReadable(Paths.get(path))) {
		        throw new Error("Path " + path + " is not readable");
		    }

		    return Files.readSymbolicLink(this._resolvePath(path)).toString();
		},
		
		createDirectory: function(path){
		    if(!this.exists(path))
			    Files.createDirectory(Paths.get(path));
		},
		
		remove: function(path) {
		    var nioPath = this._resolvePath(path);

		    if (Files.isDirectory(nioPath)) {
		        Files.walkFileTree(nioPath, new FileVisitor({
		            visitFile: function (file, attrs) {
		                Files.delete(file);
		                return FileVisitResult.CONTINUE;
		            },
		            visitFileFailed: function(file, e) {
		                throw e;
		            },
		            preVisitDirectory: function() {
		                return FileVisitResult.CONTINUE;
		            },
		            postVisitDirectory: function (dir, e) {
		                if (e == null) {
		                    Files.delete(dir);
		                    return FileVisitResult.CONTINUE;
		                } else {
		                    throw e;
		                }
		            }
		        }));
		    } else {
		    	Files.delete(nioPath);
		    }
		},


		isDirectory: function(path) {
		    return Files.isDirectory(this._resolvePath(path));
		},
		
		isLink: function(path) {
		    return Files.isSymbolicLink(this._resolvePath(path));
		},

		isFile: function(path) {
		    return Files.isRegularFile(this._resolvePath(path));
		},
		
		isReadable: function(path) {
		    return Files.isReadable(this._resolvePath(path));
		},
		
		isWritable: function(path) {
		    return Files.isWritable(this._resolvePath(path));
		},
		
		
		getRelativePath: function(path, base){
			return '' + this._resolvePath(base).relativize(this._resolvePath(path)).toString();
		},

		getParentDirectory: function(path) {
		    return '' + (Paths.get(path).getParent() || Paths.get('.')).toString();
		},
		
		getCurrentDirectory: function(omitSeparator) {
		    return '' + this._resolvePath('' + System.getProperty('user.dir')).toString() + (omitSeparator ? '' : this.separator);
		},
		
		getUserDirectory: function(omitSeparator) {
		    return '' + this._resolvePath('' + System.getProperty('user.home')).toString() + (omitSeparator ? '' : this.separator);
		}


	}
})