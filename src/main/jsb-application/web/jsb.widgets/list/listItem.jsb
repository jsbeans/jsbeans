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
	$name:'JSB.Widgets.ListItem',
	$parent: 'JSB.Widgets.Control',
	
	$client: {
		$require: ['css:itemList.css'],
		$constructor: function(opts){
			var self = this;
			$base(opts);
			this.addClass('_dwp_listItem');
			
			// add close btn
			if(this.options.close){
				this.closeBtn = this.$('<div class="_dwp_closeBtn"></div>');
				this.append(this.closeBtn);
				this.closeBtn.click(function(evt){
					if(self.list.options.readOnly){
						return;
					}
					if(self.options.onClose){
						var can = self.options.onClose.call(self, evt, function(can){
							if(can){
								self.deleteSelf();
								evt.stopPropagation();
							}
						});
						if(can){
							self.deleteSelf();
							evt.stopPropagation();
						}
					} else {
						self.deleteSelf();
						evt.stopPropagation();
					}
				});
				
			}
		},
		
		options: {
			onSelected: function(tgtObj){},
			close: true,
			allowHover: true,
			allowSelect: true
		},
		
		deleteSelf: function(){
			this.list.deleteItem(this.key);
			this.destroy();
		},
		
		viewChanged: function(viewName){
			console.log('viewChanged: ' + viewName);
		},
		
		getKey: function(){
			return this.key;
		}
	}
}