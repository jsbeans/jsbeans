{
	$name: 'JSB.Workspace.UploadNode',
	$parent: 'JSB.Workspace.ExplorerNode',
	$require: ['JSB.Workspace.FolderNode'],
	$client: {
		$constructor: function(opts){
			var self = this;
			$base(opts);
			this.loadCss('UploadNode.css');
			this.addClass('uploadNode');
			
			this.icon = this.$('<div class="icon"></div>');
			this.append(this.icon);
			
			this.title = this.$('<span class="title"></span>').text(this.options.file.name);
			this.append(this.title);

			// check for folder
			var isDir = false;
			if(this.options.item){
				var item = this.options.item;
				if(item.isDirectory){
					isDir = true;
					JSB().deferUntil(function(){
						// change is node to directory
						var path = self.options.w.constructPathFromKey(self.treeNode.key);
						self.options.w.server().addCategory(path, function(desc){
							if(!desc){
								// internal error: folder already exists
								return;
							}
							var node = self.options.w.addTreeItem(desc, self.treeNode.key, true);
							self.options.w.sort();
							
							// proceed directory files
							var dirReader = item.createReader();
							dirReader.readEntries(function(entries) {
								for (var i = 0; i < entries.length; i++) {
									var chItem = entries[i];
									(function(item){
										if(item.isFile){
											item.file(function(file){
												var isFile = /\.((rdf)|(ttl)|(owl))/i.test(file.name);
												if(isFile){
													var uploadNode = new $class({
														file: file, 
														node: node, 
														item: item, 
														tree: self.options.tree,
														w: self.options.w
													});
													var curTreeNode = self.options.tree.addNode({
														key: JSB().generateUid(),
														element: uploadNode,
													}, node ? node.treeNode.key : null);
													uploadNode.treeNode = curTreeNode;
												}
											});
										} else if(item.isDirectory){
											var uploadNode = new $class({
												file: item, 
												node: node, 
												item: item, 
												tree: self.options.tree,
												w: self.options.w
											});
											var curTreeNode = self.options.tree.addNode({
												key: JSB().generateUid(),
												element: uploadNode,
											}, node ? node.treeNode.key : null);
											uploadNode.treeNode = curTreeNode;
										}
									})(chItem);
								}
							});
						});
					}, function(){
						return self.treeNode.key;
					});
				}
			}
			
			// proceed current file
			if(!isDir){
				var reader = new FileReader();
				reader.onload = function(){
					self.options.w.server().loadFromContent({
						category: self.options.node ? self.options.w.constructPathFromKey(self.options.node.treeNode.key) : '',
						name: self.options.file.name,
						content: reader.result
					}, function(ontoDesc){
						JSB().deferUntil(function(){
							if(ontoDesc.type == 'error'){
								self.addClass('error');
								self.getElement().attr('title', ontoDesc.error.message + ' ' + ontoDesc.error.fileName + '(' + ontoDesc.error.lineNumber + ')');
							} else {
								self.options.w.addTreeItem(ontoDesc, self.treeNode.key, true);
//								self.options.w.sort();
							}
						}, function(){
							return self.treeNode.key;
						});
					});
				}
				reader.readAsText(this.options.file);
			}
			
		},
		
		getName: function(){
			return this.options.file.name;
		}
		
	}
}