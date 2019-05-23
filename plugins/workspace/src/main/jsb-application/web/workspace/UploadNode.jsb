/*
 * This file is the part of jsBeans, high-level JavaScript client-server framework.
 * The contents of this file are subject to the MIT License (MIT).
 * (c) aa@sis.ru, da@sis.ru, Special Information Systems, LLC, 2011-2019
 *
 * Настоящий файл является частью клиент-сервеной JavaScript платформы.
 * Условия использования и распространения содержимого данного файла соответствуют программному обеспечению с открытыми исходными кодами и равнозначно MIT License (MIT).
 * Авторские права принадлежат aa@sis.ru, da@sis.ru, ООО СИС, 2011-2019гг.
 */

{
	$name: 'JSB.Workspace.UploadNode',
	$parent: 'JSB.Workspace.ExplorerNode',
	$require: ['JSB.Workspace.FolderNode',
	           'css:UploadNode.css'],
	$client: {
		$constructor: function(opts){
			var self = this;
			$base(opts);
			this.addClass('uploadNode');
			
			this.icon = this.$('<div class="icon"></div>');
			this.append(this.icon);
			
			this.title = this.$('<span class="title"></span>').text(this.options.file.name);
			this.append(this.title);
		},
		
		getName: function(){
			return this.options.file.name;
		},
		
		execute: function(){
			var self = this;
			
			// check for folder
			var isDir = false;
			if(this.options.item){
				var item = this.options.item;
				if(item.isDirectory){
					isDir = true;
					// change is node to directory
					self.options.w.pushIgnoreSync();
					self.options.w.server().createNewEntry('JSB.Workspace.FolderEntry', {}, $this.getName(), $this.options.node ? $this.options.node.getTargetEntry() : null, function(desc){
						if(!desc){
							// internal error: folder already exists
							return;
						}
						var node = $this.options.w.addTreeItem(desc, $this.treeNode.key, true);
						$this.options.w.sort();
						
						// proceed directory files
						var dirReader = item.createReader();
						dirReader.readEntries(function(entries) {
							for (var i = 0; i < entries.length; i++) {
								var chItem = entries[i];
								(function(item){
									if(item.isFile){
										item.file(function(file){
											var uploadNode = new $class({
												file: file, 
												node: node, 
												item: item, 
												tree: self.options.tree,
												w: self.options.w,
												workspace: self.options.workspace
											});
											var curTreeNode = self.options.tree.addNode({
												key: JSB.generateUid(),
												element: uploadNode,
											}, node ? node.treeNode.key : null);
											uploadNode.treeNode = curTreeNode;
											uploadNode.execute();
										});
									} else if(item.isDirectory){
										var uploadNode = new $class({
											file: item, 
											node: node, 
											item: item, 
											tree: self.options.tree,
											w: self.options.w,
											workspace: self.options.workspace
										});
										var curTreeNode = self.options.tree.addNode({
											key: JSB().generateUid(),
											element: uploadNode,
										}, node ? node.treeNode.key : null);
										uploadNode.treeNode = curTreeNode;
										uploadNode.execute();
									}
								})(chItem);
							}
						});
						self.options.w.popIgnoreSync();
					});
					
				}
			}
			
			// proceed current file
			if(!isDir){
				self.options.w.pushIgnoreSync();
				self.options.workspace.server().uploadFile({
					parent: self.options.node ? self.options.node.getTargetEntry().getId() : null,
					name: self.options.file.name,
					content: self.options.file
				}, function(nDesc){
					if(nDesc.error){
						self.addClass('error');
						self.getElement().attr('title', nDesc.error.message + ' ' + nDesc.error.fileName + '(' + nDesc.error.lineNumber + ')');
					} else {
						self.options.w.addTreeItem(nDesc, self.treeNode.key, true);
					}
					self.options.w.popIgnoreSync();
				});
/*				
				debugger;
				JSB.getProvider().ajax( JSB.getProvider().getServerBase() + 'jsb?cmd=upload', this.options.file, function(res, obj){
					debugger;
				});
*/				
/*				
				var reader = new FileReader();
				reader.onload = function(){
					debugger;
					self.options.w.pushIgnoreSync();
					self.options.workspace.server().uploadFile({
						parent: self.options.node ? self.options.node.getTargetEntry().getId() : null,
						name: self.options.file.name,
						content: reader.result
					}, function(nDesc){
						if(nDesc.error){
							self.addClass('error');
							self.getElement().attr('title', nDesc.error.message + ' ' + nDesc.error.fileName + '(' + nDesc.error.lineNumber + ')');
						} else {
							self.options.w.addTreeItem(nDesc, self.treeNode.key, true);
						}
						self.options.w.popIgnoreSync();
					});
				}
				reader.readAsArrayBuffer(this.options.file); */
			}

		}
		
	}
}