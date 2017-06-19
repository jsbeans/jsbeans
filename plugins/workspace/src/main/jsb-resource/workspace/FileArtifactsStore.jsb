{
	$name: 'JSB.Workspace.FileArtifactsStore',
	$server: {

        /// *** constants

	    HOME_PROPERTY: "workspace.home",
	    DEFAULT_BASE_DIRECTORY: ".workspace",


		$constructor: function(opts){
            /// ***java imports
            this.Arrays = Packages.java.util.Arrays;
            this.File = Packages.java.io.File;
            this.System = Packages.java.lang.System;
            this.BufferedWriter = Packages.java.io.BufferedWriter;
            this.FileWriter = Packages.java.io.FileWriter;
            this.Scanner = Packages.java.util.Scanner;

		    var opts = opts || {};
		    
		    this.home = opts.home || (function defaultStorageHome(){
                    if (this.System.getProperty(this.HOME_PROPERTY, "").length() > 0) {
                        return '' + this.System.getProperty(this.HOME_PROPERTY);
                    }
                    return '' + new this.File(this.System.getProperty("user.home"), this.DEFAULT_BASE_DIRECTORY).toString();
            }).apply(this);
		},

        /// *** public methods

		files: function(baseDirectory) {
		    var base = new this.File(this.absolutePath(baseDirectory));
            base.mkdirs();

            var it = this.Arrays.asList(base.listFiles()).iterator();
            var self = this;
		    return {
		        next: function(){
		            if (it.hasNext()) {
		                var file = it.next();
                        return self.relativePath(file.toString(), baseDirectory);
		            }
		        }
		    };
		},

		directories: function(baseDirectory) {
		    var base = new this.File(this.absolutePath(baseDirectory));
            base.mkdirs();

            var it = this.Arrays.asList(base.listFiles()).iterator();
            var self = this;
		    return {
		        next: function(){
		            if (it.hasNext()) {
		                var file = it.next();
		                if (file.isDirectory()) {
                            return self.relativePath(file.toString(), baseDirectory);
                        }
		            }
		        }
		    };
		},

		readAsText: function(path) {
		    var self = this;
		    return this._locked(path, function () {
                var file = new self.File(self.absolutePath(path));
                if (!file.exists()) {
                    throw new Error('File not not found ' + path);
                }
                
                var scanner = new self.Scanner(file).useDelimiter("\\Z");

                var data = '' + scanner.next();
                scanner.close();
                return data;
            });
		},

		readAsJson: function(path) {
		    return JSON.parse(this.readAsText(path));
		},

		readAsBinary: function(path) {
            throw new Error('UnsupportedOperationException');
		},

        writeAsText: function(path, content){
            var self = this;
		    this._locked(path, function () {
                var writer = null;
                try {
                    var file = new self.File(self.absolutePath(path));
                    if (file.getParentFile()) file.getParentFile().mkdirs();
                    writer = new self.BufferedWriter(new self.FileWriter(file));
                    if (typeof content === 'function') {
                        writer.write(content());
                    } else {
                        writer.write(content);
                    }

                } finally {
                    try {
                        if (writer != null)
                        writer.close();
                    } catch (e) { }
                }
            });
        },

        writeAsJson: function(path, json){
            this.writeAsText(path, JSON.stringify(json,0,2));
        },

		writeAsBinary: function(path) {
            throw new Error('UnsupportedOperationException');
		},

        remove: function(path) {
            var self = this;
		    return this._locked(path, function () {
                function deletePath(file) {
                    if (file.isDirectory()) {
                        var children = file.list();
                        for (var i in children) {
                            var success = deletePath(new self.File(file, children[i]));
                            if (!success) {
                                return false;
                            }
                        }
                    }
                    return !!file.delete(); // The directory is empty now and can be deleted.
                }

                var file = new self.File(self.absolutePath(path));
                if (file.isDirectory()) {
                    return deletePath(file);
                } else {
                    return !!file.delete();
                }
            });
        },

		exists: function(path) {
            var file = new this.File(this.absolutePath(path));
            return !!file.exists();
		},

		isDirectory: function(path) {
            var file = new this.File(this.absolutePath(path));
            return !!file.isDirectory();
		},

		subPath: function(base, child){
            return '' + (child ? new this.File(base, child).getPath(): base);
		},

		fullPath: function(path){
		    return '' + new this.File(this.home, path).getPath();
		},

		absolutePath: function(relativePath){
		    return '' + (relativePath
		            ? new this.File(this.home, relativePath).getPath()
		            : new this.File(this.home).getPath());
		},

		relativePath: function(absolutePath, baseDirectory) {
		    var baseFile = baseDirectory ? new this.File(this.home, baseDirectory) : new this.File(this.home);
		    var path = '' + baseFile.toURI().relativize(new this.File(absolutePath).toURI()).getPath();
		    return path;
		},


		/// *** protected

		_locked: function(id, func) {
            var locker = JSB().getLocker();
            var mtxName = 'ArtifactsStore:' + id;
            try {
                locker.lock(mtxName);
                return func.call(this);
            } finally {
                locker.unlock(mtxName);
            }
		},
	}
}