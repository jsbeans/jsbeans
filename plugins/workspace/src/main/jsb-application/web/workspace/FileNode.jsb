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
	$name: 'JSB.Workspace.FileNode',
	$parent: 'JSB.Workspace.EntryNode',
	$client: {
		$require: ['css:FileNode.css'],
		$constructor: function(opts){
			var self = this;
			$base(opts);
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