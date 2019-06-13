/*
 * This file is the part of jsBeans, high-level JavaScript client-server framework.
 * The contents of this file are subject to the MIT License (MIT).
 * (c) aa@sis.ru, da@sis.ru, Special Information Systems, LLC, 2011-2019
 *
 * Настоящий файл является частью клиент-серверной JavaScript платформы.
 * Условия использования и распространения содержимого данного файла соответствуют программному обеспечению с открытыми исходными кодами и равнозначно MIT License (MIT).
 * Авторские права принадлежат aa@sis.ru, da@sis.ru, ООО СИС, 2011-2019гг.
 */

{
	$name: 'JSB.Widgets.Diagram.Joint',
	
	$client: {
		link: null,
		
		options: {
		},
		
		$constructor: function(link, opts){
			var self = this;
			$base();
			this.link = link;
			JSB().merge(true, this.options, opts);
		},
		
		getLink: function(){
			return this.link;
		},
		
		getPosition: function(){
			if(!this.options.position || !JSB().isFunction(this.options.position)){
				return null;
			}
			return this.options.position.call(this);
		}
		
	},
	
	$server: {}
}