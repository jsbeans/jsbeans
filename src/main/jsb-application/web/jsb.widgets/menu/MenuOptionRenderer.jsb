/*
 * This file is the part of jsBeans, high-level JavaScript client-server framework.
 * The contents of this file are subject to the MIT Licence (MIT).
 * (c) aa@sis.ru, da@sis.ru, Special Information Systems, LLC, 2011-2019
 *
 * Настоящий файл является частью клиент-серверной JavaScript платформы.
 * Условия использования и распространения содержимого данного файла соответствуют программному обеспечению с открытыми исходными кодами и равнозначно MIT Licence (MIT).
 * Авторские права принадлежат aa@sis.ru, da@sis.ru, ООО СИС, 2011-2019гг.
 */

{
	$name: 'JSB.Widgets.MenuOptionRenderer',
	$parent: 'JSB.Widgets.Renderer',
	$client: {
		$require: ['css:MenuOptionRenderer.css'],
		$constructor: function(obj, opts){
			$base(obj, opts);
			this.addClass('menuOptionRenderer');
			
			this.icon = this.$('<div class="icon"></div>');
			this.append(this.icon);
			
			this.title = this.$('<div class="title"></div>');
			this.append(this.title);
			
			this.description = this.$('<div class="description"></div>');
			this.append(this.description);
			
			this.opts = JSB.merge(obj.getOptions()||{},opts);
			if(this.opts && this.opts.fixed){
				this.addClass('fixed');
			}

			this.update();
		},
		
		update: function(){
			var obj = this.getObject();
			this.title.text(obj.getTitle());
			this.description.text(obj.getDescription());
			
			if(this.opts.fixed){
				this.attr('title', obj.getDescription());
			}
			if(this.opts.icon){
				$this.icon.css('background-image', 'url(' + this.opts.icon + ')');
			}
		}
	},
	
	$server: {
		$require: 'JSB.Widgets.RendererRepository',
		$bootstrap: function(){
			RendererRepository.registerRenderer(this, 'JSB.Widgets.MenuOption');
		}
	}
}