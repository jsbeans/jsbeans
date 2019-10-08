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
	$name:'JSB.Widgets.ItemList.View',
	$parent: 'JSB.Widgets.Control',
	$client: {
		$constructor: function(opts){
			var self = this;
			$base(opts);
			JSB.merge(true, this.options, opts);
		},
		
		options: {},
		container: null,
		
		getContainer: function(){
			return this.container;
		},
		
		activate: function(c){
			this.container = c;
			this.container.css({
				height: ''
			});
		},
		
		deactivate: function(){
			this.container = null;
		},
		
		isActive: function(){
			return this.container !== null;
		},
		
		update: function(){}
	}
}