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
	$name: 'JSB.Workspace.SearchEditor',
	$parent: 'JSB.Widgets.Control',
	$require: {
		'Editor': 'JSB.Widgets.PrimitiveEditor'
	},
	$client: {
		$require: ['css:SearchEditor.css'],
		
		$constructor: function(opts){
			var self = this;
			$base(opts);
			this.addClass('searchEditor');
			
			this.editor = new Editor({
				onChange: function(txt){
					if(txt && txt.length > 0){
						$this.addClass('filled');
					} else {
						$this.removeClass('filled');
					}
					if(self.options.onChange){
						JSB.defer(function(){
							self.options.onChange.call(self, txt);
						}, 100, '_onChange' + self.getId());
					}
				}
			});
			this.append(this.editor);
			
			this.append(`#dot
				<div class="searchIcon"></div>
				<div class="clearBtn" title="Очистить поисковую строку"></div>
			`);
			
			this.find('.clearBtn').click(function(){
				self.clear();
			});
		},
		
		clear: function(){
			this.editor.setData('');
			$this.removeClass('filled');
			if(this.options.onChange){
				this.options.onChange.call(this, '');
			}
		}
	}
}