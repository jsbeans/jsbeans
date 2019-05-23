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
	$name: 'JSB.Workspace.FolderNode',
	$parent: 'JSB.Workspace.EntryNode',
	$require: ['JSB.Widgets.Button',
	           'css:FolderNode.css'],
	$client: {
		$constructor: function(opts){
			var self = this;
			$base(opts);
			this.addClass('folderNode');
			
			this.renderer.append('<div class="childCount">(<span></span>)</div>');
			
			var createEntryBtn = new Button({
				cssClass: 'roundButton btnCreate btn10',
				tooltip: 'Создать объект',
				onClick: function(evt){
					$this.explorer.showCreateMenu(evt, true, this);
				}
			});
			$this.toolbox.append(createEntryBtn.getElement());
			
			this.subscribe('JSB.Workspace.Entry.updated', function(sender){
				if(sender != $this.getTargetEntry()){
					return;
				}
				$this.update();
			});
			
			this.update();
		},
		
		update: function(){
			var childCount = $this.getTargetEntry().getChildCount();
			$this.find('> .renderer > .childCount > span').text(childCount);
			if(childCount == 0){
				$this.find('> .renderer > .childCount').addClass('empty');
			} else {
				$this.find('> .renderer > .childCount').removeClass('empty');
			}
		}
	}
}