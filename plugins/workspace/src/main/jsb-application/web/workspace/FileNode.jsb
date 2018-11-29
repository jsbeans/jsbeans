{
	$name: 'JSB.Workspace.FileNode',
	$parent: 'JSB.Workspace.EntryNode',
	$client: {
		$constructor: function(opts){
			var self = this;
			$base(opts);
			$jsb.loadCss('FileNode.css');
			this.addClass('fileNode');
			
			this.uploadFile = this.$('<input type="file" style="display: none;" />');
			this.append(this.uploadFile);
			
			this.uploadFile.change(function(){
				if(this.files.length == 0){
					return;
				}
				var file = this.files[0];
				$this.getTargetEntry().server().uploadFile({data: file, size: file.size, name: file.name}, function(){
					$this.update();
				});
			});
		},
		
		collectMenuItems: function(){
			var items = $base();
			if(items.length > 0){
				items.push({
					key: 'menuSeparator',
					element: '<div class="separator"></div>',
					cssClass: 'menuSeparator',
					allowHover: false,
					allowSelect: false
				});
			}
			
			items.push({
				key: 'fileUpload',
				element: '<div class="icon"></div><div class="text">Обновить файл</div>',
				allowHover: true,
				allowSelect: true,
				callback: function(){
					$this.uploadFile.trigger('click');
				}
			});
			items.push({
				key: 'fileDownload',
				element: '<div class="icon"></div><div class="text">Скачать файл</div>',
				allowHover: true,
				allowSelect: true,
				callback: function(){
					$this.getTargetEntry().server().downloadFile(function(dh, fail){
						if(dh){
							dh.download();
						}
					});
				}
			});
			return items;
		},
		
		update: function(){}
	}
	
}